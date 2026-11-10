import { Reveal } from "../animation/Reveal";
import { TripRegistrationDialog } from "./TripRegistrationDialog";

const TRIP_HIGHLIGHTS = [
  { icon: "🏔️", label: "3.143m", desc: "Độ cao đỉnh Fansipan" },
  { icon: "👥", label: "15 người", desc: "Quy mô nhóm nhỏ" },
  { icon: "📅", label: "6 ngày", desc: "3 Th12 — 8 Th12, 2026" },
  { icon: "🧭", label: "Có hướng dẫn", desc: "Coach đồng hành xuyên suốt" },
];

export function NextTripSection() {
  return (
    <section id="trip" className="bg-white py-28">
      <div className="mx-auto max-w-[var(--page-w)] px-6">
        <div className="relative overflow-hidden rounded-2xl bg-blue p-8 lg:p-10">
          {/* Background glow */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-yellow/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-yellow/5 blur-2xl" />

          <div className="relative grid grid-cols-1 gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-start">

            {/* Left — nội dung */}
            <Reveal direction="left">
              <div>
                <div className="mb-3 flex items-center gap-3 font-mono text-sm font-bold uppercase tracking-widest text-yellow">
                  <span className="block h-px w-6 bg-yellow" />
                  Chuyến đi tiếp theo
                </div>
                <h3 className="font-display text-3xl font-bold text-white md:text-4xl">
                  Leo núi #3 — Chinh phục Fansipan
                </h3>
                <p className="mt-2 text-lg font-semibold text-yellow/90">
                  Nóc nhà Đông Dương · Tháng 12/2026
                </p>
                <p className="mt-4 max-w-[48ch] font-medium text-white/75">
                  Chinh phục Fansipan không chỉ là leo lên đỉnh núi — đó là hành trình đối mặt với giới hạn của chính mình. Mỗi bước chân là một lần vượt qua, mỗi đỉnh cao là một cuộc đời mới mở ra.
                </p>

                {/* Điểm nổi bật */}
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {TRIP_HIGHLIGHTS.map((h) => (
                    <div
                      key={h.label}
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-4 text-center"
                    >
                      <div className="mb-1 text-xl" aria-hidden="true">{h.icon}</div>
                      <div className="font-display text-sm font-bold text-yellow">{h.label}</div>
                      <div className="mt-0.5 text-xs font-medium text-white/60">{h.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Right — đăng ký */}
            <Reveal direction="right">
              <div className="relative rounded-xl border-2 border-yellow/40 bg-white/5 p-6">
                <div className="mb-1 font-mono text-xs font-bold text-white/70">
                  3 Th12 – 8 Th12, 2026
                </div>
                <div className="my-3 font-display text-xl font-bold text-white">
                  Đăng ký đồng hành
                </div>
                <p className="mb-4 text-sm font-medium text-white/60">
                  Số chỗ có hạn — ưu tiên đăng ký sớm để giữ chỗ.
                </p>
                <TripRegistrationDialog />
                <p className="mt-4 text-xs font-medium text-white/40">
                  Liên hệ: 0935 626 186 (Yến Lê)
                </p>
              </div>
            </Reveal>

          </div>
        </div>
      </div>
    </section>
  );
}
