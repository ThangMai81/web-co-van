"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ArrowRight } from "@/lib/icons";
import styles from "./CourseProgramChoice.module.css";

const CHOICES = [
  {
    href: "/courses",
    kicker: "01 · Học có lộ trình",
    title: "Khóa học",
    desc: "Học có hệ thống cùng giảng viên — phù hợp khi bạn muốn đi sâu vào một chủ đề, với lộ trình rõ ràng và bài giảng được thiết kế bài bản cho bạn hoặc con.",
    cta: "Xem khóa học",
    image: "/images/collaborate_team.jpg",
    alt: "Học viên cùng học tại Sunshine Center",
  },
  {
    href: "/programs",
    kicker: "02 · Trải nghiệm cùng cộng đồng",
    title: "Chương trình",
    desc: "Trại hè, leo núi, workshop và những buổi off chữa lành — mỗi chương trình là một hành trình để kết nối sâu với bản thân và những người xung quanh.",
    cta: "Xem chương trình",
    image: "/images/home-yen-poster.jpg",
    alt: "Hành trình leo núi cùng Sunshine Center",
  },
];

export function CourseProgramChoice() {
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
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="chon-khoa-hoc-hay-chuong-trinh"
      data-choice-visible={visible ? "true" : undefined}
      aria-labelledby="course-program-choice-heading"
      className="scroll-mt-24 bg-[#fffaf2] px-6 py-14 md:py-24"
    >
      <div className="mx-auto max-w-[var(--page-w)]">
        <div className={`${styles.headingRise} flex flex-col gap-4 md:flex-row md:items-end md:justify-between`}>
          <div>
            <div className="mb-4 flex items-center gap-3 font-mono text-sm font-bold uppercase tracking-[0.2em] text-blue/60">
              <span className="block h-px w-8 bg-yellow" />
              Bắt đầu từ đâu?
            </div>
            <h2
              id="course-program-choice-heading"
              className="font-display text-3xl font-bold leading-tight text-blue md:text-5xl"
            >
              Khóa học hay Chương trình?
            </h2>
          </div>
          <p className="max-w-[42ch] text-base leading-relaxed text-blue/65 md:text-right">
            Mỗi hành trình là khác nhau. Học sâu theo khóa, hoặc trải nghiệm
            cùng cộng đồng qua chương trình.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:mt-14 md:grid-cols-2 md:gap-6">
          {CHOICES.map((choice, i) => (
            <Link
              key={choice.href}
              href={choice.href}
              className={`${styles.panel} group flex min-h-[24rem] flex-col justify-end rounded-3xl bg-blue focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow focus-visible:ring-offset-4 focus-visible:ring-offset-[#fffaf2] md:min-h-[32rem]`}
              style={{ "--d": `${i * 180}ms` } as CSSProperties}
            >
              <Image
                src={choice.image}
                alt={choice.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className={`${styles.panelImage} -z-10 object-cover`}
              />
              <span className={styles.overlay} aria-hidden="true" />

              <div className={`${styles.content} relative z-10 p-7 md:p-10`}>
                <div className="mb-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-yellow">
                  {choice.kicker}
                </div>
                <h3 className="font-display text-4xl font-bold text-white md:text-5xl">
                  {choice.title}
                </h3>
                <span className={`${styles.rule} mt-4`} aria-hidden="true" />
                <p className={`${styles.desc} mt-4 max-w-[46ch] text-base leading-relaxed text-white/85`}>
                  {choice.desc}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-yellow px-6 py-3 text-sm font-bold text-blue">
                  {choice.cta}
                  <ArrowRight size={16} className={styles.arrow} aria-hidden="true" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
