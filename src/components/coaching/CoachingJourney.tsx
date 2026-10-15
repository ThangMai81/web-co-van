"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Coach } from "@/data/coaches";

const STEPS = [
  { number: "01", title: "Gửi yêu cầu với coach bạn chọn", body: "Chia sẻ điều bạn đang cần qua biểu mẫu riêng ngay trên hồ sơ của coach." },
  { number: "02", title: "Xác nhận thông tin và lịch", body: "Sunshine Center liên hệ để làm rõ nhu cầu và thống nhất thời gian, hình thức phù hợp." },
  { number: "03", title: "Bắt đầu phiên coaching 1:1", body: "Bạn và coach thống nhất nội dung, mục tiêu và lịch cho phiên đầu tiên." },
];

function PhoneFrame({ step, coach, active, compact = false }: { step: number; coach: Coach; active: boolean; compact?: boolean }) {
  const tilt = step === 0 ? "-rotate-[7deg]" : step === 1 ? "rotate-0" : "rotate-[7deg]";
  const dimensions = compact ? "h-[260px] w-[164px] max-w-none" : "h-[min(48svh,460px)] w-full max-w-[260px]";

  return (
    <div className={`relative ${dimensions} shrink-0 rounded-[2rem] border-[8px] border-[#20251f] bg-[#20251f] p-1 shadow-[0_25px_45px_-20px_rgba(24,37,68,.45)] transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${tilt} ${active ? "z-30 scale-110 opacity-100" : "z-10 scale-[.88] opacity-60"}`}>
      <div className="relative h-full w-full overflow-hidden rounded-[1.45rem] bg-white">
        {step === 0 && (coach.image ? <Image src={coach.image} alt={coach.name} fill sizes="220px" className="object-cover" /> : <div className="flex h-full items-center justify-center bg-[linear-gradient(145deg,#6ca7dc,#172d55)]"><span className="font-display text-5xl font-bold text-white">{coach.initials}</span></div>)}
        {step === 1 && <Image src="/images/collaborate_team.jpg" alt="Những người đồng hành trong hoạt động của Sunshine Center" fill sizes="220px" className="object-cover" />}
        {step === 2 && (
          <div className="flex h-full flex-col items-center justify-center bg-[#fbfaf6] px-3 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-yellow text-blue shadow-lg shadow-yellow/30">
              <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true"><path d="m6 12.5 4 4 8-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <span className="font-mono text-[8px] font-bold uppercase tracking-[.16em] text-blue/45">Sunshine Center</span>
            <strong className="mt-2 font-display text-lg leading-tight text-blue">Đã nhận yêu cầu</strong>
            <span className="mt-3 rounded-full bg-yellow/20 px-3 py-1.5 text-[9px] font-bold text-blue">Cùng {coach.name}</span>
            <div className="mt-6 w-full rounded-full bg-blue px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-white">Hẹn bạn sớm nhé</div>
          </div>
        )}
      </div>
    </div>
  );
}

function PhotoStage({ coach, activeStep }: { coach: Coach; activeStep: number }) {
  const positions = ["left-[1%] top-[6%]", "left-[35%] top-[1%]", "right-[1%] top-[9%]"];
  const labels = ["Gửi yêu cầu", "Xác nhận lịch", "Phiên 1:1"];

  return (
    <div className="relative mx-auto h-[min(58svh,560px)] min-h-[400px] w-full max-w-[940px] rounded-[2rem] bg-[radial-gradient(ellipse_at_50%_75%,rgba(255,204,0,.22),transparent_60%)]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-8 left-[1%] w-[30%] rounded-[3rem] bg-yellow/20 shadow-[0_20px_80px_rgba(255,204,0,.2)] transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)]" style={{ transform: `translateX(${activeStep * 115}%)` }} />
      {STEPS.map((step, index) => (
        <div key={step.number} className={`absolute ${positions[index]} flex h-full w-[30%] max-w-[290px] flex-col items-center transition-all duration-700 ease-[cubic-bezier(.22,1,.36,1)] ${index === activeStep ? "-translate-y-3" : "translate-y-2"}`}>
          <PhoneFrame step={index} coach={coach} active={index === activeStep} />
          <span className={`mt-3 whitespace-nowrap font-mono text-[10px] font-bold uppercase tracking-wider ${index === activeStep ? "text-blue" : "text-blue/40"}`}>{step.number} · {labels[index]}</span>
        </div>
      ))}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-blue/10 bg-white/85 px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-[.14em] text-blue/60 backdrop-blur">
        Đang xem bước 0{activeStep + 1} / 03
      </div>
    </div>
  );
}

