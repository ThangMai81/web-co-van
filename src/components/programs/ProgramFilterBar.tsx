import Link from "next/link";
import { CATEGORY_LABELS, STATUS_LABELS } from "@/lib/programLabels";
import CategoryIcon from "./CategoryIcon";
import ProgramSortSelect from "./ProgramSortSelect";
import type { ProgramCategory, ProgramStatus } from "@/types/program";

function buildHref(category?: string, status?: string, sort?: string) {
  const query = new URLSearchParams();
  if (category) query.set("category", category);
  if (status) query.set("status", status);
  if (sort) query.set("sort", sort);
  const qs = query.toString();
  return qs ? `/programs?${qs}` : "/programs";
}

export default function ProgramFilterBar({
  activeCategory,
  activeStatus,
  activeSort,
}: {
  activeCategory?: string;
  activeStatus?: string;
  activeSort?: string;
}) {
  const categories = Object.keys(CATEGORY_LABELS) as ProgramCategory[];
  const statuses = Object.keys(STATUS_LABELS) as ProgramStatus[];

  return (
    <div className="flex min-w-0 flex-col gap-4 xl:flex-row xl:flex-wrap xl:items-end xl:justify-between">
      <div className="grid min-w-0 gap-3 md:grid-cols-2 xl:flex xl:flex-wrap">
        <div className="grid min-w-0 gap-1.5">
          <span className="px-1 text-[11px] font-bold uppercase tracking-[0.14em] text-blue/55">Loại chương trình</span>
          <div className="flex min-w-0 flex-wrap items-center gap-1 rounded-xl border border-yellow/40 bg-yellow/[0.08] p-1">
          <CategoryPill
            href={buildHref(undefined, activeStatus, activeSort)}
            active={!activeCategory}
            label="Tất cả"
          />
          {categories.map((cat) => (
            <CategoryPill
              key={cat}
              href={buildHref(cat, activeStatus, activeSort)}
              active={activeCategory === cat}
              icon={<CategoryIcon category={cat} size={14} />}
              label={CATEGORY_LABELS[cat]}
            />
          ))}
          </div>
        </div>

        <div className="grid min-w-0 gap-1.5">
          <span className="px-1 text-[11px] font-bold uppercase tracking-[0.14em] text-blue/55">Thời gian</span>
          <div className="flex min-w-0 flex-wrap items-center gap-1 rounded-xl border border-blue/15 bg-blue/[0.04] p-1">
          <StatusPill
            href={buildHref(activeCategory, undefined, activeSort)}
            active={!activeStatus}
            label="Mọi thời điểm"
          />
          {statuses.map((st) => (
            <StatusPill
              key={st}
              href={buildHref(activeCategory, st, activeSort)}
              active={activeStatus === st}
              label={STATUS_LABELS[st]}
            />
          ))}
          </div>
        </div>
      </div>

      <ProgramSortSelect
        category={activeCategory}
        status={activeStatus}
        sort={activeSort}
      />
    </div>
  );
}

function CategoryPill({
  href,
  active,
  label,
  icon,
}: {
  href: string;
  active: boolean;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "page" : undefined}
      className={`flex min-h-10 items-center gap-1.5 rounded-full px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 ${
        active
          ? "bg-yellow font-extrabold text-blue shadow-sm"
          : "font-bold text-blue/80 hover:bg-yellow/25"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

function StatusPill({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "page" : undefined}
      className={`min-h-10 rounded-full px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 ${
        active
          ? "bg-blue font-extrabold text-white shadow-sm"
          : "font-bold text-blue/80 hover:bg-blue/20"
      }`}
    >
      {label}
    </Link>
  );
}
