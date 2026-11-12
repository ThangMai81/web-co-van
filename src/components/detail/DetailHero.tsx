import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./DetailHero.module.css";

/** Nền hero dùng chung cho trang chi tiết chương trình & khóa học. */
export function DetailHeroBackdrop({ image }: { image?: string | null }) {
  return (
    <div aria-hidden="true" className={styles.backdrop}>
      {image && (
        <Image src={image} alt="" fill sizes="100vw" className={styles.backdropImage} />
      )}
      <div className={styles.backdropShade} />
      <div className={styles.backdropDots} />
      <div className={styles.backdropRay} />
    </div>
  );
}

/** Đường cong mềm ở đáy hero, chuyển sang nền kem của phần nội dung. */
export function DetailHeroCurve({ tone = "cream" }: { tone?: "cream" | "blue" }) {
  return (
    <svg
      aria-hidden="true"
      className={styles.curve}
      style={tone === "blue" ? { color: "var(--color-blue)" } : undefined}
      viewBox="0 0 1440 56"
      preserveAspectRatio="none"
    >
      <path fill="currentColor" d="M0 56V30C240 6 480 0 720 10s480 34 720 16v30H0Z" />
    </svg>
  );
}

/** Khung ảnh có viền vàng lệch phía sau + hiệu ứng xuất hiện. */
export function DetailHeroFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`${styles.frame} ${styles.frameEnter} ${className}`}>{children}</div>;
}

/** Con dấu tròn: chữ chạy vòng quanh, biểu tượng ở giữa. */
export function RotatingSeal({
  text,
  icon,
  className = "",
}: {
  text: string;
  icon: ReactNode;
  className?: string;
}) {
  const ring = `${text} • `;
  return (
    <div className={`${styles.seal} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 120 120" className={styles.sealRing}>
        <defs>
          <path id="seal-circle" d="M60 60m-44 0a44 44 0 1 1 88 0a44 44 0 1 1-88 0" />
        </defs>
        <text
          fill="currentColor"
          fontSize="11"
          fontWeight="800"
          letterSpacing="1.5"
          style={{ textTransform: "uppercase", fontFamily: "Arial, Helvetica, sans-serif" }}
        >
          <textPath href="#seal-circle" textLength="274" lengthAdjust="spacing">
            {ring}
          </textPath>
        </text>
      </svg>
      <span className={styles.sealCenter}>{icon}</span>
    </div>
  );
}

export type MetaItem = {
  icon: ReactNode;
  label: string;
  value: string;
  wide?: boolean;
};

/** Dải thông tin dạng "vé": các ô ngăn bằng đường đứt nét. */
export function MetaStrip({ items, className = "" }: { items: MetaItem[]; className?: string }) {
  if (items.length === 0) return null;
  // Tính vị trí cột để kẻ đường ngăn đúng: ô thứ hai trong một hàng có viền trái.
  const placed: { item: MetaItem; i: number; secondInRow: boolean; lonely: boolean }[] = [];
  let col = 0;
  for (let i = 0; i < items.length; i += 1) {
    const item = items[i];
    let secondInRow = false;
    if (item.wide) {
      col = 0;
    } else if (col === 1) {
      secondInRow = true;
      col = 0;
    } else {
      // ô đầu hàng; nếu ô kế tiếp không rộng thì nó sẽ là ô thứ hai
      col = items[i + 1] && !items[i + 1].wide ? 1 : 0;
    }
    placed.push({ item, i, secondInRow, lonely: !item.wide && !secondInRow && col === 0 });
  }
  return (
    <dl
      className={`grid overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] backdrop-blur-md sm:grid-cols-2 ${className}`}
    >
      {placed.map(({ item, i, secondInRow, lonely }) => (
        <div
          key={item.label}
          className={[
            "flex items-start gap-3 px-5 py-4",
            item.wide || lonely ? "sm:col-span-2" : "",
            i > 0 ? "border-t border-dashed border-white/15" : "",
            secondInRow ? `sm:border-l ${i === 1 ? "sm:border-t-0" : ""}` : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-yellow/15 text-yellow ring-1 ring-yellow/30">
            {item.icon}
          </span>
          <span className="min-w-0">
            <dt className="font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-white/55">
              {item.label}
            </dt>
            <dd className="mt-1 break-words text-[15px] font-semibold leading-snug text-white">
              {item.value}
            </dd>
          </span>
        </div>
      ))}
    </dl>
  );
}

export const detailHeroStyles = styles;
