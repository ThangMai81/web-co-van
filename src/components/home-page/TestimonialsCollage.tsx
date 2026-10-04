import Link from "next/link";
import { Reveal } from "@/components/animation/Reveal";
import { Quote } from "@/lib/icons";

type Testimonial = {
  _id: string;
  name: string;
  role?: string;
  quote?: string;
};

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
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-[var(--page-w)]">
        <Reveal direction="up">
          <div className="mb-14 text-center">
            <div className="mb-3 flex items-center justify-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-yellow">
              <span className="block h-px w-6 bg-yellow" />
              Tiếng nói học viên
              <span className="block h-px w-6 bg-yellow" />
            </div>
            <h2 className="font-display text-3xl font-bold text-blue md:text-4xl">
              Những gì học viên nói về Sunshine
            </h2>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t._id} direction="up" delay={(i % 3) * 100}>
              <Link
                href="/stories"
                className="block h-full rounded-xl border-2 border-blue/10 bg-blue/5 p-7 transition hover:border-yellow hover:shadow-md"
              >
                <Quote size={28} className="mb-4 text-yellow" />
                <p className="mb-6 text-sm font-medium leading-relaxed text-blue/90">
                  {t.quote}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow font-mono text-sm font-bold text-blue">
                    {t.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-blue">{t.name}</div>
                    {t.role && (
                      <div className="font-mono text-xs font-bold uppercase tracking-wider text-blue/50">
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
              className="inline-block rounded-full border-2 border-blue px-8 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-blue transition hover:bg-blue hover:text-white"
            >
              Xem tất cả câu chuyện
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
