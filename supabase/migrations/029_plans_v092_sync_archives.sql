-- Eldonia-Nex: LP Plans v0.9.2 alignment
-- - Expand plan CHECK to free/standard/premium/business
-- - Migrate legacy `pro` → `premium` (no hard delete; archive snapshots)
-- - Bidirectional plan definition sync tables (Django ↔ Supabase)

-- ---------------------------------------------------------------------------
-- 1) Archive tables (never physically delete superseded data)
-- ---------------------------------------------------------------------------

create table if not exists public.subscription_plan_archives (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  version integer not null,
  snapshot jsonb not null,
  archived_reason text not null default 'superseded',
  archived_by text not null default 'system',
  archived_at timestamptz not null default now(),
  unique (slug, version)
);

comment on table public.subscription_plan_archives is
  'Superseded subscription plan definitions. Prefer new data; keep old snapshots here.';

create table if not exists public.user_plan_assignment_archives (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  plan_slug text not null,
  payment_status text,
  snapshot jsonb not null,
  archived_reason text not null default 'plan_changed',
  archived_by text not null default 'system',
  archived_at timestamptz not null default now()
);

create index if not exists user_plan_assignment_archives_user_idx
  on public.user_plan_assignment_archives (user_id, archived_at desc);

comment on table public.user_plan_assignment_archives is
  'Previous user plan assignments archived on change (no hard delete of history).';

-- ---------------------------------------------------------------------------
-- 2) Live plan definitions (synced with Django Plan)
-- ---------------------------------------------------------------------------

create table if not exists public.subscription_plans (
  slug text primary key
    check (slug in ('free', 'standard', 'premium', 'business')),
  name text not null,
  price_yen integer not null default 0,
  currency text not null default 'JPY',
  billing_cycle text not null default 'monthly',
  shop_fee_percent numeric,
  features jsonb not null default '{}'::jsonb,
  trial_days integer not null default 0,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  version integer not null default 1,
  source text not null default 'seed'
    check (source in ('django', 'supabase', 'seed', 'migration')),
  synced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.subscription_plans is
  'Canonical live plan definitions. Bidirectionally synced with Django users_plan.';

create or replace function public.touch_subscription_plans_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists subscription_plans_touch_updated_at on public.subscription_plans;
create trigger subscription_plans_touch_updated_at
  before update on public.subscription_plans
  for each row
  execute function public.touch_subscription_plans_updated_at();

-- Seed / upsert current LP catalog
insert into public.subscription_plans as sp (
  slug, name, price_yen, shop_fee_percent, features, trial_days, is_active, sort_order, version, source
) values
  (
    'free', 'Free', 0, null,
    '{"bullets":["作品の公開（3点まで）","コミュニティ参加","基本プロフィール"],"flags":{"max_artworks":3,"shop":false}}'::jsonb,
    0, true, 1, 1, 'migration'
  ),
  (
    'standard', 'Standard', 800, 5,
    '{"bullets":["作品の無制限公開","ショップ機能（手数料5%）","イベント参加・主催","カスタムプロフィール"],"flags":{"shop":true,"events_host":true}}'::jsonb,
    14, true, 2, 1, 'migration'
  ),
  (
    'premium', 'Premium', 2980, 3,
    '{"bullets":["Standard のすべて","ショップ手数料 3%","仕事の依頼・応募","高度な分析・レポート","優先サポート"],"flags":{"shop":true,"works":true,"analytics":true}}'::jsonb,
    14, true, 3, 1, 'migration'
  ),
  (
    'business', 'Business', 10000, 3,
    '{"bullets":["法人向け機能","チーム管理・権限設定","専用サポート・SLA"],"flags":{"team":true,"works":true}}'::jsonb,
    0, true, 4, 1, 'migration'
  )
on conflict (slug) do update set
  name = excluded.name,
  price_yen = excluded.price_yen,
  shop_fee_percent = excluded.shop_fee_percent,
  features = excluded.features,
  trial_days = excluded.trial_days,
  is_active = excluded.is_active,
  sort_order = excluded.sort_order,
  version = greatest(sp.version, excluded.version),
  source = excluded.source,
  synced_at = now(),
  updated_at = now();

-- ---------------------------------------------------------------------------
-- 3) Expand CHECKs (drop old, add new including premium/business)
-- ---------------------------------------------------------------------------

