import type { Business, Review, Card } from "./types";

export const MOCK_BUSINESS: Business = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  name: "Bean & Brew Coffee",
  slug: "bean-and-brew",
  google_review_url:
    "https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4",
  logo_url: null,
  owner_user_id: "550e8400-e29b-41d4-a716-446655440001",
  plan: "active",
  status: "active",
  created_at: "2024-01-15T00:00:00Z",
};

export const MOCK_REVIEWS: Review[] = [
  {
    id: "660e8400-e29b-41d4-a716-446655440001",
    business_id: "550e8400-e29b-41d4-a716-446655440000",
    rating: 5,
    comment: "Amazing coffee and wonderful atmosphere! Will definitely come back.",
    customer_name: "Sarah M.",
    customer_contact: null,
    routed_to: "google",
    status: "read",
    created_at: "2024-12-01T10:30:00Z",
  },
  {
    id: "660e8400-e29b-41d4-a716-446655440002",
    business_id: "550e8400-e29b-41d4-a716-446655440000",
    rating: 4,
    comment: "Great latte, but the wait was a bit long during rush hour.",
    customer_name: null,
    customer_contact: "james@example.com",
    routed_to: "private_feedback",
    status: "new",
    created_at: "2024-12-02T14:15:00Z",
  },
  {
    id: "660e8400-e29b-41d4-a716-446655440003",
    business_id: "550e8400-e29b-41d4-a716-446655440000",
    rating: 5,
    comment: "Best espresso in town. The baristas really know their craft.",
    customer_name: "Mike T.",
    customer_contact: null,
    routed_to: "google",
    status: "resolved",
    created_at: "2024-12-03T09:00:00Z",
  },
  {
    id: "660e8400-e29b-41d4-a716-446655440004",
    business_id: "550e8400-e29b-41d4-a716-446655440000",
    rating: 3,
    comment: "Coffee was okay but my order was incorrect.",
    customer_name: "Lisa K.",
    customer_contact: null,
    routed_to: "private_feedback",
    status: "new",
    created_at: "2024-12-04T11:45:00Z",
  },
  {
    id: "660e8400-e29b-41d4-a716-446655440005",
    business_id: "550e8400-e29b-41d4-a716-446655440000",
    rating: 5,
    comment: "Love the new seasonal menu! The pumpkin spice latte is incredible.",
    customer_name: "David R.",
    customer_contact: null,
    routed_to: "google",
    status: "read",
    created_at: "2024-12-05T16:20:00Z",
  },
];

export const MOCK_CARDS: Card[] = [
  {
    id: "770e8400-e29b-41d4-a716-446655440001",
    business_id: "550e8400-e29b-41d4-a716-446655440000",
    card_uid: "NFC-001-MAIN",
    created_at: "2024-01-20T00:00:00Z",
  },
  {
    id: "770e8400-e29b-41d4-a716-446655440002",
    business_id: "550e8400-e29b-41d4-a716-446655440000",
    card_uid: "NFC-002-TAKEAWAY",
    created_at: "2024-02-10T00:00:00Z",
  },
];
