"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./CourseMediaApertureImage.module.css";

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const IMAGE_READINESS_TIMEOUT_MS = 500;
const REVEAL_SETTLE_WATCHDOG_MS = 950;

type RevealPhase = "visible" | "waiting";
type CssMotionState = "running" | "finished";

function normalizePath(path: string) {
  return path.replace(/\/+$/, "") || "/";
}

function getCssMotionState(image: HTMLImageElement): CssMotionState {
  try {
    if (typeof image.getAnimations === "function") {
      const animation = image.getAnimations()[0];
      if (animation) {
        return animation.playState === "finished" || animation.playState === "idle"
          ? "finished"
          : "running";
      }
    }

    const computedStyle = window.getComputedStyle(image);
    return computedStyle.animationName !== "none" && computedStyle.transform !== "none"
      ? "running"
      : "finished";
  } catch {
    return "finished";
  }
}

export function CourseMediaApertureImage({
  slug,
  src,
  alt,
  sizes,
}: {
  slug: string;
  src: string;
  alt: string;
  sizes: string;
}) {
  const pathname = usePathname();
  const expectedPath = normalizePath(`/courses/${slug}`);
  const routeKey = pathname ? normalizePath(pathname) : expectedPath;

  return (
    <CourseMediaApertureEntry
      key={routeKey}
      active={routeKey === expectedPath}
      slug={slug}
      src={src}
      alt={alt}
      sizes={sizes}
    />
  );
}

function CourseMediaApertureEntry({
  active,
  slug,
  src,
  alt,
  sizes,
}: {
  active: boolean;
  slug: string;
  src: string;
  alt: string;
  sizes: string;
}) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [phase, setPhase] = useState<RevealPhase>(active ? "waiting" : "visible");

  useIsomorphicLayoutEffect(() => {
    const image = imageRef.current;
    if (!active || phase === "visible" || !image) {
      if (!active) setPhase("visible");
      return;
    }

    if (typeof window.matchMedia !== "function") {
      setPhase("visible");
      return;
    }

    let desktopQuery: MediaQueryList;
    let finePointerQuery: MediaQueryList;
    let reducedMotionQuery: MediaQueryList;
    try {
      desktopQuery = window.matchMedia("(min-width: 1024px)");
      finePointerQuery = window.matchMedia("(pointer: fine)");
      reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    } catch {
      setPhase("visible");
      return;
    }

    const isEligible = () =>
      desktopQuery.matches && finePointerQuery.matches && !reducedMotionQuery.matches;
    if (
      !isEligible() ||
      typeof desktopQuery.addEventListener !== "function" ||
      typeof finePointerQuery.addEventListener !== "function" ||
      typeof reducedMotionQuery.addEventListener !== "function"
    ) {
      setPhase("visible");
      return;
    }

    let readinessSettled = false;
    let motionSettled = false;
    let readinessTimeoutId: number | null = null;
    let motionWatchdogId: number | null = null;
    let decoding = false;

    const clearReadinessTimeout = () => {
      if (readinessTimeoutId === null) return;
      try {
        window.clearTimeout(readinessTimeoutId);
      } catch {
        // A timer cleanup failure must not block the static image fallback.
      }
      readinessTimeoutId = null;
    };

    const finishVisible = () => {
      if (motionSettled) return;
      motionSettled = true;
      if (motionWatchdogId !== null) {
        try {
          window.clearTimeout(motionWatchdogId);
        } catch {
          // The image is still made visible below.
        }
        motionWatchdogId = null;
      }
      setPhase("visible");
    };

    const failOpen = () => {
      if (readinessSettled) return;
      readinessSettled = true;
      clearReadinessTimeout();
      finishVisible();
    };

    const onAnimationEnd = (event: AnimationEvent) => {
      if (event.target === image) finishVisible();
    };
    const onAnimationCancel = (event: AnimationEvent) => {
      if (event.target === image) finishVisible();
    };

    const adoptCurrentAnimation = () => {
      if (readinessSettled) return;
      readinessSettled = true;
      clearReadinessTimeout();
      try {
        image.removeEventListener("load", checkImageReadiness);
        image.removeEventListener("error", failOpen);
      } catch {
        // A stale readiness listener cannot restart the animation.
      }

      if (!isEligible() || getCssMotionState(image) === "finished") {
        finishVisible();
        return;
      }

      try {
        image.addEventListener("animationend", onAnimationEnd);
        image.addEventListener("animationcancel", onAnimationCancel);
        motionWatchdogId = window.setTimeout(finishVisible, REVEAL_SETTLE_WATCHDOG_MS);

        // The CSS animation may finish between the first state read and listener setup.
        if (getCssMotionState(image) === "finished") finishVisible();
      } catch {
        finishVisible();
      }
    };

    function checkImageReadiness() {
      if (readinessSettled || decoding || !image.complete) return;
      if (image.naturalWidth <= 0) {
        failOpen();
        return;
      }
      if (typeof image.decode !== "function") {
        adoptCurrentAnimation();
        return;
      }

      decoding = true;
      let decodePromise: Promise<void>;
      try {
        decodePromise = image.decode();
      } catch {
        failOpen();
        return;
      }
      decodePromise.then(
        () => {
          decoding = false;
          if (!image.complete || image.naturalWidth <= 0) failOpen();
          else adoptCurrentAnimation();
        },
        failOpen,
      );
    }

    const onEligibilityChange = () => {
      if (!isEligible()) {
        readinessSettled = true;
        clearReadinessTimeout();
        finishVisible();
      }
    };

    try {
      image.addEventListener("load", checkImageReadiness);
      image.addEventListener("error", failOpen);
      desktopQuery.addEventListener("change", onEligibilityChange);
      finePointerQuery.addEventListener("change", onEligibilityChange);
      reducedMotionQuery.addEventListener("change", onEligibilityChange);
      readinessTimeoutId = window.setTimeout(failOpen, IMAGE_READINESS_TIMEOUT_MS);
      checkImageReadiness();
    } catch {
      failOpen();
    }

    return () => {
      readinessSettled = true;
      motionSettled = true;
      clearReadinessTimeout();
      if (motionWatchdogId !== null) {
        try {
          window.clearTimeout(motionWatchdogId);
        } catch {
          // Cleanup must not interrupt route changes.
        }
      }
      try {
        image.removeEventListener("load", checkImageReadiness);
        image.removeEventListener("error", failOpen);
        image.removeEventListener("animationend", onAnimationEnd);
        image.removeEventListener("animationcancel", onAnimationCancel);
        desktopQuery.removeEventListener("change", onEligibilityChange);
        finePointerQuery.removeEventListener("change", onEligibilityChange);
        reducedMotionQuery.removeEventListener("change", onEligibilityChange);
      } catch {
        // Cleanup errors must not block the route transition.
      }
    };
  }, [active, phase, slug, src]);

  const revealClass = phase === "waiting" ? styles.waiting : "";

  return (
    <>
      <Image
        ref={imageRef}
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        className={`object-contain ${revealClass}`}
      />
      <span
        aria-hidden="true"
        className={styles.pageEdge}
        data-phase={phase}
      />
    </>
  );
}
