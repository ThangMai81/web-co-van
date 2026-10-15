import { CoachDirectory } from "@/components/coaching/CoachDirectory";
import { getCoaches } from "@/data/coaches";

export async function About() {
  const coaches = await getCoaches();

  return (
    <section id="companions" className="relative overflow-hidden bg-blue px-6 py-24 text-white before:absolute before:-top-12 before:left-0 before:h-20 before:w-full before:rounded-[50%] before:bg-white">
      <div className="relative mx-auto max-w-[var(--page-w)]">
        <div className="mb-12 max-w-3xl">
          <div className="mb-4 font-mono text-xs uppercase tracking-widest text-yellow">Đội ngũ đồng hành</div>
          <h2 className="font-display text-4xl font-bold text-white md:text-6xl">Chọn người đồng hành <span className="text-yellow">của bạn</span></h2>
          <p className="mt-5 max-w-2xl leading-7 text-white/75">Mỗi người có một thế mạnh và cách lắng nghe riêng. Chọn lĩnh vực bạn quan tâm, xem hồ sơ từng người và gửi yêu cầu cho đúng coach bạn muốn gặp.</p>
        </div>
        <CoachDirectory coaches={coaches} />
        <p className="mt-8 text-xs leading-5 text-white/55">Các hồ sơ gắn nhãn “Hồ sơ demo” là danh tính minh hoạ, chưa đại diện cho nhân sự thật của Sunshine Center.</p>
      </div>
    </section>
  );
}
