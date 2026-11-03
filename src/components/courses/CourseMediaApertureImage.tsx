"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import styles from "./CourseMediaApertureImage.module.css";

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

const IMAGE_READINESS_TIMEOUT_MS = 500;

type RevealPhase = "visible" | "waiting" | "revealing";

export function CourseMediaApertureImage({
  src,
  alt,
  sizes,
}: {
  src: string;
  alt: string;
  sizes: string;
}) {
  const imageRef = useRef<HTMLImageElement>(null);
  const [phase, setPhase] = useState<RevealPhase>("visible");

  useIsomorphicLayoutEffect(() => {
    const image = imageRef.current;
    if (!image) return;

    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: no-preference)");
    if (
      !desktopQuery.matches ||
      !motionQuery.matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      return;
    }

    let observer: IntersectionObserver | null = null;
    let animationFrame = 0;
    let readinessTimeoutId: number | null = null;
    let removeReadinessListeners: (() => void) | null = null;
    let cancelled = false;
    let didReveal = false;

    const clearReadinessWait = () => {
      if (readinessTimeoutId !== null) {
        window.clearTimeout(readinessTimeoutId);
        readinessTimeoutId = null;
      }
      removeReadinessListeners?.();
      removeReadinessListeners = null;
    };

    const showFullImage = () => {
      cancelled = true;
      observer?.disconnect();
      clearReadinessWait();
      window.cancelAnimationFrame(animationFrame);
      setPhase("visible");
    };

    const onEligibilityChange = () => {
      if (!desktopQuery.matches || !motionQuery.matches) showFullImage();
    };

    const startReveal = () => {
      if (cancelled || didReveal) return;
      didReveal = true;
      observer?.disconnect();

      const deadline = window.performance.now() + IMAGE_READINESS_TIMEOUT_MS;
      let readinessSettled = false;
      let isDecoding = false;

      const finishReadiness = (ready: boolean) => {
        if (cancelled || readinessSettled) return;
        readinessSettled = true;
        clearReadinessWait();

        if (
          !ready ||
          window.performance.now() >= deadline ||
          !image.complete ||
          image.naturalWidth <= 0
        ) {
          cancelled = true;
          setPhase("visible");
          return;
        }

        setPhase("waiting");
        animationFrame = window.requestAnimationFrame(() => {
          if (!cancelled) setPhase("revealing");
        });
      };

      const checkImageReadiness = () => {
        if (cancelled || readinessSettled || isDecoding || !image.complete) {
          return;
        }
        if (image.naturalWidth <= 0) {
          finishReadiness(false);
          return;
        }
        if (typeof image.decode !== "function") {
          finishReadiness(true);
          return;
        }

        isDecoding = true;
        let decodePromise: Promise<void>;
        try {
          decodePromise = image.decode();
        } catch {
          finishReadiness(false);
          return;
        }

        decodePromise.then(
          () => {
            isDecoding = false;
            finishReadiness(true);
          },
          () => {
            isDecoding = false;
            finishReadiness(false);
          },
        );
      };

      const onImageLoad = () => checkImageReadiness();
      const onImageError = () => finishReadiness(false);
      image.addEventListener("load", onImageLoad);
      image.addEventListener("error", onImageError);
      removeReadinessListeners = () => {
        image.removeEventListener("load", onImageLoad);
        image.removeEventListener("error", onImageError);
      };
      readinessTimeoutId = window.setTimeout(
        () => finishReadiness(false),
        IMAGE_READINESS_TIMEOUT_MS,
      );

      checkImageReadiness();
    };

    const getVisibleRatio = () => {
      const bounds = image.getBoundingClientRect();
      const visibleWidth = Math.max(
        0,
        Math.min(bounds.right, window.innerWidth) - Math.max(bounds.left, 0),
      );
      const visibleHeight = Math.max(
        0,
        Math.min(bounds.bottom, window.innerHeight) - Math.max(bounds.top, 0),
      );
      const imageArea = bounds.width * bounds.height;
      return imageArea > 0 ? (visibleWidth * visibleHeight) / imageArea : 0;
    };

    try {
      if (getVisibleRatio() >= 0.15) {
        startReveal();
      } else {
        observer = new IntersectionObserver(
          (entries) => {
            if (
              entries.some(
                (entry) =>
                  entry.target === image &&
                  entry.isIntersecting &&
                  entry.intersectionRatio >= 0.15,
              )
            ) {
              startReveal();
            }
          },
          { threshold: [0, 0.15] },
        );
        observer.observe(image);
      }

      desktopQuery.addEventListener("change", onEligibilityChange);
      motionQuery.addEventListener("change", onEligibilityChange);
    } catch {
      showFullImage();
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
      clearReadinessWait();
      window.cancelAnimationFrame(animationFrame);
      desktopQuery.removeEventListener("change", onEligibilityChange);
      motionQuery.removeEventListener("change", onEligibilityChange);
    };
  }, []);

  const revealClass =
    phase === "waiting"
      ? styles.waiting
      : phase === "revealing"
        ? styles.revealing
        : "";

  return (
    <Image
      ref={imageRef}
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={`object-contain ${revealClass}`}
    />
  );
}
