import type { ProgramCategory, ProgramStatus } from "@/types/program";

export const CATEGORY_LABELS: Record<ProgramCategory, string> = {
  "trai-he": "Trại hè",
  "leo-nui": "Leo núi",
  workshop: "Workshop",
  "off-chua-lanh": "Off chữa lành",
};

export const STATUS_LABELS: Record<ProgramStatus, string> = {
  upcoming: "Sắp diễn ra",
  past: "Đã diễn ra",
};

export function formatVND(value: number) {
  return value.toLocaleString("vi-VN");
}

export function toYoutubeEmbedUrl(url: string): string | null {
  const watchMatch = url.match(/youtube\.com\/watch\?v=([\w-]+)/);
  const shortMatch = url.match(/youtu\.be\/([\w-]+)/);
  const id = watchMatch?.[1] || shortMatch?.[1];
  return id ? `https://www.youtube.com/embed/${id}` : null;
}
