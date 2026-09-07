-- Migration: 004_indexes_and_hardening
-- Production hardening: admin_users table, business status, rate limiting, composite indexes

-- ============================================================
-- ADMIN_USERS table
-- Replaces the env-var email list for admin authorization.
-- Only service role can read/write this table (no public RLS policies).
-- ============================================================
create table admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  created_at timestamptz default now()
);

alter table admin_users enable row level security;

-- No public policies — only service role can access this table.
-- This means admin checks must use the service-role client server-side.

-- ============================================================
-- BUSINESS STATUS column (soft-delete / pause path)
-- ============================================================
-- Note: businesses already has a 'plan' column (trial/active/cancelled).
-- 'status' is separate: it controls visibility on the public review page.
-- A business can be 'active' with a 'trial' plan, or 'paused' while on 'active' plan.
alter table businesses add column status text default 'active'
  check (status in ('active', 'paused', 'cancelled'));

-- ============================================================
-- RATE LIMITING: review_submissions table
-- Lightweight table to track submission counts per business per time window.
-- ============================================================
create table review_submission_limits (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade not null,
  window_start timestamptz not null default now(),
  submission_count int not null default 1
);

create index idx_submission_limits_business_window
on review_submission_limits(business_id, window_start desc);

alter table review_submission_limits enable row level security;

-- No public policies — only service role uses this table for rate limit checks.

-- ============================================================
-- COMPOSITE INDEX for dashboard reviews query
-- The dashboard queries filter by (business_id, status) and sort by created_at desc.
-- ============================================================
create index idx_reviews_business_status_created
on reviews(business_id, status, created_at desc);

-- ============================================================
-- Seed: mark existing test businesses as 'active'
-- ============================================================
update businesses set status = 'active' where status is null;
