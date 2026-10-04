"use client";
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
    <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        {/* Nhóm: Loại chương trình - tông vàng */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border-2 border-yellow bg-yellow/10 p-1.5">
          {[{ key: "all", label: "Tất cả", icon: null }]
            .concat(
              categories.map((cat) => ({
                key: cat,
                label: CATEGORY_LABELS[cat],
                icon: cat,
              })),
            )
            .map((item) =>
              item.key === "all" ? (
                <CategoryPill
                  key="all"
                  href={buildHref(undefined, activeStatus, activeSort)}
                  active={!activeCategory}
                  label="Tất cả"
                />
              ) : (
                <CategoryPill
                  key={item.key}
                  href={buildHref(item.key, activeStatus, activeSort)}
                  active={activeCategory === item.key}
                  icon={
                    <CategoryIcon
                      category={item.icon as ProgramCategory}
                      size={14}
                    />
                  }
                  label={item.label}
                />
              ),
            )}
        </div>

        {/* Nhóm: Thời gian - tông xanh dương, tách biệt hẳn với nhóm trên */}
        <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border-2 border-blue bg-blue/10 p-1.5">
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
      className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm transition ${
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
      className={`rounded-full px-3.5 py-2 text-sm transition ${
        active
          ? "bg-blue font-extrabold text-white shadow-sm"
          : "font-bold text-blue/80 hover:bg-blue/20"
      }`}
    >
      {label}
    </Link>
  );
}
