"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./MissionChapterNav.module.css";

const CHAPTERS = [
  ["sunshine-overview", "Sunshine Center"],
  ["inside-journey", "Hành trình"],
  ["mission", "Sứ mệnh"],
  ["culture-values", "Văn hoá & giá trị"],
  ["founder", "Nhà sáng lập"],
] as const;

export function MissionChapterNav() {
  const navRef = useRef<HTMLElement>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const nav = navRef.current;
    const main = nav?.closest("main");
    const header = main?.querySelector<HTMLElement>("header");
    if (!nav || !header) return;

    const sections = CHAPTERS.flatMap(([id]) => {
      const section = document.getElementById(id);
      return section instanceof HTMLElement ? [section] : [];
    });
    if (sections.length !== CHAPTERS.length) return;

    const originalScrollMargins = sections.map((section) => section.style.scrollMarginTop);
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    let observer: IntersectionObserver | null = null;

    const updateActiveSection = (centerY: number) => {
      const activeSection = sections.find((section) => {
        const bounds = section.getBoundingClientRect();
        return bounds.top <= centerY && bounds.bottom > centerY;
      });
      setActiveId(activeSection?.id ?? null);
    };

    const measureAndObserve = () => {
      const headerBottom = Math.max(0, Math.ceil(header.getBoundingClientRect().bottom));
      const navHeight = Math.ceil(nav.getBoundingClientRect().height);
      const viewportHeight = Math.max(1, window.innerHeight);
      const isDesktop = desktopQuery.matches;
      if (!isDesktop) {
        sections.forEach((section, index) => {
          section.style.scrollMarginTop = originalScrollMargins[index];
        });
      }
      const mobileScrollMargin = Number.parseFloat(
        window.getComputedStyle(sections[0]).scrollMarginTop,
      );
      const targetOffset = isDesktop
        ? Math.ceil(headerBottom + navHeight + 16)
        : Math.max(headerBottom + 1, Number.isFinite(mobileScrollMargin) ? mobileScrollMargin : 0);

      nav.style.setProperty("--mission-sticky-top", `${headerBottom}px`);
      sections.forEach((section, index) => {
        section.style.scrollMarginTop = isDesktop
          ? `${Math.ceil(headerBottom + navHeight + 16)}px`
          : originalScrollMargins[index];
      });

      observer?.disconnect();
      observer = null;

      if (typeof IntersectionObserver === "undefined") {
        setActiveId(null);
        return;
      }

      const bandHeight = Math.min(2, viewportHeight);
      const bandTop = Math.min(
        Math.max(0, targetOffset + 1),
        viewportHeight - bandHeight,
      );
      const bottomInset = viewportHeight - bandTop - bandHeight;
      const centerY = bandTop + bandHeight / 2;

      observer = new IntersectionObserver(
        () => updateActiveSection(centerY),
        {
          rootMargin: `-${bandTop}px 0px -${bottomInset}px 0px`,
          threshold: 0,
        },
      );
      sections.forEach((section) => observer?.observe(section));
      updateActiveSection(centerY);
    };

    const resizeObserver =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measureAndObserve);
    resizeObserver?.observe(header);
    resizeObserver?.observe(nav);
    window.addEventListener("resize", measureAndObserve);
    window.visualViewport?.addEventListener("resize", measureAndObserve);
    desktopQuery.addEventListener("change", measureAndObserve);
    measureAndObserve();

    return () => {
      resizeObserver?.disconnect();
      observer?.disconnect();
      window.removeEventListener("resize", measureAndObserve);
      window.visualViewport?.removeEventListener("resize", measureAndObserve);
      desktopQuery.removeEventListener("change", measureAndObserve);
      sections.forEach((section, index) => {
        section.style.scrollMarginTop = originalScrollMargins[index];
      });
      nav.style.removeProperty("--mission-sticky-top");
    };
  }, []);

  const activeIndex = CHAPTERS.findIndex(([id]) => id === activeId);

  return (
    <nav
      ref={navRef}
      aria-label="Đi đến phần nội dung"
      className={`border-b border-blue/10 bg-white px-6 ${styles.chapterNav}`}
    >
      <ol className="mx-auto flex max-w-[var(--page-w)] flex-wrap gap-x-5 gap-y-2 py-3 sm:gap-x-7">
        {CHAPTERS.map(([id, label], index) => {
          const isActive = activeId === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={isActive ? "location" : undefined}
                className={`inline-flex min-h-10 items-center gap-2 text-sm font-semibold hover:text-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2 ${styles.chapterLink} ${isActive ? "text-blue" : "text-blue/70"}`}
              >
                <span className="font-mono text-xs font-bold text-yellow">0{index + 1}</span>
                {label}
              </a>
            </li>
          );
        })}
      </ol>
      <span className={styles.progressTrack} aria-hidden="true">
        <span
          className={styles.progressFill}
          style={{
            opacity: activeIndex < 0 ? 0 : 1,
            transform: `scaleX(${(activeIndex + 1) / CHAPTERS.length})`,
          }}
        />
      </span>
    </nav>
  );
}
