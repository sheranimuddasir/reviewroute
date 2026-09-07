import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { resolveBusinessId } from "@/lib/auth";

/**
 * POST /api/admin/invite-business
 * Admin-only endpoint — creates a business and the first owner member row.
 * Uses the invite_business() stored procedure for atomic transaction.
 */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify caller is an admin
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
  const { name, slug, googleReviewUrl, ownerUserId } = body;

  // Validate required fields
  if (!name || !slug || !googleReviewUrl || !ownerUserId) {
    return NextResponse.json(
      { error: "name, slug, googleReviewUrl, and ownerUserId are required" },
      { status: 400 }
    );
  }

  // Validate slug format
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json(
      { error: "slug must be lowercase alphanumeric with hyphens only" },
      { status: 400 }
    );
  }

  // Check slug uniqueness
  const { data: existing } = await serviceSupabase
    .from("businesses")
    .select("id")
    .eq("slug", slug)
    .single();

  if (existing) {
    return NextResponse.json(
      { error: "A business with this slug already exists" },
      { status: 409 }
    );
  }

  // Call the stored procedure to create business + owner member atomically
  const { data: result, error: procError } = await serviceSupabase.rpc(
    "invite_business",
    {
      p_name: name,
      p_slug: slug,
      p_google_review_url: googleReviewUrl,
      p_owner_user_id: ownerUserId,
    }
  );

  if (procError) {
    console.error("[admin/invite-business] Procedure failed:", procError);
    return NextResponse.json(
      { error: "Failed to create business" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true, business: result });
}
