import { Reveal } from "@/components/animation/Reveal";

export function CTA() {
  return (
    <section id="booking" className="bg-ink px-6 py-24 text-center text-chalk">
      <Reveal direction="scale">
        <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold md:text-4xl">
          Sẵn sàng cho một buổi trò chuyện đầu tiên?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-chalk/70">
          30 phút miễn phí, không ràng buộc — chỉ để hiểu rõ hơn liệu đây có
          phải là điều bạn đang tìm kiếm.
        </p>
        <a
          href="#"
          className="mt-8 inline-block rounded-sm bg-sun px-8 py-4 font-mono text-xs uppercase tracking-wider text-ink transition-colors hover:brightness-90"
        >
          Đặt lịch ngay
        </a>
      </Reveal>
    </section>
  );
}
