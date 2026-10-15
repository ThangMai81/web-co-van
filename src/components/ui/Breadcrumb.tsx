import Link from "next/link";
import { BackButton } from "@/components/navigation/BackButton";

type Crumb = { label: string; href?: string };

export function Breadcrumb({
  items,
  variant = "default",
}: {
  items: Crumb[];
  variant?: "default" | "light"; // "light" dùng khi đặt trên nền tối (vd ảnh hero)
}) {
  const isLight = variant === "light";

  return (
    <div className={`mb-8 flex flex-wrap items-center justify-between gap-3 rounded-full border px-3 py-2 ${
      isLight ? "border-white/25 bg-blue/35" : "border-blue/10 bg-blue/5"
    }`}>
      <nav aria-label="Breadcrumb" className="flex min-w-0 flex-wrap items-center gap-2 text-xs sm:text-sm">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={item.label} className="flex items-center gap-2">
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className={`font-medium transition-colors hover:text-yellow ${
                  isLight ? "text-white/70" : "text-blue/60"
                }`}
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={
                  isLast
                    ? `rounded-full px-3 py-1.5 font-bold ${isLight ? "bg-yellow text-blue" : "bg-yellow text-blue"}`
                    : `font-medium ${isLight ? "text-white/70" : "text-blue/60"}`
                }
              >
                {item.label}
              </span>
            )}
            {!isLast && (
              <span className={isLight ? "text-white/30" : "text-blue/30"}>
                /
              </span>
            )}
          </span>
        );
      })}
      </nav>
      <BackButton variant={isLight ? "light" : "default"} />
    </div>
  );
}
