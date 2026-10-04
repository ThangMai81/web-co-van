"use client";

import { useState } from "react";
import ProgramCard from "./ProgramCard";
import type { Program } from "@/types/program";

const PAGE_SIZE = 6;

export default function ProgramGrid({ items }: { items: Program[] }) {
  const [visible, setVisible] = useState(PAGE_SIZE);

  const shown = items.slice(0, visible);
  const hasMore = visible < items.length;

  return (
    <div>
      <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((program) => (
          <ProgramCard key={program._id} program={program} />
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="rounded-full border-2 border-blue bg-white px-8 py-2.5 text-sm font-bold text-blue transition hover:bg-blue hover:text-white"
          >
            Xem thêm ({items.length - visible} chương trình)
          </button>
        </div>
      )}
    </div>
  );
}
