import Image from "next/image";
import { Reveal } from "../animation/Reveal";
import { Play } from "@/lib/icons";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-blue pb-24 pt-32">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-yellow/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-yellow/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-[var(--page-w)] px-6">
        <div className="relative mb-10 aspect-[16/5] w-full overflow-hidden rounded-2xl border-2 border-yellow shadow-xl shadow-black/20">
          <Image
            src="/images/Sunshine_banner.png"
            alt="Sunshine Center"
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="mb-5 flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-yellow">
          <span className="block h-px w-6 bg-yellow" />
          Cố vấn hành trình · Người bạn đường của trẻ em vùng cao
        </div>

        <Reveal direction="scale">
          <h1 className="max-w-[18ch] font-display text-[clamp(36px,5.6vw,78px)] font-bold leading-[1.03] text-white">
            Sunshine Center Khai tâm mở lối,{" "}
            <em className="text-yellow not-italic">cúi xuống</em> với một đứa
            trẻ.
          </h1>
        </Reveal>

        <Reveal direction="left" delay={100}>
          <p className="mt-6 max-w-[52ch] text-lg italic text-white/80">
            Mười hai năm đi giữa hai việc tưởng như chẳng liên quan — chinh phục
            những đỉnh núi khó nhất Việt Nam, và ngồi xuống dạy con chữ cho
            những đứa trẻ chưa từng thấy biển.
          </p>
        </Reveal>

        <Reveal direction="up" delay={200}>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#videos"
              className="flex items-center gap-2 rounded-full bg-yellow px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-blue transition hover:brightness-95"
            >
              <Play size={14} />
              Xem video
            </a>
            <a
              href="#lien-he"
              className="rounded-full border-2 border-white/40 px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-white transition hover:border-white"
            >
              Đồng hành cùng chúng tôi
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
