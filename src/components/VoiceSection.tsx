import { Reveal } from "./Reveal";

const VOICES = [
  {
    quote:
      "Con tôi từ đứa trẻ không chịu cầm bút, giờ tự viết thư cho anh Đăng mỗi tháng.",
    who: "Chị Sùng — phụ huynh, Sín Suối Hồ",
  },
  {
    quote:
      "Anh ấy leo chậm hơn tôi tưởng, nhưng không bao giờ để ai bị bỏ lại phía sau.",
    who: "Hùng — bạn đồng hành leo núi",
  },
  {
    quote:
      "Em học đọc từ chú Đăng năm 10 tuổi. Năm nay em dẫn đoàn leo núi lên Tà Xùa.",
    who: "Mai — học trò cũ, nay 17 tuổi",
  },
];

export function VoicesSection() {
  return (
    <section id="voices" className="bg-sage/15 border border-sage/30 py-32">
      <div className="mx-auto max-w-[var(--page-w)] px-6">
        <h2 className="mb-16 font-display text-4xl font-bold text-ink">
          Từ những người đã đi cùng
        </h2>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {VOICES.map((v, i) => (
            <Reveal
              key={v.who}
              direction={i % 2 === 0 ? "left" : "right"}
              delay={i * 100}
            >
              <div
                key={v.who}
                className="rounded-sm border border-paper/15 p-7"
              >
                <p className="font-body italic text-ink/80">{v.quote}</p>
                <div className="mt-5 font-mono text-xs text-sage">{v.who}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
