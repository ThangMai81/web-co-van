"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

function cancelOwnedAnimation(animationRef: { current: Animation | null }) {
  const animation = animationRef.current;
  if (!animation) return;

  animationRef.current = null;
  if (animation.playState !== "idle" && animation.playState !== "finished") {
    animation.cancel();
  }
}

export function RouteEntryFade({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [routePending, setRoutePending] = useState(false);
  const [routeProgress, setRouteProgress] = useState(8);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const previousPathnameRef = useRef<string | null>(null);
  const reducedMotionRef = useRef<boolean | null>(null);
  const animationRef = useRef<Animation | null>(null);
  const routePendingRef = useRef(false);
  const routeStartedAtRef = useRef(0);
  const routeDestinationRef = useRef<string | null>(null);
  const routeProgressTimerRef = useRef<number | null>(null);
  const routeHideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const clearRouteTimers = () => {
      if (routeProgressTimerRef.current !== null) {
        window.clearInterval(routeProgressTimerRef.current);
        routeProgressTimerRef.current = null;
      }
      if (routeHideTimerRef.current !== null) {
        window.clearTimeout(routeHideTimerRef.current);
        routeHideTimerRef.current = null;
      }
    };

    const finishRoute = () => {
      if (!routePendingRef.current) return;
      routePendingRef.current = false;
      if (routeProgressTimerRef.current !== null) {
        window.clearInterval(routeProgressTimerRef.current);
        routeProgressTimerRef.current = null;
      }
      if (routeHideTimerRef.current !== null) {
        window.clearTimeout(routeHideTimerRef.current);
        routeHideTimerRef.current = null;
      }
      routeDestinationRef.current = null;
      setRouteProgress(100);
      const visibleFor = Date.now() - routeStartedAtRef.current;
      routeHideTimerRef.current = window.setTimeout(() => {
        setRoutePending(false);
        setRouteProgress(8);
        routeHideTimerRef.current = null;
      }, Math.max(180, 360 - visibleFor));
    };

    const startRoute = (destination: URL) => {
      if (routePendingRef.current) return;
      routePendingRef.current = true;
      routeStartedAtRef.current = Date.now();
      routeDestinationRef.current = destination.pathname + destination.search;
      setRoutePending(true);
      setRouteProgress(8);
      routeProgressTimerRef.current = window.setInterval(() => {
        if (`${window.location.pathname}${window.location.search}` === routeDestinationRef.current) {
          finishRoute();
          return;
        }
        setRouteProgress((progress) => Math.min(90, progress + Math.max(1, (90 - progress) * 0.12)));
      }, 160);
      // If navigation is canceled or errors before pathname commits, remove the indicator.
      routeHideTimerRef.current = window.setTimeout(() => {
        routePendingRef.current = false;
        routeDestinationRef.current = null;
        setRoutePending(false);
        setRouteProgress(8);
        clearRouteTimers();
      }, 20000);
    };

    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      let destination: URL;
      try {
        destination = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (
        destination.origin !== window.location.origin ||
        (destination.pathname === window.location.pathname && destination.search === window.location.search)
      ) return;
      startRoute(destination);
    };

    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      clearRouteTimers();
    };
  }, []);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      reducedMotionRef.current = true;
      return;
    }

    let motionQuery: MediaQueryList;
    try {
      motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    } catch {
      reducedMotionRef.current = true;
      return;
    }

    reducedMotionRef.current = motionQuery.matches;

    const handlePreferenceChange = (event: MediaQueryListEvent) => {
      reducedMotionRef.current = event.matches;
      if (event.matches) cancelOwnedAnimation(animationRef);
    };

    if (typeof motionQuery.addEventListener === "function") {
      motionQuery.addEventListener("change", handlePreferenceChange);
      return () => {
        motionQuery.removeEventListener("change", handlePreferenceChange);
      };
    }

    if (typeof motionQuery.addListener === "function") {
      motionQuery.addListener(handlePreferenceChange);
      return () => {
        motionQuery.removeListener(handlePreferenceChange);
      };
    }

    reducedMotionRef.current = true;
  }, []);

  useLayoutEffect(() => {
    if (pathname === null) return;

    const previousPathname = previousPathnameRef.current;
    previousPathnameRef.current = pathname;

    // Direct/initial mounts remain fully visible; fade only committed path changes.
    if (previousPathname === null || previousPathname === pathname) return;

    const wrapper = wrapperRef.current;
    if (
      !wrapper ||
      reducedMotionRef.current !== false ||
      typeof wrapper.animate !== "function"
    ) {
      return;
    }

    let animation: Animation;
    try {
      animation = wrapper.animate(
        [{ opacity: 0.88 }, { opacity: 1 }],
        { duration: 220, easing: "ease-out", fill: "none" },
      );
    } catch {
      return;
    }

    animationRef.current = animation;
    try {
      void animation.finished.then(
        () => {
          if (animationRef.current === animation) animationRef.current = null;
        },
        () => {
          if (animationRef.current === animation) animationRef.current = null;
        },
      );
    } catch {
      // Keep the owned reference so pathname changes can still cancel the effect.
    }

    return () => {
      if (animationRef.current === animation) animationRef.current = null;
      if (animation.playState !== "idle" && animation.playState !== "finished") {
        animation.cancel();
      }
    };
  }, [pathname]);

  return (
    <>
      <div className={`route-progress ${routePending ? "is-active" : ""}`} aria-hidden="true">
        <span className="route-progress__bar" style={{ transform: `scaleX(${routeProgress / 100})` }} />
        <span className="route-progress__spinner" />
      </div>
      <p className="sr-only" role="status" aria-live="polite">{routePending ? "Đang tải trang" : ""}</p>
      <div ref={wrapperRef} className="route-page-fade">
        {children}
      </div>
    </>
  );
}
