import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { MOCK_CARDS, MOCK_BUSINESS } from "@/lib/mock-data";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // In production, use the real Supabase client
  if (process.env.NEXT_PUBLIC_SUPABASE_URL !== "http://localhost:54321") {
    const { data: member } = await supabase
      .from("business_members")
      .select("business_id")
      .eq("user_id", user.id)
      .single();

    if (!member) {
      return NextResponse.json(
        { error: "No business associated with this account" },
        { status: 404 }
      );
    }

    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .eq("business_id", member.business_id)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch cards" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  }

  // Mock response for development
  const filteredCards = MOCK_CARDS.filter(
    (c) => c.business_id === MOCK_BUSINESS.id
  );
  return NextResponse.json(filteredCards);
}
