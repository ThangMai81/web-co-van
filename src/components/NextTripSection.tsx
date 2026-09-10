import { Reveal } from "./Reveal";

export function NextTripSection() {
  return (
    <section id="trip" className="bg-cream py-32">
      <div className="mx-auto max-w-[var(--page-w)] px-6">
        <div className="grid grid-cols-1 gap-10 rounded-md bg-gradient-to-br from-rust to-navy-light p-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
          <Reveal direction="left">
            <div>
              <h3 className="font-display text-3xl font-bold text-sun">
                Trại hè #8 — Bản Séo Mý Tỷ, Lào Cai
              </h3>
              <p className="mt-4 max-w-[48ch] text-white/90">
                Ba tuần dạy học kết hợp một chuyến leo ngắn lên đỉnh Ngũ Chỉ Sơn
                cùng các em lớn.
              </p>
            </div>
          </Reveal>

          <Reveal direction="right">
            <div className="rounded-sm border border-white/25 bg-black/15 p-6">
              <div className="font-mono text-xs text-white/70">
                15 Th8 — 5 Th9, 2026
              </div>
              <div className="my-3 font-display text-xl font-bold text-white">
                Đăng ký đồng hành
              </div>
              <a
                href="#"
                className="block rounded-sm bg-sun py-3 text-center font-mono text-xs uppercase tracking-wider text-ink hover:brightness-90"
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
