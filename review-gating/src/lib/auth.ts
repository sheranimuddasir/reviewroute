import { createServiceClient } from "@/lib/supabase/service";

/**
 * Resolves the caller's business_id from their auth session.
 * Uses the service-role client to bypass RLS for this lookup,
 * since the caller may be an anonymous user in some contexts.
 *
 * For authenticated dashboard routes, this should be called after
 * verifying the user has a valid session.
 */
export async function resolveBusinessId(
  userId: string
): Promise<string | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("business_members")
    .select("business_id")
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;
  return data.business_id;
}

/**
 * Checks if a user is a member (owner or staff) of the given business.
 */
export async function isBusinessMember(
  userId: string,
  businessId: string
): Promise<boolean> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("business_members")
    .select("id")
    .eq("user_id", userId)
    .eq("business_id", businessId)
    .single();

  return !error && !!data;
}

/**
 * Checks if a user is an owner of the given business.
 */
export async function isBusinessOwner(
  userId: string,
  businessId: string
): Promise<boolean> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("business_members")
    .select("id")
    .eq("user_id", userId)
    .eq("business_id", businessId)
    .eq("role", "owner")
    .single();

  return !error && !!data;
}
