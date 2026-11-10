"use client";

import type { ProgramRegistration as Registration } from "@/types/program";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const REGISTRATION_STEPS = [
  { step: "01", label: "Liên hệ", desc: "Gọi hoặc nhắn tin cho Sunshine Center qua số hotline bên dưới." },
  { step: "02", label: "Tư vấn", desc: "Đội ngũ sẽ tư vấn chi tiết về chương trình, lịch trình và những điều cần chuẩn bị." },
  { step: "03", label: "Xác nhận", desc: "Xác nhận tham gia và hoàn tất thủ tục đăng ký theo hướng dẫn." },
];

export default function ProgramRegistration({
  registration,
  image,
  title,
  hideRepeatedImage = false,
}: {
  registration: Registration;
  image: string;
  title: string;
  hideRepeatedImage?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let prefersReduced = false;
    try { prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch { /* noop */ }
    if (prefersReduced || typeof IntersectionObserver === "undefined") { setVisible(true); return; }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const seatsLeft =
    registration.seatsTotal != null
      ? registration.seatsTotal - (registration.seatsTaken || 0)
      : null;

  return (
    <div
      ref={ref}
      className={`mt-8 overflow-hidden rounded-2xl border-2 border-yellow bg-blue text-white shadow-xl shadow-blue/15 transition-all duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {!hideRepeatedImage && (
        <div className="relative aspect-[3/1] w-full bg-blue/5">
          <Image
            src={image}
            alt={title}
            fill
            sizes="(min-width: 896px) 848px, calc(100vw - 3rem)"
            className="object-contain object-center"
          />
        </div>
      )}
      <div className="p-6 sm:p-8">
        <h2 className="mb-1 text-2xl font-bold">Đăng ký tham gia</h2>
        <p className="mb-5 text-sm font-medium text-white/60">
          Quy trình đơn giản, chúng tôi sẽ hỗ trợ bạn từng bước.
        </p>

        {/* Quy trình 3 bước */}
        <ol className="mb-6 grid gap-4 sm:grid-cols-3">
          {REGISTRATION_STEPS.map((s, i) => (
            <li
              key={s.step}
              className={`rounded-xl border border-white/15 bg-white/5 p-4 transition-all duration-500 ease-out ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${150 + i * 100}ms` }}
            >
              <div className="mb-2 font-mono text-xs font-bold text-yellow">{s.step}</div>
              <div className="mb-1 font-bold text-white">{s.label}</div>
              <p className="text-xs leading-relaxed text-white/65">{s.desc}</p>
            </li>
          ))}
        </ol>

        <div className="flex flex-wrap items-center gap-4 border-t border-white/15 pt-5">
          {seatsLeft !== null && (
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-bold">
              Còn {seatsLeft}/{registration.seatsTotal} chỗ
            </span>
          )}
          {registration.deadline && (
            <span className="text-sm font-medium text-white/70">
              Hạn đăng ký:{" "}
              {new Date(registration.deadline).toLocaleDateString("vi-VN")}
            </span>
          )}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {registration.contactPhone ? (
            <a
              href={`tel:${registration.contactPhone}`}
              className="inline-flex min-h-11 items-center rounded-full bg-yellow px-8 py-3 font-bold text-blue transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue"
            >
              Gọi để đăng ký
            </a>
          ) : (
            <p className="text-sm font-medium text-white/70">
              Vui lòng liên hệ Sunshine Center để nhận hướng dẫn đăng ký.
            </p>
          )}
          {registration.contactPhone && (
            <span className="text-sm font-medium text-white/60">
              Hotline: <span className="font-bold text-white">{registration.contactPhone}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
