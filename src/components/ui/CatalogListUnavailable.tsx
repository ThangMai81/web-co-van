"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useTransition } from "react";

export default function CatalogListUnavailable() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const retryRequested = useRef(false);

  useEffect(() => {
    if (!isPending) retryRequested.current = false;
  }, [isPending]);

  const handleRetry = () => {
    if (retryRequested.current) return;
    retryRequested.current = true;
    startTransition(() => router.refresh());
  };

  return (
    <section
      aria-labelledby="catalog-list-unavailable-heading"
      className="rounded-3xl border border-blue/10 bg-white p-6 text-center shadow-sm sm:p-8"
    >
      <div role="alert">
        <h2
          id="catalog-list-unavailable-heading"
          className="text-xl font-bold leading-tight text-blue sm:text-2xl"
        >
          Chưa tải được danh sách
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-blue/75 sm:text-base sm:leading-7">
          Bạn có thể chờ một lúc rồi thử lại. Nếu mất kết nối mạng, hãy thử khi
          mạng hoạt động trở lại.
        </p>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={handleRetry}
          disabled={isPending}
          aria-busy={isPending}
          className="min-h-11 rounded-full bg-blue px-6 py-3 text-base font-semibold text-white hover:bg-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue disabled:cursor-wait disabled:opacity-70"
        >
          {isPending ? "Đang thử lại…" : "Thử lại"}
        </button>
        <Link
          href="/#chon-khoa-hoc-hay-chuong-trinh"
          className="inline-flex min-h-11 items-center justify-center rounded-full border border-blue/20 px-6 py-3 text-center text-base font-semibold text-blue hover:bg-blue/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue"
        >
          Chọn khóa học hoặc chương trình
        </Link>
      </div>
    </section>
  );
}
