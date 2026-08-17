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
    <section id="trail" className="bg-pine-2 py-32">
      <div className="mx-auto max-w-[var(--page-w)] px-6">
        <h2 className="mb-16 font-display text-4xl font-bold text-chalk">
          Bản đồ hành trình
        </h2>

        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-moss-dim" />

          {WAYPOINTS.map((wp) => (
            <Reveal key={wp.title}>
              <div className="relative mb-16 pl-16">
                <div className="absolute left-0 top-0 h-12 w-12 rounded-full border border-moss-dim bg-pine" />
                <div className="mb-2 font-mono text-xs text-moss">
                  {wp.elev}
                </div>
                <h3 className="mb-2 font-display text-2xl font-semibold text-chalk">
                  {wp.title}
                </h3>
                <p className="max-w-[56ch] text-paper/70">{wp.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
