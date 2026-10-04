import { Reveal } from "../animation/Reveal";

export function NextTripSection() {
  return (
    <section id="trip" className="bg-white py-28">
      <div className="mx-auto max-w-[var(--page-w)] px-6">
        <div className="relative grid grid-cols-1 gap-10 overflow-hidden rounded-2xl bg-blue p-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-yellow/10 blur-3xl" />

          <Reveal direction="left">
            <div className="relative">
              <div className="mb-3 flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-yellow">
                <span className="block h-px w-6 bg-yellow" />
                Chuyến đi tiếp theo
              </div>
              <h3 className="font-display text-3xl font-bold text-white">
                Trại hè #8 — Bản Séo Mý Tỷ, Lào Cai
              </h3>
              <p className="mt-4 max-w-[48ch] font-medium text-white/80">
                Ba tuần dạy học kết hợp một chuyến leo ngắn lên đỉnh Ngũ Chỉ Sơn
                cùng các em lớn.
              </p>
            </div>
          </Reveal>

          <Reveal direction="right">
            <div className="relative rounded-xl border-2 border-yellow/40 bg-white/5 p-6">
              <div className="font-mono text-xs font-bold text-white/70">
                15 Th8 — 5 Th9, 2026
              </div>
              <div className="my-3 font-display text-xl font-bold text-white">
                Đăng ký đồng hành
              </div>
              <a
                href="#lien-he"
                className="block rounded-full bg-yellow py-3 text-center font-mono text-xs font-bold uppercase tracking-wider text-blue hover:brightness-95"
              >
                Gửi lời quan tâm
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
