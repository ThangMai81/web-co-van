import type { ReactNode } from "react";

/**
 * Đầu mục thống nhất cho các chương của trang Sứ mệnh:
 * số chương viền nét lớn + nhãn nhỏ, khớp thanh điều hướng 01–05.
 */
export function ChapterMark({
  number,
  label,
  tone = "light",
  align = "left",
  children,
}: {
  number: string;
  label: string;
  tone?: "light" | "dark" | "sun";
  align?: "left" | "center";
  children?: ReactNode;
}) {
  const strokeColor =
    tone === "dark" ? "rgba(254, 206, 1, 0.75)" : tone === "sun" ? "rgba(24, 37, 68, 0.5)" : "rgba(24, 37, 68, 0.3)";
  const labelColor = tone === "dark" ? "text-yellow" : tone === "sun" ? "text-blue" : "text-yellow";
  return (
    <div className={`mb-6 flex items-end gap-4 ${align === "center" ? "justify-center" : ""}`}>
      <span
        aria-hidden="true"
        className="font-display text-6xl font-bold leading-none md:text-7xl"
        style={{ color: "transparent", WebkitTextStroke: `1.5px ${strokeColor}` }}
      >
        {number}
      </span>
      <span className="pb-2">
        <span className={`flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[.2em] ${labelColor}`}>
          <span className="block h-px w-6 bg-current" />
          {label}
        </span>
        {children}
      </span>
    </div>
  );
}
