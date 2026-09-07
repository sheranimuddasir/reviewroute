import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

/**
 * POST /api/reviews/google-redirect
 * Logs a google_redirect event when the customer clicks through to Google.
 * Called by the frontend after the customer taps "Leave us a Google review".
 */
export async function POST(request: Request) {
  const body = await request.json();
  const { reviewId, businessSlug } = body;

  if (!reviewId || !businessSlug) {
    return NextResponse.json(
      { error: "reviewId and businessSlug are required" },
      { status: 400 }
    );
  }

  const supabase = createServiceClient();

  // Look up business to get business_id
  const { data: business, error: businessError } = await supabase
    .from("businesses")
    .select("id")
    .eq("slug", businessSlug)
    .single();

  if (businessError || !business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  // Log the google_redirect event
  const { error } = await supabase.from("events").insert({
    business_id: business.id,
    type: "google_redirect",
    metadata: { review_id: reviewId },
  });

  if (error) {
    console.error("[reviews/google-redirect] Insert failed:", error);
    return NextResponse.json(
      { error: "Failed to log event" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
