"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import type { CourseGalleryItem } from "./courseGalleryData";

/**
 * Lưới ảnh khóa học xếp theo tỉ lệ gốc (masonry bằng CSS columns) — poster không bị cắt.
 * Bấm vào ảnh để xem lớn; phím ← → để chuyển, Esc để đóng.
 */
export default function CourseGallery({
  title,
  items,
}: {
  title: string;
  items: CourseGalleryItem[];
}) {
  const [active, setActive] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const open = (i: number) => {
    setActive(i);
    dialogRef.current?.showModal();
  };
  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);
  const step = useCallback(
    (d: number) =>
      setActive((cur) => (cur === null ? cur : (cur + d + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () => {
      setActive((cur) => {
        if (cur !== null) triggerRefs.current[cur]?.focus();
        return null;
      });
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    dialog.addEventListener("close", onClose);
    dialog.addEventListener("keydown", onKey);
    return () => {
      dialog.removeEventListener("close", onClose);
      dialog.removeEventListener("keydown", onKey);
    };
  }, [step]);

  if (items.length === 0) return null;
  const current = active === null ? null : items[active];

  return (
    <section aria-labelledby="course-gallery-heading">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-blue/55">
            Hình ảnh khóa học
          </p>
          <h2 id="course-gallery-heading" className="mt-1 font-display text-2xl font-bold text-blue md:text-3xl">
            Lớp học & tài liệu chính thức
          </h2>
        </div>
        <p className="text-sm text-blue/60">{items.length} ảnh · bấm để xem lớn</p>
      </div>

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {items.map((item, i) => (
          <button
            key={item.src}
            ref={(el) => {
              triggerRefs.current[i] = el;
            }}
            type="button"
            onClick={() => open(i)}
            aria-label={`Xem lớn: ${item.alt}`}
            className={`group relative block w-full break-inside-avoid overflow-hidden rounded-2xl border shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow focus-visible:ring-offset-2 ${
              item.kind === "poster" ? "border-yellow/60 bg-blue p-2" : "border-blue/10 bg-blue/5"
            }`}
          >
            <Image
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              sizes="(min-width: 1024px) 18rem, (min-width: 640px) 45vw, 92vw"
              className={`h-auto w-full transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04] motion-reduce:transition-none ${
                item.kind === "poster" ? "rounded-xl" : ""
              }`}
            />
            <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-blue shadow">
              {item.kind === "poster" ? "Poster chính thức" : "Ảnh thực tế"}
            </span>
            <span className="pointer-events-none absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-yellow text-blue opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
              <Expand size={16} aria-hidden="true" />
            </span>
          </button>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        aria-label={`Ảnh khóa học ${title}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
        className="m-auto max-h-[94vh] w-[min(96vw,72rem)] overflow-visible bg-transparent p-0 backdrop:bg-blue/85 backdrop:backdrop-blur-sm"
      >
        {current && (
          <figure className="relative flex flex-col items-center">
            <Image
              key={current.src}
              src={current.src}
              alt={current.alt}
              width={current.width}
              height={current.height}
              sizes="96vw"
              className="h-auto max-h-[82vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
            />
            <figcaption className="mt-3 max-w-2xl text-center text-sm text-white/85">
              {current.alt} · {active! + 1}/{items.length}
            </figcaption>
            <button
              type="button"
              onClick={close}
              aria-label="Đóng"
              className="absolute -top-3 right-0 grid h-11 w-11 place-items-center rounded-full bg-white text-blue shadow-lg sm:-right-3"
            >
              <X size={20} aria-hidden="true" />
            </button>
            {items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Ảnh trước"
                  className="absolute left-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-blue shadow-lg hover:bg-yellow"
                >
                  <ChevronLeft size={22} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Ảnh sau"
                  className="absolute right-2 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-blue shadow-lg hover:bg-yellow"
                >
                  <ChevronRight size={22} aria-hidden="true" />
                </button>
              </>
            )}
          </figure>
        )}
      </dialog>
    </section>
  );
}
