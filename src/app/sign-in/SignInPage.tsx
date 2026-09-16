"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { saveSession } from "@/lib/auth";

type Mode = "login" | "register";

export function SignIn() {
  const [mode, setMode] = useState<Mode>("login");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleGoogleSuccess(response: CredentialResponse) {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ credential: response.credential }),
        },
      );

      if (!res.ok) throw new Error("Đăng nhập Google thất bại");

      const data = await res.json();
      saveSession(data.accessToken, data.user);
      router.push("/");
    } catch (err) {
      setError("Không thể đăng nhập bằng Google. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (mode === "register") {
      const name = formData.get("name") as string;
      const confirmPassword = formData.get("confirmPassword") as string;

      if (password !== confirmPassword) {
        setError("Mật khẩu nhập lại không khớp");
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
          },
        );

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Đăng ký thất bại");
        }

        saveSession(data.accessToken, data.user);
        router.push("/");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Đăng ký thất bại");
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          },
        );

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Đăng nhập thất bại");
        }

        saveSession(data.accessToken, data.user);
        router.push("/");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Đăng nhập thất bại");
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className="grid h-svh md:grid-cols-2">
      <div className="relative hidden h-full md:block">
        <Image
          src="/images/collaborate_team.jpg"
          alt="Sunshine Center"
          fill
          priority
          sizes="(min-width: 768px) 50vw, 0vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/10" />
        <div className="absolute inset-x-0 bottom-0 p-10 lg:p-14">
          <div className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-sun">
            <span className="block h-px w-6 bg-sun" />
            Sunshine Center
          </div>
          <h2 className="max-w-md font-display text-3xl font-bold leading-tight text-white lg:text-4xl">
            Đồng hành cùng hàng trăm học viên chinh phục những cột mốc mới.
          </h2>
          <p className="mt-4 max-w-sm text-sm text-white">
            Mỗi hành trình đều bắt đầu từ một bước đi đầu tiên.
          </p>
        </div>
      </div>

      <div className="flex h-full items-center justify-center overflow-y-auto bg-cream px-6 py-16">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-8 flex items-center justify-center gap-3"
          >
            <Image
              src="/images/Sunshine_brand.png"
              alt="Sunshine Center"
              width={44}
              height={44}
            />
            <div className="text-left leading-tight">
              <div className="font-display text-lg font-bold text-ink">
                Sunshine Center
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-sun">
                Values Create Brand
              </div>
            </div>
          </Link>

          <div className="rounded-md border border-sage/30 bg-paper p-8 shadow-lg shadow-black/10">
            <div className="mb-8 flex rounded-full bg-sage/15 p-1">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                }}
                className={`flex-1 rounded-full py-2.5 font-mono text-xs uppercase tracking-wider transition-colors ${
                  mode === "login"
                    ? "bg-sun text-ink shadow-sm"
                    : "text-ink/60 hover:text-ink"
                }`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError(null);
                }}
                className={`flex-1 rounded-full py-2.5 font-mono text-xs uppercase tracking-wider transition-colors ${
                  mode === "register"
                    ? "bg-sun text-ink shadow-sm"
                    : "text-ink/60 hover:text-ink"
                }`}
              >
                Đăng ký
              </button>
            </div>

            <h1 className="mb-6 font-display text-2xl font-bold text-ink">
              {mode === "login" ? "Chào mừng trở lại" : "Tạo tài khoản mới"}
            </h1>

            <div className="mb-6 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError("Đăng nhập Google thất bại")}
                text={mode === "login" ? "signin_with" : "signup_with"}
                width="336"
              />
            </div>

            {loading && (
              <p className="mb-4 text-center text-xs text-sage">
                Đang xử lý...
              </p>
            )}

            {error && (
              <p className="mb-4 rounded-sm bg-crimson/10 px-4 py-2 text-sm text-crimson">
                {error}
              </p>
            )}

            <div className="mb-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-sage/30" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-sage">
                Hoặc dùng email
              </span>
              <div className="h-px flex-1 bg-sage/30" />
            </div>

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              {mode === "register" && (
                <Field
                  name="name"
                  label="Họ và tên"
                  type="text"
                  placeholder="Nguyễn Văn A"
                />
              )}

              <Field
                name="email"
                label="Email"
                type="email"
                placeholder="ban@email.com"
              />

              <Field
                name="password"
                label="Mật khẩu"
                type="password"
                placeholder="••••••••"
              />

              {mode === "register" && (
                <Field
                  name="confirmPassword"
                  label="Nhập lại mật khẩu"
                  type="password"
                  placeholder="••••••••"
                />
              )}

              {mode === "login" && (
                <div className="text-right">
                  <a
                    href="#"
                    className="font-mono text-xs text-sage hover:text-sun"
                  >
                    Quên mật khẩu?
                  </a>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 rounded-sm bg-sun py-3.5 font-mono text-xs uppercase tracking-wider text-ink transition-colors hover:brightness-90 disabled:opacity-60"
              >
                {mode === "login" ? "Đăng nhập" : "Tạo tài khoản"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-ink/60">
              {mode === "login" ? (
                <>
                  Chưa có tài khoản?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="font-semibold text-sun hover:underline"
                  >
                    Đăng ký ngay
                  </button>
                </>
              ) : (
                <>
                  Đã có tài khoản?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="font-semibold text-sun hover:underline"
                  >
                    Đăng nhập
                  </button>
                </>
              )}
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-ink/40">
            <Link href="/" className="hover:text-sun">
              ← Quay về trang chủ
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  name,
  label,
  type,
  placeholder,
}: {
  name: string;
  label: string;
  type: string;
  placeholder: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[10px] uppercase tracking-wider text-sage">
        {label}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required
        className="rounded-sm border border-sage/40 bg-cream px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-sun"
      />
    </label>
  );
}
