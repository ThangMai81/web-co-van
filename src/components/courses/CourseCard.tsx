import Link from "next/link";
import type { Course } from "@/types/course";

export default function CourseCard({ course }: { course: Course }) {
  return (
    <div className="rounded-xl border border-amber-100 bg-amber-50/40 p-6">
      <span className="mb-3 inline-block rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
        {course.format}
      </span>

      <h3 className="mb-4 text-lg font-bold text-slate-900">{course.title}</h3>

      {course.slogan && (
        <p className="mb-3 text-sm italic text-slate-500">{course.slogan}</p>
      )}

      <hr className="mb-3 border-amber-200" />

      {course.targetAudience && (
        <p className="mb-1 flex items-center gap-2 text-sm text-slate-600">
          👥 {course.targetAudience}
        </p>
      )}
      {course.schedule && (
        <p className="mb-3 flex items-center gap-2 text-sm text-slate-600">
          📅 {course.schedule}
        </p>
      )}

      <Link
        href={`/courses/${course.slug}`}
        className="text-sm font-semibold text-amber-600 hover:underline"
      >
        XEM CHI TIẾT →
      </Link>
    </div>
  );
}
