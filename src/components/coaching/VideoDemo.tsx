"use client";

import { useRef, useState } from "react";
import { Ear, Lightbulb, Footprints, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/animation/Reveal";

const SESSION_BEATS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Ear,
    title: "Lắng nghe",
    body: "Bạn kể câu chuyện của mình theo cách của bạn. Không phán xét, không vội đưa lời khuyên.",
  },
  {
    icon: Lightbulb,
    title: "Làm rõ",
    body: "Những câu hỏi đúng lúc giúp bạn nhìn ra điều thật sự đang vướng — và điều bạn thật sự muốn.",
  },
  {
    icon: Footprints,
    title: "Hành động",
    body: "Bạn rời buổi trò chuyện với một bước đi cụ thể, vừa sức, do chính bạn chọn.",
  },
];

export function VideoDemo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    v.controls = true;
    void v.play();
  };

  return (
    <section className="relative isolate overflow-hidden bg-blue px-6 py-20 text-white md:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-10 -z-10 h-96 w-96 rounded-full bg-yellow/10 blur-3xl" />

      <div className="mx-auto max-w-[var(--page-w)]">
        <Reveal direction="up">
          <div className="mb-12 max-w-2xl">
            <div className="mb-4 flex items-center gap-3 font-mono text-sm font-bold uppercase tracking-[0.2em] text-yellow">
              <span className="block h-px w-8 bg-yellow" />
              Gặp người đồng hành
            </div>
            <h2 className="font-display text-3xl font-bold leading-tight md:text-5xl">
              Coaching 1:1 thực sự diễn ra như thế nào?
            </h2>
            <p className="mt-4 text-lg text-white/70">
              Nghe Coach Yến Lê chia sẻ — và hình dung một buổi đồng hành
              của riêng bạn.
            </p>
          </div>
        </Reveal>

        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-16">
          <Reveal direction="left">
            <div className="group relative aspect-video overflow-hidden rounded-3xl border border-white/15 bg-black shadow-2xl shadow-black/40">
              <video
                ref={videoRef}
                src="/videos/home-yen-intro.mp4"
                poster="/images/home-yen-poster.jpg"
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
                  aria-label="Phát video giới thiệu Coach Yến Lê"
                  className="absolute inset-0 grid place-items-center bg-gradient-to-t from-blue/80 via-blue/20 to-transparent focus-visible:outline-none"
                >
                  <span className="relative grid h-20 w-20 place-items-center rounded-full bg-yellow text-blue shadow-2xl transition-transform duration-500 group-hover:scale-110 group-focus-visible:ring-4 group-focus-visible:ring-white">
                    <span aria-hidden="true" className="absolute inset-0 animate-ping rounded-full bg-yellow/40 motion-reduce:animate-none" />
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="relative ml-1">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                  <span className="absolute bottom-5 left-6 font-mono text-xs font-bold uppercase tracking-[0.2em] text-white/85">
                    Coach Yến Lê · Sunshine Center
                  </span>
                </button>
              )}
            </div>
          </Reveal>

          <div className="grid gap-4">
            {SESSION_BEATS.map((beat, i) => (
              <Reveal key={beat.title} direction="right" delay={150 + i * 150}>
                <div className="group flex gap-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition-colors duration-300 hover:border-yellow/50 hover:bg-white/[0.08]">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-yellow/10 text-yellow ring-1 ring-yellow/30 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                    <beat.icon size={22} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <div>
                    <div className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-yellow/80">
                      Nhịp 0{i + 1}
                    </div>
                    <h3 className="mt-1 font-display text-xl font-bold">{beat.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/70">{beat.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
