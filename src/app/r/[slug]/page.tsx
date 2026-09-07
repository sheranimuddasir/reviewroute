import { Metadata } from "next";
import ReviewPageClient from "./ReviewPageClient";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  // In production, fetch from API
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:3000";
  let businessName = "this business";

  try {
    const res = await fetch(`${baseUrl}/api/businesses/${slug}`, {
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      businessName = data.name;
    }
  } catch {
    // Use default
  }

  return {
    title: `How was your experience at ${businessName}?`,
    description: `Share your feedback about ${businessName}`,
  };
}

export default async function ReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ReviewPageClient slug={slug} />;
}
