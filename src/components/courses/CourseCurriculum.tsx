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
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-t-xl bg-blue px-5 py-3 text-white">
        <h2 className="font-bold">Nội dung chương trình</h2>
        <span className="text-sm font-medium">
          {curriculum.length} Chương • {totalLessons} Bài giảng
          {totalDurationLabel ? ` • ${totalDurationLabel}` : ""}
        </span>
      </div>

      <div className="divide-y divide-blue/10 rounded-b-xl border border-blue/15">
        {curriculum.map((chapter, idx) => (
          <details key={idx} open={idx === 0}>
            <summary className="cursor-pointer list-none bg-blue/5 px-5 py-3 font-bold text-blue">
              Chương {idx + 1}: {chapter.title}
              <span className="ml-2 text-xs font-medium text-blue/60">
                {chapter.lessons.length} bài giảng
              </span>
            </summary>
            <div className="divide-y divide-blue/10">
              {chapter.lessons.map((lesson, lIdx) => (
                <div
                  key={lIdx}
                  className="flex flex-wrap items-center gap-3 px-5 py-3"
                >
                  <span className="font-bold text-blue">
                    Bài giảng {lIdx + 1}: {lesson.title}
                  </span>
                  <span className="rounded-full bg-blue px-2 py-0.5 text-xs font-bold text-white">
                    {lesson.format === "online" ? "Trực tuyến" : "Trực tiếp"}
                  </span>
                  {lesson.scheduledAt && (
                    <span className="text-sm font-medium text-blue/60">
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
