"use client";

import type { CourseDetail } from "@/types/course";

export default function CourseSidebar({
  courseId,
  detail,
}: {
  courseId: string;
  detail: CourseDetail | null;
}) {
  if (!detail) return null;

  return (
    <div className="h-fit rounded-xl border border-blue/15 bg-white p-5 shadow-md shadow-blue/5">
      {detail.durationLabel && (
        <div className="mb-4 rounded-lg bg-blue px-4 py-2 text-center text-sm font-bold text-white">
          {detail.durationLabel}
        </div>
      )}

      <button
        type="button"
        onClick={() => alert(`Đăng ký khóa học ${courseId} (demo)`)}
        className="min-h-11 w-full rounded-lg bg-yellow py-2.5 font-bold text-blue transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      >
        Đăng ký ngay
      </button>
    </div>
  );
}
