import { Reveal } from "@/components/animation/Reveal";
import { FounderStatsGravity } from "./FounderStatsGravity";
import { FounderPortraitCard } from "./FounderPortraitCard";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  Flame,
  GraduationCap,
  HandHeart,
  Quote,
  Sparkles,
} from "lucide-react";

const FOUNDER_VALUES = [
  { icon: HandHeart, label: "Tử tế, chân thành" },
  { icon: Sparkles, label: "Yêu thương" },
  { icon: Flame, label: "Hết mình vì khách hàng" },
];

const FOUNDER_STATS = [
  { key: "first", icon: Clock3, value: "5000+", label: "Giờ khai vấn" },
  { key: "second", icon: GraduationCap, value: "3000+", label: "Giờ đào tạo" },
];

export function Founder() {
  return (
    <section id="founder" className="scroll-mt-24 bg-white px-6 py-16 md:py-20">
      <div className="mx-auto grid max-w-[var(--page-w)] items-center gap-12 lg:grid-cols-2">
        <Reveal direction="left" showOnObserverSetupError>
          <FounderPortraitCard />
        </Reveal>

        <Reveal direction="right">
          <div>
            <div className="mb-4 flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-yellow">
              <span className="block h-px w-6 bg-yellow" />
              Nhà sáng lập
            </div>
            <h2 className="mb-5 font-display text-3xl font-bold text-blue md:text-4xl">
              Shining Coach Yến Lê
            </h2>
            <p className="mb-6 font-medium text-blue/70">
              Con đường mà Sunshine chọn là con đường trở về bên trong, chạm vào
              vùng sáng và soi sáng cho đời. Với giá trị tử tế chân thành, yêu
              thương và luôn hết mình vì khách hàng, Sunshine chọn là chốn dừng
              chân an toàn, nơi giúp bạn dũng cảm bước qua vùng sợ hãi để bước
              đến vùng thành tựu và góp phần làm đẹp cho đời.
            </p>
            <ul className="mb-7 flex flex-wrap gap-2.5">
              {FOUNDER_VALUES.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="inline-flex items-center gap-2 rounded-full border border-blue/10 bg-cream px-3.5 py-1.5 text-sm font-semibold text-blue"
                >
                  <Icon size={15} className="text-yellow" strokeWidth={2} aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
            <FounderStatsGravity className="grid grid-cols-2 gap-3 sm:gap-4">
              {FOUNDER_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="group relative flex-1 overflow-hidden rounded-2xl border border-blue/10 bg-white p-5 text-left shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-yellow/60 hover:shadow-lg hover:shadow-blue/10 sm:p-6"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-yellow via-[#ffe878] to-yellow"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-yellow/10 transition-transform duration-700 group-hover:scale-150"
                  />
                  <stat.icon size={20} className="relative mb-3 text-blue/50" strokeWidth={1.8} aria-hidden="true" />
                  <div
                    data-founder-stat-value={stat.key}
                    className="relative font-display text-3xl font-extrabold text-blue sm:text-4xl"
                  >
                    {stat.value}
                  </div>
                  <div className="relative mt-1 font-mono text-xs font-bold uppercase tracking-wider text-blue/60">
                    {stat.label}
                  </div>
                </div>
              ))}
            </FounderStatsGravity>
            <figure className="relative mt-7 rounded-2xl border-l-4 border-yellow bg-blue px-6 py-5 text-white shadow-lg shadow-blue/15">
              <Quote
                size={28}
                className="absolute right-5 top-4 text-yellow/30"
                aria-hidden="true"
              />
              <blockquote className="pr-8 text-[15px] italic leading-relaxed text-white/90">
                “Bạn đến với cuộc đời này bạn là một mặt trời, và cuộc đời cần bạn và nguồn ánh
                sáng chỉ riêng bạn mới có mà thôi.”
              </blockquote>
              <figcaption className="mt-3 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-yellow">
                — Shining Coach Yến Lê
              </figcaption>
            </figure>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/coaching/le-thi-kim-yen"
                className="inline-flex items-center gap-2 rounded-full bg-yellow px-5 py-2.5 text-sm font-bold text-blue shadow-md shadow-yellow/30 transition-transform duration-300 hover:-translate-y-0.5"
              >
                Xem hồ sơ của Yến
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link
                href="/coaching"
                className="inline-flex items-center gap-2 rounded-full border border-blue/20 px-5 py-2.5 text-sm font-semibold text-blue transition-colors duration-300 hover:border-blue hover:bg-blue hover:text-white"
              >
                Coaching 1:1
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
