"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { CloudRain, HeartHandshake, Sunrise, type LucideIcon } from "lucide-react";
import styles from "./Stories.module.css";

const STAGES: {
  icon: LucideIcon;
  label: string;
  title: string;
  body: string;
}[] = [
  {
    icon: CloudRain,
    label: "Trước khi đến",
    title: "Những điều chưa nói thành lời",
    body: "Cảm xúc dồn nén, khoảng cách giữa cha mẹ và con, hoặc cảm giác lạc hướng mà không biết bắt đầu từ đâu.",
  },
  {
    icon: HeartHandshake,
    label: "Trong hành trình",
    title: "Được lắng nghe và cùng bước",
    body: "Qua trải nghiệm, thử thách và những cuộc trò chuyện thật, mỗi người được đồng hành để nhìn lại chính mình.",
  },
  {
    icon: Sunrise,
    label: "Sau hành trình",
    title: "Vững vàng hơn từ bên trong",
    body: "Kết nối gia đình được hàn gắn, ý chí được bồi đắp và mỗi người mang về một hướng đi rõ ràng hơn.",
  },
];

export function StoriesJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(1);
  const [motion, setMotion] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
    );
    let frame = 0;

    const measure = () => {
      frame = 0;
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 khi đỉnh section chạm 85% màn hình, 1 khi đáy section lên tới 75%.
      const start = vh * 0.85;
      const end = vh * 0.75;
      const total = rect.height + (start - end);
      const p = (start - rect.top) / total;
      setProgress(Math.min(1, Math.max(0, p)));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    const apply = () => {
      if (desktop.matches) {
        setMotion(true);
        measure();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
      } else {
        setMotion(false);
        setProgress(1);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
    };

    apply();
    desktop.addEventListener("change", apply);
    return () => {
      desktop.removeEventListener("change", apply);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const lineProgress = motion ? Math.min(1, progress * 1.35) : 1;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="stories-journey-heading"
      className="bg-white px-6 py-20 md:py-28"
    >
      <div className="mx-auto max-w-[var(--page-w)]">
        <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-3 font-mono text-sm font-bold uppercase tracking-[0.2em] text-blue/60">
              <span className="block h-px w-8 bg-yellow" />
              Điểm chung của mọi câu chuyện
            </div>
            <h2
              id="stories-journey-heading"
              className="font-display text-3xl font-bold text-blue md:text-5xl"
            >
              Một hành trình, ba khoảnh khắc
            </h2>
          </div>
          <p className="max-w-[40ch] text-blue/65 md:text-right">
            Mỗi người đến với Sunshine theo một cách riêng, nhưng hầu hết đều đi
            qua ba chặng này.
          </p>
        </div>

        <div className="relative">
          <div aria-hidden="true" className={`${styles.journeyTrack} hidden md:block`}>
            <div
              className={styles.journeyFill}
              style={{ ["--journey-progress"]: lineProgress } as unknown as CSSProperties}
            />
          </div>

          <ol className="grid gap-6 md:grid-cols-3 md:gap-8">
            {STAGES.map((stage, i) => {
              const threshold = i / STAGES.length / 1.35 + 0.04;
              const active = !motion || progress >= threshold;
              return (
                <li
                  key={stage.title}
                  className={styles.stage}
                  data-active={active}
                >
                  <div className={styles.stageDot}>
                    <stage.icon size={28} strokeWidth={1.8} aria-hidden="true" />
                  </div>
                  <div
                    className={`${styles.stageCard} border border-blue/10 p-6 md:mt-6 md:p-7 ${
                      i === 1 ? "bg-blue text-white" : "bg-[#eef2fa] text-blue"
                    }`}
                  >
                    <div
                      className={`font-mono text-xs font-bold uppercase tracking-widest ${
                        i === 1 ? "text-yellow" : "text-blue/55"
                      }`}
                    >
                      0{i + 1} · {stage.label}
                    </div>
                    <h3 className="mt-3 font-display text-xl font-bold leading-snug md:text-2xl">
                      {stage.title}
                    </h3>
                    <p
                      className={`mt-3 leading-relaxed ${
                        i === 1 ? "text-white/75" : "text-blue/70"
                      }`}
                    >
                      {stage.body}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
