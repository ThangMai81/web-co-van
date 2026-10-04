import { ArrowRight } from "@/lib/icons";

// Dùng bên trong 1 phần tử cha có class "group" (thường là <Link>).
// Underline giãn từ 0 -> full khi hover cha, giống hiệu ứng NAV_LINKS ở SiteHeader.
export default function ViewDetailLabel({
  label = "XEM CHI TIẾT",
}: {
  label?: string;
}) {
  return (
    <span className="inline-flex w-fit items-center gap-1 text-sm font-bold text-blue transition-colors group-hover:text-yellow">
      <span className="relative">
        {label}
        <span className="absolute -bottom-0.5 left-0 h-[2px] w-0 bg-yellow transition-all duration-300 group-hover:w-full" />
      </span>
      <ArrowRight
        size={14}
        className="transition-transform duration-300 group-hover:translate-x-1"
      />
    </span>
  );
}
