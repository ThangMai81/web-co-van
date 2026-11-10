"use client";

import { useEffect, useRef } from "react";
import styles from "./WhySection.module.css";

const STATS = [
  { value: "500+", label: "Học viên đã đồng hành" },
  { value: "6+",   label: "Năm kinh nghiệm" },
  { value: "20+",  label: "Chương trình & khóa học" },
  { value: "98%",  label: "Hài lòng sau chương trình" },
];

const REASONS = [
  {
    icon: "🌱",
    title: "Chữa lành từ gốc rễ",
    desc: "Chúng tôi không dạy kỹ năng bề mặt. Mỗi chương trình đi vào chiều sâu — giúp bạn hiểu chính mình, hóa giải những nút thắt tâm lý và tái kết nối với bản thân.",
  },
  {
    icon: "🤝",
    title: "Đồng hành thực chất",
    desc: "Sunshine Center giữ quy mô nhỏ có chủ ý. Mỗi học viên được lắng nghe, không bị hòa tan trong đám đông. Coach Yến Lê trực tiếp đồng hành xuyên suốt hành trình.",
  },
  {
    icon: "✨",
    title: "Trải nghiệm chuyển hóa",
    desc: "Từ trại hè leo núi đến workshop khai phóng nội tâm — mỗi chương trình được thiết kế để tạo ra bước ngoặt thực sự, không chỉ là buổi học một lần rồi quên.",
  },
];

export function WhySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const prefersReduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced || typeof IntersectionObserver === "undefined") {
      el.dataset.whyVisible = "true";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          el.dataset.whyVisible = "true";
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="why-sunshine-heading"
      className="bg-blue px-6 py-14 md:py-20"
    >
      <div className="mx-auto max-w-[var(--page-w)]">

        {/* Heading */}
        <div className={styles.heading}>
          <div className="mb-2 h-1 w-10 bg-yellow" aria-hidden="true" />
          <h2
            id="why-sunshine-heading"
            className="font-display text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl"
          >
            Vì sao chọn Sunshine Center?
          </h2>
          <p className="mt-3 max-w-[52ch] text-base leading-relaxed text-white/70">
            Hơn 6 năm đồng hành cùng hàng trăm gia đình và cá nhân — chúng tôi
            hiểu rằng sự thay đổi thật sự đến từ bên trong.
          </p>
        </div>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 md:mt-14">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className={`${styles.statItem} rounded-2xl border border-white/10 bg-white/5 px-5 py-6 text-center`}
              style={{ "--stat-delay": `${i * 80}ms` } as React.CSSProperties}
            >
              <div
                className={`${styles.statNumber} font-display text-4xl font-bold text-yellow md:text-5xl`}
                style={{ "--stat-delay": `${i * 80 + 100}ms` } as React.CSSProperties}
              >
                {stat.value}
              </div>
              <div className="mt-2 text-sm font-medium leading-snug text-white/70">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Reason cards */}
        <div className="mt-10 grid gap-5 md:mt-14 md:grid-cols-3">
          {REASONS.map((reason, i) => (
            <article
              key={reason.title}
              className={`${styles.reasonCard} flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8`}
              style={{ "--reason-delay": `${200 + i * 100}ms` } as React.CSSProperties}
            >
              <div className="text-3xl" aria-hidden="true">{reason.icon}</div>
              <div>
                <h3 className="text-lg font-bold text-white md:text-xl">
                  {reason.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70 md:text-base">
                  {reason.desc}
                </p>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
