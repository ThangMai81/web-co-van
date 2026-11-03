"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Coach } from "@/data/coaches";
import motionStyles from "./CoachingJourney.module.css";

const STEPS = [
  { number: "01", title: "Gửi yêu cầu với coach bạn chọn", body: "Chia sẻ điều bạn đang cần qua biểu mẫu riêng ngay trên hồ sơ của coach." },
  { number: "02", title: "Xác nhận thông tin và lịch", body: "Sunshine Center liên hệ để làm rõ nhu cầu và thống nhất thời gian, hình thức phù hợp." },
  { number: "03", title: "Bắt đầu phiên coaching 1:1", body: "Bạn và coach thống nhất nội dung, mục tiêu và lịch cho phiên đầu tiên." },
];

const PHOTO_STAGE_MIN_WIDTH = 480;
const JOURNEY_TEXT_MIN_WIDTH = 320;
const PHOTO_STAGE_SIZE = "h-[min(58svh,560px)] min-h-[400px] w-full";
const PHOTO_STAGE_IMAGES = [
  { src: "/images/coaching-request-screen.png", alt: "Giao diện gửi yêu cầu coaching" },
  { src: "/images/coaching-schedule-screen.png", alt: "Giao diện chọn lịch coaching" },
];
const CONFIRMATION_SCREEN_COPY = {
  brand: "Sunshine Center",
  received: "Đã nhận yêu cầu",
  coachPrefix: "Cùng",
  greeting: "Hẹn bạn sớm nhé",
};

