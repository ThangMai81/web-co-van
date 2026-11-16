"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import ProgramGalleryImageViewer from "./ProgramGalleryImageViewer";
import { Camera, Maximize2 } from "lucide-react";

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
  programTitle,
  images,
  revealAccent = false,
  revealEntries = false,
}: {
  programTitle: string;
  images: string[];
  revealAccent?: boolean;
  revealEntries?: boolean;
}) {
  const [failedSources, setFailedSources] = useState<Record<string, boolean>>({});
  const [accentState, setAccentState] = useState<"static" | "waiting" | "visible">("static");
  const [imageEntryStates, setImageEntryStates] = useState<
    Record<number, "pending" | "revealing" | "focused" | "visible">
  >({});
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const accentRef = useRef<HTMLSpanElement>(null);
  const imageTriggersRef = useRef<Map<number, HTMLButtonElement>>(new Map());
  const viewerOriginIndexRef = useRef<number | null>(null);
  const imageEntryObserverRef = useRef<IntersectionObserver | null>(null);
  const completedImageIndexesRef = useRef<Set<number>>(new Set());
  const isLocalPreview = process.env.NODE_ENV !== "production";
  const displayImages = images.map((src, index) => {
    const fallbackSrc = PREVIEW_FALLBACKS[index];
    return isLocalPreview && failedSources[`${index}:${src}`] && fallbackSrc
      ? fallbackSrc
      : src;
  });
  const placeholderImages = displayImages.map(
    (displaySrc, index) => displaySrc !== images[index],
  );
  const galleryLayout = (index: number) => {
    const count = images.length;
    if (count === 1) {
      return {
        className: "col-span-2 aspect-[4/3] sm:aspect-[16/9] lg:col-span-12 lg:row-span-2 lg:aspect-auto",
        sizes: "(min-width: 1024px) 60rem, 100vw",
      };
    }
    if (count === 2) {
      return index === 0
        ? { className: "col-span-2 aspect-[4/3] lg:col-span-7 lg:row-span-2 lg:aspect-auto", sizes: "(min-width: 1024px) 34rem, 100vw" }
        : { className: "col-span-2 aspect-[4/3] lg:col-span-5 lg:row-span-2 lg:aspect-auto", sizes: "(min-width: 1024px) 25rem, 100vw" };
    }
    if (count === 3) {
      return index === 0
        ? { className: "col-span-2 aspect-[16/10] lg:col-span-7 lg:row-span-2 lg:aspect-auto", sizes: "(min-width: 1024px) 34rem, 100vw" }
        : { className: "col-span-1 aspect-square lg:col-span-5 lg:aspect-auto", sizes: "(min-width: 1024px) 25rem, 50vw" };
    }
    if (index === 0) {
      return { className: "col-span-2 aspect-[16/10] lg:col-span-6 lg:row-span-2 lg:aspect-auto", sizes: "(min-width: 1024px) 30rem, 100vw" };
    }
    if (index === 1) {
      return { className: "col-span-2 aspect-[16/9] lg:col-span-6 lg:aspect-auto", sizes: "(min-width: 1024px) 30rem, 100vw" };
    }
    return { className: "col-span-1 aspect-square lg:col-span-3 lg:aspect-auto", sizes: "(min-width: 1024px) 15rem, 50vw" };
  };

  const openImageViewer = (index: number) => {
    viewerOriginIndexRef.current = index;
    setActiveImageIndex(index);
  };

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
    const imageLinks = Array.from(imageTriggersRef.current.entries());
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

  const renderImage = (src: string, index: number) => {
    const layout = galleryLayout(index);
    const failedSourceKey = `${index}:${src}`;
    const fallbackSrc = PREVIEW_FALLBACKS[index];
    const displaySrc =
      isLocalPreview && failedSources[failedSourceKey] && fallbackSrc
        ? fallbackSrc
        : src;
    const showingFallback = displaySrc !== src;
    const imageLabel = `${programTitle} — ${showingFallback ? "ảnh minh họa" : "ảnh"} ${index + 1}`;
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
      <figure
        key={failedSourceKey}
        className={`group relative rounded-[1.4rem] bg-white p-1.5 shadow-[0_14px_34px_rgba(24,37,68,.10)] ring-1 ring-blue/10 motion-safe:transition-[transform,box-shadow] motion-safe:duration-300 motion-safe:ease-out hover:-translate-y-1 hover:shadow-[0_22px_44px_rgba(24,37,68,.18)] ${layout.className}`}
      >
        <button
          ref={(button) => {
            if (button) imageTriggersRef.current.set(index, button);
            else imageTriggersRef.current.delete(index);
          }}
          type="button"
          data-gallery-image-index={index}
          aria-label={`${showingFallback ? "Mở ảnh minh họa" : "Phóng to ảnh"} ${index + 1} của chương trình ${programTitle}`}
          onClick={() => openImageViewer(index)}
          onFocus={() => {
            if (!revealEntries) return;
            completedImageIndexesRef.current.add(index);
            try {
              const button = imageTriggersRef.current.get(index);
              if (button) imageEntryObserverRef.current?.unobserve(button);
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
          className="absolute inset-1.5 cursor-zoom-in overflow-hidden rounded-[1.05rem] bg-blue/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue"
        >
          <Image
            src={displaySrc}
            alt={imageLabel}
            fill
            sizes={layout.sizes}
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
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-blue/75 via-blue/20 to-transparent px-4 pb-3 pt-12 opacity-0 motion-safe:transition-opacity motion-safe:duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
          >
            <span className="font-mono text-xs font-bold tracking-[.18em] text-yellow">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-blue shadow">
              <Maximize2 size={13} aria-hidden="true" />
              Xem ảnh
            </span>
          </span>
        </button>
        {showingFallback && (
          <span
            aria-hidden="true"
            className="absolute bottom-2 left-2 z-10 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-blue shadow"
          >
            Ảnh minh họa
          </span>
        )}
      </figure>
    );
  };

  return (
    <section
      aria-labelledby="program-gallery-heading"
      className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#fff6d6] via-white to-[#e9f0fb] p-5 ring-1 ring-blue/10 md:p-8"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 -top-24 -z-10 h-64 w-64 rounded-full bg-yellow/30 blur-3xl"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -left-16 -z-10 h-64 w-64 rounded-full bg-blue/10 blur-3xl"
      />
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3 md:mb-8">
        <div>
          <p className="mb-2 font-mono text-xs font-bold uppercase tracking-[.2em] text-blue/55">
            Khoảnh khắc chương trình
          </p>
          <h2
            id="program-gallery-heading"
            className="flex items-center gap-3 font-editorial text-2xl font-bold text-blue md:text-3xl"
          >
            <span
              ref={accentRef}
              aria-hidden="true"
              className={`h-6 w-1.5 rounded-full bg-yellow ${accentMotionClass}`}
            />
            <span className="inline-flex items-center gap-2"><Camera size={22} className="text-yellow" aria-hidden="true" />Thư viện ảnh</span>
          </h2>
        </div>
        <span aria-hidden="true" className="inline-flex items-center gap-2 rounded-full bg-white/90 px-3.5 py-1.5 text-sm font-semibold text-blue shadow-sm ring-1 ring-blue/10">
          <span className="font-bold">{images.length} ảnh</span>
          <span className="text-blue/50">· bấm để phóng to</span>
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 md:gap-4 lg:auto-rows-[13.5rem] lg:grid-cols-12 lg:gap-5">
        {images.map((src, index) => renderImage(src, index))}
      </div>
      <ProgramGalleryImageViewer
        programTitle={programTitle}
        images={displayImages}
        originalImages={images}
        placeholderImages={placeholderImages}
        activeIndex={activeImageIndex}
        onClose={() => setActiveImageIndex(null)}
        onSelect={(index) => setActiveImageIndex(index)}
        triggerRefs={imageTriggersRef}
        originIndexRef={viewerOriginIndexRef}
      />
    </section>
  );
}
