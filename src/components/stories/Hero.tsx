import Image from "next/image";
import { Reveal } from "@/components/animation/Reveal";

export function Hero() {
  return (
    <section className="bg-navy-deep px-6 pb-20 pt-40 md:pt-48">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal direction="up">
          <div className="mb-5 flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-widest text-sun">
            <span className="block h-px w-6 bg-sun" />
            Câu chuyện RNI
          </div>
          <h1 className="font-display text-3xl font-bold leading-tight text-chalk md:text-5xl">
            Khai tâm mở lối, tìm lại chính mình, chạm đỉnh vinh quang, sống đời
            xuất chúng.
          </h1>
          <p className="mt-6 text-lg italic text-chalk/70">
            "Bạn đến với cuộc đời này bạn là một mặt trời, và cuộc đời cần bạn
            và nguồn ánh sáng chỉ riêng bạn mới có mà thôi."
          </p>
          <p className="mt-2 font-mono text-xs uppercase tracking-widest text-sun">
            — Shining Coach Yến Lê
          </p>
        </Reveal>
      </div>
    </section>
  );
}
