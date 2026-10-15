import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { SiteHeader } from "@/components/navigation/SiteHeader";
import { SiteFooter } from "@/components/home-page/SiteFooter";
import { InquiryForm } from "@/components/home-page/InquiryForm";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CoachingJourney } from "@/components/coaching/CoachingJourney";
import { getCoach } from "@/data/coaches";

export default async function CoachProfilePage({
  params,
}: {
  params: Promise<{ coachSlug: string }>;
}) {
  const { coachSlug } = await params;
  const coach = await getCoach(coachSlug);
  if (!coach) notFound();

  return (
    <main className="min-h-screen bg-white">
      <SiteHeader />
      <section className="relative overflow-hidden bg-blue pb-24 pt-[88px] text-white">
        <div className="pointer-events-none absolute -right-28 -top-24 h-96 w-96 rounded-full bg-yellow/20 blur-3xl" />
        <div className="relative mx-auto max-w-[var(--page-w)] px-6">
          <Breadcrumb
            variant="light"
            items={[
              { label: "Trang chủ", href: "/" },
              { label: "Coaching 1:1", href: "/coaching" },
              { label: coach.name },
            ]}
          />
          <div className="mx-auto grid w-full max-w-[var(--page-w)] items-center gap-12 px-6 lg:grid-cols-[0.85fr_1.15fr]">
            {coach.image ? (
              <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[48%_48%_1.5rem_1.5rem] border-4 border-yellow/70 shadow-2xl shadow-black/20">
                <Image
                  src={coach.image}
                  alt={coach.isDemo ? `Ảnh minh hoạ hồ sơ demo của ${coach.name}` : coach.name}
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
            ) : (
              <div
                className="mx-auto flex aspect-[4/5] w-full max-w-md items-center justify-center overflow-hidden rounded-[48%_48%_1.5rem_1.5rem] border-4 border-yellow/70 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,.8),transparent_40%),linear-gradient(145deg,var(--coach-accent),#172d55)] shadow-2xl shadow-black/20"
                style={{ "--coach-accent": coach.accent } as CSSProperties}
              >
                <span className="font-display text-8xl font-bold text-white drop-shadow-lg">
                  {coach.initials}
                </span>
              </div>
            )}
            <div>
              <p className="mb-4 font-mono text-sm font-bold uppercase tracking-[0.2em] text-yellow">
                {coach.title}
              </p>
              <h1 className="font-display text-5xl font-bold leading-tight text-white md:text-7xl">
                {coach.name}
              </h1>
              <p className="mt-6 max-w-2xl text-xl leading-8 text-white/80">
                {coach.quote}
              </p>
              {coach.isDemo && (
                <div className="mt-7 inline-flex rounded-full border border-yellow/50 bg-white/5 px-4 py-2 text-xs font-semibold text-yellow">
                  Hồ sơ demo · danh tính minh hoạ
                </div>
              )}
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="#session-details"
                  className="rounded-full bg-yellow px-7 py-4 font-mono text-xs font-bold uppercase tracking-wider text-blue transition hover:-translate-y-1 hover:bg-white"
                >
                  Xem phí & lịch khai vấn
                </a>
                <Link
                  href="#story"
                  className="rounded-full border border-white/40 px-7 py-4 font-mono text-xs uppercase tracking-wider text-white transition hover:border-yellow hover:text-yellow"
                >
                  Đọc câu chuyện
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="story" className="bg-white px-6 py-20 md:py-28">
        <div className="mx-auto grid max-w-[var(--page-w)] gap-10 lg:grid-cols-[.75fr_1.25fr] lg:gap-16">
          <div>
            <p className="font-mono text-sm font-bold uppercase tracking-[.18em] text-yellow">Hành trình của người đồng hành</p>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-blue md:text-5xl">
              <span className="mr-1 inline-block align-[-.08em] font-serif text-7xl italic text-yellow md:text-8xl">C</span>
              âu chuyện của {coach.name.split(" ").slice(-1)[0]}
            </h2>
            {coach.detailsNeedConfirmation && (
              <p className="mt-5 inline-flex rounded-full border border-yellow/70 bg-yellow/15 px-4 py-2 text-xs font-semibold text-blue">
                Bản nháp minh hoạ · chờ coach xác nhận trước khi công bố
              </p>
            )}
            {coach.isDemo && (
              <p className="mt-5 inline-flex rounded-full border border-yellow/70 bg-yellow/15 px-4 py-2 text-xs font-semibold text-blue">
                Hồ sơ demo · thông tin và hình ảnh minh hoạ
              </p>
            )}
          </div>
          <div className="space-y-5 text-lg leading-8 text-blue/75">
            {coach.story.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
            <blockquote className="rounded-3xl border border-yellow/70 bg-blue p-7 text-xl font-medium italic leading-8 text-white shadow-xl shadow-blue/10 md:p-9">
              “{coach.quote}”
              <footer className="mt-4 font-mono text-xs font-bold not-italic uppercase tracking-wider text-yellow">— {coach.name}</footer>
            </blockquote>
          </div>
        </div>
      </section>

      <CoachingJourney coach={coach} />

      <section id="session-details" className="bg-[#f4f6fa] px-6 py-20 md:py-28">
        <div className="mx-auto max-w-[var(--page-w)]">
          <div className="mb-10 max-w-3xl">
            <p className="font-mono text-sm font-bold uppercase tracking-[.18em] text-yellow">Thông tin phiên khai vấn</p>
            <h2 className="mt-3 font-display text-3xl font-bold text-blue md:text-5xl">Một phiên cùng {coach.name.split(" ").slice(-1)[0]}</h2>
            <p className="mt-4 leading-7 text-blue/70">Phí và thời gian được hiển thị trước để bạn chủ động sắp xếp. Các hồ sơ minh hoạ cần được Sunshine Center xác nhận trước khi nhận đăng ký thật.</p>
          </div>

          <div className="grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
            <div className="rounded-3xl bg-blue p-7 text-white md:p-9">
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-yellow">Phí khai vấn</p>
              <p className="mt-3 font-display text-2xl font-bold md:text-3xl">{coach.sessionFee}</p>
              <div className="mt-8 grid grid-cols-2 gap-4 border-t border-white/15 pt-6">
                <div><p className="text-3xl font-extrabold text-yellow">{coach.experienceYears ?? "—"}</p><p className="mt-1 text-sm text-white/65">năm cùng Sunshine</p></div>
                <div><p className="text-3xl font-extrabold text-yellow">{coach.coachingHours ? coach.coachingHours.toLocaleString("vi-VN") : "—"}</p><p className="mt-1 text-sm text-white/65">giờ khai vấn</p></div>
              </div>
              <p className="mt-6 text-xs leading-5 text-white/55">{coach.isDemo ? "Số liệu minh hoạ cho giao diện demo." : "Kinh nghiệm và số giờ đang được Sunshine Center xác nhận."}</p>
            </div>

            <div className="rounded-3xl border border-blue/10 bg-white p-7 md:p-9">
              <h3 className="font-display text-xl font-bold text-blue md:text-2xl">Khung giờ thường nhận phiên</h3>
              <div className="mt-5 flex flex-wrap gap-3">
                {coach.availability.map((slot) => <span key={slot} className="rounded-full border border-blue/15 bg-[#f7f8fb] px-4 py-2.5 text-sm font-medium text-blue">{slot}</span>)}
              </div>
              <div className="mt-7 grid gap-4 border-t border-blue/10 pt-6 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue/45">Kiểm tra email & xác nhận</p>
                  <p className="mt-2 font-semibold text-blue">{coach.responseTime}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-blue/45">Đặt lịch trước</p>
                  <p className="mt-2 font-semibold text-blue">{coach.bookingNoticeHours ? `Tối thiểu ${coach.bookingNoticeHours} giờ` : "Cần xác nhận với coach"}</p>
                </div>
              </div>
              <p className="mt-5 text-sm leading-6 text-blue/60">Yêu cầu sát giờ cần chờ coach xác nhận trước khi lịch được xem là đã đặt. Sunshine Center sẽ liên hệ lại theo thời gian phản hồi ở trên.</p>
              <Link href="#booking" className="mt-6 inline-flex items-center rounded-full bg-yellow px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-blue transition hover:-translate-y-0.5 hover:bg-blue hover:text-white">Gửi yêu cầu đặt phiên</Link>
            </div>
          </div>

          <div className="mt-14">
            <h3 className="font-display text-2xl font-bold text-blue md:text-3xl">Bạn có thể cùng coach hướng tới</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {coach.outcomes.map((outcome, index) => (
                <div key={outcome} className="rounded-2xl border border-blue/10 bg-white p-5">
                  <span className="font-mono text-sm font-bold text-yellow">0{index + 1}</span>
                  <p className="mt-2 font-semibold leading-6 text-blue">{outcome}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-5 text-blue/50">Kết quả phụ thuộc vào mục tiêu, hoàn cảnh và mức độ tham gia của từng người; nội dung này không phải cam kết bảo đảm kết quả.</p>
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-3xl border border-yellow/50 bg-yellow/15 p-6 md:flex-row md:items-center md:p-8">
            <div><h3 className="font-display text-xl font-bold text-blue">Muốn tìm hiểu trước khi gửi yêu cầu?</h3><p className="mt-2 text-sm leading-6 text-blue/70">Liên hệ Sunshine Center qua thông tin ở cuối trang để xác nhận phí, lịch trống và thời gian phản hồi.</p></div>
            <Link href="/coaching#companions" className="inline-flex shrink-0 items-center rounded-full bg-yellow px-6 py-3 font-mono text-xs font-bold uppercase tracking-wider text-blue transition hover:-translate-y-0.5 hover:bg-white">Xem các coach khác</Link>
          </div>
        </div>
      </section>

      <InquiryForm coachName={coach.name} availability={coach.availability} bookingNoticeHours={coach.bookingNoticeHours} />

      <div id="footer"><SiteFooter /></div>
    </main>
  );
}
