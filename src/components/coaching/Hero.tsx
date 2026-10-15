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
            <div className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-yellow">
              <span className="block h-px w-6 bg-yellow" />
              Dịch vụ coaching 1:1
            </div>
            <h1 className="max-w-2xl font-display text-4xl font-bold leading-[1.08] text-white sm:text-5xl md:text-6xl xl:text-7xl">
              <span className="block"><span className="mr-2 inline-block align-[-0.08em] text-[1.2em] leading-none text-yellow">C</span>ùng bạn</span>
              <span className="mt-2 block font-serif font-medium italic text-yellow">gỡ rối, mở lối</span>
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
      <svg aria-hidden="true" className="pointer-events-none absolute bottom-0 left-0 z-0 h-24 w-full md:h-32" viewBox="0 0 1440 180" preserveAspectRatio="none">
        <path d="M0 94 C180 57 332 118 510 96 C690 74 826 130 1000 104 C1174 78 1302 82 1440 96 L1440 180 L0 180 Z" className="fill-white" />
        <path d="M0 72 C180 105 332 60 510 78 C690 96 826 120 1000 91 C1174 62 1302 58 1440 78" fill="none" className="stroke-yellow" strokeWidth="17" strokeLinecap="round" />
        <path d="M0 105 C180 77 332 133 510 113 C690 92 826 148 1000 122 C1174 96 1302 102 1440 116" fill="none" className="stroke-blue" strokeWidth="5" strokeLinecap="round" />
      </svg>
    </section>
  );
}
