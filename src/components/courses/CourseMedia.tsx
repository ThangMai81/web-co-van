import Image from "next/image";
import type { CourseDetail } from "@/types/course";

export default function CourseMedia({
  detail,
  title,
}: {
  detail: CourseDetail | null;
  title: string;
}) {
  if (!detail?.thumbnail) return null;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-amber-50">
      <Image src={detail.thumbnail} alt={title} fill className="object-cover" />
      {detail.videoUrl && (
        <a
          href={detail.videoUrl}
          target="_blank"
          rel="noreferrer"
          className="absolute inset-0 flex items-center justify-center bg-black/20 transition hover:bg-black/30"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-2xl text-amber-600 shadow">
            ▶
          </span>
        </a>
      )}
    </div>
  );
}
