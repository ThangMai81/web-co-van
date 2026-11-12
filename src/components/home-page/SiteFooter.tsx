import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/lib/icons";
import { Mail, MapPin, Phone } from "lucide-react";

const FOOT_LINKS = [
  { href: "/programs", label: "Chương trình" },
  { href: "/courses", label: "Khóa học" },
  { href: "/coaching", label: "Coaching 1:1" },
  { href: "/mission", label: "Sứ mệnh" },
  { href: "/stories", label: "Câu chuyện học viên" },
];

const SOCIAL_LINKS = [
  { href: process.env.NEXT_PUBLIC_YOUTUBE_URL, label: "YouTube" },
  { href: process.env.NEXT_PUBLIC_ZALO_URL, label: "Zalo" },
  { href: process.env.NEXT_PUBLIC_FACEBOOK_URL, label: "Facebook" },
].filter((link): link is { href: string; label: string } => Boolean(link.href));

const PHONE = process.env.NEXT_PUBLIC_CONTACT_PHONE || "0935 626 186";
const EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL;
const ADDRESS =
  "Số 21 đường số 04, KĐT quốc tế Đa Phước, Phường Hải Châu, TP Đà Nẵng";

export function SiteFooter() {
  return (
    <footer className="relative isolate overflow-hidden border-t-4 border-yellow bg-blue text-white">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[28rem] w-[28rem] rounded-full bg-yellow/10 blur-3xl" />

      {/* Dải kêu gọi */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-[var(--page-w)] flex-col gap-6 px-6 py-12 md:flex-row md:items-center md:justify-between md:py-14">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-yellow">
              Khai tâm mở lối
            </p>
            <h2 className="mt-3 max-w-[24ch] font-display text-3xl font-bold leading-tight md:text-4xl">
              Sẵn sàng bắt đầu hành trình của riêng bạn?
            </h2>
          </div>
          <Link
            href="/#lien-he"
            className="group inline-flex w-fit items-center gap-3 rounded-full bg-yellow px-7 py-4 font-bold text-blue shadow-xl shadow-yellow/10 transition hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            Gửi lời quan tâm
            <ArrowRight size={18} aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="mx-auto grid max-w-[var(--page-w)] gap-10 px-6 py-12 md:grid-cols-[1.4fr_1fr_1fr] md:gap-16 md:py-14">
        <div>
          <div className="relative h-14 w-44 rounded-xl bg-white/95 p-2">
            <Image
              src="/images/Sunshine_brand.png"
              alt="Sunshine Center"
              fill
              sizes="176px"
              className="object-contain p-2"
            />
          </div>
          <p className="mt-5 max-w-[38ch] text-sm leading-relaxed text-white/65">
            Đánh thức con người phi thường bên trong bạn, giúp bạn tìm thấy
            chính mình, sống cuộc đời rực rỡ nhất.
          </p>
          <ul className="mt-6 space-y-3 text-sm text-white/80">
            <li>
              <a href={`tel:${PHONE.replace(/\s/g, "")}`} className="group inline-flex items-center gap-3 hover:text-yellow">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-yellow transition-colors group-hover:bg-yellow group-hover:text-blue">
                  <Phone size={15} aria-hidden="true" />
                </span>
                {PHONE}
              </a>
            </li>
            {EMAIL && (
              <li>
                <a href={`mailto:${EMAIL}`} className="group inline-flex items-center gap-3 hover:text-yellow">
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-yellow transition-colors group-hover:bg-yellow group-hover:text-blue">
                    <Mail size={15} aria-hidden="true" />
                  </span>
                  {EMAIL}
                </a>
              </li>
            )}
            <li className="flex items-start gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/10 text-yellow">
                <MapPin size={15} aria-hidden="true" />
              </span>
              <span className="pt-1.5 leading-relaxed">{ADDRESS}</span>
            </li>
          </ul>
        </div>

        <nav aria-label="Khám phá">
          <h3 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-yellow">
            Khám phá
          </h3>
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 md:grid-cols-1">
            {FOOT_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="group inline-flex items-center gap-2 text-sm text-white/75 transition-colors hover:text-white"
                >
                  <span aria-hidden="true" className="h-px w-0 bg-yellow transition-all duration-300 group-hover:w-4" />
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h3 className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-yellow">
            Kết nối
          </h3>
          {SOCIAL_LINKS.length > 0 ? (
            <ul className="mt-5 flex flex-wrap gap-3">
              {SOCIAL_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/85 transition-colors hover:border-yellow hover:bg-yellow hover:text-blue"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 text-sm text-white/55">
              Theo dõi Sunshine Center để nhận thông tin chương trình mới nhất.
            </p>
          )}
          <p className="mt-8 text-sm leading-relaxed text-white/55">
            Công ty TNHH Mặt Trời Tỏa Sáng The Sunshine
            <br />
            MST: 0402276590
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[var(--page-w)] flex-wrap justify-between gap-3 py-6 pl-6 pr-20 text-xs lg:px-6 text-white/45">
          <span>© 2026 Sunshine Center · Lê Thị Kim Yến</span>
          <span className="italic">
            Khai tâm mở lối · Tìm lại chính mình · Chạm đỉnh vinh quang · Sống đời xuất chúng
          </span>
        </div>
      </div>
    </footer>
  );
}
