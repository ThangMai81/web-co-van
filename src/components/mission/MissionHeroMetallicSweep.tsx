"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import styles from "./MissionHeroMetallicSweep.module.css";

const MOTION_QUERY =
  "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const MOTION_QUERY_SETTLE_MS = 5000;
const MISSION_RIBBON_PATH =
  "M 0 118 C 82 54, 168 15, 270 18 " +
  "C 402 22, 514 88, 640 84 C 758 80, 855 21, 932 34 " +
  "C 990 44, 1009 92, 978 125 C 947 158, 900 168, 846 160 " +
  "C 758 147, 688 128, 616 140 C 568 148, 530 165, 500 168 " +
  "C 420 174, 341 190, 260 202 C 170 212, 82 160, 12 225 " +
  "C 12 238, 20 255, 31 265 C 125 310, 219 305, 320 300 " +
  "C 430 278, 528 292, 640 300 C 764 310, 880 306, 986 186";
const MISSION_RIBBON_BAND_PATH =
  "M 18 118 C 96 55, 181 14, 270 3 " +
  "C 394 -10, 516 58, 648 65 C 770 72, 876 4, 945 22 " +
  "C 1003 41, 1008 102, 960 132 C 902 168, 814 118, 720 114 " +
  "C 628 110, 556 145, 500 163 C 420 180, 350 214, 278 222 " +
  "C 170 232, 50 223, 9 167 C 1 199, 5 236, 31 265 " +
  "C 90 292, 176 319, 302 299 C 421 280, 520 272, 640 294 " +
  "C 760 316, 880 267, 986 186 C 1004 221, 940 271, 858 288 " +
  "C 780 309, 690 315, 602 299 C 520 280, 412 314, 302 304 " +
  "C 207 295, 97 315, 18 276 C 39 246, 40 205, 43 176 " +
  "C 100 184, 183 156, 278 152 C 372 150, 438 165, 500 171 " +
  "C 562 176, 612 190, 684 188 C 772 185, 830 151, 890 171 " +
  "C 936 163, 957 140, 955 112 C 953 80, 923 55, 860 60 " +
  "C 760 95, 650 125, 540 82 C 430 40, 360 22, 270 40 " +
  "C 202 50, 98 88, 18 118 Z";
