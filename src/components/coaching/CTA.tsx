import { Reveal } from "@/components/animation/Reveal";
import { HomeHeroBackdrop } from "@/components/home-page/HomeHeroBackdrop";

export function CTA() {
  return (
    <section id="booking" className="relative isolate overflow-hidden bg-blue px-6 py-24 text-center text-white">
      <HomeHeroBackdrop
        variant="coaching"
        videoSource="/videos/home-forest-loop.mp4"
        posterSource="/images/home-forest-poster.jpg"
        controlPlacement="section-bottom"
      />
      <div className="relative z-10">
        <Reveal preset="soft">
          <>
            <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold md:text-4xl">
              Tìm người đồng hành phù hợp với bạn
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-white/75">
              Xem hồ sơ và thông tin phiên riêng của từng người đồng hành trước khi gửi yêu cầu.
            </p>
          </>
        </Reveal>
        <a
          href="#companions"
          className="mt-8 inline-block rounded-full bg-yellow px-8 py-4 font-mono text-xs uppercase tracking-wider text-blue transition-transform hover:-translate-y-1 hover:brightness-90 motion-safe:focus-visible:-translate-y-1 motion-safe:focus-visible:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
        >
          Chọn người đồng hành
        </a>
      </div>
    </section>
  );
}
