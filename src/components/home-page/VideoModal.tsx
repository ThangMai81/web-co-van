"use client";

import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import { X } from "@/lib/icons";
import type { Video } from "@/types/video";

export default function VideoModal({
  video,
  onClose,
  originRect,
  returnFocusElement,
}: {
  video: Video;
  onClose: () => void;
  originRect: DOMRect | null;
  returnFocusElement: HTMLButtonElement | null;
}) {
  const titleId = useId();
  const [playerMounted, setPlayerMounted] = useState(true);
  const dialogRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const mediaAnimationRef = useRef<Animation | null>(null);
  const backdropAnimationRef = useRef<Animation | null>(null);
  const onCloseRef = useRef(onClose);
  const closingRef = useRef(false);
  onCloseRef.current = onClose;

  useLayoutEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const previousInertStates: Array<{ element: HTMLElement; wasInert: boolean }> = [];
    let branch: HTMLElement | null = dialogRef.current;
    while (branch?.parentElement) {
      const parent = branch.parentElement;
      for (const sibling of Array.from(parent.children)) {
        if (sibling === branch || !(sibling instanceof HTMLElement)) continue;
        previousInertStates.push({ element: sibling, wasInert: sibling.inert });
        sibling.inert = true;
      }
      if (parent === document.body) break;
      branch = parent;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDialogRef.current();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      previousInertStates.forEach(({ element, wasInert }) => {
        element.inert = wasInert;
      });
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const closeDialogRef = useRef<() => void>(() => {});

  useLayoutEffect(() => {
    closeButtonRef.current?.focus({ preventScroll: true });

    let prefersReducedMotion = true;
    try {
      prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      prefersReducedMotion = true;
    }

    const media = mediaRef.current;
    if (!prefersReducedMotion && media && originRect && typeof media.animate === "function") {
      const targetRect = media.getBoundingClientRect();
      if (targetRect.width > 0 && targetRect.height > 0 && originRect.width > 0 && originRect.height > 0) {
        const translateX = originRect.left - targetRect.left;
        const translateY = originRect.top - targetRect.top;
        const scaleX = originRect.width / targetRect.width;
        const scaleY = originRect.height / targetRect.height;
        try {
          const animation = media.animate(
            [
              {
                transformOrigin: "top left",
                transform: `translate(${translateX}px, ${translateY}px) scale(${scaleX}, ${scaleY})`,
                opacity: 0.94,
              },
              { transformOrigin: "top left", transform: "translate(0, 0) scale(1, 1)", opacity: 1 },
            ],
            { duration: 340, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "both" },
          );
          mediaAnimationRef.current = animation;
          void animation.finished.catch(() => undefined);
        } catch {
          mediaAnimationRef.current = null;
        }
      }

      const backdrop = backdropRef.current;
      if (backdrop && typeof backdrop.animate === "function") {
        try {
          const animation = backdrop.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: 220,
            easing: "ease-out",
            fill: "both",
          });
          backdropAnimationRef.current = animation;
          void animation.finished.catch(() => undefined);
        } catch {
          backdropAnimationRef.current = null;
        }
      }
    }

    return () => {
      mediaAnimationRef.current?.cancel();
      backdropAnimationRef.current?.cancel();
    };
  }, [originRect]);

  const closeDialog = () => {
    if (closingRef.current) return;
    closingRef.current = true;
    closeButtonRef.current?.focus({ preventScroll: true });
    setPlayerMounted(false);

    const animations = [mediaAnimationRef.current, backdropAnimationRef.current].filter(
      (animation): animation is Animation => Boolean(animation && animation.playState !== "idle"),
    );
    animations.forEach((animation) => {
      try {
        animation.reverse();
      } catch {
        // Fall back to closing immediately when a browser cannot reverse the animation.
      }
    });

    const finishClose = () => {
      onCloseRef.current();
      window.requestAnimationFrame(() => {
        if (returnFocusElement?.isConnected) {
          returnFocusElement.focus({ preventScroll: true });
        }
      });
    };

    if (animations.length === 0) {
      finishClose();
      return;
    }

    void Promise.all(animations.map((animation) => animation.finished.catch(() => undefined)))
      .then(finishClose);
  };
  closeDialogRef.current = closeDialog;

  const handleDialogKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(
      'button:not([disabled]), iframe, a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"]):not([data-dialog-focus-guard])',
    ));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) {
      event.preventDefault();
      dialog.focus();
      return;
    }

    const activeElement = document.activeElement;
    if (event.shiftKey && (activeElement === first || !dialog.contains(activeElement))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (activeElement === last || !dialog.contains(activeElement))) {
      event.preventDefault();
      first.focus();
    }
  };

  const handleBackdropClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) closeDialog();
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      tabIndex={-1}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onKeyDown={handleDialogKeyDown}
      onClick={handleBackdropClick}
    >
      <div
        ref={backdropRef}
        aria-hidden="true"
        className="absolute inset-0 bg-blue/90"
        onClick={closeDialog}
      />
      <h2 id={titleId} className="sr-only">{video.title}</h2>
      <button
        ref={closeButtonRef}
        type="button"
        onClick={closeDialog}
        aria-label="Đóng video"
        className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow"
      >
        <X size={20} />
      </button>

      <div
        ref={mediaRef}
        className="relative z-10 aspect-video w-full max-w-4xl overflow-hidden rounded-xl shadow-2xl"
      >
        {/* Chỉ iframe này mới thật sự load lúc bấm play, không load sẵn cho cả 6 video cùng lúc */}
        {playerMounted && (
          <iframe
            src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        )}
      </div>
      <span
        data-dialog-focus-guard
        tabIndex={0}
        className="sr-only"
        onFocus={() => closeButtonRef.current?.focus({ preventScroll: true })}
      />
    </div>
  );
}
