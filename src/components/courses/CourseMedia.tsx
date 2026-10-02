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
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-blue/10 bg-blue/5">
      <Image src={detail.thumbnail} alt={title} fill className="object-cover" />
      {detail.videoUrl && (
        <a
          href={detail.videoUrl}
          target="_blank"
          rel="noreferrer"
          className="absolute inset-0 flex items-center justify-center bg-blue/30 transition hover:bg-blue/40"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow text-2xl text-blue shadow">
            ▶
          </span>
        </a>
      )}
    </div>
  );
}
