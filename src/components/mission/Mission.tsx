import { Reveal } from "@/components/animation/Reveal";
import { MissionStatementGravity } from "./MissionStatementGravity";
import { MissionSunrayDraw } from "./MissionSunrayDraw";

export function Mission() {
  return (
    <section id="mission" className="relative scroll-mt-24 overflow-hidden bg-yellow px-6 py-16 md:py-20">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-blue/10 blur-3xl" />

      <MissionSunrayDraw className="mx-auto max-w-3xl rounded-2xl border border-blue/10 bg-white/20 px-6 py-8 text-center sm:px-10 sm:py-10">
        <Reveal direction="up">
          <div className="mb-4 font-mono text-xs font-bold uppercase tracking-widest text-blue">
            Sứ mệnh
          </div>
        </Reveal>
        <MissionStatementGravity className="mb-6 font-display text-2xl font-bold leading-snug text-blue md:text-3xl">
          Đi gieo mầm ánh sáng cho đời, giúp cho mọi người nhìn thấy ánh sáng,
          tài năng vốn có sẵn bên trong để họ sống một cuộc đời xuất chúng,
          một cuộc đời đáng sống như thể họ vốn là.
        </MissionStatementGravity>
        <Reveal direction="up">
          <p className="font-semibold text-blue/80">
            Mỗi một ánh sáng trao đi, nhiều cuộc đời được đánh thức, chúng tôi
            chọn phụng sự bằng cả trái tim có trí tuệ để góp phần làm đẹp cuộc
            đời đúng với tiêu chí{" "}
            <span className="font-extrabold italic text-blue">
              "50 năm sau sống với cái chúng ta"
            </span>
            .
          </p>
        </Reveal>
      </MissionSunrayDraw>
    </section>
  );
}
