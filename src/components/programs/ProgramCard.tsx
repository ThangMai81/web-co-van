import Link from "next/link";
import { CATEGORY_LABELS, STATUS_LABELS } from "@/lib/programLabels";
import { Calendar, MapPin } from "@/lib/icons";
import CategoryIcon from "./CategoryIcon";
import ProgramCardThumbnail from "./ProgramCardThumbnail";
import ViewDetailLabel from "@/components/ui/ViewDetailLabel";
import type { Program } from "@/types/program";

export default function ProgramCard({ program }: { program: Program }) {
  const isPast = program.status === "past";

  return (
    <Link
      href={`/programs/${program.slug}`}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-white transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:shadow-md motion-reduce:transform-none motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 ${
        isPast
          ? "border-blue/10 shadow-blue/5 hover:border-blue/25 hover:shadow-blue/10"
          : "border-yellow/60 shadow-blue/5 hover:border-yellow hover:shadow-blue/10"
      }`}
    >
      <div className="relative h-48 w-full shrink-0 overflow-hidden bg-blue/10 sm:h-52">
        {program.coverImage && (
          <ProgramCardThumbnail
            src={program.coverImage}
            alt={program.title}
            category={program.category}
            isPast={isPast}
          />
        )}
        <span className="absolute left-3 top-3 flex max-w-[60%] items-center gap-1.5 rounded-full border border-white/60 bg-yellow px-3 py-1 text-xs font-bold text-blue shadow-sm">
          <CategoryIcon category={program.category} size={14} />
          {CATEGORY_LABELS[program.category]}
        </span>
        <span
          className={`absolute right-3 top-3 flex max-w-[42%] items-center gap-1.5 rounded-full border border-white/40 px-3 py-1 text-xs font-bold shadow-sm ${
            isPast ? "bg-white/95 text-blue" : "bg-blue text-white"
          }`}
        >
          {!isPast && (
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-yellow" />
          )}
          {STATUS_LABELS[program.status]}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <h3 className="line-clamp-2 min-h-[3.25rem] text-lg font-bold leading-snug text-blue sm:text-xl">
          {program.title}
        </h3>

        <div className="mt-1 grid gap-2 border-t border-blue/10 pt-3">
          {program.location && (
            <p className="flex min-w-0 items-start gap-2 text-sm font-medium leading-5 text-blue/75">
              <MapPin size={15} className="mt-0.5 shrink-0 text-blue/50" />
              <span className="min-w-0 break-words">{program.location}</span>
            </p>
          )}
          <p className="flex min-w-0 items-start gap-2 text-sm font-semibold leading-5 text-blue">
            <Calendar size={15} className="mt-0.5 shrink-0 text-blue/60" />
            <span className="min-w-0 break-words">{program.schedule}</span>
          </p>
        </div>

        <div className="mt-auto pt-2">
          <ViewDetailLabel />
        </div>
      </div>
    </Link>
  );
}
