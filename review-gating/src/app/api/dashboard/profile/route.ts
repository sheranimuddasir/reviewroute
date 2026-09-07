import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { resolveBusinessId, isBusinessOwner } from "@/lib/auth";

/**
 * GET /api/dashboard/profile
 * Authenticated — returns the business profile for the logged-in user's business.
 */
export async function GET() {
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

  const serviceSupabase = createServiceClient();
  const { data, error } = await serviceSupabase
    .from("businesses")
    .select("*")
    .eq("id", businessId)
    .single();

  if (error) {
    console.error("[dashboard/profile] Query failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch business" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}

/**
 * PATCH /api/dashboard/profile
 * Authenticated — updates business profile. Only owners can update.
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

  // Only owners can update business profile
  const owner = await isBusinessOwner(user.id, businessId);
  if (!owner) {
    return NextResponse.json(
      { error: "Only business owners can update the profile" },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { name, google_review_url, logo_url } = body;

  const updates: Record<string, unknown> = {};
  if (name && typeof name === "string") updates.name = name;
  if (google_review_url && typeof google_review_url === "string")
    updates.google_review_url = google_review_url;
  if (logo_url !== undefined) updates.logo_url = logo_url || null;

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "No valid fields to update" },
      { status: 400 }
    );
  }

  const serviceSupabase = createServiceClient();
  const { error } = await serviceSupabase
    .from("businesses")
    .update(updates)
    .eq("id", businessId);

  if (error) {
    console.error("[dashboard/profile] Update failed:", error);
    return NextResponse.json(
      { error: "Failed to update business" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
