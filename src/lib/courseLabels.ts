export const COURSE_CATEGORY_LABELS: Record<string, string> = {
  coach: "Coach",
  "chua-lanh": "Chữa lành",
  "tre-em": "Trẻ em",
};

export function formatVND(value: number) {
  return value.toLocaleString("vi-VN");
}
