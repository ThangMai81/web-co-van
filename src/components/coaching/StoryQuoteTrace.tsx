"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./StoryQuoteTrace.module.css";

export function StoryQuoteTrace({ children }: { children: ReactNode }) {
  const panelRef = useRef<HTMLQuoteElement>(null);
  const [traceStarted, setTraceStarted] = useState(false);

  useEffect(() => {
    const panel = panelRef.current;
    if (
      !panel ||
      typeof window.matchMedia !== "function" ||
      typeof IntersectionObserver === "undefined"
    ) {
      return;
    }

    const eligibility = window.matchMedia(
      "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );

    let consumed = false;
    let observer: IntersectionObserver | null = null;
    let finishTimer: number | null = null;

    const stopTrace = () => {
      if (finishTimer !== null) {
        window.clearTimeout(finishTimer);
        finishTimer = null;
      }
      setTraceStarted(false);
    };

    const handleEligibilityChange = (event: MediaQueryListEvent) => {
      if (event.matches || !consumed) return;
      observer?.disconnect();
      stopTrace();
    };

    if (typeof eligibility.addEventListener === "function") {
      eligibility.addEventListener("change", handleEligibilityChange);
    } else {
      eligibility.addListener(handleEligibilityChange);
    }

    observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || consumed) return;
        if (!eligibility.matches) return;

        consumed = true;
        observer?.disconnect();
        setTraceStarted(true);
        finishTimer = window.setTimeout(() => {
          finishTimer = null;
          setTraceStarted(false);
        }, 520);
      },
      { threshold: 0.15 },
    );

    observer.observe(panel);

    return () => {
      consumed = true;
      observer?.disconnect();
      if (finishTimer !== null) window.clearTimeout(finishTimer);
      if (typeof eligibility.removeEventListener === "function") {
        eligibility.removeEventListener("change", handleEligibilityChange);
      } else {
        eligibility.removeListener(handleEligibilityChange);
      }
    };
  }, []);

  return (
    <blockquote
      ref={panelRef}
      className={`relative isolate rounded-3xl border border-yellow/70 bg-blue p-7 text-xl font-medium italic leading-8 text-white shadow-xl shadow-blue/10 md:p-9 ${
        traceStarted ? styles.traceStarted : ""
      }`}
    >
      <span aria-hidden="true" className={`${styles.traceSegment} ${styles.top} bg-yellow`} />
      <span aria-hidden="true" className={`${styles.traceSegment} ${styles.right} bg-yellow`} />
      <span aria-hidden="true" className={`${styles.traceSegment} ${styles.bottom} bg-yellow`} />
      <span aria-hidden="true" className={`${styles.traceSegment} ${styles.left} bg-yellow`} />
      {children}
    </blockquote>
  );
}
