import { Reveal } from "@/components/animation/Reveal";
import { MissionOverviewGroupPhotoParallax } from "./MissionOverviewGroupPhotoParallax";
import { Brain, Eye, Heart, type LucideIcon } from "lucide-react";

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
        </div>
      </Reveal>

      <div className="mx-auto mt-12 max-w-[var(--page-w)] px-6 md:mt-16">
        <Reveal direction="right">
          <div className="mx-auto mt-14 max-w-3xl text-center">
            <div className="mb-5 flex items-center gap-3 font-mono text-lg font-bold uppercase tracking-widest text-yellow md:text-xl">
              <span className="block h-px w-8 bg-yellow" />
              Sunshine Center là gì?
            </div>
            <p className="mb-4 text-2xl font-bold text-blue md:text-3xl">
              Sunshine Center là không gian đồng hành để bạn hiểu mình hơn, tìm
              lại nguồn lực bên trong và bước tiếp theo cách riêng.
            </p>
            <p className="mb-4 font-medium text-blue/70">
              Nhắc đến Sunshine là nhắc đến ánh sáng ấm áp, nơi khi bạn đặt chân
              đến điều đầu tiên bạn cảm nhận được đó là cảm giác thân thiện, yêu
              thương, gần gũi như một gia đình, nơi cho bạn cảm giác bình yên an
              toàn, nơi giúp bạn có cảm giác thuộc về.
            </p>
            <p className="font-medium text-blue/70">
              Nhắc tới Sunshine là nhắc đến sự an toàn để trải lòng, để chia sẻ.
            </p>
          </div>
        </Reveal>

        <div className="mx-auto mt-14 grid max-w-5xl gap-5 md:grid-cols-3">
          {PILLARS.map((pillar, i) => (
            <Reveal key={pillar.title} direction="up" delay={i * 150}>
              <div className="group relative h-full overflow-hidden rounded-3xl border border-blue/10 bg-blue/[0.03] p-7 text-center transition-all duration-500 hover:-translate-y-1 hover:border-yellow/70 hover:bg-white hover:shadow-xl hover:shadow-blue/10">
                <span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-blue text-yellow ring-8 ring-yellow/15 transition-transform duration-500 group-hover:scale-110">
                  <pillar.icon size={26} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <h3 className="font-display text-2xl font-bold text-blue">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-blue/70">{pillar.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
