"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const NAV_LINKS = [
  { href: "#trail", label: "Hành trình" },
  { href: "#videos", label: "Video" },
  { href: "#about", label: "Về chúng tôi" },
  { href: "#trip", label: "Chương trình" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 bg-cream/95 backdrop-blur-sm transition-shadow ${
          scrolled ? "shadow-[0_2px_20px_rgba(20,40,80,0.08)]" : ""
        }`}
      >
        <div className="mx-auto flex max-w-[var(--page-w)] items-center justify-between px-6 py-4">
          <a href="#" className="flex items-center gap-3">
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
          </a>

          <nav className="hidden items-center gap-10 text-sm font-medium text-ink md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative py-1 transition-colors hover:text-sun after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-sun after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
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
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className="rounded-full border border-sun/40 bg-sun-soft/50 px-5 py-3 text-center font-display text-lg font-semibold text-ink"
          >
            {link.label}
          </a>
        ))}
      </div>
    </>
  );
}
