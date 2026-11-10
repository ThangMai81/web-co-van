"use client";

import { useEffect, useRef, useState } from "react";

type DetailSectionNavItem = {
  id: string;
  label: string;
};

/**
 * Mục lục trang chi tiết: dính dưới header khi cuộn (trong phạm vi khối chứa nó)
 * và tô vàng mục đang đọc (scroll-spy).
 */
export function DetailSectionNav({
  items,
  label,
}: {
  items: DetailSectionNavItem[];
  label: string;
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (items.length === 0) return;
    let frame: number | null = null;

    const compute = () => {
      frame = null;
      const line = window.innerHeight * 0.35;
      let current: string | null = null;
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= line) current = item.id;
      }
      setActiveId(current);
    };

    const onScroll = () => {
      if (frame === null) frame = window.requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [items]);

  // Giữ mục đang đọc trong tầm nhìn khi danh sách tràn ngang (mobile)
  useEffect(() => {
    if (!activeId) return;
    const list = listRef.current;
    const link = list?.querySelector<HTMLElement>(`[data-nav-id="${activeId}"]`);
    if (!list || !link) return;
    // Chỉ cuộn ngang trong danh sách — không kéo cả trang
    const left = link.offsetLeft - list.offsetLeft;
    const right = left + link.offsetWidth;
    if (left < list.scrollLeft) list.scrollLeft = left - 8;
    else if (right > list.scrollLeft + list.clientWidth)
      list.scrollLeft = right - list.clientWidth + 8;
  }, [activeId]);

  if (items.length === 0) return null;

  return (
    <nav
      aria-label={label}
      className="sticky top-[80px] z-20 mt-6 rounded-2xl border border-blue/10 bg-white/90 px-2 py-1 shadow-lg shadow-blue/5 backdrop-blur-md"
    >
      <ul
        ref={listRef}
        className="flex max-w-full gap-2 overflow-x-auto overscroll-x-contain px-1 py-1"
      >
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <li key={item.id} className="shrink-0">
              <a
                href={`#${item.id}`}
                data-nav-id={item.id}
                aria-current={active ? "location" : undefined}
                className={`inline-flex min-h-10 items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 ${
                  active
                    ? "border-yellow bg-yellow text-blue shadow-md shadow-yellow/30"
                    : "border-blue/15 bg-white text-blue hover:border-yellow hover:bg-yellow/10"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`h-1.5 rounded-full bg-blue transition-all duration-300 ${active ? "w-1.5 opacity-100" : "w-0 opacity-0"}`}
                />
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
