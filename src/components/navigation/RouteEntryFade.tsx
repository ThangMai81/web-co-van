"use client";

import { usePathname, useSearchParams } from "next/navigation";
import {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

function cancelOwnedAnimation(animationRef: { current: Animation | null }) {
  const animation = animationRef.current;
  if (!animation) return;

  animationRef.current = null;
  if (animation.playState !== "idle" && animation.playState !== "finished") {
    animation.cancel();
  }
}

function RouteCommitObserver({
  pathname,
  onCommit,
}: {
  pathname: string | null;
  onCommit: (location: string) => void;
}) {
  const searchParams = useSearchParams();
  const search = searchParams?.toString() ?? "";

  useLayoutEffect(() => {
    if (pathname === null) return;
    onCommit(`${pathname}${window.location.search}`);
  }, [pathname, searchParams, search, onCommit]);

  return null;
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
  const routeOriginRef = useRef<string | null>(null);
  const routeDestinationRef = useRef<string | null>(null);
  const routeProgressTimerRef = useRef<number | null>(null);
  const routeHideTimerRef = useRef<number | null>(null);
  const finishRouteRef = useRef<() => void>(() => {});
  const cancelRouteRef = useRef<() => void>(() => {});
  const handleRouteCommit = useCallback((committedLocation: string) => {
    if (!routePendingRef.current) return;
    if (committedLocation === routeDestinationRef.current) {
      finishRouteRef.current();
    } else if (committedLocation !== routeOriginRef.current) {
      cancelRouteRef.current();
    }
  }, []);

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
      routeOriginRef.current = null;
      routeDestinationRef.current = null;
      setRouteProgress(100);
      const visibleFor = Date.now() - routeStartedAtRef.current;
      routeHideTimerRef.current = window.setTimeout(() => {
        setRoutePending(false);
        setRouteProgress(8);
        routeHideTimerRef.current = null;
      }, Math.max(180, 360 - visibleFor));
    };

    const cancelRoute = () => {
      if (!routePendingRef.current) return;
      routePendingRef.current = false;
      clearRouteTimers();
      routeOriginRef.current = null;
      routeDestinationRef.current = null;
      setRoutePending(false);
      setRouteProgress(8);
    };

    finishRouteRef.current = finishRoute;
    cancelRouteRef.current = cancelRoute;

    const startRoute = (destination: URL) => {
      const nextDestination = destination.pathname + destination.search;
      if (routePendingRef.current && routeDestinationRef.current === nextDestination) return;

      clearRouteTimers();
      routePendingRef.current = true;
      routeStartedAtRef.current = Date.now();
      routeOriginRef.current = `${window.location.pathname}${window.location.search}`;
      routeDestinationRef.current = nextDestination;
      setRoutePending(true);
      const animateProgress = reducedMotionRef.current !== true;
      setRouteProgress(animateProgress ? 8 : 90);
      // Commit handling comes from RouteCommitObserver; this timer only advances visible progress.
      routeProgressTimerRef.current = window.setInterval(() => {
        if (reducedMotionRef.current !== true) {
          setRouteProgress((progress) => Math.min(90, progress + Math.max(1, (90 - progress) * 0.12)));
        }
      }, 160);
      // If no observable URL commit or cancellation arrives, remove the indicator within the accepted bound.
      routeHideTimerRef.current = window.setTimeout(cancelRoute, 20000);
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
      if (destination.origin !== window.location.origin) return;

      const destinationLocation = destination.pathname + destination.search;
      const currentLocation = `${window.location.pathname}${window.location.search}`;
      if (destinationLocation === currentLocation) {
        if (routePendingRef.current) cancelRouteRef.current();
        return;
      }
      startRoute(destination);
    };

    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
      clearRouteTimers();
      finishRouteRef.current = () => {};
      cancelRouteRef.current = () => {};
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
      if (event.matches) {
        cancelOwnedAnimation(animationRef);
        if (routePendingRef.current) setRouteProgress(90);
      }
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
      <Suspense fallback={null}>
        <RouteCommitObserver pathname={pathname} onCommit={handleRouteCommit} />
      </Suspense>
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
