import Link from "next/link";
import { Reveal } from "@/components/animation/Reveal";
import { TestimonialCard } from "./TestimonialCard";

type Testimonial = {
  _id: string;
  name: string;
  role?: string;
  quote?: string;
  story?: string;
};

async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/testimonials`,
      { cache: "no-store" },
    );
    if (!res.ok) return [];
    const json = await res.json();
    return json.success ? json.data : [];
  } catch {
    return [];
  }
}

export async function StoriesList() {
  const testimonials = await getTestimonials();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-blue px-6 pb-20 pt-[88px] md:pt-[128px] lg:pt-[88px]">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-yellow/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-yellow/8 blur-2xl" />
        <div className="relative mx-auto max-w-3xl text-center">
          <Reveal direction="up">
            <div className="mb-5 flex items-center justify-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-yellow">
              <span className="block h-px w-6 bg-yellow" />
              Tiếng nói học viên
              <span className="block h-px w-6 bg-yellow" />
            </div>
            <h1 className="font-display text-3xl font-bold leading-tight text-white md:text-5xl">
              Những câu chuyện chuyển hoá từ cộng đồng Sunshine
            </h1>
            <p className="mt-6 text-lg font-medium leading-relaxed text-white/70">
              Mỗi lời chia sẻ là một minh chứng cho hành trình chữa lành, tìm
              lại chính mình và kiến tạo cuộc đời ý nghĩa hơn.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/#lien-he"
                className="rounded-full bg-yellow px-7 py-3.5 text-sm font-bold text-blue shadow-lg shadow-yellow/20 transition hover:-translate-y-0.5 hover:brightness-95"
              >
                Bắt đầu hành trình của bạn
              </Link>
              <Link
                href="/programs"
                className="rounded-full border border-white/40 px-7 py-3.5 text-sm font-bold text-white transition hover:border-yellow hover:text-yellow"
              >
                Xem các chương trình
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Danh sách */}
      <section className="bg-blue px-6 pb-24 pt-2">
        <div className="mx-auto max-w-[var(--page-w)]">
          {testimonials.length === 0 ? (
            <Reveal direction="up">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-8 py-16 text-center">
                <p className="text-lg font-medium text-white/50">
                  Chưa có câu chuyện nào được đăng tải.
                </p>
                <p className="mt-2 text-sm text-white/30">
                  Hãy quay lại sau nhé.
                </p>
              </div>
            </Reveal>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t, i) => (
                <Reveal key={t._id} direction="up" delay={(i % 3) * 80}>
                  <TestimonialCard testimonial={t} index={i} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
