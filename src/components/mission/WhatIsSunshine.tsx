import Image from "next/image";
import { Reveal } from "@/components/animation/Reveal";

export function WhatIsSunshine() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-[var(--page-w)]">
        <Reveal direction="left">
          <div className="relative left-1/2 aspect-[2/1] w-screen -translate-x-1/2 overflow-hidden shadow-lg shadow-blue/10 md:aspect-[21/8]">
            <Image
              src="/images/collaborate_team.jpg"
              alt="Sunshine Center"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>

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
