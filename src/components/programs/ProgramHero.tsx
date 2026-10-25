import Image from "next/image";
import { CATEGORY_LABELS, STATUS_LABELS } from "@/lib/programLabels";
import { MapPin, Calendar } from "@/lib/icons";
import CategoryIcon from "./CategoryIcon";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import type { Program } from "@/types/program";

export default function ProgramHero({ program }: { program: Program }) {
  const coverImage = program.coverImage;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[var(--page-w)] px-6 pt-[88px] md:pt-[128px] lg:pt-[88px]">
        <Breadcrumb
          items={[
            { label: "Chương trình", href: "/programs" },
            {
              label: CATEGORY_LABELS[program.category],
              href: `/programs?category=${program.category}`,
            },
            { label: program.title },
          ]}
        />

        {coverImage && (
          <div
            className="relative mx-auto aspect-[4/3] w-full overflow-hidden rounded-2xl border border-blue/10 bg-white"
          >
            <Image
              src={coverImage}
              alt={program.title}
              fill
              priority
              sizes="(max-width: 90rem) calc(100vw - 3rem), 87rem"
              className="object-cover object-center"
            />
          </div>
        )}

        <div className="mt-6 rounded-2xl bg-blue p-6 text-white shadow-md shadow-blue/10 sm:p-8">
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-yellow px-3 py-1 text-sm font-bold text-blue">
              <CategoryIcon category={program.category} size={14} />
              {CATEGORY_LABELS[program.category]}
            </span>
            <span className="rounded-full border border-white/40 px-3 py-1 text-xs font-bold text-white">
              {STATUS_LABELS[program.status]}
            </span>
          </div>

          <div className="lg:grid lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-end lg:gap-8">
            <div>
              <h1 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
                {program.theme || program.title}
              </h1>
              {program.theme && (
                <p className="mt-2 text-lg font-semibold text-white/90">
                  {program.title}
                </p>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm font-bold text-yellow lg:mt-0">
              {program.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin size={15} /> {program.location}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar size={15} /> {program.schedule}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
