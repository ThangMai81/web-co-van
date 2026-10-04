export default function ProgramHighlights({
  highlights,
}: {
  highlights: string[];
}) {
  return (
    <div className="mt-8 rounded-xl border border-blue/15 bg-white p-6">
      <h2 className="mb-3 font-bold text-blue">✨ Điểm nổi bật</h2>
      <ul className="list-disc space-y-2 pl-5 font-medium text-blue/90">
        {highlights.map((item, idx) => (
          <li key={idx}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
