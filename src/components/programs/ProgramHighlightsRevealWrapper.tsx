"use client";

import React, { useEffect, useRef, type ComponentPropsWithoutRef, type ElementType } from "react";

type Props<T extends ElementType = "div"> = {
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

export default function ProgramHighlightsRevealWrapper<T extends ElementType = "div">({
  as,
  children,
  ...rest
}: Props<T> & { children?: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const Tag = (as ?? "div") as ElementType;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      (el as HTMLElement).dataset.highlightsVisible = "true";
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      (el as HTMLElement).dataset.highlightsVisible = "true";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          (el as HTMLElement).dataset.highlightsVisible = "true";
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  );
}
