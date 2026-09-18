import Link from "next/link";
import { Reveal } from "@/components/animation/Reveal";

type Testimonial = {
  _id: string;
  name: string;
  role?: string;
  quote?: string;
};

const AVATAR_COLORS = [
  "bg-sun text-ink",
  "bg-flame text-cream",
  "bg-teal-deep text-cream",
  "bg-crimson text-cream",
  "bg-plum text-cream",
];

async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/testimonials/featured`,
      { cache: "no-store" },
    );

    if (!res.ok) return [];

    const json = await res.json();
    return json.success ? json.data : [];
  } catch {
    return [];
  }
}

export async function TestimonialsCollage() {
  const testimonials = await getFeaturedTestimonials();

  if (testimonials.length === 0) return null;

  return (
    <section className="bg-ink px-6 py-24">
      <div className="mx-auto max-w-[var(--page-w)]">
        <Reveal direction="up">
          <div className="mb-14 text-center">
            <div className="mb-3 flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-widest text-sun">
              <span className="block h-px w-6 bg-sun" />
              Tiếng nói học viên
            </div>
            <h2 className="font-display text-3xl font-bold text-cream md:text-4xl">
              Những gì học viên nói về Sunshine
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t._id} direction="up" delay={(i % 3) * 100}>
              <Link
                href="/stories"
                className="block h-full rounded-md border border-cream/15 bg-cream/[0.08] p-7 transition-colors hover:border-sun/50 hover:bg-cream/[0.12]"
              >
                <span className="mb-4 block font-display text-5xl leading-none text-sun">
                  "
                </span>
                <p className="mb-6 text-sm leading-relaxed text-cream">
                  {t.quote}
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full font-mono text-sm font-bold ${
                      AVATAR_COLORS[i % AVATAR_COLORS.length]
                    }`}
                  >
                    {t.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-cream">
                      {t.name}
                    </div>
                    {t.role && (
                      <div className="font-mono text-xs uppercase tracking-wider text-sun/70">
                        {t.role}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        <Reveal direction="up" delay={300}>
          <div className="mt-14 text-center">
            <Link
              href="/stories"
              className="inline-block rounded-full border border-cream/30 px-8 py-3.5 font-mono text-xs uppercase tracking-wider text-cream transition-colors hover:border-cream hover:bg-cream/10"
            >
              Xem tất cả câu chuyện
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
