// components/courses/RelatedCourses.tsx
import RelatedCourseCard from "./RelatedCourseCard";
import type { RelatedCourse } from "@/types/course";

export default function RelatedCourses({
  courses,
}: {
  courses: RelatedCourse[];
}) {
  return (
    <section className="mt-12">
      <h2 className="mb-4 text-xl font-bold text-slate-900">
        Chương Trình Tương Tự
      </h2>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {courses.map((course) => (
          <RelatedCourseCard key={course._id} course={course} />
        ))}
      </div>
    </section>
  );
}
