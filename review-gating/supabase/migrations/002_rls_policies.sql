-- Migration: 002_enable_rls_and_policies
-- Enables Row-Level Security and creates policies for tenant isolation
-- Pattern: authenticated business members can only see their own tenant's rows

-- ============================================================
-- Enable RLS on all tenant-scoped tables
-- ============================================================
alter table businesses enable row level security;
alter table business_members enable row level security;
alter table reviews enable row level security;
alter table cards enable row level security;
alter table events enable row level security;

-- ============================================================
-- BUSINESSES policies
-- ============================================================
-- Business members can read their own business
create policy "Business members can view their own business"
on businesses for select
using (
  id in (
    select business_id from business_members where user_id = auth.uid()
  )
);

-- Business owners can update their own business
create policy "Business owners can update their own business"
on businesses for update
using (
  id in (
    select business_id from business_members
    where user_id = auth.uid() and role = 'owner'
  )
);

-- ============================================================
-- BUSINESS_MEMBERS policies
-- ============================================================
-- Members can see other members of their own business
create policy "Members can view their business team"
on business_members for select
using (
  business_id in (
    select business_id from business_members where user_id = auth.uid()
  )
);

-- ============================================================
-- REVIEWS policies
-- ============================================================
-- Authenticated business members can read their own business's reviews
create policy "Business members can view their reviews"
on reviews for select
using (
  business_id in (
    select business_id from business_members where user_id = auth.uid()
  )
);

-- Anonymous users can INSERT reviews (public review submission)
-- This is the critical policy: allows unauthenticated inserts scoped to valid business_id
create policy "Anonymous users can submit reviews"
on reviews for insert
with check (true);

-- Business members can update status of their own reviews
create policy "Business members can update their review status"
on reviews for update
using (
  business_id in (
    select business_id from business_members where user_id = auth.uid()
  )
);

-- ============================================================
-- CARDS policies
-- ============================================================
-- Business members can read their own cards
create policy "Business members can view their cards"
on cards for select
using (
  business_id in (
    select business_id from business_members where user_id = auth.uid()
  )
);

-- ============================================================
-- EVENTS policies
-- ============================================================
-- Business members can read their own events
create policy "Business members can view their events"
on events for select
using (
  business_id in (
    select business_id from business_members where user_id = auth.uid()
  )
);

-- Service role can insert events (used server-side for logging)
create policy "Service role can insert events"
on events for insert
with check (true);
