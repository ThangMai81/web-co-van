"use client";

import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
import styles from "./MissionClosing.module.css";

const PATHS = [
  {
    href: "/programs",
    label: "Chương trình",
    desc: "Trại hè, leo núi, workshop và những buổi off chữa lành.",
  },
  {
    href: "/courses",
    label: "Khóa học",
    desc: "Lộ trình học cho cha mẹ, con trẻ và người muốn đồng hành.",
  },
  {
    href: "/coaching",
    label: "Coaching 1:1",
    desc: "Một không gian riêng để lắng nghe và tìm bước đi phù hợp.",
  },
];

export function MissionClosing() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      el.dataset.visible = "true";
      return;
    }
    el.dataset.armed = "true";
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          el.dataset.visible = "true";
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      aria-labelledby="mission-closing-heading"
      className={`${styles.section} relative overflow-hidden bg-blue px-6 pb-16 pt-[15rem] md:pb-24 md:pt-[17rem]`}
    >
      <div aria-hidden="true" className={styles.sky}>
        <span className={styles.sun} />
        {Array.from({ length: 12 }).map((_, i) => (
          <span
            key={i}
            className={styles.ray}
            style={{ "--r": `${i * 15 - 82.5}deg`, "--i": i } as CSSProperties}
          />
        ))}
        <span className={styles.horizon} />
      </div>

      <div className="relative mx-auto max-w-[var(--page-w)] text-center">
        <p className={`${styles.rise} font-mono text-xs font-bold uppercase tracking-[0.2em] text-yellow sm:text-sm`} style={{ "--d": "500ms" } as CSSProperties}>
          Khai tâm mở lối
        </p>
        <h2
          id="mission-closing-heading"
          className={`${styles.rise} mx-auto mt-4 max-w-[22ch] font-display text-3xl font-bold leading-tight text-white md:text-5xl`}
          style={{ "--d": "650ms" } as CSSProperties}
        >
          Hành trình tìm lại chính mình bắt đầu từ một bước nhỏ
        </h2>
        <p className={`${styles.rise} mx-auto mt-5 max-w-[56ch] text-base leading-relaxed text-white/75`} style={{ "--d": "800ms" } as CSSProperties}>
          Chọn cánh cửa phù hợp với bạn hôm nay — Sunshine Center sẽ đồng hành
          cùng bạn ở những bước tiếp theo.
        </p>

        <div className="mx-auto mt-12 grid max-w-5xl gap-4 text-left md:grid-cols-3">
          {PATHS.map((path, i) => (
            <Link
              key={path.href}
              href={path.href}
              className={`${styles.rise} ${styles.path} group block rounded-2xl border border-white/15 bg-white/[0.04] p-6`}
              style={{ "--d": `${1000 + i * 150}ms` } as CSSProperties}
            >
              <span className="flex items-center justify-between">
                <span className="text-lg font-bold text-white">{path.label}</span>
                <span aria-hidden="true" className={`${styles.arrow} grid h-9 w-9 place-items-center rounded-full bg-yellow text-blue`}>
                  →
                </span>
              </span>
              <span className="mt-2 block text-sm leading-relaxed text-white/65">
                {path.desc}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
