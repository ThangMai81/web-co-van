"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./ProgramHero.module.css";

type ProgramHeroWarmSweepProps = {
  slug: string;
  className: string;
  children: ReactNode;
};

export default function ProgramHeroWarmSweep({
  slug,
  className,
  children,
}: ProgramHeroWarmSweepProps) {
  const pathname = usePathname();
  const frameRef = useRef<HTMLDivElement | null>(null);
  const entryPathRef = useRef<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const currentPath = pathname?.replace(/\/+$/, "") || "/";
    const expectedPath = `/programs/${slug}`.replace(/\/+$/, "");

    if (currentPath !== expectedPath) {
      entryPathRef.current = null;
      setIsRunning(false);
      return;
    }

    if (entryPathRef.current === currentPath) return;
    entryPathRef.current = currentPath;
    setIsRunning(false);

    const frame = frameRef.current;
    if (
      !frame ||
      typeof window.matchMedia !== "function" ||
      typeof window.IntersectionObserver !== "function"
    ) {
      return;
    }

    let desktop: MediaQueryList;
    let finePointer: MediaQueryList;
    let reducedMotion: MediaQueryList;

    try {
      desktop = window.matchMedia("(min-width: 1024px)");
      finePointer = window.matchMedia("(pointer: fine)");
      reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    } catch {
      return;
    }

    if (
      !desktop.matches ||
      !finePointer.matches ||
      reducedMotion.matches ||
      typeof desktop.addEventListener !== "function" ||
      typeof finePointer.addEventListener !== "function" ||
      typeof reducedMotion.addEventListener !== "function"
    ) {
      return;
    }

    const image = frame.querySelector("img");
    if (!image) return;

    let disposed = false;
    let started = false;
    let isVisible = false;
    let isReady = false;
    let readyTimeout: number | undefined;
    let animationTimeout: number | undefined;
    let observer: IntersectionObserver | null = null;

    const removeSubscriptions = () => {
      observer?.disconnect();
      image.removeEventListener("load", onLoad);
      image.removeEventListener("error", onFailure);
      desktop.removeEventListener("change", onEligibilityChange);
      finePointer.removeEventListener("change", onEligibilityChange);
      reducedMotion.removeEventListener("change", onEligibilityChange);
    };

    const failOpen = () => {
      if (disposed) return;
      disposed = true;
      if (readyTimeout !== undefined) window.clearTimeout(readyTimeout);
      if (animationTimeout !== undefined) window.clearTimeout(animationTimeout);
      removeSubscriptions();
      setIsRunning(false);
    };

    const onEligibilityChange = () => {
      if (!desktop.matches || !finePointer.matches || reducedMotion.matches) {
        failOpen();
      }
    };

    const maybeStart = () => {
      if (disposed || started || !isReady || !isVisible) return;

      started = true;
      if (readyTimeout !== undefined) window.clearTimeout(readyTimeout);
      removeSubscriptions();
      setIsRunning(true);
      animationTimeout = window.setTimeout(() => setIsRunning(false), 760);
    };

    const onFailure = () => failOpen();

    const markReady = () => {
      if (disposed) return;
      if (image.naturalWidth <= 0) {
        failOpen();
        return;
      }

      if (typeof image.decode === "function") {
        image.decode().then(() => {
          if (disposed) return;
          isReady = true;
          if (readyTimeout !== undefined) window.clearTimeout(readyTimeout);
          maybeStart();
        }).catch(failOpen);
      } else {
        isReady = true;
        if (readyTimeout !== undefined) window.clearTimeout(readyTimeout);
        maybeStart();
      }
    };

    const onLoad = () => markReady();

    try {
      observer = new IntersectionObserver((entries) => {
        isVisible = entries.some((entry) => entry.isIntersecting);
        maybeStart();
      }, { threshold: 0.01 });
      observer.observe(frame);
      desktop.addEventListener("change", onEligibilityChange);
      finePointer.addEventListener("change", onEligibilityChange);
      reducedMotion.addEventListener("change", onEligibilityChange);
    } catch {
      failOpen();
      return;
    }

    image.addEventListener("load", onLoad, { once: true });
    image.addEventListener("error", onFailure, { once: true });
    readyTimeout = window.setTimeout(failOpen, 1800);

    if (image.complete) {
      if (image.naturalWidth > 0) markReady();
      else failOpen();
    }

    return () => {
      disposed = true;
      if (readyTimeout !== undefined) window.clearTimeout(readyTimeout);
      if (animationTimeout !== undefined) window.clearTimeout(animationTimeout);
      removeSubscriptions();
    };
  }, [pathname, slug]);

  return (
    <div ref={frameRef} className={className}>
      {children}
      <span
        aria-hidden="true"
        className={styles.warmSweep}
        data-running={isRunning ? "true" : "false"}
      />
    </div>
  );
}
