-- Eldonia-Nex: user presence for ops live monitoring
-- FE heartbeat → user_presence → Django Admin live panel

create table if not exists public.user_presence (
  user_id uuid primary key references public.profiles (id) on delete cascade,
  path text not null default '/',
  area text not null default 'other',
  title text not null default '',
  is_authenticated boolean not null default true,
  last_seen_at timestamptz not null default now(),
  user_agent text null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_presence_last_seen_idx
  on public.user_presence (last_seen_at desc);

create index if not exists user_presence_area_idx
  on public.user_presence (area, last_seen_at desc);

drop trigger if exists user_presence_set_updated_at on public.user_presence;
create trigger user_presence_set_updated_at
  before update on public.user_presence
  for each row
  execute function public.set_updated_at();

alter table public.user_presence enable row level security;

-- Users can upsert/update only their own row
drop policy if exists "user_presence_select_own" on public.user_presence;
create policy "user_presence_select_own"
  on public.user_presence for select
  using (auth.uid() = user_id);

drop policy if exists "user_presence_insert_own" on public.user_presence;
create policy "user_presence_insert_own"
  on public.user_presence for insert
  with check (auth.uid() = user_id);

drop policy if exists "user_presence_update_own" on public.user_presence;
create policy "user_presence_update_own"
  on public.user_presence for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Ops admins can read all presence (Next admin / service role bypasses RLS)
drop policy if exists "user_presence_select_ops" on public.user_presence;
create policy "user_presence_select_ops"
  on public.user_presence for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and coalesce(p.is_ops_admin, false) = true
    )
  );

comment on table public.user_presence is
  'Realtime-ish user location for Nexus Operations Console (heartbeat from FE)';
