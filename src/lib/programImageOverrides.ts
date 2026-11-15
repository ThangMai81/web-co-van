import type { Program } from "@/types/program";

type ProgramImageOverride = {
  card: string;
  cover: string;
  gallery: string[];
};

const PROGRAM_IMAGE_OVERRIDES: Record<string, ProgramImageOverride> = {
  "workshop-khai-phong-noi-tam": {
    card: "/images/programs/community/workshop-online-zoom-speakers-card-2x1.jpg",
    cover: "/images/programs/community/workshop-online-zoom-speakers-cover-4x3.jpg",
    gallery: [
      "/images/programs/community/workshop-online-zoom-participants-a-gallery-4x3.jpg",
      "/images/programs/community/workshop-online-zoom-participants-b-gallery-4x3.jpg",
    ],
  },
  "trai-he-khai-tam-2027": {
    card: "/images/programs/community/trai-he-suoi-doi-nhom-card-2x1.jpg",
    cover: "/images/programs/community/trai-he-suoi-doi-nhom-cover-4x3.jpg",
    gallery: ["/images/programs/community/trai-he-tam-suoi-gallery-4x3.jpg"],
  },
  "chinh-phuc-fansipan-noc-nha-dong-duong": {
    card: "/images/programs/community/fansipan-doan-dong-co-card-2x1.jpg",
    cover: "/images/programs/community/fansipan-doan-dong-co-cover-4x3.jpg",
    gallery: [
      "/images/programs/community/fansipan-doan-nghi-rung-gallery-4x3.jpg",
      "/images/programs/community/fansipan-doan-chum-tay-gallery-4x3.jpg",
      "/images/programs/community/fansipan-coach-yen-gallery-4x3.jpg",
    ],
  },
};

type ProgramImageFields = Pick<
  Program,
  "slug" | "category" | "coverImage" | "gallery"
>;

export function getProgramCoverImage(program: ProgramImageFields): string {
  const localOverride = PROGRAM_IMAGE_OVERRIDES[program.slug];
  if (localOverride) return localOverride.cover;

  if (!program.coverImage || program.coverImage.includes("res.cloudinary.com/demo")) {
    return program.category === "leo-nui"
      ? "/images/first_banner.jpg"
      : "/images/Sunshine_banner.jpg";
  }

  return program.coverImage;
}

export function getProgramCardImage(program: ProgramImageFields): string {
  return PROGRAM_IMAGE_OVERRIDES[program.slug]?.card ?? getProgramCoverImage(program);
}

export function getProgramGalleryImages(program: ProgramImageFields): string[] {
  return (PROGRAM_IMAGE_OVERRIDES[program.slug]?.gallery ?? program.gallery).filter(
    (image) => image.trim(),
  );
}
