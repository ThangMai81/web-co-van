// Chạy một lần khi server Next.js khởi động (Node runtime).
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.NODE_ENV !== "production") return;
  const { startBackendWarmup } = await import("./lib/backendWarmup");
  startBackendWarmup();
}
