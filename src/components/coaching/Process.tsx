import Image from "next/image";
import { Reveal } from "@/components/animation/Reveal";

const PROCESS = [
  {
    step: "01",
    title: "Buổi khám phá miễn phí",
    body: "30 phút trò chuyện để hiểu rõ mục tiêu, khó khăn hiện tại và xác định xem coaching 1:1 có phải giải pháp phù hợp với bạn hay không.",
    image: "/images/collaborate_team.jpg",
  },
  {
    step: "02",
    title: "Xây dựng lộ trình cá nhân hoá",
    body: "Không có khuôn mẫu chung — lộ trình được thiết kế riêng dựa trên mục tiêu, tính cách và hoàn cảnh cụ thể của từng học viên.",
    image: "/images/first_banner.jpg",
  },
  {
    step: "03",
    title: "Đồng hành & điều chỉnh liên tục",
    body: "Các buổi coaching định kỳ, theo sát tiến độ, điều chỉnh phương pháp linh hoạt theo từng giai đoạn thay đổi của bạn.",
    image: "/images/Sunshine_banner.png",
  },
];

export function Process() {
  return (
    <section id="process" className="bg-paper px-6 py-24">
      <div className="mx-auto max-w-[var(--page-w)]">
        <Reveal direction="up">
          <h2 className="mb-16 text-center font-display text-3xl font-bold text-ink md:text-4xl">
            Quy trình đồng hành
          </h2>
        </Reveal>

        <div className="flex flex-col gap-28">
          {PROCESS.map((item, i) => {
            const imageFirst = i % 2 === 0;
            return (
              <div
                key={item.step}
                className="grid items-start gap-10 md:grid-cols-2 md:gap-16"
              >
                <Reveal direction={imageFirst ? "left" : "right"}>
                  <div
                    className={`relative aspect-[4/3] overflow-hidden rounded-md ${
                      imageFirst ? "md:order-1" : "md:order-2"
                    }`}
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                </Reveal>

                <Reveal direction={imageFirst ? "right" : "left"}>
                  <div
                    className={`flex h-full flex-col justify-center ${
                      imageFirst ? "md:order-2" : "md:order-1"
                    }`}
                  >
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sun font-mono text-sm font-bold text-ink">
                      {item.step}
                    </div>
                    <h3 className="mb-4 font-display text-2xl font-bold text-ink md:text-3xl">
                      {item.title}
                    </h3>
                    <p className="max-w-md text-ink/65">{item.body}</p>
                  </div>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
