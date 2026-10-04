import Image from "next/image";
import { Reveal } from "@/components/animation/Reveal";

export function Founder() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto grid max-w-[var(--page-w)] items-center gap-12 lg:grid-cols-2">
        <Reveal direction="left">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border-2 border-yellow shadow-lg shadow-blue/10">
            <Image
              src="/images/Yến.jpg"
              alt="Shining Coach Yến Lê"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <Reveal direction="right">
          <div>
            <div className="mb-4 flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-yellow">
              <span className="block h-px w-6 bg-yellow" />
              Nhà sáng lập
            </div>
            <h2 className="mb-5 font-display text-3xl font-bold text-blue md:text-4xl">
              Shining Coach Yến Lê
            </h2>
            <p className="mb-6 font-medium text-blue/70">
              Con đường mà Sunshine chọn là con đường trở về bên trong, chạm vào
              vùng sáng và soi sáng cho đời. Với giá trị tử tế chân thành, yêu
              thương và luôn hết mình vì khách hàng, Sunshine chọn là chốn dừng
              chân an toàn, nơi giúp bạn dũng cảm bước qua vùng sợ hãi để bước
              đến vùng thành tựu và lan toả cho đời.
            </p>
            <div className="flex gap-4">
              <div className="flex-1 rounded-xl border-2 border-blue/15 bg-blue/5 p-5 text-center">
                <div className="font-display text-3xl font-extrabold text-blue">
                  5000+
                </div>
                <div className="mt-1 font-mono text-xs font-bold uppercase tracking-wider text-blue/60">
                  Giờ khai vấn
                </div>
              </div>
              <div className="flex-1 rounded-xl border-2 border-blue/15 bg-blue/5 p-5 text-center">
                <div className="font-display text-3xl font-extrabold text-blue">
                  3000+
                </div>
                <div className="mt-1 font-mono text-xs font-bold uppercase tracking-wider text-blue/60">
                  Giờ đào tạo
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
