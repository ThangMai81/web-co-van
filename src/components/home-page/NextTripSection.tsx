import { Reveal } from "../animation/Reveal";
import { TripRegistrationDialog } from "./TripRegistrationDialog";
import { TripCountdown } from "./TripCountdown";
import { CalendarDays, Compass, Flag, Mountain, type LucideIcon } from "lucide-react";

const TRIP_HIGHLIGHTS: { icon: LucideIcon; label: string; desc: string }[] = [
  { icon: Mountain, label: "3.143m", desc: "Độ cao đỉnh Fansipan" },
  { icon: Flag, label: "Lần thứ 3", desc: "Hành trình leo núi của Sunshine" },
  { icon: CalendarDays, label: "6 ngày", desc: "3 Th12 — 8 Th12, 2026" },
  { icon: Compass, label: "Đồng hành", desc: "Cùng Coach Yến Lê" },
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
                      className="group rounded-xl border border-white/10 bg-white/5 px-3 py-4 text-center transition-colors duration-300 hover:border-yellow/50 hover:bg-white/10"
                    >
                      <h.icon
                        size={22}
                        strokeWidth={1.7}
                        aria-hidden="true"
                        className="mx-auto mb-2 text-yellow transition-transform duration-500 group-hover:-translate-y-1"
                      />
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
                <div className="mb-5">
                  <div className="mb-2 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">
                    Còn lại đến ngày khởi hành
                  </div>
                  <TripCountdown />
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
