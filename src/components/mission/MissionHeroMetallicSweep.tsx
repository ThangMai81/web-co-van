"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import styles from "./MissionHeroMetallicSweep.module.css";

const MOTION_QUERY =
  "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const MOTION_QUERY_SETTLE_MS = 5000;
const MISSION_RIBBON_PATH =
  "M 72 94 C 184 98, 280 119, 374 148 " +
  "C 426 164, 473 177, 508 183 C 521 186, 537 180, 555 168 " +
  "C 590 143, 625 129, 665 134 C 759 147, 850 196, 928 240";
const MISSION_RIBBON_BAND_PATH =
  "M 72 92 C 184 95, 280 110, 374 136 " +
  "C 427 152, 474 163, 508 169 C 523 172, 539 167, 555 155 " +
  "C 590 130, 625 115, 665 120 C 759 132, 850 180, 928 236 " +
  "C 934 240, 931 247, 924 243 C 850 208, 759 165, 664 155 " +
  "C 623 151, 590 166, 555 189 C 539 201, 522 206, 507 202 " +
  "C 474 193, 427 178, 373 162 C 279 135, 183 110, 72 97 " +
  "C 66 96, 66 92, 72 92 Z";
const MISSION_RIBBON_UNDERPASS_PATH =
  "M 458 144 C 493 157, 531 177, 575 202 " +
  "C 583 207, 579 213, 571 209 C 526 187, 492 166, 454 151 " +
  "C 448 148, 452 142, 458 144 Z";

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
        !revealMask ||
        (!motionQuery.matches && !hasStartedRef.current)
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
    const scheduleSweepDisable = () => {
      if (pendingDisableTimer !== null) return;
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
          return;
        }
        scheduleSweepDisable();
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
      if (!motionQuery.matches) syncMotionEligibility();
      if (!hasStartedRef.current) {
        setSweepActive(true);
        revealMask.setAttribute("data-motion-ready", "true");
        hasStartedRef.current = true;
      }
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
            <feComposite
              in="SourceGraphic"
              in2="metallicSpecularInside"
              operator="arithmetic"
              k1="0"
              k2="1"
              k3="0.42"
              k4="0"
            />
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
            transform="translate(0 12)"
          />
          <path
            className={styles.ribbonUnderside}
            d={MISSION_RIBBON_UNDERPASS_PATH}
          />
          <path className={styles.ribbonPath} d={MISSION_RIBBON_BAND_PATH} />
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
