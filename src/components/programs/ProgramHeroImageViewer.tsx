"use client";

import Image from "next/image";
import { createPortal } from "react-dom";
import { useEffect, useId, useRef, useState } from "react";
import type {
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from "react";

type ProgramHeroImageViewerProps = {
  src: string;
  alt: string;
  priority: boolean;
  sizes: string;
  viewerEnabled: boolean;
};

type ImageTransform = {
  scale: number;
  x: number;
  y: number;
};

type Point = {
  x: number;
  y: number;
};

const MIN_SCALE = 1;
const MAX_SCALE = 8;
const PAN_STEP = 72;

const controlClassName =
  "flex h-11 w-11 items-center justify-center rounded-lg border border-white/25 bg-white/10 text-lg font-bold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow disabled:cursor-not-allowed disabled:opacity-45";

function InteractiveProgramHeroImageViewer({
  src,
  alt,
  priority,
  sizes,
}: Omit<ProgramHeroImageViewerProps, "viewerEnabled">) {
  const [isOpen, setIsOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [viewerUnavailable, setViewerUnavailable] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const transformRef = useRef<ImageTransform>({ scale: MIN_SCALE, x: 0, y: 0 });
  const pointersRef = useRef<Map<number, Point>>(new Map());
  const dragStartRef = useRef<{
    x: number;
    y: number;
    offsetX: number;
    offsetY: number;
  } | null>(null);
  const pinchStartRef = useRef<{ distance: number; scale: number } | null>(null);
  const titleId = useId();
  const instructionsId = useId();

  const applyTransform = (next: ImageTransform) => {
    const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, next.scale));
    const viewport = viewportRef.current;
    const image = imageRef.current;
    let maxX = 0;
    let maxY = 0;

    if (viewport && image?.naturalWidth && image.naturalHeight) {
      const fit = Math.min(
        viewport.clientWidth / image.naturalWidth,
        viewport.clientHeight / image.naturalHeight,
        1,
      );
      maxX = Math.max(0, (image.naturalWidth * fit * scale - viewport.clientWidth) / 2);
      maxY = Math.max(0, (image.naturalHeight * fit * scale - viewport.clientHeight) / 2);
    }

    const x = Math.max(-maxX, Math.min(maxX, next.x));
    const y = Math.max(-maxY, Math.min(maxY, next.y));
    transformRef.current = { scale, x, y };

    if (image) {
      image.style.transform = `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), 0) scale(${scale})`;
    }
  };

  const closeViewer = () => {
    pointersRef.current.clear();
    dragStartRef.current = null;
    pinchStartRef.current = null;
    if (dialogRef.current?.open) dialogRef.current.close();
    applyTransform({ scale: MIN_SCALE, x: 0, y: 0 });
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return;

    const dialog = dialogRef.current;
    if (!dialog) {
      setViewerUnavailable(true);
      setIsOpen(false);
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
      const currentPadding = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;
      body.style.paddingRight = `${currentPadding + scrollbarWidth}px`;
    }

    try {
      dialog.showModal();
    } catch {
      body.style.position = bodyStyles.position;
      body.style.top = bodyStyles.top;
      body.style.left = bodyStyles.left;
      body.style.right = bodyStyles.right;
      body.style.width = bodyStyles.width;
      body.style.overflow = bodyStyles.overflow;
      body.style.paddingRight = bodyStyles.paddingRight;
      root.style.overflow = rootStyles.overflow;
      window.scrollTo(scrollX, scrollY);
      setViewerUnavailable(true);
      setIsOpen(false);
      return;
    }

    closeButtonRef.current?.focus({ preventScroll: true });

    return () => {
      if (dialog.open) dialog.close();
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
      triggerRef.current?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  const zoomBy = (factor: number) => {
    const current = transformRef.current;
    applyTransform({ ...current, scale: current.scale * factor });
  };

  const panBy = (x: number, y: number) => {
    const current = transformRef.current;
    applyTransform({ ...current, x: current.x + x, y: current.y + y });
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!imageLoaded || (event.pointerType === "mouse" && event.button !== 0)) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    const pointers = pointersRef.current;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.size === 1) {
      const current = transformRef.current;
      dragStartRef.current = {
        x: event.clientX,
        y: event.clientY,
        offsetX: current.x,
        offsetY: current.y,
      };
      pinchStartRef.current = null;
    } else if (pointers.size === 2) {
      const [first, second] = Array.from(pointers.values());
      const distance = Math.hypot(second.x - first.x, second.y - first.y);
      pinchStartRef.current = { distance: Math.max(distance, 1), scale: transformRef.current.scale };
      dragStartRef.current = null;
    }

    if (viewportRef.current) viewportRef.current.style.cursor = "grabbing";
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const pointers = pointersRef.current;
    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (pointers.size >= 2 && pinchStartRef.current) {
      const [first, second] = Array.from(pointers.values());
      const distance = Math.hypot(second.x - first.x, second.y - first.y);
      const pinchStart = pinchStartRef.current;
      applyTransform({
        ...transformRef.current,
        scale: pinchStart.scale * (distance / pinchStart.distance),
      });
      return;
    }

    const dragStart = dragStartRef.current;
    if (pointers.size === 1 && dragStart) {
      applyTransform({
        ...transformRef.current,
        x: dragStart.offsetX + event.clientX - dragStart.x,
        y: dragStart.offsetY + event.clientY - dragStart.y,
      });
    }
  };

  const finishPointer = (event: ReactPointerEvent<HTMLDivElement>) => {
    const pointers = pointersRef.current;
    pointers.delete(event.pointerId);

    if (pointers.size === 1) {
      const [remaining] = Array.from(pointers.values());
      const current = transformRef.current;
      dragStartRef.current = {
        x: remaining.x,
        y: remaining.y,
        offsetX: current.x,
        offsetY: current.y,
      };
      pinchStartRef.current = null;
    } else if (pointers.size === 0) {
      dragStartRef.current = null;
      pinchStartRef.current = null;
    }

    if (viewportRef.current) {
      viewportRef.current.style.cursor = transformRef.current.scale > 1 ? "grab" : "default";
    }
  };

  const handleBackdropClick = (event: ReactMouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) closeViewer();
  };

  const handleDialogKeyDown = (event: ReactKeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== "Tab") return;

    const dialog = event.currentTarget;
    const focusableElements = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"]), [contenteditable="true"]',
      ),
    ).filter((element) => element.tabIndex >= 0 && element.getClientRects().length > 0);

    if (focusableElements.length === 0) {
      event.preventDefault();
      dialog.focus();
      return;
    }

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];
    const activeElement = dialog.ownerDocument.activeElement;

    if (event.shiftKey && (activeElement === first || !dialog.contains(activeElement))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (activeElement === last || !dialog.contains(activeElement))) {
      event.preventDefault();
      first.focus();
    }
  };

  const viewer = isOpen ? (
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
        closeViewer();
      }}
      onClose={() => setIsOpen(false)}
      onKeyDown={handleDialogKeyDown}
      onClick={handleBackdropClick}
    >
      <div
        className="flex h-full min-h-0 w-full flex-col gap-3 p-3 sm:gap-4 sm:p-5"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeViewer();
        }}
      >
        <header className="flex shrink-0 items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="break-words text-sm font-bold sm:text-base">
              {alt}
            </h2>
            <p id={instructionsId} className="mt-1 text-xs leading-relaxed text-white/75">
              Kéo để di chuyển; chụm hoặc tách hai ngón để phóng to. Có thể dùng các nút bên dưới.
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="min-h-11 shrink-0 rounded-lg border border-white/30 px-3 text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow"
            onClick={closeViewer}
          >
            Đóng
          </button>
        </header>

        <div
          ref={viewportRef}
          className="relative min-h-0 flex-1 touch-none select-none overflow-hidden rounded-xl bg-white/5"
          style={{ touchAction: "none" }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishPointer}
          onPointerCancel={finishPointer}
        >
          {!imageFailed && (
            <Image
              ref={imageRef}
              src={src}
              alt={alt}
              fill
              unoptimized
              sizes="100vw"
              draggable={false}
              className="object-contain"
              style={{
                left: "50%",
                top: "50%",
                transform: "translate3d(-50%, -50%, 0) scale(1)",
                transformOrigin: "center center",
              }}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageLoaded(false);
                setImageFailed(true);
              }}
            />
          )}
          {imageFailed ? (
            <p role="alert" className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm">
              Không thể tải ảnh gốc. Bạn vẫn có thể đóng cửa sổ và tiếp tục xem trang.
            </p>
          ) : !imageLoaded ? (
            <p role="status" className="absolute inset-0 flex items-center justify-center text-sm text-white/75">
              Đang tải ảnh gốc…
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 justify-center">
          <div className="grid grid-cols-3 gap-2" role="group" aria-label="Điều khiển ảnh">
            <button type="button" className={controlClassName} aria-label="Thu nhỏ ảnh" disabled={!imageLoaded} onClick={() => zoomBy(1 / 1.5)}>
              −
            </button>
            <button type="button" className={controlClassName} aria-label="Phóng to ảnh" disabled={!imageLoaded} onClick={() => zoomBy(1.5)}>
              +
            </button>
            <button type="button" className={controlClassName} aria-label="Đặt lại ảnh" disabled={!imageLoaded} onClick={() => applyTransform({ scale: MIN_SCALE, x: 0, y: 0 })}>
              ↺
            </button>
            <span aria-hidden="true" />
            <button type="button" className={controlClassName} aria-label="Di chuyển ảnh lên trên" disabled={!imageLoaded} onClick={() => panBy(0, -PAN_STEP)}>
              ↑
            </button>
            <span aria-hidden="true" />
            <button type="button" className={controlClassName} aria-label="Di chuyển ảnh sang trái" disabled={!imageLoaded} onClick={() => panBy(-PAN_STEP, 0)}>
              ←
            </button>
            <button type="button" className={controlClassName} aria-label="Di chuyển ảnh xuống dưới" disabled={!imageLoaded} onClick={() => panBy(0, PAN_STEP)}>
              ↓
            </button>
            <button type="button" className={controlClassName} aria-label="Di chuyển ảnh sang phải" disabled={!imageLoaded} onClick={() => panBy(PAN_STEP, 0)}>
              →
            </button>
          </div>
        </div>
      </div>
    </dialog>
  ) : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label={
          viewerUnavailable
            ? `Trình xem ảnh chương trình ${alt} hiện không khả dụng`
            : `Phóng to ảnh chương trình ${alt}`
        }
        title={viewerUnavailable ? "Trình xem ảnh hiện không khả dụng" : "Phóng to ảnh"}
        disabled={viewerUnavailable}
        className="absolute inset-0 h-full w-full cursor-zoom-in rounded-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-yellow disabled:cursor-default"
        onClick={() => {
          setImageLoaded(false);
          setImageFailed(false);
          setIsOpen(true);
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className="object-contain object-center"
        />
      </button>
      {viewer && typeof document !== "undefined" ? createPortal(viewer, document.body) : null}
    </>
  );
}

export default function ProgramHeroImageViewer({
  src,
  alt,
  priority,
  sizes,
  viewerEnabled,
}: ProgramHeroImageViewerProps) {
  if (!viewerEnabled) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-contain object-center"
      />
    );
  }

  return (
    <InteractiveProgramHeroImageViewer
      src={src}
      alt={alt}
      priority={priority}
      sizes={sizes}
    />
  );
}
