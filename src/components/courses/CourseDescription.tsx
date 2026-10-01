"use client";

import { useState } from "react";
import type { Course, CourseDetail } from "@/types/course";

export default function CourseDescription({
  course,
  detail,
}: {
  course: Course;
  detail: CourseDetail | null;
}) {
  const bullets = detail?.descriptionBullets ?? [];
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? bullets : bullets.slice(0, 2);

  return (
    <section>
      <h2 className="mb-3 text-xl font-bold text-slate-900">Mô tả</h2>

      <div className="rounded-xl bg-amber-50 p-5">
        <p className="mb-3 text-slate-700">{course.description}</p>

        {bullets.length > 0 && (
          <ul className="list-disc space-y-2 pl-5 text-slate-700">
            {visible.map((line, idx) => (
              <li key={idx}>{line}</li>
            ))}
          </ul>
        )}

        {bullets.length > 2 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-3 text-sm font-semibold text-amber-600 hover:underline"
          >
            {expanded ? "Ẩn bớt" : "Xem thêm"}
          </button>
        )}
      </div>

      {course.targetAudience && (
        <div className="mt-4 rounded-xl border border-amber-200 p-5">
          <h3 className="mb-2 font-bold text-amber-600">🧑‍🤝‍🧑 Đối tượng</h3>
          <p className="text-slate-700">{course.targetAudience}</p>
        </div>
      )}

      {course.highlights.length > 0 && (
        <div className="mt-4 rounded-xl border border-amber-200 p-5">
          <h3 className="mb-3 font-bold text-amber-600">✨ Nội dung nổi bật</h3>
          <ul className="list-disc space-y-1 pl-5 text-slate-700">
            {course.highlights.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {detail && detail.benefits.length > 0 && (
        <div className="mt-4 rounded-xl border border-amber-200 p-5">
          <h3 className="mb-3 font-bold text-amber-600">
            ✅ Lợi ích chương trình
          </h3>
          <ul className="list-disc space-y-1 pl-5 text-slate-700">
            {detail.benefits.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
