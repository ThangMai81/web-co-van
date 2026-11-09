import type { ProgramStat } from "@/types/program";
import ProgramStats from "./ProgramStats";
import styles from "./ProgramHighlights.module.css";

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
    <section
      id="program-highlights"
      aria-labelledby="program-highlights-heading"
      className="min-w-0 scroll-mt-28 md:scroll-mt-32"
    >
      <h2
        id="program-highlights-heading"
        className="mb-5 border-l-4 border-yellow pl-4 text-2xl font-bold text-white md:text-3xl"
      >
        ✨ Điểm nổi bật
      </h2>
      <ul className="list-disc space-y-2 pl-5 font-medium text-white/90">
        {highlights.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </section>
  ) : null;

  const statsSection = hasStats ? (
    <section
      id="program-stats"
      aria-labelledby="program-stats-heading"
      className="min-w-0 scroll-mt-28 md:scroll-mt-32"
    >
      <h2
        id="program-stats-heading"
        className="border-l-4 border-yellow pl-4 text-xl font-bold text-white"
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
            className="border-l-4 border-yellow pl-4 text-lg font-bold text-white"
          >
            Gợi ý cân nhắc
          </h3>
          <ol className="mt-5 grid gap-4">
            {preparationSteps.map((step, index) => (
              <li key={step} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3">
                <span
                  aria-hidden="true"
                  className="pt-0.5 text-sm font-bold tracking-wide text-yellow"
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
