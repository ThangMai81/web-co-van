import { notFound } from "next/navigation";
import ProgramHero from "./ProgramHero";
import ProgramVideo from "./ProgramVideo";
import ProgramStats from "./ProgramStats";
import ProgramHighlights from "./ProgramHighlights";
import ProgramGallery from "./ProgramGallery";
import ProgramRegistration from "./ProgramRegistration";
import type { Program } from "@/types/program";

async function getProgram(slug: string): Promise<Program | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/programs/${slug}`,
    {
      cache: "no-store",
    },
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Không thể tải chương trình");
  const json = await res.json();
  return json.data as Program;
}

export default async function ProgramDetailPage({ slug }: { slug: string }) {
  const program = await getProgram(slug);
  if (!program) notFound();

  return (
    <div className="min-h-svh bg-white">
      <ProgramHero program={program} />

      <div className="mx-auto max-w-4xl px-6 py-10">
        {program.videoUrl && <ProgramVideo url={program.videoUrl} />}

        <p className="mt-8 text-center text-lg font-medium leading-relaxed text-blue/90">
          {program.description}
        </p>

        {program.stats.length > 0 && <ProgramStats stats={program.stats} />}

        {program.registration?.isOpen && (
          <ProgramRegistration registration={program.registration} />
        )}

        {program.highlights.length > 0 && (
          <ProgramHighlights highlights={program.highlights} />
        )}

        {program.gallery.length > 0 && (
          <ProgramGallery images={program.gallery} />
        )}
      </div>
    </div>
  );
}
