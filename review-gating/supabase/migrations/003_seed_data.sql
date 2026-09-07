-- Seed script: 003_seed_data
-- Creates fake businesses, members, reviews, and cards for local dev/testing
-- Run AFTER migrations 001 and 002

-- ============================================================
-- NOTE: These UUIDs are fixed so the frontend mock data can reference them.
-- In production, real Supabase Auth users would be created first.
-- ============================================================

-- Insert businesses
insert into businesses (id, name, slug, google_review_url, logo_url, owner_user_id, plan)
values
  (
    '550e8400-e29b-41d4-a716-446655440000',
    'Bean & Brew Coffee',
    'bean-and-brew',
    'https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4',
    null,
    null,
    'active'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440001',
    'Sunrise Dental Clinic',
    'sunrise-dental',
    'https://search.google.com/local/writereview?placeid=ChIJ_example_dental',
    null,
    null,
    'active'
  ),
  (
    '550e8400-e29b-41d4-a716-446655440002',
    'The Golden Fork',
    'golden-fork',
    'https://search.google.com/local/writereview?placeid=ChIJ_example_fork',
    null,
    null,
    'trial'
  );

-- Insert reviews for Bean & Brew Coffee
insert into reviews (id, business_id, rating, comment, customer_name, customer_contact, routed_to, status, created_at)
values
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 5, 'Amazing coffee and wonderful atmosphere! Will definitely come back.', 'Sarah M.', null, 'private_feedback', 'read', '2024-12-01T10:30:00Z'),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 4, 'Great latte, but the wait was a bit long during rush hour.', null, 'james@example.com', 'private_feedback', 'new', '2024-12-02T14:15:00Z'),
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', 5, 'Best espresso in town. The baristas really know their craft.', 'Mike T.', null, 'google', 'resolved', '2024-12-03T09:00:00Z'),
  ('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', 3, 'Coffee was okay but my order was incorrect.', 'Lisa K.', null, 'private_feedback', 'new', '2024-12-04T11:45:00Z'),
  ('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440000', 5, 'Love the new seasonal menu! The pumpkin spice latte is incredible.', 'David R.', null, 'google', 'read', '2024-12-05T16:20:00Z');

-- Insert reviews for Sunrise Dental
insert into reviews (id, business_id, rating, comment, customer_name, customer_contact, routed_to, status, created_at)
values
  ('660e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001', 5, 'Dr. Smith was incredibly gentle and professional. Best dental experience ever!', 'Anna P.', 'anna@example.com', 'google', 'read', '2024-12-01T09:00:00Z'),
  ('660e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', 4, 'Quick and efficient cleaning. Friendly staff.', null, null, 'private_feedback', 'new', '2024-12-03T11:30:00Z'),
  ('660e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440001', 5, 'The whole team is wonderful. My kids actually look forward to their checkups!', 'Tom H.', null, 'google', 'resolved', '2024-12-05T14:00:00Z');

-- Insert cards
insert into cards (id, business_id, card_uid, created_at)
values
  ('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'NFC-001-MAIN', '2024-01-20T00:00:00Z'),
  ('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'NFC-002-TAKEAWAY', '2024-02-10T00:00:00Z'),
  ('770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'NFC-003-DENTAL', '2024-01-25T00:00:00Z');

-- Insert some events
insert into events (business_id, type, metadata, created_at)
values
  ('550e8400-e29b-41d4-a716-446655440000', 'card_tap', '{"card_uid": "NFC-001-MAIN"}', '2024-12-01T10:25:00Z'),
  ('550e8400-e29b-41d4-a716-446655440000', 'review_submitted', '{"review_id": "660e8400-e29b-41d4-a716-446655440001", "rating": 5}', '2024-12-01T10:30:00Z'),
  ('550e8400-e29b-41d4-a716-446655440000', 'google_redirect', '{"review_id": "660e8400-e29b-41d4-a716-446655440001"}', '2024-12-01T10:30:30Z'),
  ('550e8400-e29b-41d4-a716-446655440000', 'card_tap', '{"card_uid": "NFC-001-MAIN"}', '2024-12-02T14:10:00Z'),
  ('550e8400-e29b-41d4-a716-446655440000', 'review_submitted', '{"review_id": "660e8400-e29b-41d4-a716-446655440002", "rating": 4}', '2024-12-02T14:15:00Z');
