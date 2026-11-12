import { GraduationCap, MessageCircle, Phone } from "lucide-react";
import { ClosingPaths } from "@/components/ui/ClosingPaths";

export function CourseClosingCTA() {
  return (
    <ClosingPaths
      id="course-closing-heading"
      icon={GraduationCap}
      title="Bước tiếp theo trên hành trình học"
      lead="Chưa chắc khóa nào hợp với mình? Chọn một cách bên dưới — đội ngũ Sunshine Center sẽ gợi ý cùng bạn."
      paths={[
        {
          icon: GraduationCap,
          title: "Xem tất cả khóa học",
          desc: "Coach, chữa lành và các khóa dành riêng cho trẻ em.",
          href: "/courses",
        },
        {
          icon: MessageCircle,
          title: "Gửi câu hỏi",
          desc: "Kể mong muốn của bạn, đội ngũ sẽ gợi ý khóa học phù hợp.",
          href: "/#lien-he",
        },
        {
          icon: Phone,
          title: "Gọi 0935 626 186",
          desc: "Hỏi trực tiếp về lịch học, hình thức và cách đăng ký.",
          href: "tel:0935626186",
          external: true,
        },
      ]}
    />
  );
}
