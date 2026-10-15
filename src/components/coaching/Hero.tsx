import Image from "next/image";
import { Reveal } from "@/components/animation/Reveal";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-blue px-6 pb-36 pt-[88px] text-white">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(255,204,0,.16),transparent_30%)]" />
      <div className="relative z-10 mx-auto max-w-[var(--page-w)] px-6">
        <Breadcrumb
          items={[{ label: "Trang chủ", href: "/" }, { label: "Dịch vụ coaching 1:1" }]}
          variant="light"
        />
      </div>
      <div className="relative z-10 mx-auto grid max-w-[var(--page-w)] items-center gap-12 lg:grid-cols-2">
        <Reveal direction="left">
          <div>
            <div className="mb-5 flex items-center gap-3 font-mono text-sm uppercase tracking-widest text-yellow">
              <span className="block h-px w-6 bg-yellow" />
              Dịch vụ coaching 1:1
            </div>
            <h1 className="max-w-2xl font-display text-4xl font-bold leading-[1.08] text-white sm:text-5xl md:text-6xl xl:text-7xl">
              <span className="block"><span className="mr-2 inline-block align-[-0.08em] text-[1.2em] leading-none text-yellow">C</span>ùng bạn</span>
              <span className="mt-2 block font-display font-semibold tracking-tight text-yellow">gỡ rối, mở lối</span>
              <span className="mt-2 block">cho hành trình riêng.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg text-white/80">
              Không phải khoá học đại trà. Đây là không gian riêng để bạn được
              lắng nghe, thấu hiểu và dẫn dắt đến đúng mục tiêu của chính mình.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#booking"
                className="rounded-full bg-yellow px-7 py-3.5 font-mono text-xs uppercase tracking-wider text-blue transition-transform hover:-translate-y-1 hover:brightness-90"
              >
                Đặt lịch tư vấn miễn phí
              </a>
              <a
                href="#process"
                className="rounded-full border border-white/50 px-7 py-3.5 font-mono text-xs uppercase tracking-wider text-white transition-colors hover:border-yellow hover:text-yellow"
              >
                Xem quy trình
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal direction="right">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[48%_48%_1.5rem_1.5rem] shadow-2xl shadow-blue/40">
            <Image
              src="/images/collaborate_team.jpg"
              alt="Coaching 1:1"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
      <svg aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 z-0 h-20 w-full md:h-24" viewBox="0 0 1440 180" preserveAspectRatio="none">
        <path d="M0 100 C180 131 332 87 510 101 C690 115 826 145 1000 119 C1174 93 1302 91 1440 106 L1440 180 L0 180 Z" className="fill-white" />
        <path d="M0 76 C180 108 332 63 510 80 C690 97 826 124 1000 96 C1174 68 1302 63 1440 82" fill="none" className="stroke-yellow" strokeWidth="10" strokeLinecap="round" opacity=".72" />
        <path d="M0 88 C180 119 332 76 510 92 C690 108 826 135 1000 108 C1174 81 1302 78 1440 94" fill="none" className="stroke-white" strokeWidth="5" strokeLinecap="round" opacity=".95" />
        <path d="M0 99 C180 128 332 89 510 103 C690 117 826 143 1000 117 C1174 91 1302 88 1440 104" fill="none" className="stroke-blue" strokeWidth="6" strokeLinecap="round" opacity=".95" />
        <path d="M0 112 C180 139 332 100 510 114 C690 128 826 153 1000 128 C1174 103 1302 101 1440 116" fill="none" className="stroke-yellow" strokeWidth="3" strokeLinecap="round" opacity=".58" />
        <path d="M0 124 C180 148 332 111 510 125 C690 139 826 162 1000 138 C1174 114 1302 114 1440 128" fill="none" className="stroke-blue" strokeWidth="2" strokeLinecap="round" opacity=".82" />
      </svg>
    </section>
  );
}
