"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import styles from "./Reveal.module.css";

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

type Direction = "up" | "left" | "right" | "scale";

const HIDDEN_CLASS: Record<Direction, string> = {
  up: "opacity-0 translate-y-6",
  left: "opacity-0 -translate-x-10",
  right: "opacity-0 translate-x-10",
  scale: "opacity-0 scale-90",
};

function subscribeToPreference(
  query: MediaQueryList,
  listener: () => void,
) {
  if (typeof query.addEventListener === "function") {
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }

  query.addListener(listener);
  return () => query.removeListener(listener);
}

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  repeat = false,
  preset,
  className = "",
}: {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  repeat?: boolean;
  preset?: "soft";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [motionBypassed, setMotionBypassed] = useState(true);
  const [transitionSuppressed, setTransitionSuppressed] = useState(false);
  const motionEnvironmentRef = useRef<"pending" | "enabled" | "bypassed">(
    "pending",
  );

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    const preference =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(prefers-reduced-motion: reduce)")
        : undefined;
    let observer: IntersectionObserver | null = null;

    const bypassMotion = () => {
      motionEnvironmentRef.current = "bypassed";
      setMotionBypassed(true);
      setVisible(true);
      setTransitionSuppressed(false);
      observer?.disconnect();
      observer = null;
    };

    const updateMotionPreference = () => {
      if (preference?.matches) bypassMotion();
    };

    updateMotionPreference();
    const removePreferenceListener = preference
      ? subscribeToPreference(preference, updateMotionPreference)
      : () => undefined;

    if (motionEnvironmentRef.current === "bypassed") {
      return removePreferenceListener;
    }

    if (
      !el ||
      preference?.matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      bypassMotion();
      return removePreferenceListener;
    }

    if (motionEnvironmentRef.current === "pending") {
      motionEnvironmentRef.current = "enabled";
      setVisible(false);
      setMotionBypassed(false);
      setTransitionSuppressed(true);
    }

    observer = new IntersectionObserver(
      ([entry]) => {
        if (preference?.matches) {
          bypassMotion();
          return;
        }
        setVisible(entry.isIntersecting);
        setTransitionSuppressed(false);
        if (entry.isIntersecting && !repeat) observer?.unobserve(el);
      },
      { threshold: 0.15 },
    );

    observer.observe(el);
    return () => {
      observer?.disconnect();
      removePreferenceListener();
    };
  }, [repeat]);

  const revealClassName = preset === "soft"
    ? `${styles.softGroup} ${motionBypassed ? styles.motionBypassed : ""} ${transitionSuppressed ? styles.transitionSuppressed : ""} ${className}`.trim()
    : `transition-all duration-700 ease-out ${
        visible
          ? "opacity-100 translate-x-0 translate-y-0 scale-100"
          : HIDDEN_CLASS[direction]
      } ${styles.reduceAware} ${motionBypassed ? styles.motionBypassed : ""} ${transitionSuppressed ? styles.transitionSuppressed : ""} ${className}`.trim();

  return (
    <div
      ref={ref}
      data-visible={visible}
      style={preset === "soft" || motionBypassed ? undefined : { transitionDelay: `${delay}ms` }}
      className={revealClassName}
    >
      {children}
    </div>
  );
}
