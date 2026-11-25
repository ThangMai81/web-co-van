"use client";

import { useRef, useState } from "react";
import { Reveal } from "@/components/animation/Reveal";

export function ProcessVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    v.controls = true;
    void v.play();
  };

  return (
    <section aria-labelledby="process-video-title" className="bg-white px-6 pb-16 pt-4 md:pb-24 xl:px-8">
      <div className="mx-auto max-w-[var(--page-w)]">
        <Reveal direction="up">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="mb-2 font-mono text-sm font-bold uppercase tracking-[.18em] text-yellow">Xem trong 47 giây</p>
                <h2 id="process-video-title" className="font-display text-2xl font-bold text-blue md:text-3xl">
                  Hành trình đồng hành, từ lời nhắn đầu tiên
                </h2>
              </div>
            </div>

            <div className="group relative aspect-video overflow-hidden rounded-3xl border border-blue/10 bg-blue shadow-[0_24px_60px_rgba(20,40,80,.18)]">
              <video
                ref={videoRef}
                src="/videos/quy-trinh-dong-hanh.mp4"
                preload="metadata"
                playsInline
                className="h-full w-full object-cover"
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)}
              />
              {!playing && (
                <button
                  type="button"
                  onClick={play}
                  aria-label="Phát video quy trình đồng hành"
                  className="absolute inset-0 grid place-items-center bg-gradient-to-t from-blue/70 via-blue/10 to-transparent focus-visible:outline-none"
                >
                  <span className="relative grid h-20 w-20 place-items-center rounded-full bg-yellow text-blue shadow-2xl transition-transform duration-500 group-hover:scale-110 group-focus-visible:ring-4 group-focus-visible:ring-white">
                    <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-yellow/40 motion-reduce:animate-none" />
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="relative ml-1">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                  <span className="absolute bottom-5 left-6 font-mono text-xs font-bold uppercase tracking-[0.2em] text-white/85">
                    Quy trình đồng hành · Sunshine Center
                  </span>
                </button>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
