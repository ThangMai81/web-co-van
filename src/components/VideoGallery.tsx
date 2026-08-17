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
    <section id="videos" className="bg-paper py-32 text-ink">
      <div className="mx-auto max-w-[var(--page-w)] px-6">
        <h2 className="mb-16 font-display text-4xl font-bold">
          Nhật ký bằng hình
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {VIDEOS.map((v) => (
            <div
              key={v.title}
              className="flex aspect-[4/5] cursor-pointer flex-col justify-between rounded-sm bg-pine-2 p-4 text-paper transition-transform hover:-translate-y-1"
            >
              <span className="self-start rounded-sm bg-black/40 px-2 py-1 font-mono text-xs">
                {v.len}
              </span>
              <div>
                <div className="font-display font-semibold">{v.title}</div>
                <div className="mt-1 text-sm opacity-70">{v.place}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
