"use client";

import { useEffect, useState, useCallback } from "react";
import type { Review } from "@/lib/types";

const STATUS_FILTERS = [
  { value: "new", label: "New" },
  { value: "read", label: "Read" },
  { value: "resolved", label: "Resolved" },
  { value: "", label: "All" },
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("new");
  const [ratingFilter, setRatingFilter] = useState<string>("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (ratingFilter) params.set("rating", ratingFilter);

    const res = await fetch(`/api/dashboard/reviews?${params}`);
    const data = await res.json();
    setReviews(data);
    setLoading(false);
  }, [statusFilter, ratingFilter]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  async function updateStatus(reviewId: string, newStatus: string) {
    setUpdatingId(reviewId);
    await fetch("/api/dashboard/review-status", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewId, status: newStatus }),
    });
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId ? { ...r, status: newStatus as Review["status"] } : r
      )
    );
    setUpdatingId(null);
  }

  function getStatusStyles(status: string, isActive: boolean) {
    if (!isActive) return "text-muted hover:text-foreground hover:bg-stone-100 dark:hover:bg-stone-800";

    switch (status) {
      case "new":
        return "bg-status-new text-white shadow-sm";
      case "read":
        return "bg-status-read text-white shadow-sm";
      case "resolved":
        return "bg-status-resolved text-white shadow-sm";
      case "":
        return "bg-foreground text-background shadow-sm";
      default:
        return "bg-foreground text-background shadow-sm";
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Reviews</h1>
        <span className="text-sm text-muted">{reviews.length} reviews</span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex gap-1.5 bg-card border border-border rounded-xl p-1">
          {STATUS_FILTERS.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${getStatusStyles(filter.value, statusFilter === filter.value)}`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <select
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
          className="px-3 py-1.5 rounded-lg border border-border bg-card text-sm text-foreground focus:ring-0 focus:border-accent"
        >
          <option value="">All ratings</option>
          <option value="5">5 stars</option>
          <option value="4">4 stars</option>
          <option value="3">3 stars</option>
          <option value="2">2 stars</option>
          <option value="1">1 star</option>
        </select>
      </div>

      {/* Reviews list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-32 bg-stone-100 dark:bg-stone-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-card rounded-2xl border border-border p-10 text-center">
          <div className="w-12 h-12 bg-stone-100 dark:bg-stone-800 rounded-xl flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <p className="text-sm text-muted">No reviews match your filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-card rounded-2xl border border-border p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-amber-400 text-sm">
                    {"★".repeat(review.rating)}
                    {"☆".repeat(5 - review.rating)}
                  </span>
                  <StatusBadge status={review.status} />
                </div>
                <span className="text-xs text-muted shrink-0">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>

              {review.comment && (
                <p className="text-sm text-foreground mb-3 leading-relaxed">{review.comment}</p>
              )}

              <div className="flex items-center gap-3 text-xs text-muted mb-3">
                {review.customer_name && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                    {review.customer_name}
                  </span>
                )}
                {review.customer_contact && (
                  <span className="flex items-center gap-1">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    {review.customer_contact}
                  </span>
                )}
                <span className="ml-auto text-muted/70">
                  via {review.routed_to === "google" ? "Google" : "Private feedback"}
                </span>
              </div>

              {/* Status actions */}
              <div className="flex gap-2 pt-3 border-t border-border">
                {review.status !== "read" && (
                  <button
                    onClick={() => updateStatus(review.id, "read")}
                    disabled={updatingId === review.id}
                    className="text-xs px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-foreground hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors disabled:opacity-50 font-medium"
                  >
                    Mark as read
                  </button>
                )}
                {review.status !== "resolved" && (
                  <button
                    onClick={() => updateStatus(review.id, "resolved")}
                    disabled={updatingId === review.id}
                    className="text-xs px-3 py-1.5 rounded-lg bg-success-light text-success hover:bg-success/10 transition-colors disabled:opacity-50 font-medium"
                  >
                    Mark as resolved
                  </button>
                )}
                {review.status === "resolved" && (
                  <button
                    onClick={() => updateStatus(review.id, "new")}
                    disabled={updatingId === review.id}
                    className="text-xs px-3 py-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 text-foreground hover:bg-stone-200 dark:hover:bg-stone-700 transition-colors disabled:opacity-50 font-medium"
                  >
                    Reopen
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    new: "bg-status-new-bg text-status-new font-semibold",
    read: "bg-status-read-bg text-status-read",
    resolved: "bg-status-resolved-bg text-status-resolved",
  };
  return (
    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full uppercase tracking-wide ${styles[status] || styles.new}`}>
      {status}
    </span>
  );
}
