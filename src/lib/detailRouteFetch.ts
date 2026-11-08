// Server-side helper imported only by the course and program Server Components.
type FailureKind =
  | "network"
  | "timeout"
  | "http-5xx"
  | "non-json"
  | "invalid-data"
  | "http-client"
  | "invalid-url"
  | "deadline";

type Failure = {
  kind: FailureKind;
  status?: number;
};

type DetailDataGuard<T> = (value: unknown) => value is T;

const MAX_ATTEMPTS = 4;
const TOTAL_BUDGET_MS = 30_000;
const PER_ATTEMPT_TIMEOUT_MS = 8_000;
const ATTEMPT_START_OFFSETS_MS = [0, 1_000, 5_000, 20_000] as const;
const DETAIL_429_PASSIVE_PATH =
  "/api/programs/chinh-phuc-fansipan-noc-nha-dong-duong";
const DETAIL_429_PASSIVE_MAX_DURATION_MS = 4 * 60 * 60 * 1000;
const DETAIL_429_PASSIVE_MAX_RECORDS = 3;
const DETAIL_429_PASSIVE_RNDR_ID_PATTERN =
  /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;
let detail429PassiveRecords = 0;

function parseDetail429PassiveUtc(value: string | undefined): number | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value)) {
    return null;
  }

  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return null;

  const canonical = new Date(timestamp).toISOString().replace(/\.000Z$/, "Z");
  return canonical === value ? timestamp : null;
}

function readDetail429PassiveWindow() {
  if (process.env.DETAIL_429_PASSIVE_TARGET !== "fansipan") return null;

  const startAt = parseDetail429PassiveUtc(
    process.env.DETAIL_429_PASSIVE_START_UTC,
  );
  const endAt = parseDetail429PassiveUtc(
    process.env.DETAIL_429_PASSIVE_END_UTC,
  );

  if (
    startAt === null ||
    endAt === null ||
    endAt <= startAt ||
    endAt - startAt > DETAIL_429_PASSIVE_MAX_DURATION_MS
  ) {
    return null;
  }

  return { startAt, endAt };
}

function validatedDetail429PassiveRndrId(value: string | null) {
  if (value === null) return null;

  const trimmed = value.replace(/^[\t ]+|[\t ]+$/g, "");
  if (
    trimmed.length === 0 ||
    trimmed.length > 128 ||
    /[\u0000-\u001f\u007f]/.test(trimmed) ||
    !DETAIL_429_PASSIVE_RNDR_ID_PATTERN.test(trimmed)
  ) {
    return "invalid";
  }

  return trimmed.toLowerCase();
}

function recordPassiveDetail429(path: string, response: Response, attempt: number) {
  if (path !== DETAIL_429_PASSIVE_PATH || response.status !== 429) return;

  const window = readDetail429PassiveWindow();
  if (!window || detail429PassiveRecords >= DETAIL_429_PASSIVE_MAX_RECORDS) {
    return;
  }

  const capturedAt = Date.now();
  if (capturedAt < window.startAt || capturedAt >= window.endAt) return;

  detail429PassiveRecords += 1;
  console.warn("[detail-429-passive]", {
    timeUtc: new Date(capturedAt).toISOString(),
    path: DETAIL_429_PASSIVE_PATH,
    method: "GET",
    attempt,
    status: 429,
    rndrId: validatedDetail429PassiveRndrId(response.headers.get("Rndr-Id")),
  });
}

class DetailRouteFetchError extends Error {
  constructor(readonly failure: Failure) {
    super("Unable to load detail data.");
    this.name = "DetailRouteFetchError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasDataProperty(
  value: unknown,
): value is Record<string, unknown> & { data: unknown } {
  return (
    isRecord(value) &&
    Object.prototype.hasOwnProperty.call(value, "data")
  );
}

function logFailure(
  level: "warn" | "error",
  path: string,
  attempt: number,
  failure: Failure,
) {
  console[level]("[detail-route-fetch]", {
    path,
    attempt,
    kind: failure.kind,
    ...(failure.status === undefined ? {} : { status: failure.status }),
  });
}

function wait(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export async function fetchDetailRouteData<T>(
  endpoint: string,
  isExpectedData: DetailDataGuard<T>,
): Promise<T | null> {
  let requestUrl: string;
  let path: string;

  try {
    const parsed = new URL(endpoint);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error("Unsupported protocol");
    }
    requestUrl = parsed.toString();
    path = parsed.pathname;
  } catch {
    logFailure("error", "[invalid-url]", 0, { kind: "invalid-url" });
    throw new DetailRouteFetchError({ kind: "invalid-url" });
  }

  const startedAt = Date.now();
  const deadlineAt = startedAt + TOTAL_BUDGET_MS;
  let attemptsMade = 0;
  let lastFailure: Failure = { kind: "deadline" };

  for (let index = 0; index < MAX_ATTEMPTS; index += 1) {
    const attempt = index + 1;
    const scheduledStart = startedAt + ATTEMPT_START_OFFSETS_MS[index];
    const delayMs = Math.min(
      Math.max(0, scheduledStart - Date.now()),
      Math.max(0, deadlineAt - Date.now()),
    );

    if (delayMs > 0) await wait(delayMs);
    if (Date.now() >= deadlineAt) {
      lastFailure = { kind: "deadline" };
      break;
    }

    const remainingMs = deadlineAt - Date.now();
    const controller = new AbortController();
    let timedOut = false;
    const timeoutId = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, Math.min(PER_ATTEMPT_TIMEOUT_MS, remainingMs));
    attemptsMade = attempt;

    let retryableFailure: Failure | null = null;

    try {
      const response = await fetch(requestUrl, {
        method: "GET",
        cache: "no-store",
        signal: controller.signal,
      });

      recordPassiveDetail429(path, response, attempt);

      if (timedOut || Date.now() >= deadlineAt) {
        retryableFailure = { kind: "timeout" };
      } else if (response.status === 404) {
        return null;
      } else if (response.status >= 500) {
        retryableFailure = { kind: "http-5xx", status: response.status };
      } else if (!response.ok) {
        throw new DetailRouteFetchError({
          kind: "http-client",
          status: response.status,
        });
      } else {
        let payload: unknown = undefined;
        try {
          payload = await response.json();
        } catch {
          retryableFailure = {
            kind: timedOut ? "timeout" : "non-json",
            status: response.status,
          };
        }

        if (!retryableFailure) {
          if (timedOut || Date.now() >= deadlineAt) {
            retryableFailure = { kind: "timeout", status: response.status };
          } else if (
            !hasDataProperty(payload) ||
            !isExpectedData(payload.data)
          ) {
            throw new DetailRouteFetchError({
              kind: "invalid-data",
              status: response.status,
            });
          } else {
            return payload.data;
          }
        }
      }
    } catch (error) {
      if (error instanceof DetailRouteFetchError) {
        logFailure("error", path, attempt, error.failure);
        throw error;
      }

      retryableFailure = {
        kind: timedOut ? "timeout" : "network",
      };
    } finally {
      clearTimeout(timeoutId);
      controller.abort();
    }

    if (retryableFailure) {
      lastFailure = retryableFailure;
      logFailure("warn", path, attempt, retryableFailure);
    }
  }

  console.error("[detail-route-fetch] exhausted", {
    path,
    attempts: attemptsMade,
    elapsedMs: Date.now() - startedAt,
    kind: lastFailure.kind,
    ...(lastFailure.status === undefined
      ? {}
      : { status: lastFailure.status }),
    deadlineExceeded: Date.now() >= deadlineAt,
  });
  throw new DetailRouteFetchError(lastFailure);
}
