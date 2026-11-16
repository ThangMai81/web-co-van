import { Reveal } from "@/components/animation/Reveal";
import { MissionOverviewGroupPhotoParallax } from "./MissionOverviewGroupPhotoParallax";
import { ChapterMark } from "./ChapterMark";
import { Brain, Eye, Heart, Quote, type LucideIcon } from "lucide-react";

const FOUNDER_MISSION = [
  "Tôi dẫn bạn lên những đỉnh núi chưa từng đặt chân,",
  "để rồi nhận ra ngọn núi cao nhất nằm ở trong lòng mình.",
  "Khi vượt qua giới hạn chưa từng biết đến ấy,",
  "đời bỗng hiện ra trọn vẹn sắc màu và ý nghĩa.",
];

function FounderMissionQuote({ tone }: { tone: "overlay" | "card" }) {
  const onPhoto = tone === "overlay";
  return (
    <figure className={onPhoto ? "max-w-xl text-white" : "text-blue"}>
      <p className={`mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-xs font-bold uppercase tracking-[.16em] ${onPhoto ? "bg-yellow text-blue" : "bg-blue text-yellow"}`}>
        <Quote size={13} aria-hidden="true" />
        Sứ mệnh của tôi
      </p>
      <blockquote className={`font-display font-bold leading-snug ${onPhoto ? "text-lg drop-shadow lg:text-2xl xl:text-3xl" : "text-xl"}`}>
        {FOUNDER_MISSION.map((line, index) => (
          <span key={line} className={`block ${index === 1 ? (onPhoto ? "text-yellow" : "text-blue underline decoration-yellow decoration-4 underline-offset-4") : ""}`}>
            {line}
          </span>
        ))}
      </blockquote>
      <figcaption className={`mt-4 text-sm font-semibold ${onPhoto ? "text-white/85" : "text-blue/70"}`}>
        Lê Thị Kim Yến · Nhà sáng lập Sunshine Center
      </figcaption>
    </figure>
  );
}

const PILLARS: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: Eye, title: "Tỉnh thức", body: "Dừng lại, nhìn rõ mình đang ở đâu và điều gì thật sự quan trọng." },
  { icon: Brain, title: "Trí tuệ", body: "Hiểu gốc rễ vấn đề để chọn hướng đi sáng suốt, không theo cảm tính." },
  { icon: Heart, title: "Yêu thương", body: "Một không gian an toàn để chia sẻ — như trở về nhà." },
];

export function WhatIsSunshine() {
  return (
    <section id="sunshine-overview" className="scroll-mt-24 bg-white py-16 md:py-20">
      <Reveal direction="left">
        <div className="relative aspect-[2/1] w-full overflow-hidden bg-blue/5 md:aspect-[21/8]">
          <MissionOverviewGroupPhotoParallax />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-blue/90 via-blue/55 to-transparent md:block"
          />
          <div className="absolute inset-0 hidden items-center md:flex">
            <div className="mx-auto w-full max-w-[var(--page-w)] px-6">
              <FounderMissionQuote tone="overlay" />
            </div>
          </div>
        </div>
      </Reveal>
      <div className="relative z-10 mx-6 -mt-8 rounded-3xl border-l-4 border-yellow bg-cream p-6 shadow-lg shadow-blue/10 md:hidden">
        <FounderMissionQuote tone="card" />
      </div>

      <div className="mx-auto mt-12 grid max-w-[var(--page-w)] gap-10 px-6 md:mt-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16">
        <Reveal direction="left">
          <div>
            <ChapterMark number="01" label="Sunshine Center là gì?" />
            <p className="mb-5 font-display text-2xl font-bold leading-snug text-blue md:text-3xl">
              Sunshine Center là không gian đồng hành để bạn hiểu mình hơn, tìm
              lại nguồn lực bên trong và bước tiếp theo cách riêng.
            </p>
            <p className="mb-4 font-medium leading-7 text-blue/70">
              Nhắc đến Sunshine là nhắc đến ánh sáng ấm áp, nơi khi bạn đặt chân
              đến điều đầu tiên bạn cảm nhận được đó là cảm giác thân thiện, yêu
              thương, gần gũi như một gia đình, nơi cho bạn cảm giác bình yên an
              toàn, nơi giúp bạn có cảm giác thuộc về.
            </p>
            <p className="border-l-4 border-yellow pl-4 font-semibold text-blue">
              Nhắc tới Sunshine là nhắc đến sự an toàn để trải lòng, để chia sẻ.
            </p>
          </div>
        </Reveal>

        <div className="grid content-center gap-4">
          {PILLARS.map((pillar, i) => (
            <Reveal key={pillar.title} direction="right" delay={i * 120}>
              <div className="group flex items-start gap-5 rounded-3xl border border-blue/10 bg-cream/60 p-5 transition-all duration-500 hover:-translate-y-0.5 hover:border-yellow/70 hover:bg-white hover:shadow-xl hover:shadow-blue/10 md:p-6">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-blue text-yellow ring-4 ring-yellow/20 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                  <pillar.icon size={24} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-display text-xl font-bold text-blue md:text-2xl">{pillar.title}</span>
                  <span className="mt-1.5 block text-sm leading-relaxed text-blue/70">{pillar.body}</span>
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
