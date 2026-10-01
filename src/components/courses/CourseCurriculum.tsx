import type { Chapter } from "@/types/course";

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function CourseCurriculum({
  curriculum,
  totalDurationLabel,
}: {
  curriculum: Chapter[];
  totalDurationLabel?: string;
}) {
  const totalLessons = curriculum.reduce((sum, c) => sum + c.lessons.length, 0);

  return (
    <section>
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-t-xl bg-amber-500 px-5 py-3 text-white">
        <h2 className="font-bold">Nội dung chương trình</h2>
        <span className="text-sm">
          {curriculum.length} Chương • {totalLessons} Bài giảng
          {totalDurationLabel ? ` • ${totalDurationLabel}` : ""}
        </span>
      </div>

      <div className="divide-y divide-amber-100 rounded-b-xl border border-amber-100">
        {curriculum.map((chapter, idx) => (
          <details key={idx} open={idx === 0}>
            <summary className="cursor-pointer list-none bg-amber-50 px-5 py-3 font-semibold text-slate-800">
              Chương {idx + 1}: {chapter.title}
              <span className="ml-2 text-xs font-normal text-slate-500">
                {chapter.lessons.length} bài giảng
              </span>
            </summary>
            <div className="divide-y divide-slate-100">
              {chapter.lessons.map((lesson, lIdx) => (
                <div
                  key={lIdx}
                  className="flex flex-wrap items-center gap-3 px-5 py-3"
                >
                  <span className="font-medium text-slate-800">
                    Bài giảng {lIdx + 1}: {lesson.title}
                  </span>
                  <span className="rounded-full bg-slate-700 px-2 py-0.5 text-xs text-white">
                    {lesson.format === "online" ? "Trực tuyến" : "Trực tiếp"}
                  </span>
                  {lesson.scheduledAt && (
                    <span className="text-sm text-slate-500">
                      {formatDate(lesson.scheduledAt)}
                      {lesson.durationHours
                        ? ` - ${lesson.durationHours} tiếng`
                        : ""}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
