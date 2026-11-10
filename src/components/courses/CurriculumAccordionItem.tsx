"use client";

import { useRef, useLayoutEffect, type ReactNode } from "react";

export default function CurriculumAccordionItem({
  headingId,
  regionId,
  isOpen,
  onToggle,
  summary,
  children,
  isEntryPending,
}: {
  headingId: string;
  regionId: string;
  isOpen: boolean;
  onToggle: () => void;
  summary: ReactNode;
  children: ReactNode;
  isEntryPending?: boolean;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    if (animFrameRef.current !== null) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    let reducedMotion = false;
    try {
      reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      reducedMotion = true;
    }

    if (reducedMotion || isEntryPending) {
      panel.style.height = isOpen ? "auto" : "0px";
      panel.style.overflow = isOpen ? "visible" : "hidden";
      panel.style.visibility = isOpen ? "visible" : "hidden";
      return;
    }

    if (isOpen) {
      panel.style.visibility = "visible";
      panel.style.overflow = "hidden";
      const startHeight = panel.offsetHeight;
      const targetHeight = (() => {
        panel.style.height = "auto";
        const h = panel.scrollHeight;
        panel.style.height = `${startHeight}px`;
        return h;
      })();

      animFrameRef.current = requestAnimationFrame(() => {
        animFrameRef.current = null;
        panel.style.transition = "height 280ms cubic-bezier(0.22, 1, 0.36, 1)";
        panel.style.height = `${targetHeight}px`;
        const onEnd = () => {
          panel.removeEventListener("transitionend", onEnd);
          if (isOpenRef.current) {
            panel.style.height = "auto";
            panel.style.overflow = "visible";
            panel.style.transition = "";
          }
        };
        panel.addEventListener("transitionend", onEnd);
      });
    } else {
      const currentHeight = panel.scrollHeight;
      panel.style.overflow = "hidden";
      panel.style.height = `${currentHeight}px`;
      panel.style.transition = "";

      animFrameRef.current = requestAnimationFrame(() => {
        animFrameRef.current = null;
        panel.style.transition = "height 220ms cubic-bezier(0.4, 0, 0.2, 1), visibility 220ms";
        panel.style.height = "0px";
        panel.style.visibility = "hidden";
        const onEnd = () => {
          panel.removeEventListener("transitionend", onEnd);
          if (!isOpenRef.current) panel.style.transition = "";
        };
        panel.addEventListener("transitionend", onEnd);
      });
    }

    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [isOpen, isEntryPending]);

  return (
    <div>
      <button
        id={headingId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={regionId}
        onClick={onToggle}
        className="relative flex w-full cursor-pointer items-center justify-between bg-blue/5 py-3 pl-5 pr-12 text-left font-bold text-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue"
      >
        {summary}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            right: "1.25rem",
            top: "50%",
            width: "0.5rem",
            height: "0.5rem",
            borderRight: "2px solid currentColor",
            borderBottom: "2px solid currentColor",
            transform: `translateY(-50%) rotate(${isOpen ? "225deg" : "45deg"})`,
            transition: "transform 180ms ease",
            display: "inline-block",
            pointerEvents: "none",
          }}
        />
      </button>

      <div
        ref={panelRef}
        id={regionId}
        role="region"
        aria-labelledby={headingId}
        style={{
          height: isOpen ? "auto" : "0px",
          overflow: isOpen ? "visible" : "hidden",
          visibility: isOpen ? "visible" : "hidden",
        }}
      >
        {children}
      </div>
    </div>
  );
}
