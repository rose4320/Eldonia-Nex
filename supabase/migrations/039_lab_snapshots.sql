-- Eldonia-Nex: Lab snapshots + publish versions (Phase 1 schema)
-- Snapshot = restore point inside Lab
-- Publish  = deliverable pointer for Gallery / Works (payload kept; media export later)

create table if not exists public.lab_snapshots (
  id uuid primary key default gen_random_uuid(),
  lab_id uuid not null references public.collab_labs (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete restrict,
  label text not null,
  kind text not null default 'snapshot'
    check (kind in ('snapshot', 'publish')),
  schema_version int not null default 1,
  payload jsonb not null default '{}'::jsonb,
  archived boolean not null default false,
  archived_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lab_snapshots_label_length check (char_length(label) between 1 and 120)
);

create index if not exists lab_snapshots_lab_id_created_idx
  on public.lab_snapshots (lab_id, created_at desc);

create index if not exists lab_snapshots_lab_kind_idx
  on public.lab_snapshots (lab_id, kind)
  where archived = false;

comment on table public.lab_snapshots is
  'Lab room snapshots (restore) and publish versions (Gallery/Works deliverable pointers)';

drop trigger if exists lab_snapshots_set_updated_at on public.lab_snapshots;
create trigger lab_snapshots_set_updated_at
  before update on public.lab_snapshots
  for each row
  execute function public.set_updated_at();

alter table public.lab_snapshots enable row level security;

-- Members can read non-archived (and archived for history UI later — allow all member reads)
drop policy if exists "lab_snapshots_select_member" on public.lab_snapshots;
create policy "lab_snapshots_select_member"
  on public.lab_snapshots
  for select
  using (
    exists (
      select 1 from public.collab_lab_members m
      where m.lab_id = lab_id and m.user_id = auth.uid()
    )
  );

-- Any member can create a snapshot / publish candidate
drop policy if exists "lab_snapshots_insert_member" on public.lab_snapshots;
create policy "lab_snapshots_insert_member"
  on public.lab_snapshots
  for insert
  with check (
    auth.uid() = created_by
    and exists (
      select 1 from public.collab_lab_members m
      where m.lab_id = lab_id and m.user_id = auth.uid()
    )
  );

-- Soft-archive / label update: owner (leader) or creator
drop policy if exists "lab_snapshots_update_leader_or_creator" on public.lab_snapshots;
create policy "lab_snapshots_update_leader_or_creator"
  on public.lab_snapshots
  for update
  using (
    auth.uid() = created_by
    or exists (
      select 1 from public.collab_lab_members m
      where m.lab_id = lab_id
        and m.user_id = auth.uid()
        and m.role = 'owner'
    )
  )
  with check (
    auth.uid() = created_by
    or exists (
      select 1 from public.collab_lab_members m
      where m.lab_id = lab_id
        and m.user_id = auth.uid()
        and m.role = 'owner'
    )
  );

-- No hard delete policy (physical delete forbidden for MVP; use archived)

grant select, insert, update on public.lab_snapshots to authenticated;
