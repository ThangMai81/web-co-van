"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "../animation/Reveal";

const COMPANY_INFO = [
  {
    label: "Mã số thuế",
    value: "0402276590",
  },
  {
    label: "Địa chỉ thuế",
    value:
      "Số 21 đường số 04, Khu đô thị quốc tế Đa Phước, Phường Hải Châu, TP Đà Nẵng, Việt Nam",
  },
  {
    label: "Địa chỉ",
    value:
      "Số 21 đường số 04, Khu đô thị quốc tế Đa Phước, Phường Hải Châu, Thành phố Đà Nẵng, Việt Nam",
  },
  {
    label: "Tình trạng",
    value: "Đang hoạt động",
  },
  {
    label: "Người đại diện",
    value: "LÊ THỊ KIM YẾN",
  },
  {
    label: "Điện thoại",
    value: "0935626186",
  },
  {
    label: "Ngày hoạt động",
    value: "20/05/2025",
  },
  {
    label: "Quản lý bởi",
    value: "Thuế cơ sở 2 thành phố Đà Nẵng",
  },
  {
    label: "Loại hình doanh nghiệp",
    value: "Công ty trách nhiệm hữu hạn 2 thành viên trở lên ngoài NN",
  },
  // {
  //   label: "Ngành nghề chính",
  //   value: "Giáo dục khác chưa được phân vào đâu",
  // },
];

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(section);
        }
      },
      {
        threshold: 0.15,
      },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="bg-paper py-24 md:py-28">
      <Reveal direction="left">
        <div className="rounded-sm bg-sun-soft" />
      </Reveal>
      <Reveal direction="right">
        <div className="mx-auto max-w-[var(--page-w)] px-6">
          {/* Header */}
          <div
            className={`mb-10 transition-all duration-700 ease-out ${
              visible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
            }`}
          >
            <div className="mb-3 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-sun">
              <span className="h-px w-5 bg-sun" />
              Thông tin doanh nghiệp
            </div>

            <h2 className="font-display text-2xl font-bold text-ink md:text-3xl">
              Công ty TNHH MẶT TRỜI TỎA SÁNG
            </h2>

            <p className="mt-2 max-w-[60ch] text-sm text-ink/55">
              Thông tin đăng ký và hoạt động của doanh nghiệp.
            </p>
          </div>

          {/* Company card */}
          <div className="mx-auto max-w-5xl overflow-hidden rounded-md border border-paper/10 bg-paper">
            {/* Company identity */}
            <div
              className={`flex flex-col items-center border-b border-paper/10 px-6 py-8 text-center transition-all delay-100 duration-700 ease-out sm:py-10 ${
                visible
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-8 opacity-0"
              }`}
            >
              <div className="relative mb-4 h-20 w-48 sm:h-24 sm:w-56">
                <Image
                  src="/images/Sunshine_brand.png"
                  alt="Sunshine Center"
                  fill
                  className="object-contain"
                />
              </div>

              <h3 className="font-display text-lg font-semibold text-ink">
                CÔNG TY TNHH MẶT TRỜI TỎA SÁNG
              </h3>

              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.15em] text-sage">
                Sunshine Center
              </p>
            </div>

            {/* Information rows */}
            <div>
              {COMPANY_INFO.map((item, index) => (
                <div
                  key={item.label}
                  className={`grid grid-cols-1 gap-1 px-5 py-4 transition-all duration-700 ease-out sm:grid-cols-[190px_1fr] sm:gap-8 sm:px-7 ${
                    index !== COMPANY_INFO.length - 1
                      ? "border-b border-paper/10"
                      : ""
                  } ${
                    visible
                      ? "translate-x-0 opacity-100"
                      : "-translate-x-6 opacity-0"
                  }`}
                  style={{
                    transitionDelay: `${150 + index * 70}ms`,
                  }}
                >
                  <div className="font-mono text-[10px] uppercase tracking-wider text-sage">
                    {item.label}
                  </div>

                  <div className="text-sm leading-6 text-ink/75">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
