"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";
import styles from "./WhySection.module.css";

/* ── Nội dung ───────────────────────────────────────────────── */

const STATS: { amount: number; suffix: string; label: string }[] = [
  { amount: 5000, suffix: "+", label: "Giờ khai vấn" },
  { amount: 3000, suffix: "+", label: "Giờ đào tạo" },
  { amount: 4, suffix: "", label: "Loại hình chương trình" },
  { amount: 1, suffix: ":1", label: "Đồng hành cá nhân hoá" },
];

type Chapter = {
  title: string;
  desc: string;
  icon: (d: CSSProperties) => ReactNode;
};

const iconProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  pathLength: 1,
};

const CHAPTERS: Chapter[] = [
  {
    title: "Chữa lành từ gốc rễ",
    desc: "Không dạy kỹ năng bề mặt. Mỗi chương trình đi vào chiều sâu — giúp bạn hiểu chính mình, gỡ những nút thắt bên trong và kết nối lại với bản thân.",
    icon: (d) => (
      <svg viewBox="0 0 24 24" className="h-8 w-8 text-yellow" aria-hidden="true" style={d}>
        <path className={styles.iconPath} {...iconProps} d="M4 20.5h16" />
        <path className={styles.iconPath} {...iconProps} d="M12 20.5V11" />
        <path className={styles.iconPath} {...iconProps} d="M12 11C12 7.2 9.4 5 5.5 5c0 3.8 2.6 6 6.5 6Z" />
        <path className={styles.iconPath} {...iconProps} d="M12 13.5c0-3.6 2.5-5.7 6.5-5.7 0 3.6-2.5 5.7-6.5 5.7Z" />
        <path className={styles.iconPath} {...iconProps} d="M12 20.5c-1.2-.9-2.6-1.1-4-.4M12 20.5c1.2-.9 2.6-1.1 4-.4" />
      </svg>
    ),
  },
  {
    title: "Đồng hành thực chất",
    desc: "Quy mô nhỏ có chủ ý. Mỗi người được lắng nghe, không bị hoà tan trong đám đông — Coach Yến Lê trực tiếp đồng hành xuyên suốt hành trình.",
    icon: (d) => (
      <svg viewBox="0 0 24 24" className="h-8 w-8 text-yellow" aria-hidden="true" style={d}>
        <circle className={styles.iconPath} {...iconProps} cx="8" cy="6.5" r="2.5" />
        <circle className={styles.iconPath} {...iconProps} cx="16" cy="6.5" r="2.5" />
        <path className={styles.iconPath} {...iconProps} d="M3.5 20v-2.5A4.5 4.5 0 0 1 8 13a4.5 4.5 0 0 1 4 2.4" />
        <path className={styles.iconPath} {...iconProps} d="M20.5 20v-2.5A4.5 4.5 0 0 0 16 13a4.5 4.5 0 0 0-4 2.4" />
        <path className={styles.iconPath} {...iconProps} d="M9.5 17.5c1.5 1.2 3.5 1.2 5 0" />
      </svg>
    ),
  },
  {
    title: "Trải nghiệm chuyển hoá",
    desc: "Từ trại hè, leo núi đến workshop khai phóng nội tâm — mỗi chương trình được thiết kế để tạo ra bước ngoặt thật, không phải một buổi học rồi quên.",
    icon: (d) => (
      <svg viewBox="0 0 24 24" className="h-8 w-8 text-yellow" aria-hidden="true" style={d}>
        <path className={styles.iconPath} {...iconProps} d="M3 18.5h18" />
        <path className={styles.iconPath} {...iconProps} d="M6.5 18.5a5.5 5.5 0 0 1 11 0" />
        <path className={styles.iconPath} {...iconProps} d="M12 4.5v3.5" />
        <path className={styles.iconPath} {...iconProps} d="M4.9 8.4l2.4 2.4M19.1 8.4l-2.4 2.4" />
        <path className={styles.iconPath} {...iconProps} d="M2.5 14h2.2M19.3 14h2.2" />
        <path className={styles.iconPath} {...iconProps} d="M10 21.5h4" />
      </svg>
    ),
  },
];

/* ── Đếm số ─────────────────────────────────────────────────── */

const COUNT_DURATION_MS = 1800;

