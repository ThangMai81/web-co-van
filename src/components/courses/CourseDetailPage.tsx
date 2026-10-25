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

  return (
    <div className="min-h-svh bg-white">
      <DetailRouteScrollReset />
      <SiteHeader />
      <div className="route-detail-enter mx-auto max-w-[var(--page-w)] px-6 pb-10 pt-[88px] md:pt-[128px] lg:pt-[88px]">
        <div
          className={`grid gap-6 ${detail?.thumbnail ? "md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-center md:gap-10" : ""}`}
        >
          <div className="rounded-2xl border border-blue/10 bg-blue/5 p-4 sm:p-6">
            <CourseHeader course={course} detail={detail} />
          </div>
          <CourseMedia detail={detail} title={course.title} />
        </div>

        <div
          className={`mt-8 grid grid-cols-1 items-start gap-8 ${detail ? "lg:grid-cols-3" : ""}`}
        >
          {detail && (
            <div className="lg:sticky lg:top-20 lg:col-start-3 lg:row-start-1 lg:self-start">
              <CourseSidebar courseId={course._id} detail={detail} />
            </div>
          )}
          <div
            className={`space-y-8 ${detail ? "lg:col-span-2 lg:row-start-1" : ""}`}
          >
            <CourseDescription course={course} detail={detail} />
            {detail && detail.curriculum.length > 0 && (
              <CourseCurriculum
                curriculum={detail.curriculum}
                totalDurationLabel={detail.totalDurationLabel}
              />
            )}
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
          <RelatedCourses courses={relatedCourses} />
        )}
      </div>
      <SiteFooter />
    </div>
  );
}
