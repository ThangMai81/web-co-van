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
    <div className="mt-6 border-t border-blue/10 pt-6">
      <a
        href={`tel:${tel}`}
        className="group flex min-h-12 w-full items-center justify-center gap-2.5 rounded-full bg-yellow px-6 py-3 font-bold text-blue shadow-lg shadow-yellow/25 transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-white"
      >
        <Phone size={18} aria-hidden="true" className="transition-transform duration-300 group-hover:-rotate-12" />
        Gọi đăng ký: {phone}
      </a>
      <Link
        href="/#lien-he"
        className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-full border-2 border-blue/15 px-6 py-2.5 text-sm font-bold text-blue transition-colors hover:border-yellow hover:bg-yellow/10"
      >
        <Send size={15} aria-hidden="true" />
        Để lại thông tin, chúng tôi gọi lại
      </Link>
      {contactName?.trim() && (
        <p className="mt-3 text-center text-xs font-medium text-blue/55">
          Người tư vấn: {contactName}
        </p>
      )}
    </div>
  );
}
