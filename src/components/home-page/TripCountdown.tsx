"use client";

import { useEffect, useState } from "react";

/** Ngày khởi hành chuyến leo núi #3 (giờ Việt Nam) — trùng với ngày đang hiển thị trên site. */
const DEPARTURE = new Date("2026-12-03T00:00:00+07:00").getTime();

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function getParts(now: number): Parts | null {
  const diff = DEPARTURE - now;
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function Unit({ value, label }: { value: number; label: string }) {
  const text = String(value).padStart(2, "0");
  return (
    <div className="flex flex-col items-center">
      <div className="relative h-14 w-full overflow-hidden rounded-xl border border-yellow/30 bg-blue/60 md:h-16">
        {/* key đổi theo giá trị => số mới trượt lên */}
        <span
          key={text}
          className="absolute inset-0 grid place-items-center font-display text-2xl font-bold tabular-nums text-yellow motion-safe:animate-[countdown-roll_450ms_cubic-bezier(0.22,1,0.36,1)] md:text-3xl"
        >
          {text}
        </span>
      </div>
      <span className="mt-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">
        {label}
      </span>
    </div>
  );
}

export function TripCountdown() {
  const [parts, setParts] = useState<Parts | null | undefined>(undefined);

  useEffect(() => {
    const update = () => setParts(getParts(Date.now()));
    update();
    const id = window.setInterval(update, 1000);
    return () => window.clearInterval(id);
  }, []);

  // Chưa hydrate: giữ chỗ để tránh nhảy bố cục
  if (parts === undefined) {
    return <div aria-hidden="true" className="h-[5.25rem] md:h-[5.75rem]" />;
  }

  if (parts === null) {
    return (
      <p className="rounded-xl border border-yellow/30 bg-white/5 px-4 py-3 text-sm font-bold text-yellow">
        Hành trình đã khởi hành — hẹn bạn ở chuyến tiếp theo!
      </p>
    );
  }

  return (
    <div>
      <p className="sr-only">
        Còn {parts.days} ngày {parts.hours} giờ đến ngày khởi hành.
      </p>
      <div aria-hidden="true" className="grid grid-cols-4 gap-2">
        <Unit value={parts.days} label="Ngày" />
        <Unit value={parts.hours} label="Giờ" />
        <Unit value={parts.minutes} label="Phút" />
        <Unit value={parts.seconds} label="Giây" />
      </div>
      <style>{`
        @keyframes countdown-roll {
          from { transform: translateY(70%); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
