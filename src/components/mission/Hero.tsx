import { Reveal } from "@/components/animation/Reveal";
import { Quote } from "@/lib/icons";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-blue px-6 pb-24 pt-40 md:pt-48">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-yellow/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-yellow/10 blur-3xl" />

      <div className="relative mx-auto max-w-3xl text-center">
        <Reveal direction="up">
          <div className="mb-5 flex items-center justify-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-yellow">
            <span className="block h-px w-6 bg-yellow" />
            Câu chuyện Sunshine Center
            <span className="block h-px w-6 bg-yellow" />
          </div>
          <h1 className="font-display text-3xl font-bold leading-tight text-white md:text-5xl">
            Khai tâm mở lối, tìm lại chính mình, chạm đỉnh vinh quang, sống đời
            xuất chúng.
          </h1>

          <div className="mx-auto mt-10 max-w-xl rounded-2xl border-2 border-yellow/40 bg-white/5 p-6">
            <Quote size={28} className="mx-auto mb-3 text-yellow" />
            <p className="text-lg italic text-white/90">
              "Bạn đến với cuộc đời này bạn là một mặt trời, và cuộc đời cần bạn
              và nguồn ánh sáng chỉ riêng bạn mới có mà thôi."
            </p>
            <p className="mt-3 font-mono text-xs font-bold uppercase tracking-widest text-yellow">
              — Shining Coach Yến Lê
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
