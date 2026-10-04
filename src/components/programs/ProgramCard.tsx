import Image from "next/image";
import Link from "next/link";
import { CATEGORY_LABELS, STATUS_LABELS } from "@/lib/programLabels";
import { Calendar, MapPin } from "@/lib/icons";
import CategoryIcon from "./CategoryIcon";
import ViewDetailLabel from "@/components/ui/ViewDetailLabel";
import type { Program } from "@/types/program";

export default function ProgramCard({ program }: { program: Program }) {
  const isPast = program.status === "past";

  return (
    <Link
      href={`/programs/${program.slug}`}
      scroll={false}
      className={`group flex h-full flex-col overflow-hidden rounded-xl border shadow-sm transition hover:shadow-md ${
        isPast
          ? "border-blue/10 bg-white shadow-blue/5 hover:shadow-blue/10"
          : "border-2 border-yellow bg-blue/5 shadow-blue/5 hover:shadow-blue/10"
      }`}
    >
      <div className="relative h-44 w-full shrink-0 bg-blue/10">
        {program.coverImage && (
          <Image
            src={program.coverImage}
            alt={program.title}
            fill
            className={`object-cover ${isPast ? "grayscale-[35%]" : ""}`}
          />
        )}
        <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-yellow px-3 py-1 text-xs font-bold text-blue">
          <CategoryIcon category={program.category} size={14} />
          {CATEGORY_LABELS[program.category]}
        </span>
        <span
          className={`absolute right-3 top-3 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
            isPast ? "bg-white/90 text-blue" : "bg-blue text-white"
          }`}
        >
          {!isPast && (
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-yellow" />
          )}
          {STATUS_LABELS[program.status]}
        </span>
      </div>

      {/* flex-1 để phần nội dung luôn lấp đầy chiều cao còn lại của card */}
      <div className="flex flex-1 flex-col gap-2 p-5">
        {/* min-h ép tiêu đề luôn chiếm đúng 2 dòng dù ngắn hay dài -> mọi card bắt đầu cùng 1 điểm */}
        <h3 className="line-clamp-2 min-h-[3.5rem] text-lg font-bold text-blue">
          {program.title}
        </h3>

        {program.location && (
          <p className="line-clamp-1 flex items-center gap-2 text-sm font-medium text-blue/80">
            <MapPin size={15} className="shrink-0" /> {program.location}
          </p>
        )}
        <p className="line-clamp-1 flex items-center gap-2 text-sm font-medium text-blue/80">
          <Calendar size={15} className="shrink-0" /> {program.schedule}
        </p>

        {program.registration?.isOpen && (
          <span className="mt-1 w-fit rounded-full border border-blue/20 bg-white px-3 py-1 text-xs font-bold text-blue">
            {program.registration.price && program.registration.price > 0
              ? `${program.registration.price.toLocaleString("vi-VN")} VNĐ`
              : "Miễn phí"}
          </span>
        )}

        {/* mt-auto ép luôn dính đáy card, bất kể phía trên dài hay ngắn */}
        <div className="mt-auto pt-2">
          <ViewDetailLabel />
        </div>
      </div>
    </Link>
  );
}
