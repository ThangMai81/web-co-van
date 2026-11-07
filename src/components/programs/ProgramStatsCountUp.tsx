"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const COUNT_UP_DURATION_MS = 560;

type ParsedStatValue = {
  amount: number;
  suffix: string;
};

function parseStatValue(value: string): ParsedStatValue | null {
  const match = value
    .trim()
    .match(
      /^((?:[1-9]\d{0,2}(?:\.\d{3})+)|(?:0|[1-9]\d*))(\s*(?:[\p{L}\p{M}]+|%))?$/u,
    );

  if (!match) return null;

  const amount = Number(match[1].replace(/\./g, ""));
  if (!Number.isSafeInteger(amount)) return null;

  return { amount, suffix: match[2] ?? "" };
}

function formatVietnameseInteger(value: number) {
  return Math.floor(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function subscribeToMediaQuery(
  query: MediaQueryList,
  listener: () => void,
): (() => void) | null {
  try {
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
  } catch {
    return null;
  }

  return null;
}

export default function ProgramStatsCountUp({ value }: { value: string }) {
  const valueRef = useRef<HTMLSpanElement>(null);
  const hasStartedRef = useRef(false);
  const parsedValue = useMemo(() => parseStatValue(value), [value]);
  const [displayedValue, setDisplayedValue] = useState<{
    source: string;
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!parsedValue || parsedValue.amount < 1 || hasStartedRef.current) return;

    const valueElement = valueRef.current;
    if (!valueElement) return;

    const statsGroup = valueElement.closest("[data-program-statistics]");
    if (!statsGroup) return;

    let desktopQuery: MediaQueryList;
    let reducedMotionQuery: MediaQueryList;

    try {
      desktopQuery = window.matchMedia("(min-width: 1024px)");
      reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    } catch {
      return;
    }

    if (
      typeof IntersectionObserver === "undefined" ||
      typeof window.requestAnimationFrame !== "function" ||
      typeof window.cancelAnimationFrame !== "function"
    ) {
      return;
    }

    let observer: IntersectionObserver | null = null;
    let animationFrame: number | null = null;
    let animationStart: number | null = null;
    let currentAmount = 0;
    let started = false;
    let disposed = false;
    const mediaQueryCleanups: Array<() => void> = [];

    const isEligible = () => desktopQuery.matches && !reducedMotionQuery.matches;

    const cancelAnimation = () => {
      if (animationFrame === null) return;

      try {
        window.cancelAnimationFrame(animationFrame);
      } catch {
        // A queued frame checks `disposed` before updating the value.
      }

      animationFrame = null;
    };

    const removeMediaListeners = () => {
      while (mediaQueryCleanups.length > 0) {
        const cleanup = mediaQueryCleanups.pop();
        try {
          cleanup?.();
        } catch {
          // Listener cleanup is best-effort in older browser implementations.
        }
      }
    };

    const finishAtFinalValue = () => {
      if (disposed) return;

      disposed = true;
      observer?.disconnect();
      cancelAnimation();
      removeMediaListeners();
      setDisplayedValue({ source: value, text: value });
    };

    const animate = (timestamp: number) => {
      if (disposed) return;
      if (!isEligible()) {
        finishAtFinalValue();
        return;
      }

      if (animationStart === null) animationStart = timestamp;

      const progress = Math.min(
        1,
        Math.max(0, (timestamp - animationStart) / COUNT_UP_DURATION_MS),
      );
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const nextAmount = Math.floor(parsedValue.amount * easeOut);

      if (nextAmount !== currentAmount) {
        currentAmount = nextAmount;
        setDisplayedValue({
          source: value,
          text: `${formatVietnameseInteger(currentAmount)}${parsedValue.suffix}`,
        });
      }

      if (progress >= 1) {
        finishAtFinalValue();
        return;
      }

      try {
        animationFrame = window.requestAnimationFrame(animate);
      } catch {
        finishAtFinalValue();
      }
    };

    const beginCountUp = () => {
      if (disposed || started || hasStartedRef.current || !isEligible()) return;

      started = true;
      hasStartedRef.current = true;
      observer?.disconnect();
      currentAmount = 0;
      setDisplayedValue({ source: value, text: `0${parsedValue.suffix}` });

      try {
        animationFrame = window.requestAnimationFrame(animate);
      } catch {
        finishAtFinalValue();
      }
    };

    try {
      observer = new IntersectionObserver(
        (entries) => {
          if (
            entries.some(
              (entry) => entry.target === statsGroup && entry.isIntersecting,
            )
          ) {
            beginCountUp();
          }
        },
        { threshold: 0 },
      );
      observer.observe(statsGroup);
    } catch {
      observer?.disconnect();
      return;
    }

    const groupIsVisible = () => {
      try {
        const bounds = statsGroup.getBoundingClientRect();
        return (
          bounds.top < window.innerHeight &&
          bounds.bottom > 0 &&
          bounds.left < window.innerWidth &&
          bounds.right > 0
        );
      } catch {
        return false;
      }
    };

    const handleMediaChange = () => {
      if (!isEligible()) {
        if (started) finishAtFinalValue();
        return;
      }

      if (!started && groupIsVisible()) beginCountUp();
    };

    for (const query of [desktopQuery, reducedMotionQuery]) {
      const cleanup = subscribeToMediaQuery(query, handleMediaChange);
      if (cleanup) mediaQueryCleanups.push(cleanup);
    }

    handleMediaChange();

    return () => {
      const animationWasInterrupted =
        started && animationFrame !== null && !disposed;
      disposed = true;
      observer?.disconnect();
      cancelAnimation();
      removeMediaListeners();

      if (animationWasInterrupted) {
        hasStartedRef.current = false;
        setDisplayedValue({ source: value, text: value });
      }
    };
  }, [parsedValue, value]);

  if (!parsedValue || parsedValue.amount < 1) return value;

  const visibleValue =
    displayedValue?.source === value ? displayedValue.text : value;

  return (
    <>
      <span
        ref={valueRef}
        aria-hidden="true"
        className="inline-block"
        style={{ minWidth: `${Math.max(1, value.length)}ch` }}
      >
        {visibleValue}
      </span>
      <span className="sr-only">{value}</span>
    </>
  );
}
