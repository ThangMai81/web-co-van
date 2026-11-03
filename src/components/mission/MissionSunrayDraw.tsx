"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./MissionSunrayDraw.module.css";

const MOTION_QUERY =
  "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

const RAY_PATHS = [
  "M500 250 L500 0",
  "M500 250 L710 20",
  "M500 250 L1000 100",
  "M500 250 L1000 250",
  "M500 250 L1000 400",
  "M500 250 L710 480",
  "M500 250 L500 500",
  "M500 250 L290 480",
  "M500 250 L0 400",
  "M500 250 L0 250",
  "M500 250 L0 100",
  "M500 250 L290 20",
];

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

export function MissionSunrayDraw({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [drawActive, setDrawActive] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (
      !card ||
      typeof window.matchMedia !== "function" ||
      typeof IntersectionObserver === "undefined"
    ) {
      return;
    }

    let motionQuery: MediaQueryList;
    try {
      motionQuery = window.matchMedia(MOTION_QUERY);
      if (!motionQuery.matches) return;
    } catch {
      return;
    }

    let canAnimate = true;
    let started = false;
    let observer: IntersectionObserver | null = null;
    let removeMediaListener = () => {};

    const stopObservation = () => {
      observer?.disconnect();
      observer = null;
    };

    const disableMotion = () => {
      if (!canAnimate) return;
      canAnimate = false;
      stopObservation();
      setDrawActive(false);
      try {
        removeMediaListener();
      } catch {
        // The rays remain fully drawn as a static decoration.
      }
    };

    try {
      removeMediaListener = subscribeToMediaQuery(motionQuery, () => {
        try {
          if (!motionQuery.matches) disableMotion();
        } catch {
          disableMotion();
        }
      });
      observer = new IntersectionObserver(
        (entries) => {
          if (!canAnimate || started) return;
          const entered = entries.some(
            (entry) => entry.target === card && entry.isIntersecting,
          );
          if (!entered) return;

          started = true;
          setDrawActive(true);
          stopObservation();
        },
        { threshold: 0.15 },
      );
      observer.observe(card);
    } catch {
      stopObservation();
      canAnimate = false;
      try {
        removeMediaListener();
      } catch {
        // Keep the rays in their static fallback state.
      }
    }

    return () => {
      canAnimate = false;
      stopObservation();
      try {
        removeMediaListener();
      } catch {
        // The component is being removed.
      }
    };
  }, []);

  return (
    <div ref={cardRef} className={["relative", className].join(" ")}>
      <svg
        aria-hidden="true"
        focusable="false"
        className={[
          "pointer-events-none absolute inset-0 h-full w-full text-blue",
          styles.sunrays,
          drawActive ? styles.drawActive : "",
        ]
          .filter(Boolean)
          .join(" ")}
        viewBox="0 0 1000 500"
        preserveAspectRatio="none"
      >
        <g>
          {RAY_PATHS.map((path, index) => (
            <path
              key={path}
              className={styles.rayPath}
              d={path}
              pathLength={1}
              stroke="currentColor"
              opacity={index % 2 === 0 ? 0.2 : 0.13}
            />
          ))}
        </g>
      </svg>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
