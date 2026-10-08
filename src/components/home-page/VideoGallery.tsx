"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import VideoModal from "./VideoModal";
import type { Video } from "@/types/video";

export function VideoGallery() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/videos`)
      .then((res) => res.json())
      .then((json) => setVideos(json.data ?? []))
      .catch(() => setVideos([]));
  }, []);

  if (videos.length === 0) return null;

  return (
    <section id="videos" className="bg-blue/5 py-28">
      <div className="mx-auto max-w-[var(--page-w)] px-6">
        <div className="mb-4 flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-yellow">
          <span className="block h-px w-6 bg-yellow" />
          Thư viện video
        </div>
        <h2 className="mb-14 font-display text-4xl font-bold text-blue">
          Nhật ký bằng hình
        </h2>

        <div className="grid grid-cols-1 items-start gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {videos.map((v) => (
            <button
              key={v._id}
              type="button"
              onClick={() => setActiveVideo(v)}
              className="group text-left"
            >
              <div className="relative aspect-video overflow-hidden rounded-xl border-2 border-blue/15 bg-blue/10">
                {/* Ảnh thumbnail YouTube có sẵn miễn phí theo đúng video ID, không cần tự upload riêng */}
                <Image
                  src={`https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`}
                  alt={v.title}
                  fill
                  className="object-cover"
                />
                {v.durationLabel && (
                  <span className="absolute left-2 top-2 rounded-full bg-blue px-2 py-0.5 font-mono text-[10px] font-bold text-white">
                    {v.durationLabel}
                  </span>
                )}
                <span className="absolute inset-0 flex items-center justify-center bg-blue/10 transition group-hover:bg-blue/20">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-blue shadow-md transition-all duration-200 group-hover:scale-110 group-hover:bg-yellow">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </span>
              </div>
              <div className="mt-3">
                <div className="font-display text-sm font-bold text-blue transition-colors group-hover:text-yellow">
                  {v.title}
                </div>
                {v.place && (
                  <div className="mt-0.5 text-xs font-medium text-blue/55">
                    {v.place}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {activeVideo && (
        <VideoModal video={activeVideo} onClose={() => setActiveVideo(null)} />
      )}
    </section>
  );
}
