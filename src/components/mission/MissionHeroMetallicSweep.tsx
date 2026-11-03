"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import styles from "./MissionHeroMetallicSweep.module.css";

const MOTION_QUERY =
  "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const MISSION_RIBBON_PATH =
  "M 52 146 C 62 122, 66 84, 76 60 C 96 40, 174 40, 292 38 C 410 36, 482 45, 520 53 C 632 50, 765 50, 900 58 C 918 59, 932 61, 942 70 C 958 86, 963 111, 952 136 C 947 151, 942 162, 940 168 C 960 190, 974 233, 948 266 C 934 281, 925 288, 919 288 C 760 287, 610 286, 460 288 C 300 289, 160 289, 82 288 C 52 286, 39 260, 52 226 C 60 202, 71 181, 82 168";
const MISSION_RIBBON_BAND_PATH =
  "M 52 146 C 62 122, 66 84, 76 60 C 96 40, 174 40, 292 38 C 410 36, 482 45, 520 53 C 632 50, 765 50, 900 58 C 918 59, 932 61, 942 70 C 958 86, 963 111, 952 136 C 947 151, 942 162, 940 168 C 944 153, 950 138, 954 121 C 960 96, 952 77, 940 70 C 932 63, 918 62, 900 61 C 765 54, 632 55, 520 61 C 482 53, 410 48, 292 54 C 174 56, 96 58, 76 60 C 66 84, 62 122, 52 146 Z";
const MISSION_RIBBON_SECOND_BAND_PATH =
  "M 950 180 C 970 201, 974 236, 948 266 C 934 281, 925 288, 919 288 C 760 287, 610 286, 460 288 C 300 289, 160 289, 82 288 C 52 286, 39 260, 52 226 C 60 202, 71 181, 82 168 C 73 188, 64 207, 62 229 C 59 255, 77 278, 82 282 C 160 282, 300 282, 460 282 C 610 280, 760 280, 919 282 C 938 264, 954 236, 957 210 C 960 190, 944 169, 930 156 C 938 163, 945 172, 950 180 Z";
const MISSION_RIBBON_UNDERSIDE_PATH =
  "M 950 188 C 966 209, 967 240, 944 268 C 929 281, 921 285, 919 285 C 760 284, 610 283, 460 285 C 300 286, 160 286, 82 285 C 67 284, 58 272, 56 260 C 65 273, 74 277, 82 277 C 160 278, 300 277, 460 277 C 610 275, 760 275, 919 277 C 938 260, 950 235, 954 210 C 955 195, 953 191, 950 188 Z";
const MISSION_RIBBON_FOLD_PATH =
  "M 930 153 C 938 149, 949 151, 956 159 C 964 168, 966 176, 961 184 L 950 180 C 953 172, 949 166, 943 162 C 938 159, 933 159, 928 163 Z";

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
  const ribbonId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const ribbonBandId = ribbonId + "-band";
  const ribbonRevealId = ribbonId + "-reveal";
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
        typeof SVGMaskElement !== "undefined" &&
        CSS.supports("clip-path", "inset(0)") &&
        CSS.supports("stroke-dasharray", "1") &&
        CSS.supports("stroke-dashoffset", "1");
      const ribbonPaths = title.querySelectorAll("[data-ribbon-draw]");
      if (
        !motionQuery.matches ||
        !supportsClippedText ||
        !supportsRibbon ||
        ribbonPaths.length !== 1 ||
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
          <clipPath id={ribbonBandId} clipPathUnits="userSpaceOnUse">
            <path d={MISSION_RIBBON_BAND_PATH} />
            <path d={MISSION_RIBBON_SECOND_BAND_PATH} />
          </clipPath>
          <mask
            id={ribbonRevealId}
            maskUnits="userSpaceOnUse"
            maskContentUnits="userSpaceOnUse"
            x="0"
            y="-80"
            width="1100"
            height="440"
          >
            <rect x="0" y="-80" width="1100" height="440" fill="black" />
            <path
              className={styles.ribbonReveal}
              data-ribbon-draw="true"
              d={MISSION_RIBBON_PATH}
              pathLength={1}
            />
          </mask>
          <linearGradient id="mission-ribbon-underside" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#654111" />
            <stop offset="38%" stopColor="#3d2910" />
            <stop offset="74%" stopColor="#2d1e0c" />
            <stop offset="100%" stopColor="#5a3911" />
          </linearGradient>
          <linearGradient id="mission-ribbon-gold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f0cc70" />
            <stop offset="18%" stopColor="#b77a20" />
            <stop offset="36%" stopColor="#f0c75e" />
            <stop offset="52%" stopColor="#fff0b1" />
            <stop offset="68%" stopColor="#ba7b21" />
            <stop offset="84%" stopColor="#efc85f" />
            <stop offset="100%" stopColor="#805011" />
          </linearGradient>
          <linearGradient id="mission-ribbon-fold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38240e" stopOpacity="0.9" />
            <stop offset="48%" stopColor="#765018" stopOpacity="0.94" />
            <stop offset="100%" stopColor="#2b1d0c" stopOpacity="0.96" />
          </linearGradient>
          <linearGradient id="mission-ribbon-highlight" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fff0b1" stopOpacity="0.38" />
            <stop offset="42%" stopColor="#fff8da" stopOpacity="0.9" />
            <stop offset="68%" stopColor="#ffe29a" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#fff4c4" stopOpacity="0.38" />
          </linearGradient>
        </defs>
        <g mask={"url(#" + ribbonRevealId + ")"}>
          {/* The lower loop sits behind the upper loop at the outside-right crossing. */}
          <path
            className={styles.ribbonPath}
            d={MISSION_RIBBON_SECOND_BAND_PATH}
          />
          <g clipPath={"url(#" + ribbonBandId + ")"}>
            <path
              className={styles.ribbonUnderside}
              d={MISSION_RIBBON_UNDERSIDE_PATH}
            />
            <path className={styles.ribbonFold} d={MISSION_RIBBON_FOLD_PATH} />
          </g>
          <path className={styles.ribbonPath} d={MISSION_RIBBON_BAND_PATH} />
          <path className={styles.ribbonHighlight} d={MISSION_RIBBON_PATH} />
          <path
            className={styles.ribbonGlint}
            d={MISSION_RIBBON_PATH}
            pathLength={1}
          />
        </g>
      </svg>

      <span className={styles.metallicText}>{children}</span>
    </span>
  );
}
