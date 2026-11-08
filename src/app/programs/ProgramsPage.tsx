import ProgramGrid from "@/components/programs/ProgramGrid";
import {
  ProgramJourneyCurve,
  ProgramJourneySequenceProvider,
  ProgramJourneyStats,
} from "@/components/programs/ProgramJourneySequence";
import ProgramFilterBar from "@/components/programs/ProgramFilterBar";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import CatalogListUnavailable from "@/components/ui/CatalogListUnavailable";
import { HeroLineMaskReveal } from "@/components/ui/HeroLineMaskReveal";
import motionStyles from "@/components/ui/PhysicalHeroMotion.module.css";
import type { Program } from "@/types/program";

type CatalogListResult<T> =
  | { kind: "loaded"; items: T[] }
  | { kind: "unavailable" };

async function getPrograms(
  category?: string,
  status?: string,
  sort?: string,
): Promise<CatalogListResult<Program>> {
  const query = new URLSearchParams();
  if (category) query.set("category", category);
  if (status) query.set("status", status);
  if (sort) query.set("sort", sort);

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/programs?${query.toString()}`,
      { cache: "no-store" },
    );
    if (!res.ok || res.status !== 200) return { kind: "unavailable" };

    const json: unknown = await res.json();
    if (
      typeof json !== "object" ||
      json === null ||
      !("data" in json) ||
      !Array.isArray(json.data)
    ) {
      return { kind: "unavailable" };
    }

    return { kind: "loaded", items: json.data as Program[] };
  } catch {
    return { kind: "unavailable" };
  }
}

export default async function ProgramsPage({
  category,
  status,
  sort,
}: {
  category?: string;
  status?: string;
  sort?: string;
}) {
  const result = await getPrograms(category, status, sort);
  const isLoaded = result.kind === "loaded";
  const programs = isLoaded ? result.items : [];

  const showSplit = !status && !sort;
  const upcoming = programs.filter((p) => p.status === "upcoming");
  const past = programs.filter((p) => p.status === "past");
  const journeyPrograms = showSplit ? [...upcoming, ...past] : programs;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: programs.map((p, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/programs/${p.slug}`,
      name: p.title,
    })),
  };

  return (
    <ProgramJourneySequenceProvider
      hasPrograms={isLoaded && journeyPrograms.length > 0}
    >
      <main className="min-h-svh bg-white">
      {isLoaded && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}

      <header className="relative overflow-hidden bg-blue pb-12 pt-[88px] sm:pb-14">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-yellow/20 blur-3xl" />
        {isLoaded && <ProgramJourneyCurve items={journeyPrograms} />}
        <div
          className={[
            "relative z-10 mx-auto grid max-w-[var(--page-w)] gap-8 px-6",
            isLoaded
              ? "lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.68fr)] lg:items-end"
              : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <div className="min-w-0">
            <Breadcrumb
              className={motionStyles.programsBreadcrumb}
              variant="light"
              items={[
                { label: "Trang chủ", href: "/" },
                { label: "Chương trình" },
              ]}
            />

            <div
              className={[
                motionStyles.programsKicker,
                "mb-4 flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.16em] text-yellow sm:text-sm",
              ].join(" ")}
            >
              <span
                className={[
                  motionStyles.programsKickerAccent,
                  "block h-px w-6 bg-yellow",
                ].join(" ")}
              />
              Chương trình
            </div>
            <HeroLineMaskReveal>
              <h1 className="max-w-[18ch] font-display text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
                Những hành trình của Sunshine Center
              </h1>
            </HeroLineMaskReveal>
            <p
              className={[
                motionStyles.programsDescription,
                "mt-4 max-w-[60ch] text-sm leading-6 text-white/80 sm:text-base",
              ].join(" ")}
            >
              Từ trại hè, leo núi, workshop đến những buổi off chữa lành — mỗi
              chương trình là một trải nghiệm để kết nối và trưởng thành.
            </p>
          </div>

          {isLoaded && (
            <ProgramJourneyStats
              total={programs.length}
              upcoming={upcoming.length}
            />
          )}
        </div>
      </header>

      <nav
        aria-label="Lọc chương trình"
        className="z-30 border-b border-blue/10 bg-white/95 py-4 shadow-sm shadow-blue/5 backdrop-blur-sm"
      >
        <div className="mx-auto max-w-[var(--page-w)] px-6">
          <ProgramFilterBar
            activeCategory={category}
            activeStatus={status}
            activeSort={sort}
          />
        </div>
      </nav>

      <section aria-label="Danh sách chương trình" className="bg-blue/[0.025] py-10 md:py-14">
        <div className="mx-auto max-w-[var(--page-w)] px-6">
          {!isLoaded ? (
            <CatalogListUnavailable />
          ) : programs.length === 0 ? (
            <p className="font-medium text-blue/50">
              Chưa có chương trình nào phù hợp với bộ lọc.
            </p>
          ) : showSplit ? (
            <div className="space-y-12 md:space-y-14">
              {upcoming.length > 0 && (
                <ProgramGroup
                  title="Sắp diễn ra"
                  dotClassName="bg-yellow"
                  items={upcoming}
                  journeyBridgeTarget={upcoming.length > 0}
                />
              )}
              {past.length > 0 && (
                <ProgramGroup
                  title="Đã diễn ra"
                  dotClassName="bg-blue/30"
                  items={past}
                  journeyBridgeTarget={upcoming.length === 0}
                />
              )}
            </div>
          ) : (
            <ProgramGrid items={programs} journeyBridgeTarget />
          )}
        </div>
      </section>
      </main>
    </ProgramJourneySequenceProvider>
  );
}

function ProgramGroup({
  title,
  dotClassName,
  items,
  journeyBridgeTarget = false,
}: {
  title: string;
  dotClassName: string;
  items: Program[];
  journeyBridgeTarget?: boolean;
}) {
  return (
    <section aria-labelledby={`group-${title}`}>
      <div className="mb-5 flex items-center gap-2.5">
        <span className={`h-2.5 w-2.5 rounded-full ${dotClassName}`} />
        <h2 id={`group-${title}`} className="text-xl font-bold text-blue">
          {title}
        </h2>
        <span className="rounded-full bg-blue/5 px-2.5 py-0.5 text-xs font-bold text-blue/60">
          {items.length}
        </span>
      </div>
      <ProgramGrid items={items} journeyBridgeTarget={journeyBridgeTarget} />
    </section>
  );
}
