import CourseGrid from "@/components/courses/CourseGrid";
import CourseFilterBar from "@/components/courses/CourseFilterBar";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import type { CourseListItem } from "@/types/course";

async function getCourses(
  category?: string,
  sort?: string,
  search?: string,
): Promise<CourseListItem[]> {
  const query = new URLSearchParams();
  if (category) query.set("category", category);
  if (sort) query.set("sort", sort);
  if (search) query.set("search", search);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/courses?${query.toString()}`,
    {
      cache: "no-store",
    },
  );
  const json = await res.json();
  return json.data ?? [];
}

export default async function CoursesPage({
  category,
  sort,
  search,
}: {
  category?: string;
  sort?: string;
  search?: string;
}) {
  const courses = await getCourses(category, sort, search);
  const freeCourses = courses.filter((c) => c.price === 0).length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: courses.map((c, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/courses/${c.slug}`,
      name: c.title,
    })),
  };

  return (
    <main className="min-h-svh bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* === VÙNG 1: GIỚI THIỆU === */}
      <header className="relative overflow-hidden bg-blue pb-16 pt-32">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-yellow/20 blur-3xl" />
        <div className="relative mx-auto max-w-[var(--page-w)] px-6">
          <Breadcrumb
            variant="light"
            items={[{ label: "Trang chủ", href: "/" }, { label: "Khóa học" }]}
          />

          <div className="mb-4 flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-yellow">
            <span className="block h-px w-6 bg-yellow" />
            Khóa học
          </div>
          <h1 className="max-w-[20ch] font-display text-4xl font-bold text-white sm:text-5xl">
            Đồng hành cùng bạn, từng bước một
          </h1>
          <p className="mt-4 max-w-[60ch] text-white/80">
            Mỗi khóa học được thiết kế riêng cho một hành trình khác nhau — chọn
            điều phù hợp với bạn hoặc con bạn ngay bây giờ.
          </p>

          <div className="mt-8 flex gap-8 border-t border-white/15 pt-6">
            <div>
              <div className="text-2xl font-extrabold text-yellow">
                {courses.length}
              </div>
              <div className="text-xs font-medium text-white/60">Khóa học</div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-yellow">
                {freeCourses}
              </div>
              <div className="text-xs font-medium text-white/60">Miễn phí</div>
            </div>
          </div>
        </div>
      </header>

      {/* === VÙNG 2: BỘ LỌC === */}
      <nav
        aria-label="Lọc khóa học"
        className="sticky top-[73px] z-30 border-b border-blue/10 bg-white/95 py-4 backdrop-blur-sm"
      >
        <div className="mx-auto max-w-[var(--page-w)] px-6">
          <CourseFilterBar
            activeCategory={category}
            activeSort={sort}
            activeSearch={search}
          />
        </div>
      </nav>

      {/* === VÙNG 3: DANH SÁCH === */}
      <section aria-label="Danh sách khóa học" className="bg-white py-14">
        <div className="mx-auto max-w-[var(--page-w)] px-6">
          {courses.length === 0 ? (
            <p className="font-medium text-blue/50">
              Không tìm thấy khóa học phù hợp.
            </p>
          ) : (
            <CourseGrid items={courses} />
          )}
        </div>
      </section>
    </main>
  );
}
