"use client";

import { useState } from "react";
import CourseCard from "./CourseCard";
import type { CourseListItem } from "@/types/course";

const PAGE_SIZE = 6;

export default function CourseGrid({ items }: { items: CourseListItem[] }) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const shown = items.slice(0, visible);
  const hasMore = visible < items.length;

  return (
    <div>
      <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="rounded-full border-2 border-blue bg-white px-8 py-2.5 text-sm font-bold text-blue transition hover:bg-blue hover:text-white"
          >
            Xem thêm ({items.length - visible} khóa học)
          </button>
        </div>
      )}
    </div>
  );
}
