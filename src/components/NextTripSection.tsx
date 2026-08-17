export function NextTripSection() {
  return (
    <section id="trip" className="bg-pine py-32">
      <div className="mx-auto max-w-[var(--page-w)] px-6">
        <div className="grid grid-cols-1 gap-10 rounded-md bg-rust p-10 lg:grid-cols-[1.3fr_0.7fr] lg:items-center">
          <div>
            <h3 className="font-display text-3xl font-bold text-chalk">
              Trại hè #8 — Bản Séo Mý Tỷ, Lào Cai
            </h3>
            <p className="mt-4 max-w-[48ch] text-paper/80">
              Ba tuần dạy học kết hợp một chuyến leo ngắn lên đỉnh Ngũ Chỉ Sơn
              cùng các em lớn.
            </p>
          </div>

          <div className="rounded-sm border border-paper/20 bg-black/20 p-6">
            <div className="font-mono text-xs text-paper/70">
              15 Th8 — 5 Th9, 2026
            </div>
            <div className="my-3 font-display text-xl font-bold text-chalk">
              Đăng ký đồng hành
            </div>
            <a
              href="#"
              className="block rounded-sm bg-chalk py-3 text-center font-mono text-xs uppercase tracking-wider text-rust"
            >
              Gửi lời quan tâm
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
