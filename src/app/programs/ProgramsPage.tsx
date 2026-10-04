import ProgramGrid from "@/components/programs/ProgramGrid";
import ProgramFilterBar from "@/components/programs/ProgramFilterBar";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import type { Program } from "@/types/program";

async function getPrograms(
  category?: string,
  status?: string,
  sort?: string,
): Promise<Program[]> {
  const query = new URLSearchParams();
  if (category) query.set("category", category);
  if (status) query.set("status", status);
  if (sort) query.set("sort", sort);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/programs?${query.toString()}`,
    { cache: "no-store" },
  );
  const json = await res.json();
  return json.data ?? [];
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
  const programs = await getPrograms(category, status, sort);

  const showSplit = !status && !sort;
  const upcoming = programs.filter((p) => p.status === "upcoming");
  const past = programs.filter((p) => p.status === "past");

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
    <main className="min-h-svh bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="relative overflow-hidden bg-blue pb-16 pt-32">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-yellow/20 blur-3xl" />
        <div className="relative mx-auto max-w-[var(--page-w)] px-6">
          <Breadcrumb
            variant="light"
            items={[
              { label: "Trang chủ", href: "/" },
              { label: "Chương trình" },
            ]}
          />

          <div className="mb-4 flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-yellow">
            <span className="block h-px w-6 bg-yellow" />
            Chương trình
          </div>
          <h1 className="max-w-[20ch] font-display text-4xl font-bold text-white sm:text-5xl">
            Những hành trình của Sunshine Center
          </h1>
          <p className="mt-4 max-w-[60ch] text-white/80">
            Từ trại hè, leo núi, workshop đến những buổi off chữa lành — mỗi
            chương trình là một trải nghiệm để kết nối và trưởng thành.
          </p>

          <div className="mt-8 flex gap-8 border-t border-white/15 pt-6">
            <div>
              <div className="text-2xl font-extrabold text-yellow">
                {programs.length}
              </div>
              <div className="text-xs font-medium text-white/60">
                Chương trình
              </div>
            </div>
            <div>
              <div className="text-2xl font-extrabold text-yellow">
                {upcoming.length}
              </div>
              <div className="text-xs font-medium text-white/60">
                Sắp diễn ra
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav
        aria-label="Lọc chương trình"
        className="sticky top-[73px] z-30 border-b border-blue/10 bg-white/95 py-4 backdrop-blur-sm"
      >
        <div className="mx-auto max-w-[var(--page-w)] px-6">
          <ProgramFilterBar
            activeCategory={category}
            activeStatus={status}
            activeSort={sort}
          />
        </div>
      </nav>

      <section aria-label="Danh sách chương trình" className="bg-white py-14">
        <div className="mx-auto max-w-[var(--page-w)] px-6">
          {programs.length === 0 ? (
            <p className="font-medium text-blue/50">
              Chưa có chương trình nào phù hợp với bộ lọc.
            </p>
          ) : showSplit ? (
            <div className="space-y-16">
              {upcoming.length > 0 && (
                <ProgramGroup
                  title="Sắp diễn ra"
                  dotClassName="animate-pulse bg-yellow"
                  items={upcoming}
                />
              )}
              {past.length > 0 && (
                <ProgramGroup
                  title="Đã diễn ra"
                  dotClassName="bg-blue/30"
                  items={past}
                />
              )}
            </div>
          ) : (
            <ProgramGrid items={programs} />
          )}
        </div>
      </section>
    </main>
  );
}

function ProgramGroup({
  title,
  dotClassName,
  items,
}: {
  title: string;
  dotClassName: string;
  items: Program[];
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
      <ProgramGrid items={items} />
    </section>
  );
}
