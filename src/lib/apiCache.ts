// Bộ nhớ đệm phía server cho dữ liệu công khai lấy từ back-end (chương trình, khóa học, coach, ...).
//
// Cách hoạt động ("stale-while-revalidate"):
// - Dữ liệu còn mới (< FRESH_MS): trả ngay, không gọi back-end.
// - Dữ liệu đã cũ: vẫn trả ngay bản cũ cho người xem, đồng thời làm mới ở nền.
// - Back-end đang ngủ / lỗi khi làm mới: tiếp tục dùng bản cũ thay vì hiện trang lỗi.
// - Chưa có dữ liệu: mới phải chờ back-end.
//
// Bộ nhớ nằm trong tiến trình Node của front-end, nên sẽ trống lại khi server khởi động lại;
// `backendWarmup` sẽ nạp sẵn các danh sách chính ngay lúc khởi động.

const FRESH_MS = 60_000;
const MAX_ENTRIES = 300;
const DEFAULT_TIMEOUT_MS = 45_000; // đủ cho back-end Render Free thức dậy (~1 phút) ở lần đầu

type Entry = { value: unknown; at: number };

type CacheState = {
  store: Map<string, Entry>;
  inflight: Map<string, Promise<unknown>>;
};

const globalKey = "__sunshineApiCache";
const state: CacheState =
  ((globalThis as Record<string, unknown>)[globalKey] as CacheState | undefined) ??
  ((globalThis as Record<string, unknown>)[globalKey] = {
    store: new Map(),
    inflight: new Map(),
  } satisfies CacheState) as CacheState;

function remember(key: string, value: unknown) {
  state.store.delete(key);
  state.store.set(key, { value, at: Date.now() });
  while (state.store.size > MAX_ENTRIES) {
    const oldest = state.store.keys().next().value;
    if (oldest === undefined) break;
    state.store.delete(oldest);
  }
}

function load<T>(key: string, loader: () => Promise<T>): Promise<T> {
  const running = state.inflight.get(key) as Promise<T> | undefined;
  if (running) return running;
  const promise = loader()
    .then((value) => {
      remember(key, value);
      return value;
    })
    .finally(() => {
      state.inflight.delete(key);
    });
  state.inflight.set(key, promise);
  return promise;
}

/**
 * Lấy giá trị qua bộ nhớ đệm. `loader` phải ném lỗi khi thất bại (để không lưu kết quả hỏng).
 */
export async function swrCached<T>(
  key: string,
  loader: () => Promise<T>,
  freshMs = FRESH_MS,
): Promise<T> {
  const entry = state.store.get(key);
  if (entry) {
    if (Date.now() - entry.at > freshMs) {
      // Làm mới ở nền; lỗi thì giữ bản cũ.
      load(key, loader).catch(() => undefined);
    }
    return entry.value as T;
  }
  return load(key, loader);
}

export function apiBaseUrl(): string | null {
  const url = process.env.NEXT_PUBLIC_API_URL?.trim();
  return url ? url.replace(/\/+$/, "") : null;
}

/** GET JSON từ back-end, ném lỗi nếu mạng lỗi / quá thời gian / mã khác 200. */
export async function fetchApiJson(
  path: string,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<unknown> {
  const base = apiBaseUrl();
  if (!base) throw new Error("NEXT_PUBLIC_API_URL is not set");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${base}${path}`, {
      cache: "no-store",
      signal: controller.signal,
    });
    if (res.status !== 200) throw new Error(`HTTP ${res.status} for ${path}`);
    return (await res.json()) as unknown;
  } finally {
    clearTimeout(timer);
  }
}

/** GET JSON công khai qua bộ nhớ đệm (khóa = đường dẫn kèm query). */
export function getCachedApiJson(path: string): Promise<unknown> {
  return swrCached(`json:${path}`, () => fetchApiJson(path));
}
