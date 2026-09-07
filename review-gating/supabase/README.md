# Supabase Setup Guide

## Running Migrations

### Option A: Supabase SQL Editor (recommended for first setup)

1. Go to your Supabase project dashboard > SQL Editor
2. Run each migration file in order:

```
supabase/migrations/001_create_tables.sql
supabase/migrations/002_rls_policies.sql
supabase/migrations/003_seed_data.sql
supabase/migrations/004_indexes_and_hardening.sql
supabase/migrations/005_rate_limit_and_invite.sql
```

### Option B: Supabase CLI

```bash
supabase db push
```

## Post-Migration Setup

### 1. Create your first admin user

After migrations, create a Supabase Auth user, then make them an admin:

```sql
-- Replace the UUID with your actual auth.users ID
insert into admin_users (user_id) values ('your-user-uuid-here');
```

### 2. Create a business owner

```sql
-- Option A: Use the stored procedure (creates business + owner in one transaction)
select invite_business(
  'Bean & Brew Coffee',
  'bean-and-brew',
  'https://search.google.com/local/writereview?placeid=ChIJ...',
  'owner-user-uuid-here'
);

-- Option B: Manual insert (if business already exists)
insert into business_members (business_id, user_id, role)
values ('business-uuid-here', 'owner-user-uuid-here', 'owner');
```

### 3. Environment Variables

| Variable | Description |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Used server-side for admin operations, anonymous inserts, rate limit checks |
| `REVIEW_RATE_LIMIT` | Max submissions per business per hour (default: 20) |

## Rate Limiting

Rate limiting uses the `review_submission_limits` table and the `check_review_rate_limit()` function. The threshold is configurable via the `REVIEW_RATE_LIMIT` env var (default: 20/hour per business).

## Backup & Point-in-Time Recovery

Supabase Pro plan includes:
- **Daily automated backups** (7-day retention on Pro)
- **Point-in-time recovery (PITR)** — must be manually enabled in your project settings under Database > Backups
- PITR allows restoring to any point in the last 7 days (Pro) or 30 days (Team/Enterprise)

**Note:** PITR is not enabled by default. Go to Project Settings > Database > Backups > Enable PITR.

## Table Summary

| Table | Purpose | RLS |
|---|---|---|
| `businesses` | Tenant records | Members can read/update their own |
| `business_members` | User-business associations | Members can see their team |
| `reviews` | Customer feedback | Members read own; anonymous insert allowed |
| `cards` | NFC card registry | Members read own; service-role inserts |
| `events` | Analytics log | Members read own; service-role inserts |
| `admin_users` | Admin authorization | No public policies (service-role only) |
| `review_submission_limits` | Rate limit tracking | No public policies (service-role only) |
