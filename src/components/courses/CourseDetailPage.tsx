import { notFound } from "next/navigation";
import CourseHeader from "./CourseHeader";
import CourseMedia from "./CourseMedia";
import CourseSidebar from "./CourseSidebar";
import CourseDescription from "./CourseDescription";
import CourseCurriculum from "./CourseCurriculum";
import CourseReviews from "./CourseReviews";
import RelatedCourses from "./RelatedCourses";
import type { CourseDetailResponse } from "@/types/course";
import { fetchDetailRouteData } from "@/lib/detailRouteFetch";
import { SiteHeader } from "@/components/navigation/SiteHeader";
import { DetailSectionNav } from "@/components/navigation/DetailSectionNav";
import { DetailRouteScrollReset } from "@/components/navigation/DetailRouteScrollReset";
import { SiteFooter } from "@/components/home-page/SiteFooter";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isOptionalString(value: unknown): boolean {
  return value === undefined || typeof value === "string";
}

function isOptionalNumber(value: unknown): boolean {
  return value === undefined || isFiniteNumber(value);
}

function hasOptionalStringFields(
  value: unknown,
  fields: string[],
): boolean {
  return (
    value === undefined ||
    value === null ||
    (isRecord(value) && fields.every((field) => isOptionalString(value[field])))
  );
}

function isLesson(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value.title === "string" &&
    (value.format === "online" || value.format === "offline") &&
    isOptionalString(value.scheduledAt) &&
    isOptionalNumber(value.durationHours)
  );
}

function isChapter(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value.title === "string" &&
    Array.isArray(value.lessons) &&
    value.lessons.every(isLesson)
  );
}

function isReview(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value._id === "string" &&
    isRecord(value.user) &&
    typeof value.user.name === "string" &&
    isOptionalString(value.user.avatarUrl) &&
    isFiniteNumber(value.rating) &&
    typeof value.createdAt === "string" &&
    isOptionalString(value.comment)
  );
}

function isRatingBreakdownItem(value: unknown): boolean {
  return (
    isRecord(value) &&
    isFiniteNumber(value.star) &&
    isFiniteNumber(value.count)
  );
}

function isRelatedCourse(value: unknown): boolean {
  return (
    isRecord(value) &&
    typeof value._id === "string" &&
    typeof value.title === "string" &&
    typeof value.slug === "string" &&
    typeof value.format === "string" &&
    isOptionalString(value.thumbnail) &&
    isFiniteNumber(value.price) &&
    isFiniteNumber(value.ratingAverage) &&
    isFiniteNumber(value.ratingCount) &&
    hasOptionalStringFields(value.instructor, ["name"])
  );
}

function isCourseDetailResponseData(
  value: unknown,
): value is CourseDetailResponse {
  if (!isRecord(value) || !isRecord(value.course)) return false;

  const course = value.course;
  const detail = value.detail;
  const validDetail =
    detail === null ||
    (isRecord(detail) &&
      isFiniteNumber(detail.price) &&
      isFiniteNumber(detail.ratingAverage) &&
      isFiniteNumber(detail.ratingCount) &&
      isOptionalNumber(detail.originalPrice) &&
      isOptionalString(detail.thumbnail) &&
      isOptionalString(detail.videoUrl) &&
      isOptionalString(detail.durationLabel) &&
      isOptionalString(detail.totalDurationLabel) &&
      hasOptionalStringFields(detail.instructor, ["name", "title", "avatar"]) &&
      isStringArray(detail.descriptionBullets) &&
      isStringArray(detail.benefits) &&
      Array.isArray(detail.curriculum) &&
      detail.curriculum.every(isChapter));

  return (
    typeof course._id === "string" &&
    typeof course.title === "string" &&
    typeof course.slug === "string" &&
    typeof course.format === "string" &&
    isStringArray(course.highlights) &&
    isOptionalString(course.description) &&
    isOptionalString(course.schedule) &&
    isOptionalString(course.targetAudience) &&
    isOptionalString(course.slogan) &&
    hasOptionalStringFields(course.contact, ["name", "phone", "fanpage"]) &&
    validDetail &&
    Array.isArray(value.reviews) &&
    value.reviews.every(isReview) &&
    Array.isArray(value.ratingBreakdown) &&
    value.ratingBreakdown.every(isRatingBreakdownItem) &&
    Array.isArray(value.relatedCourses) &&
    value.relatedCourses.every(isRelatedCourse)
  );
}

