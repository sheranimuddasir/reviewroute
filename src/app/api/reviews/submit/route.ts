import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { sendNewReviewNotification } from "@/lib/email";

/**
 * POST /api/reviews/submit
 * Public endpoint — anonymous customers submit feedback after tapping the NFC card.
 * Uses the service-role key server-side to bypass RLS for anonymous inserts.
 * No rating-based gating (Option B: always capture feedback, always offer Google review).
 * Rate-limited: max 20 submissions per business per hour (configurable via env var).
 */
export async function POST(request: Request) {
  const body = await request.json();
  const { businessSlug, rating, comment, customerName, customerContact } =
    body;

  // Validate input
  if (!businessSlug || typeof businessSlug !== "string") {
    return NextResponse.json(
      { error: "businessSlug is required" },
      { status: 400 }
    );
  }
  if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "rating must be a number between 1 and 5" },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  // 1. Look up business by slug (only active businesses)
  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .select("id, name, google_review_url, owner_user_id, status")
    .eq("slug", businessSlug)
    .single();

  if (businessError || !business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  if (business.status !== "active") {
    return NextResponse.json(
      { error: "This review page is no longer active" },
      { status: 404 }
    );
  }

  // 2. Rate limit check — configurable via env var, default 20/hour
  const maxPerHour = parseInt(process.env.REVIEW_RATE_LIMIT || "20", 10);
  const { data: rateCheck } = await supabase.rpc("check_review_rate_limit", {
    p_business_id: business.id,
    p_max_per_hour: maxPerHour,
  });

  if (rateCheck === false) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429 }
    );
  }

  // 3. Insert review — routed_to is always 'private_feedback' (Option B)
  const { data: review, error: reviewError } = await supabase
    .from("reviews")
    .insert({
      business_id: business.id,
      rating,
      comment: comment || null,
      customer_name: customerName || null,
      customer_contact: customerContact || null,
      routed_to: "private_feedback",
    })
    .select()
    .single();

  if (reviewError) {
    console.error("[reviews/submit] Insert failed:", reviewError);
    return NextResponse.json(
      { error: "Failed to submit review" },
      { status: 500 }
    );
  }

  // 4. Log review_submitted event
  await supabase.from("events").insert({
    business_id: business.id,
    type: "review_submitted",
    metadata: { review_id: review.id, rating },
  });

  // 5. Send email notification (non-blocking — failure doesn't affect response)
  sendNewReviewNotification(
    { name: business.name, owner_user_id: business.owner_user_id },
    {
      rating: review.rating,
      comment: review.comment,
      customer_name: review.customer_name,
      created_at: review.created_at,
    }
  );

  // 6. Return success — frontend shows Google review prompt (Option B)
  return NextResponse.json({
    success: true,
    reviewId: review.id,
    googleReviewUrl: business.google_review_url,
  });
}
