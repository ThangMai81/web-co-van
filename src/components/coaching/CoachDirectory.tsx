"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { Coach } from "@/data/coaches";
import { Reveal } from "@/components/animation/Reveal";

const FILTERS = ["Tất cả", "Bình an nội tâm", "Sự nghiệp", "Gia đình & quan hệ", "Chuyển hoá", "Giá trị bản thân"];

export function CoachDirectory({ coaches }: { coaches: Coach[] }) {
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const visibleCoaches = useMemo(
    () => activeFilter === "Tất cả" ? coaches : coaches.filter((coach) => coach.focusAreas.includes(activeFilter)),
    [activeFilter, coaches],
  );

  return (
    <>
      <div className="mb-10 flex flex-wrap gap-3" aria-label="Lọc theo lĩnh vực đồng hành">
        {FILTERS.map((filter) => (
          <button key={filter} type="button" onClick={() => setActiveFilter(filter)} aria-pressed={activeFilter === filter}
            className={`rounded-full border px-5 py-2.5 text-sm font-semibold transition ${activeFilter === filter ? "border-yellow bg-yellow text-blue" : "border-white/30 text-white hover:border-yellow hover:text-yellow"}`}>
            {filter}
          </button>
        ))}
      </div>
      {visibleCoaches.length ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {visibleCoaches.map((coach, index) => (
            <Reveal key={coach.slug} direction="up" delay={index * 70} repeat>
              <article className="group h-full overflow-hidden rounded-[1.5rem] border border-white/15 bg-white text-blue shadow-lg shadow-black/10 transition hover:-translate-y-1 hover:shadow-2xl">
                <Link href={`/coaching/${coach.slug}`} className="flex h-full flex-col focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow">
                  <div className="relative aspect-[4/4.5] overflow-hidden bg-blue/10">
                    {coach.image ? <Image src={coach.image} alt={coach.name} fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-500 group-hover:scale-105" /> : (
                      <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,.85),transparent_40%),linear-gradient(145deg,var(--coach-accent),#172d55)]" style={{ "--coach-accent": coach.accent } as CSSProperties}>
                        <span className="font-display text-7xl font-bold text-white drop-shadow-lg">{coach.initials}</span>
                      </div>
                    )}
                    {coach.isDemo && <span className="absolute left-4 top-4 rounded-full bg-blue/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-yellow">Hồ sơ demo</span>}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue/55">{coach.title}</p>
                    <h3 className="mt-2 min-h-16 font-display text-2xl font-bold">{coach.name}</h3>
                    <p className="mt-3 min-h-[4.5rem] line-clamp-3 text-sm leading-6 text-blue/70">{coach.quote}</p>
                    <div className="mt-5 flex min-h-8 flex-wrap content-start gap-2">{coach.focusAreas.slice(0, 2).map((area) => <span key={area} className="rounded-full bg-blue/5 px-3 py-1 text-[10px] font-semibold text-blue/75">{area}</span>)}</div>
                    <div className="mt-auto flex items-center justify-between border-t border-blue/10 pt-4 text-sm font-bold"><span>Xem hồ sơ</span><span className="text-yellow transition group-hover:translate-x-1" aria-hidden="true">→</span></div>
                  </div>
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      ) : <p className="rounded-2xl border border-white/20 bg-white/5 p-8 text-center text-white/75">Chưa có người đồng hành trong lĩnh vực này.</p>}
    </>
  );
}
