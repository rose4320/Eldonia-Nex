-- Eldonia-Nex: ユーザー設定・通知（設定画面ハブ用）
-- 001_profiles.sql 実行後に適用

-- ---------------------------------------------------------------------------
-- user_settings（基本情報・振込先 — 本人のみ閲覧）
-- ---------------------------------------------------------------------------
create table if not exists public.user_settings (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  legal_name text,
  country text not null default 'JP',
  address_line1 text,
  address_line2 text,
  phone text,
  bank_name text,
  bank_branch text,
  bank_account_type text,
  bank_account_number text,
  bank_account_holder text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_settings_phone_length check (phone is null or char_length(phone) <= 30),
  constraint user_settings_legal_name_length check (
    legal_name is null or char_length(legal_name) <= 80
  )
);

drop trigger if exists user_settings_set_updated_at on public.user_settings;
create trigger user_settings_set_updated_at
  before update on public.user_settings
  for each row
  execute function public.set_updated_at();

comment on table public.user_settings is 'ユーザー基本情報・振込先（プライベート）';

-- ---------------------------------------------------------------------------
-- user_notifications（告知・通知）
-- ---------------------------------------------------------------------------
create table if not exists public.user_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  kind text not null default 'notification'
    check (kind in ('notification', 'announcement')),
  title text not null,
  body text,
  href text,
  is_read boolean not null default false,
  created_at timestamptz not null default now(),
  constraint user_notifications_title_length check (char_length(title) between 1 and 120)
);

create index if not exists user_notifications_user_idx
  on public.user_notifications (user_id, created_at desc);

comment on table public.user_notifications is 'ユーザー向け告知・通知';

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.user_settings enable row level security;
alter table public.user_notifications enable row level security;

drop policy if exists "user_settings_select_own" on public.user_settings;
create policy "user_settings_select_own"
  on public.user_settings for select using (auth.uid() = user_id);

drop policy if exists "user_settings_insert_own" on public.user_settings;
create policy "user_settings_insert_own"
  on public.user_settings for insert with check (auth.uid() = user_id);

drop policy if exists "user_settings_update_own" on public.user_settings;
create policy "user_settings_update_own"
  on public.user_settings for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "user_notifications_select_own" on public.user_notifications;
create policy "user_notifications_select_own"
  on public.user_notifications for select using (auth.uid() = user_id);

drop policy if exists "user_notifications_update_own" on public.user_notifications;
create policy "user_notifications_update_own"
  on public.user_notifications for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- システムからの告知挿入用（service role / migration のみ）
drop policy if exists "user_notifications_insert_own" on public.user_notifications;
create policy "user_notifications_insert_own"
  on public.user_notifications for insert with check (auth.uid() = user_id);
