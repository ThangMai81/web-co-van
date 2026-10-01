import Image from "next/image";
import Link from "next/link";
import type { Course, CourseDetail } from "@/types/course";

export default function CourseHeader({
  course,
  detail,
}: {
  course: Course;
  detail: CourseDetail | null;
}) {
  return (
    <div>
      <nav className="mb-2 text-sm text-slate-500">
        <Link href="/courses" className="hover:underline">
          Khóa học
        </Link>
        <span className="mx-2">›</span>
        <span className="text-slate-700">{course.title}</span>
      </nav>

      <h1 className="text-3xl font-bold text-slate-900">{course.title}</h1>
      {course.slogan && (
        <p className="mt-1 italic text-slate-500">{course.slogan}</p>
      )}

      {detail?.instructor?.name && (
        <div className="mt-3 flex items-center gap-3">
          {detail.instructor.avatar && (
            <Image
              src={detail.instructor.avatar}
              alt={detail.instructor.name}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          )}
          <div>
            {detail.instructor.title && (
              <p className="text-xs text-slate-500">
                {detail.instructor.title}
              </p>
            )}
            <p className="text-sm font-semibold text-slate-800">
              {detail.instructor.name}
            </p>
          </div>
          {detail.ratingCount > 0 && (
            <span className="ml-2 text-sm text-amber-500">
              ★ {detail.ratingAverage.toFixed(1)} ({detail.ratingCount})
            </span>
          )}
        </div>
      )}
    </div>
  );
}
