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
      <SiteHeader />
      <div className="mx-auto max-w-[var(--page-w)] px-6 pb-10 pt-[88px]">
        <CourseHeader course={course} detail={detail} />

        <div className="mt-6 w-full">
          <CourseMedia detail={detail} title={course.title} />
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
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
          <CourseSidebar courseId={course._id} detail={detail} />
        </div>

        {relatedCourses.length > 0 && (
          <RelatedCourses courses={relatedCourses} />
        )}
      </div>
      <SiteFooter />
    </div>
  );
}
