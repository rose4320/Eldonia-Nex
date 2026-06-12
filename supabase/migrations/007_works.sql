-- Eldonia-Nex: WORKS 求人・ポートフォリオ
-- 001_profiles.sql 実行後に適用

do $$
begin
  if not exists (select 1 from pg_type where typname = 'job_type') then
    create type public.job_type as enum ('freelance', 'full_time', 'part_time', 'collab');
  end if;
  if not exists (select 1 from pg_type where typname = 'job_status') then
    create type public.job_status as enum ('open', 'closed', 'filled');
  end if;
  if not exists (select 1 from pg_type where typname = 'portfolio_visibility') then
    create type public.portfolio_visibility as enum ('public', 'employers_only', 'private');
  end if;
end $$;

create table if not exists public.portfolios (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles (id) on delete cascade,
  headline text,
  summary text,
  skills text[] not null default '{}',
  exp_points integer not null default 0 check (exp_points >= 0),
  level integer not null default 1 check (level >= 1),
  title_badge text,
  visibility public.portfolio_visibility not null default 'public',
  attach_on_apply boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists portfolios_set_updated_at on public.portfolios;
create trigger portfolios_set_updated_at
  before update on public.portfolios
  for each row
  execute function public.set_updated_at();

create table if not exists public.job_listings (
  id uuid primary key default gen_random_uuid(),
  poster_id uuid references public.profiles (id) on delete set null,
  title text not null,
  description text not null,
  job_type public.job_type not null default 'freelance',
  location text,
  budget_min integer check (budget_min is null or budget_min >= 0),
  budget_max integer check (budget_max is null or budget_max >= 0),
  skills_required text[] not null default '{}',
  status public.job_status not null default 'open',
  is_featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint job_listings_title_length check (char_length(title) between 1 and 120)
);

create index if not exists job_listings_status_idx on public.job_listings (status) where status = 'open';

drop trigger if exists job_listings_set_updated_at on public.job_listings;
create trigger job_listings_set_updated_at
  before update on public.job_listings
  for each row
  execute function public.set_updated_at();

create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.job_listings (id) on delete cascade,
  applicant_id uuid not null references public.profiles (id) on delete cascade,
  cover_message text,
  portfolio_snapshot jsonb,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  unique (job_id, applicant_id)
);

alter table public.portfolios enable row level security;
alter table public.job_listings enable row level security;
alter table public.job_applications enable row level security;

drop policy if exists "portfolios_select" on public.portfolios;
create policy "portfolios_select" on public.portfolios
  for select using (
    visibility = 'public'
    or auth.uid() = user_id
    or (visibility = 'employers_only' and auth.uid() is not null)
  );

drop policy if exists "portfolios_manage_own" on public.portfolios;
create policy "portfolios_manage_own" on public.portfolios
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "job_listings_select" on public.job_listings;
create policy "job_listings_select" on public.job_listings for select using (true);

drop policy if exists "job_listings_insert" on public.job_listings;
create policy "job_listings_insert" on public.job_listings
  for insert with check (auth.uid() = poster_id);

drop policy if exists "job_applications_select" on public.job_applications;
create policy "job_applications_select" on public.job_applications
  for select using (auth.uid() = applicant_id or auth.uid() in (
    select poster_id from public.job_listings where id = job_id
  ));

drop policy if exists "job_applications_insert" on public.job_applications;
create policy "job_applications_insert" on public.job_applications
  for insert with check (auth.uid() = applicant_id);

insert into public.job_listings (
  title, description, job_type, location, budget_min, budget_max,
  skills_required, is_featured
) values
  (
    'ファンタジーBGMコンポーザー（短期）',
    'TRPG用 BGM 5 曲。ダークファンタジー調。リファレンス共有あり。',
    'freelance', 'リモート', 80000, 150000,
    array['作曲', 'DAW', 'オーケストラ'], true
  ),
  (
    'キャラクターデザイナー（協業）',
    'インディーゲームの主要キャラ 3 体。世界観資料あり。',
    'collab', 'ハイブリッド', null, null,
    array['イラスト', 'キャラデザ', 'Blender'], true
  ),
  (
    'ライブ2Dモデラー',
    'VTuber 向け Live2D モデル制作。分割納品可。',
    'freelance', 'リモート', 200000, 350000,
    array['Live2D', 'Illustrator'], false
  ),
  (
    'コミュニティモデレーター（パート）',
    'Discord / 掲示板のモデレーション。日本語・英語。',
    'part_time', 'リモート', 1500, 2000,
    array['モデレーション', '英語'], false
  )
on conflict do nothing;
