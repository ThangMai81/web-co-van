import Link from "next/link";
import { Reveal } from "@/components/animation/Reveal";
import { Quote } from "@/lib/icons";
import { getCachedApiJson } from "@/lib/apiCache";

type Testimonial = {
  _id: string;
  name: string;
  role?: string;
  quote?: string;
};

async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  try {
    const json = (await getCachedApiJson("/api/testimonials/featured")) as {
      success?: boolean;
      data?: Testimonial[];
    };
    return json.success && Array.isArray(json.data) ? json.data : [];
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
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-blue/10 bg-white p-8 shadow-lg shadow-blue/5 transition-all duration-500 hover:-translate-y-1.5 hover:border-yellow/70 hover:shadow-2xl hover:shadow-blue/15"
              >
                <span aria-hidden="true" className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-yellow to-yellow/0 transition-transform duration-700 group-hover:scale-x-100" />
                <span className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-blue text-yellow transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                  <Quote size={22} aria-hidden="true" />
                </span>
                <p className="mb-6 flex-1 text-base font-medium leading-relaxed text-blue/85">
                  {t.quote}
                </p>
                <div className="flex items-center gap-3 border-t border-blue/10 pt-5">
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
