import { Tent, Mountain, Lightbulb, HeartHandshake } from "@/lib/icons";
import type { ProgramCategory } from "@/types/program";

const ICONS = {
  "trai-he": Tent,
  "leo-nui": Mountain,
  workshop: Lightbulb,
  "off-chua-lanh": HeartHandshake,
} as const;

export default function CategoryIcon({
  category,
  size = 16,
  className,
}: {
  category: ProgramCategory;
  size?: number;
  className?: string;
}) {
  const Icon = ICONS[category];
  return <Icon size={size} className={className} />;
}
