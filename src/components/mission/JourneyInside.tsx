import Image from "next/image";
import { Reveal } from "@/components/animation/Reveal";

export function JourneyInside() {
  return (
    <section className="bg-blue/5 px-6 py-24">
      <div className="mx-auto grid max-w-[var(--page-w)] items-center gap-12 lg:grid-cols-2">
        <Reveal direction="left">
          <div>
            <div className="mb-4 flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-yellow">
              <span className="block h-px w-6 bg-yellow" />
              Hành trình bên trong
            </div>
            <p className="mb-4 font-medium text-blue/70">
              Nơi giúp bạn tìm thấy mình, hiểu được nội hàm bên trong mình, nơi
              giúp bạn từng bước đi qua bóng tối bên trong để chạm vào vùng sáng
              vốn có sẵn bên trong bạn.
            </p>
            <p className="mb-4 text-xl font-bold text-blue">
              Giúp bạn tìm thấy phiên bản xuất sắc nhất bên trong mình, bạn trở
              về với phiên bản vốn là của bạn, bạn sống cuộc đời rực rỡ nhất của
              chính bạn.
            </p>
            <p className="font-medium text-blue/70">
              Là nơi giúp bạn trở thành ngọn hải đăng, trở thành hình mẫu, thành
              tấm gương, thành người truyền cảm hứng, người đi lan toả ánh sáng
              cho đời.
            </p>
          </div>
        </Reveal>

        <Reveal direction="right">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border-2 border-blue/20 shadow-lg shadow-blue/10">
            <Image
              src="/images/first_banner.jpg"
              alt="Hành trình bên trong"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
