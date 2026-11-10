"use client";

import { useId, useState } from "react";
import type { Course, CourseDetail } from "@/types/course";
import styles from "./CourseDescription.module.css";
import { CircleCheck, Sparkles } from "lucide-react";

export default function CourseDescription({
  course,
  detail,
}: {
  course: Course;
  detail: CourseDetail | null;
}) {
  const description = course.description?.trim() ?? "";
  const bullets = (detail?.descriptionBullets ?? []).filter((line) => line.trim());
  const extraBullets = bullets.slice(2);
  const extraBulletsId = useId();
  const [expanded, setExpanded] = useState(false);
  const highlights = course.highlights.filter((item) => item.trim());
  const extraHighlights = highlights.slice(2);
  const extraHighlightsId = useId();
  const [highlightsExpanded, setHighlightsExpanded] = useState(false);
  const benefits = (detail?.benefits ?? []).filter((item) => item.trim());

  if (
    !description &&
    bullets.length === 0 &&
    highlights.length === 0 &&
    benefits.length === 0
  ) {
    return null;
  }

  return (
    <section>
      <h2 className="mb-3 text-xl font-bold text-blue">Mô tả</h2>

      {(description || bullets.length > 0) && (
        <div className="rounded-xl border border-blue/10 bg-blue/5 p-5">
          {description && (
            <p className="mb-3 font-medium text-blue/90">{description}</p>
          )}

          {bullets.length > 0 && (
            <ul className="list-disc space-y-2 pl-5 font-medium text-blue/90">
              {bullets.slice(0, 2).map((line, idx) => (
                <li key={idx}>{line}</li>
              ))}
            </ul>
          )}

          {extraBullets.length > 0 && (
            <div
              id={extraBulletsId}
              aria-hidden={!expanded}
              className={`${styles.extraBullets} ${expanded ? styles.expanded : ""}`}
            >
              <ul
                className={`${styles.extraBulletsInner} list-disc space-y-2 pl-5 font-medium text-blue/90`}
              >
                {extraBullets.map((line, idx) => (
                  <li key={idx + 2}>{line}</li>
                ))}
              </ul>
            </div>
          )}

          {extraBullets.length > 0 && (
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              aria-controls={extraBulletsId}
              className={`mt-3 text-sm font-bold text-blue underline decoration-yellow decoration-2 underline-offset-4 hover:text-yellow ${styles.toggleBtn}`}
            >
              {expanded ? "Ẩn bớt" : "Xem thêm"}
              <span aria-hidden="true" className={`${styles.toggleBtnChevron} ${expanded ? styles.toggleBtnChevronOpen : ""}`} />
            </button>
          )}
        </div>
      )}

      {highlights.length > 0 && (
        <div className="mt-4 rounded-xl border border-blue/15 bg-white p-5">
          <h3 className="mb-3 flex items-center gap-2.5 font-bold text-blue">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-blue text-yellow">
              <Sparkles size={16} aria-hidden="true" />
            </span>
            Nội dung nổi bật
          </h3>
          <ul className="list-disc space-y-1 pl-5 font-medium text-blue/90">
            {highlights.slice(0, 2).map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>

          {extraHighlights.length > 0 && (
            <div
              id={extraHighlightsId}
              aria-hidden={!highlightsExpanded}
              className={`${styles.extraBullets} ${highlightsExpanded ? styles.expanded : ""}`}
            >
              <ul
                className={`${styles.extraBulletsInner} list-disc space-y-1 pl-5 font-medium text-blue/90`}
              >
                {extraHighlights.map((item, idx) => (
                  <li key={idx + 2}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {extraHighlights.length > 0 && (
            <button
              type="button"
              onClick={() => setHighlightsExpanded((v) => !v)}
              aria-expanded={highlightsExpanded}
              aria-controls={extraHighlightsId}
              className={`mt-3 text-sm font-bold text-blue underline decoration-yellow decoration-2 underline-offset-4 hover:text-yellow ${styles.toggleBtn}`}
            >
              {highlightsExpanded ? "Ẩn bớt" : "Xem thêm"}
              <span aria-hidden="true" className={`${styles.toggleBtnChevron} ${highlightsExpanded ? styles.toggleBtnChevronOpen : ""}`} />
            </button>
          )}
        </div>
      )}

      {benefits.length > 0 && (
        <div className="mt-4 rounded-xl border border-blue/15 bg-white p-5">
          <h3 className="mb-4 flex items-center gap-2.5 font-bold text-blue">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-yellow text-blue">
              <CircleCheck size={16} aria-hidden="true" />
            </span>
            Lợi ích chương trình
          </h3>
          <ul className="grid gap-3 sm:grid-cols-2">
            {benefits.map((item, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 rounded-xl border border-blue/10 bg-blue/[0.03] p-3 font-medium text-blue/90"
              >
                <CircleCheck
                  size={18}
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 text-yellow"
                  fill="currentColor"
                  stroke="white"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
