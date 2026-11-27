"use client";

import { useRef, useState } from "react";
import { toYoutubeEmbedUrl } from "@/lib/programLabels";

/**
 * Video ở trang chi tiết khóa học.
 * - Khóa có videoUrl YouTube riêng => nhúng video đó ("Video giới thiệu khóa học").
 * - Chưa có => video giới thiệu của giảng viên Yến Lê (có sẵn trong /public/videos).
 */
export default function CourseIntroVideo({
  videoUrl,
  instructorName,
  courseTitle,
}: {
  videoUrl?: string;
  instructorName?: string;
  courseTitle: string;
}) {
  const embed = videoUrl?.trim() ? toYoutubeEmbedUrl(videoUrl.trim()) : null;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const isYen = /y[eế]n/i.test(instructorName ?? "");

  if (!embed && !isYen) return null;

  return (
    <section
      aria-labelledby="course-video-heading"
      className="overflow-hidden rounded-[1.75rem] bg-blue text-white shadow-2xl shadow-blue/20"
    >
      <div className="grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="group relative aspect-video bg-black">
          {embed ? (
            <iframe
              src={embed}
              title={`Video giới thiệu ${courseTitle}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="h-full w-full"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                src="/videos/gioi-thieu-khoa-hoc.mp4"
                poster="/images/courses/video-gioi-thieu-khoa-hoc-poster.jpg"
                preload="metadata"
                playsInline
                controls={playing}
                className="h-full w-full object-cover"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)}
              />
              {!playing && (
                <button
                  type="button"
                  onClick={() => void videoRef.current?.play()}
                  aria-label="Phát video giới thiệu khóa học tại Sunshine Center"
                  className="absolute inset-0 grid place-items-center bg-gradient-to-t from-blue/80 via-blue/20 to-transparent focus-visible:outline-none"
                >
                  <span className="relative grid h-20 w-20 place-items-center rounded-full bg-yellow text-blue shadow-2xl transition-transform duration-500 group-hover:scale-110">
                    <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-yellow/40 motion-reduce:animate-none" />
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="relative ml-1">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </button>
              )}
            </>
          )}
        </div>
        <div className="flex flex-col justify-center gap-4 p-7 md:p-10">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-yellow">
            {embed ? "Video khóa học" : "Video giới thiệu"}
          </p>
          <h2 id="course-video-heading" className="font-display text-2xl font-bold leading-snug md:text-3xl">
            {embed ? `Giới thiệu ${courseTitle}` : "Một khóa học tại Sunshine Center"}
          </h2>
          <p className="leading-relaxed text-white/75">
            {embed
              ? "Xem nhanh khóa học diễn ra thế nào trước khi đăng ký."
              : `Xem nhanh cách Coach ${instructorName ?? "Yến Lê"} và Sunshine Center đồng hành cùng học viên qua từng buổi học.`}
          </p>
        </div>
      </div>
    </section>
  );
}
