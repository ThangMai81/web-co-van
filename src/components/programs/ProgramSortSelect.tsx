"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpDown, ChevronDown } from "@/lib/icons";

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "price-asc", label: "Giá thấp → cao" },
  { value: "price-desc", label: "Giá cao → thấp" },
];

export default function ProgramSortSelect({
  category,
  status,
  sort,
}: {
  category?: string;
  status?: string;
  sort?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const current =
    SORT_OPTIONS.find((o) => o.value === (sort || "newest")) ?? SORT_OPTIONS[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function buildHref(value: string) {
    const query = new URLSearchParams();
    if (category) query.set("category", category);
    if (status) query.set("status", status);
    if (value !== "newest") query.set("sort", value);
    const qs = query.toString();
    return qs ? `/programs?${qs}` : "/programs";
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border-2 border-blue bg-blue px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-110"
      >
        <ArrowUpDown size={15} />
        {current.label}
        <ChevronDown
          size={15}
          className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-40 mt-2 w-52 overflow-hidden rounded-xl border border-blue/15 bg-white py-1 shadow-lg shadow-blue/15">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                setOpen(false);
                router.push(buildHref(opt.value), { scroll: false });
              }}
              className={`block w-full px-4 py-2.5 text-left text-sm font-bold transition ${
                current.value === opt.value
                  ? "bg-yellow text-blue"
                  : "text-blue/80 hover:bg-blue/5"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
