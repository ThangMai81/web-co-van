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
      "/images/programs/community/workshop-online-zoom-participants-c-gallery-4x3.jpg",
    ],
  },
  // Ảnh thật nhóm thiếu nhi tại trại hè (Drive WEBSITE/1. Trại hè (bìa ngoài)).
  // Ảnh suối trước đây là chuyến Off chữa lành của người lớn nên đã chuyển sang mục đó.
  "trai-he-khai-tam-2027": {
    card: "/images/programs/community/trai-he-thieu-nhi-card-2x1.jpg",
    cover: "/images/programs/community/trai-he-thieu-nhi-cover-4x3.jpg",
    gallery: [
      "/images/programs/community/trai-he-tro-choi-doan-doi-gallery-4x3.jpg",
      "/images/programs/community/trai-he-co-yen-cung-cac-ban-gallery-4x3.jpg",
      "/images/programs/community/trai-he-nhom-vuot-rung-gallery-4x3.jpg",
      "/images/programs/community/trai-he-co-yen-bien-may-gallery-4x3.jpg",
    ],
  },
  // Drive WEBSITE/1. Off chữa lành (bìa ngoài): cả nhóm đứng giữa suối.
  "off-chua-lanh-thang-10": {
    card: "/images/programs/community/off-chua-lanh-doan-suoi-card-2x1.jpg",
    cover: "/images/programs/community/off-chua-lanh-doan-suoi-cover-4x3.jpg",
    gallery: [
      "/images/programs/community/off-chua-lanh-vong-tron-chia-se-gallery-4x3.jpg",
      "/images/programs/community/off-chua-lanh-cheo-sup-gallery-4x3.jpg",
      "/images/programs/community/off-chua-lanh-doan-bai-bien-gallery-4x3.jpg",
    ],
  },
  // Chuyến đã diễn ra: ảnh tắm suối (Facebook) làm bìa để khác thẻ tháng 10; ảnh nhóm vào thư viện.
  "off-chua-lanh-thang-6": {
    card: "/images/programs/community/off-chua-lanh-tam-suoi-card-2x1.jpg",
    cover: "/images/programs/community/off-chua-lanh-tam-suoi-cover-4x3.jpg",
    gallery: ["/images/programs/community/off-chua-lanh-doan-suoi-cover-4x3.jpg"],
  },
  // Drive WEBSITE/1. Leo kinabalu (bìa ngoài): đoàn trên đỉnh; thư viện thêm ảnh đoàn
  // mặc áo "Borneo Calling · Mount Kinabalu" tại sân bay Malaysia.
  "kinabalu-gap-go-chinh-minh": {
    card: "/images/programs/community/kinabalu-doan-dinh-card-2x1.jpg",
    cover: "/images/programs/community/kinabalu-doan-dinh-cover-4x3.jpg",
    gallery: [
      "/images/programs/community/kinabalu-vuot-vach-da-gallery-4x3.jpg",
      "/images/programs/community/kinabalu-doan-cot-moc-dinh-gallery-4x3.jpg",
      "/images/programs/community/kinabalu-nghi-tren-da-gallery-4x3.jpg",
      "/images/programs/community/kinabalu-doan-san-bay-gallery-4x3.jpg",
    ],
  },
  "chinh-phuc-fansipan-noc-nha-dong-duong": {
    card: "/images/programs/community/fansipan-doan-dong-co-card-2x1.jpg",
    cover: "/images/programs/community/fansipan-doan-dong-co-cover-4x3.jpg",
    gallery: [
      "/images/programs/community/fansipan-doan-nghi-rung-gallery-4x3.jpg",
      "/images/programs/community/fansipan-doan-chum-tay-gallery-4x3.jpg",
      "/images/programs/community/fansipan-coach-yen-gallery-4x3.jpg",
      "/images/programs/community/fansipan-hoc-vien-tren-song-nui-gallery-4x3.jpg",
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
  const cover = getProgramCoverImage(program);
  const seen = new Set<string>([cover]);
  const images: string[] = [];
  for (const raw of PROGRAM_IMAGE_OVERRIDES[program.slug]?.gallery ?? program.gallery) {
    const image = raw.trim();
    if (!image || seen.has(image) || image.includes("res.cloudinary.com/demo")) continue;
    seen.add(image);
    images.push(image);
  }
  return images.slice(0, 4);
}
