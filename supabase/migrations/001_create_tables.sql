-- Migration: 001_create_tables
-- Creates all core tables for the review platform
-- Run this against a fresh Supabase Postgres database

-- ============================================================
-- BUSINESSES (tenants)
-- ============================================================
create table businesses (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  google_review_url text not null,
  logo_url text,
  owner_user_id uuid references auth.users(id) on delete set null,
  plan text default 'trial' check (plan in ('trial', 'active', 'cancelled')),
  created_at timestamptz default now()
);

create index idx_businesses_slug on businesses(slug);
create index idx_businesses_owner on businesses(owner_user_id);

-- ============================================================
-- BUSINESS_MEMBERS (optional team access per business)
-- ============================================================
create table business_members (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  role text default 'owner' check (role in ('owner', 'staff')),
  created_at timestamptz default now(),
  unique(business_id, user_id)
);

create index idx_business_members_user on business_members(user_id);
create index idx_business_members_business on business_members(business_id);

-- ============================================================
-- REVIEWS (feedback submitted through the card flow)
-- ============================================================
create table reviews (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade not null,
  rating int not null check (rating between 1 and 5),
  comment text,
  customer_name text,
  customer_contact text,
  routed_to text not null check (routed_to in ('google', 'private_feedback')),
  status text default 'new' check (status in ('new', 'read', 'resolved')),
  created_at timestamptz default now()
);

create index idx_reviews_business on reviews(business_id);
create index idx_reviews_status on reviews(status);
create index idx_reviews_rating on reviews(rating);
create index idx_reviews_created on reviews(created_at desc);

-- ============================================================
-- CARDS (NFC/QR card registry)
-- ============================================================
create table cards (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade not null,
  card_uid text unique,
  created_at timestamptz default now()
);

create index idx_cards_business on cards(business_id);
create index idx_cards_uid on cards(card_uid);

-- ============================================================
-- EVENTS (analytics: taps, submissions, redirects)
-- ============================================================
create table events (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references businesses(id) on delete cascade not null,
  type text not null check (type in ('card_tap', 'review_submitted', 'google_redirect')),
  metadata jsonb,
  created_at timestamptz default now()
);

create index idx_events_business on events(business_id);
create index idx_events_type on events(type);
create index idx_events_created on events(created_at desc);
