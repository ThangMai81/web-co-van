import Image from "next/image";
import styles from "./FounderPortraitCard.module.css";

/**
 * Chân dung nhà sáng lập. Hiệu ứng mở ảnh do CSS điều khiển theo
 * data-visible của khối Reveal bao ngoài — không cần JS riêng.
 */
export function FounderPortraitCard() {
  return (
    <div
      className={[
        styles.portraitCard,
        "relative aspect-[4/5] overflow-hidden rounded-2xl border-2 border-yellow shadow-lg shadow-blue/10",
      ].join(" ")}
    >
      <Image
        src="/images/Yến.jpg"
        alt="Shining Coach Yến Lê"
        fill
        sizes="(min-width: 1024px) 50vw, 100vw"
        className="object-cover"
      />
    </div>
  );
}
