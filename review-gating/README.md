# ReviewRoute — Multi-Tenant Review Platform

A Next.js + Supabase SaaS for local businesses to collect and manage customer reviews via NFC/QR cards.

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL (e.g., `https://xxx.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anonymous/public key — used by client-side auth |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key — **server-side only**, bypasses RLS for anonymous review inserts and admin operations |
| `RESEND_API_KEY` | No | Resend API key for transactional email. If not set, email notifications are silently skipped (dev mode) |
| `EMAIL_FROM` | No | From address for emails (default: `ReviewRoute <notifications@reviewroute.app>`) |
| `NEXT_PUBLIC_APP_URL` | No | App URL used in email links (default: `http://localhost:3000`) |
| `ADMIN_EMAILS` | No | Comma-separated list of emails allowed to register NFC cards via `/api/cards/register` |

## Database Setup

### 1. Run migrations

In your Supabase SQL Editor, run the migration files in order:

```
supabase/migrations/001_create_tables.sql
supabase/migrations/002_rls_policies.sql
supabase/migrations/003_seed_data.sql
```

Or via Supabase CLI:

```bash
supabase db push
```

### 2. Create a business owner user

1. Go to Supabase Dashboard > Authentication > Users
2. Create a new user with email/password
3. Copy the user's UUID
4. In SQL Editor, run:

```sql
-- Replace the UUID with your actual user ID
insert into business_members (business_id, user_id, role)
values (
  '550e8400-e29b-41d4-a716-446655440000',  -- Bean & Brew Coffee
  'your-user-uuid-here',
  'owner'
);
```

## Running Locally

```bash
npm install
npm run dev -- --webpack
```

Open [http://localhost:3000](http://localhost:3000).

## API Routes

### Public (no auth)

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/businesses/[slug]` | Business info for review page (name, logo, Google URL) |
| `POST` | `/api/reviews/submit` | Submit anonymous review (body: `{businessSlug, rating, comment?, customerName?}`) |
| `POST` | `/api/reviews/google-redirect` | Log Google redirect event (body: `{reviewId, businessSlug}`) |

### Dashboard (authenticated)

| Method | Route | Description |
|---|---|---|
| `GET` | `/api/dashboard/reviews` | List reviews (query: `?status=new&rating=5`) |
| `PATCH` | `/api/dashboard/review-status` | Update review status (body: `{reviewId, status}`) |
| `GET` | `/api/dashboard/profile` | Get business profile |
| `PATCH` | `/api/dashboard/profile` | Update business profile (owners only) |
| `GET` | `/api/dashboard/cards` | List NFC cards |

### Admin

| Method | Route | Description |
|---|---|---|
| `POST` | `/api/cards/register` | Register NFC card (body: `{businessId, cardUid}`) |

## Architecture Notes

- **Option B flow**: Private feedback is always captured first, then "Leave us a Google review" is always shown — no rating-gated redirect
- **RLS**: All tenant tables have Row-Level Security enabled. Business members can only see their own rows
- **Anonymous inserts**: Review submission uses the service-role key server-side to bypass RLS for anonymous users
- **Email**: Uses Resend. Set `RESEND_API_KEY` to enable notifications; without it, emails are silently skipped
