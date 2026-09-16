import Link from "next/link";

type CourseSummary = {
  slug: string;
  title: string;
  slogan?: string;
  schedule?: string;
  format?: string;
  targetAudience?: string;
};

export function CourseCard({ course }: { course: CourseSummary }) {
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group flex flex-col justify-between rounded-md border border-sage/25 bg-paper p-6 transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5"
    >
      <div>
        {course.format && (
          <span className="mb-4 inline-block rounded-full bg-sun-soft/60 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-ink">
            {course.format}
          </span>
        )}
        <h3 className="font-display text-xl font-bold text-ink transition-colors group-hover:text-sun">
          {course.title}
        </h3>
        {course.slogan && (
          <p className="mt-2 text-sm italic text-ink/60">{course.slogan}</p>
        )}
      </div>

      <div className="mt-6 space-y-1.5 border-t border-sage/20 pt-4 text-sm text-ink/70">
        {course.targetAudience && <p>👥 {course.targetAudience}</p>}
        {course.schedule && <p>🗓️ {course.schedule}</p>}
      </div>

      <span className="mt-4 font-mono text-xs uppercase tracking-wider text-sun">
        Xem chi tiết →
      </span>
    </Link>
  );
}
