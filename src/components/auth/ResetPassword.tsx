"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { StatusBanner } from "@/components/ui/StatusBanner";

export function ResetPassword({ token }: { token: string }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        },
      );

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Không thể đặt lại mật khẩu");

      setSuccess(true);
      setTimeout(() => router.push("/sign-in"), 1800);
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
              Một mật khẩu mới, một khởi đầu mới.
            </h2>
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
              {success ? (
                <div className="py-2 text-center">
                  <h1 className="mb-2 font-display text-xl font-bold text-blue">
                    Thành công!
                  </h1>
                  <p className="text-sm text-blue/70">
                    Mật khẩu đã được đặt lại. Đang chuyển bạn tới trang đăng
                    nhập...
                  </p>
                </div>
              ) : (
                <>
                  <h1 className="mb-2 font-display text-xl font-bold text-blue">
                    Đặt mật khẩu mới
                  </h1>
                  <p className="mb-5 text-sm text-blue/60">
                    Nhập mật khẩu mới cho tài khoản của bạn.
                  </p>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <label className="flex flex-col gap-1">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-blue/60">
                        Mật khẩu mới
                      </span>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        placeholder="••••••••"
                        className="rounded-sm border border-blue/20 bg-white px-3 py-2.5 text-sm text-blue outline-none transition-colors focus:border-yellow"
                      />
                    </label>

                    <label className="flex flex-col gap-1">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-blue/60">
                        Nhập lại mật khẩu
                      </span>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={6}
                        placeholder="••••••••"
                        className="rounded-sm border border-blue/20 bg-white px-3 py-2.5 text-sm text-blue outline-none transition-colors focus:border-yellow"
                      />
                    </label>

                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-2 rounded-sm bg-yellow py-3 font-mono text-xs uppercase tracking-wider text-blue transition-colors hover:brightness-95 disabled:opacity-60"
                    >
                      {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
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
