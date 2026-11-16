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

/**
 * Dải lụa uốn lượn quanh tiêu đề: vòng lên trên "Khai tâm", luồn xuống giữa hai dòng,
 * cuộn một vòng nhỏ, vút lên trên "mở lối" rồi vòng xuống ôm dòng dưới và bay ra phải.
 */
const SILK_PATH =
  "M -30 215 " +
  "C 20 120, 80 22, 190 18 " +
  "C 300 14, 320 118, 372 156 " +
  "C 420 190, 486 196, 512 160 " +
  "C 536 126, 506 92, 474 104 " +
  "C 440 117, 452 170, 506 178 " +
  "C 610 194, 640 36, 770 24 " +
  "C 878 14, 930 104, 900 182 " +
  "C 872 254, 770 300, 640 296 " +
  "C 520 292, 430 250, 320 270 " +
  "C 230 286, 170 312, 120 300";

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
  const silkGoldId = ribbonId + "-silk-gold";
  const silkEdgeId = ribbonId + "-silk-edge";
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
          <mask
            id={ribbonRevealId}
            maskUnits="userSpaceOnUse"
            maskContentUnits="userSpaceOnUse"
            x="-80"
            y="-80"
            width="1160"
            height="480"
          >
            <rect x="-80" y="-80" width="1160" height="480" fill="black" />
            <path
              className={styles.ribbonReveal}
              data-ribbon-draw="true"
              d={SILK_PATH}
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
          <linearGradient id={silkGoldId} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1000" y2="0">
            <stop offset="0%" stopColor="#fff2c1" />
            <stop offset="12%" stopColor="#f7d97f" />
            <stop offset="24%" stopColor="#e1a73a" />
            <stop offset="36%" stopColor="#fff0b1" />
            <stop offset="50%" stopColor="#f2c860" />
            <stop offset="62%" stopColor="#fff6d6" />
            <stop offset="74%" stopColor="#e6ac3f" />
            <stop offset="87%" stopColor="#ffe9a0" />
            <stop offset="100%" stopColor="#f5cf6a" />
          </linearGradient>
          <linearGradient id={silkEdgeId} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1000" y2="0">
            <stop offset="0%" stopColor="#b77a1f" />
            <stop offset="50%" stopColor="#9c6416" />
            <stop offset="100%" stopColor="#b77a1f" />
          </linearGradient>
        </defs>
        <g mask={"url(#" + ribbonRevealId + ")"} className={styles.silkFlow}>
          {/* Bóng mờ dưới dải lụa */}
          <path className={styles.silkShadow} d={SILK_PATH} transform="translate(0 7)" />
          {/* Mép lụa đậm hơn để dải có độ dày */}
          <path className={styles.silkEdge} d={SILK_PATH} stroke={`url(#${silkEdgeId})`} />
          {/* Mặt lụa sáng như chữ */}
          <path className={styles.silkFace} d={SILK_PATH} stroke={`url(#${silkGoldId})`} />
          {/* Nếp xoắn: các đoạn mặt trái của lụa xen kẽ */}
          <path className={styles.silkTwist} d={SILK_PATH} pathLength={1} />
          {/* Gân sáng chạy dọc giữa dải */}
          <path className={styles.silkCrease} d={SILK_PATH} transform="translate(0 -3)" />
          <path
            className={styles.ribbonGlint}
            data-ribbon-glint="true"
            d={SILK_PATH}
            pathLength={1}
          />
          <path className={styles.silkSheen} d={SILK_PATH} pathLength={1} />
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
