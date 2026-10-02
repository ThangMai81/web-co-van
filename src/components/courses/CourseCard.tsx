import Link from "next/link";
import type { Course } from "@/types/course";

export default function CourseCard({ course }: { course: Course }) {
  return (
    <div className="rounded-xl border border-blue/15 bg-blue/5 p-6 shadow-sm shadow-blue/5 transition hover:shadow-md hover:shadow-blue/10">
      <span className="mb-3 inline-block rounded-full bg-yellow px-3 py-1 text-xs font-bold text-blue">
        {course.format}
      </span>

      <h3 className="mb-3 text-lg font-bold text-blue">{course.title}</h3>

      {course.slogan && (
        <p className="mb-3 text-sm font-medium italic text-blue/70">
          {course.slogan}
        </p>
      )}

      <hr className="mb-3 border-blue/15" />

      {course.targetAudience && (
        <p className="mb-1 flex items-center gap-2 text-sm font-medium text-blue/80">
          👥 {course.targetAudience}
        </p>
      )}
      {course.schedule && (
        <p className="mb-4 flex items-center gap-2 text-sm font-medium text-blue/80">
          📅 {course.schedule}
        </p>
      )}

      <Link
        href={`/courses/${course.slug}`}
        className="text-sm font-bold text-blue underline decoration-yellow decoration-2 underline-offset-4 hover:text-yellow"
      >
        XEM CHI TIẾT →
      </Link>
    </div>
  );
}
