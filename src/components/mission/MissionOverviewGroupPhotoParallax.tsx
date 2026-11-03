"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import styles from "./MissionOverviewGroupPhotoParallax.module.css";

const TARGET_TRAVEL_PX = 40;
const MAX_TRAVEL_PX = 48;
const NEAR_VIEWPORT_ROOT_MARGIN = "150px 0px";
const OFFSET_PROPERTY = "--mission-overview-photo-offset";

function subscribeToMediaQuery(query: MediaQueryList, listener: () => void) {
  if (typeof query.addEventListener === "function") {
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

export function MissionOverviewGroupPhotoParallax() {
  const imageWindowRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const imageWindow = imageWindowRef.current;
    const image = imageRef.current;
    const frame = imageWindow?.parentElement;
    if (!imageWindow || !image || !frame) return;
    const activeImageWindow = imageWindow!;
    const activeImage = image!;
    const activeFrame = frame!;

    if (
      typeof window.matchMedia !== "function" ||
      typeof IntersectionObserver === "undefined" ||
      typeof window.requestAnimationFrame !== "function" ||
      typeof window.cancelAnimationFrame !== "function"
    ) {
      return;
    }

    let desktopQuery: MediaQueryList;
    let finePointerQuery: MediaQueryList;
    let normalMotionQuery: MediaQueryList;
    try {
      desktopQuery = window.matchMedia("(min-width: 1024px)");
      finePointerQuery = window.matchMedia("(pointer: fine)");
      normalMotionQuery = window.matchMedia(
        "(prefers-reduced-motion: no-preference)",
      );
    } catch {
      return;
    }

    let observer: IntersectionObserver | null = null;
    let motionEligible = false;
    let nearViewport = false;
    let scrollListenerAttached = false;
    let resizeListenerAttached = false;
    let pendingFrame: number | null = null;
    let setupFailed = false;
    let disposed = false;
    const removeMediaListeners: Array<() => void> = [];

    const resetImage = () => {
      activeImage.style.removeProperty(OFFSET_PROPERTY);
      activeImage.classList.remove(styles.motionImage);
      activeImageWindow.classList.remove(styles.motionWindow);
    };

    const cancelPendingFrame = () => {
      if (pendingFrame === null) return;
      window.cancelAnimationFrame(pendingFrame);
      pendingFrame = null;
    };

    const clearMediaListeners = () => {
      for (const removeListener of removeMediaListeners.splice(0)) {
        try {
          removeListener();
        } catch {
          // A failed cleanup must not prevent the image from returning to static.
        }
      }
    };

    const stopNearViewportWork = () => {
      nearViewport = false;
      if (scrollListenerAttached) {
        window.removeEventListener("scroll", scheduleUpdate);
        scrollListenerAttached = false;
      }
      if (resizeListenerAttached) {
        window.removeEventListener("resize", scheduleUpdate);
        resizeListenerAttached = false;
      }
      cancelPendingFrame();
      resetImage();
    };

    const stopMotion = () => {
      motionEligible = false;
      try {
        observer?.disconnect();
      } catch {
        // The static image remains the safe fallback if observer cleanup fails.
      }
      observer = null;
      stopNearViewportWork();
    };

    const failClosed = () => {
      if (setupFailed) return;
      setupFailed = true;
      stopMotion();
      clearMediaListeners();
    };

    function scheduleUpdate() {
      if (
        !motionEligible ||
        !nearViewport ||
        disposed ||
        pendingFrame !== null
      ) {
        return;
      }

      try {
        pendingFrame = window.requestAnimationFrame(() => {
          pendingFrame = null;
          if (!motionEligible || !nearViewport || disposed) return;

          try {
            const frameBounds = activeFrame.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            if (frameBounds.height <= 0 || viewportHeight <= 0) {
              activeImage.style.setProperty(OFFSET_PROPERTY, "0px");
              return;
            }

            const progress = Math.min(
              1,
              Math.max(
                0,
                (viewportHeight / 2 - frameBounds.top) / frameBounds.height,
              ),
            );
            const offset = Math.min(
              MAX_TRAVEL_PX,
              progress * TARGET_TRAVEL_PX,
            );
            activeImage.style.setProperty(OFFSET_PROPERTY, `${offset}px`);
          } catch {
            failClosed();
          }
        });
      } catch {
        failClosed();
      }
    }

    function enterNearViewport() {
      if (nearViewport || !motionEligible || disposed || setupFailed) return;
      nearViewport = true;
      activeImageWindow.classList.add(styles.motionWindow);
      activeImage.classList.add(styles.motionImage);

      try {
        window.addEventListener("scroll", scheduleUpdate, { passive: true });
        scrollListenerAttached = true;
        window.addEventListener("resize", scheduleUpdate, { passive: true });
        resizeListenerAttached = true;
        scheduleUpdate();
      } catch {
        failClosed();
      }
    }

    function handleIntersection(entries: IntersectionObserverEntry[]) {
      if (!motionEligible || disposed || setupFailed) return;
      const frameEntry = entries.find((entry) => entry.target === activeFrame);
      if (!frameEntry) return;

      if (frameEntry.isIntersecting) {
        enterNearViewport();
      } else {
        stopNearViewportWork();
      }
    }

    function startMotion() {
      if (motionEligible || disposed || setupFailed) return;
      motionEligible = true;

      try {
        observer = new IntersectionObserver(handleIntersection, {
          rootMargin: NEAR_VIEWPORT_ROOT_MARGIN,
          threshold: 0,
        });
        observer.observe(activeFrame);
      } catch {
        failClosed();
      }
    }

    function syncEligibility() {
      if (disposed || setupFailed) return;

      try {
        if (
          desktopQuery.matches &&
          finePointerQuery.matches &&
          normalMotionQuery.matches
        ) {
          startMotion();
        } else {
          stopMotion();
        }
      } catch {
        failClosed();
      }
    }

    try {
      removeMediaListeners.push(
        subscribeToMediaQuery(desktopQuery, syncEligibility),
      );
      removeMediaListeners.push(
        subscribeToMediaQuery(finePointerQuery, syncEligibility),
      );
      removeMediaListeners.push(
        subscribeToMediaQuery(normalMotionQuery, syncEligibility),
      );
      syncEligibility();
    } catch {
      failClosed();
    }

    return () => {
      disposed = true;
      stopMotion();
      clearMediaListeners();
    };
  }, []);

  return (
    <div ref={imageWindowRef} className={styles.imageWindow}>
      <Image
        ref={imageRef}
        src="/images/collaborate_team.jpg"
        alt="Sunshine Center"
        fill
        sizes="100vw"
        className="object-cover"
      />
    </div>
  );
}
