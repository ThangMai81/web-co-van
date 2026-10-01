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
    <div className="sticky top-6 h-fit rounded-xl border border-amber-100 bg-white p-5 shadow-sm">
      {detail.durationLabel && (
        <div className="mb-4 rounded-lg bg-amber-500 px-4 py-2 text-center text-sm font-semibold text-white">
          {detail.durationLabel}
          {detail.price > 0 && ` / ${formatVND(detail.price)} VNĐ`}
        </div>
      )}

      <div className="mb-4 flex items-baseline gap-2">
        <span className="text-2xl font-bold text-red-600">
          {detail.price > 0 ? `${formatVND(detail.price)} VNĐ` : "Miễn phí"}
        </span>
        {detail.originalPrice && detail.originalPrice > detail.price && (
          <span className="text-sm text-slate-400 line-through">
            {formatVND(detail.originalPrice)} VNĐ
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => alert(`Đăng ký khóa học ${courseId} (demo)`)}
          className="w-full rounded-lg bg-amber-500 py-2.5 font-semibold text-white transition hover:bg-amber-600"
        >
          Đăng ký ngay
        </button>
      </div>
    </div>
  );
}
