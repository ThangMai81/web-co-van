"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./FounderStatsGravity.module.css";

type FounderStatsGravityProps = {
  children: ReactNode;
  className: string;
};

function subscribeToMediaQuery(query: MediaQueryList, listener: () => void) {
  if (typeof query.addEventListener === "function") {
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }

  query.addListener(listener);
  return () => query.removeListener(listener);
}

function isRevealSettled(element: HTMLElement) {
  if (typeof element.getAnimations === "function") {
    try {
      if (element.getAnimations().some((animation) => animation.playState === "running")) {
        return false;
      }
    } catch {
      // Computed styles below provide a bounded fallback for unsupported animation APIs.
    }
  }

  const style = window.getComputedStyle(element);
  const opacity = Number.parseFloat(style.opacity);
  const translate = style.getPropertyValue("translate").trim();
  const translateIsSettled =
    translate === "" ||
    translate === "none" ||
    translate.split(/\s+/).every((value) => {
      const coordinate = Number.parseFloat(value);
      return Number.isFinite(coordinate) && Math.abs(coordinate) < 0.1;
    });
  const transform = style.transform;
  const transformIsSettled =
    transform === "none" ||
    /^matrix\(\s*1,\s*0,\s*0,\s*1,\s*0,\s*0\s*\)$/.test(transform) ||
    /^matrix3d\(\s*1,\s*0,\s*0,\s*0,\s*0,\s*1,\s*0,\s*0,\s*0,\s*0,\s*1,\s*0,\s*0,\s*0,\s*0,\s*1\s*\)$/.test(transform);

  return opacity >= 0.999 && translateIsSettled && transformIsSettled;
}

export function FounderStatsGravity({ children, className }: FounderStatsGravityProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const hasStartedRef = useRef(false);
  const motionActiveRef = useRef(false);
  const [motionActive, setMotionActive] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof window.matchMedia !== "function" || typeof IntersectionObserver === "undefined") {
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

    let eligible = desktopQuery.matches && finePointerQuery.matches && !reducedMotionQuery.matches;
    let isVisible = false;
    let isDisposed = false;
    let observer: IntersectionObserver | null = null;
    let revealObserver: MutationObserver | null = null;
    let revealElement: HTMLElement | null = null;
    let transitionHandler: ((event: TransitionEvent) => void) | null = null;
    let revealTimer: number | null = null;
    let revealFrame: number | null = null;

    const updateMotionActive = (active: boolean) => {
      motionActiveRef.current = active;
      setMotionActive(active);
    };

    const clearRevealWait = () => {
      revealObserver?.disconnect();
      revealObserver = null;
      if (revealElement && transitionHandler) {
        revealElement.removeEventListener("transitionend", transitionHandler);
      }
      transitionHandler = null;
      if (revealTimer !== null) {
        window.clearTimeout(revealTimer);
        revealTimer = null;
      }
      if (revealFrame !== null) {
        window.cancelAnimationFrame(revealFrame);
        revealFrame = null;
      }
      revealElement = null;
    };

    const startMotion = () => {
      if (!eligible || !isVisible || isDisposed || hasStartedRef.current) return;
      hasStartedRef.current = true;
      updateMotionActive(true);
      observer?.disconnect();
      clearRevealWait();
    };

    const checkReveal = (element: HTMLElement) => {
      if (!eligible || !isVisible || isDisposed || hasStartedRef.current) {
        clearRevealWait();
        return;
      }
      if (element.dataset.visible !== "true") return;
      if (isRevealSettled(element)) {
        startMotion();
        return;
      }
      if (transitionHandler) return;

      revealElement = element;
      transitionHandler = (event) => {
        if (
          event.target !== element ||
          !["opacity", "transform", "translate"].includes(event.propertyName)
        ) {
          return;
        }
        if (isRevealSettled(element)) startMotion();
      };
      element.addEventListener("transitionend", transitionHandler);
      revealTimer = window.setTimeout(() => {
        if (element.dataset.visible === "true" && eligible && isVisible && !hasStartedRef.current) {
          startMotion();
        } else {
          clearRevealWait();
        }
      }, 760);
    };

    const scheduleRevealCheck = (element: HTMLElement) => {
      if (revealFrame !== null || transitionHandler || revealTimer !== null) return;
      if (typeof window.requestAnimationFrame === "function") {
        revealFrame = window.requestAnimationFrame(() => {
          revealFrame = null;
          checkReveal(element);
        });
      } else {
        checkReveal(element);
      }
    };

    const waitForReveal = () => {
      if (!eligible || !isVisible || isDisposed || hasStartedRef.current) return;
      const parentReveal = root.closest<HTMLElement>("[data-visible]");
      if (!parentReveal) {
        startMotion();
        return;
      }

      revealElement = parentReveal;
      if (parentReveal.dataset.visible === "true") {
        scheduleRevealCheck(parentReveal);
        return;
      }
      if (revealObserver || typeof MutationObserver === "undefined") return;

      try {
        revealObserver = new MutationObserver(() => {
          if (parentReveal.dataset.visible !== "true") return;
          revealObserver?.disconnect();
          revealObserver = null;
          scheduleRevealCheck(parentReveal);
        });
        revealObserver.observe(parentReveal, {
          attributes: true,
          attributeFilter: ["data-visible"],
        });
      } catch {
        revealObserver?.disconnect();
        revealObserver = null;
      }
    };

    const onIntersection = (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      isVisible = Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.15);
      if (!isVisible) {
        if (!hasStartedRef.current) clearRevealWait();
        return;
      }
      if (eligible) waitForReveal();
    };

    const onMediaChange = () => {
      const nextEligibility =
        desktopQuery.matches && finePointerQuery.matches && !reducedMotionQuery.matches;
      if (nextEligibility === eligible) return;
      eligible = nextEligibility;
      if (!eligible) {
        clearRevealWait();
        if (hasStartedRef.current && motionActiveRef.current) updateMotionActive(false);
        return;
      }
      if (isVisible) waitForReveal();
    };

    const removeMediaListeners: Array<() => void> = [];
    try {
      for (const query of [desktopQuery, finePointerQuery, reducedMotionQuery]) {
        removeMediaListeners.push(subscribeToMediaQuery(query, onMediaChange));
      }
      observer = new IntersectionObserver(onIntersection, { threshold: [0, 0.15] });
      observer.observe(root);
    } catch {
      observer?.disconnect();
      removeMediaListeners.forEach((remove) => remove());
      return;
    }

    return () => {
      isDisposed = true;
      observer?.disconnect();
      clearRevealWait();
      removeMediaListeners.forEach((remove) => remove());
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className={`${styles.metrics} ${className}`}
      data-motion-active={motionActive ? "true" : undefined}
    >
      {children}
    </div>
  );
}
