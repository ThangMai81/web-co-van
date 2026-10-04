import { Reveal } from "@/components/animation/Reveal";

export function CultureAndValues() {
  return (
    <section className="relative overflow-hidden bg-blue px-6 py-24">
      <div className="pointer-events-none absolute right-0 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-yellow/10 blur-3xl" />

      <div className="relative mx-auto max-w-[var(--page-w)]">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal direction="left">
            <div className="h-full rounded-2xl border border-white/15 bg-white/5 p-8">
              <div className="mb-4 flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-yellow">
                <span className="block h-px w-6 bg-yellow" />
                Văn hoá
              </div>
              <p className="text-lg font-medium text-white/90">
                Sunshine phụng sự bằng trái tim có trí tuệ, mỗi thành viên đều
                là một "shipper ánh sáng", với phương châm giúp khách hàng chạm
                vào vùng sáng bên trong họ.
              </p>
            </div>
          </Reveal>

          <Reveal direction="right">
            <div className="h-full rounded-2xl border border-white/15 bg-white/5 p-8">
              <div className="mb-4 flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-yellow">
                <span className="block h-px w-6 bg-yellow" />
                Giá trị cốt lõi
              </div>
              <p className="mb-4 font-medium text-white/90">
                Với nhận thức mỗi người là thiên tài của một lĩnh vực nào đó,
                mỗi người là một mặt trời và có khả năng tự toả sáng theo cách
                của chính họ. Sunshine tạo ra một môi trường an toàn nơi mọi
                người có thể tự tin mở cửa trái tim mình để tìm về với chính
                phiên bản sáng nhất bên trong họ.
              </p>
              <p className="font-medium text-white/90">
                Bằng cách lắng nghe, kiên nhẫn đồng hành, xây dựng niềm tin, giá
                trị, tạo trải nghiệm vượt ngưỡng bản thân, đánh thức con người
                phi thường bên trong mỗi người.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
