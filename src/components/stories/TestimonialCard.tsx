"use client";

import { useState } from "react";

type Testimonial = {
  _id: string;
  name: string;
  role?: string;
  quote?: string;
  story?: string;
};

const AVATAR_COLORS = [
  "bg-sun text-ink",
  "bg-flame text-cream",
  "bg-teal-deep text-cream",
  "bg-crimson text-cream",
  "bg-plum text-cream",
];

export function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: Testimonial;
  index: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasMore = !!testimonial.story && testimonial.story.length > 0;

  return (
    <div className="flex h-full flex-col rounded-md border border-cream/15 bg-cream/[0.08] p-7">
      <span className="mb-4 block font-display text-5xl leading-none text-sun">
        "
      </span>

      <p className="mb-4 text-sm leading-relaxed text-cream">
        {testimonial.quote}
      </p>

      {expanded && hasMore && (
        <p className="mb-4 whitespace-pre-line border-t border-cream/15 pt-4 text-sm leading-relaxed text-cream/80">
          {testimonial.story}
        </p>
      )}

      {hasMore && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mb-6 self-start font-mono text-xs uppercase tracking-wider text-sun hover:underline"
        >
          {expanded ? "Thu gọn" : "Đọc thêm →"}
        </button>
      )}

      <div className="mt-auto flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full font-mono text-sm font-bold ${
            AVATAR_COLORS[index % AVATAR_COLORS.length]
          }`}
        >
          {testimonial.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="text-sm font-semibold text-cream">
            {testimonial.name}
          </div>
          {testimonial.role && (
            <div className="font-mono text-xs uppercase tracking-wider text-sun/70">
              {testimonial.role}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
