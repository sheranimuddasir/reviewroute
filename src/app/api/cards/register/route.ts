import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

/**
 * POST /api/cards/register
 * Admin-only endpoint — links a physical NFC card UID to a business.
 * Uses admin_users table for authorization (not env var email list).
 * Uses service-role client to bypass RLS for card insertion (intentional for admin route).
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check admin_users table for authorization
  const serviceSupabase = createServiceClient();
  const { data: adminRecord, error: adminError } = await serviceSupabase
    .from("admin_users")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (adminError || !adminRecord) {
    return NextResponse.json(
      { error: "Admin access required" },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { businessId, cardUid } = body;

  if (!businessId || !cardUid) {
    return NextResponse.json(
      { error: "businessId and cardUid are required" },
      { status: 400 }
    );
  }

  if (typeof cardUid !== "string" || cardUid.length > 100) {
    return NextResponse.json(
      { error: "cardUid must be a string under 100 characters" },
      { status: 400 }
    );
  }

  // Verify the business exists
  const { data: business, error: businessError } = await serviceSupabase
    .from("businesses")
    .select("id")
    .eq("id", businessId)
    .single();

  if (businessError || !business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  // Check for duplicate card UID
  const { data: existing } = await serviceSupabase
    .from("cards")
    .select("id")
    .eq("card_uid", cardUid)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "A card with this UID is already registered" },
      { status: 409 }
    );
  }

  // Register the card (service-role bypasses RLS — intentional for admin-only route)
  const { data: card, error: cardError } = await serviceSupabase
    .from("cards")
    .insert({
      business_id: businessId,
      card_uid: cardUid,
    })
    .select()
    .single();

  if (cardError) {
    console.error("[cards/register] Insert failed:", cardError);
    return NextResponse.json(
      { error: "Failed to register card" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    card: {
      id: card.id,
      business_id: card.business_id,
      card_uid: card.card_uid,
      created_at: card.created_at,
    },
  });
}
