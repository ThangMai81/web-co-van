"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const PROCESS = [
  {
    step: "01",
    title: "Gửi yêu cầu với coach bạn chọn",
    body: "Chia sẻ điều bạn đang cần qua biểu mẫu riêng ngay trên hồ sơ của coach.",
    image: "/images/collaborate_team.jpg",
  },
  {
    step: "02",
    title: "Xác nhận thông tin và lịch",
    body: "Sunshine Center liên hệ để làm rõ nhu cầu và thống nhất thời gian, hình thức phù hợp.",
    image: "/images/first_banner.jpg",
  },
  {
    step: "03",
    title: "Bắt đầu phiên coaching 1:1",
    body: "Bạn và coach thống nhất nội dung, mục tiêu và lịch cho phiên đầu tiên.",
    image: "/images/Sunshine_banner.jpg",
  },
];

export function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const activeStepRef = useRef(0);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    activeStepRef.current = activeStep;
  }, [activeStep]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const desktopQuery = window.matchMedia("(min-width: 1280px) and (min-height: 720px)");
    let wheelLocked = false;
    let wheelUnlockTimer: number | undefined;
    let observer: IntersectionObserver | undefined;

    const syncResponsiveHighlight = () => {
      observer?.disconnect();
      observer = undefined;
      if (desktopQuery.matches) return;

      observer = new IntersectionObserver((entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];
        if (mostVisible) {
          const nextStep = Number((mostVisible.target as HTMLElement).dataset.serviceStep);
          activeStepRef.current = nextStep;
          setActiveStep(nextStep);
        }
      }, { rootMargin: "-30% 0px -30% 0px", threshold: [0, 0.25, 0.5, 0.75] });

      section.querySelectorAll<HTMLElement>("[data-service-step]").forEach((card) => observer?.observe(card));
    };

    const advancePinnedStep = (event: WheelEvent) => {
      if (!desktopQuery.matches || Math.abs(event.deltaY) < 8) return;

      const bounds = section.getBoundingClientRect();
      const stickyTop = 80;
      if (wheelLocked) {
        event.preventDefault();
        return;
      }

      const enteringFromAbove = event.deltaY > 0
        && bounds.top > stickyTop + 32
        && bounds.top < window.innerHeight * 0.92
        && bounds.bottom > window.innerHeight * 0.3;
      if (enteringFromAbove) {
        event.preventDefault();
        wheelLocked = true;
        window.scrollTo({ top: window.scrollY + bounds.top - stickyTop, behavior: "smooth" });
        window.clearTimeout(wheelUnlockTimer);
        wheelUnlockTimer = window.setTimeout(() => { wheelLocked = false; }, 700);
        return;
      }

      // Pin the interaction to the viewport once the section has snapped below
      // the fixed site header. Requiring the section's bottom to extend past the
      // viewport caused the wheel handler to miss at common 1080p layouts.
      const processIsPinned = bounds.top >= stickyTop - 32
        && bounds.top <= stickyTop + 32;
      if (!processIsPinned) return;

      const direction = event.deltaY > 0 ? 1 : -1;
      const targetStep = Math.min(PROCESS.length - 1, Math.max(0, activeStepRef.current + direction));
      if (targetStep === activeStepRef.current) return;

      event.preventDefault();
      wheelLocked = true;
      activeStepRef.current = targetStep;
      setActiveStep(targetStep);
      window.clearTimeout(wheelUnlockTimer);

      wheelUnlockTimer = window.setTimeout(() => {
        wheelLocked = false;
      }, 700);
    };

    window.addEventListener("wheel", advancePinnedStep, { passive: false, capture: true });
    syncResponsiveHighlight();
    desktopQuery.addEventListener("change", syncResponsiveHighlight);
    return () => {
      window.removeEventListener("wheel", advancePinnedStep, true);
      desktopQuery.removeEventListener("change", syncResponsiveHighlight);
      window.clearTimeout(wheelUnlockTimer);
      observer?.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} id="process" className="relative flex min-h-[calc(100svh-5rem)] scroll-mt-20 items-center bg-white px-6 py-14 md:py-16 xl:px-8">
      <div className="mx-auto w-full max-w-[var(--page-w)]">
        <div className="mb-8 max-w-2xl md:mb-10">
          <p className="mb-3 font-mono text-sm font-bold uppercase tracking-[.18em] text-yellow">Từng bước rõ ràng</p>
          <h2 className="font-display text-3xl font-bold text-blue md:text-5xl">Quy trình đồng hành</h2>
          <p className="mt-4 max-w-xl leading-7 text-blue/70">Bạn đã chọn người muốn gặp? Gửi lời nhắn từ hồ sơ của họ, rồi Sunshine Center sẽ hỗ trợ thống nhất lịch cho phiên đầu tiên.</p>
        </div>

        <div className="relative grid items-stretch gap-5 md:grid-cols-3 md:gap-6">
          {PROCESS.map((item, index) => (
            <article key={item.step} data-service-step={index} className={`relative z-10 overflow-hidden rounded-3xl border transition-[transform,background-color,border-color,box-shadow] duration-700 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none ${activeStep === index ? "scale-[1.045] border-yellow bg-yellow/10 shadow-[0_20px_54px_rgba(254,206,1,.24)]" : "scale-[.98] border-blue/10 bg-white"}`}>
              <div className="relative aspect-[16/10] overflow-hidden 2xl:aspect-[4/3]">
                <Image src={item.image} alt={item.title} fill sizes="(min-width: 1536px) 33vw, (min-width: 768px) 33vw, 100vw" className={`object-cover transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none ${activeStep === index ? "scale-[1.14]" : "scale-100"}`} />
                <span className="absolute left-4 top-4 rounded-full bg-yellow px-3 py-1.5 font-mono text-xs font-bold text-blue">{item.step}</span>
              </div>
              <div className="p-6 md:p-7">
                <h3 className="font-display text-xl font-bold text-blue md:text-2xl">{item.title}</h3>
                <p className="mt-3 leading-7 text-blue/70">{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
