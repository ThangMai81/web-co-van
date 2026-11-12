"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Briefcase,
  CalendarCheck,
  Hash,
  HeartHandshake,
  Landmark,
  MapPin,
  Mountain,
  Phone,
  Sunrise,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import styles from "./AboutSection.module.css";

const STATUS = "Đang hoạt động";
const FOUNDED = "20/05/2025";
const ADDRESS =
  "Số 21 đường số 04, Khu đô thị quốc tế Đa Phước, Phường Hải Châu, Thành phố Đà Nẵng, Việt Nam";

const COMPANY_INFO: {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
  wide?: boolean;
}[] = [
  { icon: Hash, label: "Mã số thuế", value: "0402276590" },
  { icon: UserRound, label: "Người đại diện", value: "LÊ THỊ KIM YẾN" },
  { icon: MapPin, label: "Địa chỉ trụ sở & địa chỉ thuế", value: ADDRESS, wide: true },
  { icon: Phone, label: "Điện thoại", value: "0935 626 186", href: "tel:0935626186" },
  { icon: CalendarCheck, label: "Ngày hoạt động", value: FOUNDED },
  { icon: Landmark, label: "Quản lý bởi", value: "Thuế cơ sở 2 thành phố Đà Nẵng" },
  {
    icon: Briefcase,
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
                className={`group relative overflow-hidden rounded-2xl border border-blue/10 bg-blue/5 p-6 transition-all duration-700 ease-out hover:border-yellow/60 hover:bg-white hover:shadow-lg hover:shadow-blue/10 ${
                  visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
                style={{ transitionDelay: `${80 + i * 80}ms` }}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-3 top-1 font-display text-[4.5rem] font-black leading-none text-blue/[0.05] transition-colors duration-500 group-hover:text-yellow/25"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-yellow transition-transform duration-700 ease-out group-hover:scale-x-100"
                />
                <div className="relative mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-blue text-yellow shadow-md shadow-blue/20 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                  <card.icon size={22} strokeWidth={1.7} aria-hidden="true" />
                </div>
                <h3 className="relative mb-2 font-display text-lg font-bold text-blue">{card.title}</h3>
                <p className="relative text-sm leading-relaxed text-blue/70">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hồ sơ doanh nghiệp */}
        <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[1.75rem] border border-blue/10 bg-white shadow-xl shadow-blue/10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.6fr)]">
          <div
            className={`relative isolate flex flex-col justify-between gap-8 overflow-hidden bg-blue px-7 py-9 text-white transition-all duration-700 ease-out sm:px-9 ${
              visible ? "translate-x-0 opacity-100" : "-translate-x-8 opacity-0"
            }`}
            style={{ transitionDelay: "320ms" }}
          >
            <span aria-hidden="true" className={styles.sunHalo} />
            <span aria-hidden="true" className={styles.sunRays} />
            <div>
              <div className="mb-6 flex items-center gap-3 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-yellow">
                <span className="h-px w-5 bg-yellow" />
                Hồ sơ doanh nghiệp
              </div>
              <div className="relative mb-6 h-20 w-48 rounded-xl bg-white/95 p-2 shadow-lg shadow-black/20 sm:h-24 sm:w-56">
                <Image
                  src="/images/Sunshine_brand.png"
                  alt="Sunshine Center"
                  fill
                  sizes="224px"
                  className="object-contain p-2"
                />
              </div>
              <h3 className="font-display text-xl font-bold leading-snug text-white sm:text-2xl">
                Công ty TNHH Mặt Trời Tỏa Sáng The Sunshine
              </h3>
              <p className="mt-2 font-mono text-[11px] font-bold uppercase tracking-[0.15em] text-yellow">
                Giá trị tạo nên thương hiệu
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-400/10 px-3 py-1.5 text-xs font-semibold text-emerald-200">
                <span className={styles.liveDot} aria-hidden="true" />
                {STATUS}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80">
                <CalendarCheck size={14} className="text-yellow" aria-hidden="true" />
                Từ {FOUNDED}
              </span>
            </div>
          </div>

          <dl className="grid gap-px bg-blue/10 sm:grid-cols-2">
            {COMPANY_INFO.map((item, index) => (
              <div
                key={item.label}
                className={`group flex gap-4 bg-white px-6 py-5 transition-all duration-700 ease-out hover:bg-cream sm:px-7 ${
                  item.wide ? "sm:col-span-2" : ""
                } ${visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
                style={{ transitionDelay: `${420 + index * 60}ms` }}
              >
                <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue/5 text-blue transition-colors duration-500 group-hover:bg-yellow group-hover:text-blue">
                  <item.icon size={18} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <dt className="font-mono text-[11px] font-bold uppercase tracking-wider text-blue/50">
                    {item.label}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold leading-6 text-blue sm:text-[15px]">
                    {item.href ? (
                      <a href={item.href} className="underline-offset-4 hover:text-blue/80 hover:underline">
                        {item.value}
                      </a>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
