-- Eldonia-Nex: GALLEY 作品いいね
-- 013_gallery_engagement.sql 実行後に適用

create table if not exists public.artwork_likes (
  artwork_id uuid not null references public.artworks (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (artwork_id, user_id)
);

create index if not exists artwork_likes_artwork_id_idx
  on public.artwork_likes (artwork_id, created_at desc);

comment on table public.artwork_likes is 'GALLEY 作品いいね';

alter table public.artwork_likes enable row level security;

drop policy if exists "artwork_likes_select" on public.artwork_likes;
create policy "artwork_likes_select"
  on public.artwork_likes
  for select
  using (true);

drop policy if exists "artwork_likes_insert_own" on public.artwork_likes;
create policy "artwork_likes_insert_own"
  on public.artwork_likes
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "artwork_likes_delete_own" on public.artwork_likes;
create policy "artwork_likes_delete_own"
  on public.artwork_likes
  for delete
  using (auth.uid() = user_id);

grant select, insert, delete on public.artwork_likes to authenticated;
grant select on public.artwork_likes to anon;
