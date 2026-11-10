"use client";

import { useState } from "react";
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
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="scroll-mt-24 bg-white px-6 py-20 md:py-24"
    >
      <div className="mx-auto max-w-[var(--page-w)]">
        <Reveal direction="up">
          <div className="mb-12 text-center">
            <div className="mb-3 flex items-center justify-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-yellow">
              <span className="block h-px w-6 bg-yellow" />
              Câu hỏi thường gặp
              <span className="block h-px w-6 bg-yellow" />
            </div>
            <h2
              id="faq-heading"
              className="font-display text-3xl font-bold text-blue md:text-4xl"
            >
              Những điều bạn muốn biết
            </h2>
          </div>
        </Reveal>

        <div className="mx-auto max-w-3xl divide-y divide-blue/10">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            const headingId = `faq-q-${i}`;
            const panelId = `faq-a-${i}`;
            return (
              <Reveal key={faq.q} direction="up" delay={i * 40}>
                <div>
                  <button
                    id={headingId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left font-bold text-blue transition-colors hover:text-blue/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2"
                  >
                    <span>{faq.q}</span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-yellow transition-transform duration-200"
                      style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </span>
                  </button>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={headingId}
                    className="grid transition-all duration-300 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="pb-5 text-sm leading-relaxed text-blue/70 md:text-base">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
