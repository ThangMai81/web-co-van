import { Reveal } from "@/components/animation/Reveal";

export function CTA() {
  return (
    <section id="booking" className="relative overflow-hidden bg-blue px-6 py-24 text-center text-white">
      <Reveal direction="scale">
        <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold md:text-4xl">
          Tìm người đồng hành phù hợp với bạn
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-white/75">
          Xem hồ sơ và thông tin phiên riêng của từng người đồng hành trước khi gửi yêu cầu.
        </p>
        <a
          href="#companions"
          className="mt-8 inline-block rounded-full bg-yellow px-8 py-4 font-mono text-xs uppercase tracking-wider text-blue transition-transform hover:-translate-y-1 hover:brightness-90"
        >
          Chọn người đồng hành
        </a>
      </Reveal>
    </section>
  );
}
