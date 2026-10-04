import Link from "next/link";

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
    <nav
      aria-label="Breadcrumb"
      className="mb-8 flex flex-wrap items-center gap-2 text-sm"
    >
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
                    ? `font-bold ${isLight ? "text-white" : "text-blue"}`
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
  );
}
