"use client";

import Image from "next/image";
import Link from "next/link";
import { flushSync } from "react-dom";
import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, FocusEvent as ReactFocusEvent, KeyboardEvent as ReactKeyboardEvent, TouchEvent as ReactTouchEvent } from "react";
import type { Coach } from "@/data/coaches";
import { ArrowLeft, ArrowRight } from "@/lib/icons";
import styles from "./CoachDirectory.module.css";

const FILTERS = ["Tất cả", "Bình an nội tâm", "Sự nghiệp", "Gia đình & quan hệ", "Chuyển hoá", "Giá trị bản thân"];
const ARC_SLOTS = Array.from({ length: 11 }, (_, index) => index - 5);
const MANUAL_STEP_MS = 140;
const AUTO_CHANGE_INTERVAL_MS = 7500;
const AUTO_TRANSITION_MS = MANUAL_STEP_MS * 2;
const AUTO_TRANSITION_START_MS = AUTO_CHANGE_INTERVAL_MS - AUTO_TRANSITION_MS / 2;
type PendingProfileCommit = { index: number; slug: string; announce: boolean; direction: -1 | 1 };

function normalizeSearchText(value: string) {
  return value.toLocaleLowerCase("vi").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d");
}

function wrapIndex(index: number, count: number) {
  return ((index % count) + count) % count;
}

function getArcGeometry(rail: HTMLUListElement) {
  const compact = window.matchMedia("(max-width: 639px)").matches;
  const width = rail.clientWidth;
  const centerCard = rail.querySelector<HTMLLIElement>('[data-arc-slot="0"]');
  const cardWidth = centerCard?.offsetWidth ?? (compact ? 128 : 224);
  const step = compact
    ? Math.min(cardWidth + 24, width * 0.46)
    : Math.max(cardWidth + 24, width / 4.8);
  return {
    compact,
    width,
    cardWidth,
    step,
  };
}

