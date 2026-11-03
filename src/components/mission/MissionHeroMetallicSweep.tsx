"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import styles from "./MissionHeroMetallicSweep.module.css";

const MOTION_QUERY =
  "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const MISSION_RIBBON_PATH =
  "M 40 7 C 240 -2, 622 2, 828 15 C 928 24, 982 51, 984 88 C 987 112, 979 134, 970 150 C 991 165, 998 187, 990 209 C 980 237, 951 255, 922 264 C 788 270, 606 269, 438 267 C 270 265, 140 265, 40 265";
// The closed outline follows the outer edge forward and returns along the inner edge to two pointed left tips.
const MISSION_RIBBON_BAND_PATH =
  "M 40 7 C 66 3, 96 -8, 124 -14 C 310 -17, 615 -13, 824 -4 C 914 4, 978 28, 1000 68 C 1015 96, 1003 130, 982 151 C 1009 171, 1022 198, 1004 225 C 984 254, 951 274, 920 280 C 768 288, 608 284, 438 278 C 280 274, 164 270, 124 270 C 91 270, 62 267, 40 265 C 64 265, 92 255, 124 249 C 275 245, 602 251, 920 249 C 944 242, 956 222, 964 204 C 975 184, 963 165, 945 151 C 960 130, 967 103, 963 84 C 953 56, 911 39, 824 31 C 615 23, 310 26, 124 29 C 94 29, 64 20, 40 7 Z";
const MISSION_RIBBON_FOLD_PATH =
  "M 978 146 C 1000 165, 1013 188, 1005 207 C 999 225, 980 240, 958 253 L 944 248 C 962 230, 975 211, 976 195 C 977 178, 960 162, 942 152 Z";

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
            <rect x="124" y="-100" width="976" height="500" />
            <path d="M 40 7 L 124 -19 L 124 33 Z M 40 265 L 124 239 L 124 291 Z" />
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
            className={styles.ribbonUnderside}
            transform="translate(0 4)"
            d={MISSION_RIBBON_BAND_PATH}
          />
          <path
            className={styles.ribbonPath}
            d={MISSION_RIBBON_BAND_PATH}
          />
          <g clipPath={"url(#" + ribbonBandId + ")"}>
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
