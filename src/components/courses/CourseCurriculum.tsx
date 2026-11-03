"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Chapter } from "@/types/course";
import styles from "./CourseCurriculum.module.css";
import panelStyles from "./CourseCurriculumPanelTransition.module.css";

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CourseCurriculum({
  curriculum,
  totalDurationLabel,
}: {
  curriculum: Chapter[];
  totalDurationLabel?: string;
}) {
  const totalLessons = curriculum.reduce((sum, c) => sum + c.lessons.length, 0);
  const pathname = usePathname();
  const [entryAnimationPending, setEntryAnimationPending] = useState(false);
  const entryAnimationPendingRef = useRef(false);
  const firstChapterRef = useRef<HTMLDetailsElement | null>(null);
  const previousPathnameRef = useRef<string | null>(null);
  const courseRouteWasLeftRef = useRef(false);
  const entryAnimationFrameRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    if (pathname === null) return;

    if (entryAnimationFrameRef.current !== null) {
      window.cancelAnimationFrame(entryAnimationFrameRef.current);
      entryAnimationFrameRef.current = null;
    }

    const previousPathname = previousPathnameRef.current;
    const isCourseDetailPath = pathname.startsWith("/courses/");
    if (previousPathname?.startsWith("/courses/") && !isCourseDetailPath) {
      courseRouteWasLeftRef.current = true;
    }
    previousPathnameRef.current = pathname;
    const isNewCourseEntry = isCourseDetailPath && previousPathname !== pathname;
    if (isNewCourseEntry) courseRouteWasLeftRef.current = false;

    const scheduleEntryOpen = () => {
      if (typeof window.requestAnimationFrame !== "function") {
        entryAnimationPendingRef.current = false;
        setEntryAnimationPending(false);
        return;
      }

      entryAnimationFrameRef.current = window.requestAnimationFrame(() => {
        entryAnimationFrameRef.current = null;
        entryAnimationPendingRef.current = false;
        setEntryAnimationPending(false);
      });
    };

    if (!isCourseDetailPath) {
      entryAnimationPendingRef.current = false;
      setEntryAnimationPending(false);
      return;
    }

    if (!isNewCourseEntry) {
      // Strict Mode may replay this effect after its first scheduled frame was cancelled.
      if (entryAnimationPendingRef.current) scheduleEntryOpen();
      return () => {
        if (entryAnimationFrameRef.current !== null) {
          window.cancelAnimationFrame(entryAnimationFrameRef.current);
          entryAnimationFrameRef.current = null;
        }
      };
    }

    if (firstChapterRef.current) firstChapterRef.current.open = true;

    let reducedMotion = true;
    try {
      reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? true;
    } catch {
      reducedMotion = true;
    }

    if (reducedMotion || typeof window.requestAnimationFrame !== "function") {
      entryAnimationPendingRef.current = false;
      setEntryAnimationPending(false);
      return;
    }

    entryAnimationPendingRef.current = true;
    setEntryAnimationPending(true);
    scheduleEntryOpen();

    return () => {
      if (entryAnimationFrameRef.current !== null) {
        window.cancelAnimationFrame(entryAnimationFrameRef.current);
        entryAnimationFrameRef.current = null;
      }
    };
  }, [pathname]);

  useEffect(() => {
    const replaySamePathEntry = () => {
      const currentPathname = window.location.pathname;
      if (
        !currentPathname.startsWith("/courses/") ||
        currentPathname !== previousPathnameRef.current
      ) {
        return;
      }

      if (entryAnimationPendingRef.current) return;

      if (firstChapterRef.current) firstChapterRef.current.open = true;

      let reducedMotion = true;
      try {
        reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? true;
      } catch {
        reducedMotion = true;
      }

      if (reducedMotion || typeof window.requestAnimationFrame !== "function") return;

      entryAnimationPendingRef.current = true;
      setEntryAnimationPending(true);
      try {
        entryAnimationFrameRef.current = window.requestAnimationFrame(() => {
          entryAnimationFrameRef.current = null;
          entryAnimationPendingRef.current = false;
          setEntryAnimationPending(false);
        });
      } catch {
        entryAnimationFrameRef.current = null;
        entryAnimationPendingRef.current = false;
        setEntryAnimationPending(false);
      }
    };

    type NavigationEntryChange = Event & {
      from?: { url?: string } | null;
    };
    const navigation = (window as Window & { navigation?: EventTarget }).navigation;
    let pagehideUrl: URL | null = null;

    const handleCurrentEntryChange = (event: Event) => {
      const change = event as NavigationEntryChange;
      const fromUrl = change.from?.url;
      if (!fromUrl) return;

      const from = new URL(fromUrl);
      const current = new URL(window.location.href);
      const fromIsCourseRoute = from.pathname.startsWith("/courses/");
      const currentIsCourseRoute = current.pathname.startsWith("/courses/");
      if (fromIsCourseRoute && !currentIsCourseRoute) {
        courseRouteWasLeftRef.current = true;
      }

      if (!currentIsCourseRoute || current.pathname !== previousPathnameRef.current) {
        return;
      }

      const returnedFromAnotherPath = from.pathname !== current.pathname;
      // A same-URL traversal only replays after this mounted route observed a real exit.
      if (courseRouteWasLeftRef.current && returnedFromAnotherPath) {
        courseRouteWasLeftRef.current = false;
        replaySamePathEntry();
      }
    };

    const handlePageHide = (event: PageTransitionEvent) => {
      if (event.persisted) pagehideUrl = new URL(window.location.href);
    };
    const handlePageShow = (event: PageTransitionEvent) => {
      if (!event.persisted) return;

      const current = new URL(window.location.href);
      const hiddenAt = pagehideUrl;
      pagehideUrl = null;
      if (
        !current.pathname.startsWith("/courses/") ||
        current.pathname !== previousPathnameRef.current ||
        (hiddenAt !== null && hiddenAt.pathname !== current.pathname)
      ) {
        return;
      }

      courseRouteWasLeftRef.current = false;
      replaySamePathEntry();
    };

    navigation?.addEventListener("currententrychange", handleCurrentEntryChange);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("pageshow", handlePageShow);
    return () => {
      navigation?.removeEventListener("currententrychange", handleCurrentEntryChange);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-t-xl bg-blue px-5 py-3 text-white">
        <h2 className="font-bold">Nội dung chương trình</h2>
        <span className="text-sm font-medium">
          {curriculum.length} Chương • {totalLessons} Bài giảng
          {totalDurationLabel ? ` • ${totalDurationLabel}` : ""}
        </span>
      </div>

      <div className="divide-y divide-blue/10 rounded-b-xl border border-blue/15">
        {curriculum.map((chapter, idx) => (
          <details
            key={idx}
            ref={idx === 0 ? firstChapterRef : undefined}
            open={idx === 0}
            data-route-entry-pending={idx === 0 && entryAnimationPending ? "true" : undefined}
            className={panelStyles.panelTransition}
          >
            <summary
              className={`${styles.summary} cursor-pointer list-none bg-blue/5 pl-5 pr-12 py-3 font-bold text-blue`}
            >
              Chương {idx + 1}: {chapter.title}
              <span className="ml-2 whitespace-nowrap text-xs font-medium text-blue/60">
                {chapter.lessons.length} bài giảng
              </span>
            </summary>
            <div className="divide-y divide-blue/10">
              {chapter.lessons.map((lesson, lIdx) => (
                <div
                  key={lIdx}
                  className="flex flex-wrap items-center gap-3 px-5 py-3"
                >
                  <span className="font-bold text-blue">
                    Bài giảng {lIdx + 1}: {lesson.title}
                  </span>
                  <span className="rounded-full bg-blue px-2 py-0.5 text-xs font-bold text-white">
                    {lesson.format === "online" ? "Trực tuyến" : "Trực tiếp"}
                  </span>
                  {lesson.scheduledAt && (
                    <span className="text-sm font-medium text-blue/60">
                      {formatDate(lesson.scheduledAt)}
                      {lesson.durationHours
                        ? ` - ${lesson.durationHours} tiếng`
                        : ""}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
