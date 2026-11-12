import type { CSSProperties } from "react";
import type { ProgramStat } from "@/types/program";
import ProgramStats from "./ProgramStats";
import styles from "./ProgramHighlights.module.css";
import revealStyles from "./ProgramHighlightsReveal.module.css";
import ProgramHighlightsRevealWrapper from "./ProgramHighlightsRevealWrapper";

const preparationSteps = [
  "Xác định điều bạn muốn ưu tiên khi cân nhắc chương trình.",
  "Đọc các điểm nổi bật để xem nội dung nào gần với ưu tiên đó.",
  "Kiểm tra lịch trình và địa điểm ở phần đầu trang nếu các thông tin này được cung cấp.",
];

export default function ProgramHighlights({
  highlights,
  stats,
  contactPhone,
}: {
  highlights: string[];
  stats: ProgramStat[];
  contactPhone?: string;
}) {
  const hasHighlights = highlights.length > 0;
  const hasStats = stats.length > 0;
  const validContactPhone =
    typeof contactPhone === "string" && contactPhone.trim().length > 0
      ? contactPhone.trim()
      : undefined;

  if (!hasHighlights && !hasStats) return null;

  const highlightsSection = hasHighlights ? (
    <ProgramHighlightsRevealWrapper
      as="section"
      id="program-highlights"
      aria-labelledby="program-highlights-heading"
      className="min-w-0 scroll-mt-28 md:scroll-mt-32"
    >
      <h2
        id="program-highlights-heading"
        className={`mb-7 border-l-4 border-yellow pl-4 font-editorial text-3xl font-bold leading-tight text-white md:text-[2.6rem] ${revealStyles.headingReveal}`}
      >
        Điểm nổi bật
      </h2>
      <ol className={`grid gap-4 ${revealStyles.highlightsList}`}>
        {highlights.map((item, idx) => (
          <li
            key={idx}
            className="group relative flex items-start gap-5 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-5 transition-colors duration-300 hover:border-yellow/50 hover:bg-white/[0.09] md:p-6"
            style={{ "--item-delay": `${120 + idx * 140}ms` } as CSSProperties}
          >
            <span
              aria-hidden="true"
              className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-yellow font-editorial text-lg font-bold italic text-blue shadow-lg shadow-yellow/20 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"
            >
              0{idx + 1}
            </span>
            <p className="pt-1.5 text-lg font-semibold leading-relaxed text-white md:text-xl">
              {item}
            </p>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-0 left-0 h-[2px] w-full origin-left scale-x-0 bg-gradient-to-r from-yellow to-transparent transition-transform duration-700 group-hover:scale-x-100"
            />
          </li>
        ))}
      </ol>
    </ProgramHighlightsRevealWrapper>
  ) : null;

  const statsSection = hasStats ? (
    <section
      id="program-stats"
      aria-labelledby="program-stats-heading"
      className="min-w-0 scroll-mt-28 md:scroll-mt-32"
    >
      <h2
        id="program-stats-heading"
        className="border-l-4 border-yellow pl-4 font-editorial text-2xl font-bold text-white"
      >
        Thông tin chương trình
      </h2>
      <div
        className={`${styles.statsOnNavy} ${
          hasHighlights ? "" : styles.statsWide
        }`}
      >
        <ProgramStats stats={stats} />
      </div>
    </section>
  ) : null;

  const mainColumn = hasHighlights ? highlightsSection : statsSection;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(18rem,0.9fr)] lg:gap-12">
      {mainColumn}

      <aside className="min-w-0 border-t border-white/25 pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
        {hasHighlights && statsSection}

        <section
          aria-labelledby="program-preparation-heading"
          className={
            hasHighlights && hasStats
              ? "mt-7 border-t border-white/20 pt-6"
              : ""
          }
        >
          <h3
            id="program-preparation-heading"
            className="border-l-4 border-yellow pl-4 font-editorial text-xl font-bold text-white"
          >
            Gợi ý cân nhắc
          </h3>
          <ol className="relative mt-5 grid gap-5 before:absolute before:bottom-3 before:left-[0.95rem] before:top-3 before:w-px before:bg-gradient-to-b before:from-yellow before:to-yellow/10">
            {preparationSteps.map((step, index) => (
              <li key={step} className="relative grid grid-cols-[2rem_minmax(0,1fr)] gap-4">
                <span
                  aria-hidden="true"
                  className="relative z-10 grid h-8 w-8 place-items-center rounded-full border border-yellow/70 bg-blue text-xs font-bold text-yellow"
                >
                  0{index + 1}
                </span>
                <p className="text-base leading-relaxed text-white/90">{step}</p>
              </li>
            ))}
          </ol>

          {validContactPhone && (
            <p className="mt-6 border-t border-white/20 pt-5 text-base leading-relaxed text-white/90">
              <a
                href={`tel:${validContactPhone}`}
                className="underline decoration-yellow underline-offset-4 hover:text-yellow focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Nếu còn câu hỏi, hãy liên hệ Sunshine Center qua nút liên hệ của chương trình.
              </a>
            </p>
          )}
        </section>
      </aside>
    </div>
  );
}
