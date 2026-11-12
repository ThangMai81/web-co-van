import { apiBaseUrl, getCachedApiJson } from "./apiCache";

// Các danh sách được nạp sẵn ngay khi server front-end khởi động, và làm mới định kỳ
// trong lúc front-end còn chạy. Việc gọi định kỳ cũng giữ back-end không "ngủ" khi
// trang web đang có người xem (Render Free cho ngủ sau 15 phút không có request).
const WARM_PATHS = [
  "/api/programs?",
  "/api/courses?",
  "/api/coaches",
  "/api/testimonials/featured",
  "/api/testimonials",
  "/api/videos",
];

const KEEP_WARM_INTERVAL_MS = 10 * 60_000;

async function warmOnce() {
  const base = apiBaseUrl();
  if (!base) return;
  // Đánh thức back-end trước (endpoint nhẹ, không chạm database).
  try {
    await fetch(`${base}/health`, { cache: "no-store", signal: AbortSignal.timeout(90_000) });
  } catch {
    // back-end có thể chưa có /health hoặc đang khởi động — vẫn thử nạp dữ liệu.
  }
  await Promise.allSettled(WARM_PATHS.map((path) => getCachedApiJson(path)));
}

let started = false;

export function startBackendWarmup() {
  if (started) return;
  started = true;
  void warmOnce();
  const timer = setInterval(() => void warmOnce(), KEEP_WARM_INTERVAL_MS);
  timer.unref?.();
}
