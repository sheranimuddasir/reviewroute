import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { resolveBusinessId } from "@/lib/auth";

/**
 * PATCH /api/dashboard/review-status
 * Authenticated — updates a single review's status.
 * Explicitly verifies the review belongs to the caller's business before updating.
 */
export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const businessId = await resolveBusinessId(user.id);
  if (!businessId) {
    return NextResponse.json(
      { error: "No business associated with this account" },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { reviewId, status } = body;

  if (!reviewId || !status) {
    return NextResponse.json(
      { error: "reviewId and status are required" },
      { status: 400 }
    );
  }

  if (!["new", "read", "resolved"].includes(status)) {
    return NextResponse.json(
      { error: "Status must be new, read, or resolved" },
      { status: 400 }
    );
  }

  const serviceSupabase = createServiceClient();

  // Explicit ownership check — don't rely on RLS alone
  const { data: review, error: fetchError } = await serviceSupabase
    .from("reviews")
    .select("business_id")
    .eq("id", reviewId)
    .single();

  if (fetchError || !review) {
    return NextResponse.json({ error: "Review not found" }, { status: 404 });
  }

  if (review.business_id !== businessId) {
    return NextResponse.json(
      { error: "You do not have permission to update this review" },
      { status: 403 }
    );
  }

  // Update the status
  const { error: updateError } = await serviceSupabase
    .from("reviews")
    .update({ status })
    .eq("id", reviewId);

  if (updateError) {
    console.error("[dashboard/review-status] Update failed:", updateError);
    return NextResponse.json(
      { error: "Failed to update review" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
