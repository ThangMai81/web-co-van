import { Reveal } from "@/components/animation/Reveal";
import { MissionStatementGravity } from "./MissionStatementGravity";
import { ChapterMark } from "./ChapterMark";
import styles from "./Mission.module.css";

export function Mission() {
  return (
    <section
      id="mission"
      className="relative scroll-mt-24 overflow-hidden bg-yellow px-6 py-20 md:py-28"
    >
      <div aria-hidden="true" className={styles.sunGlow} />
      <div className="pointer-events-none absolute -bottom-28 -left-20 h-80 w-80 rounded-full bg-white/25 blur-3xl" />

      <div className="relative mx-auto max-w-[var(--page-w)]">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-16">
          <div>
            <Reveal direction="up">
              <ChapterMark number="03" label="Sứ mệnh" tone="sun" />
            </Reveal>
            <MissionStatementGravity className="font-display text-[1.7rem] font-bold leading-snug text-blue md:text-[2.4rem] md:leading-[1.25]">
              Đi gieo mầm ánh sáng cho đời, giúp cho mọi người nhìn thấy ánh sáng,
              tài năng vốn có sẵn bên trong để họ sống một cuộc đời xuất chúng,
              một cuộc đời đáng sống như thể họ vốn là.
            </MissionStatementGravity>
            <Reveal direction="up">
              <p className="mt-8 max-w-2xl border-l-4 border-blue pl-5 text-lg font-semibold leading-8 text-blue/80">
                Mỗi một ánh sáng trao đi, nhiều cuộc đời được đánh thức, chúng tôi
                chọn phụng sự bằng cả trái tim có trí tuệ để góp phần làm đẹp
                cuộc đời.
              </p>
            </Reveal>
          </div>

          <Reveal direction="right">
            <figure className={styles.plaque}>
              <span aria-hidden="true" className={styles.plaqueCorner} />
              <p className="font-mono text-[11px] font-bold uppercase tracking-[.22em] text-yellow">
                Tiêu chí của chúng tôi
              </p>
              <div className="mt-4 flex items-end gap-4">
                <span aria-hidden="true" className={styles.bigNumber}>50</span>
                <span className="pb-3 font-display text-2xl font-bold leading-tight text-white md:text-3xl">
                  năm
                  <br />
                  sau
                </span>
              </div>
              <blockquote className="mt-6 border-t border-white/15 pt-6 font-display text-xl font-bold italic leading-snug text-white md:text-2xl">
                &ldquo;50 năm sau <span className="text-yellow">sống với cái chúng ta</span>&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-sm leading-6 text-white/65">
                Điều chúng tôi trao hôm nay là thứ còn ở lại với mỗi người suốt nửa thế kỷ.
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
