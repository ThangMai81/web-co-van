import { notFound } from "next/navigation";
import ProgramHero from "./ProgramHero";
import ProgramVideo from "./ProgramVideo";
import ProgramHighlights from "./ProgramHighlights";
import ProgramGallery from "./ProgramGallery";
import ProgramRegistration from "./ProgramRegistration";
import { ProgramClosingCTA } from "./ProgramClosingCTA";
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
    <div className="min-h-svh bg-cream">
      <DetailRouteScrollReset />
      <SiteHeader />
      <ReadingProgress />
      <main className="route-detail-enter">
        <ProgramHero
          program={displayProgram}
          viewerEnabled={slug !== "chinh-phuc-fansipan-noc-nha-dong-duong"}
          nextTone={hasInformationSections ? "cream" : hasStructuredContent ? "blue" : "cream"}
        />

        {hasInformationSections && (
          <section id="program-content" className="scroll-mt-24 bg-cream">
            <div className="mx-auto max-w-[var(--page-w)] px-6 pb-14">
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
                    <div className="relative overflow-hidden rounded-[2rem] bg-white px-7 py-9 shadow-[0_30px_60px_-40px_rgb(20_40_80/0.45)] ring-1 ring-blue/5 md:px-12 md:py-12">
                      <span aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-yellow/15 blur-2xl" />
                      <span aria-hidden="true" className="pointer-events-none absolute right-8 top-2 select-none font-editorial text-[9rem] font-bold leading-none text-yellow/25 md:right-12 md:text-[11rem]">
                        &ldquo;
                      </span>
                      <h2
                        id="program-description-heading"
                        className="relative mb-5 flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-blue/55"
                      >
                        <span aria-hidden="true" className="block h-px w-8 bg-yellow" />
                        Giới thiệu chương trình
                      </h2>
                      <p className="relative max-w-[58ch] font-editorial text-[1.2rem] font-semibold leading-[1.55] sm:text-[1.4rem] text-blue first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-editorial first-letter:text-[4.2rem] first-letter:font-bold first-letter:leading-[0.85] first-letter:text-sun md:text-[1.75rem]">
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
          <section className="relative isolate overflow-hidden bg-blue text-white">
            <div aria-hidden="true" className="pointer-events-none absolute -right-40 -top-40 -z-10 h-[28rem] w-[28rem] rounded-full bg-yellow/10 blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(rgb(255_255_255/0.06)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(90deg,transparent_40%,#000)]" />
            <div
              className={`mx-auto max-w-[var(--page-w)] px-6 pb-16 md:pb-20 ${
                hasInformationSections ? "pt-14 md:pt-16" : "pt-2"
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
          <section className="bg-white">
            <div
              className={`mx-auto max-w-[var(--page-w)] px-6 pb-16 ${
                hasInformationSections || hasStructuredContent ? "pt-14 md:pt-16" : "pt-2"
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
        <ProgramClosingCTA />
      </main>
      <SiteFooter />
    </div>
  );
}
