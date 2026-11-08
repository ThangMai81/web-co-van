import { notFound } from "next/navigation";
import ProgramHero from "./ProgramHero";
import ProgramVideo from "./ProgramVideo";
import ProgramStats from "./ProgramStats";
import ProgramHighlights from "./ProgramHighlights";
import ProgramGallery from "./ProgramGallery";
import ProgramRegistration from "./ProgramRegistration";
import type { Program } from "@/types/program";
import { fetchDetailRouteData } from "@/lib/detailRouteFetch";
import { SiteHeader } from "@/components/navigation/SiteHeader";
import { DetailSectionNav } from "@/components/navigation/DetailSectionNav";
import { DetailRouteScrollReset } from "@/components/navigation/DetailRouteScrollReset";
import { SiteFooter } from "@/components/home-page/SiteFooter";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isProgramDetailData(value: unknown): value is Program {
  if (!isRecord(value)) return false;

  const validStats =
    Array.isArray(value.stats) &&
    value.stats.every(
      (stat) =>
        isRecord(stat) &&
        typeof stat.label === "string" &&
        typeof stat.value === "string",
    );
  const registration = value.registration;
  const validRegistration =
    registration === undefined ||
    (isRecord(registration) && typeof registration.isOpen === "boolean");

  return (
    typeof value._id === "string" &&
    typeof value.title === "string" &&
    typeof value.slug === "string" &&
    (value.category === "trai-he" ||
      value.category === "leo-nui" ||
      value.category === "workshop" ||
      value.category === "off-chua-lanh") &&
    (value.status === "upcoming" || value.status === "past") &&
    (value.format === "online" || value.format === "offline") &&
    typeof value.schedule === "string" &&
    typeof value.description === "string" &&
    typeof value.featured === "boolean" &&
    isStringArray(value.highlights) &&
    isStringArray(value.gallery) &&
    validStats &&
    validRegistration &&
    (value.coverImage === undefined || typeof value.coverImage === "string") &&
    (value.videoUrl === undefined || typeof value.videoUrl === "string")
  );
}

async function getProgram(slug: string): Promise<Program | null> {
  return fetchDetailRouteData(
    (process.env.NEXT_PUBLIC_API_URL ?? "") + "/api/programs/" + slug,
    isProgramDetailData,
  );
}

export default async function ProgramDetailPage({ slug }: { slug: string }) {
  const program = await getProgram(slug);
  if (!program) notFound();
  const coverImage = !program.coverImage || program.coverImage.includes("res.cloudinary.com/demo")
    ? program.category === "leo-nui"
      ? "/images/first_banner.jpg"
      : "/images/Sunshine_banner.jpg"
    : program.coverImage;
  const displayProgram = { ...program, coverImage };
  const videoUrl = program.videoUrl?.trim() || undefined;
  const description = program.description.trim();
  const stats = program.stats.filter(
    (stat) => stat.label.trim() && stat.value.trim(),
  );
  const highlights = program.highlights.filter((highlight) => highlight.trim());
  const galleryImages = program.gallery.filter((image) => image.trim());
  const hasRegistration = program.registration?.isOpen === true;
  const sectionItems = [
    ...(videoUrl ? [{ id: "program-video", label: "Video" }] : []),
    ...(hasRegistration
      ? [{ id: "program-registration", label: "Đăng ký" }]
      : []),
    ...(description ? [{ id: "program-description", label: "Giới thiệu" }] : []),
    ...(stats.length > 0
      ? [{ id: "program-stats", label: "Thông tin" }]
      : []),
    ...(highlights.length > 0
      ? [{ id: "program-highlights", label: "Điểm nổi bật" }]
      : []),
    ...(galleryImages.length > 0
      ? [{ id: "program-gallery", label: "Thư viện ảnh" }]
      : []),
  ];

  return (
    <div className="min-h-svh bg-white">
      <DetailRouteScrollReset />
      <SiteHeader />
      <main className="route-detail-enter">
        <ProgramHero
          program={displayProgram}
          viewerEnabled={slug !== "chinh-phuc-fansipan-noc-nha-dong-duong"}
        />

        <div className="mx-auto max-w-[var(--page-w)] px-6 pb-10">
          <DetailSectionNav
            items={sectionItems}
            label="Điều hướng nội dung chương trình"
          />

          <div className="mx-auto max-w-4xl">
            {videoUrl && (
              <div id="program-video" className="scroll-mt-28 md:scroll-mt-32">
                <ProgramVideo url={videoUrl} />
              </div>
            )}

            {hasRegistration && program.registration && (
              <div
                id="program-registration"
                className="scroll-mt-28 md:scroll-mt-32"
              >
                <ProgramRegistration
                  registration={program.registration}
                  image={coverImage}
                  title={program.title}
                  hideRepeatedImage={slug === "workshop-khai-phong-noi-tam"}
                />
              </div>
            )}

            {description && (
              <section
                id="program-description"
                aria-labelledby="program-description-heading"
                className="mt-8 scroll-mt-28 md:scroll-mt-32"
              >
                <h2
                  id="program-description-heading"
                  className="mb-3 text-xl font-bold text-blue"
                >
                  Giới thiệu
                </h2>
                <p className="text-lg font-medium leading-relaxed text-blue/90">
                  {description}
                </p>
              </section>
            )}

            {stats.length > 0 && (
              <section
                id="program-stats"
                aria-labelledby="program-stats-heading"
                className="mt-8 scroll-mt-28 md:scroll-mt-32"
              >
                <h2
                  id="program-stats-heading"
                  className="mb-3 text-xl font-bold text-blue"
                >
                  Thông tin chương trình
                </h2>
                <ProgramStats stats={stats} />
              </section>
            )}

            {highlights.length > 0 && (
              <div
                id="program-highlights"
                className="scroll-mt-28 md:scroll-mt-32"
              >
                <ProgramHighlights highlights={highlights} />
              </div>
            )}

            {galleryImages.length > 0 && (
              <div
                id="program-gallery"
                className="scroll-mt-28 md:scroll-mt-32"
              >
                <ProgramGallery
                  key={slug}
                  programTitle={program.title}
                  images={galleryImages}
                  revealAccent={slug === "chinh-phuc-fansipan-noc-nha-dong-duong"}
                  revealEntries={slug !== "chinh-phuc-fansipan-noc-nha-dong-duong"}
                />
              </div>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
