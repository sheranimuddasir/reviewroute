"use client";

import { useEffect, useState } from "react";
import type { Review } from "@/lib/types";

type Stats = {
  totalReviews: number;
  averageRating: number;
  newReviews: number;
  resolvedReviews: number;
};

export default function DashboardOverview() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalReviews: 0,
    averageRating: 0,
    newReviews: 0,
    resolvedReviews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard/reviews")
      .then((res) => res.json())
      .then((data: Review[]) => {
        setReviews(data);
        const total = data.length;
        const avg =
          total > 0
            ? data.reduce((sum, r) => sum + r.rating, 0) / total
            : 0;
        const newCount = data.filter((r) => r.status === "new").length;
        const resolvedCount = data.filter((r) => r.status === "resolved").length;
        setStats({
          totalReviews: total,
          averageRating: Math.round(avg * 10) / 10,
          newReviews: newCount,
          resolvedReviews: resolvedCount,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-stone-100 dark:bg-stone-800 rounded-lg w-40 animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-stone-100 dark:bg-stone-800 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-stone-100 dark:bg-stone-800 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Reviews"
          value={stats.totalReviews.toString()}
          icon={
            <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
            </svg>
          }
        />
        <StatCard
          label="Average Rating"
          value={stats.averageRating.toString()}
          suffix="★"
          suffixColor="text-amber-400"
          icon={
            <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          }
        />
        <StatCard
          label="Needs Attention"
          value={stats.newReviews.toString()}
          highlight={stats.newReviews > 0}
          icon={
            <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          }
        />
        <StatCard
          label="Resolved"
          value={stats.resolvedReviews.toString()}
          icon={
            <svg className="w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Recent reviews */}
      <div>
        <h2 className="text-base font-semibold text-foreground mb-4">Recent Reviews</h2>
        {reviews.length === 0 ? (
          <div className="bg-card rounded-2xl border border-border p-10 text-center">
            <div className="w-12 h-12 bg-stone-100 dark:bg-stone-800 rounded-xl flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
              </svg>
            </div>
            <p className="text-sm text-muted">No reviews yet</p>
            <p className="text-xs text-muted/70 mt-1">Reviews from your NFC cards will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.slice(0, 5).map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  suffix,
  suffixColor,
  highlight,
  icon,
}: {
  label: string;
  value: string;
  suffix?: string;
  suffixColor?: string;
  highlight?: boolean;
  icon: React.ReactNode;
}) {
  return (
    <div className={`bg-card rounded-2xl border p-5 ${highlight ? "border-accent/30 shadow-md" : "border-border shadow-sm"}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-muted uppercase tracking-wide">{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${highlight ? "bg-accent/10" : "bg-stone-100 dark:bg-stone-800"}`}>
          {icon}
        </div>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-bold text-foreground">{value}</span>
        {suffix && <span className={`text-lg ${suffixColor || "text-muted"}`}>{suffix}</span>}
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="bg-card rounded-xl border border-border p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-amber-400 text-sm tracking-tight">
              {"★".repeat(review.rating)}
              {"☆".repeat(5 - review.rating)}
            </span>
            <StatusBadge status={review.status} />
          </div>
          {review.comment && (
            <p className="text-sm text-foreground line-clamp-2 mb-1.5">{review.comment}</p>
          )}
          <p className="text-xs text-muted">
            {review.customer_name || "Anonymous"} · {new Date(review.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
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