alter table public.profiles drop constraint if exists profiles_subscription_plan_check;
alter table public.user_onboarding drop constraint if exists user_onboarding_selected_plan_check;
alter table public.user_plan_changes drop constraint if exists user_plan_changes_from_plan_check;
alter table public.user_plan_changes drop constraint if exists user_plan_changes_to_plan_check;

-- Archive current pro assignments before rewrite
insert into public.user_plan_assignment_archives (user_id, plan_slug, payment_status, snapshot, archived_reason, archived_by)
select
  p.id,
  p.subscription_plan,
  o.payment_status,
  jsonb_build_object(
    'profile_subscription_plan', p.subscription_plan,
    'onboarding_selected_plan', o.selected_plan,
    'payment_status', o.payment_status,
    'migrated_from', 'pro'
  ),
  'legacy_pro_migration',
  'migration_029'
from public.profiles p
left join public.user_onboarding o on o.user_id = p.id
where p.subscription_plan = 'pro'
   or o.selected_plan = 'pro';

update public.profiles
set subscription_plan = 'premium'
where subscription_plan = 'pro';

update public.user_onboarding
set selected_plan = 'premium'
where selected_plan = 'pro';

-- Keep historical change rows readable: rewrite pro → premium (original captured in archives above)
update public.user_plan_changes
set from_plan = 'premium'
where from_plan = 'pro';

update public.user_plan_changes
set to_plan = 'premium'
where to_plan = 'pro';

alter table public.profiles
  add constraint profiles_subscription_plan_check
  check (subscription_plan in ('free', 'standard', 'premium', 'business'));

alter table public.user_onboarding
  add constraint user_onboarding_selected_plan_check
  check (selected_plan in ('free', 'standard', 'premium', 'business'));

alter table public.user_plan_changes
  add constraint user_plan_changes_from_plan_check
  check (from_plan in ('free', 'standard', 'premium', 'business'));

alter table public.user_plan_changes
  add constraint user_plan_changes_to_plan_check
  check (to_plan in ('free', 'standard', 'premium', 'business'));

-- Allow archive-aware change sources
alter table public.user_plan_changes drop constraint if exists user_plan_changes_changed_via_check;
alter table public.user_plan_changes
  add constraint user_plan_changes_changed_via_check
  check (changed_via in ('signup', 'settings', 'admin', 'stripe_webhook', 'sync'));

-- ---------------------------------------------------------------------------
-- 4) RLS for new tables
-- ---------------------------------------------------------------------------

alter table public.subscription_plans enable row level security;
alter table public.subscription_plan_archives enable row level security;
alter table public.user_plan_assignment_archives enable row level security;

drop policy if exists "subscription_plans_select_all" on public.subscription_plans;
create policy "subscription_plans_select_all"
  on public.subscription_plans for select
  using (true);

drop policy if exists "user_plan_assignment_archives_select_own" on public.user_plan_assignment_archives;
create policy "user_plan_assignment_archives_select_own"
  on public.user_plan_assignment_archives for select
  using (auth.uid() = user_id);

-- Archives of plan definitions: authenticated read (ops transparency)
drop policy if exists "subscription_plan_archives_select_auth" on public.subscription_plan_archives;
create policy "subscription_plan_archives_select_auth"
  on public.subscription_plan_archives for select
  to authenticated
  using (true);

grant select on public.subscription_plans to anon, authenticated;
grant select on public.subscription_plan_archives to authenticated;
grant select on public.user_plan_assignment_archives to authenticated;
