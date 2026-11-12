import { Play } from "lucide-react";
import type { CourseDetail } from "@/types/course";
import { CourseMediaApertureImage } from "./CourseMediaApertureImage";

export default function CourseMedia({
  detail,
  title,
  slug,
}: {
  detail: CourseDetail | null;
  title: string;
  slug: string;
}) {
  if (!detail?.thumbnail) return null;
  const thumbnail = detail.thumbnail.includes("res.cloudinary.com/demo")
    ? "/images/collaborate_team.jpg"
    : detail.thumbnail;

  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-4xl overflow-hidden rounded-[1.75rem] border border-white/20 bg-blue shadow-2xl shadow-black/40">
      <CourseMediaApertureImage
        slug={slug}
        src={thumbnail}
        alt={title}
        sizes="(min-width: 1536px) 46rem, (min-width: 1024px) 52vw, calc(100vw - 3rem)"
      />
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
