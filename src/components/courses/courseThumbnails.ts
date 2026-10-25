type CourseImageIdentity = {
  slug: string;
  title: string;
  thumbnail?: string;
};

const COURSE_THUMBNAILS: Array<{
  match: RegExp;
  src: string;
  width: number;
  height: number;
}> = [
  {
    match: /coach-thuc-chien/,
    src: "/images/Khoa-coach-thuc-chien.jpg",
    width: 896,
    height: 1200,
  },
  {
    match: /khai-tam-dinh-vi/,
    src: "/images/khai-tam-dinh-vi.jpg",
    width: 768,
    height: 1376,
  },
  {
    match: /khai-phong-ban-than/,
    src: "/images/khai-phong-ban-than.jpg",
    width: 896,
    height: 1200,
  },
  {
    match: /after-kien-thuc/,
    src: "/images/khoa-after-kien-thuc.jpg",
    width: 896,
    height: 1195,
  },
  {
    match: /khai-van/,
    src: "/images/khoa-hoc-khai-van.jpg",
    width: 1920,
    height: 1080,
  },
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

export function getCourseThumbnailAspectRatio(course: CourseImageIdentity) {
  const identity = getCourseImageIdentity(course);
  const thumbnail = COURSE_THUMBNAILS.find(({ match }) => match.test(identity));
  return thumbnail ? `${thumbnail.width} / ${thumbnail.height}` : "3 / 4";
}

export function getCourseThumbnail(course: CourseImageIdentity) {
  return getCourseThumbnailFallback(course) ?? course.thumbnail;
}
