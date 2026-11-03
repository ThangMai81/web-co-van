"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import styles from "./MissionHeroMetallicSweep.module.css";

const MOTION_QUERY =
  "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const MISSION_RIBBON_PATH =
  "M 40 7 C 240 -2, 622 2, 828 15 C 928 24, 982 51, 984 88 C 987 112, 979 134, 970 150 C 991 165, 998 187, 990 209 C 980 237, 951 255, 922 264 C 788 270, 606 269, 438 267 C 270 265, 140 265, 40 265";

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

export function MissionHeroMetallicSweep({
  children,
}: {
  children: ReactNode;
}) {
  const ribbonTaperId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const titleRef = useRef<HTMLSpanElement>(null);
  const hasStartedRef = useRef(false);
  const disabledRef = useRef(false);

  useEffect(() => {
    const title = titleRef.current;
    if (!title || disabledRef.current) return;
    if (
      typeof window.matchMedia !== "function" ||
      typeof CSS === "undefined" ||
      typeof CSS.supports !== "function"
    ) {
      disabledRef.current = true;
      return;
    }

    let motionQuery: MediaQueryList;
    let revealMask: Element | null = null;
    try {
      if (typeof title.closest === "function") {
        revealMask = title.closest(
          '[data-hero-line-mask="release-overflow"]',
        );
      }
      motionQuery = window.matchMedia(MOTION_QUERY);
      const supportsClippedText =
        CSS.supports("background-clip", "text") ||
        CSS.supports("-webkit-background-clip", "text");
      const supportsRibbon =
        CSS.supports("clip-path", "inset(0)") &&
        CSS.supports("stroke-dasharray", "1") &&
        CSS.supports("stroke-dashoffset", "1");
      const ribbonPaths = title.querySelectorAll("[data-ribbon-draw]");
      if (
        !motionQuery.matches ||
        !supportsClippedText ||
        !supportsRibbon ||
        ribbonPaths.length !== 3 ||
        !revealMask
      ) {
        if (!motionQuery.matches && hasStartedRef.current) {
          title.classList.remove(styles.sweepActive);
          revealMask?.removeAttribute("data-motion-ready");
        }
        disabledRef.current = true;
        return;
      }
    } catch {
      disabledRef.current = true;
      return;
    }

    const removeMediaListeners: Array<() => void> = [];
    const disableSweep = () => {
      if (disabledRef.current) return;
      disabledRef.current = true;
      try {
        title.classList.remove(styles.sweepActive);
        revealMask.removeAttribute("data-motion-ready");
      } catch {
        // Static high-contrast text remains the fallback.
      }
      for (const removeListener of removeMediaListeners.splice(0)) {
        try {
          removeListener();
        } catch {
          // Continue cleaning up remaining media listeners.
        }
      }
    };

    try {
      removeMediaListeners.push(
        subscribeToMediaQuery(motionQuery, () => {
          try {
            if (!motionQuery.matches) disableSweep();
          } catch {
            disableSweep();
          }
        }),
      );
      if (!hasStartedRef.current) {
        title.classList.add(styles.sweepActive);
        revealMask.setAttribute("data-motion-ready", "true");
        hasStartedRef.current = true;
      }
    } catch {
      disableSweep();
    }

    return () => {
      for (const removeListener of removeMediaListeners.splice(0)) {
        try {
          removeListener();
        } catch {
          // The title node is removed with its component.
        }
      }
    };
  }, []);

  return (
    <span ref={titleRef} className={styles.metallicTitle}>
      <svg
        className={styles.ribbon}
        viewBox="0 0 1000 272"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <clipPath id={ribbonTaperId} clipPathUnits="userSpaceOnUse">
            <rect x="124" y="-100" width="976" height="500" />
            <path d="M 40 7 L 124 -19 L 124 33 Z M 40 265 L 124 239 L 124 291 Z" />
          </clipPath>
          <linearGradient id="mission-ribbon-underside" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#372408" stopOpacity="0" />
            <stop offset="4%" stopColor="#372408" stopOpacity="0" />
            <stop offset="10%" stopColor="#694510" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#372408" stopOpacity="0.92" />
          </linearGradient>
          <linearGradient id="mission-ribbon-gold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#e1b14c" stopOpacity="0" />
            <stop offset="4%" stopColor="#e1b14c" stopOpacity="0" />
            <stop offset="10%" stopColor="#fff0b5" />
            <stop offset="25%" stopColor="#bd8426" />
            <stop offset="40%" stopColor="#f5d276" />
            <stop offset="55%" stopColor="#fff4c8" />
            <stop offset="68%" stopColor="#a46a1b" />
            <stop offset="84%" stopColor="#e3b249" />
            <stop offset="100%" stopColor="#9e6519" />
          </linearGradient>
          <linearGradient id="mission-ribbon-highlight" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fffbe8" stopOpacity="0" />
            <stop offset="4%" stopColor="#fffbe8" stopOpacity="0" />
            <stop offset="10%" stopColor="#fffbe8" stopOpacity="0.94" />
            <stop offset="100%" stopColor="#fff1bb" stopOpacity="0.78" />
          </linearGradient>
        </defs>
        <g clipPath={`url(#${ribbonTaperId})`}>
          <path
            className={`${styles.ribbonLayer} ${styles.ribbonUnderside}`}
            data-ribbon-draw="true"
            pathLength={1}
            transform="translate(0 4)"
            d={MISSION_RIBBON_PATH}
          />
          <path
            className={`${styles.ribbonLayer} ${styles.ribbonPath}`}
            data-ribbon-draw="true"
            pathLength={1}
            d={MISSION_RIBBON_PATH}
          />
          <path
            className={`${styles.ribbonLayer} ${styles.ribbonHighlight}`}
            data-ribbon-draw="true"
            pathLength={1}
            transform="translate(0 -4)"
            d={MISSION_RIBBON_PATH}
          />
        </g>
      </svg>

      <span className={styles.metallicText}>{children}</span>
    </span>
  );
}
