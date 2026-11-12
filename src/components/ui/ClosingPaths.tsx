import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/animation/Reveal";
import styles from "./ClosingPaths.module.css";

export type ClosingPath = {
  icon: LucideIcon;
  title: string;
  desc: string;
  href: string;
  external?: boolean;
};

/** Khối kết trang nền kem: tiêu đề + 3 lối đi tiếp. Dùng chung cho trang Chương trình và Khoá học. */
export function ClosingPaths({
  id,
  icon: BadgeIcon,
  title,
  lead,
  paths,
}: {
  id: string;
  icon: LucideIcon;
  title: string;
  lead: string;
  paths: ClosingPath[];
}) {
  return (
    <section
      aria-labelledby={id}
      className="relative isolate overflow-hidden bg-cream px-6 py-16 md:py-20"
    >
      <div aria-hidden="true" className={styles.sun} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-blue/[0.06] blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-[var(--page-w)]">
        <Reveal direction="up">
          <div className="mx-auto max-w-2xl text-center">
            <span
              className={`${styles.badge} mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue text-yellow`}
            >
              <BadgeIcon className="h-6 w-6" aria-hidden="true" />
            </span>
            <h2
              id={id}
              className="font-editorial text-3xl font-bold text-blue md:text-[2.75rem] md:leading-tight"
            >
              {title}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-blue/70">
              {lead}
            </p>
          </div>
        </Reveal>

        <ul className="mx-auto mt-10 grid max-w-5xl gap-4 md:grid-cols-3">
          {paths.map((item, i) => {
            const Icon = item.icon;
            const inner = (
              <>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow/25 text-blue transition-colors duration-300 group-hover:bg-yellow">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2 font-bold text-blue">
                    {item.title}
                    <ArrowRight
                      className="h-4 w-4 -translate-x-1 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 motion-reduce:transition-none"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-blue/65">
                    {item.desc}
                  </span>
                </span>
              </>
            );
            const cls = `${styles.card} group flex h-full items-start gap-4 rounded-2xl border border-blue/10 bg-white p-5 shadow-sm shadow-blue/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2`;
            return (
              <li key={item.title} className="h-full">
                <Reveal direction="up" delay={120 + i * 90}>
                  {item.external ? (
                    <a href={item.href} className={cls}>
                      {inner}
                    </a>
                  ) : (
                    <Link href={item.href} className={cls}>
                      {inner}
                    </Link>
                  )}
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
