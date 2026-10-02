// RelatedCourseCard.tsx
import Image from "next/image";
import Link from "next/link";
import type { RelatedCourse } from "@/types/course";

function formatVND(value: number) {
  return value.toLocaleString("vi-VN");
}

export default function RelatedCourseCard({
  course,
}: {
  course: RelatedCourse;
}) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-blue/15 bg-blue/5 shadow-sm transition hover:shadow-md"
    >
      {course.thumbnail && (
        <div className="relative h-32 w-full">
          <Image
            src={course.thumbnail}
            alt={course.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="line-clamp-2 text-sm font-bold text-blue">
          {course.title}
        </h3>
        {course.instructor?.name && (
          <p className="text-xs font-medium text-blue/60">
            {course.instructor.name}
          </p>
        )}
        {course.ratingCount > 0 && (
          <span className="text-xs font-bold text-yellow">
            ★ {course.ratingAverage.toFixed(1)} ({course.ratingCount})
          </span>
        )}
        <span className="mt-auto text-sm font-extrabold text-blue">
          {course.price > 0 ? `${formatVND(course.price)} VNĐ` : "Miễn phí"}
        </span>
      </div>
    </Link>
  );
}
