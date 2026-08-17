export function AboutSection() {
  return (
    <section id="about" className="bg-pine py-32">
      <div className="mx-auto max-w-[var(--page-w)] px-6">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div className="aspect-[3/4] rounded-sm bg-pine-2" />

          <div>
            <h2 className="mb-4 font-display text-4xl font-bold text-chalk">
              Trần Minh Đăng
            </h2>
            <blockquote className="my-6 border-l-2 border-ochre pl-6 font-body text-2xl italic text-chalk">
              &ldquo;Núi dạy tôi cách chịu đựng. Trẻ con dạy tôi lý do để tiếp
              tục.&rdquo;
            </blockquote>
            <div className="max-w-[56ch] space-y-4 text-paper/70">
              <p>
                Tôi từng là kỹ sư xây dựng trước khi rẽ hướng vào năm 2014, sau
                chuyến leo Fansipan đầu tiên.
              </p>
              <p>
                Tôi không phải giáo viên được đào tạo bài bản, cũng không phải
                vận động viên leo núi chuyên nghiệp.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
