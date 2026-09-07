import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM_EMAIL =
  process.env.EMAIL_FROM || "ReviewRoute <notifications@reviewroute.app>";

type Business = {
  name: string;
  owner_user_id: string | null;
};

type Review = {
  rating: number;
  comment: string | null;
  customer_name: string | null;
  created_at: string;
};

/**
 * Sends a notification email to a business when a new review is submitted.
 *
 * This function is intentionally isolated so it can be:
 * - Swapped for a different provider (Postmark, SendGrid, etc.)
 * - Extended to support digest mode (batch reviews into one email)
 * - Made async/non-blocking without affecting the review submission flow
 *
 * If RESEND_API_KEY is not set, this silently does nothing (dev mode).
 */
export async function sendNewReviewNotification(
  business: Business,
  review: Review
): Promise<void> {
  if (!resend) {
    console.log(
      "[email] RESEND_API_KEY not set — skipping notification for review"
    );
    return;
  }

  const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
  const customerLine = review.customer_name
    ? ` from ${review.customer_name}`
    : "";

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: "owner@example.com", // In production, resolve this from business.owner_user_id via Supabase Auth
      subject: `New ${review.rating}-star review for ${business.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #0f172a;">New Review Received</h2>
          <p style="color: #64748b;">
            <strong>${business.name}</strong> received a new review${customerLine}.
          </p>
          <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <p style="font-size: 24px; margin: 0 0 8px 0;">${stars}</p>
            ${
              review.comment
                ? `<p style="color: #0f172a; margin: 0 0 8px 0;">"${review.comment}"</p>`
                : ""
            }
            <p style="color: #64748b; font-size: 12px; margin: 0;">
              ${new Date(review.created_at).toLocaleDateString()}
            </p>
          </div>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/reviews"
             style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
            View in Dashboard
          </a>
        </div>
      `,
    });
    console.log(`[email] Notification sent for review in ${business.name}`);
  } catch (error) {
    console.error("[email] Failed to send notification:", error);
    // Don't throw — email failure shouldn't block review submission
  }
}
