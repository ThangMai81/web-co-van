"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import styles from "./MissionHeroMetallicSweep.module.css";

const MOTION_QUERY =
  "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const MISSION_RIBBON_PATH =
  "M 56 118 C 90 68, 176 31, 292 28 C 411 25, 477 68, 512 122 C 603 163, 756 222, 890 221 C 969 220, 995 188, 960 157 C 929 129, 865 137, 791 157 C 658 193, 478 225, 323 220 C 174 216, 61 194, 53 158 C 46 128, 109 119, 219 120 C 337 121, 436 128, 512 122 C 625 118, 760 117, 895 126 C 950 131, 976 144, 960 157";
const MISSION_RIBBON_BAND_PATH =
  "M 52 118 C 86 63, 174 26, 292 22 C 409 18, 481 67, 520 121 C 632 113, 765 112, 900 122 C 953 127, 980 139, 962 154 C 935 137, 879 130, 814 126 C 698 119, 592 120, 514 129 C 438 114, 362 112, 283 114 C 189 117, 112 127, 63 137 C 46 134, 42 125, 52 118 Z";
const MISSION_RIBBON_SECOND_BAND_PATH =
  "M 512 122 C 604 165, 758 222, 891 220 C 968 219, 992 188, 959 157 C 930 129, 870 136, 793 157 C 660 193, 482 225, 325 220 C 177 216, 63 194, 54 158 C 47 131, 109 120, 218 120 C 338 121, 437 129, 512 122 L 512 138 C 426 146, 336 140, 215 136 C 99 136, 39 147, 45 170 C 55 207, 173 232, 322 236 C 483 241, 662 208, 794 172 C 870 151, 929 145, 950 170 C 976 202, 950 236, 891 237 C 758 239, 604 180, 512 138 Z";
const MISSION_RIBBON_UNDERSIDE_PATH =
  "M 512 132 C 612 177, 760 231, 891 230 C 944 230, 973 211, 968 190 C 947 210, 916 218, 880 216 C 749 213, 610 164, 512 132 Z";
const MISSION_RIBBON_FOLD_PATH =
  "M 480 121 C 493 116, 506 120, 519 130 C 532 140, 547 146, 561 148 L 551 158 C 535 153, 521 145, 509 137 C 497 129, 486 127, 476 132 Z";

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
          {/* The lower loop sits behind the upper loop at the single gap crossing. */}
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