export function CoachDirectory({ coaches }: { coaches: Coach[] }) {
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSlug, setCurrentSlug] = useState<string | null>(null);
  const [arcCenterSequence, setArcCenterSequence] = useState(0);
  const [autoRotationEnabled, setAutoRotationEnabled] = useState(true);
  const [selectionControlFocused, setSelectionControlFocused] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const [pageVisible, setPageVisible] = useState(false);
  const [stageVisible, setStageVisible] = useState(false);
  const [isEnhanced, setIsEnhanced] = useState(false);
  const [manualDirection, setManualDirection] = useState<-1 | 1 | null>(null);
  const [profileDirection, setProfileDirection] = useState<-1 | 1>(1);
  const [outgoingCoach, setOutgoingCoach] = useState<Coach | null>(null);
  const [manualAnnouncement, setManualAnnouncement] = useState("");
  const [profileLinkLockSlug, setProfileLinkLockSlug] = useState<string | null>(null);
  const railId = useId();
  const railRef = useRef<HTMLUListElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const profileLinkRef = useRef<HTMLAnchorElement>(null);
  const featuredCoachLinkRef = useRef<HTMLAnchorElement>(null);
  const profileLinkLockSlugRef = useRef<string | null>(null);
  const profileLinkCommittedSlugRef = useRef<string | null>(null);
  const pendingProfileCommitRef = useRef<PendingProfileCommit | null>(null);
  const phaseRef = useRef(0);
  const currentIndexRef = useRef(0);
  const selectedCoachRef = useRef<Coach | null>(null);
  const portraitCrossfadeTimerRef = useRef<number | null>(null);
  const arcCenterSequenceRef = useRef(0);
  const manualRemainingRef = useRef(0);
  const autoDwellElapsedRef = useRef(0);
  const autoTransitionProgressRef = useRef(0);
  const autoTransitioningRef = useRef(false);
  const autoHandoffCommittedRef = useRef(false);
  const motionTokenRef = useRef(0);
  const pauseSyncRef = useRef<() => void>(() => {});
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const isProfileLinkFocused = useCallback(() => {
    const focusedElement = typeof document !== "undefined" ? document.activeElement : null;
    return Boolean(
      focusedElement && (
        profileLinkRef.current?.contains(focusedElement) ||
        featuredCoachLinkRef.current?.contains(focusedElement)
      ),
    );
  }, []);
  const isSelectionControlFocusTarget = useCallback((target: EventTarget | null) => {
    const element = target as HTMLElement | null;
    if (!element || typeof element.closest !== "function" || !stageRef.current?.contains(element)) {
      return false;
    }
    return Boolean(element.closest("button") || railRef.current?.contains(element));
  }, []);

  const visibleCoaches = useMemo(() => {
    const query = normalizeSearchText(searchQuery.trim());
    return coaches.filter((coach) => {
      const matchesFilter = activeFilter === "Tất cả" || coach.focusAreas.includes(activeFilter);
      const searchable = [coach.name, coach.title, coach.quote, coach.bio, ...coach.focusAreas].join(" ");
      return matchesFilter && normalizeSearchText(searchable).includes(query);
    });
  }, [activeFilter, coaches, searchQuery]);
  const visibleSequence = JSON.stringify(visibleCoaches.map((coach) => coach.slug));
  const profileLinkIsFocused = isProfileLinkFocused();
  const profileLinkBlocksAuto = profileLinkLockSlug !== null || profileLinkIsFocused;
  const lockedSlug = profileLinkLockSlug ?? (profileLinkIsFocused ? profileLinkCommittedSlugRef.current : null);
  const selectedSlug = lockedSlug ?? currentSlug;
  const foundIndex = visibleCoaches.findIndex((coach) => coach.slug === selectedSlug);
  const currentIndex = foundIndex >= 0 ? foundIndex : 0;
  const currentCoach = visibleCoaches[currentIndex] ?? null;
  const firstVisibleSlug = visibleCoaches[0]?.slug ?? null;

  useLayoutEffect(() => {
    if (profileLinkLockSlugRef.current !== null || profileLinkIsFocused) return;
    profileLinkCommittedSlugRef.current = currentCoach?.slug ?? null;
  }, [currentCoach?.slug, profileLinkIsFocused]);

  useLayoutEffect(() => {
    const previousCoach = selectedCoachRef.current;
    selectedCoachRef.current = currentCoach;

    if (portraitCrossfadeTimerRef.current !== null) {
      window.clearTimeout(portraitCrossfadeTimerRef.current);
      portraitCrossfadeTimerRef.current = null;
    }

    if (
      prefersReducedMotion ||
      !previousCoach ||
      !currentCoach ||
      previousCoach.slug === currentCoach.slug
    ) {
      setOutgoingCoach(null);
      return;
    }

    setOutgoingCoach(previousCoach);
    const timer = window.setTimeout(() => {
      setOutgoingCoach((coach) => coach?.slug === previousCoach.slug ? null : coach);
      if (portraitCrossfadeTimerRef.current === timer) {
        portraitCrossfadeTimerRef.current = null;
      }
    }, 280);
    portraitCrossfadeTimerRef.current = timer;

    return () => {
      window.clearTimeout(timer);
      if (portraitCrossfadeTimerRef.current === timer) {
        portraitCrossfadeTimerRef.current = null;
      }
    };
  }, [currentCoach, prefersReducedMotion]);

  const updateArcPositions = useCallback((phase: number) => {
    const rail = railRef.current;
    if (!rail) return;
    rail.querySelectorAll<HTMLLIElement>("[data-arc-slot]").forEach((item) => {
      const slot = Number(item.dataset.arcSlot);
      const isSelected = slot === 0;
      const disclosure = isSelected ? "featured" : "name";
      item.dataset.arcDisclosure = disclosure;
      item.style.transform = "none";
      item.style.opacity = isSelected ? "1" : "0";
      item.style.zIndex = isSelected ? "1" : "0";
      item.style.visibility = isSelected ? "visible" : "hidden";
    });
  }, []);

  const commitIndex = useCallback((index: number, announce: boolean) => {
    if (!visibleCoaches.length) return false;
    const nextIndex = wrapIndex(index, visibleCoaches.length);
    const coach = visibleCoaches[nextIndex];
    const indexDelta = index - currentIndexRef.current;
    const direction: -1 | 1 = indexDelta < 0 ? -1 : 1;
    if (profileLinkLockSlugRef.current !== null || isProfileLinkFocused()) {
      pendingProfileCommitRef.current = { index: nextIndex, slug: coach.slug, announce, direction };
      return false;
    }
    if (indexDelta !== 0) setProfileDirection(direction);
    const nextArcCenterSequence = Math.abs(indexDelta) === 1
      ? arcCenterSequenceRef.current + indexDelta
      : nextIndex;
    arcCenterSequenceRef.current = nextArcCenterSequence;
    setArcCenterSequence(nextArcCenterSequence);
    currentIndexRef.current = nextIndex;
    setCurrentSlug(coach.slug);
    if (announce) setManualAnnouncement(coach.name + ", " + coach.title);
    return true;
  }, [isProfileLinkFocused, visibleCoaches]);

  const syncToSelectedApex = useCallback(() => {
    if (manualRemainingRef.current > 0) return;
    motionTokenRef.current += 1;
    phaseRef.current = 0;
    autoDwellElapsedRef.current = 0;
    autoTransitionProgressRef.current = 0;
    autoTransitioningRef.current = false;
    autoHandoffCommittedRef.current = false;
    updateArcPositions(0);
  }, [updateArcPositions]);

  const moveBy = useCallback((direction: -1 | 1) => {
    if (visibleCoaches.length < 2 || manualRemainingRef.current > 0) return;
    motionTokenRef.current += 1;
    if (prefersReducedMotion) {
      phaseRef.current = 0;
      manualRemainingRef.current = 0;
      autoDwellElapsedRef.current = 0;
      autoTransitionProgressRef.current = 0;
      autoTransitioningRef.current = false;
      autoHandoffCommittedRef.current = false;
      commitIndex(currentIndexRef.current + direction, true);
      updateArcPositions(0);
      return;
    }
    const phase = phaseRef.current;
    autoDwellElapsedRef.current = 0;
    autoTransitionProgressRef.current = 0;
    autoTransitioningRef.current = false;
    autoHandoffCommittedRef.current = false;
    manualRemainingRef.current = direction === 1 ? 1 - phase : 1 + phase;
    setManualDirection(direction);
  }, [commitIndex, prefersReducedMotion, updateArcPositions, visibleCoaches.length]);

  const selectCoach = useCallback((index: number) => {
    if (index === currentIndexRef.current || !visibleCoaches.length) return;
    motionTokenRef.current += 1;
    phaseRef.current = 0;
    manualRemainingRef.current = 0;
    autoDwellElapsedRef.current = 0;
    autoTransitionProgressRef.current = 0;
    autoTransitioningRef.current = false;
    autoHandoffCommittedRef.current = false;
    const selected = commitIndex(index, true);
    updateArcPositions(0);
    if (selected && !prefersReducedMotion) setManualDirection(1);
    else setManualDirection(null);
  }, [commitIndex, prefersReducedMotion, updateArcPositions, visibleCoaches.length]);

  const moveToEdge = useCallback((edge: "start" | "end") => {
    motionTokenRef.current += 1;
    if (!visibleCoaches.length) return;
    phaseRef.current = 0;
    manualRemainingRef.current = 0;
    autoDwellElapsedRef.current = 0;
    autoTransitionProgressRef.current = 0;
    autoTransitioningRef.current = false;
    autoHandoffCommittedRef.current = false;
    setManualDirection(null);
    const index = edge === "start" ? 0 : visibleCoaches.length - 1;
    const selected = commitIndex(index, true);
    updateArcPositions(0);
    if (selected && !prefersReducedMotion) setManualDirection(1);
    else setManualDirection(null);
  }, [commitIndex, prefersReducedMotion, updateArcPositions, visibleCoaches.length]);

  const handleRailKeyDown = useCallback((event: ReactKeyboardEvent<HTMLUListElement>) => {
    if (event.target !== event.currentTarget || visibleCoaches.length < 2) return;
    if (event.key === "ArrowLeft") { event.preventDefault(); event.currentTarget.dataset.arrowNavigation = "true"; moveBy(-1); }
    else if (event.key === "ArrowRight") { event.preventDefault(); event.currentTarget.dataset.arrowNavigation = "true"; moveBy(1); }
    else if (event.key === "Home") { event.preventDefault(); event.currentTarget.dataset.arrowNavigation = "true"; moveToEdge("start"); }
    else if (event.key === "End") { event.preventDefault(); event.currentTarget.dataset.arrowNavigation = "true"; moveToEdge("end"); }
  }, [moveBy, moveToEdge, visibleCoaches.length]);

  const handleTouchStart = (event: ReactTouchEvent<HTMLUListElement>) => {
    if (event.touches.length !== 1) { touchStartRef.current = null; return; }
    const touch = event.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    setIsTouching(true);
  };
  const handleTouchEnd = (event: ReactTouchEvent<HTMLUListElement>) => {
    const start = touchStartRef.current;
    const touch = event.changedTouches[0];
    touchStartRef.current = null;
    setIsTouching(false);
    if (!start || !touch) return;
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy) * 1.2) moveBy(dx < 0 ? 1 : -1);
  };

  useEffect(() => setIsEnhanced(true), []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setPrefersReducedMotion(query.matches);
      if (query.matches) {
        motionTokenRef.current += 1;
        setAutoRotationEnabled(false);
        setManualDirection(null);
        manualRemainingRef.current = 0;
        phaseRef.current = 0;
        updateArcPositions(0);
      }
    };
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [updateArcPositions]);

  useEffect(() => {
    const update = () => setPageVisible(document.visibilityState === "visible");
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setStageVisible(Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.2)), { threshold: [0, 0.2] });
    observer.observe(stage);
    return () => observer.disconnect();
  }, [isEnhanced, visibleSequence]);

  useLayoutEffect(() => {
    pauseSyncRef.current = syncToSelectedApex;
  }, [syncToSelectedApex]);

  useLayoutEffect(() => {
    const paused = !autoRotationEnabled || prefersReducedMotion || profileLinkBlocksAuto || isTouching || !pageVisible || !stageVisible;
    if (paused) pauseSyncRef.current();
  }, [autoRotationEnabled, isTouching, manualDirection, pageVisible, prefersReducedMotion, profileLinkBlocksAuto, stageVisible]);
  useLayoutEffect(() => {
    motionTokenRef.current += 1;
    currentIndexRef.current = 0;
    arcCenterSequenceRef.current = 0;
    setArcCenterSequence(0);
    phaseRef.current = 0;
    manualRemainingRef.current = 0;
    autoDwellElapsedRef.current = 0;
    autoTransitionProgressRef.current = 0;
    autoTransitioningRef.current = false;
    autoHandoffCommittedRef.current = false;
    setManualDirection(null);
    setProfileDirection(1);
    setCurrentSlug(firstVisibleSlug);
    setManualAnnouncement("");
    updateArcPositions(0);
  }, [firstVisibleSlug, visibleSequence, updateArcPositions]);

  useLayoutEffect(() => updateArcPositions(phaseRef.current), [currentSlug, isEnhanced, updateArcPositions]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    let layoutFrame: number | null = null;
    const updateLayout = () => {
      if (layoutFrame !== null) window.cancelAnimationFrame(layoutFrame);
      layoutFrame = window.requestAnimationFrame(() => {
        layoutFrame = null;
        const featured = rail.querySelector<HTMLLIElement>('[data-arc-slot="0"]');
        if (!featured) return;
        updateArcPositions(phaseRef.current);
        const link = featured.querySelector<HTMLAnchorElement>("a");
        const isWideSplit = link && getComputedStyle(link).display === "grid";
        const railTop = rail.getBoundingClientRect().top;
        let lowerEdge = featured.offsetHeight;
        if (isWideSplit) {
          rail.querySelectorAll<HTMLLIElement>("[data-arc-slot]").forEach((item) => {
            lowerEdge = Math.max(lowerEdge, item.getBoundingClientRect().bottom - railTop);
          });
        }
        const nextHeight = Math.ceil(lowerEdge + 12);
        if (Math.abs(rail.clientHeight - nextHeight) > 1) {
          rail.style.height = `${nextHeight}px`;
          updateArcPositions(phaseRef.current);
        }
      });
    };
    const observer = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(updateLayout);
    observer?.observe(rail);
    rail.querySelectorAll<HTMLLIElement>("[data-arc-slot]").forEach((item) => observer?.observe(item));
    updateLayout();
    if (!observer) window.addEventListener("resize", updateLayout);
    return () => {
      if (layoutFrame !== null) window.cancelAnimationFrame(layoutFrame);
      observer?.disconnect();
      window.removeEventListener("resize", updateLayout);
    };
  }, [arcCenterSequence, currentSlug, isEnhanced, updateArcPositions, visibleSequence]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let resizeTimer: number | null = null;
    const handleResize = () => {
      stage.dataset.carouselResizing = "true";
      if (resizeTimer !== null) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        delete stage.dataset.carouselResizing;
        resizeTimer = null;
      }, 200);
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimer !== null) window.clearTimeout(resizeTimer);
      delete stage.dataset.carouselResizing;
    };
  }, [visibleSequence]);

  useEffect(() => {
    const manual = manualDirection !== null;
    const canAuto = autoRotationEnabled && !prefersReducedMotion && !profileLinkBlocksAuto && !selectionControlFocused && !isTouching && pageVisible && stageVisible;
    if (!isEnhanced || visibleCoaches.length < 2 || (!manual && !canAuto)) return;
    const motionToken = ++motionTokenRef.current;
    let frame: number | null = null;
    let dwellTimer: number | null = null;
    let previousTime: number | null = null;
    function scheduleAutoTransition() {
      const remaining = Math.max(0, AUTO_TRANSITION_START_MS - autoDwellElapsedRef.current);
      dwellTimer = window.setTimeout(() => {
        dwellTimer = null;
        if (motionToken !== motionTokenRef.current) return;
        const rail = railRef.current;
        if (!rail || getArcGeometry(rail).step <= 0) {
          autoDwellElapsedRef.current = 0;
          scheduleAutoTransition();
          return;
        }
        autoDwellElapsedRef.current = AUTO_TRANSITION_START_MS;
        autoTransitioningRef.current = true;
        autoTransitionProgressRef.current = 0;
        autoHandoffCommittedRef.current = false;
        previousTime = performance.now();
        frame = window.requestAnimationFrame(tick);
      }, remaining);
    }
    function tick(time: number) {
      if (motionToken !== motionTokenRef.current) return;
      frame = null;
      const elapsed = previousTime === null ? 0 : Math.min(64, time - previousTime);
      previousTime = time;
      let phase = phaseRef.current;
      if (elapsed > 0 && manual) {
        const amount = Math.min(elapsed / AUTO_TRANSITION_MS, manualRemainingRef.current);
        phase += (manualDirection as -1 | 1) * amount;
        manualRemainingRef.current -= amount;
      } else if (elapsed > 0 && canAuto && autoTransitioningRef.current) {
        autoTransitionProgressRef.current = Math.min(
          1,
          autoTransitionProgressRef.current + elapsed / AUTO_TRANSITION_MS,
        );
        phase = autoHandoffCommittedRef.current
          ? autoTransitionProgressRef.current - 1
          : autoTransitionProgressRef.current;
      }
      let handedOff = false;
      if (phase >= 0.5) {
        phase -= 1;
        phaseRef.current = phase;
        flushSync(() => {
          handedOff = commitIndex(currentIndexRef.current + 1, manual);
        });
        if (!handedOff) {
          phase += 1;
          phaseRef.current = phase;
          return;
        }
        if (!manual && autoTransitioningRef.current) {
          autoHandoffCommittedRef.current = true;
        }
      } else if (phase <= -0.5) {
        phase += 1;
        phaseRef.current = phase;
        flushSync(() => {
          handedOff = commitIndex(currentIndexRef.current - 1, manual);
        });
        if (!handedOff) {
          phase -= 1;
          phaseRef.current = phase;
          return;
        }
        if (!manual && autoTransitioningRef.current) {
          autoHandoffCommittedRef.current = true;
        }
      }
      phaseRef.current = phase;
      if (!handedOff) updateArcPositions(phase);
      if (manual && manualRemainingRef.current <= 0) {
        manualRemainingRef.current = 0;
        phase = 0;
        phaseRef.current = 0;
        autoDwellElapsedRef.current = AUTO_TRANSITION_MS / 2;
        autoTransitionProgressRef.current = 0;
        autoTransitioningRef.current = false;
        autoHandoffCommittedRef.current = false;
        updateArcPositions(0);
        setManualDirection(null);
        motionTokenRef.current += 1;
        return;
      }
      if (!manual && autoTransitioningRef.current && autoTransitionProgressRef.current >= 1) {
        autoDwellElapsedRef.current = AUTO_TRANSITION_MS / 2;
        autoTransitionProgressRef.current = 0;
        autoTransitioningRef.current = false;
        autoHandoffCommittedRef.current = false;
        phaseRef.current = 0;
        updateArcPositions(0);
        scheduleAutoTransition();
        return;
      }
      frame = window.requestAnimationFrame(tick);
    }
    if (manual) frame = window.requestAnimationFrame(tick);
    else scheduleAutoTransition();
    return () => {
      motionTokenRef.current += 1;
      if (dwellTimer !== null) window.clearTimeout(dwellTimer);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [autoRotationEnabled, commitIndex, isEnhanced, isTouching, manualDirection, pageVisible, prefersReducedMotion, profileLinkBlocksAuto, selectionControlFocused, stageVisible, updateArcPositions, visibleCoaches.length]);

  const handleFocusCapture = (event: ReactFocusEvent<HTMLDivElement>) => {
    if (isSelectionControlFocusTarget(event.target)) {
      setSelectionControlFocused(true);
      autoDwellElapsedRef.current = 0;
      autoTransitionProgressRef.current = 0;
      autoTransitioningRef.current = false;
      autoHandoffCommittedRef.current = false;
      syncToSelectedApex();
    }
    const profileLink = profileLinkRef.current;
    const featuredCoachLink = featuredCoachLinkRef.current;
    if (profileLink?.contains(event.target as Node) || featuredCoachLink?.contains(event.target as Node)) {
      const committedSlug = profileLinkCommittedSlugRef.current ?? currentCoach?.slug ?? null;
      profileLinkLockSlugRef.current = committedSlug;
      setProfileLinkLockSlug(committedSlug);
      if (manualRemainingRef.current > 0) {
        motionTokenRef.current += 1;
        manualRemainingRef.current = 0;
        pendingProfileCommitRef.current = null;
        phaseRef.current = 0;
        setManualDirection(null);
        updateArcPositions(0);
      }
    }
  };
  const handleBlurCapture = (event: ReactFocusEvent<HTMLDivElement>) => {
    const target = event.target as Node;
    if (isSelectionControlFocusTarget(target) && !isSelectionControlFocusTarget(event.relatedTarget)) {
      setSelectionControlFocused(false);
    }
    if (profileLinkRef.current?.contains(target) || featuredCoachLinkRef.current?.contains(target)) {
      profileLinkLockSlugRef.current = null;
      setProfileLinkLockSlug(null);
      const pending = pendingProfileCommitRef.current;
      pendingProfileCommitRef.current = null;
      if (pending) {
        const pendingIndex = visibleCoaches.findIndex((coach) => coach.slug === pending.slug);
        if (pendingIndex >= 0) {
          currentIndexRef.current = pendingIndex;
          arcCenterSequenceRef.current = pendingIndex;
          setArcCenterSequence(pendingIndex);
          setProfileDirection(pending.direction);
          setCurrentSlug(pending.slug);
          if (pending.announce) {
            const coach = visibleCoaches[pendingIndex];
            setManualAnnouncement(coach.name + ", " + coach.title);
          }
        }
      }
    }
  };

  return (
    <>
      <div className="mb-6 max-w-xl">
        <label htmlFor="coach-directory-search" className="sr-only">Tìm người đồng hành theo tên hoặc lĩnh vực</label>
        <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white px-4 py-3 text-blue shadow-sm transition focus-within:border-yellow focus-within:ring-2 focus-within:ring-yellow/40">
          <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-blue/50" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></svg>
          <input id="coach-directory-search" type="search" value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Tìm theo tên, lĩnh vực hoặc điều bạn đang quan tâm" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-blue/45" />
          {searchQuery && <button type="button" onClick={() => setSearchQuery("")} className="shrink-0 rounded-full px-2 py-1 text-xs font-semibold text-blue/65 transition hover:bg-blue/5 hover:text-blue">Xóa</button>}
        </div>
      </div>
      <div className="mb-5 flex flex-wrap gap-3" aria-label="Lọc theo lĩnh vực đồng hành">
        {FILTERS.map((filter) => <button key={filter} type="button" onClick={() => setActiveFilter(filter)} aria-pressed={activeFilter === filter} className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${activeFilter === filter ? "border-yellow bg-yellow text-blue" : "border-white/30 text-white hover:border-yellow hover:text-yellow"}`}>{filter}</button>)}
      </div>
      <div className={styles.resultsHeader}><p className="text-sm text-white/65" aria-live="polite">{visibleCoaches.length} hồ sơ phù hợp{activeFilter !== "Tất cả" ? " · " + activeFilter : ""}{searchQuery.trim() ? " · “" + searchQuery.trim() + "”" : ""}</p></div>

      {visibleCoaches.length ? (
        <div ref={stageRef} className={styles.carouselStage} onFocusCapture={handleFocusCapture} onBlurCapture={handleBlurCapture}>
          {visibleCoaches.length > 1 && isEnhanced && <div className={styles.controls}><button type="button" className={`${styles.control} ${styles.rotationControl}`} aria-label={autoRotationEnabled ? "Dừng tự chuyển" : "Bật tự chuyển"} aria-controls={railId} aria-pressed={autoRotationEnabled} aria-disabled={prefersReducedMotion} onClick={() => {
            if (prefersReducedMotion) return;
            autoDwellElapsedRef.current = 0;
            autoTransitionProgressRef.current = 0;
            autoTransitioningRef.current = false;
            autoHandoffCommittedRef.current = false;
            setAutoRotationEnabled((enabled) => !enabled);
          }}>{autoRotationEnabled ? "Dừng tự chuyển" : "Bật tự chuyển"}</button></div>}
          {isEnhanced && visibleCoaches.length > 1 && (
            <div className={styles.roster} role="group" aria-label="Chọn người đồng hành">
              {visibleCoaches.map((coach, index) => (
                <button
                  key={coach.slug}
                  type="button"
                  className={styles.rosterButton}
                  aria-label={`Chọn ${coach.name}${coach.title ? `, ${coach.title}` : ""}`}
                  aria-pressed={coach.slug === currentCoach?.slug}
                  aria-controls={railId}
                  onClick={() => selectCoach(index)}
                >
                  <span className={styles.rosterAvatar} aria-hidden="true">
                    {coach.image ? (
                      <Image src={coach.image} alt="" fill sizes="36px" />
                    ) : (
                      <span>{coach.initials}</span>
                    )}
                  </span>
                  <span className={styles.rosterName}>{coach.name}</span>
                </button>
              ))}
            </div>
          )}
          {isEnhanced ? (
            <div className={styles.arcRow}>
              {visibleCoaches.length > 1 && <button type="button" className={styles.control + " " + styles.sideControl} aria-label="Xem người đồng hành trước" aria-controls={railId} onClick={() => moveBy(-1)}><ArrowLeft size={20} aria-hidden="true" /></button>}
              <ul ref={railRef} id={railId} className={styles.rail} tabIndex={0} aria-label="Hồ sơ người đồng hành đang chọn" onKeyDown={handleRailKeyDown} onFocus={(event) => { delete event.currentTarget.dataset.arrowNavigation; }} onBlur={(event) => { delete event.currentTarget.dataset.arrowNavigation; }} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onTouchCancel={() => { touchStartRef.current = null; setIsTouching(false); }}>
                {ARC_SLOTS.map((slot) => {
                  const sequenceIndex = arcCenterSequence + slot;
                  const coach = visibleCoaches[wrapIndex(sequenceIndex, visibleCoaches.length)];
                  const featured = slot === 0;
                  const fadingCoach = featured && !prefersReducedMotion && outgoingCoach && currentCoach?.slug !== outgoingCoach.slug
                    ? outgoingCoach
                    : null;
                  const cardContent = <>
                      <div className={`${styles.portraitFrame} relative aspect-[4/4.5] overflow-hidden bg-blue/10`}>
                        {fadingCoach && <div className={styles.portraitOutgoing} aria-hidden="true">
                          {fadingCoach.image ? <Image src={fadingCoach.image} alt="" fill sizes="(min-width: 1024px) 14rem, 34vw" className={styles.portraitImage} /> : <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,.85),transparent_40%),linear-gradient(145deg,var(--coach-accent),#172d55)]" style={{ "--coach-accent": fadingCoach.accent } as CSSProperties}><span className="font-display text-7xl font-bold text-white drop-shadow-lg">{fadingCoach.initials}</span></div>}
                        </div>}
                        {coach.image ? <Image src={coach.image} alt="" fill sizes="(min-width: 1024px) 14rem, 34vw" className={`${styles.portraitImage} ${fadingCoach ? styles.portraitImageEntering : ""}`} /> : <div className={`flex h-full items-center justify-center bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,.85),transparent_40%),linear-gradient(145deg,var(--coach-accent),#172d55)] ${fadingCoach ? styles.portraitImageEntering : ""}`} style={{ "--coach-accent": coach.accent } as CSSProperties}><span className="font-display text-7xl font-bold text-white drop-shadow-lg">{coach.initials}</span></div>}
                      </div>
                      <div className={styles.portraitCopy}>
                        <span className={`${styles.portraitName} font-sans text-2xl font-bold text-blue`}>{coach.name}</span>
                        <span className={`${styles.portraitDetail} text-[10px] font-bold uppercase tracking-[0.16em] text-blue/55`}>
                          {coach.focusAreas.length > 1
                            ? coach.focusAreas.slice(0, 2).join(" · ")
                            : [coach.focusAreas[0], coach.title].filter(Boolean).join(" · ")}
                        </span>
                        <span className={styles.portraitSummary}>
                          {coach.approach}
                        </span>
                        <span className={styles.portraitAction} aria-hidden="true">
                          Xem hồ sơ <ArrowRight size={16} aria-hidden="true" className={styles.portraitActionIcon} />
                        </span>
                      </div>
                    </>;
                  return <li key={sequenceIndex} className={styles.item} data-arc-slot={slot} data-arc-disclosure={featured ? "featured" : "name"} aria-hidden={featured ? undefined : true} inert={!featured}>
                    <Link ref={featured ? featuredCoachLinkRef : null} href={`/coaching/${coach.slug}`} aria-label={`Xem hồ sơ của ${coach.name}`} className={`${styles.card} ${styles.featuredCardLink}`}>{cardContent}</Link>
                  </li>;
                })}
              </ul>
              {visibleCoaches.length > 1 && <button type="button" className={styles.control + " " + styles.sideControl} aria-label="Xem người đồng hành tiếp theo" aria-controls={railId} onClick={() => moveBy(1)}><ArrowRight size={20} aria-hidden="true" /></button>}
            </div>
          ) : (
            <ul className={styles.fallbackList} aria-label="Danh sách người đồng hành">
              {visibleCoaches.map((coach) => <li key={coach.slug} className={styles.fallbackItem}><Link href={`/coaching/${coach.slug}`} className={styles.card + " " + styles.cardLink}><div className={`${styles.portraitFrame} relative aspect-[4/4.5] overflow-hidden bg-blue/10`}>{coach.image ? <Image src={coach.image} alt={coach.name} fill sizes="(min-width: 1024px) 12rem, 84vw" className={styles.portraitImage} /> : <div className="flex h-full items-center justify-center"><span className="font-display text-7xl font-bold text-blue">{coach.initials}</span></div>}</div><span className={`${styles.portraitName} font-sans text-2xl font-bold text-blue`}>{coach.name}</span></Link></li>)}
            </ul>
          )}
          {currentCoach && <article className={styles.details} aria-label={`Thông tin về ${currentCoach.name}`} aria-live="off">
            <div
              key={currentCoach.slug}
              className={styles.detailsContent}
              data-direction={profileDirection > 0 ? "next" : "previous"}
            >
              <div className={styles.detailsIdentity}>
                <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue/55">{currentCoach.title}</div>
                <h3 className={`mt-2 font-display text-2xl font-bold text-blue ${styles.detailsName}`}>{currentCoach.name}</h3>
                {currentCoach.isDemo && <p className={styles.detailsDemo}>Hồ sơ demo</p>}
              </div>
              <div className={styles.detailsNarrative}>
                <p className="text-sm leading-6 text-blue/75">{currentCoach.quote}</p>
                {currentCoach.bio && <p className="text-sm leading-6 text-blue/75">{currentCoach.bio}</p>}
                {currentCoach.approach.trim() && currentCoach.approach !== currentCoach.quote && currentCoach.approach !== currentCoach.bio && (
                  <div className="grid gap-1">
                    <h4 className="m-0 text-xs font-bold text-blue/55">Cách tiếp cận</h4>
                    <p className="break-words text-sm leading-6 text-blue/75">{currentCoach.approach}</p>
                  </div>
                )}
              </div>
              <div className={styles.detailsFooter}>
                {currentCoach.focusAreas.length > 0 && <ul className={styles.detailsFocusAreas} aria-label="Lĩnh vực đồng hành">{currentCoach.focusAreas.map((area) => <li key={area} className="rounded-full bg-blue/5 px-3 py-1 text-[10px] font-semibold text-blue/75">{area}</li>)}</ul>}
                <Link ref={profileLinkRef} href={`/coaching/${currentCoach.slug}`} className={`inline-flex min-h-11 items-center gap-3 rounded-full border border-yellow bg-blue px-5 py-3 text-sm font-bold text-yellow transition hover:brightness-95 ${styles.detailsAction}`}>Xem hồ sơ <ArrowRight size={16} aria-hidden="true" /></Link>
              </div>
            </div>
          </article>}
          <p className="sr-only" role="status" aria-live="polite" aria-atomic="true">{manualAnnouncement}</p>
        </div>
      ) : <div className="rounded-2xl border border-white/20 bg-white/5 p-8 text-center text-white/75"><p>Chưa tìm thấy hồ sơ phù hợp. Thử từ khóa khác hoặc xem tất cả lĩnh vực.</p><button type="button" onClick={() => { setSearchQuery(""); setActiveFilter("Tất cả"); }} className="mt-4 rounded-full border border-yellow/70 px-5 py-2 text-sm font-semibold text-yellow transition hover:bg-yellow hover:text-blue">Xóa bộ lọc</button></div>}
    </>
  );
}
