"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

const TRIP_TITLE = "Leo núi #3 - Chinh phục nóc nhà Đông Dương Tháng 12";
const TRIP_SCHEDULE = "3 Th12 - 8 Th12, 2026";

type SubmissionStatus = "idle" | "loading" | "success" | "error";

export function TripRegistrationDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  function closeDialog() {
    setIsOpen(false);
    setStatus("idle");
    setErrorMessage("");
    formRef.current?.reset();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    const form = event.currentTarget;
    const data = new FormData(form);
    const attendeeCount = Number(data.get("attendeeCount"));
    const note = String(data.get("note") ?? "").trim();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/inquiries`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.get("name"),
            phone: data.get("phone"),
            age: Number(data.get("age")),
            email: data.get("email"),
            concern: "khac",
            concernDetail: [
              `Đăng ký đồng hành: ${TRIP_TITLE}`,
              `Thời gian: ${TRIP_SCHEDULE}`,
              `Số người tham gia: ${attendeeCount}`,
              note ? `Ghi chú: ${note}` : "",
            ]
              .filter(Boolean)
              .join("\n"),
            coachName: "",
          }),
        },
      );

      if (!response.ok) {
        const result = await response.json().catch(() => null);
        throw new Error(
          result?.message ?? "Chưa gửi được đăng ký. Vui lòng thử lại.",
        );
      }

      setStatus("success");
      form.reset();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Chưa gửi được đăng ký. Vui lòng thử lại.",
      );
      setStatus("error");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="block w-full rounded-full bg-yellow py-3 text-center font-mono text-xs font-bold uppercase tracking-wider text-blue transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow"
      >
        Đăng ký ngay
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="trip-registration-title"
        onClose={() => {
          setIsOpen(false);
          setStatus("idle");
          setErrorMessage("");
          formRef.current?.reset();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}
        className="fixed m-auto max-h-[min(90dvh,860px)] w-[min(92vw,720px)] max-w-none overflow-y-auto rounded-3xl border border-yellow/40 bg-cream p-0 text-blue shadow-2xl shadow-blue/30 backdrop:bg-blue/70 backdrop:backdrop-blur-sm"
      >
        <div className="relative overflow-hidden rounded-3xl">
          <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-yellow/15 blur-3xl" />
          <div className="relative border-b border-blue/10 bg-blue px-6 py-6 text-white sm:px-9 sm:py-8">
            <button
              type="button"
              aria-label="Đóng form đăng ký"
              onClick={closeDialog}
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-xl text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow"
            >
              ×
            </button>
            <div className="mb-3 flex items-center gap-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-yellow">
              <span className="h-px w-6 bg-yellow" />
              Chuyến đi tiếp theo
            </div>
            <h2
              id="trip-registration-title"
              className="max-w-[18ch] pr-9 font-display text-2xl font-bold text-white sm:text-3xl"
            >
              Đăng ký đồng hành
            </h2>
            <p className="mt-2 text-sm font-medium text-white/75">
              {TRIP_TITLE}
            </p>
            <p className="mt-1 font-mono text-xs font-bold text-yellow">
              {TRIP_SCHEDULE}
            </p>
          </div>

          {status === "success" ? (
            <div className="relative px-6 py-8 sm:px-9 sm:py-10">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow/20 text-2xl font-bold text-blue">
                ✓
              </div>
              <h3 className="font-display text-xl font-bold text-blue">
                Đã nhận thông tin đăng ký
              </h3>
              <p className="mt-2 text-sm leading-6 text-blue/70">
                Sunshine Center sẽ liên hệ để xác nhận thông tin và trao đổi
                thêm về chuyến đi. Đăng ký này chưa phải xác nhận chỗ.
              </p>
              <button
                type="button"
                onClick={closeDialog}
                className="mt-6 rounded-full bg-yellow px-7 py-3 font-mono text-xs font-bold uppercase tracking-wider text-blue transition hover:brightness-95"
              >
                Đã hiểu
              </button>
            </div>
          ) : (
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="relative space-y-5 px-6 py-6 sm:px-9 sm:py-8"
            >
              <p className="max-w-[62ch] text-sm leading-6 text-blue/70">
                Để lại thông tin, đội ngũ Sunshine Center sẽ liên hệ tư vấn và
                xác nhận chỗ tham gia cùng bạn.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-blue">
                    Họ và tên <span className="text-yellow">*</span>
                  </span>
                  <input
                    autoFocus
                    autoComplete="name"
                    name="name"
                    required
                    maxLength={120}
                    placeholder="Nguyễn Văn A"
                    className="w-full rounded-xl border border-blue/15 bg-white px-4 py-3 text-sm text-blue outline-none transition placeholder:text-blue/40 focus:border-yellow focus:ring-2 focus:ring-yellow/20"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-blue">
                    Số điện thoại <span className="text-yellow">*</span>
                  </span>
                  <input
                    autoComplete="tel"
                    name="phone"
                    type="tel"
                    required
                    maxLength={30}
                    placeholder="09xx xxx xxx"
                    className="w-full rounded-xl border border-blue/15 bg-white px-4 py-3 text-sm text-blue outline-none transition placeholder:text-blue/40 focus:border-yellow focus:ring-2 focus:ring-yellow/20"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-blue">
                    Email <span className="text-yellow">*</span>
                  </span>
                  <input
                    autoComplete="email"
                    name="email"
                    type="email"
                    required
                    maxLength={254}
                    placeholder="ban@email.com"
                    className="w-full rounded-xl border border-blue/15 bg-white px-4 py-3 text-sm text-blue outline-none transition placeholder:text-blue/40 focus:border-yellow focus:ring-2 focus:ring-yellow/20"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-blue">
                    Độ tuổi <span className="text-yellow">*</span>
                  </span>
                  <input
                    autoComplete="bday-year"
                    name="age"
                    type="number"
                    min={1}
                    max={120}
                    required
                    placeholder="30"
                    className="w-full rounded-xl border border-blue/15 bg-white px-4 py-3 text-sm text-blue outline-none transition placeholder:text-blue/40 focus:border-yellow focus:ring-2 focus:ring-yellow/20"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-blue">
                    Số người tham gia
                  </span>
                  <select
                    name="attendeeCount"
                    defaultValue="1"
                    className="w-full rounded-xl border border-blue/15 bg-white px-4 py-3 text-sm text-blue outline-none transition focus:border-yellow focus:ring-2 focus:ring-yellow/20"
                  >
                    {[1, 2, 3, 4, 5].map((count) => (
                      <option key={count} value={count}>
                        {count} người
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-blue">
                    Lời nhắn thêm
                  </span>
                  <input
                    name="note"
                    maxLength={300}
                    placeholder="Điều bạn muốn hỏi trước chuyến đi"
                    className="w-full rounded-xl border border-blue/15 bg-white px-4 py-3 text-sm text-blue outline-none transition placeholder:text-blue/40 focus:border-yellow focus:ring-2 focus:ring-yellow/20"
                  />
                </label>
              </div>

              {status === "error" && (
                <p
                  role="alert"
                  className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                >
                  {errorMessage}
                </p>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-blue/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-5 text-blue/55">
                  Gửi thông tin để được tư vấn; chưa phát sinh thanh toán.
                </p>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="rounded-full bg-yellow px-8 py-3 font-mono text-xs font-bold uppercase tracking-wider text-blue transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow disabled:cursor-wait disabled:opacity-60"
                >
                  {status === "loading" ? "Đang gửi…" : "Gửi đăng ký"}
                </button>
              </div>
            </form>
          )}
        </div>
      </dialog>
    </>
  );
}
