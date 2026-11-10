import { notFound } from "next/navigation";
import ProgramHero from "./ProgramHero";
import ProgramVideo from "./ProgramVideo";
import ProgramHighlights from "./ProgramHighlights";
import ProgramGallery from "./ProgramGallery";
import ProgramRegistration from "./ProgramRegistration";
import type { Program } from "@/types/program";
import { fetchDetailRouteData } from "@/lib/detailRouteFetch";
import { SiteHeader } from "@/components/navigation/SiteHeader";
import { ReadingProgress } from "@/components/navigation/ReadingProgress";
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
  const hasHighlights = highlights.length > 0;
  const hasStats = stats.length > 0;
  const hasStructuredContent = hasHighlights || hasStats;
  const hasGallery = galleryImages.length > 0;
  const hasRegistration = program.registration?.isOpen === true;
  const contactPhone = program.registration?.contactPhone;
  const contactPhoneForGuide =
    hasRegistration &&
    typeof contactPhone === "string" &&
    contactPhone.trim().length > 0
      ? contactPhone.trim()
      : undefined;
  const hasInformationSections = Boolean(
    videoUrl || hasRegistration || description,
  );
  const sectionItems = [
    ...(videoUrl ? [{ id: "program-video", label: "Video" }] : []),
    ...(hasRegistration
      ? [{ id: "program-registration", label: "Đăng ký" }]
      : []),
    ...(description ? [{ id: "program-description", label: "Giới thiệu" }] : []),
    ...(highlights.length > 0
      ? [{ id: "program-highlights", label: "Điểm nổi bật" }]
      : []),
    ...(stats.length > 0
      ? [{ id: "program-stats", label: "Thông tin" }]
      : []),
    ...(galleryImages.length > 0
      ? [{ id: "program-gallery", label: "Thư viện ảnh" }]
      : []),
  ];

  return (
    <div className="min-h-svh bg-white">
      <DetailRouteScrollReset />
      <SiteHeader />
      <ReadingProgress />
      <main className="route-detail-enter">
        <ProgramHero
          program={displayProgram}
          viewerEnabled={slug !== "chinh-phuc-fansipan-noc-nha-dong-duong"}
        />

        {hasInformationSections && (
          <section className="bg-[#edf5fb]">
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
                    <div className="relative overflow-hidden rounded-3xl border border-blue/10 bg-white p-7 shadow-xl shadow-blue/5 md:p-10">
                      <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-yellow to-yellow/20" />
                      <svg aria-hidden="true" viewBox="0 0 120 96" className="pointer-events-none absolute right-6 top-6 h-16 w-20 text-yellow/15">
                        <path fill="currentColor" d="M0 96V58C0 26 15 7 46 0l6 13C35 19 27 30 26 48h22v48H0Zm66 0V58C66 26 81 7 112 0l6 13c-17 6-25 17-26 35h22v48H66Z" />
                      </svg>
                      <h2
                        id="program-description-heading"
                        className="mb-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-blue/55"
                      >
                        Giới thiệu chương trình
                      </h2>
                      <p className="relative max-w-[62ch] font-display text-xl font-medium leading-relaxed text-blue md:text-2xl md:leading-relaxed">
                        {description}
                      </p>
                    </div>
                  </section>
                )}

              </div>
            </div>
          </section>
        )}

        {hasStructuredContent && (
          <section className="bg-blue text-white">
            <div
              className={`mx-auto max-w-[var(--page-w)] px-6 pb-12 ${
                hasInformationSections ? "pt-8" : "pt-2"
              }`}
            >
              {!hasInformationSections && (
                <DetailSectionNav
                  items={sectionItems}
                  label="Điều hướng nội dung chương trình"
                />
              )}
              <ProgramHighlights
                highlights={highlights}
                stats={stats}
                contactPhone={contactPhoneForGuide}
              />
            </div>
          </section>
        )}

        {hasGallery && (
          <section className="bg-[#edf5fb]">
            <div
              className={`mx-auto max-w-[var(--page-w)] px-6 pb-12 ${
                hasInformationSections || hasStructuredContent ? "pt-8" : "pt-2"
              }`}
            >
              {!hasInformationSections && !hasStructuredContent && (
                <DetailSectionNav
                  items={sectionItems}
                  label="Điều hướng nội dung chương trình"
                />
              )}
              <div
                id="program-gallery"
                className="mx-auto max-w-4xl scroll-mt-28 md:scroll-mt-32"
              >
                <ProgramGallery
                  key={slug}
                  programTitle={program.title}
                  images={galleryImages}
                  revealAccent={slug === "chinh-phuc-fansipan-noc-nha-dong-duong"}
                  revealEntries={slug !== "chinh-phuc-fansipan-noc-nha-dong-duong"}
                />
              </div>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
