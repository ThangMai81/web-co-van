"use client";

import { useState, type FormEvent } from "react";
import { StatusBanner } from "@/components/ui/StatusBanner";

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

export function InquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [concern, setConcern] = useState("");
  const [concernDetail, setConcernDetail] = useState("");

  const needsDetail = concern === "khac";
  const canSubmit =
    concern && (!needsDetail || concernDetail.trim().length > 0);

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
            concernDetail: needsDetail ? concernDetail : "",
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
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Có lỗi xảy ra");
      setStatus("error");
    }
  }

  return (
    <section id="lien-he" className="bg-cream py-28">
      <StatusBanner
        show={status === "success" || status === "error"}
        variant={status === "success" ? "success" : "error"}
        message={
          status === "success"
            ? "Đã gửi thành công! Chúng tôi sẽ liên hệ với bạn sớm."
            : errorMsg
        }
        onClose={() => setStatus("idle")}
      />

      <div className="mx-auto max-w-[var(--page-w)] px-6">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 flex items-center justify-center gap-3 font-mono text-xs uppercase tracking-widest text-sun">
            <span className="block h-px w-6 bg-sun" />
            Bắt đầu hành trình của bạn
            <span className="block h-px w-6 bg-sun" />
          </div>
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            Hãy để chúng tôi hiểu bạn hơn
          </h2>
          <p className="mt-4 text-ink/70">
            Chỉ vài dòng ngắn — chúng tôi sẽ liên hệ để cùng bạn tìm hướng phù
            hợp nhất.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-12 max-w-2xl rounded-md border border-sage/25 bg-paper p-8 shadow-sm sm:p-10"
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

          <div className="my-8 border-t border-sage/20" />

          <div>
            <span className="mb-3 block font-mono text-xs uppercase tracking-wider text-sage">
              Điều bạn đang quan tâm hoặc vướng bận nhất lúc này
            </span>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {CONCERNS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setConcern(c.value)}
                  className={`rounded-md border px-4 py-3 text-left text-sm transition-all ${
                    concern === c.value
                      ? "border-sun bg-sun-soft/60 text-ink"
                      : "border-sage/25 text-ink/70 hover:border-sun/50"
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
                className="w-full rounded-sm border border-sage/40 bg-cream px-4 py-3 text-sm text-ink outline-none focus:border-sun"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={status === "loading" || !canSubmit}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-sm bg-sun py-3.5 font-mono text-xs uppercase tracking-wider text-ink transition-colors hover:brightness-90 disabled:cursor-not-allowed disabled:opacity-60"
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
              "Gửi lời quan tâm"
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
      <span className="font-mono text-[10px] uppercase tracking-wider text-sage">
        {label}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="rounded-sm border border-sage/40 bg-cream px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-sun"
      />
    </label>
  );
}
