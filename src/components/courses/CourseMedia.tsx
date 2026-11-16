import { Play } from "lucide-react";
import type { CourseDetail } from "@/types/course";
import { CourseMediaApertureImage } from "./CourseMediaApertureImage";
import CourseCoverIllustration from "./CourseCoverIllustration";
import {
  getCourseDetailIllustration,
  getCourseDisplayAlt,
  getCourseDisplayImage,
} from "./courseThumbnails";

export default function CourseMedia({
  detail,
  title,
  slug,
}: {
  detail: CourseDetail | null;
  title: string;
  slug: string;
}) {
  if (!detail) return null;
  // Poster riêng của khóa học (hoặc ảnh thật từ API); không mượn ảnh chuyến đi khác.
  const identity = { slug, title, thumbnail: detail.thumbnail };
  const illustration = getCourseDetailIllustration(identity);
  const image = illustration?.src ?? getCourseDisplayImage(identity);

  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-4xl overflow-hidden rounded-[1.75rem] border border-white/20 bg-blue shadow-2xl shadow-black/40">
      {image ? (
        <CourseMediaApertureImage
          slug={slug}
          src={image}
          alt={illustration?.alt ?? getCourseDisplayAlt(identity)}
          sizes="(min-width: 1536px) 46rem, (min-width: 1024px) 52vw, calc(100vw - 3rem)"
        />
      ) : (
        <CourseCoverIllustration category={detail.category} seed={slug} iconSize={64} />
      )}
      {illustration && (
        <span className="absolute left-3 top-3 z-20 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-blue shadow">
          Ảnh minh họa
        </span>
      )}
      {detail.videoUrl && (
        <a
          href={detail.videoUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`Mở video giới thiệu khóa học ${title} trong thẻ mới`}
          className="absolute inset-0 flex items-center justify-center bg-blue/30 transition hover:bg-blue/40 focus-visible:z-20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-blue"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow text-blue shadow ring-8 ring-yellow/25">
            <Play size={24} fill="currentColor" aria-hidden="true" />
          </span>
        </a>
      )}
    </div>
  );
}
