import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

/**
 * GET /api/businesses/[slug]
 * Public endpoint — returns only what the review page needs.
 * Never returns internal fields like owner_user_id or plan status.
 * Returns 404 for non-active businesses.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 });
  }

  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from("businesses")
    .select("name, slug, google_review_url, logo_url, status")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  // Return 404 for non-active businesses (paused/cancelled)
  if (data.status !== "active") {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  // Log card_tap event (fire-and-forget)
  // Need the business_id UUID for the event, so we query it separately
  const { data: businessIdRow } = await supabase
    .from("businesses")
    .select("id")
    .eq("slug", slug)
    .single();

  if (businessIdRow) {
    supabase.from("events").insert({
      business_id: businessIdRow.id,
      type: "card_tap",
      metadata: { slug },
    });
  }

  // Don't expose status to the client
  const { status: _, ...publicData } = data;
  return NextResponse.json(publicData);
}
