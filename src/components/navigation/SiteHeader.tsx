"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getStoredUser, clearSession, type StoredUser } from "@/lib/auth";

const NAV_LINKS = [
  { href: "/programs", label: "Chương trình" },
  // { href: "/coaching", label: "Dịch vụ coaching 1:1" },
  { href: "/courses", label: "Khóa học" },
  { href: "/library", label: "Thư viện" },
  { href: "/stories", label: "Câu chuyện RNI" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<StoredUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Đọc trạng thái đăng nhập ngay khi component mount
    setUser(getStoredUser());

    // Lắng nghe sự kiện đăng nhập/đăng xuất phát ra từ bất kỳ đâu trong app
    const onAuthChange = () => setUser(getStoredUser());
    window.addEventListener("authchange", onAuthChange);
    window.addEventListener("storage", onAuthChange);

    return () => {
      window.removeEventListener("authchange", onAuthChange);
      window.removeEventListener("storage", onAuthChange);
    };
  }, []);

  function handleLogout() {
    clearSession();
    setMenuOpen(false);
    router.push("/");
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 bg-cream/95 backdrop-blur-sm transition-shadow ${
          scrolled ? "shadow-[0_2px_20px_rgba(20,40,80,0.08)]" : ""
        }`}
      >
        <div className="mx-auto flex max-w-[var(--page-w)] items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/Sunshine_brand.png"
              alt="Sunshine Center"
              width={42}
              height={42}
            />
            <div className="leading-tight">
              <div className="font-display text-lg font-bold text-ink">
                Sunshine Center
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-sun">
                Values Create Brand
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-10 text-sm font-medium text-ink md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative py-1 transition-colors hover:text-sun after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-sun after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}

            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-full bg-sage/15 py-1.5 pl-1.5 pr-4">
                  {user.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt={user.name}
                      width={28}
                      height={28}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-sun font-mono text-xs font-bold text-ink">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="text-sm font-medium text-ink">
                    {user.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded-full border border-crimson/40 px-4 py-2 font-mono text-xs uppercase tracking-wider text-crimson transition-colors hover:bg-crimson/10"
                >
                  Đăng xuất
                </button>
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="rounded-full bg-sun px-5 py-2 font-mono text-xs uppercase tracking-wider text-ink transition-colors hover:brightness-90"
              >
                Đăng nhập
              </Link>
            )}
          </nav>

          <button
            aria-label="Mở menu"
            onClick={() => setMenuOpen(true)}
            className="text-2xl text-ink md:hidden"
          >
            ☰
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-[60] flex flex-col gap-5 bg-cream p-6 transition-transform duration-300 md:hidden ${
          menuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <button
          aria-label="Đóng menu"
          onClick={() => setMenuOpen(false)}
          className="self-end text-2xl text-ink"
        >
          ✕
        </button>

        {user && (
          <div className="flex items-center gap-3 rounded-full bg-sage/15 px-4 py-3">
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.name}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sun font-mono text-xs font-bold text-ink">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="font-medium text-ink">{user.name}</span>
          </div>
        )}

        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className="rounded-full border border-sun/40 bg-sun-soft/50 px-5 py-3 text-center font-display text-lg font-semibold text-ink"
          >
            {link.label}
          </Link>
        ))}

        {user ? (
          <button
            onClick={handleLogout}
            className="rounded-full border border-crimson/40 px-5 py-3 text-center font-mono text-xs uppercase tracking-wider text-crimson"
          >
            Đăng xuất
          </button>
        ) : (
          <Link
            href="/sign-in"
            onClick={() => setMenuOpen(false)}
            className="rounded-full bg-sun px-5 py-3 text-center font-mono text-xs uppercase tracking-wider text-ink"
          >
            Đăng nhập
          </Link>
        )}
      </div>
    </>
  );
}
