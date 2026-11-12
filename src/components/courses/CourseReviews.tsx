"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";
import type { RatingBreakdownItem, Review } from "@/types/course";
import StarRating from "../ui/StarRating";

export default function CourseReviews({
  courseId,
  ratingAverage,
  ratingCount,
  breakdown,
  reviews,
}: {
  courseId: string;
  ratingAverage: number;
  ratingCount: number;
  breakdown: RatingBreakdownItem[];
  reviews: Review[];
}) {
  const [localReviews, setLocalReviews] = useState(reviews);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const user = getStoredUser();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await apiFetch(`/api/courses/${courseId}/reviews`, {
        method: "POST",
        body: JSON.stringify({ rating, comment }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Có lỗi xảy ra");
      setLocalReviews((prev) => [json.data, ...prev]);
      setComment("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <h2 className="mb-5 font-editorial text-3xl font-bold text-blue">Đánh giá</h2>

      {/* Tổng quan rating */}
      {ratingCount > 0 ? (
        <div className="rounded-xl border border-blue/10 bg-blue/5 p-5">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="font-display text-4xl font-extrabold text-blue">
                {ratingAverage.toFixed(1)}
              </span>
              <div>
                <StarRating value={ratingAverage} size={16} />
                <div className="mt-0.5 text-xs font-medium text-blue/50">
                  {ratingCount} lượt đánh giá
                </div>
              </div>
            </div>

            {breakdown.some((b) => b.count > 0) && (
              <div className="flex flex-wrap gap-2">
                {breakdown
                  .filter((b) => b.count > 0)
                  .sort((a, b) => b.star - a.star)
                  .map((b) => (
                    <span
                      key={b.star}
                      className="inline-flex items-center gap-1 rounded-full border border-blue/15 bg-white px-3 py-1 text-xs font-bold text-blue"
                    >
                      {b.star} sao
                      <span className="font-normal text-blue/50">({b.count})</span>
                    </span>
                  ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4 rounded-xl border border-dashed border-blue/20 bg-blue/[0.03] p-5">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-yellow/20 text-2xl text-yellow" aria-hidden="true">
            ★
          </span>
          <div>
            <p className="font-bold text-blue">Chưa có đánh giá cho khóa học này</p>
            <p className="mt-0.5 text-sm text-blue/60">
              Nếu bạn đã tham gia, hãy chia sẻ cảm nhận để giúp người đến sau.
            </p>
          </div>
        </div>
      )}

      {/* Form gửi đánh giá */}
      {user ? (
        <form
          onSubmit={handleSubmit}
          className="mt-5 rounded-xl border border-blue/15 bg-white p-5"
        >
          <h3 className="mb-3 font-editorial text-xl font-bold text-blue">Viết đánh giá của bạn</h3>
          <div className="mb-3">
            <label
              htmlFor={`course-review-rating-${courseId}`}
              className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-blue/60"
            >
              Số sao
            </label>
            <select
              id={`course-review-rating-${courseId}`}
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="rounded-xl border-2 border-blue/15 bg-blue/5 px-4 py-2 text-sm font-bold text-blue outline-none focus:border-blue"
            >
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {"★".repeat(n)} — {["Xuất sắc", "Tốt", "Khá", "Trung bình", "Kém"][5 - n]}
                </option>
              ))}
            </select>
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Chia sẻ cảm nhận của bạn về khóa học này..."
            rows={3}
            className="w-full rounded-xl border-2 border-blue/15 bg-blue/5 p-3 text-sm font-medium text-blue outline-none focus:border-blue"
          />
          {error && (
            <p className="mt-2 text-sm font-bold text-red-500">{error}</p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="mt-3 rounded-full bg-yellow px-6 py-2.5 text-sm font-bold text-blue transition hover:brightness-95 disabled:opacity-50"
          >
            {submitting ? "Đang gửi..." : "Gửi đánh giá"}
          </button>
        </form>
      ) : (
        <p className="mt-4 rounded-xl border border-blue/10 bg-blue/5 px-5 py-4 text-sm font-medium text-blue/60">
          Bạn cần đăng nhập để gửi đánh giá cho khóa học này.
        </p>
      )}

      {/* Danh sách review */}
      <div className="mt-5 space-y-3">
        {localReviews.length === 0 ? (
          null
        ) : (
          localReviews.map((review, i) => (
            <div
              key={review._id}
              className="rounded-xl border border-blue/10 bg-white p-4 sm:p-5"
              style={{
                animation: `review-enter 350ms cubic-bezier(0.22,1,0.36,1) ${i * 40}ms both`,
              }}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-yellow font-mono text-sm font-bold text-blue">
                    {review.user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-bold text-blue">{review.user.name}</span>
                    <div className="mt-0.5">
                      <StarRating value={review.rating} size={12} />
                    </div>
                  </div>
                </div>
                <span className="shrink-0 text-xs font-medium text-blue/40">
                  {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
              {review.comment && (
                <p className="mt-3 text-sm font-medium leading-relaxed text-blue/80">
                  {review.comment}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      <style>{`
        @keyframes review-enter {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="review-enter"] { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
