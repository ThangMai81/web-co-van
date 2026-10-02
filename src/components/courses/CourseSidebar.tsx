"use client";

import type { CourseDetail } from "@/types/course";

function formatVND(value: number) {
  return value.toLocaleString("vi-VN");
}

export default function CourseSidebar({
  courseId,
  detail,
}: {
  courseId: string;
  detail: CourseDetail | null;
}) {
  if (!detail) return null;

  return (
    <div className="sticky top-6 h-fit rounded-xl border border-blue/15 bg-white p-5 shadow-md shadow-blue/5">
      {detail.durationLabel && (
        <div className="mb-4 rounded-lg bg-blue px-4 py-2 text-center text-sm font-bold text-white">
          {detail.durationLabel}
          {detail.price > 0 && ` / ${formatVND(detail.price)} VNĐ`}
        </div>
      )}

      <div className="mb-4 flex items-baseline gap-2">
        <span className="text-2xl font-extrabold text-blue">
          {detail.price > 0 ? `${formatVND(detail.price)} VNĐ` : "Miễn phí"}
        </span>
        {detail.originalPrice && detail.originalPrice > detail.price && (
          <span className="text-sm font-medium text-blue/40 line-through">
            {formatVND(detail.originalPrice)} VNĐ
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={() => alert(`Đăng ký khóa học ${courseId} (demo)`)}
        className="w-full rounded-lg bg-yellow py-2.5 font-bold text-blue transition hover:brightness-95"
      >
        Đăng ký ngay
      </button>
    </div>
  );
}
