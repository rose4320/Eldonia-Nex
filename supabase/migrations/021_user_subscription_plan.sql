-- Eldonia-Nex: プロフィールへのプラン列・変更履歴（設定画面のプラン変更用）
-- 017_signup_onboarding.sql 実行後に適用

alter table public.profiles
  add column if not exists subscription_plan text not null default 'free'
    check (subscription_plan in ('free', 'standard', 'pro'));

comment on column public.profiles.subscription_plan is '利用プラン（user_onboarding.selected_plan と同期）';

update public.profiles p
set subscription_plan = o.selected_plan
from public.user_onboarding o
where o.user_id = p.id
  and p.subscription_plan is distinct from o.selected_plan;

create table if not exists public.user_plan_changes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  from_plan text not null
    check (from_plan in ('free', 'standard', 'pro')),
  to_plan text not null
    check (to_plan in ('free', 'standard', 'pro')),
  payment_status text not null default 'not_required'
    check (payment_status in ('not_required', 'pending', 'completed', 'failed')),
  stripe_session_id text,
  changed_via text not null default 'settings'
    check (changed_via in ('signup', 'settings', 'admin', 'stripe_webhook')),
  created_at timestamptz not null default now()
);

create index if not exists user_plan_changes_user_idx
  on public.user_plan_changes (user_id, created_at desc);

comment on table public.user_plan_changes is 'プラン変更の監査ログ';

create or replace function public.sync_subscription_plan_to_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.profiles
  set subscription_plan = new.selected_plan
  where id = new.user_id;
  return new;
end;
$$;

drop trigger if exists user_onboarding_sync_subscription_plan on public.user_onboarding;
create trigger user_onboarding_sync_subscription_plan
  after insert or update of selected_plan on public.user_onboarding
  for each row
  execute function public.sync_subscription_plan_to_profile();

alter table public.user_plan_changes enable row level security;

drop policy if exists "user_plan_changes_select_own" on public.user_plan_changes;
create policy "user_plan_changes_select_own"
  on public.user_plan_changes for select using (auth.uid() = user_id);

drop policy if exists "user_plan_changes_insert_own" on public.user_plan_changes;
create policy "user_plan_changes_insert_own"
  on public.user_plan_changes for insert with check (auth.uid() = user_id);
