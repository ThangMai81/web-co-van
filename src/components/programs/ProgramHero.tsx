import { ArrowDown, CalendarDays, MapPin, Radio, Users } from "lucide-react";
import { CATEGORY_LABELS, STATUS_LABELS } from "@/lib/programLabels";
import CategoryIcon from "./CategoryIcon";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import ProgramHeroImageViewer from "./ProgramHeroImageViewer";
import ProgramHeroWarmSweep from "./ProgramHeroWarmSweep";
import {
  DetailHeroBackdrop,
  DetailHeroCurve,
  DetailHeroFrame,
  MetaStrip,
  RotatingSeal,
  type MetaItem,
} from "@/components/detail/DetailHero";
import styles from "./ProgramHero.module.css";
import enter from "./ProgramHeroEntrance.module.css";
import Image from "next/image";
import type { Program } from "@/types/program";

export default function ProgramHero({
  program,
  viewerEnabled,
  nextTone = "cream",
}: {
  program: Program;
  viewerEnabled: boolean;
  nextTone?: "cream" | "blue";
}) {
  const coverImage = program.coverImage;
  const isUpcoming = program.status === "upcoming";

  const meta: MetaItem[] = [
    {
      icon: program.format === "online" ? <Radio size={16} /> : <Users size={16} />,
      label: "Hình thức",
      value: program.format === "online" ? "Trực tuyến" : "Trực tiếp",
    },
    ...(program.location?.trim()
      ? [{ icon: <MapPin size={16} />, label: "Địa điểm", value: program.location.trim() }]
      : []),
    ...(program.schedule?.trim()
      ? [{ icon: <CalendarDays size={16} />, label: "Lịch trình", value: program.schedule.trim(), wide: true }]
      : []),
  ];

  return (
    <section className="relative isolate overflow-hidden text-white">
      <DetailHeroBackdrop image={coverImage} />
      <div className="mx-auto max-w-[var(--page-w)] px-6 pb-20 pt-[88px] md:pb-24 md:pt-[128px] lg:pt-[96px]">
        <Breadcrumb
          variant="light"
          items={[
            { label: "Chương trình", href: "/programs" },
            {
              label: CATEGORY_LABELS[program.category],
              href: `/programs?category=${program.category}`,
            },
            { label: program.title },
          ]}
        />

        <div
          className={
            coverImage
              ? "mt-8 grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-14"
              : "mt-8 max-w-3xl"
          }
        >
          <div className="min-w-0">
            <div
              className={`mb-5 flex flex-wrap items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-yellow ${enter.enterItem} ${enter.enterBadges}`}
            >
              <span aria-hidden="true" className="block h-px w-8 bg-yellow" />
              <span className="inline-flex items-center gap-1.5">
                <CategoryIcon category={program.category} size={14} />
                {CATEGORY_LABELS[program.category]}
              </span>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 tracking-[0.12em] ${
                  isUpcoming ? "bg-yellow text-blue" : "border border-white/30 text-white/80"
                }`}
              >
                {isUpcoming && (
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue motion-reduce:animate-none" />
                )}
                {STATUS_LABELS[program.status]}
              </span>
            </div>

            <div className={`${enter.enterItem} ${enter.enterTitle}`}>
              <h1 className="font-editorial text-4xl font-bold leading-[1.08] tracking-[-0.01em] text-white sm:text-5xl lg:text-6xl">
                {program.title}
              </h1>
              {program.theme && (
                <p className="mt-4 max-w-[34ch] font-editorial text-xl italic leading-snug text-yellow sm:text-2xl">
                  {program.theme}
                </p>
              )}
            </div>

            <MetaStrip items={meta} className={`mt-8 ${enter.enterItem} ${enter.enterMeta}`} />

            <div className={`mt-8 flex flex-wrap items-center gap-3 ${enter.enterItem} ${enter.enterCta}`}>
              {program.registration?.isOpen && (
                <a
                  href="#program-registration"
                  className="inline-flex min-h-12 items-center rounded-full bg-yellow px-7 py-3 font-bold text-blue shadow-lg shadow-yellow/20 transition hover:-translate-y-0.5 hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue motion-reduce:transform-none"
                >
                  Đăng ký tham gia
                </a>
              )}
              <a
                href={nextTone === "cream" ? "#program-content" : "#program-highlights"}
                className="group inline-flex min-h-12 items-center gap-2 rounded-full border border-white/25 px-6 py-3 text-sm font-bold text-white transition-colors hover:border-yellow hover:text-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow"
              >
                Khám phá chương trình
                <ArrowDown size={16} className="transition-transform group-hover:translate-y-0.5" aria-hidden="true" />
              </a>
            </div>
          </div>

          {coverImage && (
            <DetailHeroFrame className="mr-3 sm:mr-5">
              <ProgramHeroWarmSweep
                slug={program.slug}
                className={`${styles.coverFrame} relative aspect-[4/3] w-full overflow-hidden rounded-[1.75rem] border border-white/20 bg-blue shadow-2xl shadow-black/40`}
              >
                {/* Nền mờ từ chính ảnh bìa: lấp khoảng trống khi ảnh banner ngang được hiển thị contain */}
                <span aria-hidden="true" className="pointer-events-none absolute inset-0">
                  <Image
                    src={coverImage}
                    alt=""
                    fill
                    sizes="42rem"
                    className="scale-125 object-cover opacity-70 blur-2xl saturate-150"
                  />
                  <span className="absolute inset-0 bg-gradient-to-b from-blue/10 via-transparent to-blue/40" />
                </span>
                <ProgramHeroImageViewer
                  src={coverImage}
                  alt={program.title}
                  priority
                  sizes="(max-width: 64rem) calc(100vw - 3rem), (max-width: 90rem) calc(50vw - 4rem), 42rem"
                  viewerEnabled={viewerEnabled}
                />
              </ProgramHeroWarmSweep>
              <RotatingSeal
                text={`${STATUS_LABELS[program.status]} • Sunshine Center`}
                icon={<CategoryIcon category={program.category} size={22} />}
                className="-bottom-8 -left-5 sm:-bottom-10 sm:-left-10"
              />
            </DetailHeroFrame>
          )}
        </div>
      </div>
      <DetailHeroCurve tone={nextTone} />
    </section>
  );
}
