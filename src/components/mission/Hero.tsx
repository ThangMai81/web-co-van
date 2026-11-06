import { Quote } from "@/lib/icons";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Playfair_Display } from "next/font/google";
import { MissionHeroGlowParallax } from "./MissionHeroGlowParallax";
import { MissionHeroMetallicSweep } from "./MissionHeroMetallicSweep";
import { MissionPortraitReveal } from "./MissionPortraitReveal";
import styles from "./Hero.module.css";

const missionHeadingFont = Playfair_Display({
  variable: "--font-mission-display",
  subsets: ["latin", "vietnamese"],
  display: "swap",
});

export function Hero() {
  return (
    <section className={styles.hero}>
      <MissionHeroGlowParallax
        topClassName={styles.glowTop}
        bottomClassName={styles.glowBottom}
      />

      <div
        className={[
          styles.breadcrumb,
          styles.missionBreadcrumbEntry,
        ].join(" ")}
      >
        <Breadcrumb
          items={[{ label: "Trang chủ", href: "/" }, { label: "Sứ mệnh" }]}
          variant="light"
        />
      </div>

      <div className={styles.layout}>
        <div className={styles.copy}>
          <div
            className={[
              styles.kicker,
              styles.missionKickerEntry,
            ].join(" ")}
          >
            <span className={styles.missionKickerAccent} aria-hidden="true" />
            Câu chuyện Sunshine Center
          </div>
          <h1 className={`${styles.heading} ${missionHeadingFont.variable}`}>
            <MissionHeroMetallicSweep>
              <span className={styles.headingLine}>Khai tâm mở lối</span>
              <span className={styles.headingLine}>Tìm lại chính mình</span>
            </MissionHeroMetallicSweep>
          </h1>

          <p className={styles.tagline}>
            Đánh thức ánh sáng bên trong, kiến tạo cuộc đời bạn mong muốn.
          </p>

          <a className={styles.cta} href="#mission">
            Khám phá sứ mệnh
            <span className={styles.ctaArrow} aria-hidden="true">
              ↗
            </span>
          </a>
        </div>

        <div className={styles.support}>
          <div
            className={[
              styles.quote,
              styles.missionQuoteEntry,
            ].join(" ")}
          >
            <span className={styles.quoteMark} aria-hidden="true">
              <Quote size={28} className="text-yellow" aria-hidden="true" />
            </span>
            <p className="text-lg italic leading-relaxed text-white/90">
              "Bạn đến với cuộc đời này bạn là một mặt trời, và cuộc đời cần bạn
              và nguồn ánh sáng chỉ riêng bạn mới có mà thôi."
            </p>
            <p className="mt-4 font-mono text-xs font-bold uppercase tracking-widest text-yellow">
              — Shining Coach Yến Lê
            </p>
          </div>

          <div className={styles.supportPortrait}>
            <MissionPortraitReveal />
          </div>
        </div>
      </div>
    </section>
  );
}
