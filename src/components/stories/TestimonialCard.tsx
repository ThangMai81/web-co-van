"use client";

import { useState } from "react";
import { Reveal } from "@/components/animation/Reveal";

type Testimonial = {
  _id: string;
  name: string;
  role?: string;
  quote?: string;
  story?: string;
};

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
    <div className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-6 transition-colors duration-200 hover:bg-white/8 sm:p-7">
      <span className="mb-3 block font-display text-4xl leading-none text-yellow">"</span>

      <p className="mb-4 text-sm font-medium leading-relaxed text-white/85">
        {testimonial.quote}
      </p>

      {expanded && hasMore && (
        <p className="mb-4 whitespace-pre-line border-t border-white/10 pt-4 text-sm leading-relaxed text-white/70">
          {testimonial.story}
        </p>
      )}

      {hasMore && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mb-5 self-start font-mono text-xs font-bold uppercase tracking-wider text-yellow hover:underline"
        >
          {expanded ? "Thu gọn" : "Đọc thêm →"}
        </button>
      )}

      <div className="mt-auto flex items-center gap-3 border-t border-white/10 pt-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow font-mono text-sm font-bold text-blue">
          {testimonial.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="text-sm font-bold text-white">{testimonial.name}</div>
          {testimonial.role && (
            <div className="mt-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-yellow/70">
              {testimonial.role}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
