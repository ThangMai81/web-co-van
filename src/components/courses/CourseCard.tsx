"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type AnimationEvent,
} from "react";
import { Calendar } from "@/lib/icons";
import { COURSE_CATEGORY_LABELS } from "@/lib/courseLabels";
import CourseCategoryIcon from "./CourseCategoryIcon";
import StarRating from "@/components/ui/StarRating";
import ViewDetailLabel from "@/components/ui/ViewDetailLabel";
import type { CourseListItem } from "@/types/course";
import type { CSSProperties } from "react";
import styles from "./CourseCardLayeredReveal.module.css";
import {
  getCourseThumbnail,
  getCourseThumbnailAspectRatio,
} from "./courseThumbnails";

type CourseCardRevealPhase = "static" | "opening" | "settled";

const IMAGE_READINESS_TIMEOUT_MS = 700;
const PANEL_SEQUENCE_WATCHDOG_MS = 1_500;
const completedCourseCardReveals = new Set<string>();
const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

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

export default function CourseCard({ course }: { course: CourseListItem }) {
  const thumbnail = getCourseThumbnail(course);
  const thumbnailAspectRatio = getCourseThumbnailAspectRatio(course);
  const thumbnailFrameRef = useRef<HTMLDivElement>(null);
  const thumbnailImageRef = useRef<HTMLImageElement>(null);
  const revealPhaseRef = useRef<CourseCardRevealPhase>("static");
  const revealCancelledRef = useRef(false);
  const revealStartedRef = useRef(false);
  const sequenceWatchdogRef = useRef<number | null>(null);
  const [revealPhase, setRevealPhase] =
    useState<CourseCardRevealPhase>("static");

  const updateRevealPhase = useCallback((nextPhase: CourseCardRevealPhase) => {
    revealPhaseRef.current = nextPhase;
    setRevealPhase(nextPhase);
  }, []);

  useIsomorphicLayoutEffect(() => {
    const frame = thumbnailFrameRef.current;
    const image = thumbnailImageRef.current;
    if (
      !thumbnail ||
      !frame ||
      !image ||
      completedCourseCardReveals.has(course._id) ||
      revealCancelledRef.current ||
      revealStartedRef.current ||
      typeof window.matchMedia !== "function" ||
      typeof IntersectionObserver === "undefined" ||
      typeof window.CSS?.supports !== "function"
    ) {
      return;
    }

    try {
      if (
        !window.CSS.supports("transform", "translateY(-105%)") ||
        !window.CSS.supports(
          "animation",
          "course-card-panel-retract 440ms ease-out",
        )
      ) {
        return;
      }
    } catch {
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

    const isEligible = () =>
      desktopQuery.matches &&
      finePointerQuery.matches &&
      !reducedMotionQuery.matches;

    if (!isEligible()) return;

    let disposed = false;
    let observer: IntersectionObserver | null = null;
    let imageReadinessTimeout: number | null = null;
    let removeImageReadinessListeners: (() => void) | null = null;
    let isDecoding = false;
    const mediaQueryCleanups: Array<() => void> = [];

    const clearImageReadinessWait = () => {
      if (imageReadinessTimeout !== null) {
        try {
          window.clearTimeout(imageReadinessTimeout);
        } catch {
          // Keep the full card available if the timer API is unavailable.
        }
        imageReadinessTimeout = null;
      }
      try {
        removeImageReadinessListeners?.();
      } catch {
        // Listener cleanup must not prevent the static fallback.
      }
      removeImageReadinessListeners = null;
    };

    const clearMediaQueryListeners = () => {
      mediaQueryCleanups.splice(0).forEach((cleanup) => {
        try {
          cleanup();
        } catch {
          // Keep the static card if an older media-query API throws on cleanup.
        }
      });
    };

    const failOpen = () => {
      if (disposed) return;
      revealCancelledRef.current = true;
      try {
        observer?.disconnect();
      } catch {
        // The content still returns to its complete static state below.
      }
      clearImageReadinessWait();
      clearMediaQueryListeners();
      if (sequenceWatchdogRef.current !== null) {
        try {
          window.clearTimeout(sequenceWatchdogRef.current);
        } catch {
          // The timeout callback also checks the current reveal phase.
        }
        sequenceWatchdogRef.current = null;
      }
      updateRevealPhase("static");
    };

    const handleEligibilityChange = () => {
      if (!isEligible()) failOpen();
    };

    for (const query of [
      desktopQuery,
      finePointerQuery,
      reducedMotionQuery,
    ]) {
      const cleanup = subscribeToMediaQuery(query, handleEligibilityChange);
      if (!cleanup) {
        clearMediaQueryListeners();
        return;
      }
      mediaQueryCleanups.push(cleanup);
    }

    const startPanelSequence = () => {
      if (
        disposed ||
        revealCancelledRef.current ||
        revealStartedRef.current ||
        completedCourseCardReveals.has(course._id)
      ) {
        return;
      }

      revealStartedRef.current = true;
      updateRevealPhase("opening");
      try {
        sequenceWatchdogRef.current = window.setTimeout(() => {
          if (revealPhaseRef.current === "opening") failOpen();
        }, PANEL_SEQUENCE_WATCHDOG_MS);
      } catch {
        failOpen();
      }
    };

    const prepareImage = () => {
      if (disposed || revealCancelledRef.current || revealStartedRef.current) {
        return;
      }

      if (!image.complete) {
        if (removeImageReadinessListeners) return;

        const handleImageLoad = () => {
          clearImageReadinessWait();
          prepareImage();
        };
        const handleImageError = () => failOpen();

        try {
          removeImageReadinessListeners = () => {
            try {
              image.removeEventListener("load", handleImageLoad);
            } catch {
              // Keep the static fallback even if listener removal fails.
            }
            try {
              image.removeEventListener("error", handleImageError);
            } catch {
              // Keep the static fallback even if listener removal fails.
            }
          };
          image.addEventListener("load", handleImageLoad);
          image.addEventListener("error", handleImageError);
          imageReadinessTimeout = window.setTimeout(
            failOpen,
            IMAGE_READINESS_TIMEOUT_MS,
          );
        } catch {
          failOpen();
        }
        return;
      }

      if (image.naturalWidth <= 0) {
        failOpen();
        return;
      }

      if (typeof image.decode !== "function") {
        startPanelSequence();
        return;
      }

      if (isDecoding) return;
      isDecoding = true;

      let decodePromise: Promise<void>;
      try {
        decodePromise = image.decode();
      } catch {
        failOpen();
        return;
      }

      try {
        imageReadinessTimeout = window.setTimeout(
          failOpen,
          IMAGE_READINESS_TIMEOUT_MS,
        );
      } catch {
        failOpen();
        return;
      }
      decodePromise.then(
        () => {
          if (disposed || revealCancelledRef.current) return;
          clearImageReadinessWait();
          startPanelSequence();
        },
        () => failOpen(),
      );
    };

    try {
      observer = new IntersectionObserver(
        (entries) => {
          const entry = entries.find((candidate) => candidate.target === frame);
          if (
            !entry ||
            !entry.isIntersecting ||
            entry.intersectionRatio < 0.15
          ) {
            return;
          }

          try {
            observer?.disconnect();
          } catch {
            failOpen();
            return;
          }
          prepareImage();
        },
        { threshold: [0, 0.15] },
      );
      observer.observe(frame);
    } catch {
      failOpen();
      return;
    }

    return () => {
      disposed = true;
      try {
        observer?.disconnect();
      } catch {
        // Cleanup failure does not alter the already-rendered card.
      }
      clearImageReadinessWait();
      clearMediaQueryListeners();
      if (sequenceWatchdogRef.current !== null) {
        try {
          window.clearTimeout(sequenceWatchdogRef.current);
        } catch {
          // The component is already leaving the tree.
        }
        sequenceWatchdogRef.current = null;
      }
    };
  }, [course._id, thumbnail, updateRevealPhase]);

  const cancelRevealForFocus = () => {
    revealCancelledRef.current = true;
    if (sequenceWatchdogRef.current !== null) {
      try {
        window.clearTimeout(sequenceWatchdogRef.current);
      } catch {
        // Focus should expose the full card even if the timer API fails.
      }
      sequenceWatchdogRef.current = null;
    }
    updateRevealPhase("static");
  };

  const finishPanelSequence = (event: AnimationEvent<HTMLSpanElement>) => {
    if (
      event.target !== event.currentTarget ||
      event.currentTarget.dataset.panelIndex !== "2" ||
      revealCancelledRef.current ||
      revealPhaseRef.current !== "opening"
    ) {
      return;
    }

    if (sequenceWatchdogRef.current !== null) {
      try {
        window.clearTimeout(sequenceWatchdogRef.current);
      } catch {
        // Text reveal continues even if the watchdog cannot be cleared.
      }
      sequenceWatchdogRef.current = null;
    }
    completedCourseCardReveals.add(course._id);
    updateRevealPhase("settled");
  };

  const cardMotionClass =
    revealPhase === "opening"
      ? styles.opening
      : revealPhase === "settled"
        ? styles.settled
        : "";

  return (
    <Link
      href={`/courses/${course.slug}`}
      onFocusCapture={cancelRevealForFocus}
      className={`flex h-full scroll-mt-[22rem] flex-col overflow-hidden rounded-2xl border border-blue/10 bg-white shadow-sm shadow-blue/5 transition-[border-color,box-shadow] duration-200 hover:border-blue/25 hover:shadow-md hover:shadow-blue/10 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-white md:scroll-mt-[16rem] lg:scroll-mt-[11rem] ${styles.cardLink} ${cardMotionClass}`}
    >
      {thumbnail && (
        <div
          ref={thumbnailFrameRef}
          className={`relative aspect-[var(--thumbnail-aspect-ratio)] w-full shrink-0 overflow-hidden bg-blue/[0.035] ${styles.thumbnailFrame}`}
          style={
            {
              "--thumbnail-aspect-ratio": thumbnailAspectRatio,
            } as CSSProperties
          }
        >
          <Image
            ref={thumbnailImageRef}
            src={thumbnail}
            alt={course.title}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 84vw"
            className="object-contain object-center"
          />
          <div className={styles.panelLayer} aria-hidden="true">
            <span className={`${styles.panel} ${styles.panelFirst}`} />
            <span className={`${styles.panel} ${styles.panelSecond}`} />
            <span
              className={`${styles.panel} ${styles.panelThird}`}
              data-panel-index="2"
              onAnimationEnd={finishPanelSequence}
            />
          </div>
        </div>
      )}

      <div className={`flex flex-1 flex-col gap-2.5 p-5 md:p-6 ${styles.cardCopy}`}>
        <h3 className="min-h-[3.5rem] text-lg font-bold leading-snug text-blue">
          {course.title}
        </h3>

        <div className="flex flex-wrap items-center gap-2">
          {course.category && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue px-3 py-1 text-xs font-bold text-white">
              <CourseCategoryIcon category={course.category} size={13} />
              {COURSE_CATEGORY_LABELS[course.category] || course.category}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow px-3 py-1 text-xs font-bold text-blue">
            {course.format}
          </span>
        </div>

        {course.instructor?.name && (
          <p className="line-clamp-1 text-sm font-medium text-blue/75">
            <span className="text-blue/50">Giảng viên · </span>{course.instructor.name}
          </p>
        )}

        {course.ratingCount > 0 && (
          <div className="flex items-center gap-1.5">
            <StarRating value={course.ratingAverage} size={14} />
            <span className="text-xs font-bold text-blue/60">
              ({course.ratingCount})
            </span>
          </div>
        )}

        <p className="flex min-w-0 items-start gap-2 border-t border-blue/10 pt-3 text-sm font-semibold leading-5 text-blue">
          <Calendar size={15} className="mt-0.5 shrink-0 text-blue/60" />
          <span className="min-w-0 break-words"><span className="font-medium text-blue/55">Lịch học · </span>{course.schedule}</span>
        </p>

        <div className="mt-auto pt-0">
          <ViewDetailLabel />
        </div>
      </div>
    </Link>
  );
}
