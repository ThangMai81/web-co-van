// RelatedCourses.tsx
import RelatedCourseCard from "./RelatedCourseCard";
import type { RelatedCourse } from "@/types/course";

export default function RelatedCourses({
  courses,
}: {
  courses: RelatedCourse[];
}) {
  const hasSingleCourse = courses.length === 1;

  return (
    <section className="mt-12">
      <h2 className="mb-4 text-xl font-bold text-blue">
        Chương Trình Tương Tự
      </h2>
      <div
        className={`grid grid-cols-1 gap-6 sm:grid-cols-2 ${hasSingleCourse ? "lg:grid-cols-1" : "lg:grid-cols-3"}`}
      >
        {courses.map((course) => (
          <div
            key={course._id}
            className={
              hasSingleCourse ? "lg:mx-auto lg:w-full lg:max-w-[20rem]" : ""
            }
          >
            <RelatedCourseCard course={course} />
          </div>
        ))}
      </div>
    </section>
  );
}
