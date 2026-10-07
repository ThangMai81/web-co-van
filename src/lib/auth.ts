export type StoredUser = {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
};

const USER_KEY = "user";

export function saveSession(user: StoredUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("authchange"));
}

export function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export async function clearSession() {
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event("authchange"));

  try {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch {
    // bỏ qua, client đã tự xóa session rồi
  }
}

// Hỏi backend "tôi đang là ai" dựa theo cookie httpOnly, tự đồng bộ lại localStorage.
// Gọi hàm này lúc app khởi động để tự động đăng nhập nếu cookie vẫn còn hợp lệ,
// kể cả khi localStorage trống (xóa cache, đổi trình duyệt cùng máy, v.v.)
export async function hydrateSession(): Promise<StoredUser | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      credentials: "include",
    });

    if (!res.ok) {
      // Cookie hết hạn hoặc không hợp lệ -> dọn sạch localStorage cho khớp trạng thái thật
      localStorage.removeItem(USER_KEY);
      window.dispatchEvent(new Event("authchange"));
      return null;
    }

    const data = await res.json();
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    window.dispatchEvent(new Event("authchange"));
    return data.user;
  } catch {
    // Lỗi mạng -> giữ nguyên trạng thái localStorage hiện có, không xóa vội
    return getStoredUser();
  }
}
