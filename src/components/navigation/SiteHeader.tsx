"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  getStoredUser,
  clearSession,
  hydrateSession,
  type StoredUser,
} from "@/lib/auth";

const NAV_LINKS = [
  { href: "/programs", label: "CHƯƠNG TRÌNH" },
  { href: "/coaching", label: "DỊCH VỤ COACHING 1:1" },
  { href: "/courses", label: "KHÓA HỌC" },
  // { href: "/library", label: "THƯ VIỆN" },
  { href: "/mission", label: "SỨ MỆNH" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<StoredUser | null>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const menuCloseRef = useRef<HTMLButtonElement>(null);
  const menuPanelRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const closeMenu = useCallback((restoreFocus = true) => {
    setMenuOpen(false);
    if (restoreFocus) {
      window.requestAnimationFrame(() => {
        if (window.matchMedia("(max-width: 1023px)").matches) {
          menuTriggerRef.current?.focus();
        }
      });
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Hiện ngay user từ localStorage nếu có (tránh nháy UI "chưa đăng nhập" khi tải trang)
    setUser(getStoredUser());

    // Rồi xác nhận lại với backend qua cookie -> tự động đăng nhập / tự động đăng xuất đúng trạng thái thật
    hydrateSession().then(setUser);

    const onAuthChange = () => setUser(getStoredUser());
    window.addEventListener("authchange", onAuthChange);
    window.addEventListener("storage", onAuthChange);

    return () => {
      window.removeEventListener("authchange", onAuthChange);
      window.removeEventListener("storage", onAuthChange);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    document.body.style.overflow = "hidden";
    menuCloseRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab") return;
      const panel = menuPanelRef.current;
      if (!panel) return;
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((element) => element.getAttribute("aria-hidden") !== "true");
      if (focusable.length === 0) {
        event.preventDefault();
        menuCloseRef.current?.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !panel.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !panel.contains(document.activeElement))) {
        event.preventDefault();
        first.focus();
      }
    };

    const closeAtDesktop = () => {
      if (desktopQuery.matches) closeMenu(false);
    };

    window.addEventListener("keydown", onKeyDown);
    desktopQuery.addEventListener("change", closeAtDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      desktopQuery.removeEventListener("change", closeAtDesktop);
    };
  }, [closeMenu, menuOpen]);

  async function handleLogout() {
    await clearSession();
    closeMenu(false);
    router.push("/");
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 bg-white backdrop-blur-sm transition-shadow ${
          scrolled ? "shadow-[0_2px_20px_rgba(20,40,80,0.08)]" : ""
        }`}
      >
        <div className="mx-auto flex max-w-[var(--page-w)] items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/Sunshine_brand_without_slogan.png"
              alt="Sunshine Center"
              width={42}
              height={42}
            />
            <div className="leading-tight">
              <div className="font-display text-lg font-bold text-blue-900">
                SUNSHINE CENTER
              </div>
              <div className="font-mono text-[10px] uppercase tracking-widest text-yellow-400 text-center">
                Values Create Brand
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-10 text-sm font-medium text-ink lg:flex">
            {NAV_LINKS.map((link) =>
              (() => {
                const isActive =
                  pathname === link.href ||
                  pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`relative py-1 transition-colors hover:text-yellow after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:bg-yellow after:transition-all after:duration-300 hover:after:w-full ${isActive ? "text-blue after:w-full" : "after:w-0"}`}
                  >
                    {link.label}
                  </Link>
                );
              })(),
            )}

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
                className="rounded-full bg-[#fece01] px-5 py-2 font-mono text-xs uppercase tracking-wider text-black transition-colors hover:brightness-90"
              >
                Đăng nhập
              </Link>
            )}
          </nav>

          <button
            aria-label="Mở menu"
            aria-controls="mobile-navigation"
            aria-expanded={menuOpen}
            ref={menuTriggerRef}
            onClick={() => setMenuOpen(true)}
            className="flex h-11 w-11 items-center justify-center text-2xl text-ink lg:hidden"
          >
            ☰
          </button>
        </div>
      </header>

      <div
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeMenu();
        }}
        className={`fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto overscroll-contain bg-black/30 px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-[max(1rem,env(safe-area-inset-bottom))] transition-opacity duration-200 motion-reduce:transition-none lg:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav
          ref={menuPanelRef}
          id="mobile-navigation"
          role="dialog"
          aria-modal="true"
          aria-label="Điều hướng chính"
          className={`flex self-start w-[min(22rem,calc(100vw_-_2rem))] max-h-[calc(100dvh_-_2rem_-_env(safe-area-inset-top)_-_env(safe-area-inset-bottom))] flex-col gap-2 overflow-y-auto overscroll-contain rounded-2xl border border-blue/10 bg-white p-4 text-blue shadow-xl shadow-black/15 transition-transform duration-200 motion-reduce:transition-none ${
            menuOpen ? "translate-y-0" : "-translate-y-3"
          }`}
        >
          <button
            ref={menuCloseRef}
            type="button"
            aria-label="Đóng menu"
            onClick={() => closeMenu()}
            className="ml-auto flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-2xl text-ink transition-colors hover:bg-blue/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow"
          >
            ✕
          </button>

          {user && (
            <div className="flex items-center gap-3 border-b border-blue/10 px-3 pb-3">
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

          <nav aria-label="Điều hướng trang" className="flex flex-col gap-2">
            {NAV_LINKS.map((link) =>
              (() => {
                const isActive =
                  pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => closeMenu(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex min-h-12 w-full items-center rounded-xl border px-3 py-2 text-left font-display text-lg font-semibold leading-snug transition-colors hover:border-yellow hover:text-blue ${isActive ? "border-yellow bg-yellow text-blue" : "border-blue/10 bg-white text-ink"}`}
                  >
                    {link.label}
                  </Link>
                );
              })(),
            )}
          </nav>

          <div className="mt-1 border-t border-blue/10 pt-3">
            {user ? (
              <button
                onClick={handleLogout}
                className="min-h-12 w-full rounded-xl border border-crimson/40 px-3 py-2 text-left font-mono text-xs uppercase tracking-wider text-crimson"
              >
                Đăng xuất
              </button>
            ) : (
              <Link
                href="/sign-in"
                onClick={() => closeMenu(false)}
                className="flex min-h-12 w-full items-center rounded-xl border border-sun/40 bg-sun px-3 py-2 text-left font-display text-lg font-semibold text-ink"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
