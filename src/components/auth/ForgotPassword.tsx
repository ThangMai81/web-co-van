"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { StatusBanner } from "@/components/ui/StatusBanner";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Có lỗi xảy ra");

      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <StatusBanner
        show={!!error}
        variant="error"
        message={error}
        onClose={() => setError("")}
      />
      <div className="grid h-svh overflow-hidden md:grid-cols-2">
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
              Đừng lo, mỗi vấp ngã nhỏ đều có cách quay lại.
            </h2>
            <p className="mt-4 max-w-sm text-sm text-white/90">
              Chỉ vài bước nữa, bạn sẽ truy cập lại được tài khoản của mình.
            </p>
          </div>
        </div>

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
                <div className="font-display text-base font-bold text-blue">
                  SUNSHINE CENTER
                </div>
                <div className="text-center font-mono text-[9px] uppercase tracking-widest text-yellow">
                  Values Create Brand
                </div>
              </div>
            </Link>

            <div className="rounded-md border border-blue/15 bg-white p-5 shadow-lg shadow-black/5">
              {sent ? (
                <div className="py-2 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-yellow/15">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M4 7l8 6 8-6M4 7v10a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2z"
                        stroke="#142850"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h1 className="mb-2 font-display text-xl font-bold text-blue">
                    Kiểm tra email của bạn
                  </h1>
                  <p className="text-sm text-blue/70">
                    Nếu email{" "}
                    <span className="font-semibold text-blue">{email}</span> tồn
                    tại trong hệ thống, chúng tôi đã gửi liên kết đặt lại mật
                    khẩu. Liên kết có hiệu lực trong 15 phút.
                  </p>
                  <p className="mt-3 text-xs text-blue/40">
                    Không thấy email? Kiểm tra thêm mục Spam/Quảng cáo trong hộp
                    thư.
                  </p>
                </div>
              ) : (
                <>
                  <h1 className="mb-2 font-display text-xl font-bold text-blue">
                    Quên mật khẩu?
                  </h1>
                  <p className="mb-5 text-sm text-blue/60">
                    Nhập email đã đăng ký, chúng tôi sẽ gửi liên kết để bạn đặt
                    lại mật khẩu.
                  </p>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <label className="flex flex-col gap-1">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-blue/60">
                        Email
                      </span>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="ban@email.com"
                        className="rounded-sm border border-blue/20 bg-white px-3 py-2.5 text-sm text-blue outline-none transition-colors focus:border-yellow"
                      />
                    </label>

                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-2 rounded-sm bg-yellow py-3 font-mono text-xs uppercase tracking-wider text-blue transition-colors hover:brightness-95 disabled:opacity-60"
                    >
                      {loading ? "Đang gửi..." : "Gửi liên kết đặt lại"}
                    </button>
                  </form>
                </>
              )}
            </div>

            <p className="mt-3 text-center text-xs text-blue/30">
              <Link href="/sign-in" className="hover:text-yellow">
                ← Quay lại đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
