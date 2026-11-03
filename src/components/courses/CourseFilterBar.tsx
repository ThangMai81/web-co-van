import CourseCategoryFilterLinks from "./CourseCategoryFilterLinks";
import CourseSortSelect from "./CourseSortSelect";
import CourseSearchInput from "./CourseSearchInput";

export default function CourseFilterBar({
  activeCategory,
  activeSort,
  activeSearch,
}: {
  activeCategory?: string;
  activeSort?: string;
  activeSearch?: string;
}) {
  return (
    <div className="flex w-full flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
      <div className="flex w-full flex-wrap items-center gap-1.5 rounded-2xl border border-blue/10 bg-blue/5 p-1.5 lg:w-auto">
        <CourseCategoryFilterLinks
          activeCategory={activeCategory}
          activeSort={activeSort}
          activeSearch={activeSearch}
        />
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
