import Image from "next/image";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import StarRating from "@/components/ui/StarRating";
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
      <Breadcrumb
        items={[
          { label: "Khóa học", href: "/courses" },
          { label: course.title },
        ]}
      />

      <h1 className="text-3xl font-bold text-blue">{course.title}</h1>
      {course.slogan && (
        <p className="mt-1 font-medium italic text-blue/70">{course.slogan}</p>
      )}

      {detail?.instructor?.name && (
        <div className="mt-3 flex items-center gap-3">
          {detail.instructor.avatar && (
            <Image
              src={detail.instructor.avatar}
              alt={detail.instructor.name}
              width={40}
              height={40}
              className="rounded-full border border-blue/15 object-cover"
            />
          )}
          <div>
            {detail.instructor.title && (
              <p className="text-xs font-medium text-blue/60">
                {detail.instructor.title}
              </p>
            )}
            <p className="text-sm font-bold text-blue">
              {detail.instructor.name}
            </p>
          </div>
          {detail.ratingCount > 0 && (
            <div className="ml-2 flex items-center gap-1.5">
              <StarRating value={detail.ratingAverage} />
              <span className="text-sm font-bold text-blue/70">
                ({detail.ratingCount})
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
