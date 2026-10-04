"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { saveSession } from "@/lib/auth";
import { StatusBanner } from "@/components/ui/StatusBanner";

type Mode = "login" | "register";

export function SignIn() {
  const [mode, setMode] = useState<Mode>("login");
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleGoogleSuccess(response: CredentialResponse) {
    setFormError(null);
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ credential: response.credential }),
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Đăng nhập Google thất bại");

      saveSession(data.user);
      setSuccess(true);
      setTimeout(() => router.push("/"), 1200);
    } catch (err) {
      setFormError("Không thể đăng nhập bằng Google. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (mode === "register") {
      const name = formData.get("name") as string;
      const confirmPassword = formData.get("confirmPassword") as string;

      if (password !== confirmPassword) {
        setFieldErrors({ confirmPassword: "Mật khẩu không khớp" });
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ name, email, password }),
          },
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Đăng ký thất bại");

        saveSession(data.user);
        setSuccess(true);
        setTimeout(() => router.push("/"), 1200);
      } catch (err) {
        setFieldErrors({
          email: err instanceof Error ? err.message : "Đăng ký thất bại",
        });
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
            credentials: "include",
            body: JSON.stringify({ email, password }),
          },
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Đăng nhập thất bại");

        saveSession(data.user);
        setSuccess(true);
        setTimeout(() => router.push("/"), 1200);
      } catch (err) {
        setFieldErrors({
          password: err instanceof Error ? err.message : "Đăng nhập thất bại",
        });
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <>
      <StatusBanner
        show={success}
        variant="success"
        message={
          mode === "login"
            ? "Đăng nhập thành công!"
            : "Tạo tài khoản thành công!"
        }
        onClose={() => setSuccess(false)}
      />
      <div className="grid h-svh overflow-hidden md:grid-cols-2">
        {/* Cột trái - ảnh, chỉ hiện từ md trở lên */}
        <div className="relative hidden h-full md:block">
          <Image
            src="/images/collaborate_team.jpg"
            alt="Sunshine Center"
            fill
            priority
            sizes="(min-width: 768px) 50vw, 0vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue via-blue/55 to-blue/10" />
          <div className="absolute inset-x-0 bottom-0 p-10 lg:p-14">
            <div className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-yellow">
              <span className="block h-px w-6 bg-yellow" />
              Sunshine Center
            </div>
            <h2 className="max-w-md font-display text-3xl font-bold leading-tight text-white lg:text-4xl">
              Đồng hành cùng hàng trăm học viên chinh phục những cột mốc mới.
            </h2>
            <p className="mt-4 max-w-sm text-sm text-white/90">
              Mỗi hành trình đều bắt đầu từ một bước đi đầu tiên.
            </p>
          </div>
        </div>

        {/* Cột phải - form, luôn gọn trong 1 màn hình, overflow-y-auto chỉ là lưới an toàn cho màn hình rất thấp */}
        <div className="flex h-full items-center justify-center overflow-y-auto bg-white px-6 py-4">
          <div className="w-full max-w-sm">
            <Link
              href="/"
              className="mb-3 flex items-center justify-center gap-2.5"
            >
              <Image
                src="/images/Sunshine_brand_without_slogan.png"
                alt="Sunshine Center"
                width={34}
                height={34}
              />
              <div className="text-left leading-tight">
                <div className="font-display text-base font-bold text-blue-900">
                  SUNSHINE CENTER
                </div>
                <div className="font-mono text-[9px] uppercase tracking-widest text-yellow text-center">
                  Values Create Brand
                </div>
              </div>
            </Link>

            <div className="rounded-md border border-blue/15 bg-white p-5 shadow-lg shadow-black/5">
              <div className="mb-4 flex rounded-full bg-blue/10 p-1">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setFormError(null);
                  }}
                  className={`flex-1 rounded-full py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
                    mode === "login"
                      ? "bg-yellow text-blue shadow-sm"
                      : "text-blue/50 hover:text-blue"
                  }`}
                >
                  Đăng nhập
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setFormError(null);
                  }}
                  className={`flex-1 rounded-full py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
                    mode === "register"
                      ? "bg-yellow text-blue shadow-sm"
                      : "text-blue/50 hover:text-blue"
                  }`}
                >
                  Đăng ký
                </button>
              </div>

              <h1 className="mb-3 font-display text-xl font-bold text-blue">
                {mode === "login" ? "Chào mừng trở lại" : "Tạo tài khoản mới"}
              </h1>

              <div className="mb-3 flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setFormError("Đăng nhập Google thất bại")}
                  text={mode === "login" ? "signin_with" : "signup_with"}
                  width="310"
                />
              </div>

              {loading && (
                <p className="mb-3 text-center text-xs text-blue/60">
                  Đang xử lý...
                </p>
              )}

              {formError && (
                <p className="mb-3 rounded-sm bg-red-500/10 px-3 py-1.5 text-xs text-red-600">
                  {formError}
                </p>
              )}

              <div className="mb-3 flex items-center gap-3">
                <div className="h-px flex-1 bg-blue/15" />
                <span className="font-mono text-[9px] uppercase tracking-wider text-blue/50">
                  Hoặc dùng email
                </span>
                <div className="h-px flex-1 bg-blue/15" />
              </div>

              <form
                onSubmit={handleFormSubmit}
                className="flex flex-col gap-2.5"
              >
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
                  error={fieldErrors.email}
                />

                {/* Ghép 2 ô mật khẩu thành 1 hàng khi đăng ký — tiết kiệm 1 dòng chiều cao */}
                {mode === "register" ? (
                  <div className="grid grid-cols-2 gap-2.5">
                    <Field
                      name="password"
                      label="Mật khẩu"
                      type="password"
                      placeholder="••••••••"
                      error={fieldErrors.password}
                    />
                    <Field
                      name="confirmPassword"
                      label="Nhập lại"
                      type="password"
                      placeholder="••••••••"
                      error={fieldErrors.confirmPassword}
                    />
                  </div>
                ) : (
                  <Field
                    name="password"
                    label="Mật khẩu"
                    type="password"
                    placeholder="••••••••"
                    error={fieldErrors.password}
                  />
                )}

                {mode === "login" && (
                  <div className="text-right">
                    <a
                      href="#"
                      className="font-mono text-xs text-blue/50 hover:text-yellow"
                    >
                      Quên mật khẩu?
                    </a>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 rounded-sm bg-yellow py-3 font-mono text-xs uppercase tracking-wider text-blue transition-colors hover:brightness-95 disabled:opacity-60"
                >
                  {mode === "login" ? "Đăng nhập" : "Tạo tài khoản"}
                </button>
              </form>

              <p className="mt-4 text-center text-xs text-blue/50">
                {mode === "login" ? (
                  <>
                    Chưa có tài khoản?{" "}
                    <button
                      type="button"
                      onClick={() => setMode("register")}
                      className="font-semibold text-yellow hover:underline"
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
                      className="font-semibold text-yellow hover:underline"
                    >
                      Đăng nhập
                    </button>
                  </>
                )}
              </p>
            </div>

            <p className="mt-3 text-center text-xs text-blue/30">
              <Link href="/" className="hover:text-yellow">
                ← Quay về trang chủ
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function Field({
  name,
  label,
  type,
  placeholder,
  error,
}: {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  error?: string;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-mono text-[9px] uppercase tracking-wider text-blue/60">
        {label}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required
        className={`rounded-sm border bg-white px-3 py-2.5 text-sm text-blue outline-none transition-colors focus:border-yellow ${
          error ? "border-red-400" : "border-blue/20"
        }`}
      />
      {error && (
        <span className="flex items-center gap-1 text-[11px] text-red-500">
          <span className="flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-full bg-red-500/10">
            <svg width="7" height="7" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6L18 18M18 6L6 18"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
          {error}
        </span>
      )}
    </label>
  );
}
