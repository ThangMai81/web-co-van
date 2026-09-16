import { Reveal } from "@/components/animation/Reveal";

export function VideoDemo() {
  return (
    <section className="bg-cream px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal direction="up">
          <h2 className="mb-4 font-display text-3xl font-bold text-ink md:text-4xl">
            Coaching 1:1 thực sự diễn ra như thế nào?
          </h2>
          <p className="mb-10 text-ink/65">
            2 phút để hiểu cách một buổi coaching thật sự vận hành.
          </p>
        </Reveal>

        <Reveal direction="scale">
          {/* TODO: thay bằng video thật (video tag hoặc iframe YouTube) */}
          <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-md bg-ink">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sun">
              <div className="ml-1 h-0 w-0 border-y-[10px] border-l-[16px] border-y-transparent border-l-ink" />
            </div>
            <span className="absolute bottom-4 right-4 font-mono text-[10px] uppercase tracking-wider text-chalk/50">
              Video demo — thay bằng nội dung thật
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
