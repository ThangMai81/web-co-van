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
const DETAIL_429_DIAGNOSTIC_PATHS = {
  fansipan: "/api/programs/chinh-phuc-fansipan-noc-nha-dong-duong",
  course: "/api/courses/khai-tam-dinh-vi",
} as const;
const DETAIL_429_DIAGNOSTIC_MAX_WINDOW_MS = 30 * 60 * 1_000;
const DETAIL_429_DIAGNOSTIC_MAX_RECORDS = 3;
const DIAGNOSTIC_IMF_FIXDATE_PATTERN =
  /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), (0[1-9]|[12][0-9]|3[01]) (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) ([0-9]{4}) ([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]) GMT$/;
const DIAGNOSTIC_CONTENT_TYPE_PATTERN =
  /^(application\/json|application\/problem\+json|text\/html|text\/plain|application\/octet-stream)(?:[ \t]*;[ \t]*charset[ \t]*=[ \t]*(?:utf-8|"utf-8"))?$/i;

let detail429DiagnosticRecordCount = 0;

function parseDiagnosticUtcInstant(value: string | undefined): number | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(value)) {
    return null;
  }

  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return null;

  const canonical = new Date(timestamp).toISOString().replace(".000Z", "Z");
  return canonical === value ? timestamp : null;
}

function isDetail429DiagnosticActive(path: string): boolean {
  const target = process.env.DETAIL_429_DIAG_TARGET;
  if (target !== "fansipan" && target !== "course") return false;
  if (path !== DETAIL_429_DIAGNOSTIC_PATHS[target]) return false;

  const start = parseDiagnosticUtcInstant(
    process.env.DETAIL_429_DIAG_START_UTC,
  );
  const end = parseDiagnosticUtcInstant(process.env.DETAIL_429_DIAG_END_UTC);
  if (
    start === null ||
    end === null ||
    end <= start ||
    end - start > DETAIL_429_DIAGNOSTIC_MAX_WINDOW_MS
  ) {
    return false;
  }

  const now = Date.now();
  return start <= now && now < end;
}

function normalizeDiagnosticHeaderValue(
  value: string | null,
): string | "invalid" | null {
  if (value === null) return null;
  if (Array.from(value).length > 128) return "invalid";

  const normalized = value.replace(/^[ \t]+|[ \t]+$/g, "");
  if (
    normalized.length === 0 ||
    /[\u0000-\u001f\u007f-\u009f]/.test(normalized)
  ) {
    return "invalid";
  }
  return normalized;
}

function isCanonicalDiagnosticImfFixdate(value: string): boolean {
  const match = DIAGNOSTIC_IMF_FIXDATE_PATTERN.exec(value);
  if (!match) return false;

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const date = new Date(0);
  date.setUTCFullYear(
    Number(match[4]),
    months.indexOf(match[3]),
    Number(match[2]),
  );
  date.setUTCHours(Number(match[5]), Number(match[6]), Number(match[7]), 0);
  return date.toUTCString() === value;
}

function readDiagnosticResponseHeader(
  response: Response,
  name: "Rndr-Id" | "Retry-After" | "Date" | "Content-Type" | "CF-Ray",
): string | number | "invalid" | null {
  const value = normalizeDiagnosticHeaderValue(response.headers.get(name));
  if (value === null || value === "invalid") return value;

  switch (name) {
    case "Rndr-Id":
      return /^(?:[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}|[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/i.test(
        value,
      )
        ? value.toLowerCase()
        : "invalid";
    case "CF-Ray": {
      const match = /^([a-f0-9]{16})-([a-z]{3})$/i.exec(value);
      return match
        ? `${match[1].toLowerCase()}-${match[2].toUpperCase()}`
        : "invalid";
    }
    case "Retry-After":
      if (/^[0-9]+$/.test(value)) {
        const seconds = Number(value);
        return Number.isSafeInteger(seconds) && seconds <= 86_400
          ? seconds
          : "invalid";
      }
      return isCanonicalDiagnosticImfFixdate(value) ? value : "invalid";
    case "Date":
      return isCanonicalDiagnosticImfFixdate(value) ? value : "invalid";
    case "Content-Type": {
      const match = DIAGNOSTIC_CONTENT_TYPE_PATTERN.exec(value);
      return match ? match[1].toLowerCase() : "invalid";
    }
  }
  return "invalid";
}

function logDetail429Diagnostic(
  path: string,
  attempt: number,
  response: Response,
) {
  if (
    detail429DiagnosticRecordCount >= DETAIL_429_DIAGNOSTIC_MAX_RECORDS ||
    !isDetail429DiagnosticActive(path)
  ) {
    return;
  }

  detail429DiagnosticRecordCount += 1;
  const contentType = readDiagnosticResponseHeader(response, "Content-Type");

  try {
    console.warn("[detail-429-diagnostic]", {
      event: "detail-429-frontend-response",
      time: new Date().toISOString(),
      path,
      method: "GET",
      attempt,
      status: 429,
      headers: {
        "Rndr-Id": readDiagnosticResponseHeader(response, "Rndr-Id"),
        "Retry-After": readDiagnosticResponseHeader(response, "Retry-After"),
        Date: readDiagnosticResponseHeader(response, "Date"),
        "Content-Type": contentType,
        "CF-Ray": readDiagnosticResponseHeader(response, "CF-Ray"),
      },
    });
  } catch {
    // Optional diagnostics must not change the detail request behavior.
  }
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

      if (timedOut || Date.now() >= deadlineAt) {
        retryableFailure = { kind: "timeout" };
      } else if (response.status === 404) {
        return null;
      } else if (response.status >= 500) {
        retryableFailure = { kind: "http-5xx", status: response.status };
      } else if (!response.ok) {
        if (response.status === 429) {
          logDetail429Diagnostic(path, attempt, response);
        }
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
