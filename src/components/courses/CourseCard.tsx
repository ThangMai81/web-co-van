import Image from "next/image";
import Link from "next/link";
import { Calendar } from "@/lib/icons";
import { COURSE_CATEGORY_LABELS, formatVND } from "@/lib/courseLabels";
import CourseCategoryIcon from "./CourseCategoryIcon";
import StarRating from "@/components/ui/StarRating";
import ViewDetailLabel from "@/components/ui/ViewDetailLabel";
import type { CourseListItem } from "@/types/course";

const COURSE_THUMBNAILS: Array<{ match: RegExp; src: string }> = [
  { match: /coach-thuc-chien/, src: "/images/Khoa-coach-thuc-chien.jpg" },
  { match: /khai-tam-dinh-vi/, src: "/images/khai-tam-dinh-vi.jpg" },
  { match: /khai-phong-ban-than/, src: "/images/khai-phong-ban-than.jpg" },
  { match: /after-kien-thuc/, src: "/images/khoa-after-kien-thuc.jpg" },
  { match: /khai-van/, src: "/images/khoa-hoc-khai-van.jpg" },
];

function getCourseThumbnail(course: CourseListItem) {
  const identity = `${course.slug} ${course.title}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-");

  return COURSE_THUMBNAILS.find(({ match }) => match.test(identity))?.src ?? course.thumbnail;
}

export default function CourseCard({ course }: { course: CourseListItem }) {
  const thumbnail = getCourseThumbnail(course);

  return (
    <Link
      href={`/courses/${course.slug}`}
      scroll={false}
      className="group flex h-full flex-col overflow-hidden rounded-xl border-2 border-yellow bg-blue/5 shadow-sm shadow-blue/5 transition hover:shadow-md hover:shadow-blue/10"
    >
      <div className="relative h-44 w-full shrink-0 bg-blue/10">
        {thumbnail && (
          <Image
            src={thumbnail}
            alt={course.title}
            fill
            className="object-cover"
          />
        )}
        <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-yellow px-3 py-1 text-xs font-bold text-blue">
          {course.format}
        </span>
        {course.category && (
          <span className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-blue px-3 py-1 text-xs font-bold text-white">
            <CourseCategoryIcon category={course.category} size={13} />
            {COURSE_CATEGORY_LABELS[course.category] || course.category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="line-clamp-2 min-h-[3.5rem] text-lg font-bold text-blue">
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

        <span className="mt-1 w-fit rounded-full border border-blue/20 bg-white px-3 py-1 text-xs font-extrabold text-blue">
          {course.price > 0 ? `${formatVND(course.price)} VNĐ` : "Miễn phí"}
        </span>

        <div className="mt-auto pt-2">
          <ViewDetailLabel />
        </div>
      </div>
    </Link>
  );
}
