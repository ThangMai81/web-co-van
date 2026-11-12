"use client";

import { useState } from "react";
import { Reveal } from "@/components/animation/Reveal";

const FAQS = [
  {
    q: "Tôi chưa từng tham gia hoạt động nào như vậy, có phù hợp không?",
    a: "Có. Nhiều học viên đến với Sunshine Center lần đầu và còn nhiều băn khoăn. Mỗi chương trình đều có người dẫn dắt đồng hành, và bạn có thể chọn mức độ tham gia phù hợp với mình.",
  },
  {
    q: "Làm sao để biết chương trình nào hợp với mình?",
    a: "Bạn có thể lọc theo loại chương trình và trạng thái ở phía trên, hoặc để lại thông tin để đội ngũ lắng nghe mong muốn của bạn và gợi ý hướng đi phù hợp.",
  },
  {
    q: "Chương trình diễn ra online hay trực tiếp?",
    a: "Tùy từng chương trình. Hình thức tham gia được ghi rõ ngay trên thẻ chương trình và trong trang chi tiết, để bạn dễ cân nhắc trước khi đăng ký.",
  },
  {
    q: "Tôi muốn đăng ký hoặc hỏi thêm thì liên hệ ở đâu?",
    a: "Với chương trình đang mở đăng ký, trang chi tiết có thông tin liên hệ trực tiếp. Bạn cũng có thể gửi câu hỏi qua mục liên hệ ở trang chủ, đội ngũ sẽ phản hồi sớm nhất có thể.",
  },
  {
    q: "Các chương trình đã diễn ra có còn xem được không?",
    a: "Có. Bạn có thể xem lại hình ảnh và điểm nổi bật của những chương trình đã diễn ra trong mục “Đã diễn ra” để hình dung rõ hơn về trải nghiệm.",
  },
];

export function ProgramFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      aria-labelledby="program-faq-heading"
      className="scroll-mt-24 bg-white px-6 py-16 md:py-20"
    >
      <div className="mx-auto max-w-[var(--page-w)]">
        <Reveal direction="up">
          <div className="mb-10 text-center">
            <div className="mb-3 flex items-center justify-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-yellow">
              <span className="block h-px w-6 bg-yellow" />
              Câu hỏi thường gặp
              <span className="block h-px w-6 bg-yellow" />
            </div>
            <h2
              id="program-faq-heading"
              className="font-display text-3xl font-bold text-blue md:text-4xl"
            >
              Trước khi bạn lên đường
            </h2>
          </div>
        </Reveal>

        <div className="mx-auto max-w-3xl space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = openIndex === i;
            const headingId = `program-faq-q-${i}`;
            const panelId = `program-faq-a-${i}`;
            return (
              <Reveal key={faq.q} direction="up" delay={i * 60}>
                <div
                  className={`overflow-hidden rounded-2xl border bg-white transition-all duration-300 ${
                    isOpen
                      ? "border-yellow/60 shadow-lg shadow-blue/10"
                      : "border-blue/10 hover:border-blue/25"
                  }`}
                >
                  <button
                    id={headingId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-bold text-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-inset"
                  >
                    <span>{faq.q}</span>
                    <span
                      aria-hidden="true"
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                        isOpen ? "rotate-45 bg-yellow text-blue" : "bg-blue/5 text-yellow"
                      }`}
                    >
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                        <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                      </svg>
                    </span>
                  </button>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={headingId}
                    className="grid transition-[grid-template-rows] duration-300 ease-out"
                    style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 text-sm leading-relaxed text-blue/70 md:text-base">
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
