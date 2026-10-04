import { GraduationCap, HeartHandshake, Baby } from "@/lib/icons";

const ICONS: Record<string, typeof GraduationCap> = {
  coach: GraduationCap,
  "chua-lanh": HeartHandshake,
  "tre-em": Baby,
};

export default function CourseCategoryIcon({
  category,
  size = 16,
  className,
}: {
  category: string;
  size?: number;
  className?: string;
}) {
  const Icon = ICONS[category] || GraduationCap;
  return <Icon size={size} className={className} />;
}
