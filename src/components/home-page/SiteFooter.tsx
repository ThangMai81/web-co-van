const FOOT_LINKS = [
  { href: "/programs", label: "Chương trình" },
  { href: "/courses", label: "Khóa học" },
  { href: "/mission", label: "Sứ mệnh" },
  { href: "/coaching", label: "Coaching 1:1" },
];

const SOCIAL_LINKS = [
  { href: process.env.NEXT_PUBLIC_YOUTUBE_URL, label: "YouTube" },
  { href: process.env.NEXT_PUBLIC_ZALO_URL, label: "Zalo" },
  { href: process.env.NEXT_PUBLIC_FACEBOOK_URL, label: "Facebook" },
  {
    href: process.env.NEXT_PUBLIC_CONTACT_EMAIL
      ? `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`
      : undefined,
    label: "Email",
  },
].filter((link): link is { href: string; label: string } => Boolean(link.href));

export function SiteFooter() {
  return (
    <footer className="border-t border-paper/15 py-16">
      <div className="mx-auto max-w-[var(--page-w)] px-6">
        <div className="flex flex-col justify-between gap-10 pb-11 md:flex-row">
          <div className="max-w-xs">
            <div className="mb-3 font-display text-lg font-bold">
              Sunshine Center
            </div>
            <p className="text-sm text-ink/60">
              Đánh thức con người phi thường bên trong bạn, giúp bạn tìm thấy
              chính mình, sống cuộc đời rực rỡ nhất!
            </p>
            <div className="mt-5 space-y-2 text-sm text-ink/70">
              {process.env.NEXT_PUBLIC_CONTACT_PHONE && (
                <a
                  className="block hover:text-sun"
                  href={`tel:${process.env.NEXT_PUBLIC_CONTACT_PHONE}`}
                >
                  Điện thoại: {process.env.NEXT_PUBLIC_CONTACT_PHONE}
                </a>
              )}
              {process.env.NEXT_PUBLIC_CONTACT_EMAIL && (
                <a
                  className="block hover:text-sun"
                  href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL}`}
                >
                  Email: {process.env.NEXT_PUBLIC_CONTACT_EMAIL}
                </a>
              )}
              {!process.env.NEXT_PUBLIC_CONTACT_PHONE && !process.env.NEXT_PUBLIC_CONTACT_EMAIL && (
                <span>Thông tin liên hệ sẽ được cập nhật.</span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-12 md:gap-16">
            <div>
              <h4 className="mb-3 font-mono text-xs uppercase tracking-wider text-sage">
                Khám phá
              </h4>
              {FOOT_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="mb-2 block text-sm text-ink/75 hover:text-sun"
                >
                  {l.label}
                </a>
              ))}
            </div>
            <div>
              <h4 className="mb-3 font-mono text-xs uppercase tracking-wider text-sage">
                Kết nối
              </h4>
              {SOCIAL_LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel={l.href.startsWith("http") ? "noreferrer" : undefined}
                  className="mb-2 block text-sm text-ink/75 hover:text-sun"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-2 border-t border-paper/15 pt-6 text-xs text-ink/40">
          <span>© 2026 Lê Thị Kim Yến</span>
          <span>
            Khai tâm mở lối - Tìm lại chính mình - Chạm đỉnh vinh quang - Sống
            đời xuất chúng
          </span>
        </div>
      </div>
    </footer>
  );
}
