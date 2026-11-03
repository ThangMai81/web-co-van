"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type TransitionEvent,
} from "react";
import styles from "./Process.module.css";

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

const PROCESS_STAGE_MIN_WIDTH = 420;
const PROCESS_TEXT_MIN_WIDTH = 320;

type ProcessStageSlotIndex = 0 | 1;
type ProcessStageSlot = { step: number | null; revision: number };
type ProcessStagePhase =
  | "idle"
  | "stabilizing"
  | "loading"
  | "static-loading"
  | "preparing"
  | "transitioning";
type ProcessStageLayerState = "current" | "preloading" | "incoming" | "outgoing" | "inactive";

function otherStageSlot(slot: ProcessStageSlotIndex): ProcessStageSlotIndex {
  return slot === 0 ? 1 : 0;
}

function ProcessStageLayer({
  item,
  state,
  motionEnabled,
  eagerLoad,
  onImageLoad,
  onImageError,
  onTransitionEnd,
  onTransitionCancel,
}: {
  item: (typeof PROCESS)[number] | null;
  state: ProcessStageLayerState;
  motionEnabled: boolean;
  eagerLoad: boolean;
  onImageLoad?: () => void;
  onImageError?: () => void;
  onTransitionEnd?: (event: TransitionEvent<HTMLDivElement>) => void;
  onTransitionCancel?: (event: TransitionEvent<HTMLDivElement>) => void;
}) {
  return (
    <div
      className={`${styles.layer} ${styles[state]} ${motionEnabled ? styles.motionEnabled : ""}`}
      onTransitionEnd={onTransitionEnd}
      onTransitionCancel={onTransitionCancel}
    >
      {item && (
        <>
          <Image
            src={item.image}
            alt=""
            fill
            sizes="(min-width: 1280px) 40vw, 45vw"
            className="object-cover"
            loading={eagerLoad ? "eager" : undefined}
            onLoad={onImageLoad}
            onError={onImageError}
          />
          <span className="absolute left-4 top-4 rounded-full bg-yellow px-3 py-1.5 font-mono text-xs font-bold text-blue">
            {item.step}
          </span>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-blue/85 via-blue/45 to-transparent px-6 pb-6 pt-16">
            <p className="max-w-lg font-display text-2xl font-bold leading-tight text-white md:text-3xl">
              {item.title}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function ProcessStage({
  activeStep,
  transitionEligible,
}: {
  activeStep: number;
  transitionEligible: boolean;
}) {
  const [slots, setSlots] = useState<[ProcessStageSlot, ProcessStageSlot]>(() => [
    { step: activeStep, revision: 0 },
    { step: null, revision: 0 },
  ]);
  const [currentSlot, setCurrentSlot] = useState<ProcessStageSlotIndex>(0);
  const [incomingSlot, setIncomingSlot] = useState<ProcessStageSlotIndex | null>(null);
  const [transitionStarted, setTransitionStarted] = useState(false);
  const [motionTransitionEnabled, setMotionTransitionEnabled] = useState(false);
  const slotsRef = useRef(slots);
  const currentSlotRef = useRef<ProcessStageSlotIndex>(0);
  const incomingSlotRef = useRef<ProcessStageSlotIndex | null>(null);
  const readyRevisionsRef = useRef<[number | null, number | null]>([null, null]);
  const failedRevisionsRef = useRef<[number | null, number | null]>([null, null]);
  const phaseRef = useRef<ProcessStagePhase>("idle");
  const previousActiveStepRef = useRef(activeStep);
  const latestActiveStepRef = useRef(activeStep);
  const previousEligibilityRef = useRef(transitionEligible);
  const transitionEligibleRef = useRef(transitionEligible);
  const suppressNextTransitionRef = useRef(false);
  const generationRef = useRef(0);
  const stabilityTimerRef = useRef<number | null>(null);
  const firstFrameRef = useRef<number | null>(null);
  const secondFrameRef = useRef<number | null>(null);

  const clearPendingWork = useCallback(() => {
    if (stabilityTimerRef.current !== null) {
      window.clearTimeout(stabilityTimerRef.current);
      stabilityTimerRef.current = null;
    }
    if (firstFrameRef.current !== null) {
      window.cancelAnimationFrame(firstFrameRef.current);
      firstFrameRef.current = null;
    }
    if (secondFrameRef.current !== null) {
      window.cancelAnimationFrame(secondFrameRef.current);
      secondFrameRef.current = null;
    }
    generationRef.current += 1;
    phaseRef.current = "idle";
  }, []);

  const clearIncoming = useCallback(() => {
    incomingSlotRef.current = null;
    setIncomingSlot(null);
    setTransitionStarted(false);
  }, []);

  const promoteSlot = useCallback((slot: ProcessStageSlotIndex) => {
    currentSlotRef.current = slot;
    setCurrentSlot(slot);
    incomingSlotRef.current = null;
    setIncomingSlot(null);
    setTransitionStarted(false);
    setMotionTransitionEnabled(false);
    phaseRef.current = "idle";
    suppressNextTransitionRef.current = false;
  }, []);

  const setSlotStep = useCallback((slot: ProcessStageSlotIndex, step: number) => {
    const current = slotsRef.current[slot];
    if (current.step === step) return current.revision;

    const next: [ProcessStageSlot, ProcessStageSlot] = [
      slotsRef.current[0],
      slotsRef.current[1],
    ];
    next[slot] = { step, revision: current.revision + 1 };
    slotsRef.current = next;
    readyRevisionsRef.current[slot] = null;
    failedRevisionsRef.current[slot] = null;
    setSlots(next);
    return next[slot].revision;
  }, []);

  const canRunTransition = useCallback(() => {
    if (
      !transitionEligibleRef.current ||
      typeof window.matchMedia !== "function" ||
      typeof window.requestAnimationFrame !== "function" ||
      typeof window.setTimeout !== "function" ||
      typeof CSS === "undefined" ||
      typeof CSS.supports !== "function"
    ) {
      return false;
    }

    try {
      if (!window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) {
        return false;
      }
      return (
        CSS.supports("transition", "opacity 180ms ease-out") &&
        CSS.supports("transform", "translateX(4px)")
      );
    } catch {
      return false;
    }
  }, []);

  const showStaticallyWhenReady = useCallback((step: number) => {
    clearPendingWork();
    setMotionTransitionEnabled(false);
    const current = currentSlotRef.current;
    const pending = incomingSlotRef.current;
    const currentSelection = slotsRef.current[current];

    if (currentSelection.step === step) {
      clearIncoming();
      suppressNextTransitionRef.current = false;
      return;
    }

    if (pending !== null) {
      const pendingSelection = slotsRef.current[pending];
      if (
        pendingSelection.step === step &&
        readyRevisionsRef.current[pending] === pendingSelection.revision
      ) {
        promoteSlot(pending);
        return;
      }
    }

    const targetSlot = pending ?? otherStageSlot(current);
    const revision = setSlotStep(targetSlot, step);
    incomingSlotRef.current = targetSlot;
    setIncomingSlot(targetSlot);
    setTransitionStarted(false);
    phaseRef.current = "static-loading";
    suppressNextTransitionRef.current = false;

    if (readyRevisionsRef.current[targetSlot] === revision) promoteSlot(targetSlot);
    else if (failedRevisionsRef.current[targetSlot] === revision) {
      phaseRef.current = "idle";
      clearIncoming();
    }
  }, [clearIncoming, clearPendingWork, promoteSlot, setMotionTransitionEnabled, setSlotStep]);

  const startIncomingTransition = useCallback((
    slot: ProcessStageSlotIndex,
    step: number,
    revision: number,
  ) => {
    const selected = slotsRef.current[slot];
    if (
      phaseRef.current !== "loading" ||
      incomingSlotRef.current !== slot ||
      selected.step !== step ||
      selected.revision !== revision ||
      latestActiveStepRef.current !== step
    ) {
      return;
    }

    if (!canRunTransition() || suppressNextTransitionRef.current) {
      promoteSlot(slot);
      return;
    }

    const generation = generationRef.current;
    phaseRef.current = "preparing";
    const beginTransition = () => {
      if (
        generationRef.current !== generation ||
        phaseRef.current !== "preparing" ||
        incomingSlotRef.current !== slot ||
        latestActiveStepRef.current !== step
      ) {
        return;
      }
      if (!canRunTransition()) {
        promoteSlot(slot);
        return;
      }

      phaseRef.current = "transitioning";
      setTransitionStarted(true);
    };

    try {
      firstFrameRef.current = window.requestAnimationFrame(() => {
        firstFrameRef.current = null;
        if (generationRef.current !== generation) return;
        try {
          secondFrameRef.current = window.requestAnimationFrame(() => {
            secondFrameRef.current = null;
            beginTransition();
          });
        } catch {
          showStaticallyWhenReady(latestActiveStepRef.current);
        }
      });
    } catch {
      showStaticallyWhenReady(latestActiveStepRef.current);
    }
  }, [canRunTransition, promoteSlot, showStaticallyWhenReady]);

  const handleSlotImageLoad = useCallback((
    slot: ProcessStageSlotIndex,
    step: number,
    revision: number,
  ) => {
    const selected = slotsRef.current[slot];
    if (selected.step !== step || selected.revision !== revision) return;
    readyRevisionsRef.current[slot] = revision;
    failedRevisionsRef.current[slot] = null;

    if (incomingSlotRef.current !== slot || latestActiveStepRef.current !== step) return;
    if (phaseRef.current === "static-loading") {
      promoteSlot(slot);
      return;
    }
    if (phaseRef.current === "loading") startIncomingTransition(slot, step, revision);
  }, [promoteSlot, startIncomingTransition]);

  const handleSlotImageError = useCallback((
    slot: ProcessStageSlotIndex,
    step: number,
    revision: number,
  ) => {
    const selected = slotsRef.current[slot];
    if (
      selected.step !== step ||
      selected.revision !== revision
    ) {
      return;
    }
    failedRevisionsRef.current[slot] = revision;
    if (incomingSlotRef.current !== slot) return;
    if (latestActiveStepRef.current === step) {
      clearPendingWork();
      setMotionTransitionEnabled(false);
      suppressNextTransitionRef.current = false;
      clearIncoming();
    } else {
      showStaticallyWhenReady(latestActiveStepRef.current);
    }
  }, [clearIncoming, clearPendingWork, setMotionTransitionEnabled, showStaticallyWhenReady]);

  const scheduleStableSelection = useCallback((step: number, allowTransition: boolean) => {
    clearPendingWork();
    clearIncoming();
    setMotionTransitionEnabled(false);
    if (slotsRef.current[currentSlotRef.current].step === step) {
      suppressNextTransitionRef.current = false;
      return;
    }
    if (typeof window.setTimeout !== "function") {
      showStaticallyWhenReady(step);
      return;
    }

    phaseRef.current = "stabilizing";
    const generation = generationRef.current;
    stabilityTimerRef.current = window.setTimeout(() => {
      stabilityTimerRef.current = null;
      if (generationRef.current !== generation) return;

      const latestStep = latestActiveStepRef.current;
      if (!transitionEligibleRef.current) {
        showStaticallyWhenReady(latestStep);
        return;
      }
      if (slotsRef.current[currentSlotRef.current].step === latestStep) {
        phaseRef.current = "idle";
        suppressNextTransitionRef.current = false;
        return;
      }

      const targetSlot = otherStageSlot(currentSlotRef.current);
      const revision = setSlotStep(targetSlot, latestStep);
      incomingSlotRef.current = targetSlot;
      setIncomingSlot(targetSlot);
      setTransitionStarted(false);

      const shouldAnimate =
        allowTransition &&
        !suppressNextTransitionRef.current &&
        canRunTransition();
      setMotionTransitionEnabled(shouldAnimate);
      phaseRef.current = shouldAnimate ? "loading" : "static-loading";
      if (readyRevisionsRef.current[targetSlot] === revision) {
        if (shouldAnimate) startIncomingTransition(targetSlot, latestStep, revision);
        else promoteSlot(targetSlot);
      } else if (failedRevisionsRef.current[targetSlot] === revision) {
        phaseRef.current = "idle";
        clearIncoming();
      }
    }, 80);
  }, [
    canRunTransition,
    clearIncoming,
    clearPendingWork,
    promoteSlot,
    setSlotStep,
    showStaticallyWhenReady,
    startIncomingTransition,
    setMotionTransitionEnabled,
  ]);

  useLayoutEffect(() => {
    const previousStep = previousActiveStepRef.current;
    const wasEligible = previousEligibilityRef.current;
    latestActiveStepRef.current = activeStep;
    transitionEligibleRef.current = transitionEligible;
    previousActiveStepRef.current = activeStep;
    previousEligibilityRef.current = transitionEligible;

    if (!transitionEligible || !wasEligible) {
      showStaticallyWhenReady(activeStep);
      return;
    }
    if (previousStep === activeStep) return;

    if (!canRunTransition()) {
      showStaticallyWhenReady(activeStep);
      return;
    }

    if (phaseRef.current === "transitioning") {
      scheduleStableSelection(activeStep, false);
      return;
    }

    scheduleStableSelection(activeStep, true);
  }, [
    activeStep,
    transitionEligible,
    canRunTransition,
    scheduleStableSelection,
    showStaticallyWhenReady,
  ]);

  useEffect(() => () => clearPendingWork(), [clearPendingWork]);

  const handleTransitionEnd = useCallback((event: TransitionEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || event.propertyName !== "opacity") return;
    if (phaseRef.current !== "transitioning") return;

    const slot = incomingSlotRef.current;
    if (slot === null) return;
    const step = slotsRef.current[slot].step;
    if (step === null) return;

    clearPendingWork();
    if (latestActiveStepRef.current === step) promoteSlot(slot);
    else showStaticallyWhenReady(latestActiveStepRef.current);
  }, [clearPendingWork, promoteSlot, showStaticallyWhenReady]);

  const renderSlot = (slot: ProcessStageSlotIndex) => {
    const selected = slots[slot];
    const isCurrent = currentSlot === slot;
    const isIncoming = incomingSlot === slot;
    const state: ProcessStageLayerState = isCurrent
      ? transitionStarted ? "outgoing" : "current"
      : isIncoming
        ? transitionStarted ? "incoming" : "preloading"
        : "inactive";
    const item = selected.step === null ? null : PROCESS[selected.step];

    return (
      <ProcessStageLayer
        key={slot}
        item={item}
        state={state}
        motionEnabled={motionTransitionEnabled}
        eagerLoad={state === "preloading" || (state === "current" && transitionEligible)}
        onImageLoad={item ? () => handleSlotImageLoad(slot, selected.step!, selected.revision) : undefined}
        onImageError={item ? () => handleSlotImageError(slot, selected.step!, selected.revision) : undefined}
        onTransitionEnd={isIncoming && transitionStarted ? handleTransitionEnd : undefined}
        onTransitionCancel={isIncoming && transitionStarted ? handleTransitionEnd : undefined}
      />
    );
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-blue/10 bg-white shadow-[0_24px_64px_rgba(24,37,68,.12)]">
      <div className={`relative aspect-[4/3] ${styles.canvas}`}>
        {renderSlot(0)}
        {renderSlot(1)}
      </div>
    </div>
  );
}

export function Process() {
  const [activeStep, setActiveStep] = useState(0);
  const [wideLayout, setWideLayout] = useState(false);
  const [stickyEligible, setStickyEligible] = useState(false);
  const [stickyTop, setStickyTop] = useState(96);
  const activeStepRef = useRef(0);
  const sectionRef = useRef<HTMLElement>(null);
  const layoutRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layout = layoutRef.current;
    const heading = headingRef.current;
    const steps = stepsRef.current;
    const stage = stageRef.current;
    if (!layout || !heading || !steps || !stage) return;

    const header = document.querySelector<HTMLElement>("header");
    const finePointer = window.matchMedia("(pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
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
        stageBounds.width >= PROCESS_STAGE_MIN_WIDTH &&
        textWidth >= PROCESS_TEXT_MIN_WIDTH;

      if (nextWideLayout !== wideLayout) {
        setStickyEligible(false);
        setWideLayout(nextWideLayout);
        return;
      }

      const previousGridColumn = steps.style.gridColumn;
      if (nextWideLayout) steps.style.gridColumn = "1 / 2";
      const headingBounds = heading.getBoundingClientRect();
      const stepsBounds = steps.getBoundingClientRect();
      steps.style.gridColumn = previousGridColumn;
      const readingColumnHeight = Math.max(0, stepsBounds.bottom - headingBounds.top);
      const nextEligible =
        nextWideLayout &&
        readingColumnHeight + nextTop + 24 <= viewportHeight &&
        stageBounds.height + nextTop + 24 <= viewportHeight;

      setStickyTop((current) => (current === nextTop ? current : nextTop));
      setStickyEligible((current) => {
        if (current === nextEligible) return current;
        return nextEligible;
      });
    };

    const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(measure);
    resizeObserver?.observe(layout);
    resizeObserver?.observe(heading);
    resizeObserver?.observe(steps);
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
  }, [wideLayout]);

  useEffect(() => {
    const layout = layoutRef.current;
    if (!layout || typeof IntersectionObserver === "undefined") return;
    const steps = Array.from(layout.querySelectorAll<HTMLElement>("[data-service-step]"));
    if (!steps.length) return;
    const section = sectionRef.current;
    if (!section) return;

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

        const nextStep = Number(mostVisible.element.dataset.serviceStep);
        if (nextStep === activeStepRef.current) return;
        activeStepRef.current = nextStep;
        setActiveStep(nextStep);
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
  }, []);

  const activateStep = (index: number) => {
    activeStepRef.current = index;
    setActiveStep(index);
  };

  return (
    <section ref={sectionRef} id="process" className="relative flex min-h-[calc(100svh-5rem)] scroll-mt-20 items-center bg-white px-6 py-14 md:py-16 xl:px-8">
      <div
        ref={layoutRef}
        className={[
          "relative mx-auto w-full max-w-[var(--page-w)] gap-x-8 xl:gap-x-10",
          wideLayout ? "grid md:min-h-[calc(100svh-13rem)] grid-cols-2 grid-rows-[auto_auto] content-start gap-y-8" : "",
        ].join(" ")}
      >
        <div ref={headingRef} className={wideLayout ? "col-span-2 max-w-2xl" : "mb-8 max-w-2xl md:mb-10"}>
          <p className="mb-3 font-mono text-sm font-bold uppercase tracking-[.18em] text-yellow">Từng bước rõ ràng</p>
          <h2 className="font-display text-3xl font-bold text-blue md:text-5xl">Quy trình đồng hành</h2>
          <p className="mt-4 max-w-xl leading-7 text-blue/70">Bạn đã chọn người muốn gặp? Gửi lời nhắn từ hồ sơ của họ, rồi Sunshine Center sẽ hỗ trợ thống nhất lịch cho phiên đầu tiên.</p>
        </div>

        <div
          ref={stepsRef}
          className={[
            "grid items-stretch",
            wideLayout ? ["col-start-1 row-start-2 min-w-0 grid-cols-1 gap-3", !stickyEligible ? "col-span-2" : ""].join(" ") : "gap-5 md:grid-cols-3 md:gap-6",
          ].join(" ")}
        >
          {PROCESS.map((item, index) => {
            const isActive = activeStep === index;
            return (
              <article
                key={item.step}
                data-service-step={index}
                onMouseEnter={() => activateStep(index)}
                onPointerDown={(event) => { if (event.pointerType === "touch") activateStep(index); }}
                onFocusCapture={() => activateStep(index)}
                onClick={() => activateStep(index)}
                className={[
                  "relative z-10 overflow-hidden rounded-3xl transition-[background-color,border-color,box-shadow] duration-200 ease-out motion-reduce:transition-none",
                  wideLayout ? "grid grid-cols-[112px_minmax(0,1fr)] items-stretch" : "",
                  isActive ? "border-2 border-yellow bg-yellow/10 shadow-[0_14px_38px_rgba(254,206,1,.2)]" : "border border-blue/10 bg-white",
                ].join(" ")}
              >
                <div className={["relative overflow-hidden", wideLayout ? "min-h-[132px]" : "aspect-[16/10] 2xl:aspect-[4/3]"].join(" ")}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes={wideLayout ? "112px" : "(min-width: 1536px) 33vw, (min-width: 768px) 33vw, 100vw"}
                    className="object-cover"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-yellow px-2.5 py-1 font-mono text-xs font-bold text-blue">{item.step}</span>
                </div>
                <div className={wideLayout ? "self-center p-4" : "p-6 md:p-7"}>
                  <h3 className="font-display text-xl font-bold text-blue md:text-2xl">
                    <button
                      type="button"
                      aria-pressed={isActive}
                      onClick={() => activateStep(index)}
                      className="rounded text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                    >
                      {item.title}
                    </button>
                  </h3>
                  <p className="mt-3 leading-7 text-blue/70">{item.body}</p>
                </div>
              </article>
            );
          })}
        </div>

        <div
          ref={stageRef}
          aria-hidden="true"
          className={
            wideLayout
              ? stickyEligible
                ? "sticky col-start-2 row-start-2 row-span-2 h-fit w-full self-start"
                : "invisible pointer-events-none absolute right-0 top-0 row-start-2 w-[calc(50%_-_1rem)] xl:w-[calc(50%_-_1.25rem)]"
              : "invisible pointer-events-none absolute right-0 top-0 w-[calc(50%_-_1rem)] xl:w-[calc(50%_-_1.25rem)]"
          }
          style={stickyEligible ? { top: stickyTop } : undefined}
        >
          {wideLayout
            ? <ProcessStage activeStep={activeStep} transitionEligible={stickyEligible} />
            : <div className="aspect-[4/3] w-full rounded-3xl" />}
        </div>
        {stickyEligible && <div aria-hidden="true" className="col-start-1 row-start-3 h-24" />}
      </div>
    </section>
  );
}
