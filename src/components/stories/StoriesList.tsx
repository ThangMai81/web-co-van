import Link from "next/link";
import { Reveal } from "@/components/animation/Reveal";
import { TestimonialCard } from "./TestimonialCard";
import { StoriesHero } from "./StoriesHero";
import { StoriesJourney } from "./StoriesJourney";
import styles from "./Stories.module.css";
import { getCachedApiJson } from "@/lib/apiCache";

type Testimonial = {
  _id: string;
  name: string;
  role?: string;
  quote?: string;
  story?: string;
};

async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const json = (await getCachedApiJson("/api/testimonials")) as {
      success?: boolean;
      data?: Testimonial[];
    };
    return json.success && Array.isArray(json.data) ? json.data : [];
  } catch {
    return [];
  }
}

const COLUMN_DIRECTION = ["left", "up", "right"] as const;

export async function StoriesList() {
  const testimonials = await getTestimonials();

  return (
    <>
      <StoriesHero count={testimonials.length} />

      <StoriesJourney />

      {/* Danh sách */}
      <section
        id="cau-chuyen"
        aria-labelledby="stories-list-heading"
        className="scroll-mt-24 bg-blue px-6 pb-28 pt-20 md:pt-24"
      >
        <div className="mx-auto max-w-[var(--page-w)]">
          <Reveal direction="up">
            <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <div className="mb-4 flex items-center gap-3 font-mono text-sm font-bold uppercase tracking-[0.2em] text-yellow">
                  <span className="block h-px w-8 bg-yellow" />
                  Lời kể thật
                </div>
                <h2
                  id="stories-list-heading"
                  className="font-display text-3xl font-bold text-white md:text-5xl"
                >
                  Họ đã đi qua hành trình ấy
                </h2>
              </div>
              <p className="max-w-[38ch] text-white/65 md:text-right">
                Bấm “Đọc thêm” ở mỗi thẻ để nghe trọn câu chuyện của từng người.
              </p>
            </div>
          </Reveal>

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
            <div className="grid grid-cols-1 items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t, i) => (
                <Reveal
                  key={t._id}
                  direction={COLUMN_DIRECTION[i % 3]}
                  delay={(i % 3) * 160}
                  className={i % 3 === 1 ? "lg:mt-10" : ""}
                >
                  <TestimonialCard testimonial={t} index={i} />
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Kết */}
      <section className={`${styles.ctaBand} bg-yellow px-6 py-16 md:py-20`}>
        <div aria-hidden="true" className={styles.ctaShine} />
        <Reveal direction="scale">
          <div className="mx-auto flex max-w-[var(--page-w)] flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
            <div>
              <h2 className="font-display text-3xl font-bold text-blue md:text-4xl">
                Câu chuyện tiếp theo có thể là của bạn
              </h2>
              <p className="mt-3 max-w-xl text-blue/75">
                Để lại thông tin, đội ngũ Sunshine Center sẽ liên hệ và cùng bạn
                tìm chương trình phù hợp cho gia đình.
              </p>
            </div>
            <Link
              href="/#lien-he"
              className="shrink-0 rounded-full bg-blue px-8 py-4 font-mono text-xs font-bold uppercase tracking-wider text-yellow shadow-xl shadow-blue/25 transition hover:-translate-y-1 hover:brightness-110"
            >
              Kết nối với Sunshine
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
