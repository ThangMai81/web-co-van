import Image from "next/image";
import { Reveal } from "@/components/animation/Reveal";

export function Hero() {
  return (
    <section className="bg-cream px-6 pb-20 pt-40 md:pt-48">
      <div className="mx-auto grid max-w-[var(--page-w)] items-center gap-12 lg:grid-cols-2">
        <Reveal direction="left">
          <div>
            <div className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-sun">
              <span className="block h-px w-6 bg-sun" />
              Dịch vụ coaching 1:1
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight text-ink md:text-5xl">
              Một người đồng hành, cho hành trình chỉ của riêng bạn.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-ink/70">
              Không phải khoá học đại trà. Đây là không gian riêng để bạn được
              lắng nghe, thấu hiểu và dẫn dắt đến đúng mục tiêu của chính mình.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#booking"
                className="rounded-sm bg-sun px-7 py-3.5 font-mono text-xs uppercase tracking-wider text-ink transition-colors hover:brightness-90"
              >
                Đặt lịch tư vấn miễn phí
              </a>
              <a
                href="#process"
                className="rounded-sm border border-ink/25 px-7 py-3.5 font-mono text-xs uppercase tracking-wider transition-colors hover:border-ink"
              >
                Xem quy trình
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal direction="right">
          <div className="relative aspect-[4/3] overflow-hidden rounded-md">
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
    </section>
  );
}
