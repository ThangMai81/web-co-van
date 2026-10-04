import Link from "next/link";
import { COURSE_CATEGORY_LABELS } from "@/lib/courseLabels";
import CourseCategoryIcon from "./CourseCategoryIcon";
import CourseSortSelect from "./CourseSortSelect";
import CourseSearchInput from "./CourseSearchInput";

function buildHref(category?: string, sort?: string, search?: string) {
  const query = new URLSearchParams();
  if (category) query.set("category", category);
  if (sort) query.set("sort", sort);
  if (search) query.set("search", search);
  const qs = query.toString();
  return qs ? `/courses?${qs}` : "/courses";
}

export default function CourseFilterBar({
  activeCategory,
  activeSort,
  activeSearch,
}: {
  activeCategory?: string;
  activeSort?: string;
  activeSearch?: string;
}) {
  const categories = Object.keys(COURSE_CATEGORY_LABELS);

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border-2 border-yellow bg-yellow/10 p-1.5">
        <Link
          href={buildHref(undefined, activeSort, activeSearch)}
          scroll={false}
          className={`rounded-full px-3.5 py-2 text-sm transition ${
            !activeCategory
              ? "bg-yellow font-extrabold text-blue shadow-sm"
              : "font-bold text-blue/80 hover:bg-yellow/25"
          }`}
        >
          Tất cả
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat}
            href={buildHref(cat, activeSort, activeSearch)}
            scroll={false}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm transition ${
              activeCategory === cat
                ? "bg-yellow font-extrabold text-blue shadow-sm"
                : "font-bold text-blue/80 hover:bg-yellow/25"
            }`}
          >
            <CourseCategoryIcon category={cat} size={14} />
            {COURSE_CATEGORY_LABELS[cat]}
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <CourseSearchInput
          category={activeCategory}
          sort={activeSort}
          search={activeSearch}
        />
        <CourseSortSelect
          category={activeCategory}
          search={activeSearch}
          sort={activeSort}
        />
      </div>
    </div>
  );
}
