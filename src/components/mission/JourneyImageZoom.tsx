"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type TransitionEvent as ReactTransitionEvent,
} from "react";
import { Reveal } from "@/components/animation/Reveal";
import styles from "./JourneyImageZoom.module.css";

const MOTION_QUERY =
  "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

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

export function JourneyImageZoom({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const motionQueryRef = useRef<MediaQueryList | null>(null);
  const startedRef = useRef(false);
  const opacitySettledRef = useRef(false);
  const positionSettledRef = useRef(false);
  const [zoomActive, setZoomActive] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;

    let motionQuery: MediaQueryList;
    try {
      motionQuery = window.matchMedia(MOTION_QUERY);
    } catch {
      return;
    }

    let removeMediaListener = () => {};
    const handleMotionChange = () => {
      try {
        if (!motionQuery.matches) setZoomActive(false);
      } catch {
        setZoomActive(false);
      }
    };

    try {
      removeMediaListener = subscribeToMediaQuery(
        motionQuery,
        handleMotionChange,
      );
      motionQueryRef.current = motionQuery;
    } catch {
      motionQueryRef.current = null;
      return;
    }

    return () => {
      motionQueryRef.current = null;
      try {
        removeMediaListener();
      } catch {
        // The image remains static if listener cleanup is unavailable.
      }
    };
  }, []);

  const handleRevealTransitionEnd = (
    event: ReactTransitionEvent<HTMLDivElement>,
  ) => {
    if (startedRef.current) return;

    const frame = frameRef.current;
    const reveal = frame?.closest<HTMLElement>("[data-visible]");
    if (
      !reveal ||
      event.target !== reveal ||
      reveal.getAttribute("data-visible") !== "true"
    ) {
      return;
    }

    try {
      if (!motionQueryRef.current?.matches) return;
    } catch {
      return;
    }

    if (event.propertyName === "opacity") {
      opacitySettledRef.current = true;
    } else if (
      event.propertyName === "transform" ||
      event.propertyName === "translate"
    ) {
      positionSettledRef.current = true;
    } else {
      return;
    }

    if (!opacitySettledRef.current || !positionSettledRef.current) return;
    startedRef.current = true;
    setZoomActive(true);
  };

  return (
    <div onTransitionEnd={handleRevealTransitionEnd}>
      <Reveal direction="right">
        <div className={className}>
          <div
            ref={frameRef}
            className={[styles.zoomFrame, zoomActive ? styles.zoomActive : ""]
              .filter(Boolean)
              .join(" ")}
          >
            {children}
          </div>
        </div>
      </Reveal>
    </div>
  );
}
