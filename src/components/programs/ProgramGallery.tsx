"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

// Development-only placeholders; they do not document either real program.
const PREVIEW_FALLBACKS = [
  "/images/temp-gallery-preview/learning-trail-01.webp",
  "/images/temp-gallery-preview/learning-trail-02.webp",
  "/images/temp-gallery-preview/learning-trail-03.webp",
  "/images/temp-gallery-preview/learning-trail-04.webp",
] as const;

function subscribeToMotionPreference(
  query: MediaQueryList,
  listener: () => void,
) {
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

  throw new Error("Motion preference change events are unavailable");
}

export default function ProgramGallery({
  images,
  revealAccent = false,
  revealEntries = false,
}: {
  images: string[];
  revealAccent?: boolean;
  revealEntries?: boolean;
}) {
  const [failedSources, setFailedSources] = useState<Record<string, boolean>>({});
  const [accentState, setAccentState] = useState<"static" | "waiting" | "visible">("static");
  const [imageEntryStates, setImageEntryStates] = useState<
    Record<number, "pending" | "revealing" | "focused" | "visible">
  >({});
  const accentRef = useRef<HTMLSpanElement>(null);
  const imageLinksRef = useRef<Map<number, HTMLAnchorElement>>(new Map());
  const imageEntryObserverRef = useRef<IntersectionObserver | null>(null);
  const completedImageIndexesRef = useRef<Set<number>>(new Set());
  const isLocalPreview = process.env.NODE_ENV !== "production";
  const supportingImages = images.slice(1);
  const supportingColumns =
    supportingImages.length >= 3
      ? "grid-cols-2 sm:grid-cols-3"
      : supportingImages.length === 2
        ? "grid-cols-2 sm:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-1";
  const supportingLayout =
    supportingImages.length === 3
      ? "lg:grid-cols-2 lg:grid-rows-2"
      : supportingImages.length === 2
        ? "lg:grid-cols-1 lg:grid-rows-2"
        : "lg:grid-cols-1";

  useEffect(() => {
    if (!revealAccent) {
      setAccentState("static");
      return;
    }

    const accent = accentRef.current;
    if (!accent) return;

    let observer: IntersectionObserver | null = null;
    let hasIntersected = false;

    try {
      if (
        typeof window.matchMedia !== "function" ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        typeof IntersectionObserver === "undefined"
      ) {
        setAccentState("static");
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.target === accent && entry.isIntersecting)) {
            return;
          }

          hasIntersected = true;
          setAccentState("visible");
          observer?.unobserve(accent);
        },
        { root: null, rootMargin: "0px", threshold: 0 },
      );
      observer.observe(accent);
      setAccentState(hasIntersected ? "visible" : "waiting");
    } catch {
      observer?.disconnect();
      setAccentState("static");
      return;
    }

    return () => observer?.disconnect();
  }, [revealAccent]);

  useIsomorphicLayoutEffect(() => {
    const imageLinks = Array.from(imageLinksRef.current.entries());
    if (!revealEntries || imageLinks.length === 0) return;

    let observer: IntersectionObserver | null = null;
    let removeMotionPreferenceListener: () => void = () => {};
    const showAllImmediately = () => {
      const visibleImages: Record<number, "visible"> = {};
      for (const [index] of imageLinks) {
        completedImageIndexesRef.current.add(index);
        visibleImages[index] = "visible";
      }
      setImageEntryStates((current) => ({ ...current, ...visibleImages }));
      try {
        observer?.disconnect();
      } catch {
        // Images stay visible even if observer cleanup fails.
      }
      if (imageEntryObserverRef.current === observer) {
        imageEntryObserverRef.current = null;
      }
      observer = null;
    };

    try {
      if (
        typeof window.matchMedia !== "function" ||
        typeof CSS === "undefined" ||
        typeof CSS.supports !== "function" ||
        !CSS.supports("clip-path", "inset(0 0 0 0)") ||
        typeof IntersectionObserver === "undefined"
      ) {
        showAllImmediately();
      } else {
        const reducedMotionQuery = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        );
        removeMotionPreferenceListener = subscribeToMotionPreference(
          reducedMotionQuery,
          () => {
            if (reducedMotionQuery.matches) showAllImmediately();
          },
        );

        if (reducedMotionQuery.matches) {
          showAllImmediately();
        } else {
          const pendingImages: Record<number, "pending"> = {};
          for (const [index] of imageLinks) {
            if (!completedImageIndexesRef.current.has(index)) {
              pendingImages[index] = "pending";
            }
          }
          setImageEntryStates((current) => ({ ...current, ...pendingImages }));

          observer = new IntersectionObserver(
            (entries) => {
              const updates: Record<
                number,
                "pending" | "revealing"
              > = {};

              for (const entry of entries) {
                const index = Number(
                  (entry.target as HTMLElement).dataset.galleryImageIndex,
                );
                if (
                  !Number.isInteger(index) ||
                  index < 0 ||
                  completedImageIndexesRef.current.has(index)
                ) {
                  continue;
                }

                if (entry.isIntersecting) {
                  completedImageIndexesRef.current.add(index);
                  updates[index] = "revealing";
                  try {
                    observer?.unobserve(entry.target);
                  } catch {
                    showAllImmediately();
                    return;
                  }
                } else {
                  updates[index] = "pending";
                }
              }

              if (Object.keys(updates).length > 0) {
                setImageEntryStates((current) => ({ ...current, ...updates }));
              }

              if (completedImageIndexesRef.current.size >= imageLinks.length) {
                try {
                  observer?.disconnect();
                } catch {
                  // Completed images remain visible if cleanup fails.
                }
                if (imageEntryObserverRef.current === observer) {
                  imageEntryObserverRef.current = null;
                }
              }
            },
            { root: null, rootMargin: "0px", threshold: 0 },
          );
          imageEntryObserverRef.current = observer;

          for (const [index, link] of imageLinks) {
            if (!completedImageIndexesRef.current.has(index)) {
              observer.observe(link);
            }
          }

          if (completedImageIndexesRef.current.size >= imageLinks.length) {
            observer.disconnect();
            imageEntryObserverRef.current = null;
          }
        }
      }
    } catch {
      showAllImmediately();
    }

    return () => {
      try {
        removeMotionPreferenceListener();
      } catch {
        // Observer cleanup below still runs if listener removal fails.
      }
      try {
        observer?.disconnect();
      } catch {
        // Visible gallery links remain usable if observer cleanup fails.
      }
      if (imageEntryObserverRef.current === observer) {
        imageEntryObserverRef.current = null;
      }
    };
  }, [images, revealEntries]);

  const accentMotionClass = revealAccent
    ? `motion-safe:transition-opacity motion-safe:duration-300 motion-reduce:opacity-100 motion-reduce:transition-none ${accentState === "waiting" ? "opacity-0" : "opacity-100"}`
    : "";

  const renderImage = (
    src: string,
    index: number,
    featured = false,
    supportingClassName = "",
  ) => {
    const failedSourceKey = `${index}:${src}`;
    const showingFallback =
      isLocalPreview && failedSources[failedSourceKey] === true;
    const fallbackSrc = PREVIEW_FALLBACKS[index];
    const displaySrc = showingFallback && fallbackSrc ? fallbackSrc : src;
    const imageEntryState = imageEntryStates[index];
    const imageEntryDelay = `${Math.min(index * 50, 150)}ms`;
    const imageEntryStyle =
      revealEntries && imageEntryState === "pending"
        ? {
            clipPath: "inset(100% 0 0 0)",
            transitionDuration: "260ms, 300ms",
            transitionDelay: `${imageEntryDelay}, 0ms`,
          }
        : revealEntries && imageEntryState === "revealing"
          ? {
              clipPath: "inset(0 0 0 0)",
              transitionDuration: "260ms, 300ms",
              transitionDelay: `${imageEntryDelay}, 0ms`,
            }
          : revealEntries && imageEntryState === "focused"
            ? {
                clipPath: "none",
                transitionDuration: "0ms, 300ms",
                transitionDelay: "0ms, 0ms",
              }
            : revealEntries && imageEntryState === "visible"
              ? {
                  transitionDuration: "0ms, 300ms",
                  transitionDelay: "0ms, 0ms",
                }
              : undefined;

    return (
      <a
        key={failedSourceKey}
        ref={(link) => {
          if (link) imageLinksRef.current.set(index, link);
          else imageLinksRef.current.delete(index);
        }}
        data-gallery-image-index={index}
        href={displaySrc}
        target="_blank"
        rel="noreferrer"
        onFocus={() => {
          if (!revealEntries) return;
          completedImageIndexesRef.current.add(index);
          try {
            const link = imageLinksRef.current.get(index);
            if (link) imageEntryObserverRef.current?.unobserve(link);
          } catch {
            // Focus remains available if observer cleanup fails.
          }
          setImageEntryStates((current) => ({ ...current, [index]: "focused" }));
        }}
        onBlur={() => {
          setImageEntryStates((current) =>
            current[index] === "focused"
              ? { ...current, [index]: "visible" }
              : current,
          );
        }}
        className={`group relative block overflow-hidden rounded-2xl border border-blue/15 bg-white shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
          featured
            ? "col-span-1 aspect-[16/9] sm:aspect-[16/10] lg:aspect-[4/3]"
            : "aspect-[4/3] lg:aspect-auto"
        } ${supportingClassName}`}
      >
        <Image
          src={displaySrc}
          alt={`Ảnh ${index + 1}`}
          fill
          sizes={
            featured
              ? "(min-width: 1024px) 38vw, 90vw"
              : "(min-width: 1024px) 29vw, (min-width: 640px) 30vw, 40vw"
          }
          className={`object-cover object-center ${
            revealEntries
              ? "motion-safe:transition-[clip-path,transform]"
              : "motion-safe:transition-transform"
          } motion-safe:duration-300 motion-safe:ease-out motion-safe:group-hover:scale-[1.025]`}
          style={imageEntryStyle}
          onTransitionEnd={(event) => {
            if (
              event.propertyName !== "clip-path" ||
              imageEntryStates[index] !== "revealing"
            ) {
              return;
            }
            setImageEntryStates((current) =>
              current[index] === "revealing"
                ? { ...current, [index]: "visible" }
                : current,
            );
          }}
          onError={() => {
            if (!isLocalPreview || showingFallback || !fallbackSrc) return;
            setFailedSources((current) => ({
              ...current,
              [failedSourceKey]: true,
            }));
          }}
        />
      </a>
    );
  };

  return (
    <section
      aria-labelledby="program-gallery-heading"
      className="mt-12 border-t border-blue/10 pt-8"
    >
      <h2
        id="program-gallery-heading"
        className="mb-5 flex items-center gap-3 font-bold text-blue"
      >
        <span
          ref={accentRef}
          aria-hidden="true"
          className={`h-5 w-1 rounded-full bg-yellow ${accentMotionClass}`}
        />
        <span>📷 Thư viện ảnh</span>
      </h2>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-stretch lg:gap-4">
        {images[0] && renderImage(images[0], 0, true)}
        {supportingImages.length > 0 && (
          <div
            className={`grid gap-3 lg:h-full lg:gap-4 ${supportingColumns} ${supportingLayout}`}
          >
            {supportingImages.map((src, offset) => {
              const index = offset + 1;
              const finalSupportingImage = offset === supportingImages.length - 1;
              const centeredFinalImage =
                supportingImages.length === 3 && finalSupportingImage;

              return renderImage(
                src,
                index,
                false,
                centeredFinalImage
                  ? "col-span-2 mx-auto w-1/2 sm:col-span-1 sm:mx-0 sm:w-full lg:col-span-2"
                  : "",
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
