"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import styles from "./MissionHeroMetallicSweep.module.css";

const MOTION_QUERY =
  "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const MISSION_RIBBON_PATH =
  "M 26 218 C 48 197, 73 171, 99 166 C 236 154, 389 140, 540 126 C 670 112, 785 101, 856 90 C 904 86, 941 62, 968 31 C 988 9, 1009 27, 1004 49 C 1000 69, 971 91, 946 108 C 929 119, 918 131, 910 136";
const MISSION_RIBBON_BAND_PATH =
  "M 26 218 C 48 195, 73 169, 99 159 C 236 148, 389 132, 540 116 C 670 103, 785 91, 856 80 C 903 74, 941 50, 968 28 C 989 7, 1009 23, 1006 45 C 1003 67, 973 91, 946 108 C 930 118, 918 129, 910 136 C 890 126, 870 112, 850 101 C 780 111, 670 125, 540 137 C 389 151, 236 166, 99 173 C 73 188, 48 219, 26 218 Z";
const MISSION_RIBBON_UNDERSIDE_PATH =
  "M 977 31 C 990 19, 1005 29, 1001 47 C 996 68, 969 90, 946 107 C 929 120, 917 131, 910 136 C 920 117, 937 99, 953 84 C 971 66, 987 49, 977 31 Z";
const MISSION_RIBBON_FOLD_PATH =
  "M 962 38 C 975 32, 987 42, 981 56 C 974 72, 951 91, 932 110 L 910 136 C 920 112, 934 92, 949 73 C 961 58, 970 47, 962 38 Z";

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
  const ribbonBandId = ribbonTaperId + "-band";
  const ribbonRevealId = ribbonTaperId + "-reveal";
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
          <clipPath id={ribbonTaperId} clipPathUnits="userSpaceOnUse">
            <rect x="99" y="-100" width="1001" height="500" />
            <path d="M 26 218 L 99 159 L 99 173 Z" />
          </clipPath>
          <clipPath id={ribbonBandId} clipPathUnits="userSpaceOnUse">
            <path d={MISSION_RIBBON_BAND_PATH} />
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
        <g
          clipPath={"url(#" + ribbonTaperId + ")"}
          mask={"url(#" + ribbonRevealId + ")"}
        >
          <path
            className={styles.ribbonPath}
            d={MISSION_RIBBON_BAND_PATH}
          />
          <g clipPath={"url(#" + ribbonBandId + ")"}>
            <path
              className={styles.ribbonUnderside}
              d={MISSION_RIBBON_UNDERSIDE_PATH}
            />
            <path className={styles.ribbonFold} d={MISSION_RIBBON_FOLD_PATH} />
          </g>
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
