import CourseCard from "@/components/courses/CourseCard";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import type { Course } from "@/types/course";

async function getCourses(): Promise<Course[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/courses`, {
    cache: "no-store",
  });
  const json = await res.json();
  return json.data ?? [];
}

export async function CoursesPage() {
  const courses = await getCourses();

  return (
    <section className="min-h-svh bg-white py-28">
      <div className="mx-auto max-w-[var(--page-w)] px-6">
        <Breadcrumb
          items={[{ label: "Trang chủ", href: "/" }, { label: "Chương trình" }]}
        />
        <div className="mb-4 flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-yellow">
          <span className="block h-px w-6 bg-yellow" />
          Khóa học
        </div>
        <h1 className="max-w-[20ch] font-display text-4xl font-bold text-blue sm:text-5xl">
          Đồng hành cùng bạn, từng bước một
        </h1>
        <p className="mt-4 max-w-[60ch] text-blue/70">
          Mỗi khóa học được thiết kế riêng cho một hành trình khác nhau — chọn
          điều phù hợp với bạn hoặc con bạn ngay bây giờ.
        </p>

        {courses.length === 0 ? (
          <p className="mt-16 text-blue/50">Chưa có khóa học nào được đăng.</p>
        ) : (
          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
