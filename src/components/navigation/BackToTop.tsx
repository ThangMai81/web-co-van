"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

const RADIUS = 20;
const CIRC = 2 * Math.PI * RADIUS;

export function BackToTop() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      setProgress(max > 0 ? Math.min(1, Math.max(0, y / max)) : 0);
      setVisible(y > window.innerHeight * 0.8);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Về đầu trang"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={`fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full bg-blue text-yellow shadow-lg shadow-blue/30 transition-all duration-500 hover:-translate-y-1 hover:bg-white hover:text-blue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow md:bottom-8 md:right-8 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <svg aria-hidden="true" viewBox="0 0 48 48" className="absolute inset-0 -rotate-90">
        <circle cx="24" cy="24" r={RADIUS} fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="2" />
        <circle
          cx="24"
          cy="24"
          r={RADIUS}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={CIRC * (1 - progress)}
        />
      </svg>
      <ArrowUp className="relative h-5 w-5" aria-hidden="true" />
    </button>
  );
}
