const FOOT_LINKS = [
  { href: "#trail", label: "Hành trình" },
  { href: "#videos", label: "Video" },
  { href: "#about", label: "Về tôi" },
];

const SOCIAL_LINKS = [
  { href: "#", label: "YouTube" },
  { href: "#", label: "Facebook" },
  { href: "#", label: "Email" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-paper/15 py-16">
      <div className="mx-auto max-w-[var(--page-w)] px-6">
        <div className="flex flex-col justify-between gap-10 pb-11 md:flex-row">
          <div className="max-w-xs">
            <div className="mb-3 font-display text-lg font-bold">
              Đăng & Núi
            </div>
            <p className="text-sm text-paper/60">
              Ghi lại hành trình giữa những đỉnh núi và những lớp học vùng cao,
              từ 2014 đến nay.
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <h4 className="mb-3 font-mono text-xs uppercase tracking-wider text-moss">
                Khám phá
              </h4>
              {FOOT_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="mb-2 block text-sm text-paper/75 hover:text-ochre"
                >
                  {l.label}
                </a>
              ))}
            </div>
            <div>
              <h4 className="mb-3 font-mono text-xs uppercase tracking-wider text-moss">
                Kết nối
              </h4>
              {SOCIAL_LINKS.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="mb-2 block text-sm text-paper/75 hover:text-ochre"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-between gap-2 border-t border-paper/15 pt-6 text-xs text-paper/40">
          <span>© 2026 Trần Minh Đăng</span>
          <span>Thiết kế minh hoạ — thay nội dung thật khi triển khai</span>
        </div>
      </div>
    </footer>
  );
}
