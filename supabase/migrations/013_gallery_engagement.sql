-- Eldonia-Nex: GALLEY 作品エンゲージメント（コメント・ファン・コラボ申請）
-- 002_artworks.sql 実行後に適用

-- ---------------------------------------------------------------------------
-- collab_request_status
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'collab_request_status') then
    create type public.collab_request_status as enum (
      'pending',
      'accepted',
      'declined',
      'cancelled'
    );
  end if;
end $$;

grant usage on type public.collab_request_status to anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- artwork_comments
-- ---------------------------------------------------------------------------
create table if not exists public.artwork_comments (
  id uuid primary key default gen_random_uuid(),
  artwork_id uuid not null references public.artworks (id) on delete cascade,
  author_id uuid not null references public.profiles (id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint artwork_comments_body_length check (char_length(body) between 1 and 2000)
);

create index if not exists artwork_comments_artwork_id_idx
  on public.artwork_comments (artwork_id, created_at desc);

drop trigger if exists artwork_comments_set_updated_at on public.artwork_comments;
create trigger artwork_comments_set_updated_at
  before update on public.artwork_comments
  for each row
  execute function public.set_updated_at();

comment on table public.artwork_comments is 'GALLEY 作品コメント';

alter table public.artwork_comments enable row level security;

drop policy if exists "artwork_comments_select" on public.artwork_comments;
create policy "artwork_comments_select"
  on public.artwork_comments
  for select
  using (
    exists (
      select 1
      from public.artworks a
      where a.id = artwork_id
        and (a.is_public = true or auth.uid() = a.creator_id)
    )
    or auth.uid() = author_id
  );

drop policy if exists "artwork_comments_insert_own" on public.artwork_comments;
create policy "artwork_comments_insert_own"
  on public.artwork_comments
  for insert
  with check (auth.uid() = author_id);

drop policy if exists "artwork_comments_update_own" on public.artwork_comments;
create policy "artwork_comments_update_own"
  on public.artwork_comments
  for update
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

drop policy if exists "artwork_comments_delete_own" on public.artwork_comments;
create policy "artwork_comments_delete_own"
  on public.artwork_comments
  for delete
  using (auth.uid() = author_id);

-- ---------------------------------------------------------------------------
-- creator_fans（クリエイターへのファン登録）
-- ---------------------------------------------------------------------------
create table if not exists public.creator_fans (
  fan_id uuid not null references public.profiles (id) on delete cascade,
  creator_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (fan_id, creator_id),
  constraint creator_fans_no_self check (fan_id <> creator_id)
);

create index if not exists creator_fans_creator_id_idx
  on public.creator_fans (creator_id, created_at desc);

comment on table public.creator_fans is 'クリエイターへのファン登録';

alter table public.creator_fans enable row level security;

drop policy if exists "creator_fans_select" on public.creator_fans;
create policy "creator_fans_select"
  on public.creator_fans
  for select
  using (true);

drop policy if exists "creator_fans_insert_own" on public.creator_fans;
create policy "creator_fans_insert_own"
  on public.creator_fans
  for insert
  with check (auth.uid() = fan_id and fan_id <> creator_id);

drop policy if exists "creator_fans_delete_own" on public.creator_fans;
create policy "creator_fans_delete_own"
  on public.creator_fans
  for delete
  using (auth.uid() = fan_id);

-- ---------------------------------------------------------------------------
-- collab_requests（作品に対するコラボ申請）
-- ---------------------------------------------------------------------------
create table if not exists public.collab_requests (
  id uuid primary key default gen_random_uuid(),
  artwork_id uuid not null references public.artworks (id) on delete cascade,
  requester_id uuid not null references public.profiles (id) on delete cascade,
  creator_id uuid not null references public.profiles (id) on delete cascade,
  message text,
  status public.collab_request_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint collab_requests_message_length check (
    message is null or char_length(message) <= 1000
  ),
  constraint collab_requests_no_self check (requester_id <> creator_id)
);

create index if not exists collab_requests_creator_id_idx
  on public.collab_requests (creator_id, created_at desc);

create unique index if not exists collab_requests_pending_unique
  on public.collab_requests (artwork_id, requester_id)
  where status = 'pending';

drop trigger if exists collab_requests_set_updated_at on public.collab_requests;
create trigger collab_requests_set_updated_at
  before update on public.collab_requests
  for each row
  execute function public.set_updated_at();

comment on table public.collab_requests is 'GALLEY 作品へのコラボ申請';

alter table public.collab_requests enable row level security;

drop policy if exists "collab_requests_select_parties" on public.collab_requests;
create policy "collab_requests_select_parties"
  on public.collab_requests
  for select
  using (auth.uid() = requester_id or auth.uid() = creator_id);

drop policy if exists "collab_requests_insert_own" on public.collab_requests;
create policy "collab_requests_insert_own"
  on public.collab_requests
  for insert
  with check (
    auth.uid() = requester_id
    and requester_id <> creator_id
  );

drop policy if exists "collab_requests_update_parties" on public.collab_requests;
create policy "collab_requests_update_parties"
  on public.collab_requests
  for update
  using (auth.uid() = requester_id or auth.uid() = creator_id)
  with check (auth.uid() = requester_id or auth.uid() = creator_id);

grant select, insert, update, delete on public.artwork_comments to authenticated;
grant select on public.artwork_comments to anon;

grant select, insert, delete on public.creator_fans to authenticated;
grant select on public.creator_fans to anon;

grant select, insert, update on public.collab_requests to authenticated;
