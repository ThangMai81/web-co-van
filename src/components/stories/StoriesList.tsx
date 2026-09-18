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
      <section className="bg-ink px-6 pb-20 pt-40 md:pt-48">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal direction="up">
            <div className="mb-5 flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-widest text-sun">
              <span className="block h-px w-6 bg-sun" />
              Tiếng nói học viên
            </div>
            <h1 className="font-display text-3xl font-bold leading-tight text-cream md:text-5xl">
              Những câu chuyện chuyển hoá từ cộng đồng Sunshine
            </h1>
            <p className="mt-6 text-lg text-cream/70">
              Mỗi lời chia sẻ là một minh chứng cho hành trình chữa lành, tìm
              lại chính mình và kiến tạo cuộc đời ý nghĩa.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink px-6 pb-24">
        <div className="mx-auto max-w-[var(--page-w)]">
          {testimonials.length === 0 ? (
            <p className="text-center text-cream/50">
              Chưa có câu chuyện nào được đăng tải.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t, i) => (
                <Reveal key={t._id} direction="up" delay={(i % 3) * 100}>
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
