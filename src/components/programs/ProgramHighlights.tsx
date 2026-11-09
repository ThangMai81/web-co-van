import type { ProgramStat } from "@/types/program";
import ProgramStats from "./ProgramStats";
import styles from "./ProgramHighlights.module.css";

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
  const hasBothColumns = hasHighlights && hasStats;

  return (
    <div
      className={`grid gap-8 ${
        hasBothColumns
          ? "lg:grid-cols-[minmax(0,1.5fr)_minmax(16rem,0.72fr)] lg:gap-14"
          : ""
      }`}
    >
      {hasHighlights && (
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
      )}

      {hasStats && (
        <section
          id="program-stats"
          aria-labelledby="program-stats-heading"
          className={`min-w-0 scroll-mt-28 ${
            hasHighlights
              ? "border-t border-white/20 pt-6 lg:scroll-mt-32 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0"
              : "lg:scroll-mt-32"
          }`}
        >
          <h2
            id="program-stats-heading"
            className="border-l-4 border-yellow pl-4 text-xl font-bold text-white"
          >
            Thông tin chương trình
          </h2>
          <div
            className={`${styles.statsOnNavy} ${
              hasHighlights ? styles.statsRail : styles.statsWide
            }`}
          >
            <ProgramStats stats={stats} />
          </div>
        </section>
      )}

      <div
        className={`grid gap-4 border-t border-white/20 pt-6 ${
          hasBothColumns ? "lg:col-span-2" : ""
        }`}
      >
        <p className="border-l-4 border-yellow pl-4 text-base leading-relaxed text-white/90">
          Trước khi chọn chương trình, hãy xác định điều bạn muốn tìm hiểu hoặc ưu tiên cá nhân. Xem các thông tin sẵn có ở phần đầu trang để đối chiếu với kế hoạch của bạn.
        </p>
        {contactPhone && (
          <p className="border-l-4 border-transparent pl-4 text-base leading-relaxed text-white/90">
            <a
              href={`tel:${contactPhone}`}
              className="underline decoration-yellow underline-offset-4 hover:text-yellow focus-visible:rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Nếu còn câu hỏi chưa được giải đáp, hãy liên hệ Sunshine Center qua nút liên hệ của chương trình.
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
