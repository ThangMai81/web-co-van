"use client";

import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "#trail", label: "Hành trình" },
  { href: "#videos", label: "Video" },
  { href: "#about", label: "Về tôi" },
  { href: "#trip", label: "Chuyến đi kế tiếp" },
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
        className={`fixed inset-x-0 top-0 z-50 py-5 transition-colors ${
          scrolled ? "bg-pine/95 backdrop-blur-sm" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
          <span className="font-display text-lg font-bold">Đăng & Núi</span>

          <nav className="hidden gap-8 text-sm md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="opacity-80 hover:opacity-100"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <button
            aria-label="Mở menu"
            onClick={() => setMenuOpen(true)}
            className="text-2xl md:hidden"
          >
            ☰
          </button>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-60 flex flex-col gap-7 bg-pine p-6 transition-transform duration-300 md:hidden ${
          menuOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <button
          aria-label="Đóng menu"
          onClick={() => setMenuOpen(false)}
          className="self-end text-2xl"
        >
          ✕
        </button>
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setMenuOpen(false)}
            className="font-display text-2xl font-semibold"
          >
            {link.label}
          </a>
        ))}
      </div>
    </>
  );
}
