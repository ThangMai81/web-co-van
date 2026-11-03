"use client";

import { useEffect, useRef } from "react";
import styles from "./MissionLiquidHeading.module.css";

const FILTER_ID = "mission-journeyinside-liquid-filter";
const TOTAL_DURATION_MS = 650;
const RISE_DURATION_MS = 140;
const HOLD_DURATION_MS = 100;
const RETURN_DURATION_MS = 410;
const MAX_DISPLACEMENT = 2;

function easeInOutCubic(progress: number) {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

function subscribeToMediaQuery(query: MediaQueryList, listener: () => void) {
  if (
    typeof query.addEventListener === "function" &&
    typeof query.removeEventListener === "function"
  ) {
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }

  if (
    typeof query.addListener === "function" &&
    typeof query.removeListener === "function"
  ) {
    query.addListener(listener);
    return () => query.removeListener(listener);
  }

  throw new Error("Media query change events are unavailable");
}

export function MissionLiquidHeading() {
  const titleRef = useRef<HTMLSpanElement>(null);
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);
  const displacementRef = useRef<SVGFEDisplacementMapElement>(null);
  const hasStartedRef = useRef(false);
  const pendingFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const title = titleRef.current;
    const turbulence = turbulenceRef.current;
    const displacement = displacementRef.current;
    if (
      !title ||
      !turbulence ||
      !displacement ||
      typeof window.matchMedia !== "function" ||
      typeof IntersectionObserver === "undefined" ||
      typeof window.requestAnimationFrame !== "function" ||
      typeof window.cancelAnimationFrame !== "function" ||
      typeof CSS === "undefined" ||
      typeof CSS.supports !== "function" ||
      !("baseFrequencyX" in turbulence) ||
      !("baseFrequencyY" in turbulence) ||
      !("scale" in displacement) ||
      typeof displacement.setAttribute !== "function"
    ) {
      return;
    }
    try {
      if (!CSS.supports("filter", "url(#" + FILTER_ID + ")")) return;
    } catch {
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
      return;
    }

    let eligible =
      desktopQuery.matches &&
      finePointerQuery.matches &&
      !reducedMotionQuery.matches;
    let disposed = false;
    let setupFailed = false;
    let observer: IntersectionObserver | null = null;
    let animationStartTime: number | null = null;
    const removeMediaListeners: Array<() => void> = [];

    const disconnectObserver = () => {
      const activeObserver = observer;
      observer = null;
      try {
        activeObserver?.disconnect();
      } catch {
        // Cleanup still resets the filter and pending frame below.
      }
    };

    const cancelPendingFrame = () => {
      const frameId = pendingFrameRef.current;
      pendingFrameRef.current = null;
      if (frameId === null) return;
      try {
        window.cancelAnimationFrame(frameId);
      } catch {
        // Keep the title static; a late callback also checks its eligibility.
      }
    };

    const restoreStaticTitle = () => {
      cancelPendingFrame();
      animationStartTime = null;
      try {
        displacement.setAttribute("scale", "0");
      } catch {
        // The visible text still has its unfiltered CSS fallback.
      }
      try {
        title.style.removeProperty("filter");
      } catch {
        // Fail closed if an unusual DOM implementation rejects style cleanup.
      }
    };

    const clearMediaListeners = () => {
      for (const removeListener of removeMediaListeners.splice(0)) {
        try {
          removeListener();
        } catch {
          // Continue removing any remaining preference listeners.
        }
      }
    };

    const failClosed = () => {
      if (setupFailed) return;
      setupFailed = true;
      disconnectObserver();
      restoreStaticTitle();
      clearMediaListeners();
    };

    const animateFrame = (timestamp: number) => {
      pendingFrameRef.current = null;
      if (!eligible || disposed || setupFailed) {
        restoreStaticTitle();
        return;
      }

      try {
        if (!Number.isFinite(timestamp)) {
          throw new Error("Animation frame timestamp is unavailable");
        }
        if (animationStartTime === null) animationStartTime = timestamp;
        const elapsed = Math.max(0, timestamp - animationStartTime);
        if (elapsed >= TOTAL_DURATION_MS) {
          displacement.setAttribute("scale", "0");
          title.style.removeProperty("filter");
          animationStartTime = null;
          return;
        }

        let displacementScale = MAX_DISPLACEMENT;
        if (elapsed < RISE_DURATION_MS) {
          const progress = easeInOutCubic(elapsed / RISE_DURATION_MS);
          displacementScale *= progress;
        } else if (elapsed >= RISE_DURATION_MS + HOLD_DURATION_MS) {
          const returnProgress =
            (elapsed - RISE_DURATION_MS - HOLD_DURATION_MS) /
            RETURN_DURATION_MS;
          displacementScale *= 1 - easeInOutCubic(returnProgress);
        }

        displacement.setAttribute("scale", displacementScale.toFixed(3));
        pendingFrameRef.current = window.requestAnimationFrame(animateFrame);
      } catch {
        failClosed();
      }
    };

    const startAnimation = () => {
      try {
        animationStartTime = null;
        pendingFrameRef.current = window.requestAnimationFrame(animateFrame);
      } catch {
        failClosed();
      }
    };

    const startObserver = () => {
      if (
        !eligible ||
        disposed ||
        setupFailed ||
        hasStartedRef.current ||
        observer
      ) {
        return;
      }

      try {
        observer = new IntersectionObserver(
          (entries) => {
            if (!eligible || disposed || setupFailed || hasStartedRef.current) {
              return;
            }
            const entered = entries.some(
              (entry) => entry.target === title && entry.isIntersecting,
            );
            if (!entered) return;

            hasStartedRef.current = true;
            try {
              displacement.setAttribute("scale", "0");
              title.style.setProperty("filter", "url(#" + FILTER_ID + ")");
              startAnimation();
            } catch {
              failClosed();
            }

            disconnectObserver();
          },
          { threshold: 0.15 },
        );
        observer.observe(title);
      } catch {
        failClosed();
      }
    };

    const updateEligibility = () => {
      try {
        const nextEligibility =
          desktopQuery.matches &&
          finePointerQuery.matches &&
          !reducedMotionQuery.matches;
        if (nextEligibility === eligible) return;

        eligible = nextEligibility;
        if (!eligible) {
          disconnectObserver();
          restoreStaticTitle();
          return;
        }

        startObserver();
      } catch {
        failClosed();
      }
    };

    try {
      for (const query of [
        desktopQuery,
        finePointerQuery,
        reducedMotionQuery,
      ]) {
        removeMediaListeners.push(
          subscribeToMediaQuery(query, updateEligibility),
        );
      }
      startObserver();
    } catch {
      failClosed();
    }

    return () => {
      disposed = true;
      disconnectObserver();
      restoreStaticTitle();
      clearMediaListeners();
    };
  }, []);

  return (
    <div className="mb-4 flex items-center justify-center gap-3 font-mono text-lg font-bold uppercase tracking-widest text-yellow md:text-xl">
      <span className="block h-px w-8 bg-yellow" />
      <span ref={titleRef} className={styles.titleText}>
        Hành trình bên trong
      </span>
      <svg
        className={styles.filterDefinitions}
        aria-hidden="true"
        focusable="false"
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter
          id={FILTER_ID}
          x="-0.02"
          y="-0.12"
          width="1.04"
          height="1.24"
          filterUnits="objectBoundingBox"
          primitiveUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            ref={turbulenceRef}
            type="fractalNoise"
            baseFrequency="0.025 0.055"
            numOctaves={1}
            seed={2}
            result="liquidNoise"
          />
          <feDisplacementMap
            ref={displacementRef}
            in="SourceGraphic"
            in2="liquidNoise"
            scale={0}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
    </div>
  );
}
