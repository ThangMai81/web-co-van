"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./NextTripCtaShine.module.css";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToMotionPreference(
  query: MediaQueryList,
  listener: () => void,
) {
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

  throw new Error("Motion preference change events are unavailable");
}

export function NextTripCtaShine({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const sweepConsumedRef = useRef(false);
  const [isSweeping, setIsSweeping] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    if (
      !card ||
      sweepConsumedRef.current ||
      typeof window.matchMedia !== "function" ||
      typeof IntersectionObserver === "undefined"
    ) {
      return;
    }

    let observer: IntersectionObserver | null = null;
    let removeMotionPreferenceListener: () => void = () => {};
    let pendingTimer: number | null = null;
    let cardIsIntersecting = false;
    let disposed = false;
    let motionSuppressed = false;

    const clearPendingTimer = () => {
      if (pendingTimer === null) return;
      try {
        window.clearTimeout(pendingTimer);
      } catch {
        // A failed timer cleanup leaves the CTA usable and the sweep consumed.
      }
      pendingTimer = null;
    };

    const disconnectObserver = () => {
      const activeObserver = observer;
      observer = null;
      if (!activeObserver) return true;
      try {
        activeObserver.disconnect();
        return true;
      } catch {
        return false;
      }
    };

    const removeMotionPreferenceSubscription = () => {
      const removeListener = removeMotionPreferenceListener;
      removeMotionPreferenceListener = () => {};
      try {
        removeListener();
      } catch {
        // Motion remains suppressed if listener cleanup fails.
      }
    };

    const suppressForReducedMotion = () => {
      if (motionSuppressed) return;
      motionSuppressed = true;
      sweepConsumedRef.current = true;
      cardIsIntersecting = false;
      clearPendingTimer();
      setIsSweeping(false);
      disconnectObserver();
      removeMotionPreferenceSubscription();
    };

    const cleanup = () => {
      disposed = true;
      cardIsIntersecting = false;
      clearPendingTimer();
      disconnectObserver();
      removeMotionPreferenceSubscription();
    };

    try {
      const motionPreference = window.matchMedia(REDUCED_MOTION_QUERY);
      removeMotionPreferenceListener = subscribeToMotionPreference(
        motionPreference,
        () => {
          if (motionPreference.matches) suppressForReducedMotion();
        },
      );

      if (motionPreference.matches) {
        suppressForReducedMotion();
        return cleanup;
      }

      observer = new IntersectionObserver(
        (entries) => {
          if (disposed || sweepConsumedRef.current) return;
          if (motionPreference.matches) {
            suppressForReducedMotion();
            return;
          }

          for (const entry of entries) {
            if (entry.target !== card) continue;

            cardIsIntersecting = entry.isIntersecting;
            if (!cardIsIntersecting) {
              clearPendingTimer();
              continue;
            }
            if (pendingTimer !== null) continue;

            try {
              pendingTimer = window.setTimeout(() => {
                pendingTimer = null;
                if (
                  disposed ||
                  sweepConsumedRef.current ||
                  !cardIsIntersecting
                ) {
                  return;
                }

                if (motionPreference.matches) {
                  suppressForReducedMotion();
                  return;
                }

                sweepConsumedRef.current = true;
                cardIsIntersecting = false;
                setIsSweeping(true);
                if (!disconnectObserver()) setIsSweeping(false);
              }, 700);
            } catch {
              sweepConsumedRef.current = true;
              cardIsIntersecting = false;
              setIsSweeping(false);
              disconnectObserver();
              removeMotionPreferenceSubscription();
            }
          }
        },
        { root: null, rootMargin: "0px", threshold: 0.15 },
      );
      observer.observe(card);
    } catch {
      sweepConsumedRef.current = true;
      setIsSweeping(false);
      cleanup();
      return;
    }

    return cleanup;
  }, []);

  return (
    <div
      ref={cardRef}
      className={className}
      data-shine-active={isSweeping ? "true" : undefined}
    >
      <span className={styles.sheenClip} aria-hidden="true">
        <span className={styles.sheenBand} />
      </span>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
