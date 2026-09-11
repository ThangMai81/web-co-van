"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Mode = "login" | "register";

export function SignIn() {
  const [mode, setMode] = useState<Mode>("login");

  return (
    <div className="flex min-h-svh items-center justify-center bg-cream px-6 py-16">
      <div className="relative hidden min-h-svh w-1/2 md:block">
        <Image
          src="/images/collaborate_team.jpg"
          alt="Sunshine Center"
          fill
          priority
          sizes="(min-width: 768px) 50vw, 0vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent" />
      </div>

      <div className="w-full max-w-md ml-[40px] mb-[40px]">
        {/* Logo */}
        <Link href="/" className="mb-8 flex items-center justify-center gap-3">
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

        {/* Card */}
        <div className="rounded-md border border-sage/30 bg-paper p-8 shadow-lg shadow-black/10">
          {/* Tab switch */}
          <div className="mb-8 flex rounded-full bg-sage/15 p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
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
              onClick={() => setMode("register")}
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

          <form className="flex flex-col gap-4">
            {mode === "register" && (
              <Field label="Họ và tên" type="text" placeholder="Nguyễn Văn A" />
            )}

            <Field label="Email" type="email" placeholder="ban@email.com" />

            <Field label="Mật khẩu" type="password" placeholder="••••••••" />

            {mode === "register" && (
              <Field
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
              className="mt-2 rounded-sm bg-sun py-3.5 font-mono text-xs uppercase tracking-wider text-ink transition-colors hover:brightness-90"
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
  );
}

function Field({
  label,
  type,
  placeholder,
}: {
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
        type={type}
        placeholder={placeholder}
        required
        className="rounded-sm border border-sage/40 bg-cream px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-sun"
      />
    </label>
  );
}
