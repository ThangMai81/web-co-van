import Link from "next/link";
import StarRating from "@/components/ui/StarRating";
import type { RelatedCourse } from "@/types/course";
import CourseThumbnailImage from "./CourseThumbnailImage";
import { getCourseThumbnailFallback } from "./courseThumbnails";

export default function RelatedCourseCard({
  course,
}: {
  course: RelatedCourse;
}) {
  const fallbackThumbnail = getCourseThumbnailFallback(course);
  const thumbnailSrc =
    course.thumbnail?.includes("res.cloudinary.com/demo/") && fallbackThumbnail
      ? fallbackThumbnail
      : course.thumbnail;

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-blue/15 bg-blue/5 shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-white"
    >
      {thumbnailSrc && (
        <div className="relative h-32 w-full">
          <CourseThumbnailImage
            key={`${course._id}:${thumbnailSrc}`}
            src={thumbnailSrc}
            fallbackSrc={fallbackThumbnail}
            alt={course.title}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 84vw"
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
