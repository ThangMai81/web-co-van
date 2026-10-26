import { CoachDirectory } from "@/components/coaching/CoachDirectory";
import { Reveal } from "@/components/animation/Reveal";
import { HomeHeroBackdrop } from "@/components/home-page/HomeHeroBackdrop";
import { getCoaches } from "@/data/coaches";

export async function About() {
  const coaches = await getCoaches();

  return (
    <section id="companions" className="relative isolate scroll-mt-24 overflow-hidden bg-blue px-6 py-24 text-white">
      <HomeHeroBackdrop
        variant="coaching"
        videoSource="/videos/home-fansipan-loop.mp4"
        posterSource="/images/home-fansipan-poster.jpg"
      />
      <div className="relative z-10 mx-auto max-w-[var(--page-w)]">
        <Reveal preset="soft" className="mb-12 max-w-3xl">
          <>
            <div className="mb-4 font-mono text-sm uppercase tracking-widest text-yellow">Đội ngũ đồng hành</div>
            <h2 className="font-display text-4xl font-bold text-white md:text-6xl">Chọn người đồng hành <span className="text-yellow">của bạn</span></h2>
            <p className="mt-5 max-w-2xl leading-7 text-white/75">Mỗi người có một thế mạnh và cách lắng nghe riêng. Chọn lĩnh vực bạn quan tâm, xem hồ sơ từng người và gửi yêu cầu cho đúng coach bạn muốn gặp.</p>
          </>
        </Reveal>
        <CoachDirectory coaches={coaches} />
        <p className="mt-8 text-xs leading-5 text-white/55">Các hồ sơ gắn nhãn “Hồ sơ demo” là danh tính minh hoạ, chưa đại diện cho nhân sự thật của Sunshine Center.</p>
      </div>
    </section>
  );
}
