"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import VideoModal from "./VideoModal";
import styles from "./VideoGallery.module.css";
import type { Video } from "@/types/video";

function PlayIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

/**
 * Số cột (trên lưới 4 cột desktop) mà mỗi thẻ chiếm, để hàng cuối không bị
 * hở ô trống dù số video là bao nhiêu. Thẻ đầu tiên là thẻ nổi bật.
 */
function lgSpan(index: number, total: number): 1 | 2 | 4 {
  if (index === 0) return 2;
  if (total >= 5) {
    const trailing = (total - 5) % 4;
    const firstTrailing = total - trailing;
    if (trailing === 0 || index < firstTrailing) return 1;
    if (trailing === 1) return 4;
    if (trailing === 2) return 2;
    return index === firstTrailing ? 2 : 1;
  }
  // Ít hơn 5 video: thẻ nổi bật chỉ cao 1 hàng, 2 ô bên cạnh.
  const small = total - 1;
  if (small === 1) return 2;
  if (small === 3 && index === 3) return 4;
  return 1;
}

export function VideoGallery() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [originRect, setOriginRect] = useState<DOMRect | null>(null);
  const activeTriggerRef = useRef<HTMLButtonElement | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const closeVideo = useCallback(() => setActiveVideo(null), []);

  useEffect(() => {
    fetch("/site-api/videos")
      .then((res) => res.json())
      .then((json) => setVideos(json.data ?? []))
      .catch(() => setVideos([]));
  }, []);

  // Hiệu ứng xuất hiện khi cuộn tới (chỉ bật khi có video để hiển thị).
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || videos.length === 0) return;
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") return;

    el.dataset.armed = "true";
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          el.dataset.visible = "true";
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [videos.length]);

  if (videos.length === 0) return null;

  return (
    <section ref={sectionRef} id="videos" className={`${styles.section} bg-blue/5 py-28`}>
      <div className="mx-auto max-w-[var(--page-w)] px-6">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div
              className={`${styles.headingRise} mb-4 flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-yellow`}
            >
              <span className={`${styles.kickerLine} block h-px w-6 bg-yellow`} />
              Thư viện video
            </div>
            <h2
              className={`${styles.headingRise} font-display text-4xl font-bold text-blue`}
              style={{ "--d": "120ms" } as CSSProperties}
            >
              Nhật ký hành trình
            </h2>
          </div>
          <p
            className={`${styles.headingRise} max-w-[42ch] text-sm leading-relaxed text-blue/60`}
            style={{ "--d": "240ms" } as CSSProperties}
          >
            Những khoảnh khắc thật từ các chuyến đi và buổi học — bấm vào một
            video để xem lại hành trình.
          </p>
        </div>

        <div className={styles.grid}>
          {videos.map((v, index) => {
            const featured = index === 0;
            const span = lgSpan(index, videos.length);
            const tall = featured && videos.length >= 5;
            return (
              <button
                key={v._id}
                type="button"
                aria-haspopup="dialog"
                onClick={(event) => {
                  activeTriggerRef.current = event.currentTarget;
                  const thumbnail = event.currentTarget.querySelector<HTMLElement>("[data-video-thumbnail]");
                  setOriginRect(thumbnail?.getBoundingClientRect() ?? null);
                  setActiveVideo(v);
                }}
                className={`${styles.card} ${featured ? styles.featured : ""} ${tall ? styles.tall : ""} ${span === 4 ? styles.wide : ""} group`}
                style={{ "--d": `${200 + index * 120}ms`, "--lg-span": span } as CSSProperties}
              >
                <div data-video-thumbnail className={styles.thumb}>
                  {/* Ảnh thumbnail YouTube có sẵn miễn phí theo đúng video ID, không cần tự upload riêng */}
                  <Image
                    src={`https://i.ytimg.com/vi/${v.youtubeId}/hqdefault.jpg`}
                    alt={v.title}
                    fill
                    sizes={featured ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"}
                    className={`${styles.thumbImg} object-cover`}
                  />
                  <span aria-hidden="true" className={styles.shade} />
                  {v.durationLabel && (
                    <span className={styles.duration}>{v.durationLabel}</span>
                  )}
                  <span className={styles.play}>
                    <PlayIcon size={featured ? 26 : 16} />
                  </span>
                  {featured && (
                    <span className={styles.featuredCaption}>
                      <span className={styles.featuredTag}>Nổi bật</span>
                      <span className={`${styles.title} block w-fit font-display text-2xl font-bold leading-snug md:text-3xl`}>
                        {v.title}
                      </span>
                      {v.place && (
                        <span className="mt-1 block text-sm font-medium text-white/75">
                          {v.place}
                        </span>
                      )}
                    </span>
                  )}
                </div>
                {!featured && (
                  <div className="mt-3">
                    <span className={`${styles.title} font-display text-sm font-bold text-blue`}>
                      {v.title}
                    </span>
                    {v.place && (
                      <div className="mt-0.5 text-xs font-medium text-blue/55">
                        {v.place}
                      </div>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {activeVideo && (
        <VideoModal
          video={activeVideo}
          originRect={originRect}
          returnFocusElement={activeTriggerRef.current}
          onClose={closeVideo}
        />
      )}
    </section>
  );
}
