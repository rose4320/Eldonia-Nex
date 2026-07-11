-- Eldonia-Nex: COMMUNITY 掲示板
-- 001_profiles.sql 実行後に適用

create table if not exists public.community_boards (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.community_threads (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references public.community_boards (id) on delete cascade,
  author_id uuid references public.profiles (id) on delete set null,
  title text not null,
  body text not null,
  locale text not null default 'ja',
  reply_count integer not null default 0 check (reply_count >= 0),
  is_pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint community_threads_title_length check (char_length(title) between 1 and 200),
  constraint community_threads_body_length check (char_length(body) between 1 and 8000)
);

create index if not exists community_threads_board_id_idx on public.community_threads (board_id);
create index if not exists community_threads_created_at_idx on public.community_threads (created_at desc);

drop trigger if exists community_threads_set_updated_at on public.community_threads;
create trigger community_threads_set_updated_at
  before update on public.community_threads
  for each row
  execute function public.set_updated_at();

create table if not exists public.community_replies (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.community_threads (id) on delete cascade,
  author_id uuid references public.profiles (id) on delete set null,
  body text not null,
  locale text not null default 'ja',
  created_at timestamptz not null default now(),
  constraint community_replies_body_length check (char_length(body) between 1 and 4000)
);

create index if not exists community_replies_thread_id_idx on public.community_replies (thread_id);

alter table public.community_boards enable row level security;
alter table public.community_threads enable row level security;
alter table public.community_replies enable row level security;

drop policy if exists "community_boards_select" on public.community_boards;
create policy "community_boards_select" on public.community_boards for select using (true);

drop policy if exists "community_threads_select" on public.community_threads;
create policy "community_threads_select" on public.community_threads for select using (true);

drop policy if exists "community_threads_insert" on public.community_threads;
create policy "community_threads_insert" on public.community_threads
  for insert with check (auth.uid() = author_id);

drop policy if exists "community_replies_select" on public.community_replies;
create policy "community_replies_select" on public.community_replies for select using (true);

drop policy if exists "community_replies_insert" on public.community_replies;
create policy "community_replies_insert" on public.community_replies
  for insert with check (auth.uid() = author_id);

insert into public.community_boards (slug, name, description, sort_order) values
  ('general', 'General Hall', '総合・雑談', 1),
  ('gallery', 'Gallery Circle', 'GALLERY 作品について', 2),
  ('shop', 'Merchant Row', 'SHOP・取引', 3),
  ('events', 'Chronicle Plaza', 'EVENTS・参加報告', 4),
  ('works', 'Guild Board', 'WORKS・協業募集', 5),
  ('lore', 'Ancient Lore', '世界観・設定考察', 6)
on conflict (slug) do nothing;
