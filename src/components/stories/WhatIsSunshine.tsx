import Image from "next/image";
import { Reveal } from "@/components/animation/Reveal";

export function WhatIsSunshine() {
  return (
    <section className="bg-cream px-6 py-24">
      <div className="mx-auto grid max-w-[var(--page-w)] items-center gap-12 lg:grid-cols-2">
        <Reveal direction="left">
          <div className="relative aspect-[4/3] overflow-hidden rounded-md">
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
          <div>
            <div className="mb-4 font-mono text-xs uppercase tracking-widest text-sun">
              Sunshine Center là gì?
            </div>
            <p className="mb-4 text-lg font-semibold text-ink">
              Là một nơi giúp bạn nhìn thấy ánh sáng bên trong mình và tự mình
              tỏa sáng theo cách riêng của bạn.
            </p>
            <p className="mb-4 text-ink/70">
              Nhắc đến Sunshine là nhắc đến ánh sáng ấm áp, nơi khi bạn đặt chân
              đến điều đầu tiên bạn cảm nhận được đó là cảm giác thân thiện, yêu
              thương, gần gũi như một gia đình, nơi cho bạn cảm giác bình yên an
              toàn, nơi giúp bạn có cảm giác thuộc về.
            </p>
            <p className="text-ink/70">
              Nhắc tới Sunshine là nhắc đến sự an toàn để trải lòng, để chia sẻ.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
