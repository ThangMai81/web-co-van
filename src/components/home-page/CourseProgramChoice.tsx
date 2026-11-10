"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function CourseProgramChoice() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    let prefersReduced = false;
    try { prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch { /* noop */ }
    if (prefersReduced || typeof IntersectionObserver === "undefined") { setVisible(true); return; }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="chon-khoa-hoc-hay-chuong-trinh"
      aria-labelledby="course-program-choice-heading"
      className="scroll-mt-24 bg-[#fffaf2] px-6 py-6 md:py-14"
    >
      <div className="mx-auto max-w-[var(--page-w)]">
        <div
          className={`transition-all duration-700 ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <div className="hidden h-1 w-10 bg-yellow md:block" aria-hidden="true" />
          <h2
            id="course-program-choice-heading"
            className="max-w-[22ch] font-display text-2xl font-bold leading-tight text-blue sm:text-3xl md:mt-5 md:max-w-none md:text-4xl"
          >
            Khóa học hay Chương trình?
          </h2>
          <p className="mt-2 max-w-[52ch] text-sm font-medium text-blue/60 md:text-base">
            Mỗi hành trình là khác nhau. Chọn hình thức phù hợp với bạn — học sâu theo khóa, hoặc trải nghiệm cùng cộng đồng qua chương trình.
          </p>
        </div>

        <div className="mt-5 grid gap-3 md:mt-12 md:grid-cols-2 md:gap-5">
          <article
            className={`flex flex-col rounded-xl border border-blue/15 bg-white p-5 transition-all duration-700 ease-out md:min-h-[292px] md:border-l-8 md:border-l-yellow md:p-8 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ transitionDelay: "120ms" }}
          >
            <h3 className="font-display text-lg font-bold text-blue md:text-2xl">
              Khóa học
            </h3>
            <span className="mt-3 hidden h-1 w-12 bg-yellow md:block" aria-hidden="true" />
            <p className="mt-2 text-sm leading-6 text-blue/75 sm:text-base md:mt-5 md:text-lg md:leading-8">
              Học có hệ thống với giảng viên hướng dẫn — phù hợp khi bạn muốn đi sâu vào một chủ đề cụ thể, với lộ trình rõ ràng và bài giảng được thiết kế bài bản.
            </p>
            <Link
              href="/courses"
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-blue px-7 py-3 text-sm font-semibold text-white hover:bg-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue md:mt-auto md:w-fit md:rounded-md md:bg-yellow md:text-blue md:hover:bg-yellow/90"
            >
              Xem khóa học
            </Link>
          </article>

          <article
            className={`flex flex-col rounded-xl border border-blue/15 bg-white p-5 transition-all duration-700 ease-out md:min-h-[292px] md:border-l-8 md:border-l-blue md:p-8 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ transitionDelay: "220ms" }}
          >
            <h3 className="font-display text-lg font-bold text-blue md:text-2xl">
              Chương trình
            </h3>
            <span className="mt-3 hidden h-1 w-12 bg-yellow md:block" aria-hidden="true" />
            <p className="mt-2 text-sm leading-6 text-blue/75 sm:text-base md:mt-5 md:text-lg md:leading-8">
              Trải nghiệm cùng cộng đồng qua trại hè, leo núi, workshop và những buổi off chữa lành — mỗi chương trình là một hành trình để kết nối sâu với bản thân và những người xung quanh.
            </p>
            <Link
              href="/programs"
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-blue px-7 py-3 text-sm font-semibold text-white hover:bg-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue md:mt-auto md:w-fit md:rounded-md"
            >
              Xem chương trình
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
