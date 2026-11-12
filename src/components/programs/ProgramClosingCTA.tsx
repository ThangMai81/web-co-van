import { Compass, MessageCircle, Phone } from "lucide-react";
import { ClosingPaths } from "@/components/ui/ClosingPaths";

export function ProgramClosingCTA() {
  return (
    <ClosingPaths
      id="program-closing-heading"
      icon={Compass}
      title="Hành trình tiếp theo đang chờ bạn"
      lead="Chọn một bước nhỏ để bắt đầu — đội ngũ Sunshine Center luôn sẵn sàng đồng hành cùng bạn."
      paths={[
        {
          icon: Compass,
          title: "Xem thêm chương trình",
          desc: "Trại hè, leo núi, workshop và những buổi off chữa lành.",
          href: "/programs",
        },
        {
          icon: MessageCircle,
          title: "Gửi câu hỏi",
          desc: "Để lại lời nhắn, đội ngũ sẽ lắng nghe và gợi ý hướng phù hợp.",
          href: "/#lien-he",
        },
        {
          icon: Phone,
          title: "Gọi 0935 626 186",
          desc: "Trao đổi trực tiếp về lịch trình, chỗ còn trống và cách đăng ký.",
          href: "tel:0935626186",
          external: true,
        },
      ]}
    />
  );
}
