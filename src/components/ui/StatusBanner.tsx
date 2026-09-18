"use client";

import { useEffect } from "react";

type Variant = "success" | "error";

export function StatusBanner({
  show,
  variant,
  message,
  onClose,
  autoHideMs = 5000,
}: {
  show: boolean;
  variant: Variant;
  message: string;
  onClose: () => void;
  autoHideMs?: number;
}) {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, autoHideMs);
    return () => clearTimeout(timer);
  }, [show, autoHideMs, onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed inset-x-0 top-0 z-[70] flex justify-center px-4 pt-6 transition-transform duration-500 ${
        show ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div
        className={`flex items-center gap-3 rounded-full px-5 py-3 shadow-lg shadow-black/10 ${
          variant === "success" ? "bg-ink text-white" : "bg-rust text-white"
        }`}
      >
        {variant === "success" ? (
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-sun text-ink">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 13l4 4L19 7"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        ) : (
          <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
            !
          </span>
        )}
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={onClose}
          aria-label="Đóng"
          className="ml-2 text-white/60 hover:text-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
