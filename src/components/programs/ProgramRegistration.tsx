"use client";

import type { ProgramRegistration as Registration } from "@/types/program";
import Image from "next/image";

export default function ProgramRegistration({
  registration,
  image,
  title,
}: {
  registration: Registration;
  image: string;
  title: string;
}) {
  const seatsLeft =
    registration.seatsTotal != null
      ? registration.seatsTotal - (registration.seatsTaken || 0)
      : null;

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border-2 border-yellow bg-blue text-white shadow-xl shadow-blue/15">
      <div className="relative aspect-[3/1] w-full bg-blue/5">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width: 896px) 848px, calc(100vw - 3rem)"
          className="object-contain object-center"
        />
      </div>
      <div className="p-6 sm:p-8">
        <h2 className="mb-3 text-2xl font-bold">Đăng ký tham gia</h2>

      <div className="flex flex-wrap items-center gap-4">
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

      {registration.contactPhone ? (
        <a
          href={`tel:${registration.contactPhone}`}
          className="mt-4 inline-flex min-h-11 items-center rounded-full bg-yellow px-8 py-3 font-bold text-blue transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-blue"
        >
          Gọi để đăng ký
        </a>
      ) : (
        <p className="mt-4 text-sm font-medium text-white/70">
          Vui lòng liên hệ Sunshine Center để nhận hướng dẫn đăng ký.
        </p>
      )}

      {registration.contactPhone && (
        <p className="mt-3 text-sm font-medium text-white/70">
          Hoặc liên hệ hotline: {registration.contactPhone}
        </p>
      )}
      </div>
    </div>
  );
}
