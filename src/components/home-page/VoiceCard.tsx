"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronDown, Quote } from "@/lib/icons";

type VoiceCardProps = {
  quote: string;
  who: string;
  image?: string;
  imagePosition?: string;
};

export function VoiceCard({
  quote,
  who,
  image,
  imagePosition = "center",
}: VoiceCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [canExpand, setCanExpand] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  // Chỉ hiện nút "Đọc thêm" khi nội dung thật sự bị cắt bớt.
  // Đo lại khi đổi kích thước màn hình vì số dòng thay đổi theo chiều rộng.
  useEffect(() => {
    const el = textRef.current;
    if (!el || expanded) return;

    const check = () => setCanExpand(el.scrollHeight > el.clientHeight + 1);
    check();

    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [expanded, quote]);

  return (
    <article className="overflow-hidden rounded-xl border border-white/15 bg-white/5">
      {image && (
        <div className="relative aspect-[4/3] w-full">
          <Image
            src={image}
            alt={`Ảnh của ${who}`}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
            style={{ objectPosition: imagePosition }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-blue/90 via-blue/10 to-transparent" />
          <div className="absolute inset-x-5 bottom-4">
            <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-yellow">
              Người chia sẻ
            </div>
            <div className="font-display text-xl font-bold text-white">
              {who}
            </div>
          </div>
        </div>
      )}

      <div className="p-7">
        <Quote size={24} className="mb-3 text-yellow" />

        {/* Nội dung vẫn nằm đủ trong HTML, chỉ bị CSS che bớt khi thu gọn,
            nên người dùng đọc màn hình và Google vẫn đọc được toàn bộ */}
        <p
          ref={textRef}
          className={`font-medium italic leading-relaxed text-white/90 ${
            expanded ? "" : "line-clamp-6"
          }`}
        >
          {quote}
        </p>

        {canExpand && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="mt-4 inline-flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider text-yellow hover:underline"
          >
            {expanded ? "Thu gọn" : "Đọc thêm"}
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${
                expanded ? "rotate-180" : ""
              }`}
            />
          </button>
        )}

        {!image && (
          <div className="mt-5 font-mono text-xs font-bold text-yellow">
            {who}
          </div>
        )}
      </div>
    </article>
  );
}
