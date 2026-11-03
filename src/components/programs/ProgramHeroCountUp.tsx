"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./ProgramHeroCountUp.module.css";

const COUNT_UP_DURATION_MS = 700;
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

type ProgramHeroCountUpProps = {
  total: number;
  upcoming: number;
  sequenceReveal?: boolean;
  startCountUp?: boolean;
};

type DisplayedTotals = {
  total: number;
  upcoming: number;
};

function subscribeToMediaQuery(
  query: MediaQueryList,
  listener: () => void,
): (() => void) | null {
  try {
    if (typeof query.addEventListener === "function") {
      query.addEventListener("change", listener);
      return () => query.removeEventListener("change", listener);
    }

    if (typeof query.addListener === "function") {
      query.addListener(listener);
      return () => query.removeListener(listener);
    }
  } catch {
    return null;
  }

  return null;
}

export default function ProgramHeroCountUp({
  total,
  upcoming,
  sequenceReveal = false,
  startCountUp = true,
}: ProgramHeroCountUpProps) {
  const statsRef = useRef<HTMLDListElement>(null);
  const hasStartedRef = useRef(false);
  const [displayedTotals, setDisplayedTotals] = useState<DisplayedTotals>({
    total,
    upcoming,
  });

  useIsomorphicLayoutEffect(() => {
    const stats = statsRef.current;
    const finalTotals = { total, upcoming };
    if (hasStartedRef.current) {
      setDisplayedTotals(finalTotals);
      return;
    }
    if (!startCountUp) {
      setDisplayedTotals(finalTotals);
      return;
    }

    const animatesTotal = total > 1;
    const animatesUpcoming = upcoming > 1;
    if (!stats || (!animatesTotal && !animatesUpcoming)) {
      hasStartedRef.current = true;
      setDisplayedTotals(finalTotals);
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
      hasStartedRef.current = true;
      setDisplayedTotals(finalTotals);
      return;
    }

    const isEligible = () =>
      desktopQuery.matches &&
      finePointerQuery.matches &&
      !reducedMotionQuery.matches;

    if (
      !isEligible() ||
      typeof IntersectionObserver === "undefined" ||
      typeof window.requestAnimationFrame !== "function"
    ) {
      hasStartedRef.current = true;
      setDisplayedTotals(finalTotals);
      return;
    }

    const animationStartTotals = {
      total: animatesTotal ? 0 : total,
      upcoming: animatesUpcoming ? 0 : upcoming,
    };
    let observer: IntersectionObserver | null = null;
    let animationFrame: number | null = null;
    let animationStart: number | null = null;
    let currentTotal = total;
    let currentUpcoming = upcoming;
    let started = false;
    let disposed = false;
    const mediaQueryCleanups: Array<() => void> = [];

    const cancelAnimationFrame = () => {
      if (animationFrame === null) return;

      try {
        window.cancelAnimationFrame(animationFrame);
      } catch {
        // A queued frame checks `disposed` before updating the values.
      }

      animationFrame = null;
    };

    const restoreFinalTotals = () => {
      if (disposed) return;
      disposed = true;
      observer?.disconnect();
      cancelAnimationFrame();
      setDisplayedTotals(finalTotals);
    };

    const animate = (timestamp: number) => {
      if (disposed) return;
      if (animationStart === null) animationStart = timestamp;

      const progress = Math.min(
        1,
        Math.max(0, (timestamp - animationStart) / COUNT_UP_DURATION_MS),
      );
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const nextTotal =
        animatesTotal ? Math.floor(total * easeOut) : total;
      const nextUpcoming =
        animatesUpcoming ? Math.floor(upcoming * easeOut) : upcoming;

      if (nextTotal !== currentTotal || nextUpcoming !== currentUpcoming) {
        currentTotal = nextTotal;
        currentUpcoming = nextUpcoming;
        setDisplayedTotals({ total: currentTotal, upcoming: currentUpcoming });
      }

      if (progress >= 1) {
        animationFrame = null;
        setDisplayedTotals(finalTotals);
        return;
      }

      try {
        animationFrame = window.requestAnimationFrame(animate);
      } catch {
        restoreFinalTotals();
      }
    };

    const beginCountUp = () => {
      if (started || disposed || hasStartedRef.current) return;

      started = true;
      hasStartedRef.current = true;

      try {
        observer?.disconnect();
        currentTotal = animationStartTotals.total;
        currentUpcoming = animationStartTotals.upcoming;
        setDisplayedTotals(animationStartTotals);
        animationFrame = window.requestAnimationFrame(animate);
      } catch {
        restoreFinalTotals();
      }
    };

    try {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries.find((candidate) => candidate.target === stats);
          if (!entry || disposed || started) return;

          if (entry.isIntersecting) {
            beginCountUp();
          } else if (
            currentTotal !== animationStartTotals.total ||
            currentUpcoming !== animationStartTotals.upcoming
          ) {
            currentTotal = animationStartTotals.total;
            currentUpcoming = animationStartTotals.upcoming;
            setDisplayedTotals(animationStartTotals);
          }
        },
        { threshold: 0 },
      );
      observer.observe(stats);
    } catch {
      observer?.disconnect();
      hasStartedRef.current = true;
      setDisplayedTotals(finalTotals);
      return;
    }

    const handleMediaChange = () => {
      if (!isEligible()) restoreFinalTotals();
    };

    for (const query of [desktopQuery, finePointerQuery, reducedMotionQuery]) {
      const cleanup = subscribeToMediaQuery(query, handleMediaChange);
      if (cleanup) mediaQueryCleanups.push(cleanup);
    }

    try {
      const bounds = stats.getBoundingClientRect();
      const alreadyVisible =
        bounds.top < window.innerHeight &&
        bounds.bottom > 0 &&
        bounds.left < window.innerWidth &&
        bounds.right > 0;

      if (alreadyVisible) beginCountUp();
    } catch {
      restoreFinalTotals();
    }

    return () => {
      const animationWasRunning = animationFrame !== null;
      disposed = true;
      observer?.disconnect();
      cancelAnimationFrame();
      mediaQueryCleanups.forEach((cleanup) => cleanup());

      if (started && animationWasRunning) {
        setDisplayedTotals(finalTotals);
      }
    };
  }, [startCountUp, total, upcoming]);

  const totalWidth = `${Math.max(1, String(total).length)}ch`;
  const upcomingWidth = `${Math.max(1, String(upcoming).length)}ch`;

  return (
    <dl
      ref={statsRef}
      className={[
        "grid grid-cols-2 gap-3 border-t border-white/15 pt-4 sm:gap-4 sm:pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0",
        sequenceReveal ? styles.sequenceReveal : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
        <dt className="text-xs font-medium text-white/65">Chương trình</dt>
        <dd className="mt-1 font-display text-3xl font-extrabold text-yellow sm:text-4xl">
          <span
            aria-hidden="true"
            className={styles.visualCount}
            style={{ minWidth: totalWidth }}
          >
            {displayedTotals.total}
          </span>
          <span className="sr-only">{total}</span>
        </dd>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4 sm:p-5">
        <dt className="text-xs font-medium text-white/65">Sắp diễn ra</dt>
        <dd className="mt-1 font-display text-3xl font-extrabold text-yellow sm:text-4xl">
          <span
            aria-hidden="true"
            className={styles.visualCount}
            style={{ minWidth: upcomingWidth }}
          >
            {displayedTotals.upcoming}
          </span>
          <span className="sr-only">{upcoming}</span>
        </dd>
      </div>
    </dl>
  );
}
