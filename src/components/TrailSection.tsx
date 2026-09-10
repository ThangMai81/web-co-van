import { Reveal } from "./Reveal";

const WAYPOINTS = [
  {
    elev: "3.143M · FANSIPAN, LÀO CAI · 2014",
    title: "Chuyến leo núi đầu tiên, một mình",
    body: "Không kinh nghiệm, không người dẫn đường quen. Ba ngày trong sương mù dạy cho tôi bài học đầu tiên về sự kiên nhẫn.",
  },
  {
    elev: "TRẠI HÈ #1 · SÍN SUỐI HỒ, LAI CHÂU · 2016",
    title: "Lớp học đầu tiên dưới chân núi",
    body: "Mượn một căn nhà sàn bỏ trống, dạy 14 em nhỏ đọc và viết trong ba tuần hè.",
  },
  {
    elev: "2.865M · TÀ XÙA, SƠN LA · 2019",
    title: "Leo cùng ba học trò cũ",
    body: "Ba em từng học lớp tôi dạy năm 2016, giờ đã lớn, cùng tôi leo Tà Xùa.",
  },
];

export function TrailSection() {
  return (
    <section id="trail" className="flex py-32">
      <div
        className="mx-auto flex w-full max-w-[var(--page-w)] flex-col px-6"
        style={{ maxHeight: "calc(100svh - 8rem)" }}
      >
        <Reveal direction="left">
          <h2 className="mb-8 font-display text-3xl font-bold text-ink sm:text-4xl">
            Bản đồ hành trình
          </h2>
        </Reveal>

        <div className="relative overflow-y-auto pr-2">
          {/* đường nối - căn giữa tâm hình tròn (w-10 = 40px -> tâm ở 20px = left-5) */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-sage/40" />

          {WAYPOINTS.map((wp, i) => (
            <Reveal key={wp.title} direction={i % 2 === 0 ? "right" : "left"}>
              <div className="group relative mb-8 pl-16">
                {/* hình tròn mốc */}
                <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-sage bg-paper transition-colors duration-700 ease-out group-hover:border-ochre">
                  <span className="h-2.5 w-2.5 scale-0 rounded-full bg-ochre transition-transform duration-500 ease-out group-hover:scale-100" />
                </div>

                <div className="mb-1 font-mono text-xs text-sage">
                  {wp.elev}
                </div>

                {/* tiêu đề - vệt sáng chạy từ trái sang khi hover */}
                <h3 className="relative mb-1 inline-block font-display text-xl font-semibold text-ink sm:text-2xl">
                  {wp.title}
                  <span className="absolute -bottom-1 left-0 h-[2px] w-full origin-left scale-x-0 bg-ochre transition-transform duration-500 ease-out group-hover:scale-x-100" />
                </h3>

                <p className="max-w-[56ch] text-sm text-ink/70 transition-colors duration-500 group-hover:text-ink sm:text-base">
                  {wp.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
