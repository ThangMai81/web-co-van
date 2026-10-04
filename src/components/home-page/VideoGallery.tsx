const VIDEOS = [
  { title: "Ba ngày trên Tà Xùa", place: "Sơn La · Núi", len: "04:12" },
  { title: "Buổi học đọc đầu tiên", place: "Lai Châu · Lớp học", len: "07:48" },
  { title: "Sương mù ở Fansipan", place: "Lào Cai · Núi", len: "02:55" },
  {
    title: "Trò chơi dân gian trên bản",
    place: "Yên Bái · Trại hè",
    len: "11:20",
  },
  {
    title: "Dựng tủ sách cho bản Lìm Mông",
    place: "Yên Bái · Trại hè",
    len: "05:33",
  },
  {
    title: "Học trò cũ dẫn đường leo núi",
    place: "Sơn La · Núi",
    len: "08:02",
  },
];

export function VideoGallery() {
  return (
    <section id="videos" className="bg-blue/5 py-28">
      <div className="mx-auto max-w-[var(--page-w)] px-6">
        <div className="mb-4 flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-yellow">
          <span className="block h-px w-6 bg-yellow" />
          Thư viện video
        </div>
        <h2 className="mb-14 font-display text-4xl font-bold text-blue">
          Nhật ký bằng hình
        </h2>

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {VIDEOS.map((v) => (
            <button key={v.title} type="button" className="group text-left">
              <div className="relative aspect-video overflow-hidden rounded-xl border-2 border-blue/15 bg-blue/10">
                <span className="absolute left-2 top-2 rounded-full bg-blue px-2 py-0.5 font-mono text-[10px] font-bold text-white">
                  {v.len}
                </span>
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-blue shadow-md transition-all duration-200 group-hover:scale-110 group-hover:bg-yellow">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                </span>
              </div>
              <div className="mt-3">
                <div className="font-display text-sm font-bold text-blue transition-colors group-hover:text-yellow">
                  {v.title}
                </div>
                <div className="mt-0.5 text-xs font-medium text-blue/55">
                  {v.place}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
