import CourseCategoryIcon from "./CourseCategoryIcon";

export default function CourseCoverIllustration({
  category,
  seed = "",
  iconSize = 44,
}: {
  category?: string;
  seed?: string;
  iconSize?: number;
}) {
  const hash = Array.from(seed).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const glowX = 20 + (hash % 5) * 15;
  const glowY = 18 + (hash % 3) * 22;

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden bg-blue"
      style={{
        backgroundImage: `radial-gradient(circle at ${glowX}% ${glowY}%, rgb(254 206 1 / 0.38), transparent 46%), radial-gradient(circle at ${100 - glowX}% 100%, rgb(255 255 255 / 0.14), transparent 50%)`,
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.12)_1px,transparent_1px)] [background-size:18px_18px] [mask-image:linear-gradient(135deg,#000,transparent_70%)]" />
      <span className="absolute left-1/2 top-1/2 h-[62%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/15" />
      <span className="absolute left-1/2 top-1/2 h-[40%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border border-yellow/40" />
      <span className="absolute left-1/2 top-1/2 flex h-[26%] min-h-14 aspect-square -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-yellow text-blue shadow-lg shadow-black/20">
        <CourseCategoryIcon category={category ?? "coach"} size={iconSize} />
      </span>
    </div>
  );
}
