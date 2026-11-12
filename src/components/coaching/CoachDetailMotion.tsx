"use client";

import { useEffect } from "react";

/**
 * Bật hiệu ứng xuất hiện cho các phần tử có `data-cd-reveal` trên trang chi
 * tiết coach. Mỗi phần tử nhận `data-visible="true"` khi vào khung nhìn; phần
 * CSS tương ứng nằm trong CoachDetailMotion.module.css.
 */
export function CoachDetailMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-cd-reveal]"),
    );
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce || typeof IntersectionObserver === "undefined") {
      targets.forEach((el) => (el.dataset.visible = "true"));
      return;
    }

    root.dataset.cdMotion = "ready";
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (entry.target as HTMLElement).dataset.visible = "true";
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -6% 0px" },
    );
    targets.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      delete root.dataset.cdMotion;
    };
  }, []);

  return null;
}
