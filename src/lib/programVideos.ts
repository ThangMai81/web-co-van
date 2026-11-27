/** Video minh họa có sẵn trong /public/videos cho từng chương trình (theo slug). */
export type ProgramLocalVideo = { src: string; poster: string; title: string };

export const PROGRAM_VIDEOS: Record<string, ProgramLocalVideo> = {
  "chinh-phuc-fansipan-noc-nha-dong-duong": {
    // ?v=: đổi số khi thay file để trình duyệt không dùng bản cũ đã lưu (cache 7 ngày)
    src: "/videos/chuong-trinh-fansipan.mp4?v=3",
    poster: "/images/programs/video-fansipan-poster.jpg?v=2",
    title: "Video giới thiệu hành trình Chinh Phục Fansipan",
  },
  "kinabalu-gap-go-chinh-minh": {
    src: "/videos/chuong-trinh-kinabalu.mp4?v=3",
    poster: "/images/programs/video-kinabalu-poster.jpg?v=2",
    title: "Video giới thiệu hành trình Kinabalu - Gặp Gỡ Chính Mình",
  },
  "trai-he-khai-tam-2027": {
    src: "/videos/chuong-trinh-trai-he-khai-tam.mp4",
    poster: "/images/programs/video-trai-he-poster.jpg",
    title: "Video giới thiệu Trại Hè Khai Tâm",
  },
  "workshop-khai-phong-noi-tam": {
    src: "/videos/chuong-trinh-workshop-khai-phong.mp4",
    poster: "/images/programs/video-workshop-poster.jpg",
    title: "Video giới thiệu Workshop Khai Phóng Nội Tâm",
  },
  "off-chua-lanh-thang-6": {
    src: "/videos/chuong-trinh-off-chua-lanh.mp4?v=3",
    poster: "/images/programs/video-off-chua-lanh-poster.jpg?v=4",
    title: "Video giới thiệu buổi Off Chữa Lành",
  },
};

/** Link video thật (bỏ qua link tạm kiểu "placeholder-..." trong dữ liệu mẫu). */
export function realVideoUrl(url?: string): string | undefined {
  const value = url?.trim();
  if (!value || /placeholder/i.test(value)) return undefined;
  return value;
}
