type PracticalFact = { label: string; value: string };

export default function ProgramHighlights({
  highlights,
  facts,
}: {
  highlights: string[];
  facts: PracticalFact[];
}) {
  return (
    <div
      className={`grid gap-8 ${
        facts.length > 0
          ? "lg:grid-cols-[minmax(0,1.5fr)_minmax(16rem,0.72fr)] lg:gap-14"
          : ""
      }`}
    >
      <div className="min-w-0">
        <h2 className="mb-5 border-l-4 border-yellow pl-4 text-2xl font-bold text-white md:text-3xl">
          ✨ Điểm nổi bật
        </h2>
        <ul className="list-disc space-y-2 pl-5 font-medium text-white/90">
          {highlights.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </div>

      {facts.length > 0 && (
        <aside className="border-t border-white/20 pt-6 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <h3 className="font-bold text-yellow">Thông tin thực tế</h3>
          <dl className="mt-4 grid gap-4">
            {facts.map((fact) => (
              <div key={fact.label} className="min-w-0">
                <dt className="text-xs font-semibold uppercase tracking-wide text-white/65">
                  {fact.label}
                </dt>
                <dd className="mt-1 break-words font-medium leading-relaxed text-white/90">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </aside>
      )}
    </div>
  );
}
