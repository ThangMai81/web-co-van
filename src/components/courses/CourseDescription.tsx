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
      <h2 className="mb-3 text-xl font-bold text-blue">Mô tả</h2>

      <div className="rounded-xl border border-blue/10 bg-blue/5 p-5">
        <p className="mb-3 font-medium text-blue/90">{course.description}</p>

        {bullets.length > 0 && (
          <ul className="list-disc space-y-2 pl-5 font-medium text-blue/90">
            {visible.map((line, idx) => (
              <li key={idx}>{line}</li>
            ))}
          </ul>
        )}

        {bullets.length > 2 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-3 text-sm font-bold text-blue underline decoration-yellow decoration-2 underline-offset-4 hover:text-yellow"
          >
            {expanded ? "Ẩn bớt" : "Xem thêm"}
          </button>
        )}
      </div>

      {course.targetAudience && (
        <div className="mt-4 rounded-xl border border-blue/15 bg-white p-5">
          <h3 className="mb-2 font-bold text-blue">🧑‍🤝‍🧑 Đối tượng</h3>
          <p className="font-medium text-blue/90">{course.targetAudience}</p>
        </div>
      )}

      {course.highlights.length > 0 && (
        <div className="mt-4 rounded-xl border border-blue/15 bg-white p-5">
          <h3 className="mb-3 font-bold text-blue">✨ Nội dung nổi bật</h3>
          <ul className="list-disc space-y-1 pl-5 font-medium text-blue/90">
            {course.highlights.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {detail && detail.benefits.length > 0 && (
        <div className="mt-4 rounded-xl border border-blue/15 bg-white p-5">
          <h3 className="mb-3 font-bold text-blue">✅ Lợi ích chương trình</h3>
          <ul className="list-disc space-y-1 pl-5 font-medium text-blue/90">
            {detail.benefits.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
