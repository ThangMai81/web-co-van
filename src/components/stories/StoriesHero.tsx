import { Fragment, type CSSProperties } from "react";
import Link from "next/link";
import styles from "./Stories.module.css";

const cssVar = (name: string, value: string | number) =>
  ({ [name]: value }) as unknown as CSSProperties;

const HEADLINE = "Những câu chuyện chuyển hoá từ cộng đồng Sunshine";

export function StoriesHero({ count }: { count: number }) {
  const words = HEADLINE.split(" ");

  return (
    <section className="relative isolate overflow-hidden bg-blue px-6 pb-24 pt-[88px] md:pt-[128px] lg:pt-[120px]">
      <div aria-hidden="true" className={styles.heroRays} />
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-yellow/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-yellow/8 blur-2xl" />

      <div className="relative mx-auto max-w-4xl text-center">
        <svg
          aria-hidden="true"
          viewBox="0 0 88 72"
          className={styles.quoteMark}
        >
          <path d="M8 66V42C8 22 18 10 36 6l3 8C27 18 22 26 22 36h14v30H8Z" />
          <path d="M50 66V42c0-20 10-32 28-36l3 8c-12 4-17 12-17 22h14v30H50Z" />
        </svg>

        <div
          className={`${styles.heroFade} mb-5 flex items-center justify-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-yellow`}
          style={cssVar("--fade-delay", "450ms")}
        >
          <span className="block h-px w-6 bg-yellow" />
          Tiếng nói học viên
          <span className="block h-px w-6 bg-yellow" />
        </div>

        <h1 className="font-display text-3xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
          {words.map((word, i) => (
            <Fragment key={`${word}-${i}`}>
              <span className={styles.headlineWord}>
                <span
                  className={word === "Sunshine" ? "text-yellow" : undefined}
                  style={cssVar("--word-index", i)}
                >
                  {word}
                </span>
              </span>
              {i < words.length - 1 ? " " : null}
            </Fragment>
          ))}
        </h1>

        <p
          className={`${styles.heroFade} mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed text-white/70`}
          style={cssVar("--fade-delay", "1800ms")}
        >
          Mỗi lời chia sẻ là một minh chứng cho hành trình chữa lành, tìm lại
          chính mình và kiến tạo cuộc đời ý nghĩa hơn.
        </p>

        <div
          className={`${styles.heroFade} mt-8 flex flex-wrap justify-center gap-3`}
          style={cssVar("--fade-delay", "2100ms")}
        >
          <Link
            href="/#lien-he"
            className="rounded-full bg-yellow px-7 py-3.5 text-sm font-bold text-blue shadow-lg shadow-yellow/20 transition hover:-translate-y-0.5 hover:brightness-95"
          >
            Bắt đầu hành trình của bạn
          </Link>
          <Link
            href="/programs"
            className="rounded-full border border-white/40 px-7 py-3.5 text-sm font-bold text-white transition hover:border-yellow hover:text-yellow"
          >
            Xem các chương trình
          </Link>
        </div>

        {count > 0 ? (
          <a
            href="#cau-chuyen"
            className={`${styles.heroFade} mt-12 inline-flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-white/60 transition hover:text-yellow`}
            style={cssVar("--fade-delay", "2400ms")}
          >
            <span className="grid h-9 w-9 place-items-center rounded-full border border-yellow/50 text-yellow">
              {count}
            </span>
            câu chuyện đang chờ bạn đọc ↓
          </a>
        ) : null}
      </div>
    </section>
  );
}
