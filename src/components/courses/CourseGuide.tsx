"use client";

import Link from "next/link";
import { useEffect, useRef, type PointerEvent } from "react";
import styles from "./CourseGuide.module.css";

const PATHS = [
  {
    category: "chua-lanh",
    tag: "Chữa lành",
    title: "Tôi muốn hiểu và chữa lành chính mình",
    desc: "Dành cho cha mẹ và người trưởng thành đang mang những nút thắt cảm xúc, muốn tìm lại sự bình an và kết nối sâu hơn với gia đình.",
  },
  {
    category: "tre-em",
    tag: "Trẻ em",
    title: "Tôi muốn con tự tin và bản lĩnh hơn",
    desc: "Những khóa học giúp trẻ rèn ý chí, nuôi dưỡng sự kiên cường và học cách gọi tên, làm chủ cảm xúc của mình.",
  },
  {
    category: "coach",
    tag: "Coach",
    title: "Tôi muốn trở thành người đồng hành",
    desc: "Lộ trình cho những ai muốn học phương pháp coaching của Sunshine Center để dẫn dắt người khác trên hành trình của họ.",
  },
];

export function CourseGuide({ activeCategory }: { activeCategory?: string }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      el.dataset.guideVisible = "true";
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          el.dataset.guideVisible = "true";
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleMove = (e: PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== "mouse") return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    card.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    card.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
    card.style.setProperty("--rx", `${((0.5 - y) * 8).toFixed(2)}deg`);
    card.style.setProperty("--ry", `${((x - 0.5) * 10).toFixed(2)}deg`);
  };

  const handleLeave = (e: PointerEvent<HTMLAnchorElement>) => {
    const card = e.currentTarget;
    card.style.setProperty("--rx", "0deg");
    card.style.setProperty("--ry", "0deg");
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="course-guide-heading"
      className={`${styles.section} bg-white px-6 py-16 md:py-24`}
    >
      <div className="mx-auto max-w-[var(--page-w)]">
        <div className={`${styles.heading} max-w-[60ch]`}>
          <div className="mb-3 h-1 w-10 bg-yellow" aria-hidden="true" />
          <h2
            id="course-guide-heading"
            className="font-display text-3xl font-bold leading-tight text-blue md:text-4xl"
          >
            Bạn đang tìm điều gì?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-blue/70">
            Chưa biết bắt đầu từ đâu? Chọn mong muốn gần nhất với bạn — chúng
            tôi sẽ đưa bạn tới nhóm khóa học phù hợp.
          </p>
        </div>

        <div className={`${styles.grid} mt-10 grid gap-6 md:mt-14 md:grid-cols-3`}>
          {PATHS.map((path, i) => {
            const active = activeCategory === path.category;
            return (
              <Link
                key={path.category}
                href={`/courses?category=${path.category}#danh-sach-khoa-hoc`}
                onPointerMove={handleMove}
                onPointerLeave={handleLeave}
                aria-current={active ? "true" : undefined}
                className={`${styles.card} ${active ? styles.cardActive : ""} group relative flex flex-col overflow-hidden rounded-3xl bg-blue p-7 md:p-9`}
                style={{ "--guide-delay": `${180 + i * 140}ms` } as React.CSSProperties}
              >
                <span aria-hidden="true" className={styles.spot} />
                <span aria-hidden="true" className={`${styles.index} font-display`}>
                  0{i + 1}
                </span>
                <span className="relative inline-flex w-fit rounded-full bg-yellow/15 px-3 py-1 font-mono text-xs font-bold uppercase tracking-[0.14em] text-yellow">
                  {path.tag}
                </span>
                <h3 className="relative mt-5 text-xl font-bold leading-snug text-white md:text-2xl">
                  {path.title}
                </h3>
                <p className="relative mt-3 flex-1 text-sm leading-relaxed text-white/75 md:text-base">
                  {path.desc}
                </p>
                <span className="relative mt-7 inline-flex items-center gap-2 text-sm font-bold text-yellow">
                  {active ? "Đang xem nhóm này" : "Xem khóa học"}
                  <span aria-hidden="true" className={styles.arrow}>
                    →
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
