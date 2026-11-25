/**
 * Ảnh thật + poster chính thức cho phần "Hình ảnh khóa học" ở trang chi tiết.
 * Kích thước khai báo đúng file gốc để lưới hiển thị theo tỉ lệ thật (không cắt chữ poster).
 * Không dùng ảnh minh họa tạo bằng AI.
 */
export type CourseGalleryItem = {
  src: string;
  alt: string;
  width: number;
  height: number;
  kind: "photo" | "poster";
};

const P = {
  khaiTamPoster: { src: "/images/khai-tam-dinh-vi.jpg", alt: "Poster chính thức khóa Khai Tâm Định Vị: lịch học, đối tượng và nội dung", width: 768, height: 1376, kind: "poster" },
  coachPoster: { src: "/images/Khoa-coach-thuc-chien.jpg", alt: "Poster chính thức Khóa Coach Thực Chiến: lịch học và quyền lợi học viên", width: 896, height: 1200, kind: "poster" },
  khaiPhongPoster: { src: "/images/khai-phong-ban-than.jpg", alt: "Poster chính thức Khóa học Khai Phóng Bản Thân: thời gian và nội dung", width: 896, height: 1200, kind: "poster" },
  khaiVanPoster: { src: "/images/khoa-hoc-khai-van.jpg", alt: "Poster chính thức Khóa học Khai Vấn - Đánh thức mặt trời bên trong bạn", width: 1920, height: 1080, kind: "poster" },
  afterPoster: { src: "/images/khoa-after-kien-thuc.jpg", alt: "Poster chính thức Khóa After Kiến Thức - Coach chữa lành & Coach nâng tầm", width: 896, height: 1195, kind: "poster" },
  cungTre: { src: "/images/courses/khai-tam-dinh-vi-co-yen-cung-tre-4x3.jpg", alt: "Coach Yến Lê cùng các bạn nhỏ trong hoạt động ngoài trời", width: 1280, height: 960, kind: "photo" },
  vanPhong: { src: "/images/courses/khai-tam-dinh-vi-co-yen-ao-dai-do.jpg", alt: "Coach Yến Lê tại phòng làm việc của Sunshine Center", width: 1536, height: 2048, kind: "photo" },
  vietBang: { src: "/images/courses/hero-co-yen-viet-bang-16x10.jpg", alt: "Coach Yến Lê giảng bài bên bảng Bánh xe cuộc đời", width: 1280, height: 800, kind: "photo" },
  huongDuong: { src: "/images/courses/hero-co-yen-tranh-huong-duong-1x1.jpg", alt: "Coach Yến Lê bên bức tranh hoa hướng dương tại Sunshine Center", width: 900, height: 900, kind: "photo" },
} satisfies Record<string, CourseGalleryItem>;

const GALLERIES: Array<{ match: RegExp; items: CourseGalleryItem[] }> = [
  { match: /khai-tam-dinh-vi/, items: [P.cungTre, P.khaiTamPoster, P.vietBang, P.vanPhong] },
  { match: /coach-thuc-chien/, items: [P.coachPoster, P.huongDuong, P.vietBang] },
  { match: /khai-phong-ban-than/, items: [P.khaiPhongPoster, P.vanPhong, P.huongDuong] },
  { match: /khai-van/, items: [P.khaiVanPoster, P.huongDuong, P.vanPhong] },
  { match: /after-kien-thuc/, items: [P.afterPoster, P.vietBang, P.vanPhong] },
];

function identity(slug: string, title: string) {
  return `${slug} ${title}`
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-");
}

export function getCourseGallery(slug: string, title: string): CourseGalleryItem[] {
  const id = identity(slug, title);
  return GALLERIES.find(({ match }) => match.test(id))?.items ?? [];
}
