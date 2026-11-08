"use client";

export default function DetailRouteUnavailable({
  onRetry,
}: {
  onRetry: () => void;
}) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-white px-4 py-12">
      <section className="w-full max-w-lg rounded-3xl border border-blue/10 bg-white p-6 text-center shadow-sm sm:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-blue/70">
          Sunshine Center
        </p>
        <h1 className="mt-3 text-2xl font-bold leading-tight text-blue sm:text-3xl">
          Chưa thể tải nội dung
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-blue/75">
          Trang này tạm thời chưa tải được. Bạn có thể thử lại hoặc về trang chủ.
          Nếu thử lại vẫn chưa tải được, bạn vui lòng chờ một lúc rồi thử lại.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onRetry}
            className="min-h-11 rounded-full bg-blue px-6 py-3 text-base font-semibold text-white hover:bg-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue disabled:cursor-wait disabled:opacity-70"
          >
            Thử lại
          </button>
          <a
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-blue/20 px-6 py-3 text-base font-semibold text-blue hover:bg-blue/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
          >
            Về trang chủ
          </a>
        </div>
      </section>
    </main>
  );
}
