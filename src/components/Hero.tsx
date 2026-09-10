import Image from "next/image";
import { Reveal } from "./Reveal";

export function Hero() {
  return (
    <section className="relative flex min-h-svh items-center overflow-hidden py-24">
      <div className="relative z-10 mx-auto w-full max-w-[var(--page-w)] px-6">
        <div className="relative aspect-[16/4] max-w-full w-screen h-[450px]">
          <Image
            src="/images/Sunshine_banner.png"
            alt="Sunshine Center"
            fill
            priority
            className="object-cover h-1.5"
          />
        </div>
        <div className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-sun">
          <span className="block h-px w-6 bg-sun" />
          Cố vấn hành trình · Người bạn đường của trẻ em vùng cao
        </div>

        <Reveal direction="scale">
          <h1 className="max-w-[16ch] font-display text-[clamp(40px,6.6vw,92px)] font-bold leading-[0.98] text-ink">
            Leo lên đỉnh núi. <em className="text-sun not-italic">Cúi xuống</em>{" "}
            với một đứa trẻ.
          </h1>
        </Reveal>
        <Reveal direction="left" delay={100}>
          <p className="mt-6 max-w-[46ch] font-body text-lg italic text-ink/75">
            Mười hai năm đi giữa hai việc tưởng như chẳng liên quan — chinh phục
            những đỉnh núi khó nhất Việt Nam, và ngồi xuống dạy con chữ cho
            những đứa trẻ chưa từng thấy biển.
          </p>
        </Reveal>

        <Reveal direction="up" delay={200}>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#trail"
              className="rounded-sm bg-sun px-6 py-3.5 font-mono text-xs uppercase tracking-wider text-cream transition-colors hover:brightness-90"
            >
              Xem bản đồ hành trình
            </a>
            <a
              href="#videos"
              className="rounded-sm border border-ink/25 px-6 py-3.5 font-mono text-xs uppercase tracking-wider transition-colors hover:border-ink"
            >
              Xem video
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
