import { ArrowRight, Lock, MessagesSquare, UserCheck } from "lucide-react";
import Link from "next/link";
import styles from "./CTA.module.css";
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
        <ul className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-3">
          {[
            { Icon: UserCheck, text: "Chọn đúng người bạn muốn gặp" },
            { Icon: MessagesSquare, text: "Trò chuyện riêng, 1 đối 1" },
            { Icon: Lock, text: "Thông tin được giữ kín" },
          ].map(({ Icon, text }, i) => (
            <li key={text}>
              <Reveal direction="up" delay={i * 120} className="flex">
              <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white/90 backdrop-blur transition-colors hover:border-yellow/60">
                <Icon className="h-4 w-4 text-yellow" aria-hidden="true" />
                {text}
              </div>
              </Reveal>
            </li>
          ))}
        </ul>
        <a
          href="#companions"
          className={`${styles.primary} mt-8 inline-flex items-center gap-2 rounded-full bg-yellow px-8 py-4 font-mono text-xs font-bold uppercase tracking-wider text-blue transition-transform hover:-translate-y-1 hover:brightness-90 motion-safe:focus-visible:-translate-y-1 motion-safe:focus-visible:brightness-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white`}
        >
          Chọn người đồng hành
          <ArrowRight className={`${styles.arrow} h-4 w-4`} aria-hidden="true" />
        </a>
        <p className="mt-5 text-sm text-white/70">
          Chưa chắc nên chọn ai?{" "}
          <Link href="/#lien-he" className="text-yellow underline underline-offset-4 hover:text-white">
            Gửi câu hỏi cho chúng tôi
          </Link>
        </p>
      </div>
    </section>
  );
}
