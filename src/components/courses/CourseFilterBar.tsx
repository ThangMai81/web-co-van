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
    <div className="flex w-full flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
      <div className="flex w-full flex-wrap items-center gap-1.5 rounded-2xl border border-blue/10 bg-blue/5 p-1.5 lg:w-auto">
        <Link
          href={buildHref(undefined, activeSort, activeSearch)}
          scroll={false}
          className={`inline-flex min-h-11 items-center rounded-full px-3.5 py-2 text-sm transition-colors duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
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
            className={`flex min-h-11 items-center gap-1.5 rounded-full px-3.5 py-2 text-sm transition-colors duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
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

      <div className="grid w-full grid-cols-1 items-center gap-2 rounded-2xl border border-blue/10 bg-blue/5 p-2 sm:grid-cols-[minmax(0,1fr)_auto] lg:flex lg:w-auto lg:gap-3 lg:border-0 lg:bg-transparent lg:p-0">
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
