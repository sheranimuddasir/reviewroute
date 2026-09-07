"use client";

import { useState, useEffect } from "react";

type BusinessInfo = {
  name: string;
  slug: string;
  google_review_url: string;
  logo_url: string | null;
};

type SubmitState = "idle" | "submitting" | "success" | "error";

const RATING_LABELS = ["", "Terrible", "Poor", "Okay", "Good", "Excellent"];

export default function ReviewPageClient({ slug }: { slug: string }) {
  const [business, setBusiness] = useState<BusinessInfo | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [hoveredRating, setHoveredRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [googleUrl, setGoogleUrl] = useState("");
  const [reviewId, setReviewId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [submittedComment, setSubmittedComment] = useState("");

  useEffect(() => {
    fetch(`/api/businesses/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Business not found");
        return res.json();
      })
      .then((data) => {
        setBusiness(data);
        setGoogleUrl(data.google_review_url);
      })
      .catch(() => {
        setBusiness(null);
      });
  }, [slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) return;

    setSubmitState("submitting");
    setErrorMessage("");
    setSubmittedComment(comment);

    try {
      const res = await fetch("/api/reviews/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessSlug: slug,
          rating,
          comment: comment || undefined,
          customerName: customerName || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit feedback");
      }

      const data = await res.json();
      setGoogleUrl(data.googleReviewUrl);
      setReviewId(data.reviewId);
      setSubmitState("success");
    } catch (err) {
      setSubmitState("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong"
      );
    }
  }

  function handleGoogleReviewClick() {
    if (reviewId) {
      fetch("/api/reviews/google-redirect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, businessSlug: slug }),
      }).catch(() => {});
    }
  }

  async function handleCopyReviewText() {
    const text = submittedComment || `I had a great experience at ${business?.name}! Highly recommend them.`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const activeRating = hoveredRating || rating;
  const isHighRating = rating >= 4;

  // Loading state
  if (business === null) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-10 h-10 border-3 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (!business) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background px-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-warning-light rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-warning" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-foreground mb-2">Review link not found</h1>
          <p className="text-sm text-muted">This link may have expired or be invalid.</p>
        </div>
      </div>
    );
  }

  // Success state
  if (submitState === "success") {
    return (
      <div className="min-h-dvh bg-gradient-to-b from-accent-light/40 to-background flex flex-col">
        <header className="pt-10 pb-6 px-6 text-center">
          {business.logo_url ? (
            <img src={business.logo_url} alt={business.name} className="h-14 w-14 rounded-2xl mx-auto mb-4 object-cover shadow-md" />
          ) : (
            <div className="h-14 w-14 rounded-2xl bg-accent/10 mx-auto mb-4 flex items-center justify-center">
              <span className="text-xl font-bold text-accent">{business.name.charAt(0)}</span>
            </div>
          )}
          <h1 className="text-2xl font-bold text-foreground">Thank you!</h1>
          <p className="text-muted mt-1">We really appreciate your feedback.</p>
        </header>

        <main className="flex-1 px-6 pb-10 max-w-md mx-auto w-full">
          {/* Checkmark */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-success-light rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-success" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
          </div>

          {isHighRating ? (
            /* HIGH RATING (4-5 stars): Google review link + copy text */
            <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
              <h3 className="text-base font-semibold text-foreground text-center mb-2">
                Glad you loved it!
              </h3>
              <p className="text-sm text-muted text-center mb-5">
                Would you share your experience on Google? It really helps us out.
              </p>

              <a
                href={googleUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleGoogleReviewClick}
                className="flex items-center justify-center gap-3 w-full bg-accent hover:bg-accent-hover text-white font-semibold py-4 px-6 rounded-xl text-base shadow-md hover:shadow-lg active:scale-[0.98] transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Review on Google
              </a>

              {/* Copy review text */}
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs text-muted text-center mb-2">Or copy this review text to paste on Google:</p>
                <div className="bg-background rounded-xl p-3 text-sm text-foreground text-center italic">
                  &ldquo;{submittedComment || `I had a great experience at ${business.name}! Highly recommend them.`}&rdquo;
                </div>
                <button
                  onClick={handleCopyReviewText}
                  className="w-full mt-2 text-sm text-accent hover:text-accent-hover font-medium py-2 rounded-lg hover:bg-accent-light/50 transition-colors"
                >
                  {copied ? "Copied!" : "Copy review text"}
                </button>
              </div>
            </div>
          ) : (
            /* LOW RATING (1-3 stars): Thank you + optional Google review */
            <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
              <p className="text-sm text-muted text-center mb-4">
                We&apos;re sorry we fell short. Your feedback helps us improve.
              </p>

              {/* Small optional Google review button */}
              <div className="text-center">
                <p className="text-xs text-muted/70 mb-2">Would you still like to leave a public review?</p>
                <a
                  href={googleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleGoogleReviewClick}
                  className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground border border-border rounded-lg px-4 py-2 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Leave a Google review (optional)
                </a>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // Feedback form
  return (
    <div className="min-h-dvh bg-gradient-to-b from-accent-light/30 to-background flex flex-col">
      <header className="pt-10 pb-6 px-6 text-center">
        {business.logo_url ? (
          <img src={business.logo_url} alt={business.name} className="h-14 w-14 rounded-2xl mx-auto mb-4 object-cover shadow-md" />
        ) : (
          <div className="h-14 w-14 rounded-2xl bg-accent/10 mx-auto mb-4 flex items-center justify-center">
            <span className="text-xl font-bold text-accent">{business.name.charAt(0)}</span>
          </div>
        )}
        <p className="text-sm text-muted mb-1">We&apos;d love your feedback</p>
        <h1 className="text-2xl font-bold text-foreground">
          How was your experience at {business.name}?
        </h1>
      </header>

      <main className="flex-1 px-5 pb-10 max-w-md mx-auto w-full">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star rating */}
          <div className="bg-card rounded-2xl p-6 shadow-sm border border-border">
            <label className="block text-sm font-medium text-foreground mb-4">
              Tap a star to rate
            </label>

            <div className="flex justify-center gap-1.5 mb-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1.5 rounded-xl transition-all duration-150 hover:scale-110 active:scale-95"
                  aria-label={`${star} star${star !== 1 ? "s" : ""}`}
                >
                  <svg
                    className={`w-11 h-11 transition-all duration-150 ${
                      star <= activeRating
                        ? "text-amber-400 drop-shadow-sm"
                        : "text-stone-200"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </button>
              ))}
            </div>

            <div className="text-center h-6">
              {activeRating > 0 && (
                <p className="text-sm font-medium text-accent transition-all duration-150">
                  {RATING_LABELS[activeRating]}
                </p>
              )}
            </div>
          </div>

          {/* Comment */}
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
            <label htmlFor="comment" className="block text-sm font-medium text-foreground mb-2.5">
              Tell us more <span className="text-muted font-normal">(optional)</span>
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="What did you love? What could we improve?"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder-muted/60 text-sm resize-none focus:ring-0 focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-light)]"
            />
          </div>

          {/* Name */}
          <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2.5">
              Your name <span className="text-muted font-normal">(optional)</span>
            </label>
            <input
              id="name"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="First name"
              className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder-muted/60 text-sm focus:ring-0 focus:border-accent focus:shadow-[0_0_0_3px_var(--accent-light)]"
            />
          </div>

          {/* Error */}
          {submitState === "error" && (
            <div className="bg-danger-light rounded-xl p-4 text-danger text-sm flex items-start gap-3">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={rating === 0 || submitState === "submitting"}
            className="w-full bg-accent hover:bg-accent-hover disabled:bg-stone-200 dark:bg-stone-700 disabled:text-muted text-white font-semibold py-4 px-6 rounded-xl text-base shadow-md hover:shadow-lg disabled:shadow-none active:scale-[0.98] disabled:active:scale-100 transition-all duration-150"
          >
            {submitState === "submitting" ? (
              <span className="flex items-center justify-center gap-2.5">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </span>
            ) : (
              "Submit feedback"
            )}
          </button>

          <p className="text-center text-xs text-muted pt-1">
            Your feedback helps us serve you better. Thank you!
          </p>
        </form>
      </main>
    </div>
  );
}
