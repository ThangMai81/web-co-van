import { Reveal } from "@/components/animation/Reveal";

export function Mission() {
  return (
    <section className="bg-flame px-6 py-24 text-chalk">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal direction="up">
          <div className="mb-4 font-mono text-xs uppercase tracking-widest text-chalk/80">
            Sứ mệnh
          </div>
          <p className="mb-6 font-display text-2xl font-bold leading-snug md:text-3xl">
            Đi gieo mầm ánh sáng cho đời, giúp cho mọi người nhìn thấy ánh sáng,
            tài năng vốn có sẵn bên trong để họ sống một cuộc đời xuất chúng,
            một cuộc đời đáng sống như thể họ vốn là.
          </p>
          <p className="text-chalk/85">
            Mỗi một ánh sáng trao đi, nhiều cuộc đời được đánh thức, chúng tôi
            chọn phụng sự bằng cả trái tim có trí tuệ để góp phần làm đẹp cuộc
            đời đúng với tiêu chí{" "}
            <span className="font-semibold italic">
              "50 năm sau sống với cái chúng ta"
            </span>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
