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
    <div className="mt-5 border-t border-blue/10 pt-5">
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