const MISSION_RIBBON_UNDERPASS_PATH =
  "M 474 160 C 492 164, 508 171, 526 175 " +
  "C 531 177, 528 182, 523 180 C 506 175, 490 168, 472 165 " +
  "C 467 164, 469 159, 474 160 Z";

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
  const ribbonCrossingGapId = ribbonId + "-crossing-gap";
  const ribbonRevealId = ribbonId + "-reveal";
  const metallicFilterId = ribbonId + "-metallic-lighting";
  const titleRef = useRef<HTMLSpanElement>(null);
  const hasStartedRef = useRef(false);
  const disabledRef = useRef(false);
  const [sweepActive, setSweepActive] = useState(false);

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
    let reducedMotionQuery: MediaQueryList;
    let revealMask: Element | null = null;
    try {
      if (typeof title.closest === "function") {
        revealMask = title.closest(
          '[data-hero-line-mask="release-overflow"]',
        );
      }
      motionQuery = window.matchMedia(MOTION_QUERY);
      reducedMotionQuery = window.matchMedia(REDUCED_MOTION_QUERY);
      const ribbonMask = title.querySelector(
        `mask[id="${ribbonRevealId}"]`,
      );
      const supportsRibbon =
        ribbonMask !== null &&
        CSS.supports("mask", `url(#${ribbonRevealId})`) &&
        CSS.supports("clip-path", "inset(0)") &&
        CSS.supports("stroke-dasharray", "1") &&
        CSS.supports("stroke-dashoffset", "1");
      const ribbonPaths = title.querySelectorAll("[data-ribbon-draw]");
      if (
        !supportsRibbon ||
        ribbonPaths.length !== 1 ||
        !revealMask
      ) {
        disabledRef.current = true;
        return;
      }
    } catch {
      disabledRef.current = true;
      return;
    }

    const removeMediaListeners: Array<() => void> = [];
    let pendingDisableTimer: number | null = null;
    const clearPendingDisable = () => {
      if (pendingDisableTimer === null) return;
      const timer = pendingDisableTimer;
      pendingDisableTimer = null;
      try {
        window.clearTimeout(timer);
      } catch {
        // A stale timeout still checks eligibility before disabling motion.
      }
    };
    const disableSweep = () => {
      if (disabledRef.current) return;
      disabledRef.current = true;
      clearPendingDisable();
      try {
        setSweepActive(false);
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
    const activateSweep = () => {
      if (disabledRef.current || hasStartedRef.current) return;
      if (reducedMotionQuery.matches || !motionQuery.matches) return;
      setSweepActive(true);
      revealMask.setAttribute("data-motion-ready", "true");
      hasStartedRef.current = true;
    };
    const scheduleSweepDisable = () => {
      if (!hasStartedRef.current || pendingDisableTimer !== null) return;
      pendingDisableTimer = window.setTimeout(() => {
        pendingDisableTimer = null;
        try {
          if (!motionQuery.matches) disableSweep();
        } catch {
          disableSweep();
        }
      }, MOTION_QUERY_SETTLE_MS);
    };
    const syncMotionEligibility = () => {
      try {
        if (reducedMotionQuery.matches) {
          disableSweep();
          return;
        }
        if (motionQuery.matches) {
          clearPendingDisable();
          if (!hasStartedRef.current) activateSweep();
          return;
        }
        if (hasStartedRef.current) {
          revealMask.removeAttribute("data-motion-ready");
          scheduleSweepDisable();
        }
      } catch {
        disableSweep();
      }
    };

    try {
      removeMediaListeners.push(
        subscribeToMediaQuery(motionQuery, syncMotionEligibility),
      );
      removeMediaListeners.push(
        subscribeToMediaQuery(reducedMotionQuery, syncMotionEligibility),
      );
      syncMotionEligibility();
    } catch {
      disableSweep();
    }

    return () => {
      clearPendingDisable();
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
    <span
      ref={titleRef}
      className={`${styles.metallicTitle} ${sweepActive ? styles.sweepActive : ""}`}
    >
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
            <path d={MISSION_RIBBON_UNDERPASS_PATH} />
          </clipPath>
          <clipPath
            id={ribbonCrossingGapId}
            clipPathUnits="userSpaceOnUse"
          >
            <rect x="478" y="165" width="64" height="10" rx="5" />
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
          <filter
            id={metallicFilterId}
            x="-8%"
            y="-16%"
            width="116%"
            height="132%"
            colorInterpolationFilters="sRGB"
          >
            <feGaussianBlur
              in="SourceAlpha"
              stdDeviation="0.8"
              result="metallicBump"
            />
            <feSpecularLighting
              in="metallicBump"
              surfaceScale="2.4"
              specularConstant="0.42"
              specularExponent="20"
              lightingColor="#ffebad"
              result="metallicSpecular"
            >
              <feDistantLight azimuth="315" elevation="48" />
            </feSpecularLighting>
            <feComposite
              in="metallicSpecular"
              in2="SourceAlpha"
              operator="in"
              result="metallicSpecularInside"
            />
            <feMorphology
              in="SourceAlpha"
              operator="erode"
              radius="1"
              result="metallicBevelInset"
            />
            <feOffset
              in="metallicBevelInset"
              dx="1"
              dy="1"
              result="metallicBevelInsetLowerRight"
            />
            <feComposite
              in="SourceAlpha"
              in2="metallicBevelInsetLowerRight"
              operator="out"
              result="metallicBevelUpperLeftMask"
            />
            <feOffset
              in="metallicBevelInset"
              dx="-1"
              dy="-1"
              result="metallicBevelInsetUpperLeft"
            />
            <feComposite
              in="SourceAlpha"
              in2="metallicBevelInsetUpperLeft"
              operator="out"
              result="metallicBevelLowerRightMask"
            />
            <feFlood
              floodColor="#fff1bd"
              floodOpacity="0.72"
              result="metallicBevelChampagneSource"
            />
            <feComposite
              in="metallicBevelChampagneSource"
              in2="metallicBevelUpperLeftMask"
              operator="in"
              result="metallicBevelChampagne"
            />
            <feFlood
              floodColor="#6a431b"
              floodOpacity="0.42"
              result="metallicBevelBronzeSource"
            />
            <feComposite
              in="metallicBevelBronzeSource"
              in2="metallicBevelLowerRightMask"
              operator="in"
              result="metallicBevelBronze"
            />
            <feComposite
              in="SourceGraphic"
              in2="metallicSpecularInside"
              operator="arithmetic"
              k1="0"
              k2="1"
              k3="0.42"
              k4="0"
              result="metallicBase"
            />
            <feMerge>
              <feMergeNode in="metallicBase" />
              <feMergeNode in="metallicBevelBronze" />
              <feMergeNode in="metallicBevelChampagne" />
            </feMerge>
          </filter>
          <linearGradient id="mission-ribbon-underside" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#654111" />
            <stop offset="38%" stopColor="#2e1c09" />
            <stop offset="74%" stopColor="#1f1407" />
            <stop offset="100%" stopColor="#5a3911" />
          </linearGradient>
          <linearGradient id="mission-ribbon-extrusion" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#58370e" stopOpacity={0} />
            <stop offset="7%" stopColor="#58370e" stopOpacity={0.78} />
            <stop offset="38%" stopColor="#2a1b0b" stopOpacity={0.95} />
            <stop offset="74%" stopColor="#1c1207" stopOpacity={0.98} />
            <stop offset="93%" stopColor="#4b2e0b" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#5a3911" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="mission-ribbon-gold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f0cc70" stopOpacity={0} />
            <stop offset="4%" stopColor="#e0af49" stopOpacity={0.22} />
            <stop offset="10%" stopColor="#e0af49" />
            <stop offset="18%" stopColor="#a96a16" />
            <stop offset="36%" stopColor="#f4d270" />
            <stop offset="52%" stopColor="#fff4c5" />
            <stop offset="68%" stopColor="#9c5f12" />
            <stop offset="84%" stopColor="#f4ce65" />
            <stop offset="90%" stopColor="#efc85f" />
            <stop offset="96%" stopColor="#ba7b21" stopOpacity={0.22} />
            <stop offset="100%" stopColor="#805011" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="mission-ribbon-highlight" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fff0b1" stopOpacity={0} />
            <stop offset="6%" stopColor="#fff0b1" stopOpacity={0.12} />
            <stop offset="12%" stopColor="#fff0b1" stopOpacity={0.38} />
            <stop offset="42%" stopColor="#fff8da" stopOpacity="0.9" />
            <stop offset="68%" stopColor="#ffe29a" stopOpacity="0.6" />
            <stop offset="88%" stopColor="#fff4c4" stopOpacity={0.38} />
            <stop offset="96%" stopColor="#fff4c4" stopOpacity={0.12} />
            <stop offset="100%" stopColor="#fff4c4" stopOpacity={0} />
          </linearGradient>
        </defs>
        <g mask={"url(#" + ribbonRevealId + ")"}>
          {/* A short inter-line strand passes beneath the open S-band. */}
          <path
            className={styles.ribbonExtrusion}
            d={MISSION_RIBBON_BAND_PATH}
            transform="translate(0 4)"
          />
          <path
            className={styles.ribbonUnderside}
            d={MISSION_RIBBON_UNDERPASS_PATH}
          />
          <path className={styles.ribbonPath} d={MISSION_RIBBON_BAND_PATH} />
          <path
            className={styles.ribbonPath}
            d={MISSION_RIBBON_UNDERPASS_PATH}
            clipPath={`url(#${ribbonCrossingGapId})`}
          />
          <g clipPath={"url(#" + ribbonBandId + ")"}>
            <path className={styles.ribbonHighlight} d={MISSION_RIBBON_PATH} />
            <path
              className={styles.ribbonGlint}
              d={MISSION_RIBBON_PATH}
              pathLength={1}
            />
          </g>
        </g>
      </svg>

      <span
        className={styles.metallicText}
        style={{ filter: `url(#${metallicFilterId})` }}
      >
        {children}
      </span>
    </span>
  );
}
