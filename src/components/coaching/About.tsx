import Image from "next/image";
import { Reveal } from "@/components/animation/Reveal";

export function About() {
  return (
    <section className="bg-cream px-6 py-24">
      <div className="mx-auto grid max-w-[var(--page-w)] items-center gap-12 lg:grid-cols-2">
        <Reveal direction="left">
          <div className="relative aspect-[4/5] overflow-hidden rounded-md">
            <Image
              src="/images/Yến.jpg"
              alt="Người đồng hành"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <Reveal direction="right">
          <div>
            <div className="mb-4 font-mono text-xs uppercase tracking-widest text-sun">
              Người đồng hành cùng bạn
            </div>
            <h2 className="mb-5 font-display text-3xl font-bold text-ink md:text-4xl">
              Lê Thị Kim Yến
            </h2>
            <p className="mb-4 text-ink/70">
              Với nhiều năm kinh nghiệm đồng hành cùng học viên trong hành trình
              phát triển bản thân, tôi tin rằng mỗi người đều có câu trả lời
              đúng cho chính mình — vai trò của tôi là giúp bạn tìm ra nó nhanh
              hơn, rõ ràng hơn.
            </p>
            <p className="text-ink/70">
              Không phán xét, không áp đặt phương pháp cứng nhắc — chỉ có sự
              lắng nghe thật sự và một lộ trình phù hợp với riêng bạn.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
