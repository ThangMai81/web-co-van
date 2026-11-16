type CourseImageIdentity = {
  slug: string;
  title: string;
  thumbnail?: string;
};

const COURSE_PHOTOS: Array<{
  match: RegExp;
  src: string;
  alt: string;
}> = [
  {
    match: /khai-tam-dinh-vi/,
    src: "/images/courses/khai-tam-dinh-vi-co-yen-chi-banh-xe-4x3.jpg",
    alt: "Coach Yến Lê mặc áo dài đỏ chỉ vào sơ đồ Bánh xe cuộc đời trên bảng trắng",
  },
  {
    match: /khai-van/,
    src: "/images/courses/khai-van-yen-le-direction.webp",
    alt: "Coach Yến Lê chỉ về phía trước trong hoạt động ngoài trời",
  },
  {
    match: /khai-phong-ban-than/,
    src: "/images/courses/khai-phong-ban-than-yen-le-outdoor.webp",
    alt: "Coach Yến Lê tham gia hoạt động ngoài trời cùng học viên",
  },
  {
    match: /coach-thuc-chien/,
    src: "/images/courses/coach-thuc-chien-lop-hoc-4x3.webp",
    alt: "Coach Yến Lê hướng dẫn học viên thực hành coaching trong lớp",
  },
  {
    match: /after-kien-thuc/,
    src: "/images/courses/after-kien-thuc-co-yen-giang-bai-4x3.webp",
    alt: "Coach Yến Lê mặc áo dài đỏ chia sẻ bên bảng trong lớp học",
  },
];

const COURSE_ILLUSTRATIONS: Array<{ match: RegExp; src: string; alt: string }> = [];

export const COURSE_COVER_ASPECT_RATIO = "4 / 3";

function getCourseImageIdentity(course: CourseImageIdentity) {
  return `${course.slug} ${course.title}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-");
}

function findCoursePhoto(course: CourseImageIdentity) {
  const identity = getCourseImageIdentity(course);
  return COURSE_PHOTOS.find(({ match }) => match.test(identity));
}

function getApiThumbnail(course: CourseImageIdentity) {
  const thumbnail = course.thumbnail?.trim();
  return thumbnail && !thumbnail.includes("res.cloudinary.com/demo")
    ? thumbnail
    : null;
}

/**
 * Ảnh cho hero/khung ảnh trang chi tiết khóa học: poster riêng của khóa học (đã duyệt),
 * sau đó tới ảnh thật từ API. Link Cloudinary "demo" không tồn tại => null (không hiện ảnh)
 * thay vì mượn ảnh của một chuyến đi khác.
 */
export function getCourseDisplayImage(course: CourseImageIdentity): string | null {
  return findCoursePhoto(course)?.src ?? getApiThumbnail(course);
}

export function getCourseDetailIllustration(course: CourseImageIdentity) {
  const identity = getCourseImageIdentity(course);
  const found = COURSE_ILLUSTRATIONS.find(({ match }) => match.test(identity));
  return found ? { src: found.src, alt: found.alt } : null;
}

export function getCourseDisplayAlt(course: CourseImageIdentity): string {
  return findCoursePhoto(course)?.alt ?? `Ảnh giới thiệu ${course.title}`;
}
