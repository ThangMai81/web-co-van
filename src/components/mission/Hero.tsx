import Image from "next/image";
import { Quote } from "@/lib/icons";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.glowTop} aria-hidden="true" />
      <div className={styles.glowBottom} aria-hidden="true" />

      <div className={styles.breadcrumb}>
        <Breadcrumb
          items={[{ label: "Trang chủ", href: "/" }, { label: "Sứ mệnh" }]}
          variant="light"
        />
      </div>

      <div className={styles.layout}>
        <div className={styles.copy}>
          <div className={styles.kicker}>
            <span aria-hidden="true" />
            Câu chuyện Sunshine Center
          </div>
          <h1 className="font-display text-3xl font-bold leading-tight text-white md:text-5xl">
            Khai tâm mở lối, tìm lại chính mình, chạm đỉnh vinh quang, sống đời
            xuất chúng.
          </h1>

          <div className={styles.quote}>
            <Quote size={28} className="mb-3 text-yellow" aria-hidden="true" />
            <p className="text-lg italic leading-relaxed text-white/90">
              "Bạn đến với cuộc đời này bạn là một mặt trời, và cuộc đời cần bạn
              và nguồn ánh sáng chỉ riêng bạn mới có mà thôi."
            </p>
            <p className="mt-4 font-mono text-xs font-bold uppercase tracking-widest text-yellow">
              — Shining Coach Yến Lê
            </p>
          </div>
        </div>

        <figure className={styles.portrait}>
          <Image
            src="/images/Yến.jpg"
            alt="Shining Coach Yến Lê tại Sunshine Center"
            fill
            priority
            sizes="(max-width: 767px) 86vw, 40vw"
            className={styles.portraitImage}
          />
          <figcaption className={styles.caption}>
            <span>Shining Coach</span>
            <strong>Yến Lê</strong>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
