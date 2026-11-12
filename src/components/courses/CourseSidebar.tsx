import Link from "next/link";
import { Phone, Send } from "lucide-react";
import type { CourseDetail } from "@/types/course";

const DEFAULT_PHONE = "0935 626 186";

export default function CourseSidebar({
  detail,
  contactPhone,
  contactName,
}: {
  detail: CourseDetail | null;
  contactPhone?: string;
  contactName?: string;
}) {
  if (!detail) return null;

  const raw = contactPhone?.trim() || DEFAULT_PHONE;
  const tel = raw.replace(/[^\d+]/g, "");
  // 0935626186 -> 0935 626 186 cho dễ đọc
  const phone = /^0\d{9}$/.test(tel)
    ? `${tel.slice(0, 4)} ${tel.slice(4, 7)} ${tel.slice(7)}`
    : raw;

  return (
    <div className="mt-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <a
          href={`tel:${tel}`}
          className="group inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full bg-yellow px-7 py-3 font-bold text-blue shadow-lg shadow-yellow/20 transition hover:-translate-y-0.5 hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue motion-reduce:transform-none"
        >
          <Phone size={18} aria-hidden="true" className="transition-transform duration-300 group-hover:-rotate-12" />
          Gọi đăng ký: {phone}
        </a>
        <Link
          href="/#lien-he"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-bold text-white transition-colors hover:border-yellow hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow"
        >
          <Send size={15} aria-hidden="true" />
          Để lại thông tin, chúng tôi gọi lại
        </Link>
      </div>
      {contactName?.trim() && (
        <p className="mt-3 text-xs font-medium text-white/55">
          Người tư vấn: {contactName}
        </p>
      )}
    </div>
  );
}
