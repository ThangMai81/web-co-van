import { notFound } from "next/navigation";
import CourseHeader from "./CourseHeader";
import CourseMedia from "./CourseMedia";
import CourseSidebar from "./CourseSidebar";
import CourseDescription from "./CourseDescription";
import CourseCurriculum from "./CourseCurriculum";
import CourseReviews from "./CourseReviews";
import RelatedCourses from "./RelatedCourses";
import type { CourseDetailResponse } from "@/types/course";

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
    <div className="mx-auto max-w-6xl px-6 py-10">
      <CourseHeader course={course} detail={detail} />

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CourseMedia detail={detail} title={course.title} />
        </div>
        <CourseSidebar courseId={course._id} detail={detail} />
      </div>

      <div className="mt-10 space-y-8">
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

      {relatedCourses.length > 0 && <RelatedCourses courses={relatedCourses} />}
    </div>
  );
}
