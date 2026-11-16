import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Mountain } from "lucide-react";
import { Reveal } from "@/components/animation/Reveal";
import { ChapterMark } from "./ChapterMark";
import { JourneyImageZoom } from "./JourneyImageZoom";

export function JourneyInside() {
  return (
    <section id="inside-journey" className="scroll-mt-24 bg-blue/5 py-16 md:py-20">
      <div className="mx-auto grid max-w-[var(--page-w)] gap-8 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
        <Reveal direction="left">
          <div>
            <ChapterMark number="02" label="Hành trình bên trong" />
            <p className="font-display text-2xl font-bold leading-snug text-blue md:text-3xl">
              Nơi giúp bạn tìm thấy mình, hiểu được nội hàm bên trong mình, nơi
              giúp bạn từng bước đi qua bóng tối để chạm vào vùng sáng
              vốn có sẵn bên trong bạn.
            </p>
          </div>
        </Reveal>
        <Reveal direction="right">
          <p className="border-l-4 border-yellow pl-5 text-lg font-medium leading-8 text-blue/75">
            Là nơi giúp bạn trở thành ngọn hải đăng, trở thành hình mẫu, thành
            tấm gương, thành người truyền cảm hứng, người đi lan toả ánh sáng
            cho đời.
          </p>
        </Reveal>
      </div>
      <JourneyImageZoom className="relative mt-12 aspect-[4/3] w-full overflow-hidden bg-blue sm:aspect-[2/1] md:mt-16 md:aspect-[21/8]">
        <Image
          src="/images/mission/hanh-trinh-kinabalu-doan-dinh-2x1.jpg"
          alt="Đoàn Sunshine Center trên đỉnh núi Kinabalu, phía trên biển mây"
          fill
          sizes="100vw"
          className="object-cover object-[60%_70%]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue/85 via-blue/35 to-transparent md:via-blue/25"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-blue/60 to-transparent"
        />
        <div className="absolute inset-0 flex items-end md:items-center">
          <div className="mx-auto w-full max-w-[var(--page-w)] px-6 pb-6 md:pb-0">
            <div className="max-w-md text-white md:max-w-lg">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-yellow px-3 py-1 font-mono text-xs font-bold uppercase tracking-[.16em] text-blue">
                <Mountain size={14} aria-hidden="true" />
                Kinabalu · 4.095 m
              </p>
              <h3 className="font-display text-2xl font-bold leading-tight drop-shadow md:text-4xl lg:text-5xl">
                Gặp gỡ chính mình
                <span className="block text-yellow">trên đỉnh biển mây</span>
              </h3>
              <p className="mt-3 hidden max-w-sm text-sm leading-6 text-white/85 sm:block md:text-base">
                Mỗi bước chân cùng nhau là một lần chạm vào vùng sáng bên trong.
              </p>
              <Link
                href="/programs/kinabalu-gap-go-chinh-minh"
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/60 px-4 py-2 text-sm font-bold text-white transition-colors hover:border-yellow hover:bg-yellow hover:text-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow md:mt-6"
              >
                Xem hành trình
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </JourneyImageZoom>
    </section>
  );
}
