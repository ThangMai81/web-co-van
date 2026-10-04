import { toYoutubeEmbedUrl } from "@/lib/programLabels";

export default function ProgramVideo({ url }: { url: string }) {
  const embedUrl = toYoutubeEmbedUrl(url);

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
      ) : (
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="flex aspect-video w-full items-center justify-center bg-blue/5 font-bold text-blue hover:bg-blue/10"
        >
          ▶ Xem video chương trình
        </a>
      )}
    </div>
  );
}
