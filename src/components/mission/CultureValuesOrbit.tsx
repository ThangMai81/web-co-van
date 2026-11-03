"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CultureValuesOrbit.module.css";

const ORBIT_PATH = "M 12.4 9 A 78 14 0 1 1 80 30";
const ORBIT_MOTION_PATH = "M 0 0 A 78 14 0 1 1 67.6 21";

type OrbitPhase = "hidden" | "running" | "settling" | "settled";
type SvgAnimationElement = SVGElement & {
  beginElement?: () => void;
  beginElementAt?: (offset: number) => void;
};

function subscribeToMediaQuery(query: MediaQueryList, listener: () => void) {
  if (typeof query.addEventListener === "function") {
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }

  query.addListener(listener);
  return () => query.removeListener(listener);
}

export function CultureValuesOrbit() {
  const orbitRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pointMotionRef = useRef<SVGElement | null>(null);
  const firstTailMotionRef = useRef<SVGElement | null>(null);
  const secondTailMotionRef = useRef<SVGElement | null>(null);
  const didStartRef = useRef(false);
  const phaseRef = useRef<OrbitPhase>("hidden");
  const settleTimerRef = useRef<number | null>(null);
  const [phase, setPhase] = useState<OrbitPhase>("hidden");

  const updatePhase = (nextPhase: OrbitPhase) => {
    phaseRef.current = nextPhase;
    setPhase(nextPhase);
  };

  useEffect(() => {
    if (
      didStartRef.current ||
      typeof window.matchMedia !== "function" ||
      typeof IntersectionObserver === "undefined"
    ) {
      return;
    }

    const orbit = orbitRef.current;
    const section = orbit?.parentElement;
    if (!orbit || !section) return;

    let desktopQuery: MediaQueryList;
    let reducedMotionQuery: MediaQueryList;
    try {
      desktopQuery = window.matchMedia("(min-width: 1024px)");
      reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    } catch {
      return;
    }

    if (!desktopQuery.matches || reducedMotionQuery.matches) return;

    let observer: IntersectionObserver | null = null;
    let cancelled = false;
    let pendingStartFrame = 0;
    let removeDesktopListener: () => void = () => {};
    let removeMotionListener: () => void = () => {};

    const clearSettleTimer = () => {
      if (settleTimerRef.current !== null) {
        window.clearTimeout(settleTimerRef.current);
        settleTimerRef.current = null;
      }
    };

    const setHidden = () => {
      if (cancelled) return;
      cancelled = true;
      didStartRef.current = true;
      observer?.disconnect();
      if (pendingStartFrame) window.cancelAnimationFrame(pendingStartFrame);
      pendingStartFrame = 0;
      clearSettleTimer();
      svgRef.current?.pauseAnimations();
      removeDesktopListener();
      removeMotionListener();
      updatePhase("hidden");
    };

    const onEligibilityChange = () => {
      if (!desktopQuery.matches || reducedMotionQuery.matches) setHidden();
    };

    const startOrbit = () => {
      if (cancelled || didStartRef.current) return;

      const pointMotion = pointMotionRef.current as SvgAnimationElement | null;
      const firstTailMotion = firstTailMotionRef.current as SvgAnimationElement | null;
      const secondTailMotion = secondTailMotionRef.current as SvgAnimationElement | null;
      if (
        !pointMotion ||
        !firstTailMotion ||
        !secondTailMotion ||
        typeof pointMotion.beginElement !== "function" ||
        typeof firstTailMotion.beginElementAt !== "function" ||
        typeof secondTailMotion.beginElementAt !== "function"
      ) {
        setHidden();
        return;
      }

      didStartRef.current = true;
      observer?.disconnect();
      try {
        updatePhase("running");
        pointMotion.beginElement();
        firstTailMotion.beginElementAt(0.04);
        secondTailMotion.beginElementAt(0.08);
      } catch {
        setHidden();
      }
    };

    const queueOrbit = () => {
      if (cancelled || didStartRef.current || pendingStartFrame) return;
      pendingStartFrame = window.requestAnimationFrame(() => {
        pendingStartFrame = 0;
        startOrbit();
      });
    };

    const isSectionVisible = () => {
      const bounds = section.getBoundingClientRect();
      return (
        Math.min(bounds.right, window.innerWidth) > Math.max(bounds.left, 0) &&
        Math.min(bounds.bottom, window.innerHeight) > Math.max(bounds.top, 0)
      );
    };

    try {
      observer = new IntersectionObserver(
        (entries) => {
          if (
            entries.some(
              (entry) => entry.target === section && entry.isIntersecting && entry.intersectionRatio > 0,
            )
          ) {
            queueOrbit();
          }
        },
        { threshold: 0 },
      );
      observer.observe(section);
      removeDesktopListener = subscribeToMediaQuery(desktopQuery, onEligibilityChange);
      removeMotionListener = subscribeToMediaQuery(reducedMotionQuery, onEligibilityChange);

      if (isSectionVisible()) queueOrbit();
    } catch {
      setHidden();
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
      if (pendingStartFrame) window.cancelAnimationFrame(pendingStartFrame);
      clearSettleTimer();
      svgRef.current?.pauseAnimations();
      removeDesktopListener();
      removeMotionListener();
    };
  }, []);

  const finishSettle = () => {
    if (phaseRef.current !== "running") return;
    updatePhase("settling");
    settleTimerRef.current = window.setTimeout(() => {
      settleTimerRef.current = null;
      if (phaseRef.current === "settling") updatePhase("settled");
    }, 100);
  };

  return (
    <div
      ref={orbitRef}
      aria-hidden="true"
      data-phase={phase}
      className={`pointer-events-none text-yellow ${styles.orbit}`}
    >
      <svg
        ref={svgRef}
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 160 32"
        className={styles.svg}
      >
        <path
          d={ORBIT_PATH}
          pathLength={1}
          className={styles.arc}
          onAnimationEnd={(event) => {
            if (event.target === event.currentTarget) finishSettle();
          }}
        />
        <circle cx="12.4" cy="9" r="2.35" className={styles.point}>
          <animateMotion
            ref={(element) => {
              pointMotionRef.current = element;
            }}
            path={ORBIT_MOTION_PATH}
            dur="760ms"
            begin="indefinite"
            fill="freeze"
            calcMode="spline"
            keyTimes="0;1"
            keySplines="0.22 1 0.36 1"
          />
        </circle>
        <circle cx="12.4" cy="9" r="1.8" className={styles.firstTail}>
          <animateMotion
            ref={(element) => {
              firstTailMotionRef.current = element;
            }}
            path={ORBIT_MOTION_PATH}
            dur="720ms"
            begin="indefinite"
            fill="freeze"
            calcMode="spline"
            keyTimes="0;1"
            keySplines="0.22 1 0.36 1"
          />
        </circle>
        <circle cx="12.4" cy="9" r="1.25" className={styles.secondTail}>
          <animateMotion
            ref={(element) => {
              secondTailMotionRef.current = element;
            }}
            path={ORBIT_MOTION_PATH}
            dur="680ms"
            begin="indefinite"
            fill="freeze"
            calcMode="spline"
            keyTimes="0;1"
            keySplines="0.22 1 0.36 1"
          />
        </circle>
      </svg>
    </div>
  );
}
