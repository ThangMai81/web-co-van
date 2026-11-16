import Image from "next/image";
import { GraduationCap, Heart, Smile, type LucideIcon } from "lucide-react";

type Tile = {
  src: string;
  alt: string;
  label: string;
  Icon: LucideIcon;
  className: string;
  sizes: string;
  priority?: boolean;
};

const TILES: Tile[] = [
  {
    src: "/images/courses/hero-co-yen-viet-bang-16x10.jpg",
    alt: "Coach Yến Lê viết sơ đồ Bánh xe cuộc đời lên bảng trong buổi học",
    label: "Coach",
    Icon: GraduationCap,
    className: "col-span-2 aspect-[16/10]",
    sizes: "(min-width: 1024px) 480px, (min-width: 768px) 320px, 90vw",
    priority: true,
  },
  {
    src: "/images/courses/hero-tre-hoat-dong-nhom-4x3.jpg",
    alt: "Các bạn trẻ cùng giải thử thách nhóm trong hoạt động trải nghiệm của Sunshine Center",
    label: "Trẻ em",
    Icon: Smile,
    className: "aspect-square",
    sizes: "(min-width: 1024px) 235px, (min-width: 768px) 155px, 45vw",
  },
  {
    src: "/images/courses/hero-co-yen-tranh-huong-duong-1x1.jpg",
    alt: "Coach Yến Lê trước bức tranh hoa hướng dương tại Sunshine Center",
    label: "Chữa lành",
    Icon: Heart,
    className: "aspect-square",
    sizes: "(min-width: 1024px) 235px, (min-width: 768px) 155px, 45vw",
  },
];

export default function CoursesHeroCollage() {
  return (
    <div className="relative">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-3 rounded-[2.25rem] border-2 border-yellow/45 md:-inset-4"
      />
      <div className="relative grid grid-cols-2 gap-3 md:gap-4">
        {TILES.map(({ src, alt, label, Icon, className, sizes, priority }) => (
          <figure
            key={src}
            className={`group relative overflow-hidden rounded-[1.6rem] bg-blue/30 shadow-[0_20px_48px_rgba(4,18,42,.35)] ring-1 ring-white/15 ${className}`}
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes={sizes}
              preload={priority}
              className="object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-[1.04]"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-blue/70 to-transparent"
            />
            <figcaption className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-blue shadow-lg shadow-black/20 md:text-sm">
              <Icon size={15} className="text-blue/70" aria-hidden="true" />
              {label}
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="absolute -top-5 right-4 rounded-2xl bg-yellow px-4 py-2 text-right text-blue shadow-xl shadow-black/25 md:-right-6">
        <span className="block font-display text-sm font-bold md:text-base">Coach Yến Lê</span>
        <span className="block text-xs font-semibold text-blue/75">Người đồng hành các khóa học</span>
      </div>
    </div>
  );
}
