"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Building2 } from "@/lib/icons";
import { HeartHandshake, Mountain, Sunrise, type LucideIcon } from "lucide-react";

const COMPANY_INFO = [
  { label: "Mã số thuế", value: "0402276590" },
  {
    label: "Địa chỉ thuế",
    value:
      "Số 21 đường số 04, Khu đô thị quốc tế Đa Phước, Phường Hải Châu, Thành phố Đà Nẵng, Việt Nam",
  },
  {
    label: "Địa chỉ",
    value:
      "Số 21 đường số 04, Khu đô thị quốc tế Đa Phước, Phường Hải Châu, Thành phố Đà Nẵng, Việt Nam",
  },
  { label: "Tình trạng", value: "Đang hoạt động" },
  { label: "Người đại diện", value: "LÊ THỊ KIM YẾN" },
  { label: "Điện thoại", value: "0935626186" },
  { label: "Ngày hoạt động", value: "20/05/2025" },
  { label: "Quản lý bởi", value: "Thuế cơ sở 2 thành phố Đà Nẵng" },
  {
    label: "Loại hình doanh nghiệp",
    value: "Công ty trách nhiệm hữu hạn 2 thành viên trở lên ngoài NN",
  },
];

const ABOUT_CARDS: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: Sunrise,
    title: "Xuất phát từ trái tim",
    desc: "Sunshine Center được thành lập năm 2025 với một niềm tin đơn giản: mỗi người đều có ánh sáng riêng bên trong — và đôi khi chỉ cần một môi trường an toàn để ánh sáng đó được nhìn thấy.",
  },
  {
    icon: Mountain,
    title: "Trải nghiệm thực, chuyển hóa thật",
    desc: "Từ những buổi leo núi chinh phục Fansipan đến workshop khai phóng nội tâm — chúng tôi tin rằng sự thay đổi đến từ những khoảnh khắc được sống trọn vẹn, không phải từ lý thuyết.",
  },
  {
    icon: HeartHandshake,
    title: "Cộng đồng lan tỏa",
    desc: "Sunshine không chỉ là nơi học — mà là một cộng đồng những người cùng chọn sống tỉnh thức, cùng nâng đỡ nhau và lan tỏa ánh sáng ra thế giới xung quanh.",
  },
];

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Respect prefers-reduced-motion
    let prefersReduced = false;
    try {
      prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch { /* noop */ }
    if (prefersReduced) { setVisible(true); return; }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(section);
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="bg-white py-24 md:py-28">
      <div className="mx-auto max-w-[var(--page-w)] px-6">

        {/* Phần giới thiệu ý nghĩa */}
        <div
          className={`mb-14 transition-all duration-700 ease-out ${
            visible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
          }`}
        >
          <div className="mb-3 flex items-center gap-3 font-mono text-sm font-bold uppercase tracking-[0.2em] text-yellow">
            <span className="h-px w-5 bg-yellow" />
            Về chúng tôi
          </div>
          <h2 className="font-display text-2xl font-bold text-blue md:text-3xl">
            Sunshine Center — Nơi ánh sáng bắt đầu
          </h2>
          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {ABOUT_CARDS.map((card, i) => (
              <div
                key={card.title}
                className={`group rounded-2xl border border-blue/10 bg-blue/5 p-6 transition-all duration-700 ease-out hover:border-yellow/60 hover:bg-white hover:shadow-lg hover:shadow-blue/10 ${
                  visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
                style={{ transitionDelay: `${80 + i * 80}ms` }}
              >
                <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-blue text-yellow shadow-md shadow-blue/20 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                  <card.icon size={22} strokeWidth={1.7} aria-hidden="true" />
                </div>
                <h3 className="mb-2 font-display text-lg font-bold text-blue">{card.title}</h3>
                <p className="text-sm leading-relaxed text-blue/70">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Label bảng đăng ký */}
        <div
          className={`mb-4 transition-all duration-700 ease-out ${
            visible ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "320ms" }}
        >
          <div className="flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-blue/40">
            <span className="h-px w-5 bg-blue/20" />
            Thông tin đăng ký doanh nghiệp
          </div>
        </div>

        {/* Bảng thông tin doanh nghiệp */}
        <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border-2 border-blue/10 bg-blue/5">
          <div
            className={`flex flex-col items-center border-b-2 border-blue/10 bg-blue px-6 py-8 text-center transition-all duration-700 ease-out sm:py-10 ${
              visible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
            }`}
            style={{ transitionDelay: "380ms" }}
          >
            <div className="relative mb-4 h-20 w-48 rounded-lg bg-white/90 p-2 sm:h-24 sm:w-56">
              <Image
                src="/images/Sunshine_brand.png"
                alt="Sunshine Center"
                fill
                className="object-contain p-2"
              />
            </div>
            <div className="flex items-center gap-2">
              <Building2 size={18} className="text-yellow" />
              <h3 className="font-display text-lg font-bold text-white">
                CÔNG TY TNHH MẶT TRỜI TỎA SÁNG THE SUNSHINE
              </h3>
            </div>
            <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.15em] text-yellow">
              Giá trị tạo nên thương hiệu
            </p>
          </div>

          <div>
            {COMPANY_INFO.map((item, index) => (
              <div
                key={item.label}
                className={`grid grid-cols-1 gap-1 px-5 py-4 transition-all duration-700 ease-out sm:grid-cols-[190px_1fr] sm:gap-8 sm:px-7 ${
                  index !== COMPANY_INFO.length - 1 ? "border-b border-blue/10" : ""
                } ${visible ? "translate-x-0 opacity-100" : "-translate-x-6 opacity-0"}`}
                style={{ transitionDelay: `${420 + index * 50}ms` }}
              >
                <div className="font-mono text-[10px] font-bold uppercase tracking-wider text-blue">
                  {item.label}
                </div>
                <div className="text-sm font-medium leading-6 text-blue/75">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
