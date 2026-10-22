"use client";

import Image from "next/image";
import { useState } from "react";

export default function CourseThumbnailImage({
  src,
  fallbackSrc,
  alt,
  sizes,
  className,
}: {
  src: string;
  fallbackSrc?: string;
  alt: string;
  sizes: string;
  className: string;
}) {
  const [currentSrc, setCurrentSrc] = useState(src);

  return (
    <Image
      src={currentSrc}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
      onError={() => {
        if (fallbackSrc && currentSrc !== fallbackSrc) {
          setCurrentSrc(fallbackSrc);
        }
      }}
    />
  );
}
