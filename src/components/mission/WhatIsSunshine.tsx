import { Reveal } from "@/components/animation/Reveal";
import { MissionOverviewGroupPhotoParallax } from "./MissionOverviewGroupPhotoParallax";

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
      </div>
    </section>
  );
}
