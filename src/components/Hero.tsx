export function Hero() {
  return (
    <section className="relative flex min-h-svh items-end overflow-hidden pb-24 pt-36">
      <div className="relative z-10 mx-auto w-full max-w-[var(--page-w)] px-6">
        <div className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-ochre">
          <span className="block h-px w-6 bg-ochre" />
          Cố vấn hành trình · Người bạn đường của trẻ em vùng cao
        </div>

        <h1 className="max-w-[16ch] font-display text-[clamp(40px,6.6vw,92px)] font-bold leading-[0.98] text-chalk">
          Leo lên đỉnh núi. <em className="text-ochre not-italic">Cúi xuống</em>{" "}
          với một đứa trẻ.
        </h1>

        <p className="mt-6 max-w-[46ch] font-body text-lg italic text-paper/80">
          Mười hai năm đi giữa hai việc tưởng như chẳng liên quan — chinh phục
          những đỉnh núi khó nhất Việt Nam, và ngồi xuống dạy con chữ cho những
          đứa trẻ chưa từng thấy biển.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <a
            href="#trail"
            className="rounded-sm bg-ochre px-6 py-3.5 font-mono text-xs uppercase tracking-wider text-pine transition-colors hover:bg-[#c17c26]"
          >
            Xem bản đồ hành trình
          </a>
          <a
            href="#videos"
            className="rounded-sm border border-paper/40 px-6 py-3.5 font-mono text-xs uppercase tracking-wider transition-colors hover:border-paper"
          >
            Xem video
          </a>
        </div>
      </div>
    </section>
  );
}
