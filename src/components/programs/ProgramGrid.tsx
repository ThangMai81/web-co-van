"use client";

import { useState } from "react";
import { Reveal } from "@/components/animation/Reveal";
import ProgramCard from "./ProgramCard";
import styles from "./ProgramGrid.module.css";
import { useProgramJourneySequence } from "./ProgramJourneySequence";
import type { Program } from "@/types/program";

const PAGE_SIZE = 6;

export default function ProgramGrid({ items }: { items: Program[] }) {
  const [visible, setVisible] = useState(PAGE_SIZE);
  const { stage } = useProgramJourneySequence();
  const revealEnabled =
    stage === "pending" || stage === "static" || stage === "cards";

  const shown = items.slice(0, visible);
  const hasMore = visible < items.length;

  return (
    <div>
      <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6">
        {shown.map((program, index) => (
          <Reveal
            key={program._id}
            direction="up"
            delay={Math.min(index * 60, 300)}
            className={styles.programCardReveal}
            enabled={revealEnabled}
            showOnObserverSetupError
          >
            <ProgramCard program={program} />
          </Reveal>
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
