-- Eldonia-Nex: 有料会員向け紹介コード・QR表示用
-- 001_profiles.sql / 017_signup_onboarding.sql 実行後に適用

create table if not exists public.user_referral_codes (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  referral_code text not null unique,
  referral_url text not null,
  status text not null default 'active' check (status in ('active', 'disabled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint user_referral_codes_code_format check (referral_code ~ '^ENX-[A-Z0-9]{8}$')
);

drop trigger if exists user_referral_codes_set_updated_at on public.user_referral_codes;
create trigger user_referral_codes_set_updated_at
  before update on public.user_referral_codes
  for each row
  execute function public.set_updated_at();

comment on table public.user_referral_codes is '有料会員に付与する紹介コード・紹介URL';

alter table public.user_referral_codes enable row level security;

drop policy if exists "user_referral_codes_select_own" on public.user_referral_codes;
create policy "user_referral_codes_select_own"
  on public.user_referral_codes for select using (auth.uid() = user_id);

drop policy if exists "user_referral_codes_insert_own" on public.user_referral_codes;
create policy "user_referral_codes_insert_own"
  on public.user_referral_codes for insert with check (auth.uid() = user_id);

drop policy if exists "user_referral_codes_update_own" on public.user_referral_codes;
create policy "user_referral_codes_update_own"
  on public.user_referral_codes for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
