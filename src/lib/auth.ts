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
      credentials: "include", // để browser gửi cookie lên, server mới clear đúng cookie
    });
  } catch {
    // client đã tự xóa session rồi, lỗi gọi API logout không quan trọng
  }
}
