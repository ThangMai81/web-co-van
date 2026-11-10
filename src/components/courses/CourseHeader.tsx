import Image from "next/image";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import StarRating from "@/components/ui/StarRating";
import type { Course, CourseDetail } from "@/types/course";
import enter from "./CourseHeaderEntrance.module.css";

export default function CourseHeader({
  course,
  detail,
}: {
  course: Course;
  detail: CourseDetail | null;
}) {
  const facts = [
    course.format.trim() ? { label: "Hình thức", value: course.format } : null,
    course.schedule?.trim()
      ? { label: "Lịch học", value: course.schedule }
      : null,
    detail?.durationLabel?.trim()
      ? { label: "Thời lượng", value: detail.durationLabel }
      : null,
  ].filter((fact): fact is { label: string; value: string } => fact !== null);

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "Khóa học", href: "/courses" },
          { label: course.title },
        ]}
      />

      <h1 className={`text-3xl font-bold text-blue ${enter.enterItem} ${enter.enterTitle}`}>{course.title}</h1>
      {course.slogan && (
        <p className={`mt-1 font-medium italic text-blue/70 ${enter.enterItem} ${enter.enterSlogan}`}>{course.slogan}</p>
      )}

      {(facts.length > 0 || course.targetAudience?.trim()) && (
        <dl className={`mt-5 grid gap-3 sm:grid-cols-2 ${enter.enterItem} ${enter.enterFacts}`}>
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="rounded-xl border border-blue/10 bg-blue/5 px-4 py-3"
            >
              <dt className="text-xs font-bold uppercase tracking-wide text-blue/55">
                {fact.label}
              </dt>
              <dd className="mt-1 font-semibold text-blue">{fact.value}</dd>
            </div>
          ))}
          {course.targetAudience?.trim() && (
            <div className="rounded-xl border border-blue/10 bg-blue/5 px-4 py-3 sm:col-span-2">
              <dt className="text-xs font-bold uppercase tracking-wide text-blue/55">
                Đối tượng
              </dt>
              <dd className="mt-1 font-medium leading-relaxed text-blue/90">
                {course.targetAudience}
              </dd>
            </div>
          )}
        </dl>
      )}

      {detail?.instructor?.name && (
        <div className={`mt-5 flex flex-wrap items-center gap-3 border-t border-blue/10 pt-4 ${enter.enterItem} ${enter.enterInstructor}`}>
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
