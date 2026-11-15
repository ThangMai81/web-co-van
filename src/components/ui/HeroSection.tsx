import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./HeroSection.module.css";

type Portrait = {
  src: string;
  alt: string;
  name?: string; // tên hiện trên thẻ nhỏ cạnh ảnh (tùy chọn)
  role?: string;
};

const fadeLeft = "linear-gradient(to right, black, transparent 55%)";

/**
 * Hero dạng banner: chữ bên trái, ảnh (poster dọc 4:5) đặt trong khung riêng bên phải.
 * - Chỉ render MỘT ảnh cho mọi kích thước màn hình (trước đây có 2 bản mobile/desktop
 *   cùng được preload).
 * - Điện thoại: ảnh nhỏ gọn nằm sau nội dung để danh sách bên dưới không bị đẩy quá xa.
 * - Từ tablet (md) trở lên: 2 cột, ảnh luôn cách viền vàng phía dưới.
 */
export default function HeroSection({
  portrait,
  portraitPresentation = "default",
  leadingContent,
  children,
}: {
  portrait?: Portrait;
  portraitPresentation?: "default" | "courseEditorial";
  leadingContent?: ReactNode;
  children: ReactNode;
}) {
  const isCourseEditorial = portraitPresentation === "courseEditorial";

  return (
    <header
      className={`relative isolate overflow-hidden border-b-4 border-yellow bg-blue ${portrait || leadingContent ? "pt-[88px]" : "pt-32"}`}
    >
      {/* Lớp 2: lưới chấm mờ dần về bên phải */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.13) 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
          maskImage: fadeLeft,
          WebkitMaskImage: fadeLeft,
        }}
      />

      {portrait && (
        // Quầng sáng vàng sau ảnh, chỉ để trang trí
        <div aria-hidden className={styles.portraitGlow} />
      )}

      {leadingContent && (
        <div className="relative z-10 px-6">
          <div className="mx-auto max-w-[var(--page-w)] px-6">
            {leadingContent}
          </div>
        </div>
      )}

      <div
        className={`relative mx-auto max-w-[var(--page-w)] px-6 ${
          portrait
            ? "grid grid-cols-1 items-center md:grid-cols-[minmax(0,1fr)_minmax(200px,240px)] md:gap-10 lg:min-h-[520px] lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,380px)] lg:gap-16"
            : ""
        }`}
      >
        <div className={portrait ? "w-full pb-8 md:py-12" : "w-full pb-16"}>
          {children}
        </div>

        {portrait && (
          <figure className="relative mx-auto mb-10 w-full max-w-[200px] md:mb-0 md:max-w-none md:py-12 lg:ml-auto lg:mr-0">
            <span aria-hidden className={styles.portraitOffset} />
            <div
              className={`relative aspect-[1122/1402] w-full overflow-hidden rounded-[1.5rem] ${
                isCourseEditorial
                  ? styles.courseEditorialPortrait
                  : "border border-white/20 bg-blue/20"
              }`}
            >
              <Image
                src={portrait.src}
                alt={portrait.alt}
                fill
                preload
                sizes="(min-width: 1024px) 380px, (min-width: 768px) 240px, 200px"
                className="object-cover object-center"
              />
            </div>
            {portrait.name && (
              <figcaption className="mt-3 text-center text-sm text-white/75">
                <span className="font-bold text-white">{portrait.name}</span>
                {portrait.role ? ` · ${portrait.role}` : null}
              </figcaption>
            )}
          </figure>
        )}
      </div>
    </header>
  );
}
