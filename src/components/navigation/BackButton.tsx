"use client";

export function BackButton({ variant = "default" }: { variant?: "default" | "light" }) {
  return (
    <button
      type="button"
      onClick={() => {
        if (window.history.length > 1) window.history.back();
        else window.location.assign("/");
      }}
      className={`group inline-flex items-center gap-2 rounded-full border px-4 py-2.5 font-mono text-[10px] font-bold uppercase tracking-wider shadow-md backdrop-blur transition hover:-translate-x-1 ${
        variant === "light"
          ? "border-yellow bg-yellow text-blue hover:bg-white"
          : "border-blue bg-blue text-white hover:border-yellow hover:bg-yellow hover:text-blue"
      }`}
      aria-label="Quay lại trang trước"
    >
      <span aria-hidden="true" className="text-base leading-none transition-transform group-hover:-translate-x-0.5">←</span>
      Quay lại
    </button>
  );
}
