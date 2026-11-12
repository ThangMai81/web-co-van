import { Reveal } from "@/components/animation/Reveal";
import { CultureValuesOrbit } from "./CultureValuesOrbit";
import { Ear, Footprints, Gem, Handshake, Mountain, Sun } from "lucide-react";

const WAYS = [
  { icon: Ear, label: "Lắng nghe" },
  { icon: Footprints, label: "Kiên nhẫn đồng hành" },
  { icon: Handshake, label: "Xây dựng niềm tin" },
  { icon: Mountain, label: "Vượt ngưỡng bản thân" },
];

export function CultureAndValues() {
  return (
    <section id="culture-values" className="relative scroll-mt-24 overflow-hidden bg-blue px-6 py-16 md:py-20">
      <div className="pointer-events-none absolute right-0 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-yellow/10 blur-3xl" />
      <CultureValuesOrbit />

      <div className="relative mx-auto max-w-[var(--page-w)]">
        <Reveal direction="up" showOnObserverSetupError>
          <div className="mb-10 max-w-2xl">
            <div className="mb-3 flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-yellow">
              <span className="block h-px w-6 bg-yellow" />
              Văn hoá &amp; giá trị
            </div>
            <h2 className="font-display text-3xl font-bold leading-tight text-white md:text-4xl">
              Mỗi người là một <span className="text-yellow">mặt trời</span>
            </h2>
          </div>
        </Reveal>
        <div className="grid gap-5 lg:grid-cols-2 lg:gap-8">
          <Reveal direction="left" showOnObserverSetupError>
            <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/15 bg-white/[0.04] p-7 transition-colors duration-300 hover:border-yellow/50 hover:bg-white/[0.07] sm:p-10">
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-yellow to-yellow/0 transition-transform duration-700 group-hover:scale-x-100" />
              <span className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-yellow text-blue shadow-lg shadow-yellow/20 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                <Sun size={26} strokeWidth={1.8} aria-hidden="true" />
              </span>
              <div className="mb-4 flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-yellow">
                <span className="block h-px w-6 bg-yellow" />
                Văn hoá
              </div>
              <p className="mb-8 text-lg font-medium text-white/90">
                Sunshine phụng sự bằng trái tim có trí tuệ, mỗi thành viên đều
                là một "shipper ánh sáng", với phương châm giúp khách hàng chạm
                vào vùng sáng bên trong.
              </p>
              <div className="mt-auto border-t border-white/10 pt-6">
                <p className="mb-4 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-white/50">
                  Cách chúng tôi đồng hành
                </p>
                <ul className="grid grid-cols-2 gap-2.5">
                  {WAYS.map(({ icon: Icon, label }, i) => (
                    <li
                      key={label}
                      className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2.5 text-sm font-medium text-white/85 transition-all duration-500 hover:-translate-y-0.5 hover:border-yellow/50 hover:text-white"
                      style={{ transitionDelay: `${i * 40}ms` }}
                    >
                      <Icon size={16} className="shrink-0 text-yellow" strokeWidth={1.8} aria-hidden="true" />
                      {label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          <Reveal direction="right" showOnObserverSetupError>
            <div className="group relative h-full overflow-hidden rounded-3xl border border-white/15 bg-white/[0.04] p-7 transition-colors duration-300 hover:border-yellow/50 hover:bg-white/[0.07] sm:p-10">
              <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-yellow to-yellow/0 transition-transform duration-700 group-hover:scale-x-100" />
              <span className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-yellow text-blue shadow-lg shadow-yellow/20 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                <Gem size={26} strokeWidth={1.8} aria-hidden="true" />
              </span>
              <div className="mb-4 flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-yellow">
                <span className="block h-px w-6 bg-yellow" />
                Giá trị cốt lõi
              </div>
              <p className="mb-4 font-medium text-white/90">
                Với nhận thức mỗi người là thiên tài của một lĩnh vực nào đó,
                mỗi người là một mặt trời và có khả năng tự toả sáng theo cách
                của chính họ. Sunshine tạo ra một môi trường an toàn nơi mọi
                người có thể tự tin mở cửa trái tim mình để tìm về với chính
                phiên bản sáng nhất bên trong.
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
