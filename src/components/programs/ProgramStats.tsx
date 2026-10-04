import type { ProgramStat } from "@/types/program";

export default function ProgramStats({ stats }: { stats: ProgramStat[] }) {
  return (
    <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="rounded-xl border border-blue/15 bg-blue/5 p-4 text-center"
        >
          <div className="text-2xl font-extrabold text-blue">{stat.value}</div>
          <div className="mt-1 text-xs font-bold uppercase tracking-wide text-blue/60">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
