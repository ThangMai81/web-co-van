"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import styles from "./MissionHeroMetallicSweep.module.css";

const MOTION_QUERY =
  "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const MISSION_RIBBON_PATH =
  "M 52 146 C 34 117, 40 81, 72 57 " +
  "C 108 28, 169 19, 236 29 C 314 40, 379 64, 446 74 " +
  "C 510 82, 557 69, 615 48 C 689 22, 784 23, 856 42 " +
  "C 917 57, 950 89, 950 119 C 951 138, 934 153, 914 158 " +
  "C 770 148, 650 146, 600 160 C 550 174, 230 172, 82 166 " +
  "C 68 170, 60 177, 60 184 C 66 172, 73 164, 82 160 " +
  "C 230 154, 550 146, 600 160 C 650 174, 800 176, 920 163 " +
  "C 945 173, 958 192, 952 217 C 944 247, 917 274, 879 292 " +
  "C 830 314, 765 306, 694 292 C 612 277, 531 282, 449 295 " +
  "C 365 307, 283 307, 210 294 C 140 282, 84 260, 59 237 " +
  "C 40 218, 43 192, 60 176";
const MISSION_RIBBON_BAND_PATH =
  "M 52 146 C 34 117, 40 81, 72 57 " +
  "C 108 28, 169 19, 236 29 C 314 40, 379 64, 446 74 " +
  "C 510 82, 557 69, 615 48 C 689 22, 784 23, 856 42 " +
  "C 917 57, 950 89, 950 119 C 951 138, 934 153, 914 158 " +
  "C 770 148, 650 146, 600 160 C 550 174, 230 172, 82 166 " +
  "C 230 164, 550 166, 600 152 C 650 138, 770 140, 914 150 " +
  "C 935 146, 944 132, 941 118 C 937 92, 908 66, 851 52 " +
  "C 779 34, 691 36, 624 58 C 557 75, 510 84, 443 84 " +
  "C 375 72, 314 52, 238 41 C 175 33, 121 44, 85 69 " +
  "C 57 90, 52 118, 64 142 C 61 145, 56 147, 52 146 Z";
const MISSION_RIBBON_SECOND_BAND_PATH =
  "M 82 160 C 230 154, 550 146, 600 160 " +
  "C 650 174, 800 176, 920 163 C 945 173, 958 192, 952 217 " +
  "C 944 247, 917 274, 879 292 C 830 314, 765 306, 694 292 " +
  "C 612 277, 531 282, 449 295 C 365 307, 283 307, 210 294 " +
  "C 140 282, 84 260, 59 237 C 40 218, 43 192, 60 176 " +
  "C 66 171, 73 168, 81 167 C 66 185, 64 201, 71 217 " +
  "C 80 238, 102 253, 131 264 C 183 282, 246 291, 313 293 " +
  "C 394 298, 470 285, 548 276 C 618 270, 688 278, 757 289 " +
  "C 812 299, 852 299, 879 284 C 903 260, 923 238, 930 216 " +
  "C 937 194, 930 177, 916 155 C 800 168, 650 166, 600 152 " +
  "C 550 138, 230 146, 82 160 Z";
const MISSION_RIBBON_UNDERSIDE_PATH =
  "M 950 214 C 942 243, 916 268, 879 286 C 830 306, 765 299, 694 285 " +
  "C 612 270, 531 275, 449 288 C 365 300, 283 300, 210 287 " +
  "C 140 275, 84 254, 60 232 C 52 222, 52 208, 58 193 " +
  "C 58 208, 67 223, 84 236 C 112 255, 157 271, 212 279 " +
  "C 283 290, 357 291, 439 278 C 521 265, 597 262, 683 277 " +
  "C 751 289, 812 292, 864 274 C 897 258, 921 234, 930 212 Z";
const MISSION_RIBBON_FOLD_PATH =
  "M 586 160 C 594 153, 604 153, 612 160 C 617 164, 616 167, 612 169 " +
  "L 606 165 C 608 163, 606 160, 602 159 C 598 158, 594 160, 590 163 Z";

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
        viewBox="0 0 1000 320"
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
          {/* The lower swash sits behind the upper at the single inter-line crossing. */}
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
