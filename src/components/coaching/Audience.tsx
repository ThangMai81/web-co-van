import { Reveal } from "@/components/animation/Reveal";

const AUDIENCE = [
  {
    title: "Đang loay hoay tìm hướng đi",
    body: "Bạn có nhiều lựa chọn nhưng chưa biết đâu là con đường phù hợp nhất với chính mình.",
  },
  {
    title: "Muốn bứt phá nhưng thiếu người dẫn dắt",
    body: "Bạn đã cố gắng một mình, nhưng cần một người đồng hành có kinh nghiệm thực chiến để đi nhanh hơn.",
  },
  {
    title: "Sẵn sàng đầu tư cho chính mình",
    body: "Bạn hiểu rằng thay đổi thật sự cần cam kết, thời gian, và một lộ trình rõ ràng — không phải các mẹo vặt.",
  },
];

export function Audience() {
  return (
    <section className="bg-paper px-6 py-24">
      <div className="mx-auto max-w-[var(--page-w)]">
        <Reveal direction="up">
          <h2 className="mb-14 text-center font-display text-3xl font-bold text-ink md:text-4xl">
            Coaching 1:1 dành cho bạn nếu...
          </h2>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-3">
          {AUDIENCE.map((item, i) => (
            <Reveal key={item.title} direction="up" delay={i * 100}>
              <div className="h-full rounded-md border border-sage/30 bg-cream p-8">
                <div className="mb-4 font-mono text-xs text-sun">0{i + 1}</div>
                <h3 className="mb-3 font-display text-xl font-semibold text-ink">
                  {item.title}
                </h3>
                <p className="text-sm leading-6 text-ink/65">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
