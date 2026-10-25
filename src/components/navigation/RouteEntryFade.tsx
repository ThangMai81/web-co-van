"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";

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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const previousPathnameRef = useRef<string | null>(null);
  const reducedMotionRef = useRef<boolean | null>(null);
  const animationRef = useRef<Animation | null>(null);

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
    <div ref={wrapperRef} className="route-page-fade">
      {children}
    </div>
  );
}
