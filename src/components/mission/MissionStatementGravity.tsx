"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./MissionStatementGravity.module.css";

type MissionStatementGravityProps = {
  children: ReactNode;
  className: string;
};

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

export function MissionStatementGravity({
  children,
  className,
}: MissionStatementGravityProps) {
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const hasStartedRef = useRef(false);
  const [motionActive, setMotionActive] = useState(false);

  useEffect(() => {
    const paragraph = paragraphRef.current;
    if (
      !paragraph ||
      typeof window.matchMedia !== "function" ||
      typeof IntersectionObserver === "undefined"
    ) {
      return;
    }

    let desktopQuery: MediaQueryList;
    let finePointerQuery: MediaQueryList;
    let reducedMotionQuery: MediaQueryList;
    try {
      desktopQuery = window.matchMedia("(min-width: 1024px)");
      finePointerQuery = window.matchMedia("(pointer: fine)");
      reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    } catch {
      return;
    }

    let eligible =
      desktopQuery.matches &&
      finePointerQuery.matches &&
      !reducedMotionQuery.matches;
    let disposed = false;
    let setupFailed = false;
    let observer: IntersectionObserver | null = null;
    const removeMediaListeners: Array<() => void> = [];

    const startObserver = () => {
      if (
        !eligible ||
        disposed ||
        setupFailed ||
        hasStartedRef.current ||
        observer
      ) {
        return;
      }

      try {
        observer = new IntersectionObserver(
          (entries) => {
            if (!eligible || disposed || hasStartedRef.current) return;
            const entered = entries.some(
              (entry) => entry.target === paragraph && entry.isIntersecting,
            );
            if (!entered) return;

            hasStartedRef.current = true;
            setMotionActive(true);
            observer?.disconnect();
            observer = null;
          },
          { threshold: 0.15 },
        );
        observer.observe(paragraph);
      } catch {
        setupFailed = true;
        observer?.disconnect();
        observer = null;
        removeMediaListeners.splice(0).forEach((remove) => remove());
      }
    };

    const updateEligibility = () => {
      const nextEligibility =
        desktopQuery.matches &&
        finePointerQuery.matches &&
        !reducedMotionQuery.matches;
      if (nextEligibility === eligible) return;

      eligible = nextEligibility;
      if (!eligible) {
        observer?.disconnect();
        observer = null;
        setMotionActive(false);
        return;
      }

      startObserver();
    };

    try {
      for (const query of [
        desktopQuery,
        finePointerQuery,
        reducedMotionQuery,
      ]) {
        removeMediaListeners.push(
          subscribeToMediaQuery(query, updateEligibility),
        );
      }
      startObserver();
    } catch {
      setupFailed = true;
      // Assignments inside startObserver are not reflected in this catch
      // branch's control-flow narrowing, so preserve the nullable observer
      // type explicitly while cleaning up a partially created observer.
      const failedObserver = observer as IntersectionObserver | null;
      failedObserver?.disconnect();
      observer = null;
      removeMediaListeners.splice(0).forEach((remove) => remove());
    }

    return () => {
      disposed = true;
      observer?.disconnect();
      removeMediaListeners.forEach((remove) => remove());
    };
  }, []);

  return (
    <p
      ref={paragraphRef}
      className={[className, motionActive ? styles.gravityActive : ""]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </p>
  );
}
