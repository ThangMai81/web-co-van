import Image from "next/image";
import { Reveal } from "@/components/animation/Reveal";

export function Founder() {
  return (
    <section className="bg-cream px-6 py-24">
      <div className="mx-auto grid max-w-[var(--page-w)] items-center gap-12 lg:grid-cols-2">
        <Reveal direction="left">
          <div className="relative aspect-[4/5] overflow-hidden rounded-md">
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
            <div className="mb-4 font-mono text-xs uppercase tracking-widest text-sun">
              Nhà sáng lập
            </div>
            <h2 className="mb-5 font-display text-3xl font-bold text-ink md:text-4xl">
              Shining Coach Yến Lê
            </h2>
            <p className="mb-4 text-ink/70">
              Con đường mà Sunshine chọn là con đường trở về bên trong, chạm vào
              vùng sáng và soi sáng cho đời. Với giá trị tử tế chân thành, yêu
              thương và luôn hết mình vì khách hàng, Sunshine chọn là chốn dừng
              chân an toàn, nơi giúp bạn dũng cảm bước qua vùng sợ hãi để bước
              đến vùng thành tựu và lan toả cho đời.
            </p>
            <div className="mt-6 flex gap-8">
              <div>
                <div className="font-display text-2xl font-bold text-ink">
                  5000+
                </div>
                <div className="font-mono text-xs uppercase tracking-wider text-sage">
                  Giờ khai vấn
                </div>
              </div>
              <div>
                <div className="font-display text-2xl font-bold text-ink">
                  3000+
                </div>
                <div className="font-mono text-xs uppercase tracking-wider text-sage">
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
