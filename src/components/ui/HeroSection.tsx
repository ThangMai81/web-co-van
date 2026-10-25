import Image from "next/image";
import { Children, isValidElement, type ReactNode } from "react";

type Portrait = {
  src: string;
  alt: string;
  name?: string; // tên hiện trên thẻ nhỏ cạnh ảnh (tùy chọn)
  role?: string;
};

const fadeLeft = "linear-gradient(to right, black, transparent 55%)";

export default function HeroSection({
  portrait,
  portraitAfterHeading = false,
  leadingContent,
  children,
}: {
  portrait?: Portrait;
  portraitAfterHeading?: boolean;
  leadingContent?: ReactNode;
  children: ReactNode;
}) {
  const mobilePortrait: ReactNode | null = portrait ? (
    <div key="mobile-portrait" className="relative mx-auto mb-8 aspect-[1122/1402] w-full max-w-[240px] overflow-hidden rounded-2xl border border-white/20 bg-blue/20 md:max-w-[300px] lg:hidden">
      <Image
        src={portrait.src}
        alt={portrait.alt}
        fill
        priority
        sizes="(min-width: 768px) 300px, 240px"
        className="object-contain object-center"
      />
    </div>
  ) : null;
  const contentChildren = Children.toArray(children);
  const arrangedChildren: ReactNode[] = [];
  let insertedPortrait = false;

  for (const child of contentChildren) {
    arrangedChildren.push(child);
    if (
      portrait &&
      portraitAfterHeading &&
      !insertedPortrait &&
      isValidElement(child) &&
      child.type === "h1"
    ) {
      arrangedChildren.push(mobilePortrait);
      insertedPortrait = true;
    }
  }

  if (portrait && !insertedPortrait) arrangedChildren.push(mobilePortrait);

  return (
    <header
      className={`relative isolate overflow-hidden border-b-4 border-yellow bg-blue ${leadingContent ? "pt-[88px]" : portrait ? "pt-[88px] md:pt-[128px] lg:pt-[88px]" : "pt-32"}`}
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
            ? "grid grid-cols-1 items-center lg:min-h-[532px] lg:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.8fr)] lg:gap-12"
            : ""
        }`}
      >
        <div className={portrait ? "w-full pb-14 lg:py-12" : "w-full pb-16"}>
          {arrangedChildren}
        </div>
        {portrait && (
          <div className="relative mx-auto hidden aspect-[1122/1402] w-full max-w-[420px] lg:block">
            <Image
              src={portrait.src}
              alt={portrait.alt}
              fill
              priority
              sizes="(min-width: 1280px) 420px, (min-width: 1024px) 36vw, 300px"
              className="object-contain object-center"
            />
          </div>
        )}
      </div>
    </header>
  );
}
