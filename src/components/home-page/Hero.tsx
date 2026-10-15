import Image from "next/image";
import { Reveal } from "../animation/Reveal";
import { Play } from "@/lib/icons";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-blue pb-24 pt-32">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-yellow/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -left-20 h-80 w-80 rounded-full bg-yellow/10 blur-3xl" />

      <div className="relative mx-auto w-full max-w-[var(--page-w)] px-6">
        <div className="relative mb-10 left-1/2 aspect-[16/8] w-screen max-w-none -translate-x-1/2 overflow-hidden border-y-2 border-yellow shadow-xl shadow-black/20 sm:aspect-[16/6] lg:aspect-[16/5]">
          <Image
            src="/images/Sunshine_banner.jpg"
            alt="Sunshine Center"
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="mb-5 flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-white">
          <span className="hidden h-px w-6 shrink-0 bg-yellow sm:block" />

          {/* Điện thoại và máy tính bảng: bản rút gọn, luôn nằm trên 1 hàng */}
          <span className="min-w-0 truncate tracking-wide lg:hidden">
            Tỉnh thức · Trí tuệ · Yêu thương
          </span>

          {/* Màn hình rộng (từ 1024px): giữ nguyên câu đầy đủ */}
          <span className="hidden lg:inline">
            Coach Yến Lê - Chạm vào tỉnh thức - Khơi nguồn trí tuệ - Lan tỏa yêu
            thương
          </span>

          <span className="hidden h-px w-6 shrink-0 bg-yellow sm:block" />
        </div>

        <Reveal direction="scale">
          <h1 className="max-w-[18ch] font-display text-[clamp(36px,5.6vw,78px)] font-bold leading-[1.03] text-white">
            <em className="text-yellow not-italic">SUNSHINE CENTER</em> "Đánh
            thức ánh sáng bên trong – Kiến tạo cuộc đời bạn mong muốn"
          </h1>
        </Reveal>

        <Reveal direction="left" delay={100}>
          <p className="mt-6 max-w-[52ch] text-lg italic text-white/80">
            Chúng tôi tin rằng mỗi người đều mang trong mình những tiềm năng và
            giá trị riêng biệt. Sunshine Center đồng hành cùng bạn trên hành
            trình thấu hiểu bản thân, khai mở nội lực, vượt qua giới hạn và từng
            bước kiến tạo một cuộc sống hạnh phúc, tự tin, thành công và ý nghĩa
            hơn. Yes Yes Yes
          </p>
        </Reveal>

        <Reveal direction="up" delay={200}>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#videos"
              className="flex items-center gap-2 rounded-full bg-yellow px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-blue transition hover:brightness-95"
            >
              <Play size={14} />
              Xem video
            </a>
            <a
              href="#lien-he"
              className="rounded-full border-2 border-white/40 px-7 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-white transition hover:border-white"
            >
              Đồng hành cùng chúng tôi
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
