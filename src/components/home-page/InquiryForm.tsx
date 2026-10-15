"use client";

import { useState, type FormEvent } from "react";
import { StatusBanner } from "@/components/ui/StatusBanner";
import { Send } from "@/lib/icons";

const CONCERNS = [
  { value: "tim_lai_chinh_minh", label: "Tìm lại chính mình" },
  { value: "chua_lanh_ton_thuong", label: "Chữa lành tổn thương" },
  { value: "vuot_qua_bat_luc", label: "Vượt qua cảm giác bất lực" },
  { value: "dinh_huong_muc_tieu", label: "Định hướng mục tiêu" },
  { value: "lam_cha_me_tot_hon", label: "Làm cha mẹ tốt hơn" },
  { value: "su_nghiep_be_tac", label: "Sự nghiệp bế tắc" },
  { value: "khac", label: "Điều khác" },
];

type Status = "idle" | "loading" | "success" | "error";

export function InquiryForm({ coachName, availability, bookingNoticeHours }: { coachName?: string; availability?: string[]; bookingNoticeHours?: number | null } = {}) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [concern, setConcern] = useState("");
  const [concernDetail, setConcernDetail] = useState("");
  const [preferredSlot, setPreferredSlot] = useState("");
  const [preferredDate, setPreferredDate] = useState("");

  const needsDetail = concern === "khac";
  const needsPreferredSlot = Boolean(coachName && availability?.length);
  const earliestDate = new Date(Date.now() + (bookingNoticeHours ?? 0) * 60 * 60 * 1000);
  earliestDate.setMinutes(earliestDate.getMinutes() - earliestDate.getTimezoneOffset());
  const minDate = earliestDate.toISOString().slice(0, 10);
  const canSubmit =
    concern && (!needsDetail || concernDetail.trim().length > 0) && (!needsPreferredSlot || (preferredSlot && preferredDate));

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/inquiries`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.get("name"),
            phone: data.get("phone"),
            age: Number(data.get("age")),
            email: data.get("email"),
            concern,
            concernDetail: [
              needsDetail ? concernDetail : "",
              preferredDate ? `Ngày mong muốn: ${preferredDate}` : "",
              preferredSlot ? `Khung giờ mong muốn: ${preferredSlot}` : "",
            ].filter(Boolean).join("\n"),
            coachName: coachName ?? "",
          }),
        },
      );

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        throw new Error(json?.message ?? "Có lỗi xảy ra, vui lòng thử lại");
      }

      setStatus("success");
      form.reset();
      setConcern("");
      setConcernDetail("");
      setPreferredSlot("");
      setPreferredDate("");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Có lỗi xảy ra");
      setStatus("error");
    }
  }

  return (
    <section id={coachName ? "booking" : "lien-he"} className={`bg-blue/5 py-28 ${coachName ? "scroll-mt-24" : ""}`}>
      <StatusBanner
        show={status === "success" || status === "error"}
        variant={status === "success" ? "success" : "error"}
        message={
          status === "success"
            ? coachName
              ? `Đã gửi yêu cầu phiên với ${coachName}. Chúng tôi sẽ liên hệ xác nhận lịch với bạn.`
              : "Đã gửi thành công! Chúng tôi sẽ liên hệ với bạn sớm."
            : errorMsg
        }
        onClose={() => setStatus("idle")}
      />

      <div className="mx-auto max-w-[var(--page-w)] px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 flex items-center justify-center gap-3 font-mono text-xs font-bold uppercase tracking-widest text-yellow">
            <span className="block h-px w-6 bg-yellow" />
            Bắt đầu hành trình của bạn
            <span className="block h-px w-6 bg-yellow" />
          </div>
          <h2 className="font-display text-3xl font-bold text-blue sm:text-4xl">
            {coachName ? `Đặt phiên coaching với ${coachName}` : "Hãy để chúng tôi hiểu bạn hơn"}
          </h2>
          <p className="mt-4 font-medium text-blue/70">
            {coachName
              ? "Chia sẻ điều bạn đang cần. Sunshine Center sẽ liên hệ để trao đổi và xác nhận thời gian phù hợp cho phiên riêng với người đồng hành bạn đã chọn."
              : "Chỉ vài dòng ngắn — chúng tôi sẽ liên hệ để cùng bạn tìm hướng phù hợp nhất."}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-12 max-w-2xl rounded-2xl border-2 border-blue/15 bg-white p-8 shadow-md shadow-blue/5 sm:p-10"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <Field
              label="Họ và tên"
              name="name"
              type="text"
              placeholder="Nguyễn Văn A"
              required
            />
            <Field
              label="Số điện thoại"
              name="phone"
              type="tel"
              placeholder="09xx xxx xxx"
              required
            />
            <Field
              label="Số tuổi"
              name="age"
              type="number"
              placeholder="30"
              required
            />
            <Field
              label="Email nhận thông báo"
              name="email"
              type="email"
              placeholder="ban@email.com"
              required
            />
          </div>

          <div className="my-8 border-t border-blue/10" />

          {needsPreferredSlot && (
            <div className="mb-8 grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-3 block font-mono text-xs font-bold uppercase tracking-wider text-blue">Ngày bạn muốn đặt</span>
                <input
                  required
                  type="date"
                  min={minDate}
                  value={preferredDate}
                  onChange={(event) => setPreferredDate(event.target.value)}
                  className="w-full rounded-xl border-2 border-blue/15 bg-blue/5 px-4 py-3 text-sm font-medium text-blue outline-none transition-colors focus:border-blue"
                />
                <span className="mt-2 block text-xs leading-5 text-blue/55">Đặt trước tối thiểu {bookingNoticeHours ?? 0} giờ.</span>
              </label>
              <label className="block">
                <span className="mb-3 block font-mono text-xs font-bold uppercase tracking-wider text-blue">Khung giờ bạn muốn đăng ký</span>
                <select
                  required
                  value={preferredSlot}
                  onChange={(event) => setPreferredSlot(event.target.value)}
                  className="w-full rounded-xl border-2 border-blue/15 bg-blue/5 px-4 py-3 text-sm font-medium text-blue outline-none transition-colors focus:border-blue"
                >
                  <option value="">Chọn một khung giờ phù hợp</option>
                  {availability?.map((slot) => <option key={slot} value={slot}>{slot}</option>)}
                </select>
                <span className="mt-2 block text-xs leading-5 text-blue/55">Thời gian chỉ được xác nhận sau khi coach phản hồi.</span>
              </label>
            </div>
          )}

          <div>
            <span className="mb-3 block font-mono text-xs font-bold uppercase tracking-wider text-blue">
              Điều bạn đang quan tâm hoặc vướng bận nhất lúc này
            </span>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {CONCERNS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setConcern(c.value)}
                  className={`rounded-xl border-2 px-4 py-3 text-left text-sm font-bold transition ${
                    concern === c.value
                      ? "border-yellow bg-yellow/15 text-blue"
                      : "border-blue/15 text-blue/70 hover:border-yellow/50"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                needsDetail ? "mt-4 max-h-40" : "max-h-0"
              }`}
            >
              <textarea
                value={concernDetail}
                onChange={(e) => setConcernDetail(e.target.value)}
                placeholder="Bạn có thể chia sẻ cụ thể hơn ở đây..."
                rows={3}
                className="w-full rounded-xl border-2 border-blue/15 bg-blue/5 px-4 py-3 text-sm font-medium text-blue outline-none focus:border-blue"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status === "loading" || !canSubmit}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-yellow py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-blue transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "loading" ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Đang gửi...
              </>
            ) : (
              <>
                <Send size={14} />
                {coachName ? "Gửi yêu cầu đặt phiên" : "Gửi lời quan tâm"}
              </>
            )}
          </button>
        </form>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-blue">
        {label}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="rounded-xl border-2 border-blue/15 bg-blue/5 px-4 py-3 text-sm font-medium text-blue outline-none transition-colors focus:border-blue"
      />
    </label>
  );
}
