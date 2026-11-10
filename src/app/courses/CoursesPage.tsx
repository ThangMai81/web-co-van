import CourseGrid from "@/components/courses/CourseGrid";
import CourseFilterBar from "@/components/courses/CourseFilterBar";
import CatalogListUnavailable from "@/components/ui/CatalogListUnavailable";
import HeroSection from "@/components/ui/HeroSection";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { HeroLineMaskReveal } from "@/components/ui/HeroLineMaskReveal";
import heroMotionStyles from "@/components/ui/HeroSection.module.css";
import type { CourseListItem } from "@/types/course";

type CatalogListResult<T> =
  | { kind: "loaded"; items: T[] }
  | { kind: "unavailable" };

async function getCourses(
  category?: string,
  sort?: string,
  search?: string,
): Promise<CatalogListResult<CourseListItem>> {
  const query = new URLSearchParams();
  if (category) query.set("category", category);
  if (sort) query.set("sort", sort);
  if (search) query.set("search", search);

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/courses?${query.toString()}`,
      {
        cache: "no-store",
      },
    );
    if (!res.ok || res.status !== 200) return { kind: "unavailable" };

    const json: unknown = await res.json();
    if (
      typeof json !== "object" ||
      json === null ||
      !("data" in json) ||
      !Array.isArray(json.data)
    ) {
      return { kind: "unavailable" };
    }

    return { kind: "loaded", items: json.data as CourseListItem[] };
  } catch {
    return { kind: "unavailable" };
  }
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
  const result = await getCourses(category, sort, search);
  const isLoaded = result.kind === "loaded";
  const courses = isLoaded ? result.items : [];

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
      {isLoaded && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      {/* === VÙNG 1: GIỚI THIỆU === */}
      <HeroSection
        portraitAfterHeading
        portraitPresentation="courseEditorial"
        leadingContent={
          <Breadcrumb
            className={heroMotionStyles.coursesBreadcrumb}
            variant="light"
            items={[{ label: "Trang chủ", href: "/" }, { label: "Khóa học" }]}
          />
        }
        portrait={{
          src: "/images/khoa-hoc-co-yen.jpg",
          alt: "Cô giáo của Sunshine Center",
          // name: "Tên của cô",     // bỏ comment nếu muốn hiện thẻ tên cạnh ảnh
          // role: "Chức danh",
        }}
      >
        <div
          className={[
            heroMotionStyles.coursesKicker,
            "mb-4 flex items-center gap-3 font-mono text-sm font-bold uppercase tracking-widest text-yellow",
          ].join(" ")}
        >
          <span className="block h-px w-6 bg-yellow" />
          Khóa học
        </div>
        <HeroLineMaskReveal>
          <h1 className="max-w-[20ch] font-display text-4xl font-bold text-white sm:text-5xl">
            Đồng hành cùng bạn, từng bước một
          </h1>
        </HeroLineMaskReveal>
        <p
          className={[
            heroMotionStyles.coursesDescription,
            "mt-4 max-w-[60ch] text-white/80",
          ].join(" ")}
        >
          Mỗi khóa học được thiết kế riêng cho một hành trình khác nhau — chọn
          điều phù hợp với bạn hoặc con bạn ngay bây giờ.
        </p>

        {isLoaded && (
          <div
            className={[
              heroMotionStyles.coursesCount,
              "mt-8 flex gap-8 border-t border-white/15 pt-6",
            ].join(" ")}
          >
            {[
              { value: courses.length, label: "Khóa học" },
              {
                value: new Set(courses.map((c) => c.category).filter(Boolean)).size,
                label: "Chủ đề",
              },
              {
                value: courses.filter((c) => /online|trực tuyến/i.test(c.format)).length,
                label: "Học trực tuyến",
              },
            ]
              .filter((stat) => stat.value > 0)
              .map((stat, i) => (
                <div key={stat.label} className={i > 0 ? "border-l border-white/15 pl-8" : ""}>
                  <div className="font-display text-3xl font-extrabold text-yellow">
                    {stat.value}
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-wide text-white/60">
                    {stat.label}
                  </div>
                </div>
              ))}
          </div>
        )}
      </HeroSection>

      {/* === VÙNG 2: BỘ LỌC === */}
      <nav
        aria-label="Lọc khóa học"
        className="sticky top-[73px] z-30 border-b border-blue/10 bg-white/95 py-4 shadow-sm shadow-blue/5 backdrop-blur-sm"
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
      <section
        aria-label="Danh sách khóa học"
        className="bg-blue/[0.025] py-10 md:py-14"
      >
        <div className="mx-auto max-w-[var(--page-w)] px-6">
          {!isLoaded ? (
            <CatalogListUnavailable />
          ) : courses.length === 0 ? (
            <p className="font-medium text-blue">
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
