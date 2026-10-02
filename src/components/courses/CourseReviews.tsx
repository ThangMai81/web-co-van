"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { getStoredUser } from "@/lib/auth";
import type { RatingBreakdownItem, Review } from "@/types/course";

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
      <h2 className="mb-3 text-xl font-bold text-blue">Đánh giá</h2>

      <div className="rounded-xl border border-blue/10 bg-blue/5 p-5">
        <div className="flex flex-wrap items-center gap-6">
          <div className="text-center">
            <div className="text-4xl font-extrabold text-blue">
              {ratingAverage.toFixed(1)}
            </div>
            <div className="text-sm font-medium text-blue/60">/5</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {breakdown.map((b) => (
              <span
                key={b.star}
                className="rounded-full border border-blue/20 bg-white px-3 py-1 text-sm font-bold text-blue"
              >
                {b.star} sao ({b.count})
              </span>
            ))}
          </div>
          <span className="rounded-full bg-yellow px-3 py-1 text-sm font-bold text-blue">
            {ratingCount} lượt đánh giá
          </span>
        </div>
      </div>

      {user ? (
        <form
          onSubmit={handleSubmit}
          className="mt-4 rounded-lg border border-blue/15 p-4"
        >
          <p className="mb-2 text-sm font-bold text-blue">Đánh giá của bạn</p>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="mb-2 rounded border border-blue/20 px-3 py-1.5 text-sm font-medium text-blue"
          >
            {[5, 4, 3, 2, 1].map((n) => (
              <option key={n} value={n}>
                {n} sao
              </option>
            ))}
          </select>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Chia sẻ cảm nhận của bạn..."
            rows={3}
            className="w-full rounded border border-blue/20 p-2 text-sm font-medium text-blue"
          />
          {error && (
            <p className="mt-1 text-sm font-bold text-red-500">{error}</p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-lg bg-yellow px-4 py-2 text-sm font-bold text-blue hover:brightness-95 disabled:opacity-50"
          >
            {submitting ? "Đang gửi..." : "Gửi đánh giá"}
          </button>
        </form>
      ) : (
        <p className="mt-4 text-sm font-medium text-blue/60">
          Bạn cần đăng nhập để gửi đánh giá cho khóa học này.
        </p>
      )}

      <div className="mt-4 space-y-3">
        {localReviews.length === 0 ? (
          <p className="font-medium text-blue/50">Chưa có đánh giá nào.</p>
        ) : (
          localReviews.map((review) => (
            <div
              key={review._id}
              className="rounded-lg border border-blue/10 p-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue">{review.user.name}</span>
                <span className="text-sm font-medium text-blue/50">
                  {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <div className="mt-1 text-yellow">
                {"★".repeat(review.rating)}
              </div>
              {review.comment && (
                <p className="mt-2 font-medium text-blue/90">
                  {review.comment}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
