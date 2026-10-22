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
  children,
}: {
  portrait?: Portrait;
  portraitAfterHeading?: boolean;
  children: ReactNode;
}) {
  const mobilePortrait: ReactNode | null = portrait ? (
    <div key="mobile-portrait" className="relative mx-auto mb-8 aspect-[1122/1402] w-full max-w-[220px] overflow-hidden rounded-2xl border border-white/20 bg-blue/20 lg:hidden">
      <Image
        src={portrait.src}
        alt={portrait.alt}
        fill
        priority
        sizes="220px"
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
      className={`relative isolate overflow-hidden border-b-4 border-yellow bg-blue ${portrait ? "min-h-[560px] pt-[88px] md:pt-[128px] lg:min-h-[620px] lg:pt-[88px]" : "pt-32"}`}
    >
      {/* Nền xanh liền mạch phía sau ảnh chân dung trên desktop. */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue via-blue to-navy-light" />

      {portrait && (
        <>
          <div className="absolute right-[3%] top-[calc(50%+36px)] hidden aspect-[1122/1402] w-[30vw] max-w-[360px] -translate-y-1/2 bg-blue lg:block">
            <Image
              src={portrait.src}
              alt={portrait.alt}
              fill
              priority
              sizes="(min-width: 1280px) 360px, (min-width: 1024px) 30vw, 220px"
              className="object-contain object-right"
            />
          </div>
          <div aria-hidden="true" className="absolute inset-y-0 right-0 hidden w-[45%] bg-gradient-to-r from-blue via-blue/35 to-transparent lg:block" />
        </>
      )}

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

      <div className={`relative mx-auto max-w-[var(--page-w)] px-6 ${portrait ? "flex min-h-[472px] flex-col items-start lg:min-h-[532px]" : ""}`}>
          <div className={portrait ? "w-full pb-14 lg:max-w-[56%] lg:pb-12" : "w-full pb-16"}>
            {arrangedChildren}
          </div>
      </div>
    </header>
  );
}
