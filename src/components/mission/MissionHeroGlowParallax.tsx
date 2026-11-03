"use client";

import { useEffect, useRef } from "react";

type MissionHeroGlowParallaxProps = {
  topClassName: string;
  bottomClassName: string;
};

function subscribe(query: MediaQueryList, listener: () => void) {
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

export function MissionHeroGlowParallax({
  topClassName,
  bottomClassName,
}: MissionHeroGlowParallaxProps) {
  const topGlowRef = useRef<HTMLDivElement>(null);
  const bottomGlowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const topGlow = topGlowRef.current;
    const bottomGlow = bottomGlowRef.current;
    const hero = topGlow?.parentElement;

    if (
      !topGlow ||
      !bottomGlow ||
      !hero ||
      typeof window.matchMedia !== "function" ||
      typeof window.requestAnimationFrame !== "function" ||
      typeof window.cancelAnimationFrame !== "function" ||
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
      reducedMotionQuery = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      );
    } catch {
      return;
    }

    let frame: number | null = null;
    let eligible =
      desktopQuery.matches &&
      finePointerQuery.matches &&
      !reducedMotionQuery.matches;
    let nearHero = false;
    let disposed = false;
    let observer: IntersectionObserver | null = null;
    let listenersAttached = false;
    const removeMediaListeners: Array<() => void> = [];

    const reset = () => {
      if (topGlow && bottomGlow) {
        topGlow.style.transform = "";
        bottomGlow.style.transform = "";
      }
    };

    const renderPosition = () => {
      frame = null;
      if (!eligible || !nearHero || disposed) return;

      const rect = hero.getBoundingClientRect();
      const heroHeight = Math.max(rect.height, 1);
      const progress = Math.min(1, Math.max(0, -rect.top / heroHeight));

      topGlow.style.transform = `translate3d(0, ${progress * 40}px, 0)`;
      bottomGlow.style.transform = `translate3d(0, ${progress * -24}px, 0)`;
    };

    const schedulePosition = () => {
      if (frame === null) frame = window.requestAnimationFrame(renderPosition);
    };

    const detachViewportListeners = () => {
      if (!listenersAttached) return;
      window.removeEventListener("scroll", schedulePosition);
      window.removeEventListener("resize", schedulePosition);
      listenersAttached = false;
    };

    const updateNearHero = (nextNearHero: boolean) => {
      if (nearHero === nextNearHero || disposed) return;
      nearHero = nextNearHero;
      if (!eligible || !nearHero) {
        detachViewportListeners();
        if (frame !== null) window.cancelAnimationFrame(frame);
        frame = null;
        reset();
        return;
      }

      listenersAttached = true;
      window.addEventListener("scroll", schedulePosition, { passive: true });
      window.addEventListener("resize", schedulePosition, { passive: true });
      schedulePosition();
    };

    const updateEligibility = () => {
      const nextEligibility =
        desktopQuery.matches &&
        finePointerQuery.matches &&
        !reducedMotionQuery.matches;
      if (nextEligibility === eligible) return;
      eligible = nextEligibility;

      if (!eligible) {
        detachViewportListeners();
        if (frame !== null) window.cancelAnimationFrame(frame);
        frame = null;
        reset();
        return;
      }

      if (nearHero) updateNearHero(false);
      // Re-evaluate visibility after eligibility changes without animating
      // outside the observed region.
      observer?.unobserve(hero);
      observer?.observe(hero);
    };

    try {
      for (const query of [desktopQuery, finePointerQuery, reducedMotionQuery]) {
        removeMediaListeners.push(subscribe(query, updateEligibility));
      }

      observer = new IntersectionObserver(
        (entries) => {
          if (disposed || !eligible) {
            updateNearHero(false);
            return;
          }
          const entry = entries.find((item) => item.target === hero);
          if (entry) updateNearHero(entry.isIntersecting);
        },
        { rootMargin: "150px 0px", threshold: 0 },
      );
      observer.observe(hero);
    } catch {
      disposed = true;
      observer?.disconnect();
      observer = null;
      detachViewportListeners();
      if (frame !== null) window.cancelAnimationFrame(frame);
      frame = null;
      removeMediaListeners.splice(0).forEach((remove) => remove());
      reset();
      return;
    }

    return () => {
      disposed = true;
      observer?.disconnect();
      observer = null;
      detachViewportListeners();
      removeMediaListeners.forEach((remove) => remove());
      if (frame !== null) window.cancelAnimationFrame(frame);
      reset();
    };
  }, []);

  return (
    <>
      <div ref={topGlowRef} className={topClassName} aria-hidden="true" />
      <div ref={bottomGlowRef} className={bottomClassName} aria-hidden="true" />
    </>
  );
}
