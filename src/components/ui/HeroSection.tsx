import Image from "next/image";

type Portrait = {
  src: string;
  alt: string;
  name?: string; // tên hiện trên thẻ nhỏ cạnh ảnh (tùy chọn)
  role?: string;
};

const fadeLeft = "linear-gradient(to right, black, transparent 55%)";
const fadeRadial = "radial-gradient(closest-side, black 20%, transparent 100%)";

export default function HeroSection({
  portrait,
  children,
}: {
  portrait?: Portrait;
  children: React.ReactNode;
}) {
  return (
    <header
      className={`relative overflow-hidden border-b-4 border-yellow bg-blue ${portrait ? "pt-[88px]" : "pt-32"}`}
    >
      {/* Lớp 1: nền chuyển sắc */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue via-blue to-navy-light" />

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

      <div className="relative mx-auto max-w-[var(--page-w)] px-6">
        <div
          className={
            portrait ? "grid items-end gap-x-12 lg:grid-cols-[1fr_400px]" : ""
          }
        >
          <div className={portrait ? "pb-14 lg:pb-20" : "pb-16"}>
            {children}
          </div>

          {portrait && (
            <div className="relative mx-auto aspect-[4/5] w-[260px] sm:w-[320px] lg:mx-0 lg:w-full">
              {/* Lớp 3: tia nắng, vầng sáng, vòng tròn, đều neo theo chân dung */}
              {/* <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-[45%] h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2"
                style={{
                  background:
                    "repeating-conic-gradient(from 0deg, rgba(254,206,1,0.14) 0deg 5deg, transparent 5deg 15deg)",
                  maskImage: fadeRadial,
                  WebkitMaskImage: fadeRadial,
                }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-[45%] h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-yellow/25 blur-3xl"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-[45%] h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-yellow/40"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-[45%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-yellow/20"
              /> */}

              {/* Chân dung: object-bottom để cô luôn chạm đáy khung xanh */}
              <Image
                src={portrait.src}
                alt={portrait.alt}
                fill
                priority
                sizes="(min-width: 1024px) 400px, 320px"
                className="z-10 object-contain object-bottom"
              />

              {portrait.name && (
                <div className="absolute -left-2 bottom-8 z-20 rounded-xl border border-white/20 bg-blue/85 px-4 py-3 shadow-lg backdrop-blur-sm sm:-left-6 lg:-left-10">
                  <div className="text-sm font-bold text-white">
                    {portrait.name}
                  </div>
                  {portrait.role && (
                    <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-yellow">
                      {portrait.role}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
