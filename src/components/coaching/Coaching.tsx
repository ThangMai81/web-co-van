import Image from "next/image";
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

export function Coaching() {
  return (
    <>
      {/* Hero */}
      <section className="bg-cream px-6 pb-20 pt-40 md:pt-48">
        <div className="mx-auto grid max-w-[var(--page-w)] items-center gap-12 lg:grid-cols-2">
          <Reveal direction="left">
            <div>
              <div className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-sun">
                <span className="block h-px w-6 bg-sun" />
                Dịch vụ coaching 1:1
              </div>
              <h1 className="font-display text-4xl font-bold leading-tight text-ink md:text-5xl">
                Một người đồng hành, cho hành trình chỉ của riêng bạn.
              </h1>
              <p className="mt-6 max-w-lg text-lg text-ink/70">
                Không phải khoá học đại trà. Đây là không gian riêng để bạn được
                lắng nghe, thấu hiểu và dẫn dắt đến đúng mục tiêu của chính
                mình.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#booking"
                  className="rounded-sm bg-sun px-7 py-3.5 font-mono text-xs uppercase tracking-wider text-ink transition-colors hover:brightness-90"
                >
                  Đặt lịch tư vấn miễn phí
                </a>
                <a
                  href="#process"
                  className="rounded-sm border border-ink/25 px-7 py-3.5 font-mono text-xs uppercase tracking-wider transition-colors hover:border-ink"
                >
                  Xem quy trình
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal direction="right">
            <div className="relative aspect-[4/3] overflow-hidden rounded-md">
              <Image
                src="/images/collaborate_team.jpg"
                alt="Coaching 1:1"
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Dành cho ai */}
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
                  <div className="mb-4 font-mono text-xs text-sun">
                    0{i + 1}
                  </div>
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

      {/* Video giới thiệu (demo placeholder) */}
      <section className="bg-cream px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal direction="up">
            <h2 className="mb-4 font-display text-3xl font-bold text-ink md:text-4xl">
              Coaching 1:1 thực sự diễn ra như thế nào?
            </h2>
            <p className="mb-10 text-ink/65">
              2 phút để hiểu cách một buổi coaching thật sự vận hành.
            </p>
          </Reveal>

          <Reveal direction="scale">
            {/* TODO: thay bằng video thật (video tag hoặc iframe YouTube) */}
            <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-md bg-ink">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sun">
                <div className="ml-1 h-0 w-0 border-y-[10px] border-l-[16px] border-y-transparent border-l-ink" />
              </div>
              <span className="absolute bottom-4 right-4 font-mono text-[10px] uppercase tracking-wider text-chalk/50">
                Video demo — thay bằng nội dung thật
              </span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Quy trình - xen kẽ trái phải */}
      <section id="process" className="bg-paper px-6 py-24">
        <div className="mx-auto max-w-[var(--page-w)]">
          <Reveal direction="up">
            <h2 className="mb-16 text-center font-display text-3xl font-bold text-ink md:text-4xl">
              Quy trình đồng hành
            </h2>
          </Reveal>

          <div className="flex flex-col gap-20">
            {PROCESS.map((item, i) => {
              const imageFirst = i % 2 === 0;
              return (
                <div
                  key={item.step}
                  className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
                >
                  <Reveal direction={imageFirst ? "left" : "right"}>
                    <div
                      className={`relative aspect-[4/3] overflow-hidden rounded-md ${
                        imageFirst ? "lg:order-1" : "lg:order-2"
                      }`}
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  </Reveal>

                  <Reveal direction={imageFirst ? "right" : "left"}>
                    <div className={imageFirst ? "lg:order-2" : "lg:order-1"}>
                      <div className="mb-4 font-mono text-sm text-sun">
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

      {/* Về người coach */}
      <section className="bg-cream px-6 py-24">
        <div className="mx-auto grid max-w-[var(--page-w)] items-center gap-12 lg:grid-cols-2">
          <Reveal direction="left">
            <div className="relative aspect-[4/5] overflow-hidden rounded-md">
              <Image
                src="/images/Yến.jpg"
                alt="Người đồng hành"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal direction="right">
            <div>
              <div className="mb-4 font-mono text-xs uppercase tracking-widest text-sun">
                Người đồng hành cùng bạn
              </div>
              <h2 className="mb-5 font-display text-3xl font-bold text-ink md:text-4xl">
                Lê Thị Kim Yến
              </h2>
              <p className="mb-4 text-ink/70">
                Với nhiều năm kinh nghiệm đồng hành cùng học viên trong hành
                trình phát triển bản thân, tôi tin rằng mỗi người đều có câu trả
                lời đúng cho chính mình — vai trò của tôi là giúp bạn tìm ra nó
                nhanh hơn, rõ ràng hơn.
              </p>
              <p className="text-ink/70">
                Không phán xét, không áp đặt phương pháp cứng nhắc — chỉ có sự
                lắng nghe thật sự và một lộ trình phù hợp với riêng bạn.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Gói dịch vụ */}
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

      {/* CTA cuối */}
      <section
        id="booking"
        className="bg-ink px-6 py-24 text-center text-chalk"
      >
        <Reveal direction="scale">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold md:text-4xl">
            Sẵn sàng cho một buổi trò chuyện đầu tiên?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-chalk/70">
            30 phút miễn phí, không ràng buộc — chỉ để hiểu rõ hơn liệu đây có
            phải là điều bạn đang tìm kiếm.
          </p>
          <a
            href="#"
            className="mt-8 inline-block rounded-sm bg-sun px-8 py-4 font-mono text-xs uppercase tracking-wider text-ink transition-colors hover:brightness-90"
          >
            Đặt lịch ngay
          </a>
        </Reveal>
      </section>
    </>
  );
}
