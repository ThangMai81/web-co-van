"use client";

import { formatVND } from "@/lib/programLabels";
import type { ProgramRegistration as Registration } from "@/types/program";

export default function ProgramRegistration({
  registration,
}: {
  registration: Registration;
}) {
  const seatsLeft =
    registration.seatsTotal != null
      ? registration.seatsTotal - (registration.seatsTaken || 0)
      : null;

  return (
    <div className="mt-8 rounded-xl border-2 border-yellow bg-blue p-6 text-white">
      <h2 className="mb-3 text-lg font-bold">Đăng ký tham gia</h2>

      <div className="flex flex-wrap items-center gap-4">
        <span className="text-2xl font-extrabold text-yellow">
          {registration.price && registration.price > 0
            ? `${formatVND(registration.price)} VNĐ`
            : "Miễn phí"}
        </span>

        {seatsLeft !== null && (
          <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-bold">
            Còn {seatsLeft}/{registration.seatsTotal} chỗ
          </span>
        )}

        {registration.deadline && (
          <span className="text-sm font-medium text-white/70">
            Hạn đăng ký:{" "}
            {new Date(registration.deadline).toLocaleDateString("vi-VN")}
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={() => alert("Chuyển sang form đăng ký (demo)")}
        className="mt-4 w-full rounded-lg bg-yellow py-3 font-bold text-blue transition hover:brightness-95 sm:w-auto sm:px-10"
      >
        Đăng ký ngay
      </button>

      {registration.contactPhone && (
        <p className="mt-3 text-sm font-medium text-white/70">
          Hoặc liên hệ hotline: {registration.contactPhone}
        </p>
      )}
    </div>
  );
}
