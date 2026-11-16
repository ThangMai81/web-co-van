import Image from "next/image";
import type { ReactNode } from "react";
import styles from "./HeroSection.module.css";

type Portrait = {
  src: string;
  alt: string;
  name?: string; // tên hiện trên thẻ nhỏ cạnh ảnh (tùy chọn)
  role?: string;
  secondary?: { src: string; alt: string };
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
  aside,
  children,
}: {
  portrait?: Portrait;
  /** Nội dung tùy chỉnh cho cột phải, dùng thay cho ảnh chân dung. */
  aside?: ReactNode;
  portraitPresentation?: "default" | "courseEditorial";
  leadingContent?: ReactNode;
  children: ReactNode;
}) {
  const isCourseEditorial = portraitPresentation === "courseEditorial";
  const hasSideColumn = Boolean(portrait || aside);

  return (
    <header
      className={`relative isolate overflow-hidden border-b-4 border-yellow bg-blue ${hasSideColumn || leadingContent ? "pt-[88px]" : "pt-32"}`}
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

      {hasSideColumn && (
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
          hasSideColumn
            ? "grid grid-cols-1 items-center md:grid-cols-[minmax(0,1fr)_minmax(260px,320px)] md:gap-10 lg:min-h-[560px] lg:grid-cols-[minmax(0,1fr)_minmax(420px,480px)] lg:gap-14"
            : ""
        }`}
      >
        <div className={hasSideColumn ? "w-full pb-8 md:py-12" : "w-full pb-16"}>
          {children}
        </div>

        {aside && !portrait && (
          <div className="relative mx-auto mb-12 w-full max-w-[420px] md:mb-0 md:max-w-none md:py-12">
            {aside}
          </div>
        )}

        {portrait && (
          <figure
            className={`relative mx-auto mb-12 w-full md:mb-0 md:py-12 lg:mr-0 ${
              portrait.secondary
                ? "max-w-[340px] pl-[22%] md:max-w-none md:pl-[18%]"
                : "max-w-[220px] md:max-w-none"
            }`}
          >
            <div className="relative">
              <span aria-hidden className={styles.portraitOffset} />
              <div
                className={`relative aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] ${
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
                  sizes="(min-width: 1024px) 400px, (min-width: 768px) 270px, 270px"
                  className="object-cover object-[70%_30%]"
                />
                {portrait.name && (
                  <figcaption className="absolute bottom-3 right-3 z-[2] max-w-[44%] rounded-xl bg-blue/85 px-3 py-1.5 text-right text-xs leading-snug text-white/80 shadow-lg shadow-black/20 backdrop-blur-sm md:max-w-[46%] md:text-sm">
                    <span className="block font-bold text-white">{portrait.name}</span>
                    {portrait.role && <span className="hidden sm:inline">{portrait.role}</span>}
                  </figcaption>
                )}
              </div>
            </div>
            {portrait.secondary && (
              <div className="absolute bottom-[-1.5rem] left-0 w-[52%] overflow-hidden rounded-2xl border-4 border-blue shadow-2xl shadow-black/40 md:bottom-6 md:w-[50%]">
                <div className="relative aspect-[4/3]">
                  <Image
                    src={portrait.secondary.src}
                    alt={portrait.secondary.alt}
                    fill
                    sizes="(min-width: 1024px) 240px, 170px"
                    className="object-cover object-center"
                  />
                </div>
              </div>
            )}
          </figure>
        )}
      </div>
    </header>
  );
}
