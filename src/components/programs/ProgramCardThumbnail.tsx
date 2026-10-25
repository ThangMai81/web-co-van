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
        className={`object-cover ${isPast ? "grayscale-[35%]" : ""} ${
          hasError ? "opacity-0" : ""
        }`}
      />
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
