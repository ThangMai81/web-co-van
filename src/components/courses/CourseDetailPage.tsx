import { notFound } from "next/navigation";
import CourseHeader from "./CourseHeader";
import CourseMedia from "./CourseMedia";
import CourseSidebar from "./CourseSidebar";
import CourseDescription from "./CourseDescription";
import CourseCurriculum from "./CourseCurriculum";
import CourseReviews from "./CourseReviews";
import RelatedCourses from "./RelatedCourses";
import type { CourseDetailResponse } from "@/types/course";
import { SiteHeader } from "@/components/navigation/SiteHeader";
import { DetailSectionNav } from "@/components/navigation/DetailSectionNav";
import { DetailRouteScrollReset } from "@/components/navigation/DetailRouteScrollReset";
import { SiteFooter } from "@/components/home-page/SiteFooter";

async function getCourseDetail(
  slug: string,
): Promise<CourseDetailResponse | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${slug}`,
    {
      cache: "no-store",
    },
  );

  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Không thể tải khóa học");

  const json = await res.json();
  return json.data as CourseDetailResponse;
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
  const sectionItems = [
    ...(hasOverview ? [{ id: "course-overview", label: "Mô tả" }] : []),
    ...(hasCurriculum
      ? [{ id: "course-curriculum", label: "Nội dung chương trình" }]
      : []),
    { id: "course-reviews", label: "Đánh giá" },
    ...(relatedCourses.length > 0
      ? [{ id: "related-courses", label: "Chương trình tương tự" }]
      : []),
  ];

  return (
    <div className="min-h-svh bg-white">
      <DetailRouteScrollReset />
      <SiteHeader />
      <div className="route-detail-enter mx-auto max-w-[var(--page-w)] px-6 pb-10 pt-[88px] md:pt-[128px] lg:pt-[88px]">
        <div
          className={`grid gap-6 ${detail?.thumbnail ? "items-center lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-10" : ""}`}
        >
          <div
            className={`order-1 rounded-2xl border border-blue/10 bg-white p-5 shadow-sm shadow-blue/5 sm:p-6 ${detail?.thumbnail ? "lg:order-2" : "max-w-3xl"}`}
          >
            <CourseHeader course={course} detail={detail} />
            {detail && (
              <CourseSidebar courseId={course._id} detail={detail} />
            )}
          </div>
          {detail?.thumbnail && (
            <div className="order-2 lg:order-1">
              <CourseMedia detail={detail} title={course.title} />
            </div>
          )}
        </div>

        <DetailSectionNav
          items={sectionItems}
          label="Điều hướng nội dung khóa học"
        />

        <div className="mt-8 space-y-8">
          {hasOverview && (
            <div id="course-overview" className="scroll-mt-28 md:scroll-mt-32">
              <CourseDescription course={course} detail={detail} />
            </div>
          )}
          {hasCurriculum && detail && (
            <div id="course-curriculum" className="scroll-mt-28 md:scroll-mt-32">
              <CourseCurriculum
                curriculum={detail.curriculum}
                totalDurationLabel={detail.totalDurationLabel}
              />
            </div>
          )}
          <div id="course-reviews" className="scroll-mt-28 md:scroll-mt-32">
            <CourseReviews
              courseId={course._id}
              ratingAverage={detail?.ratingAverage ?? 0}
              ratingCount={detail?.ratingCount ?? 0}
              breakdown={ratingBreakdown}
              reviews={reviews}
            />
          </div>
        </div>

        {relatedCourses.length > 0 && (
          <div id="related-courses" className="scroll-mt-28 md:scroll-mt-32">
            <RelatedCourses courses={relatedCourses} />
          </div>
        )}
      </div>
      <SiteFooter />
    </div>
  );
}
