"use client";

import { useState, type CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lock, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { saveSession } from "@/lib/auth";
import { StatusBanner } from "@/components/ui/StatusBanner";
import styles from "./SignIn.module.css";

type Mode = "login" | "register";

const delay = (ms: number) =>
  ({ ["--delay"]: `${ms}ms` }) as unknown as CSSProperties;

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
        <div className="relative hidden h-full overflow-hidden md:block">
          <Image
            src="/images/collaborate_team.jpg"
            alt="Sunshine Center"
            fill
            priority
            sizes="(min-width: 768px) 50vw, 0vw"
            className={`${styles.photo} object-cover`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue via-blue/55 to-blue/10" />
          <div aria-hidden="true" className={`${styles.glowOrb} right-[12%] top-[14%] h-56 w-56`} />
          <div aria-hidden="true" className={`${styles.glowOrb} left-[8%] top-[42%] h-32 w-32`} />
          <div className="absolute inset-x-0 bottom-0 p-10 lg:p-14">
            <div className="mb-4 flex items-center gap-3 font-mono text-sm uppercase tracking-widest text-yellow">
              <span className={styles.rule} style={delay(300)} />
              <span className={styles.fadeUp} style={delay(450)}>Sunshine Center</span>
            </div>
            <h2 className="max-w-md font-display text-3xl font-bold leading-tight text-white lg:text-4xl">
              <span className={styles.line}>
                <span style={delay(650)}>Đồng hành cùng hàng trăm học viên</span>
              </span>
              <span className={styles.line}>
                <span style={delay(820)}>chinh phục những cột mốc mới.</span>
              </span>
            </h2>
            <p className={`${styles.fadeUp} mt-4 max-w-sm text-sm text-white/90`} style={delay(1150)}>
              Mỗi hành trình đều bắt đầu từ một bước đi đầu tiên.
            </p>
            <div className="mt-8 border-t border-white/15 pt-6">
              <span className={styles.taglineRule} style={delay(1400)} />
              <p className={`${styles.fadeUp} mt-3 font-display text-lg font-bold text-yellow`} style={delay(1550)}>
                Khai Tâm Mở Lối
              </p>
              <p className={`${styles.fadeUp} mt-1 text-sm text-white/75`} style={delay(1700)}>
                Tìm lại chính mình, chạm đỉnh vinh quang
              </p>
            </div>
          </div>
        </div>

        {/* Cột phải - form, luôn gọn trong 1 màn hình, overflow-y-auto chỉ là lưới an toàn cho màn hình rất thấp */}
        <div className="relative isolate flex h-full items-center justify-center overflow-y-auto bg-cream px-6 py-4">
          <span aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-yellow/20 blur-3xl" />
          <span aria-hidden="true" className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-blue/10 blur-3xl" />
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgb(20_40_80/0.07)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]" />
          <div className="relative w-full max-w-sm">
            <Link
              href="/"
              className={`${styles.fadeUp} mb-3 flex items-center justify-center gap-2.5`}
              style={delay(150)}
            >
              <Image
                src="/images/Sunshine_brand_without_slogan.png"
                alt="Sunshine Center"
                width={34}
                height={34}
              />
              <div className="text-left leading-tight">
                <div className="font-display text-base font-bold text-blue">
                  SUNSHINE CENTER
                </div>
                <div className="font-mono text-[9px] uppercase tracking-widest text-yellow text-center">
                  Values Create Brand
                </div>
              </div>
            </Link>

            <div className={`${styles.card} rounded-2xl border border-blue/10 bg-white/95 p-6 shadow-2xl shadow-blue/10 backdrop-blur`}>
              <div className={`${styles.tabs} mb-4 flex rounded-full bg-blue/10 p-1`}>
                <span aria-hidden="true" className={styles.tabPill} data-mode={mode} />
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setFormError(null);
                  }}
                  className={`flex-1 rounded-full py-2 font-mono text-xs uppercase tracking-wider transition-colors ${
                    mode === "login"
                      ? "text-blue"
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
                      ? "text-blue"
                      : "text-blue/50 hover:text-blue"
                  }`}
                >
                  Đăng ký
                </button>
              </div>

              <h1 key={mode} className={`${styles.heading} mb-3 font-display text-xl font-bold text-blue`}>
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
                <p className="mb-3 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs text-red-600">
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
                    className={styles.fieldEnter}
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
                      className={styles.fieldEnter}
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
                    <Link
                      href="/forgot-password"
                      className="font-mono text-xs text-blue/50 hover:text-yellow"
                    >
                      Quên mật khẩu?
                    </Link>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`${styles.submit} mt-1 rounded-full bg-yellow py-3 font-bold shadow-md shadow-yellow/30 font-mono text-xs uppercase tracking-wider text-blue transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-yellow/30 disabled:opacity-60`}
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

            <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] font-medium text-blue/50">
              <li className="inline-flex items-center gap-1.5"><ShieldCheck size={13} className="text-yellow" aria-hidden="true" />Thông tin được bảo mật</li>
              <li className="inline-flex items-center gap-1.5"><Lock size={13} className="text-yellow" aria-hidden="true" />Kết nối mã hoá</li>
            </ul>

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
  className = "",
}: {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  error?: string;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1 ${className}`.trim()}>
      <span className="font-mono text-[9px] uppercase tracking-wider text-blue/60">
        {label}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required
        className={`rounded-xl border bg-cream/40 px-3.5 py-2.5 text-sm text-blue outline-none transition focus:border-yellow focus:bg-white focus:ring-4 focus:ring-yellow/20 ${
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