async function getCourseDetail(
  slug: string,
): Promise<CourseDetailResponse | null> {
  return fetchDetailRouteData(
    (process.env.NEXT_PUBLIC_API_URL ?? "") + "/api/courses/" + slug,
    isCourseDetailResponseData,
  );
}

export default async function CourseDetailPage({ slug }: { slug: string }) {
  const data = await getCourseDetail(slug);
  if (!data) notFound();

  const { course, detail, reviews, ratingBreakdown, relatedCourses } = data;
  const hasOverview = Boolean(
    course.description?.trim() ||
      detail?.descriptionBullets.some((line) => line.trim()) ||
      course.highlights.some((item) => item.trim()) ||
      detail?.benefits.some((item) => item.trim()),
  );
  const hasCurriculum = Boolean(detail && detail.curriculum.length > 0);
  const hasLearningContent = hasOverview || hasCurriculum;
  const sectionItems = [
    ...(hasOverview ? [{ id: "course-overview", label: "Mô tả" }] : []),
    ...(hasCurriculum
      ? [{ id: "course-curriculum", label: "Nội dung chương trình" }]
      : []),
    { id: "course-reviews", label: "Đánh giá" },
    ...(relatedCourses.length > 0
      ? [{ id: "related-courses", label: "Khóa học tương tự" }]
      : []),
  ];

  return (
    <div className="min-h-svh bg-white">
      <DetailRouteScrollReset />
      <SiteHeader />
      <main className="route-detail-enter">
        <section className="relative isolate overflow-hidden bg-blue">
          <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 -z-10 h-[30rem] w-[30rem] rounded-full bg-yellow/15 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-40 -left-24 -z-10 h-[26rem] w-[26rem] rounded-full bg-[#24407a] blur-3xl" />
          <div className="mx-auto max-w-[var(--page-w)] px-6 pb-12 pt-[88px] md:pb-16 md:pt-[128px] lg:pt-[96px]">
            <div
              className={`grid gap-6 ${detail?.thumbnail ? "items-center lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-10" : ""}`}
            >
              <div
                className={`order-1 rounded-3xl border border-white/20 bg-white p-6 shadow-2xl shadow-black/30 sm:p-8 ${detail?.thumbnail ? "lg:order-2" : "max-w-3xl"}`}
              >
                <CourseHeader course={course} detail={detail} />
                {detail && (
                  <CourseSidebar courseId={course._id} detail={detail} />
                )}
              </div>
              {detail?.thumbnail && (
                <div className="order-2 lg:order-1">
                  <CourseMedia detail={detail} title={course.title} slug={slug} />
                </div>
              )}
            </div>
          </div>
        </section>

        {hasLearningContent && (
          <section className="bg-[#edf5fb]">
            <div className="mx-auto max-w-[var(--page-w)] px-6 pb-12">
              <DetailSectionNav
                items={sectionItems}
                label="Điều hướng nội dung khóa học"
              />

              <div className="mx-auto mt-8 max-w-4xl space-y-8">
                {hasOverview && (
                  <div
                    id="course-overview"
                    className="scroll-mt-28 md:scroll-mt-32"
                  >
                    <CourseDescription course={course} detail={detail} />
                  </div>
                )}
                {hasCurriculum && detail && (
                  <div
                    id="course-curriculum"
                    className="scroll-mt-28 md:scroll-mt-32"
                  >
                    <CourseCurriculum
                      curriculum={detail.curriculum}
                      totalDurationLabel={detail.totalDurationLabel}
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        <section className="bg-blue">
          <div className="mx-auto max-w-[var(--page-w)] px-6 py-10 md:py-12">
            {!hasLearningContent && (
              <div className="rounded-xl bg-white px-4">
                <DetailSectionNav
                  items={sectionItems}
                  label="Điều hướng nội dung khóa học"
                />
              </div>
            )}

            <div
              className={`mx-auto max-w-4xl space-y-8 ${
                hasLearningContent ? "" : "mt-8"
              }`}
            >
              <div
                id="course-reviews"
                className="scroll-mt-28 md:scroll-mt-32 rounded-xl bg-white p-5 sm:p-6"
              >
                <CourseReviews
                  courseId={course._id}
                  ratingAverage={detail?.ratingAverage ?? 0}
                  ratingCount={detail?.ratingCount ?? 0}
                  breakdown={ratingBreakdown}
                  reviews={reviews}
                />
              </div>

              {relatedCourses.length > 0 && (
                <div
                  id="related-courses"
                  className="scroll-mt-28 md:scroll-mt-32 rounded-xl bg-white p-5 sm:p-6"
                >
                  <RelatedCourses courses={relatedCourses} />
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
