"use client";

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import styles from "./MissionHeroMetallicSweep.module.css";

const MOTION_QUERY =
  "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

type MissionRouteState = {
  previousPathname: string;
  entryChanged: boolean;
};

type MissionWindow = Window & {
  navigation?: EventTarget;
  __missionHeroRouteState?: MissionRouteState;
};

type NavigationEntryChange = Event & {
  from?: { url?: string } | null;
};

function normalizePathname(pathname: string) {
  return pathname.replace(/\/+$/, "") || "/";
}

function isMissionPathname(pathname: string) {
  return normalizePathname(pathname) === "/mission";
}

function initializeMissionRouteTracking(): MissionRouteState | null {
  if (typeof window === "undefined") return null;

  const missionWindow = window as MissionWindow;
  if (missionWindow.__missionHeroRouteState) {
    return missionWindow.__missionHeroRouteState;
  }

  const state: MissionRouteState = {
    previousPathname: window.location.pathname,
    entryChanged: false,
  };
  missionWindow.__missionHeroRouteState = state;
  const navigation = missionWindow.navigation;

  const recordRouteChange = (fromPathname: string, currentPathname: string) => {
    if (isMissionPathname(fromPathname) !== isMissionPathname(currentPathname)) {
      state.entryChanged = true;
    }
    state.previousPathname = currentPathname;
  };

  const handleCurrentEntryChange = (event: Event) => {
    const fromUrl = (event as NavigationEntryChange).from?.url;
    if (!fromUrl) return;

    try {
      const fromPathname = new URL(fromUrl, window.location.href).pathname;
      recordRouteChange(fromPathname, window.location.pathname);
    } catch {
      state.previousPathname = window.location.pathname;
    }
  };

  const handlePopState = () => {
    recordRouteChange(state.previousPathname, window.location.pathname);
  };

  navigation?.addEventListener("currententrychange", handleCurrentEntryChange);
  window.addEventListener("popstate", handlePopState);

  return state;
}

const missionRouteState = initializeMissionRouteTracking();

function canAnimateCurrentMissionEntry() {
  if (
    typeof PerformanceObserver === "undefined" ||
    !Array.isArray(PerformanceObserver.supportedEntryTypes) ||
    !PerformanceObserver.supportedEntryTypes.includes("paint") ||
    typeof window.performance.getEntriesByType !== "function"
  ) {
    return false;
  }

  const hasFirstContentfulPaint = window.performance
    .getEntriesByType("paint")
    .some((entry) => entry.name === "first-contentful-paint");

  const hasRouteEntrySignal =
    missionRouteState?.entryChanged === true ||
    document.querySelector(".route-progress.is-active") !== null;
  if (missionRouteState) missionRouteState.entryChanged = false;
  if (hasRouteEntrySignal || !hasFirstContentfulPaint) return true;

  const documentNavigation = window.performance.getEntriesByType("navigation")[0];
  if (!documentNavigation?.name) return false;

  try {
    const documentPathname = new URL(
      documentNavigation.name,
      window.location.href,
    ).pathname;

    return (
      normalizePathname(documentPathname) !==
      normalizePathname(window.location.pathname)
    );
  } catch {
    return false;
  }
}

function supportsMotionSetup(filterId: string, revealId: string) {
  if (typeof CSS === "undefined" || typeof CSS.supports !== "function") {
    return false;
  }

  const filter = document.getElementById(filterId);
  const svg = filter?.closest("svg");
  const revealMask = svg?.querySelector("#" + revealId);
  const glintPath = svg?.querySelector('[data-ribbon-glint="true"]');
  const supportsTextFace =
    CSS.supports("background-clip", "text") ||
    CSS.supports("-webkit-background-clip", "text");
  const supportsMetallicFilter = CSS.supports("filter", "url(#" + filterId + ")");
  const supportsRibbonGlint =
    CSS.supports("stroke-dasharray", "0.075 1.075") &&
    CSS.supports("stroke-dashoffset", "-0.925");

  return (
    supportsTextFace &&
    supportsMetallicFilter &&
    supportsRibbonGlint &&
    filter?.tagName.toLowerCase() === "filter" &&
    filter.querySelector("feSpecularLighting") !== null &&
    filter.querySelector("feMerge") !== null &&
    revealMask?.tagName.toLowerCase() === "mask" &&
    glintPath?.tagName.toLowerCase() === "path"
  );
}

const MISSION_RIBBON_PATH =
  "M 10 145 C 82 80, 158 42, 230 48 " +
  "C 314 56, 408 115, 500 170 " +
  "C 582 218, 660 274, 750 282 " +
  "C 842 290, 926 242, 992 224";
const MISSION_RIBBON_BAND_PATH =
  "M 10 145 C 82 74, 158 24, 230 30 " +
  "C 316 40, 408 108, 500 163 " +
  "C 582 211, 660 251, 750 258 " +
  "C 842 266, 930 230, 992 224 " +
  "C 938 285, 850 322, 750 304 " +
  "C 660 297, 582 225, 500 177 " +
  "C 408 122, 316 75, 230 67 " +
  "C 158 59, 82 108, 10 145 Z";
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
  const hasStartedRef = useRef(false);
  const motionDisabledRef = useRef(false);
  const [sweepActive, setSweepActive] = useState(false);

  useIsomorphicLayoutEffect(() => {
    let removeMotionQueryListener = () => {};

    try {
      if (typeof window.matchMedia !== "function") {
        motionDisabledRef.current = true;
        return;
      }
      const motionQuery = window.matchMedia(MOTION_QUERY);
      const syncMotionEligibility = () => {
        if (motionDisabledRef.current) return;

        if (!motionQuery.matches) {
          motionDisabledRef.current = true;
          if (hasStartedRef.current) setSweepActive(false);
          return;
        }

        if (hasStartedRef.current) return;

        if (
          !canAnimateCurrentMissionEntry() ||
          !supportsMotionSetup(metallicFilterId, ribbonRevealId)
        ) {
          motionDisabledRef.current = true;
          return;
        }

        if (motionQuery.matches) {
          hasStartedRef.current = true;
          setSweepActive(true);
        }
      };

      removeMotionQueryListener = subscribeToMediaQuery(
        motionQuery,
        syncMotionEligibility,
      );
      syncMotionEligibility();
      return () => {
        removeMotionQueryListener();
      };
    } catch {
      removeMotionQueryListener();
      motionDisabledRef.current = true;
      setSweepActive(false);
      return;
    }
  }, [metallicFilterId, ribbonRevealId]);

  return (
    <span
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
              surfaceScale="1.7"
              specularConstant="0.28"
              specularExponent="15"
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
              floodOpacity="0.52"
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
              floodOpacity="0.28"
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
              data-ribbon-glint="true"
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
