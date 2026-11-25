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
    src: "/images/courses/khai-tam-dinh-vi-minh-hoa-4x3.webp",
    alt: "Tranh minh họa: nhân vật ngồi thiền trước Bánh xe cuộc đời và la bàn, tự hỏi mình đang ở đâu",
  },
  {
    match: /khai-van/,
    src: "/images/courses/khoa-hoc-khai-van-minh-hoa-4x3.webp",
    alt: "Tranh minh họa: người đồng hành trò chuyện cùng học viên, mặt trời nhỏ sáng lên trong lòng học viên",
  },
  {
    match: /khai-phong-ban-than/,
    src: "/images/courses/khoa-hoc-khai-phong-ban-than-minh-hoa-4x3.webp",
    alt: "Tranh minh họa: nhân vật dang tay đón bình minh trên đỉnh đồi, biển chỉ đường Tự do và Tự tin",
  },
  {
    match: /coach-thuc-chien/,
    src: "/images/courses/khoa-coach-thuc-chien-minh-hoa-4x3.webp",
    alt: "Tranh minh họa: huấn luyện viên đứng cạnh bảng giấy, học viên thực hành coaching theo cặp",
  },
  {
    match: /after-kien-thuc/,
    src: "/images/courses/khoa-after-kien-thuc-minh-hoa-4x3.webp",
    alt: "Tranh minh họa: hai người tựa vai chữa lành, cây trái tim và bậc thang Thấu hiểu, Chữa lành, Nâng tầm",
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
