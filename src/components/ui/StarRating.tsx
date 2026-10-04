import { Star } from "@/lib/icons";

export default function StarRating({
  value,
  size = 16,
}: {
  value: number;
  size?: number;
}) {
  const rounded = Math.round(value);

  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${value} trên 5 sao`}
    >
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          className={
            n <= rounded
              ? "fill-yellow text-yellow"
              : "fill-transparent text-blue/20"
          }
        />
      ))}
    </div>
  );
}
