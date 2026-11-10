import { CATEGORY_LABELS, STATUS_LABELS } from "@/lib/programLabels";
import { MapPin, Calendar } from "@/lib/icons";
import CategoryIcon from "./CategoryIcon";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import ProgramHeroImageViewer from "./ProgramHeroImageViewer";
import ProgramHeroWarmSweep from "./ProgramHeroWarmSweep";
import styles from "./ProgramHero.module.css";
import enter from "./ProgramHeroEntrance.module.css";
import type { Program } from "@/types/program";

export default function ProgramHero({ program, viewerEnabled }: { program: Program; viewerEnabled: boolean }) {
  const coverImage = program.coverImage;

  return (
    <section className="bg-blue">
      <div className="mx-auto max-w-[var(--page-w)] px-6 pb-10 pt-[88px] md:pb-12 md:pt-[128px] lg:pt-[88px]">
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
              ? "mt-5 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-center lg:gap-10"
              : "mt-5"
          }
        >
          <div className="min-w-0 text-white">
            <div className={`mb-3 flex flex-wrap gap-2 ${enter.enterItem} ${enter.enterBadges}`}>
              <span className="flex items-center gap-1.5 rounded-full bg-yellow px-3 py-1 text-sm font-bold text-blue">
                <CategoryIcon category={program.category} size={14} />
                {CATEGORY_LABELS[program.category]}
              </span>
              <span className="rounded-full border border-white/40 px-3 py-1 text-xs font-bold text-white">
                {STATUS_LABELS[program.status]}
              </span>
            </div>

            <div className={`${enter.enterItem} ${enter.enterTitle}`}>
              <h1 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
                {program.title}
              </h1>
              {program.theme && (
                <p className="mt-2 text-lg font-semibold text-white/90">
                  {program.theme}
                </p>
              )}
            </div>

            <dl className={`mt-4 grid gap-3 text-sm font-bold sm:grid-cols-2 xl:grid-cols-2 ${enter.enterItem} ${enter.enterMeta}`}>
              <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-3">
                <dt className="text-xs font-semibold uppercase tracking-wide text-white/60">
                  Hình thức
                </dt>
                <dd className="mt-1 flex items-center gap-1.5 text-yellow">
                  {program.format === "online" ? "Trực tuyến" : "Trực tiếp"}
                </dd>
              </div>
              {program.location && (
                <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-3">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-white/60">
                    Địa điểm
                  </dt>
                  <dd className="mt-1 flex items-center gap-1.5 text-yellow">
                    <MapPin size={15} /> {program.location}
                  </dd>
                </div>
              )}
              {program.schedule?.trim() && (
                <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 sm:col-span-2 xl:col-span-2">
                  <dt className="text-xs font-semibold uppercase tracking-wide text-white/60">
                    Lịch trình
                  </dt>
                  <dd className="mt-1 flex items-center gap-1.5 text-yellow">
                    <Calendar size={15} /> {program.schedule}
                  </dd>
                </div>
              )}
            </dl>

            {program.registration?.isOpen && (
              <div className={`mt-5 border-t border-white/15 pt-4 ${enter.enterItem} ${enter.enterCta}`}>
                <a
                  href="#program-registration"
                  className="inline-flex min-h-11 items-center rounded-full bg-yellow px-6 py-3 font-bold text-blue transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue"
                >
                  Đăng ký tham gia
                </a>
              </div>
            )}
          </div>

        {coverImage && (
          <ProgramHeroWarmSweep
            slug={program.slug}
            className={`${styles.coverFrame} relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/20 bg-white lg:mt-0`}
          >
            <ProgramHeroImageViewer
              src={coverImage}
              alt={program.title}
              priority
              sizes="(max-width: 64rem) calc(100vw - 3rem), (max-width: 90rem) calc(50vw - 4rem), 42rem"
              viewerEnabled={viewerEnabled}
            />
          </ProgramHeroWarmSweep>
        )}
        </div>
      </div>
    </section>
  );
}
