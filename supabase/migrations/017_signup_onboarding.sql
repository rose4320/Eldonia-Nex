-- Eldonia-Nex: サインアップオンボーディング・項目別規約承認
-- 001_profiles.sql / 011_user_settings.sql 実行後に適用

-- ---------------------------------------------------------------------------
-- user_onboarding（登録フローの進行・プラン・決済状態）
-- ---------------------------------------------------------------------------
create table if not exists public.user_onboarding (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  selected_plan text not null default 'free'
    check (selected_plan in ('free', 'standard', 'pro')),
  payment_status text not null default 'not_required'
    check (payment_status in ('not_required', 'pending', 'completed', 'failed')),
  stripe_session_id text,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists user_onboarding_set_updated_at on public.user_onboarding;
create trigger user_onboarding_set_updated_at
  before update on public.user_onboarding
  for each row
  execute function public.set_updated_at();

comment on table public.user_onboarding is '新規登録オンボーディングのプラン・決済・完了状態';

-- ---------------------------------------------------------------------------
-- user_consents（規約を項目別・バージョン別に保存）
-- ---------------------------------------------------------------------------
create table if not exists public.user_consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  consent_type text not null,
  document_title text not null,
  document_version text not null,
  agreed_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint user_consents_unique_version
    unique (user_id, consent_type, document_version)
);

create index if not exists user_consents_user_idx
  on public.user_consents (user_id, agreed_at desc);

comment on table public.user_consents is '利用規約・プライバシーポリシー等の項目別同意記録';

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.user_onboarding enable row level security;
alter table public.user_consents enable row level security;

drop policy if exists "user_onboarding_select_own" on public.user_onboarding;
create policy "user_onboarding_select_own"
  on public.user_onboarding for select using (auth.uid() = user_id);

drop policy if exists "user_onboarding_insert_own" on public.user_onboarding;
create policy "user_onboarding_insert_own"
  on public.user_onboarding for insert with check (auth.uid() = user_id);

drop policy if exists "user_onboarding_update_own" on public.user_onboarding;
create policy "user_onboarding_update_own"
  on public.user_onboarding for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "user_consents_select_own" on public.user_consents;
create policy "user_consents_select_own"
  on public.user_consents for select using (auth.uid() = user_id);

drop policy if exists "user_consents_insert_own" on public.user_consents;
create policy "user_consents_insert_own"
  on public.user_consents for insert with check (auth.uid() = user_id);

drop policy if exists "user_consents_update_own" on public.user_consents;
create policy "user_consents_update_own"
  on public.user_consents for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
