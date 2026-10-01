import { clearSession } from "./auth";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
    ...options,
    credentials: "include", // luôn gửi cookie httpOnly kèm request
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (res.status === 401) {
    await clearSession(); // cookie hết hạn hoặc chưa đăng nhập -> dọn session phía client
  }

  return res;
}
