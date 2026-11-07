"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";

type ProgramGalleryImageViewerProps = {
  programTitle: string;
  images: string[];
  originalImages: string[];
  placeholderImages: boolean[];
  activeIndex: number | null;
  onClose: () => void;
  onSelect: (index: number) => void;
  triggerRefs: { current: Map<number, HTMLButtonElement> };
  originIndexRef: { current: number | null };
};

export default function ProgramGalleryImageViewer({
  programTitle,
  images,
  originalImages,
  placeholderImages,
  activeIndex,
  onClose,
  onSelect,
  triggerRefs,
  originIndexRef,
}: ProgramGalleryImageViewerProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const titleId = useId();
  const instructionsId = useId();
  const onCloseRef = useRef(onClose);
  const isOpen = activeIndex !== null;
  const imageSrc = activeIndex === null ? null : images[activeIndex];
  const isDemoPlaceholder =
    activeIndex !== null && placeholderImages[activeIndex] === true;
  const imageLabel =
    activeIndex === null
      ? ""
      : `${programTitle} — ${isDemoPlaceholder ? "ảnh minh họa" : "ảnh"} ${activeIndex + 1}`;
  const [failedImageSrc, setFailedImageSrc] = useState<string | null>(null);
  const imageFailed = imageSrc !== null && failedImageSrc === imageSrc;

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;

    const dialog = dialogRef.current;
    if (!dialog || typeof dialog.showModal !== "function") {
      onCloseRef.current();
      return;
    }

    const body = document.body;
    const root = document.documentElement;
    const scrollX = window.scrollX;
    const scrollY = window.scrollY;
    const bodyStyles = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    };
    const rootStyles = {
      overflow: root.style.overflow,
      scrollBehavior: root.style.scrollBehavior,
    };

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = `-${scrollX}px`;
    body.style.right = "auto";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    root.style.overflow = "hidden";

    const scrollbarWidth = Math.max(0, window.innerWidth - root.clientWidth);
    if (scrollbarWidth > 0) {
      const currentPadding =
        Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;
      body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
    }

    const restorePage = () => {
      body.style.position = bodyStyles.position;
      body.style.top = bodyStyles.top;
      body.style.left = bodyStyles.left;
      body.style.right = bodyStyles.right;
      body.style.width = bodyStyles.width;
      body.style.overflow = bodyStyles.overflow;
      body.style.paddingRight = bodyStyles.paddingRight;
      root.style.overflow = rootStyles.overflow;
      root.style.scrollBehavior = "auto";
      window.scrollTo(scrollX, scrollY);
      root.style.scrollBehavior = rootStyles.scrollBehavior;

      const originIndex = originIndexRef.current;
      if (originIndex !== null) {
        triggerRefs.current.get(originIndex)?.focus({ preventScroll: true });
      }
      originIndexRef.current = null;
    };

    try {
      dialog.showModal();
    } catch {
      restorePage();
      onCloseRef.current();
      return;
    }

    closeButtonRef.current?.focus({ preventScroll: true });

    return () => {
      if (dialog.open) dialog.close();
      restorePage();
    };
  }, [isOpen, originIndexRef, triggerRefs]);

  const handleDialogKeyDown = (event: ReactKeyboardEvent<HTMLDialogElement>) => {
    if (activeIndex === null) return;

    if (event.key === "ArrowLeft" && activeIndex > 0) {
      event.preventDefault();
      onSelect(activeIndex - 1);
    } else if (event.key === "ArrowRight" && activeIndex < images.length - 1) {
      event.preventDefault();
      onSelect(activeIndex + 1);
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={instructionsId}
      className="max-h-none max-w-none border-0 bg-blue p-0 text-white"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100dvh",
        minHeight: "100vh",
        margin: 0,
        overflow: "hidden",
        backgroundColor: "rgba(9, 24, 45, 0.97)",
      }}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onKeyDown={handleDialogKeyDown}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      {activeIndex !== null && imageSrc && (
        <div className="flex h-full min-h-0 w-full flex-col gap-3 p-3 sm:gap-4 sm:p-5">
          <header className="flex shrink-0 items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h2 id={titleId} className="text-sm font-bold sm:text-base">
                {programTitle} — {isDemoPlaceholder ? "ảnh minh họa" : "ảnh"} {activeIndex + 1} / {images.length}
              </h2>
              <p id={instructionsId} className="mt-1 text-xs leading-relaxed text-white/75">
                {images.length > 1
                  ? "Dùng phím mũi tên để duyệt ảnh, Escape để đóng; ảnh gốc luôn có thể mở riêng."
                  : "Nhấn Escape để đóng; ảnh gốc luôn có thể mở riêng."}
              </p>
            </div>
            <a
              href={originalImages[activeIndex] ?? images[activeIndex]}
              target="_blank"
              rel="noreferrer"
              aria-label={`Mở ảnh gốc ${activeIndex + 1} của chương trình ${programTitle} trong thẻ mới`}
              className="inline-flex min-h-11 shrink-0 items-center rounded-lg border border-white/25 px-3 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow"
            >
              Ảnh gốc
            </a>
            <button
              ref={closeButtonRef}
              type="button"
              className="min-h-11 shrink-0 rounded-lg border border-white/30 px-3 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow"
              onClick={onClose}
            >
              Đóng
            </button>
          </header>

          <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl bg-white/5">
            {!imageFailed && (
              <Image
                src={imageSrc}
                alt={imageLabel}
                fill
                unoptimized
                sizes="100vw"
                className="object-contain"
                onError={() => setFailedImageSrc(imageSrc)}
              />
            )}
            {imageFailed && (
              <p role="alert" className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm">
                Không thể hiển thị ảnh. Bạn vẫn có thể mở ảnh gốc ở trên.
              </p>
            )}
          </div>

          <footer
            className={`flex shrink-0 items-center gap-3 ${
              images.length > 1 ? "justify-between" : "justify-center"
            }`}
          >
            {images.length > 1 && (
              <button
                type="button"
                disabled={activeIndex === 0}
                aria-label={`Ảnh trước của ${programTitle}, vị trí ${activeIndex}`}
                onClick={() => onSelect(activeIndex - 1)}
                className="min-h-11 rounded-lg border border-white/25 px-4 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow disabled:cursor-not-allowed disabled:opacity-45"
              >
                Ảnh trước
              </button>
            )}
            <span
              aria-live="polite"
              aria-atomic="true"
              aria-label={`${programTitle}, ảnh ${activeIndex + 1} trên ${images.length}`}
              className="text-sm font-semibold text-white/75"
            >
              {activeIndex + 1} / {images.length}
            </span>
            {images.length > 1 && (
              <button
                type="button"
                disabled={activeIndex === images.length - 1}
                aria-label={`Ảnh tiếp theo của ${programTitle}, vị trí ${activeIndex + 2}`}
                onClick={() => onSelect(activeIndex + 1)}
                className="min-h-11 rounded-lg border border-white/25 px-4 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow disabled:cursor-not-allowed disabled:opacity-45"
              >
                Ảnh tiếp
              </button>
            )}
          </footer>
        </div>
      )}
    </dialog>
  );
}
