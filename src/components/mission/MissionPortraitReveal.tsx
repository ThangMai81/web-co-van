"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";
import styles from "./Hero.module.css";

const MIN_VISIBLE_RATIO = 0.35;

type RevealState = "static" | "waiting" | "revealing";

export function MissionPortraitReveal() {
  const portraitRef = useRef<HTMLDivElement | null>(null);
  const [revealState, setRevealState] = useState<RevealState>("static");

  useLayoutEffect(() => {
    const portrait = portraitRef.current;
    if (
      !portrait ||
      typeof window.matchMedia !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      return;
    }

    const rect = portrait.getBoundingClientRect();
    const visibleWidth = Math.max(
      0,
      Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0),
    );
    const visibleHeight = Math.max(
      0,
      Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0),
    );
    const portraitArea = rect.width * rect.height;
    const visibleRatio =
      portraitArea > 0 ? (visibleWidth * visibleHeight) / portraitArea : 0;

    if (visibleRatio >= MIN_VISIBLE_RATIO) {
      setRevealState("revealing");
      return;
    }

    let observer: IntersectionObserver | null = null;

    try {
      observer = new IntersectionObserver(
        (entries) => {
          const reachedThreshold = entries.some(
            (entry) =>
              entry.target === portrait &&
              entry.isIntersecting &&
              entry.intersectionRatio >= MIN_VISIBLE_RATIO,
          );

          if (!reachedThreshold) return;

          setRevealState("revealing");
          observer?.disconnect();
        },
        { root: null, rootMargin: "0px", threshold: [0, MIN_VISIBLE_RATIO] },
      );
      observer.observe(portrait);
    } catch {
      observer?.disconnect();
      return;
    }

    setRevealState("waiting");
    return () => observer?.disconnect();
  }, []);

  const revealClass =
    revealState === "waiting"
      ? styles.portraitWaiting
      : revealState === "revealing"
        ? styles.portraitRevealed
        : "";

  return (
    <div
      ref={portraitRef}
      className={styles.portraitTarget}
    >
      <figure className={`${styles.portrait} ${revealClass}`.trim()}>
        <Image
          src="/images/Yến.jpg"
          alt="Shining Coach Yến Lê tại Sunshine Center"
          fill
          priority
          sizes="(max-width: 767px) 86vw, 40vw"
          className={styles.portraitImage}
        />
        <figcaption className={styles.caption}>
          <span>Shining Coach</span>
          <strong>Yến Lê</strong>
        </figcaption>
      </figure>
    </div>
  );
}
