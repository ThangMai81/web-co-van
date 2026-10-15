import Image from "next/image";

type Portrait = {
  src: string;
  alt: string;
  name?: string; // tên hiện trên thẻ nhỏ cạnh ảnh (tùy chọn)
  role?: string;
};

const fadeLeft = "linear-gradient(to right, black, transparent 55%)";

export default function HeroSection({
  portrait,
  children,
}: {
  portrait?: Portrait;
  children: React.ReactNode;
}) {
  return (
    <header
      className={`relative isolate overflow-hidden border-b-4 border-yellow bg-blue ${portrait ? "min-h-[600px] pt-[88px] lg:min-h-[720px]" : "pt-32"}`}
    >
      {/* Nền xanh; ảnh chân dung kéo kín từ mép đầu tới chân hero ở desktop. */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue via-blue to-navy-light" />

      {portrait && (
        <>
          <div className="absolute inset-y-10 right-0 hidden w-[42%] lg:block">
            <Image
              src={portrait.src}
              alt={portrait.alt}
              fill
              priority
              sizes="(min-width: 1024px) 42vw, 100vw"
              className="object-cover object-[center_30%]"
            />
          </div>
          <div aria-hidden="true" className="absolute inset-y-10 right-0 hidden w-[54%] bg-gradient-to-r from-blue via-blue/50 to-transparent lg:block" />
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

      <div className={`relative mx-auto max-w-[var(--page-w)] px-6 ${portrait ? "flex min-h-[512px] flex-col items-start lg:min-h-[632px]" : ""}`}>
          <div className={portrait ? "w-full pb-14 lg:max-w-[56%] lg:pb-12" : "w-full pb-16"}>
            {children}
          </div>

          {portrait && (
            <div className="relative mx-auto mb-8 aspect-[4/5] w-[260px] overflow-hidden rounded-2xl border border-white/20 bg-blue/20 sm:w-[320px] lg:hidden">
              <Image
                src={portrait.src}
                alt={portrait.alt}
                fill
                priority
                sizes="(min-width: 1024px) 400px, 320px"
                className="object-cover object-top"
              />
            </div>
          )}
      </div>
    </header>
  );
}
