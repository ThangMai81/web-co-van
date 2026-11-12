import Image from "next/image";
import { CalendarDays, Clock, Radio, Target } from "lucide-react";
import StarRating from "@/components/ui/StarRating";
import { MetaStrip, type MetaItem } from "@/components/detail/DetailHero";
import { COURSE_CATEGORY_LABELS } from "@/lib/courseLabels";
import CourseCategoryIcon from "./CourseCategoryIcon";
import type { Course, CourseDetail } from "@/types/course";
import enter from "./CourseHeaderEntrance.module.css";

export default function CourseHeader({
  course,
  detail,
}: {
  course: Course;
  detail: CourseDetail | null;
}) {
  const category = detail?.category;
  const meta: MetaItem[] = [
    ...(course.format.trim()
      ? [{ icon: <Radio size={16} />, label: "Hình thức", value: course.format.trim() }]
      : []),
    ...(detail?.durationLabel?.trim()
      ? [{ icon: <Clock size={16} />, label: "Thời lượng", value: detail.durationLabel.trim() }]
      : []),
    ...(course.schedule?.trim()
      ? [{ icon: <CalendarDays size={16} />, label: "Lịch học", value: course.schedule.trim(), wide: true }]
      : []),
    ...(course.targetAudience?.trim()
      ? [{ icon: <Target size={16} />, label: "Đối tượng", value: course.targetAudience.trim(), wide: true }]
      : []),
  ];
  const instructorInitial = detail?.instructor?.name?.trim().split(/\s+/).pop()?.charAt(0);

  return (
    <div className="text-white">
      <div
        className={`mb-5 flex flex-wrap items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-yellow ${enter.enterItem} ${enter.enterTitle}`}
      >
        <span aria-hidden="true" className="block h-px w-8 bg-yellow" />
        <span className="inline-flex items-center gap-1.5">
          {category && <CourseCategoryIcon category={category} size={14} />}
          Khóa học{category && COURSE_CATEGORY_LABELS[category] ? ` · ${COURSE_CATEGORY_LABELS[category]}` : ""}
        </span>
      </div>

      <h1
        className={`font-editorial text-4xl font-bold leading-[1.08] tracking-[-0.01em] text-white sm:text-5xl lg:text-[3.4rem] ${enter.enterItem} ${enter.enterTitle}`}
      >
        {course.title}
      </h1>
      {course.slogan && (
        <p
          className={`mt-4 max-w-[36ch] font-editorial text-xl italic leading-snug text-yellow sm:text-2xl ${enter.enterItem} ${enter.enterSlogan}`}
        >
          {course.slogan}
        </p>
      )}

      <MetaStrip items={meta} className={`mt-8 ${enter.enterItem} ${enter.enterFacts}`} />

      {detail?.instructor?.name && (
        <div
          className={`mt-6 inline-flex flex-wrap items-center gap-3 rounded-full border border-white/15 bg-white/[0.06] py-1.5 pl-1.5 pr-5 ${enter.enterItem} ${enter.enterInstructor}`}
        >
          {detail.instructor.avatar ? (
            <Image
              src={detail.instructor.avatar}
              alt={detail.instructor.name}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full border border-yellow/60 object-cover"
            />
          ) : (
            <span
              aria-hidden="true"
              className="grid h-10 w-10 place-items-center rounded-full bg-yellow font-editorial text-lg font-bold text-blue"
            >
              {instructorInitial}
            </span>
          )}
          <span className="leading-tight">
            {detail.instructor.title && (
              <span className="block text-[11px] font-semibold uppercase tracking-wider text-white/55">
                {detail.instructor.title}
              </span>
            )}
            <span className="block text-sm font-bold text-white">{detail.instructor.name}</span>
          </span>
          {detail.ratingCount > 0 && (
            <span className="flex items-center gap-1.5">
              <StarRating value={detail.ratingAverage} />
              <span className="text-sm font-bold text-white/70">({detail.ratingCount})</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
