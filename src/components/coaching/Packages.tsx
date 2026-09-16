import { Reveal } from "@/components/animation/Reveal";

const PACKAGES = [
  {
    name: "Khởi động",
    sessions: "4 buổi / tháng",
    desc: "Phù hợp với người mới bắt đầu hành trình phát triển bản thân, cần định hướng ban đầu.",
    featured: false,
  },
  {
    name: "Đồng hành",
    sessions: "8 buổi / tháng",
    desc: "Lộ trình sâu sát, phù hợp với mục tiêu dài hạn cần theo dõi và điều chỉnh thường xuyên.",
    featured: true,
  },
  {
    name: "Chuyên sâu",
    sessions: "Không giới hạn",
    desc: "Đồng hành toàn diện, hỗ trợ liên tục cho các mục tiêu lớn hoặc giai đoạn chuyển đổi quan trọng.",
    featured: false,
  },
];

export function Packages() {
  return (
    <section className="bg-paper px-6 py-24">
      <div className="mx-auto max-w-[var(--page-w)]">
        <Reveal direction="up">
          <h2 className="mb-14 text-center font-display text-3xl font-bold text-ink md:text-4xl">
            Gói đồng hành
          </h2>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-3">
          {PACKAGES.map((pkg, i) => (
            <Reveal key={pkg.name} direction="up" delay={i * 100}>
              <div
                className={`flex h-full flex-col rounded-md border p-8 ${
                  pkg.featured
                    ? "border-sun bg-ink text-chalk"
                    : "border-sage/30 bg-cream text-ink"
                }`}
              >
                {pkg.featured && (
                  <span className="mb-4 w-fit rounded-full bg-sun px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-ink">
                    Phổ biến nhất
                  </span>
                )}
                <h3 className="mb-2 font-display text-xl font-bold">
                  {pkg.name}
                </h3>
                <div
                  className={`mb-4 font-mono text-sm ${
                    pkg.featured ? "text-sun" : "text-sage"
                  }`}
                >
                  {pkg.sessions}
                </div>
                <p
                  className={`mb-8 flex-1 text-sm leading-6 ${
                    pkg.featured ? "text-chalk/70" : "text-ink/65"
                  }`}
                >
                  {pkg.desc}
                </p>
                <a
                  href="#booking"
                  className={`rounded-sm py-3 text-center font-mono text-xs uppercase tracking-wider transition-colors ${
                    pkg.featured
                      ? "bg-sun text-ink hover:brightness-90"
                      : "border border-ink/25 hover:border-ink"
                  }`}
                >
                  Liên hệ tư vấn
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
