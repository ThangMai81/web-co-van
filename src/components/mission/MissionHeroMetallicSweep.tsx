"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import styles from "./MissionHeroMetallicSweep.module.css";

const MOTION_QUERY =
  "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const MISSION_RIBBON_PATH =
  "M 72 94 C 184 98, 280 119, 374 148 " +
  "C 426 164, 473 177, 508 183 C 521 186, 537 180, 555 168 " +
  "C 590 143, 625 129, 665 134 C 759 147, 850 196, 928 240";
const MISSION_RIBBON_BAND_PATH =
  "M 72 92 C 184 95, 280 114, 374 140 " +
  "C 427 156, 474 167, 508 173 C 523 176, 539 171, 555 159 " +
  "C 590 134, 625 119, 665 124 C 759 136, 850 184, 928 236 " +
  "C 934 240, 931 247, 924 243 C 850 204, 759 161, 664 151 " +
  "C 623 147, 590 162, 555 185 C 539 197, 522 202, 507 198 " +
  "C 474 189, 427 174, 373 158 C 279 131, 183 106, 72 97 " +
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
      const supportsRibbon =
        typeof SVGMaskElement !== "undefined" &&
        CSS.supports("clip-path", "inset(0)") &&
        CSS.supports("stroke-dasharray", "1") &&
        CSS.supports("stroke-dashoffset", "1");
      const ribbonPaths = title.querySelectorAll("[data-ribbon-draw]");
      if (
        !motionQuery.matches ||
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

      <span className={styles.metallicText}>{children}</span>
    </span>
  );
}
