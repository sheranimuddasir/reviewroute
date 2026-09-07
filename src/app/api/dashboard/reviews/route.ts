import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { resolveBusinessId } from "@/lib/auth";

/**
 * GET /api/dashboard/reviews
 * Authenticated — returns reviews for the logged-in user's business.
 * Supports filtering by status and rating via query params.
 */
export async function GET(request: Request) {
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

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const rating = searchParams.get("rating");

  // Use service client to query with explicit business_id check
  const { createServiceClient } = await import("@/lib/supabase/service");
  const serviceSupabase = createServiceClient();

  let query = serviceSupabase
    .from("reviews")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  if (status && ["new", "read", "resolved"].includes(status)) {
    query = query.eq("status", status);
  }
  if (rating && ["1", "2", "3", "4", "5"].includes(rating)) {
    query = query.eq("rating", parseInt(rating));
  }

  const { data, error } = await query;

  if (error) {
    console.error("[dashboard/reviews] Query failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
