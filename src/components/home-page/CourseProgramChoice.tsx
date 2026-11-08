import Link from "next/link";

export function CourseProgramChoice() {
  return (
    <section
      id="chon-khoa-hoc-hay-chuong-trinh"
      aria-labelledby="course-program-choice-heading"
      className="scroll-mt-24 bg-[#fffaf2] px-6 py-6 md:py-14"
    >
      <div className="mx-auto max-w-[var(--page-w)]">
        <div className="hidden h-1 w-10 bg-yellow md:block" aria-hidden="true" />
        <h2
          id="course-program-choice-heading"
          className="max-w-[22ch] font-display text-2xl font-bold leading-tight text-blue sm:text-3xl md:mt-5 md:max-w-none md:text-4xl"
        >
          Khóa học hay Chương trình?
        </h2>

        <div className="mt-5 grid gap-3 md:mt-12 md:grid-cols-2 md:gap-5">
          <article className="flex flex-col rounded-xl border border-blue/15 bg-white p-5 md:min-h-[292px] md:border-l-8 md:border-l-yellow md:p-8">
            <h3 className="font-display text-lg font-bold text-blue md:text-2xl">
              Khóa học
            </h3>
            <span
              className="mt-3 hidden h-1 w-12 bg-yellow md:block"
              aria-hidden="true"
            />
            <p className="mt-2 text-sm leading-6 text-blue/75 sm:text-base md:mt-5 md:text-lg md:leading-8">
              Xem nội dung và hình thức học để chọn khóa phù hợp với bạn hoặc
              con.
            </p>
            <Link
              href="/courses"
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-blue px-7 py-3 text-sm font-semibold text-white hover:bg-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue md:mt-auto md:w-fit md:rounded-md md:bg-yellow md:text-blue md:hover:bg-yellow/90"
            >
              Xem khóa học
            </Link>
          </article>

          <article className="flex flex-col rounded-xl border border-blue/15 bg-white p-5 md:min-h-[292px] md:border-l-8 md:border-l-blue md:p-8">
            <h3 className="font-display text-lg font-bold text-blue md:text-2xl">
              Chương trình
            </h3>
            <span
              className="mt-3 hidden h-1 w-12 bg-yellow md:block"
              aria-hidden="true"
            />
            <p className="mt-2 text-sm leading-6 text-blue/75 sm:text-base md:mt-5 md:text-lg md:leading-8">
              Khám phá trại hè, leo núi, workshop và những buổi off chữa lành —
              trải nghiệm để kết nối và trưởng thành.
            </p>
            <Link
              href="/programs"
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-blue px-7 py-3 text-sm font-semibold text-white hover:bg-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue md:mt-auto md:w-fit md:rounded-md"
            >
              Xem chương trình
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
