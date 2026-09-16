import { notFound } from "next/navigation";

type CourseDetail = {
  title: string;
  description?: string;
  schedule?: string;
  format?: string;
  targetAudience?: string;
  slogan?: string;
  highlights?: string[];
  contact?: { name?: string; phone?: string; fanpage?: string };
};

async function getCourse(slug: string): Promise<CourseDetail | null> {
  const res = await fetch(`${process.env.API_URL}/api/courses/${slug}`, {
    cache: "no-store",
  });
  if (res.status === 404) return null;
  const json = await res.json();
  return json.data ?? null;
}

export async function CourseDetailPage({ slug }: { slug: string }) {
  const course = await getCourse(slug);
  if (!course) notFound();

  return (
    <section className="min-h-svh bg-cream py-28">
      <div className="mx-auto max-w-[var(--page-w)] px-6">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <div className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-sun">
              <span className="block h-px w-6 bg-sun" />
              {course.format ?? "Chương trình"}
            </div>
            <h1 className="font-display text-4xl font-bold text-ink sm:text-5xl">
              {course.title}
            </h1>
            {course.slogan && (
              <p className="mt-4 font-body text-lg italic text-ink/70">
                {course.slogan}
              </p>
            )}
            {course.description && (
              <p className="mt-6 max-w-[64ch] text-ink/75">
                {course.description}
              </p>
            )}

            {course.highlights && course.highlights.length > 0 && (
              <ul className="mt-10 space-y-3">
                {course.highlights.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-ink/80">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-sun" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="h-fit rounded-md bg-gradient-to-br from-rust to-navy-light p-7 lg:sticky lg:top-28">
            <div className="space-y-3 font-mono text-xs text-white/70">
              {course.schedule && <p>🗓️ {course.schedule}</p>}
              {course.targetAudience && <p>👥 {course.targetAudience}</p>}
            </div>
            <div className="my-5 h-px bg-white/15" />
            <div className="font-display text-lg font-bold text-white">
              Liên hệ đăng ký
            </div>
            {course.contact?.name && (
              <p className="mt-2 text-sm text-white/85">
                {course.contact.name}
              </p>
            )}
            {course.contact?.phone && (
              <a
                href={`tel:${course.contact.phone}`}
                className="mt-4 block rounded-sm bg-sun py-3 text-center font-mono text-xs uppercase tracking-wider text-ink hover:brightness-90"
              >
                Gọi {course.contact.phone}
              </a>
            )}
            {course.contact?.fanpage && (
              <a
                href={course.contact.fanpage}
                target="_blank"
                className="mt-3 block rounded-sm border border-white/25 py-3 text-center font-mono text-xs uppercase tracking-wider text-white hover:border-white"
              >
                Fanpage
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
