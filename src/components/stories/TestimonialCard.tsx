"use client";

import { useState } from "react";
import styles from "./Stories.module.css";

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
    <div
      className={`${styles.card} flex h-full flex-col rounded-2xl border border-white/10 p-6 sm:p-7 ${
        index % 3 === 1 ? "bg-white/[0.09]" : "bg-white/5"
      } hover:bg-white/8`}
    >
      <div className="mb-3 flex items-start justify-between">
        <span className={`${styles.cardQuote} block font-display text-5xl leading-none text-yellow`}>“</span>
        <span aria-hidden="true" className="font-mono text-xs font-bold tracking-widest text-white/25">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <p className="mb-4 text-sm font-medium leading-relaxed text-white/85">
        {testimonial.quote}
      </p>

      {hasMore && (
        <div className={styles.storyPanel} data-open={expanded} aria-hidden={!expanded}>
          <div>
            <p className="mb-4 whitespace-pre-line border-t border-white/10 pt-4 text-sm leading-relaxed text-white/70">
              {testimonial.story}
            </p>
          </div>
        </div>
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
