import { Compass, Rocket, Sprout, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/animation/Reveal";

const AUDIENCE: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Compass,
    title: "Đang loay hoay tìm hướng đi",
    body: "Bạn có nhiều lựa chọn nhưng chưa biết đâu là con đường phù hợp nhất với chính mình.",
  },
  {
    icon: Rocket,
    title: "Muốn bứt phá nhưng thiếu người dẫn dắt",
    body: "Bạn đã cố gắng một mình, nhưng cần một người đồng hành có kinh nghiệm thực chiến để đi nhanh hơn.",
  },
  {
    icon: Sprout,
    title: "Sẵn sàng đầu tư cho chính mình",
    body: "Bạn hiểu rằng thay đổi thật sự cần cam kết, thời gian, và một lộ trình rõ ràng — không phải các mẹo vặt.",
  },
];

export function Audience() {
  return (
    <section className="bg-white px-6 py-20 md:py-28">
      <div className="mx-auto max-w-[var(--page-w)]">
        <Reveal direction="up">
          <div className="mb-14 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-4 flex items-center gap-3 font-mono text-sm font-bold uppercase tracking-[0.2em] text-blue/60">
                <span className="block h-px w-8 bg-yellow" />
                Dành cho ai
              </div>
              <h2 className="font-display text-3xl font-bold text-blue md:text-5xl">
                Coaching 1:1 dành cho bạn nếu…
              </h2>
            </div>
            <p className="max-w-[38ch] text-blue/65 md:text-right">
              Nếu bạn thấy mình trong một trong ba điều dưới đây, đây có thể là
              lúc để có người đi cùng.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {AUDIENCE.map((item, i) => (
            <Reveal key={item.title} direction="up" delay={i * 150}>
              <article className="group relative h-full overflow-hidden rounded-3xl bg-blue p-8 shadow-xl shadow-blue/15 transition-transform duration-500 hover:-translate-y-2 md:p-10">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-3 -top-6 font-display text-[8rem] font-extrabold leading-none text-transparent [-webkit-text-stroke:1.5px_rgb(254_206_1/0.18)] transition-transform duration-700 group-hover:-translate-x-2 group-hover:translate-y-2"
                >
                  0{i + 1}
                </span>
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-yellow transition-transform duration-700 group-hover:scale-x-100"
                />
                <div className="relative">
                  <span className="mb-8 grid h-14 w-14 place-items-center rounded-2xl bg-yellow text-blue shadow-lg shadow-yellow/20 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                    <item.icon size={26} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                  <h3 className="font-display text-2xl font-bold leading-snug text-white">
                    {item.title}
                  </h3>
                  <p className="mt-4 leading-relaxed text-white/70">{item.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
