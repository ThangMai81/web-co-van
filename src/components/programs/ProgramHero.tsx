import Image from "next/image";
import { CATEGORY_LABELS, STATUS_LABELS } from "@/lib/programLabels";
import { MapPin, Calendar } from "@/lib/icons";
import CategoryIcon from "./CategoryIcon";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import type { Program } from "@/types/program";

export default function ProgramHero({ program }: { program: Program }) {
  return (
    <div className="relative flex h-[60vh] min-h-[420px] w-full items-end bg-blue">
      {program.coverImage && (
        <Image
          src={program.coverImage}
          alt={program.title}
          fill
          priority
          className="object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-blue via-blue/70 to-blue/20" />

      <div className="relative mx-auto w-full max-w-4xl px-6 pb-10">
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

        <div className="mb-3 flex flex-wrap gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-yellow px-3 py-1 text-xs font-bold text-blue">
            <CategoryIcon category={program.category} size={14} />
            {CATEGORY_LABELS[program.category]}
          </span>
          <span className="rounded-full border border-white/40 px-3 py-1 text-xs font-bold text-white">
            {STATUS_LABELS[program.status]}
          </span>
        </div>

        <h1 className="font-display text-3xl font-bold leading-tight text-white sm:text-4xl">
          {program.theme || program.title}
        </h1>
        {program.theme && (
          <p className="mt-2 text-lg font-semibold text-white/90">
            {program.title}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm font-bold text-yellow">
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
  );
}
