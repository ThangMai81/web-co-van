"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// Development-only placeholders; they do not document either real program.
const PREVIEW_FALLBACKS = [
  "/images/temp-gallery-preview/learning-trail-01.webp",
  "/images/temp-gallery-preview/learning-trail-02.webp",
  "/images/temp-gallery-preview/learning-trail-03.webp",
  "/images/temp-gallery-preview/learning-trail-04.webp",
] as const;

export default function ProgramGallery({
  images,
  revealAccent = false,
}: {
  images: string[];
  revealAccent?: boolean;
}) {
  const [failedSources, setFailedSources] = useState<Record<string, boolean>>({});
  const [accentState, setAccentState] = useState<"static" | "waiting" | "visible">("static");
  const accentRef = useRef<HTMLSpanElement>(null);
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

    return (
      <a
        key={failedSourceKey}
        href={displaySrc}
        target="_blank"
        rel="noreferrer"
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
          className="object-cover object-center motion-safe:transition-transform motion-safe:duration-300 motion-safe:ease-out motion-safe:group-hover:scale-[1.025]"
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
