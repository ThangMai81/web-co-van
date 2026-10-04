export interface Course {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  schedule?: string;
  format: string;
  targetAudience?: string;
  highlights: string[];
  slogan?: string;
  contact?: { name?: string; phone?: string; fanpage?: string };
}

export interface Lesson {
  title: string;
  format: "online" | "offline";
  scheduledAt?: string;
  durationHours?: number;
}

export interface Chapter {
  title: string;
  lessons: Lesson[];
}

export interface CourseDetail {
  category?: string;
  thumbnail?: string;
  videoUrl?: string;
  instructor?: { name: string; title?: string; avatar?: string };
  price: number;
  originalPrice?: number;
  durationLabel?: string;
  totalDurationLabel?: string;
  descriptionBullets: string[];
  benefits: string[];
  curriculum: Chapter[];
  ratingAverage: number;
  ratingCount: number;
}

export interface Review {
  _id: string;
  user: { name: string; avatarUrl?: string };
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface RatingBreakdownItem {
  star: number;
  count: number;
}

export interface RelatedCourse {
  _id: string;
  title: string;
  slug: string;
  format: string;
  thumbnail?: string;
  price: number;
  instructor?: { name: string };
  ratingAverage: number;
  ratingCount: number;
}

export interface CourseDetailResponse {
  course: Course;
  detail: CourseDetail | null;
  reviews: Review[];
  ratingBreakdown: RatingBreakdownItem[];
  relatedCourses: RelatedCourse[];
}

// Thêm vào cuối file, giữ nguyên toàn bộ phần đã có trước đó
export interface CourseListItem {
  _id: string;
  title: string;
  slug: string;
  slogan?: string;
  schedule: string;
  format: string;
  targetAudience?: string;
  thumbnail?: string;
  category?: string;
  price: number;
  instructor?: { name: string; avatar?: string };
  ratingAverage: number;
  ratingCount: number;
}
