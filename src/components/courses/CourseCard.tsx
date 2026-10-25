import Image from "next/image";
import Link from "next/link";
import { Calendar } from "@/lib/icons";
import { COURSE_CATEGORY_LABELS } from "@/lib/courseLabels";
import CourseCategoryIcon from "./CourseCategoryIcon";
import StarRating from "@/components/ui/StarRating";
import ViewDetailLabel from "@/components/ui/ViewDetailLabel";
import type { CourseListItem } from "@/types/course";
import type { CSSProperties } from "react";
import {
  getCourseThumbnail,
  getCourseThumbnailAspectRatio,
} from "./courseThumbnails";

export default function CourseCard({ course }: { course: CourseListItem }) {
  const thumbnail = getCourseThumbnail(course);
  const thumbnailAspectRatio = getCourseThumbnailAspectRatio(course);

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="flex h-full scroll-mt-[22rem] flex-col overflow-hidden rounded-2xl border border-blue/10 bg-white shadow-sm shadow-blue/5 transition-[border-color,box-shadow] duration-200 hover:border-blue/25 hover:shadow-md hover:shadow-blue/10 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-white md:scroll-mt-[16rem] lg:scroll-mt-[11rem]"
    >
      {thumbnail && (
        <div
          className="relative aspect-[var(--thumbnail-aspect-ratio)] w-full shrink-0 overflow-hidden bg-blue/5 sm:aspect-[3/4]"
          style={
            {
              "--thumbnail-aspect-ratio": thumbnailAspectRatio,
            } as CSSProperties
          }
        >
          <Image
            src={thumbnail}
            alt={course.title}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 84vw"
            className="object-contain object-center"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-2 p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow px-3 py-1 text-xs font-bold text-blue">
            {course.format}
          </span>
          {course.category && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue px-3 py-1 text-xs font-bold text-white">
              <CourseCategoryIcon category={course.category} size={13} />
              {COURSE_CATEGORY_LABELS[course.category] || course.category}
            </span>
          )}
        </div>

        <h3 className="min-h-[3.5rem] text-lg font-bold text-blue">
          {course.title}
        </h3>

        {course.instructor?.name && (
          <p className="line-clamp-1 text-sm font-medium text-blue/70">
            {course.instructor.name}
          </p>
        )}

        {course.ratingCount > 0 && (
          <div className="flex items-center gap-1.5">
            <StarRating value={course.ratingAverage} size={14} />
            <span className="text-xs font-bold text-blue/60">
              ({course.ratingCount})
            </span>
          </div>
        )}

        <p className="line-clamp-1 flex items-center gap-2 text-sm font-medium text-blue/80">
          <Calendar size={15} className="shrink-0" /> {course.schedule}
        </p>

        <div className="mt-auto pt-0">
          <ViewDetailLabel />
        </div>
      </div>
    </Link>
  );
}