function PhoneFrame({ step, coach, active, compact = false, screenImage, confirmationMarkAnimating = false, onConfirmationMarkAnimationEnd }: { step: number; coach: Coach; active: boolean; compact?: boolean; screenImage?: { src: string; alt: string }; confirmationMarkAnimating?: boolean; onConfirmationMarkAnimationEnd?: () => void }) {
  const dimensions = compact ? "h-[260px] w-[164px] max-w-none" : "aspect-[9/16] w-full max-w-[250px]";

  return (
    <div
      className={[
        "relative shrink-0 rounded-[2rem] border-[8px] bg-[#20251f] p-1 shadow-[0_25px_45px_-20px_rgba(24,37,68,.45)] transition-[border-color,opacity] duration-200 ease-out motion-reduce:transition-none",
        dimensions,
        active ? "z-30 border-yellow opacity-100" : "z-10 border-[#20251f] opacity-70",
      ].join(" ")}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[1.45rem] bg-white">
        {step === 0 && (screenImage ? <Image src={screenImage.src} alt={screenImage.alt} fill sizes="220px" className="object-cover" /> : coach.image ? <Image src={coach.image} alt={coach.name} fill sizes="220px" className="object-cover" /> : <div className="flex h-full items-center justify-center bg-[linear-gradient(145deg,#6ca7dc,#172d55)]"><span className="font-display text-5xl font-bold text-white">{coach.initials}</span></div>)}
        {step === 1 && <Image src={screenImage?.src ?? "/images/collaborate_team.jpg"} alt={screenImage?.alt ?? "Những người đồng hành trong hoạt động của Sunshine Center"} fill sizes="220px" className="object-cover" />}
        {step === 2 && (
          <div className="flex h-full flex-col items-center justify-center bg-[#fbfaf6] px-3 text-center">
            <div className={["mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-yellow text-blue shadow-lg shadow-yellow/30", confirmationMarkAnimating ? motionStyles.confirmationCircle : ""].filter(Boolean).join(" ")}>
              <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true"><path d="m6 12.5 4 4 8-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={confirmationMarkAnimating ? motionStyles.confirmationCheck : undefined} onAnimationEnd={onConfirmationMarkAnimationEnd} /></svg>
            </div>
            <span className="font-mono text-[8px] font-bold uppercase tracking-[.16em] text-blue/45">{CONFIRMATION_SCREEN_COPY.brand}</span>
            <strong className="mt-2 font-display text-lg leading-tight text-blue">{CONFIRMATION_SCREEN_COPY.received}</strong>
            <span className="mt-3 rounded-full bg-yellow/20 px-3 py-1.5 text-[9px] font-bold text-blue">{CONFIRMATION_SCREEN_COPY.coachPrefix} {coach.name}</span>
            <div className="mt-6 w-full rounded-full bg-blue px-3 py-2 text-[9px] font-bold uppercase tracking-wider text-white">{CONFIRMATION_SCREEN_COPY.greeting}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function PhotoStage({ coach, activeStep, confirmationMarkAnimating, onConfirmationMarkAnimationEnd }: { coach: Coach; activeStep: number; confirmationMarkAnimating: boolean; onConfirmationMarkAnimationEnd: () => void }) {
  const positions = ["left-[3%] top-[2%]", "left-[38%] top-[2%]", "right-[3%] top-[2%]"];
  const labels = ["Gửi yêu cầu", "Xác nhận lịch", "Phiên 1:1"];
  return (
    <div className={["relative mx-auto max-w-[680px] rounded-[2rem] bg-[radial-gradient(ellipse_at_50%_75%,rgba(255,204,0,.18),transparent_60%)]", PHOTO_STAGE_SIZE].join(" ")}>
      <div className="absolute inset-x-0 top-0 bottom-12">
        {STEPS.map((step, index) => (
          <div
            key={step.number}
            className={[
              "absolute flex h-full w-[23%] max-w-[290px] flex-col items-center",
              positions[index],
              index === activeStep ? "z-30 opacity-100" : "z-10 opacity-70",
            ].join(" ")}
          >
            <PhoneFrame
              step={index}
              coach={coach}
              active={index === activeStep}
              screenImage={PHOTO_STAGE_IMAGES[index]}
              confirmationMarkAnimating={index === 2 && confirmationMarkAnimating}
              onConfirmationMarkAnimationEnd={index === 2 ? onConfirmationMarkAnimationEnd : undefined}
            />
            <span
              className={[
                "relative z-40 mt-4 whitespace-nowrap border-b-2 pb-1 font-mono text-[10px] font-bold uppercase tracking-wider",
                index === activeStep ? "border-yellow text-blue" : "border-transparent text-blue/55",
              ].join(" ")}
            >
              {step.number} · {labels[index]}
            </span>
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 flex h-12 items-center justify-center">
        <div className="whitespace-nowrap rounded-full border border-blue/10 bg-white/90 px-4 py-2 font-mono text-[9px] font-bold uppercase tracking-[.14em] text-blue/70 backdrop-blur">
          Đang xem bước 0{activeStep + 1} / 03
        </div>
      </div>
    </div>
  );
}

export function CoachingJourney({ coach }: { coach: Coach }) {
  const [activeStep, setActiveStep] = useState(0);
  const [wideLayout, setWideLayout] = useState(false);
  const [confirmationMarkAnimating, setConfirmationMarkAnimating] = useState(false);
  const [stickyEligible, setStickyEligible] = useState(false);
  const [stickyTop, setStickyTop] = useState(96);
  const sectionRef = useRef<HTMLElement>(null);
  const layoutRef = useRef<HTMLDivElement>(null);
  const readingColumnRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLParagraphElement>(null);
  const approachRef = useRef<HTMLParagraphElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const activeStepRef = useRef(0);
  const wideLayoutRef = useRef(false);
  const confirmationMarkPlayedRef = useRef(false);

  const transitionToStep = useCallback((index: number) => {
    if (index === activeStepRef.current) return;

    if (index === 2 && wideLayoutRef.current && !confirmationMarkPlayedRef.current) {
      confirmationMarkPlayedRef.current = true;
      setConfirmationMarkAnimating(true);
    } else {
      setConfirmationMarkAnimating(false);
    }

    activeStepRef.current = index;
    setActiveStep(index);
  }, []);

  const finishConfirmationMarkAnimation = () => setConfirmationMarkAnimating(false);

  useEffect(() => {
    const layout = layoutRef.current;
    const readingColumn = readingColumnRef.current;
    const bio = bioRef.current;
    const approach = approachRef.current;
    const stage = stageRef.current;
    if (!layout || !readingColumn || !bio || !approach || !stage) return;
    const compactFrames = Array.from(readingColumn.querySelectorAll<HTMLElement>("[data-compact-phone-frame]"));

    const header = document.querySelector<HTMLElement>("header");
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const measureUnclampedReadingColumnHeight = () => {
      const paragraphs = [bio, approach];
      const previousStyles = paragraphs.map((paragraph) => paragraph.style.cssText);
      const previousFrameDisplays = compactFrames.map((frame) => frame.style.display);
      const previousGridColumn = readingColumn.style.gridColumn;

      try {
        paragraphs.forEach((paragraph) => {
          paragraph.style.display = "block";
          paragraph.style.overflow = "visible";
          paragraph.style.setProperty("-webkit-line-clamp", "unset");
          paragraph.style.setProperty("-webkit-box-orient", "initial");
        });
        compactFrames.forEach((frame) => { frame.style.display = "none"; });
        if (wideLayout) readingColumn.style.gridColumn = "1 / 2";

        return readingColumn.getBoundingClientRect().height;
      } finally {
        paragraphs.forEach((paragraph, index) => {
          paragraph.style.cssText = previousStyles[index];
        });
        compactFrames.forEach((frame, index) => { frame.style.display = previousFrameDisplays[index]; });
        readingColumn.style.gridColumn = previousGridColumn;
      }
    };
    const measure = () => {
      const headerBottom = header?.getBoundingClientRect().bottom ?? 0;
      const nextTop = Math.ceil(Math.max(0, headerBottom) + 16);
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
      const stageBounds = stage.getBoundingClientRect();
      const columnGap = Number.parseFloat(getComputedStyle(layout).columnGap) || 0;
      const textWidth = layout.clientWidth - stageBounds.width - columnGap;
      const nextWideLayout =
        finePointer.matches &&
        !reducedMotion.matches &&
        typeof IntersectionObserver !== "undefined" &&
        stageBounds.width >= PHOTO_STAGE_MIN_WIDTH &&
        textWidth >= JOURNEY_TEXT_MIN_WIDTH;
      wideLayoutRef.current = false;

      if (nextWideLayout !== wideLayout) {
        setStickyEligible(false);
        if (!nextWideLayout) setConfirmationMarkAnimating(false);
        setWideLayout(nextWideLayout);
        return;
      }

      const readingColumnHeight = measureUnclampedReadingColumnHeight();
      const nextEligible =
        nextWideLayout &&
        readingColumnHeight + nextTop + 24 <= viewportHeight &&
        stageBounds.height + nextTop + 24 <= viewportHeight;

      wideLayoutRef.current = nextEligible;
      setStickyTop((current) => (current === nextTop ? current : nextTop));
      setStickyEligible(nextEligible);
    };

    const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    resizeObserver?.observe(layout);
    resizeObserver?.observe(readingColumn);
    resizeObserver?.observe(stage);
    if (header) resizeObserver?.observe(header);
    window.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("resize", measure);
    finePointer.addEventListener("change", measure);
    reducedMotion.addEventListener("change", measure);
    measure();

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("resize", measure);
      finePointer.removeEventListener("change", measure);
      reducedMotion.removeEventListener("change", measure);
    };
  }, [wideLayout, coach.bio, coach.approach]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const steps = Array.from(section.querySelectorAll<HTMLElement>("[data-coaching-step]"));
    if (!steps.length || typeof IntersectionObserver === "undefined") return;

    const visibility = new Map<HTMLElement, boolean>();
    let observer: IntersectionObserver | null = null;
    const observeAtViewportHeight = () => {
      observer?.disconnect();
      visibility.clear();
      const verticalInset = `${window.innerHeight * 0.35}px`;
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => visibility.set(entry.target as HTMLElement, entry.isIntersecting));
        const viewportCenter = window.innerHeight / 2;
        const guidanceTop = window.innerHeight * 0.35;
        const guidanceBottom = window.innerHeight * 0.65;
      const mostVisible = steps
        .map((element) => {
          const bounds = element.getBoundingClientRect();
          const visibleHeight = Math.max(0, Math.min(bounds.bottom, guidanceBottom) - Math.max(bounds.top, guidanceTop));
          return {
            element,
            ratio: bounds.height > 0 ? visibleHeight / bounds.height : 0,
            distance: Math.abs((bounds.top + bounds.bottom) / 2 - viewportCenter),
            isIntersecting: visibility.get(element) ?? false,
          };
        })
        .filter((item) => item.isIntersecting && item.ratio > 0)
        .sort((left, right) => right.ratio - left.ratio || left.distance - right.distance)[0];
        if (!mostVisible) return;

        const nextStep = Number(mostVisible.element.dataset.coachingStep);
        if (nextStep === activeStepRef.current) return;
        transitionToStep(nextStep);
      }, { rootMargin: `-${verticalInset} 0px -${verticalInset} 0px`, threshold: [0, 0.25, 0.5, 0.75, 1] });
      steps.forEach((step) => observer?.observe(step));
    };

    observeAtViewportHeight();
    window.addEventListener("resize", observeAtViewportHeight);
    window.visualViewport?.addEventListener("resize", observeAtViewportHeight);

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", observeAtViewportHeight);
      window.visualViewport?.removeEventListener("resize", observeAtViewportHeight);
    };
  }, [transitionToStep]);

  const activateStep = (index: number) => {
    transitionToStep(index);
  };

  return (
    <section ref={sectionRef} className="relative flex min-h-[calc(100svh-80px)] scroll-mt-20 items-center bg-[#fffaf2] px-6 py-6 md:py-8 xl:px-8 xl:py-3">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-28 top-20 h-96 w-96 rounded-full bg-yellow/10 blur-3xl" />
      </div>
      <div
        ref={layoutRef}
        className={[
          "relative mx-auto w-full max-w-[var(--page-w)] gap-8 xl:gap-10",
          wideLayout ? "grid min-h-[calc(100svh-9rem)] grid-cols-[.8fr_1.2fr] items-start content-start xl:min-h-[calc(100svh-6.5rem)]" : "",
        ].join(" ")}
      >
        <div ref={readingColumnRef} className={["relative z-10 min-w-0", wideLayout && !stickyEligible ? "col-span-2" : ""].join(" ")}>
          <p className="font-mono text-sm font-bold uppercase tracking-[.17em] text-yellow">Phiên coaching 1:1 cùng {coach.name}</p>
          <h2 className="mt-3 max-w-xl font-display text-3xl font-bold leading-tight text-blue md:text-4xl xl:text-4xl">Một không gian riêng dành cho bạn</h2>
          <p ref={bioRef} className={["mt-3 max-w-xl leading-6 text-blue/70 md:leading-7 xl:mt-2", stickyEligible ? "md:pointer-fine:motion-safe:line-clamp-3 xl:pointer-fine:motion-safe:line-clamp-2" : ""].join(" ")}>{coach.bio}</p>
          <p ref={approachRef} className={["mt-2 max-w-xl text-sm leading-6 text-blue/65 md:text-base xl:mt-1", stickyEligible ? "md:pointer-fine:motion-safe:line-clamp-2 xl:pointer-fine:motion-safe:line-clamp-1" : ""].join(" ")}>{coach.approach}</p>
          <div className="mt-3 flex flex-wrap gap-2 xl:mt-2">
            {coach.focusAreas.map((area) => <span key={area} className="rounded-full bg-yellow/20 px-3 py-1.5 text-[11px] font-bold text-blue">{area}</span>)}
          </div>

          <div className="mt-4 space-y-2 xl:mt-3 xl:space-y-1.5">
            {STEPS.map((step, index) => {
              const isActive = activeStep === index;
              const imageDescription = PHOTO_STAGE_IMAGES[index]?.alt ?? (index === 2
                ? `${CONFIRMATION_SCREEN_COPY.brand}. ${CONFIRMATION_SCREEN_COPY.received}. ${CONFIRMATION_SCREEN_COPY.coachPrefix} ${coach.name}. ${CONFIRMATION_SCREEN_COPY.greeting}.`
                : null);
              return (
                <article
                  key={step.number}
                  data-coaching-step={index}
                  className={[
                    "rounded-2xl transition-[background-color,border-color,box-shadow] duration-200 motion-reduce:transition-none",
                    isActive ? "border-2 border-yellow bg-yellow/15 shadow-md shadow-yellow/10" : "border border-blue/10 bg-white/70",
                  ].join(" ")}
                >
                  <button
                    type="button"
                    onClick={() => activateStep(index)}
                    onFocus={() => activateStep(index)}
                    aria-pressed={isActive}
                    className="flex w-full items-start gap-4 p-3.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow md:p-4 xl:gap-3 xl:p-2.5"
                  >
                    <span className={["flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold", isActive ? "bg-yellow text-blue" : "bg-blue/5 text-blue/45"].join(" ")}>
                      {step.number}
                    </span>
                    <span>
                      <span className={["block font-display text-base font-bold md:text-lg xl:text-base", isActive ? "text-blue" : "text-blue/65"].join(" ")}>{step.title}</span>
                      <span className="mt-1 block text-xs leading-5 text-blue/65 md:text-sm xl:text-sm xl:leading-5 xl:line-clamp-2">{step.body}</span>
                    </span>
                  </button>
                  {stickyEligible && isActive && imageDescription && <span className="sr-only">{imageDescription}</span>}
                  <div className="mx-4 mb-2 h-1 overflow-hidden rounded-full bg-blue/10">
                    <div className={["h-full rounded-full bg-yellow transition-[width] duration-200 motion-reduce:transition-none", isActive ? "w-full" : "w-0"].join(" ")} />
                  </div>
                  <div data-compact-phone-frame="true" className={stickyEligible ? "hidden pb-3" : "pb-3"}>
                    <div className="mx-auto flex justify-center">
                      <PhoneFrame step={index} coach={coach} active={isActive} compact />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div
          ref={stageRef}
          aria-hidden="true"
          className={
            wideLayout
              ? stickyEligible
                ? "sticky col-start-2 row-start-1 row-span-2 h-fit w-full self-start"
                : "invisible pointer-events-none absolute right-0 top-0 w-[calc(60%_-_1.2rem)] xl:w-[calc(60%_-_1.5rem)]"
              : "invisible pointer-events-none absolute right-0 top-0 w-[calc(60%_-_1.2rem)] xl:w-[calc(60%_-_1.5rem)]"
          }
          style={stickyEligible ? { top: stickyTop } : undefined}
        >
          {stickyEligible
            ? <PhotoStage coach={coach} activeStep={activeStep} confirmationMarkAnimating={confirmationMarkAnimating} onConfirmationMarkAnimationEnd={finishConfirmationMarkAnimation} />
            : <div className={["mx-auto max-w-[680px] rounded-[2rem] bg-transparent", PHOTO_STAGE_SIZE].join(" ")} />}
        </div>
        {stickyEligible && <div aria-hidden="true" className="col-start-1 row-start-2 h-24" />}
      </div>
    </section>
  );
}
