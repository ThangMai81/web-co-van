"use client";

import { useState } from "react";
import Image from "next/image";
import CategoryIcon from "./CategoryIcon";
import type { ProgramCategory } from "@/types/program";

export default function ProgramCardThumbnail({
  src,
  alt,
  category,
  isPast,
}: {
  src: string;
  alt: string;
  category: ProgramCategory;
  isPast: boolean;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const hasError = failedSrc === src;

  return (
    <>
      <Image
        src={src}
        alt={alt}
        fill
        onError={() => setFailedSrc(src)}
        onLoad={() =>
          setFailedSrc((currentFailedSrc) =>
            currentFailedSrc === src ? null : currentFailedSrc,
          )
        }
        className={`object-cover transition-[transform,filter] duration-[1400ms] ease-out group-hover:scale-[1.07] motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${
          isPast ? "grayscale-[35%] group-hover:grayscale-0" : ""
        } ${hasError ? "opacity-0" : ""}`}
      />
      {!hasError && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-blue/45 to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-100"
        />
      )}
      {hasError && (
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center bg-blue/10"
        >
          <CategoryIcon
            category={category}
            size={48}
            className="text-blue/50"
          />
        </div>
      )}
    </>
  );
}
