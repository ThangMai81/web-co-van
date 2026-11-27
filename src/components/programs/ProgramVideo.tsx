import { toYoutubeEmbedUrl } from "@/lib/programLabels";
import type { ProgramLocalVideo } from "@/lib/programVideos";

export default function ProgramVideo({
  url,
  local,
}: {
  url?: string;
  local?: ProgramLocalVideo;
}) {
  const embedUrl = url ? toYoutubeEmbedUrl(url) : null;

  return (
    <div className="mt-8 overflow-hidden rounded-xl border border-blue/15 shadow-md shadow-blue/5">
      {embedUrl ? (
        <div className="aspect-video w-full">
          <iframe
            src={embedUrl}
            title="Video chương trình"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      ) : url ? (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="flex aspect-video w-full items-center justify-center bg-blue/5 font-bold text-blue hover:bg-blue/10"
        >
          Xem video chương trình →
        </a>
      ) : local ? (
        <video
          src={local.src}
          poster={local.poster}
          title={local.title}
          aria-label={local.title}
          controls
          playsInline
          preload="metadata"
          className="aspect-video w-full bg-black object-cover"
        />
      ) : null}
    </div>
  );
}
