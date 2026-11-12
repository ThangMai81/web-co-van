import { notFound } from "next/navigation";
import CourseHeader from "./CourseHeader";
import CourseMedia from "./CourseMedia";
import CourseSidebar from "./CourseSidebar";
import CourseDescription from "./CourseDescription";
import CourseCurriculum from "./CourseCurriculum";
import CourseReviews from "./CourseReviews";
import RelatedCourses from "./RelatedCourses";
import { CourseClosingCTA } from "./CourseClosingCTA";
import type { CourseDetailResponse } from "@/types/course";
import { fetchDetailRouteData } from "@/lib/detailRouteFetch";
import { SiteHeader } from "@/components/navigation/SiteHeader";
import { ReadingProgress } from "@/components/navigation/ReadingProgress";
import { DetailSectionNav } from "@/components/navigation/DetailSectionNav";
import { DetailRouteScrollReset } from "@/components/navigation/DetailRouteScrollReset";
import { SiteFooter } from "@/components/home-page/SiteFooter";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import CourseCategoryIcon from "./CourseCategoryIcon";
import {
  DetailHeroBackdrop,
  DetailHeroCurve,
  DetailHeroFrame,
  RotatingSeal,
} from "@/components/detail/DetailHero";

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

  const heroImage = detail?.thumbnail && !detail.thumbnail.includes("res.cloudinary.com/demo") ? detail.thumbnail : detail?.thumbnail ? "/images/collaborate_team.jpg" : null;

  return (
    <div className="min-h-svh bg-cream">
      <DetailRouteScrollReset />
      <SiteHeader />
      <ReadingProgress />
      <main className="route-detail-enter">
        <section className="relative isolate overflow-hidden text-white">
          <DetailHeroBackdrop image={heroImage} />
          <div className="mx-auto max-w-[var(--page-w)] px-6 pb-20 pt-[88px] md:pb-24 md:pt-[128px] lg:pt-[96px]">
            <Breadcrumb
              variant="light"
              items={[
                { label: "Khóa học", href: "/courses" },
                { label: course.title },
              ]}
            />
            <div
              className={`mt-8 grid gap-12 ${detail?.thumbnail ? "lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-14" : "max-w-3xl"}`}
            >
              <div className="min-w-0">
                <CourseHeader course={course} detail={detail} />
                {detail && (
                  <CourseSidebar
                    detail={detail}
                    contactPhone={course.contact?.phone}
                    contactName={course.contact?.name}
                  />
                )}
              </div>
              {detail?.thumbnail && (
                <DetailHeroFrame className="mr-3 sm:mr-5">
                  <CourseMedia detail={detail} title={course.title} slug={slug} />
                  <RotatingSeal
                    text={`Khóa học • ${course.format.trim() || "Sunshine Center"}`}
                    icon={<CourseCategoryIcon category={detail.category ?? "coach"} size={22} />}
                    className="-bottom-8 -left-5 sm:-bottom-10 sm:-left-10"
                  />
                </DetailHeroFrame>
              )}
            </div>
          </div>
          <DetailHeroCurve tone={hasLearningContent ? "cream" : "blue"} />
        </section>

        {hasLearningContent && (
          <section className="bg-cream">
            <div className="mx-auto max-w-[var(--page-w)] px-6 pb-16">
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

        <section className="relative isolate overflow-hidden bg-blue">
          <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-10 -z-10 h-[26rem] w-[26rem] rounded-full bg-yellow/10 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgb(255_255_255/0.06)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(90deg,#000,transparent_60%)]" />
          <div className="mx-auto max-w-[var(--page-w)] px-6 py-14 md:py-20">
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
                className="scroll-mt-28 md:scroll-mt-32 rounded-[1.75rem] bg-white p-6 shadow-2xl shadow-black/20 sm:p-8"
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
                  className="scroll-mt-28 md:scroll-mt-32 rounded-[1.75rem] bg-white p-6 shadow-2xl shadow-black/20 sm:p-8"
                >
                  <RelatedCourses courses={relatedCourses} />
                </div>
              )}
            </div>
          </div>
        </section>
        <CourseClosingCTA />
      </main>
      <SiteFooter />
    </div>
  );
}
