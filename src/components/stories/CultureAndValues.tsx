import { Reveal } from "@/components/animation/Reveal";

export function CultureAndValues() {
  return (
    <section className="bg-navy-deep px-6 py-24 text-chalk">
      <div className="mx-auto max-w-[var(--page-w)]">
        <div className="grid gap-12 lg:grid-cols-2">
          <Reveal direction="left">
            <div>
              <div className="mb-4 font-mono text-xs uppercase tracking-widest text-sun">
                Văn hoá
              </div>
              <p className="text-lg text-chalk/85">
                Sunshine phụng sự bằng trái tim có trí tuệ, mỗi thành viên đều
                là một "shipper ánh sáng", với phương châm giúp khách hàng chạm
                vào vùng sáng bên trong họ.
              </p>
            </div>
          </Reveal>

          <Reveal direction="right">
            <div>
              <div className="mb-4 font-mono text-xs uppercase tracking-widest text-sun">
                Giá trị cốt lõi
              </div>
              <p className="mb-4 text-chalk/85">
                Với nhận thức mỗi người là thiên tài của một lĩnh vực nào đó,
                mỗi người là một mặt trời và có khả năng tự toả sáng theo cách
                của chính họ. Sunshine tạo ra một môi trường an toàn nơi mọi
                người có thể tự tin mở cửa trái tim mình để tìm về với chính
                phiên bản sáng nhất bên trong họ.
              </p>
              <p className="text-chalk/85">
                Bằng cách lắng nghe, kiên nhẫn đồng hành, xây dựng niềm tin, giá
                trị, tạo trải nghiệm vượt ngưỡng bản thân, đánh thức con người
                phi thường bên trong mỗi người.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
