"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import styles from "./ProgramFlowTimeline.module.css";

const STEPS = [
  {
    no: "01",
    title: "Kết nối & đăng ký",
    desc: "Bạn chọn chương trình phù hợp và để lại thông tin. Đội ngũ Sunshine Center liên hệ lại để lắng nghe mong muốn của gia đình.",
  },
  {
    no: "02",
    title: "Chuẩn bị hành trang",
    desc: "Trước ngày khởi hành, học viên nhận lịch trình, danh sách vật dụng và một buổi trò chuyện ngắn để sẵn sàng cả thể chất lẫn tinh thần.",
  },
  {
    no: "03",
    title: "Trải nghiệm thật",
    desc: "Leo núi, trại hè, workshop hay những buổi off chữa lành — mỗi hoạt động được dẫn dắt để học viên vượt giới hạn và chạm vào chính mình.",
  },
  {
    no: "04",
    title: "Đồng hành sau chương trình",
    desc: "Hành trình không dừng khi chương trình kết thúc. Sunshine Center tiếp tục giữ kết nối để những thay đổi tích cực được duy trì.",
  },
];

export function ProgramFlowTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      section.dataset.flowStatic = "true";
      return;
    }

    const steps = Array.from(
      track.querySelectorAll<HTMLElement>("[data-flow-step]"),
    );
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight;
      // Progress runs from when the track top hits 75% of viewport
      // until the track bottom reaches 55% of viewport.
      const start = vh * 0.75;
      const end = vh * 0.55;
      const total = rect.height + (start - end);
      const raw = (start - rect.top) / total;
      const progress = Math.min(1, Math.max(0, raw));
      track.style.setProperty("--flow-progress", progress.toFixed(4));

      steps.forEach((step, i) => {
        const threshold = (i + 0.35) / steps.length;
        step.dataset.active = progress >= threshold ? "true" : "false";
      });
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="program-flow-heading"
      className={`${styles.section} relative overflow-clip bg-blue px-6 py-16 md:py-24`}
    >
      <div
        aria-hidden="true"
        className={`${styles.glow} pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-yellow/15 blur-3xl`}
      />
      <div className="relative mx-auto grid max-w-[var(--page-w)] gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <div className="mb-4 flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-yellow sm:text-sm">
            <span className="block h-px w-6 bg-yellow" />
            Quy trình
          </div>
          <h2
            id="program-flow-heading"
            className="max-w-[16ch] font-display text-3xl font-bold leading-tight text-white md:text-4xl"
          >
            Một chương trình diễn ra thế nào?
          </h2>
          <p className="mt-4 max-w-[46ch] text-base leading-relaxed text-white/75">
            Dù là chuyến leo núi vài ngày hay một buổi workshop, mỗi chương
            trình của Sunshine Center đều đi qua bốn chặng — để học viên được
            chuẩn bị kỹ, trải nghiệm trọn vẹn và mang thay đổi về nhà.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="https://zalo.me/0935626186"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.cta} inline-flex items-center gap-2 rounded-full bg-yellow px-6 py-3 text-sm font-bold text-blue`}
            >
              Hỏi tư vấn qua Zalo
              <span aria-hidden="true" className={styles.ctaArrow}>
                →
              </span>
            </a>
            <Link
              href="/courses"
              className="inline-flex items-center rounded-full border border-white/25 px-6 py-3 text-sm font-bold text-white transition-colors hover:border-yellow hover:text-yellow"
            >
              Xem các khóa học
            </Link>
          </div>
        </div>

        <ol ref={trackRef} className={`${styles.track} relative`}>
          <span aria-hidden="true" className={styles.rail} />
          <span aria-hidden="true" className={styles.railFill} />
          {STEPS.map((step) => (
            <li
              key={step.no}
              data-flow-step
              data-active="false"
              className={`${styles.step} relative pb-12 pl-16 last:pb-0 md:pl-24`}
            >
              <span aria-hidden="true" className={styles.node}>
                <span className={styles.nodeCore} />
              </span>
              <div className={styles.card}>
                <span className={`${styles.no} font-display text-5xl font-bold md:text-6xl`}>
                  {step.no}
                </span>
                <h3 className="mt-1 text-xl font-bold text-white md:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-white/75 md:text-base">
                  {step.desc}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