function formatVi(n: number) {
  return Math.floor(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function CountUp({
  amount,
  suffix,
  run,
  delay,
}: {
  amount: number;
  suffix: string;
  run: boolean;
  delay: number;
}) {
  const final = `${formatVi(amount)}${suffix}`;
  const [text, setText] = useState(final);

  useEffect(() => {
    if (!run || amount <= 1) return;
    let reduced = false;
    try {
      reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      reduced = true;
    }
    if (reduced || typeof window.requestAnimationFrame !== "function") return;

    let frame: number | null = null;
    let start: number | null = null;
    setText(`0${suffix}`);

    const timer = window.setTimeout(() => {
      const tick = (t: number) => {
        if (start === null) start = t;
        const p = Math.min(1, (t - start) / COUNT_DURATION_MS);
        const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
        setText(`${formatVi(amount * eased)}${suffix}`);
        if (p < 1) frame = window.requestAnimationFrame(tick);
      };
      frame = window.requestAnimationFrame(tick);
    }, delay);

    return () => {
      window.clearTimeout(timer);
      if (frame !== null) window.cancelAnimationFrame(frame);
      setText(final);
    };
  }, [run, amount, suffix, delay, final]);

  return (
    <>
      <span aria-hidden="true" className="tabular-nums">{text}</span>
      <span className="sr-only">{final}</span>
    </>
  );
}

/* ── Section ────────────────────────────────────────────────── */

function trackPointer(event: PointerEvent<HTMLElement>) {
  if (event.pointerType !== "mouse") return;
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  el.style.setProperty("--my", `${event.clientY - rect.top}px`);
}

export function WhySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let reduced = false;
    try {
      reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      reduced = true;
    }
    if (reduced || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      data-why-visible={visible ? "true" : undefined}
      aria-labelledby="why-sunshine-heading"
      className={`${styles.section} bg-blue px-6 py-20 md:py-28`}
    >
      {/* Tia nắng nền */}
      <svg viewBox="0 0 200 200" className={styles.sunRays} aria-hidden="true">
        {Array.from({ length: 24 }).map((_, i) => (
          <rect
            key={i}
            x="98.5"
            y="0"
            width="3"
            height="62"
            rx="1.5"
            fill="currentColor"
            transform={`rotate(${i * 15} 100 100)`}
          />
        ))}
        <circle cx="100" cy="100" r="26" fill="currentColor" />
      </svg>

      <div className="relative mx-auto grid max-w-[var(--page-w)] gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
        {/* Cột trái — dính khi cuộn trên desktop */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className={`${styles.rise} mb-5 flex items-center gap-3 font-mono text-sm font-bold uppercase tracking-[0.2em] text-yellow`}>
            <span className="block h-px w-8 bg-yellow" />
            Vì sao là Sunshine
          </div>

          <h2
            id="why-sunshine-heading"
            className={`${styles.rise} font-display text-4xl font-bold leading-[1.1] text-white md:text-5xl`}
            style={{ "--d": "120ms" } as CSSProperties}
          >
            Vì sao chọn{" "}
            <span className={styles.highlight}>Sunshine Center</span>?
          </h2>

          <p
            className={`${styles.rise} mt-6 max-w-[46ch] text-lg leading-relaxed text-white/70`}
            style={{ "--d": "240ms" } as CSSProperties}
          >
            Sự thay đổi thật sự bắt đầu từ bên trong. Chúng tôi tạo ra một
            không gian đủ an toàn để bạn dám nhìn lại mình — và đủ vững để
            bạn bước tiếp.
          </p>

          <dl className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10">
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className={`${styles.rise} ${styles.stat} flex flex-col`}
                style={{ "--d": `${360 + i * 120}ms` } as CSSProperties}
              >
                <dt className="order-2 mt-2 text-sm font-semibold uppercase tracking-wide text-white/60">
                  {stat.label}
                </dt>
                <dd className="order-1 font-display text-4xl font-bold text-yellow md:text-5xl">
                  <CountUp
                    amount={stat.amount}
                    suffix={stat.suffix}
                    run={visible}
                    delay={360 + i * 120}
                  />
                </dd>
                <span
                  className={styles.statBar}
                  style={{ "--d": `${500 + i * 120}ms` } as CSSProperties}
                  aria-hidden="true"
                />
              </div>
            ))}
          </dl>
        </div>

        {/* Cột phải — 3 chương */}
        <ol className="grid gap-5">
          {CHAPTERS.map((chapter, i) => {
            const delay = { "--d": `${300 + i * 220}ms` } as CSSProperties;
            return (
              <li
                key={chapter.title}
                onPointerMove={trackPointer}
                className={`${styles.card} rounded-3xl border border-white/10 bg-white/[0.04] p-7 md:p-9`}
                style={delay}
              >
                <span className={styles.cardEdge} style={delay} aria-hidden="true" />
                <span className={styles.chapterNumber} aria-hidden="true">
                  0{i + 1}
                </span>

                <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-7">
                  <div className={styles.iconRing}>{chapter.icon(delay)}</div>
                  <div className="max-w-[44ch]">
                    <h3 className="font-display text-xl font-bold text-white md:text-2xl">
                      {chapter.title}
                    </h3>
                    <p className="mt-3 leading-relaxed text-white/70">
                      {chapter.desc}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
