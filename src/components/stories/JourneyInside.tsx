import Image from "next/image";
import { Reveal } from "@/components/animation/Reveal";

export function JourneyInside() {
  return (
    <section className="bg-paper px-6 py-24">
      <div className="mx-auto grid max-w-[var(--page-w)] items-center gap-12 lg:grid-cols-2">
        <Reveal direction="left">
          <div>
            <p className="mb-4 text-ink/70">
              Nơi giúp bạn tìm thấy mình, hiểu được nội hàm bên trong mình, nơi
              giúp bạn từng bước đi qua bóng tối bên trong để chạm vào vùng sáng
              vốn có sẵn bên trong bạn.
            </p>
            <p className="mb-4 text-lg font-semibold text-ink">
              Giúp bạn tìm thấy phiên bản xuất sắc nhất bên trong mình, bạn trở
              về với phiên bản vốn là của bạn, bạn sống cuộc đời rực rỡ nhất của
              chính bạn.
            </p>
            <p className="text-ink/70">
              Là nơi giúp bạn trở thành ngọn hải đăng, trở thành hình mẫu, thành
              tấm gương, thành người truyền cảm hứng, người đi lan toả ánh sáng
              cho đời.
            </p>
          </div>
        </Reveal>

        <Reveal direction="right">
          <div className="relative aspect-[4/3] overflow-hidden rounded-md">
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
