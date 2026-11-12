"use client";

import { useState } from "react";
import { ChevronDown, MessageCircleQuestion, Phone } from "lucide-react";
import { Reveal } from "@/components/animation/Reveal";

const FAQS = [
  {
    q: "Một phiên coaching kéo dài bao lâu?",
    a: "Mỗi phiên thường kéo dài 60–90 phút. Độ dài cụ thể sẽ được thống nhất trước giữa bạn và coach, tùy theo nhu cầu và chủ đề của buổi hôm đó.",
  },
  {
    q: "Coaching 1:1 khác gì so với các khóa học hay chương trình nhóm?",
    a: "Các khóa học và chương trình nhóm theo lộ trình chung, phù hợp để xây nền tảng hoặc trải nghiệm cùng cộng đồng. Coaching 1:1 hoàn toàn cá nhân hóa — nội dung, tốc độ và mục tiêu đều được thiết kế riêng cho bạn, không ai giống ai.",
  },
  {
    q: "Tôi chưa biết mình cần gì, có thể tham gia không?",
    a: "Hoàn toàn được. Nhiều học viên bắt đầu với cảm giác mơ hồ, chưa rõ vấn đề. Phiên đầu tiên sẽ giúp làm rõ điều bạn thực sự cần — đó cũng là lý do buổi khám phá đầu tiên hoàn toàn miễn phí.",
  },
  {
    q: "Hình thức coaching là online hay offline?",
    a: "Sunshine Center hỗ trợ cả hai hình thức. Bạn có thể gặp trực tiếp tại Đà Nẵng hoặc tham gia qua video call tùy theo điều kiện và mong muốn của bạn.",
  },
  {
    q: "Chi phí của coaching 1:1 là bao nhiêu?",
    a: "Chi phí thay đổi tùy theo số phiên và gói đồng hành bạn chọn. Vui lòng liên hệ trực tiếp để được tư vấn chi tiết — buổi khám phá đầu tiên hoàn toàn miễn phí và không ràng buộc.",
  },
  {
    q: "Nếu tôi không thấy phù hợp sau vài buổi thì sao?",
    a: "Chúng tôi luôn ưu tiên sự phù hợp hơn số buổi. Nếu sau buổi đầu bạn cảm thấy không phù hợp với coach, Sunshine Center sẽ hỗ trợ bạn kết nối với người đồng hành khác phù hợp hơn.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative scroll-mt-24 overflow-hidden bg-cream px-6 py-20 md:py-28"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-yellow/15 blur-3xl"
      />
      <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.4fr)] lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-16 lg:gap-y-8">
        <Reveal direction="up" className="lg:col-start-1 lg:row-start-1">
          <div className="lg:pt-2">
            <div className="mb-3 flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-yellow">
              <span className="block h-px w-6 bg-yellow" />
              Câu hỏi thường gặp
            </div>
            <h2
              id="faq-heading"
              className="font-display text-3xl font-bold leading-tight text-blue md:text-4xl"
            >
              Những điều bạn <span className="text-yellow">muốn biết</span>
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-blue/70">
              Trước khi bắt đầu, ai cũng có vài điều băn khoăn. Đây là những câu hỏi học viên hay
              hỏi nhất về hành trình coaching 1:1.
            </p>

          </div>
        </Reveal>

        <div className="space-y-3 lg:col-start-2 lg:row-span-2 lg:row-start-1">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            const headingId = `faq-q-${i}`;
            const panelId = `faq-a-${i}`;
            return (
              <Reveal key={faq.q} direction="up" delay={i * 60}>
                <div
                  className={`group relative overflow-hidden rounded-2xl border bg-white transition-all duration-500 ${
                    isOpen
                      ? "border-yellow/60 shadow-lg shadow-blue/10"
                      : "border-blue/10 hover:-translate-y-0.5 hover:border-blue/20 hover:shadow-md hover:shadow-blue/5"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute inset-y-0 left-0 w-1 origin-top bg-yellow transition-transform duration-500 ease-out ${
                      isOpen ? "scale-y-100" : "scale-y-0"
                    }`}
                  />
                  <button
                    id={headingId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex w-full items-center gap-4 px-5 py-5 text-left font-bold text-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue sm:px-6"
                  >
                    <span
                      aria-hidden="true"
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full font-mono text-xs font-bold transition-colors duration-500 ${
                        isOpen ? "bg-blue text-yellow" : "bg-blue/5 text-blue/60 group-hover:bg-blue/10"
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-[15px] leading-snug md:text-base">{faq.q}</span>
                    <span
                      aria-hidden="true"
                      className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border transition-all duration-500 ${
                        isOpen
                          ? "rotate-180 border-yellow bg-yellow text-blue"
                          : "border-blue/15 text-blue/60 group-hover:border-yellow group-hover:text-blue"
                      }`}
                    >
                      <ChevronDown size={16} strokeWidth={2.2} />
                    </span>
                  </button>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={headingId}
                    className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p
                        className={`px-5 pb-6 pl-[4.25rem] text-sm leading-relaxed text-blue/70 transition-all duration-500 sm:px-6 sm:pl-[4.5rem] md:text-base ${
                          isOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
                        }`}
                      >
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
        <Reveal direction="up" className="lg:col-start-1 lg:row-start-2">
          <div className="max-w-md rounded-2xl bg-blue p-6 text-white shadow-xl shadow-blue/15">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-yellow text-blue">
                <MessageCircleQuestion size={20} strokeWidth={1.8} aria-hidden="true" />
              </span>
              <p className="font-display text-lg font-bold">Vẫn còn thắc mắc?</p>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Gọi trực tiếp hoặc để lại lời nhắn — buổi trò chuyện đầu tiên không ràng buộc.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="tel:0935626186"
                className="inline-flex items-center gap-2 rounded-full bg-yellow px-4 py-2 text-sm font-bold text-blue transition-transform duration-300 hover:-translate-y-0.5"
              >
                <Phone size={15} aria-hidden="true" />
                0935 626 186
              </a>
              <a
                href="/#lien-he"
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-sm font-semibold text-white transition-colors duration-300 hover:border-yellow hover:text-yellow"
              >
                Gửi lời nhắn
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