export function CoachingJourney({ coach }: { coach: Coach }) {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const activeStepRef = useRef(0);

  useEffect(() => {
    activeStepRef.current = activeStep;
  }, [activeStep]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const desktopQuery = window.matchMedia("(min-width: 1280px) and (min-height: 720px)");
    let wheelLocked = false;
    let unlockTimer: number | undefined;
    let observer: IntersectionObserver | undefined;

    const syncResponsiveHighlight = () => {
      observer?.disconnect();
      observer = undefined;
      if (desktopQuery.matches) return;

      observer = new IntersectionObserver((entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];
        if (!visible) return;
        const nextStep = Number((visible.target as HTMLElement).dataset.coachingStep);
        activeStepRef.current = nextStep;
        setActiveStep(nextStep);
      }, { rootMargin: "-35% 0px -35% 0px", threshold: [0, 0.25, 0.5] });
      section.querySelectorAll<HTMLElement>("[data-coaching-step]").forEach((card) => observer?.observe(card));
    };

    const advanceStep = (event: WheelEvent) => {
      if (!desktopQuery.matches || Math.abs(event.deltaY) < 8) return;
      const bounds = section.getBoundingClientRect();
      const stickyTop = 80;
      if (wheelLocked) {
        event.preventDefault();
        return;
      }

      const enteringFromAbove = event.deltaY > 0
        && bounds.top > stickyTop + 32
        && bounds.top < window.innerHeight * 0.9
        && bounds.bottom > window.innerHeight * 0.3;
      const enteringFromBelow = event.deltaY < 0
        && bounds.top < -32
        && bounds.bottom < window.innerHeight - 32
        && bounds.bottom > window.innerHeight * 0.1;
      if (enteringFromAbove || enteringFromBelow) {
        event.preventDefault();
        wheelLocked = true;
        window.scrollTo({ top: window.scrollY + bounds.top - stickyTop, behavior: "smooth" });
        window.clearTimeout(unlockTimer);
        unlockTimer = window.setTimeout(() => { wheelLocked = false; }, 700);
        return;
      }

      const isCentered = bounds.top >= stickyTop - 32 && bounds.top <= stickyTop + 32;
      if (!isCentered) return;
      const direction = event.deltaY > 0 ? 1 : -1;
      const target = Math.min(STEPS.length - 1, Math.max(0, activeStepRef.current + direction));
      if (target === activeStepRef.current) return;
      event.preventDefault();
      wheelLocked = true;
      activeStepRef.current = target;
      setActiveStep(target);
      window.clearTimeout(unlockTimer);
      unlockTimer = window.setTimeout(() => { wheelLocked = false; }, 650);
    };

    syncResponsiveHighlight();
    window.addEventListener("wheel", advanceStep, { passive: false, capture: true });
    desktopQuery.addEventListener("change", syncResponsiveHighlight);
    return () => {
      window.removeEventListener("wheel", advanceStep, true);
      desktopQuery.removeEventListener("change", syncResponsiveHighlight);
      window.clearTimeout(unlockTimer);
      observer?.disconnect();
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative flex min-h-[calc(100svh-80px)] scroll-mt-20 items-center overflow-hidden bg-[#fffaf2] px-6 py-6 md:py-8 xl:px-8 xl:py-3">
      <div className="pointer-events-none absolute -right-28 top-20 h-96 w-96 rounded-full bg-yellow/10 blur-3xl" />
      <div className="relative mx-auto grid w-full max-w-[var(--page-w)] items-center gap-8 xl:grid-cols-[.8fr_1.2fr] xl:gap-10">
        <div className="relative z-10">
          <p className="font-mono text-xs font-bold uppercase tracking-[.17em] text-yellow">Phiên coaching 1:1 cùng {coach.name}</p>
          <h2 className="mt-3 max-w-xl font-display text-3xl font-bold leading-tight text-blue md:text-4xl xl:text-4xl">Một không gian riêng dành cho bạn</h2>
          <p className="mt-3 max-w-xl leading-6 text-blue/70 md:leading-7 line-clamp-3 xl:mt-2 xl:line-clamp-2">{coach.bio}</p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-blue/65 line-clamp-2 md:text-base xl:mt-1 xl:line-clamp-1">{coach.approach}</p>
          <div className="mt-3 flex flex-wrap gap-2 xl:mt-2">
            {coach.focusAreas.map((area) => <span key={area} className="rounded-full bg-yellow/20 px-3 py-1.5 text-[11px] font-bold text-blue">{area}</span>)}
          </div>

          <div className="mt-4 space-y-2 xl:mt-3 xl:space-y-1.5">
            {STEPS.map((step, index) => (
              <article key={step.number} data-coaching-step={index} className={`rounded-2xl border transition-all duration-300 ${activeStep === index ? "border-yellow bg-yellow/15 shadow-md shadow-yellow/10" : "border-blue/10 bg-white/70"}`}>
                <button type="button" onClick={() => { activeStepRef.current = index; setActiveStep(index); }} onFocus={() => { activeStepRef.current = index; setActiveStep(index); }} aria-pressed={activeStep === index} className="flex w-full items-start gap-4 p-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow md:p-4 xl:gap-3 xl:p-2.5">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold transition ${activeStep === index ? "bg-yellow text-blue" : "bg-blue/5 text-blue/45"}`}>{step.number}</span>
                  <span>
                    <span className={`block font-display text-base font-bold md:text-lg xl:text-base ${activeStep === index ? "text-blue" : "text-blue/65"}`}>{step.title}</span>
                    <span className="mt-1 block text-xs leading-5 text-blue/65 md:text-sm xl:text-sm xl:leading-5 xl:line-clamp-2">{step.body}</span>
                  </span>
                </button>
                <div className="mx-4 mb-2 h-1 overflow-hidden rounded-full bg-blue/10 xl:mb-2">
                  <div className={`h-full rounded-full bg-yellow transition-all duration-500 ${activeStep === index ? "w-full" : "w-0"}`} />
                </div>
                <div className="pb-3 xl:hidden"><div className="mx-auto flex justify-center"><PhoneFrame step={index} coach={coach} active={activeStep === index} compact /></div></div>
              </article>
            ))}
          </div>
        </div>

        <div className="hidden xl:block">
          <PhotoStage coach={coach} activeStep={activeStep} />
        </div>
      </div>
    </section>
  );
}
