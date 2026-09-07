-- Migration: 005_rate_limit_and_invite
-- Rate limiting function and invite-business stored procedure

-- ============================================================
-- RATE LIMIT FUNCTION
-- Checks if a business has exceeded the submission limit in the current window.
-- Returns true if the submission should be allowed.
-- ============================================================
create or replace function check_review_rate_limit(
  p_business_id uuid,
  p_max_per_hour int default 20
)
returns boolean as $$
declare
  v_count int;
begin
  -- Count submissions in the last hour for this business
  select count(*) into v_count
  from review_submission_limits
  where business_id = p_business_id
    and window_start > now() - interval '1 hour';

  if v_count >= p_max_per_hour then
    return false;
  end if;

  -- Record this submission
  insert into review_submission_limits (business_id, window_start)
  values (p_business_id, now());

  return true;
end;
$$ language plpgsql security definer;

-- ============================================================
-- INVITE BUSINESS PROCEDURE
-- Creates a business + first owner member row in a single transaction.
-- Called by admin API route.
-- ============================================================
create or replace function invite_business(
  p_name text,
  p_slug text,
  p_google_review_url text,
  p_owner_user_id uuid
)
returns json as $$
declare
  v_business_id uuid;
  v_result json;
begin
  -- Create the business
  insert into businesses (name, slug, google_review_url, owner_user_id, plan, status)
  values (p_name, p_slug, p_google_review_url, p_owner_user_id, 'trial', 'active')
  returning id into v_business_id;

  -- Create the owner membership
  insert into business_members (business_id, user_id, role)
  values (v_business_id, p_owner_user_id, 'owner');

  -- Return the created business
  select json_build_object(
    'id', b.id,
    'name', b.name,
    'slug', b.slug,
    'google_review_url', b.google_review_url,
    'owner_user_id', b.owner_user_id,
    'plan', b.plan,
    'status', b.status,
    'created_at', b.created_at
  ) into v_result
  from businesses b
  where b.id = v_business_id;

  return v_result;
end;
$$ language plpgsql security definer;
