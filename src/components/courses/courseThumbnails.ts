type CourseImageIdentity = {
  slug: string;
  title: string;
  thumbnail?: string;
};

const COURSE_THUMBNAILS: Array<{ match: RegExp; src: string }> = [
  { match: /coach-thuc-chien/, src: "/images/Khoa-coach-thuc-chien.jpg" },
  { match: /khai-tam-dinh-vi/, src: "/images/khai-tam-dinh-vi.jpg" },
  { match: /khai-phong-ban-than/, src: "/images/khai-phong-ban-than.jpg" },
  { match: /after-kien-thuc/, src: "/images/khoa-after-kien-thuc.jpg" },
  { match: /khai-van/, src: "/images/khoa-hoc-khai-van.jpg" },
];

function getCourseImageIdentity(course: CourseImageIdentity) {
  return `${course.slug} ${course.title}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-");
}

export function getCourseThumbnailFallback(course: CourseImageIdentity) {
  const identity = getCourseImageIdentity(course);
  return COURSE_THUMBNAILS.find(({ match }) => match.test(identity))?.src;
}

export function getCourseThumbnail(course: CourseImageIdentity) {
  return getCourseThumbnailFallback(course) ?? course.thumbnail;
}
