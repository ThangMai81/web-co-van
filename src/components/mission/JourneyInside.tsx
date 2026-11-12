import Image from "next/image";
import { Reveal } from "@/components/animation/Reveal";
import { MissionLiquidHeading } from "./MissionLiquidHeading";
import { JourneyImageZoom } from "./JourneyImageZoom";

export function JourneyInside() {
  return (
    <section id="inside-journey" className="scroll-mt-24 bg-blue/5 py-16 md:py-20">
      <div className="mx-auto max-w-[var(--page-w)] px-6">
        <div className="mx-auto max-w-3xl text-center">
          <MissionLiquidHeading />
          <Reveal direction="left">
            <p className="mb-4 font-medium text-blue/70">
              Nơi giúp bạn tìm thấy mình, hiểu được nội hàm bên trong mình, nơi
              giúp bạn từng bước đi qua bóng tối để chạm vào vùng sáng
              vốn có sẵn bên trong bạn.
            </p>
            <p className="font-medium text-blue/70">
              Là nơi giúp bạn trở thành ngọn hải đăng, trở thành hình mẫu, thành
              tấm gương, thành người truyền cảm hứng, người đi lan toả ánh sáng
              cho đời.
            </p>
          </Reveal>
        </div>
      </div>
      <JourneyImageZoom className="relative mt-12 aspect-[2/1] w-full overflow-hidden bg-blue/5 md:mt-16 md:aspect-[21/8]">
        <Image
          src="/images/first_banner.jpg"
          alt="Hành trình bên trong"
          fill
          sizes="100vw"
          className="object-cover"
        />
      </JourneyImageZoom>
    </section>
  );
}
