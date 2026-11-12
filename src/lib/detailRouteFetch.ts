// Server-side helper imported only by the course and program Server Components.
import { swrCached } from "./apiCache";
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
const TOTAL_BUDGET_MS = 55_000; // back-end Render Free cần khoảng 1 phút để thức dậy
const PER_ATTEMPT_TIMEOUT_MS = 20_000;
const ATTEMPT_START_OFFSETS_MS = [0, 2_000, 22_000, 40_000] as const;

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

/**
 * Lấy dữ liệu trang chi tiết qua bộ nhớ đệm phía server: lần xem sau trả ngay,
 * và khi back-end đang khởi động/lỗi thì dùng bản đã lưu thay vì hiện trang lỗi.
 */
export async function fetchDetailRouteData<T>(
  endpoint: string,
  isExpectedData: DetailDataGuard<T>,
): Promise<T | null> {
  return swrCached(`detail:${endpoint}`, () =>
    fetchDetailRouteDataUncached(endpoint, isExpectedData),
  );
}

async function fetchDetailRouteDataUncached<T>(
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
