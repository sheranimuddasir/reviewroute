import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { resolveBusinessId } from "@/lib/auth";

/**
 * GET /api/dashboard/cards
 * Authenticated — returns cards for the logged-in user's business.
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
    .from("cards")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[dashboard/cards] Query failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch cards" },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
