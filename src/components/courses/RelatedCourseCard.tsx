import Link from "next/link";
import StarRating from "@/components/ui/StarRating";
import type { RelatedCourse } from "@/types/course";
import type { CSSProperties } from "react";
import CourseThumbnailImage from "./CourseThumbnailImage";
import CourseCoverIllustration from "./CourseCoverIllustration";
import {
  COURSE_COVER_ASPECT_RATIO,
  getCourseDisplayAlt,
  getCourseDisplayImage,
} from "./courseThumbnails";
import styles from "./RelatedCourseCard.module.css";

export default function RelatedCourseCard({
  course,
}: {
  course: RelatedCourse;
}) {
  const thumbnailSrc = getCourseDisplayImage(course);

  return (
    <Link
      href={`/courses/${course.slug}`}
      className={`group ${styles.card} flex h-full flex-col overflow-hidden rounded-xl border border-blue/15 bg-blue/5 shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-white`}
    >
      <div
        className="relative aspect-[var(--thumbnail-aspect-ratio)] w-full shrink-0 overflow-hidden bg-blue/5"
        style={{
          "--thumbnail-aspect-ratio": COURSE_COVER_ASPECT_RATIO,
        } as CSSProperties}
      >
        {thumbnailSrc ? (
          <CourseThumbnailImage
            key={`${course._id}:${thumbnailSrc}`}
            src={thumbnailSrc}
            alt={getCourseDisplayAlt(course)}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 84vw"
            className="object-cover object-center"
          />
        ) : (
          <CourseCoverIllustration seed={course.slug} iconSize={30} />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="text-sm font-bold text-blue">{course.title}</h3>
        {course.instructor?.name && (
          <p className="text-xs font-medium text-blue/60">
            {course.instructor.name}
          </p>
        )}
        {course.ratingCount > 0 && (
          <div className="flex items-center gap-1">
            <StarRating value={course.ratingAverage} size={13} />
            <span className="text-xs font-bold text-blue/60">
              ({course.ratingCount})
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
