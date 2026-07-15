-- Eldonia-Nex: Lab folders + assets (Phase A persistence)
-- Members share folder/asset metadata; files live in Storage (artworks bucket).

create table if not exists public.lab_folders (
  id uuid primary key default gen_random_uuid(),
  lab_id uuid not null references public.collab_labs (id) on delete cascade,
  name text not null,
  kind text not null default 'media'
    check (kind in ('project', 'lore', 'timeline', 'framework', 'media', 'archive')),
  sort_order int not null default 0,
  archived boolean not null default false,
  archived_at timestamptz null,
  created_by uuid null references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lab_folders_name_length check (char_length(name) between 1 and 80)
);

create index if not exists lab_folders_lab_sort_idx
  on public.lab_folders (lab_id, sort_order, created_at)
  where archived = false;

create table if not exists public.lab_assets (
  id uuid primary key default gen_random_uuid(),
  lab_id uuid not null references public.collab_labs (id) on delete cascade,
  folder_id uuid not null references public.lab_folders (id) on delete cascade,
  name text not null,
  ext text not null default 'bin',
  kind text not null default 'other'
    check (kind in ('image', 'audio', 'video', 'doc', 'other')),
  storage_path text null,
  public_url text null,
  archived boolean not null default false,
  archived_at timestamptz null,
  created_by uuid null references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint lab_assets_name_length check (char_length(name) between 1 and 160),
  constraint lab_assets_ext_length check (char_length(ext) between 1 and 16)
);

create index if not exists lab_assets_lab_folder_idx
  on public.lab_assets (lab_id, folder_id, created_at desc)
  where archived = false;

drop trigger if exists lab_folders_set_updated_at on public.lab_folders;
create trigger lab_folders_set_updated_at
  before update on public.lab_folders
  for each row
  execute function public.set_updated_at();

drop trigger if exists lab_assets_set_updated_at on public.lab_assets;
create trigger lab_assets_set_updated_at
  before update on public.lab_assets
  for each row
  execute function public.set_updated_at();

alter table public.lab_folders enable row level security;
alter table public.lab_assets enable row level security;

drop policy if exists "lab_folders_select_member" on public.lab_folders;
create policy "lab_folders_select_member"
  on public.lab_folders for select
  using (
    exists (
      select 1 from public.collab_lab_members m
      where m.lab_id = lab_id and m.user_id = auth.uid()
    )
  );

drop policy if exists "lab_folders_insert_member" on public.lab_folders;
create policy "lab_folders_insert_member"
  on public.lab_folders for insert
  with check (
    exists (
      select 1 from public.collab_lab_members m
      where m.lab_id = lab_id and m.user_id = auth.uid()
    )
  );

drop policy if exists "lab_folders_update_member" on public.lab_folders;
create policy "lab_folders_update_member"
  on public.lab_folders for update
  using (
    exists (
      select 1 from public.collab_lab_members m
      where m.lab_id = lab_id and m.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.collab_lab_members m
      where m.lab_id = lab_id and m.user_id = auth.uid()
    )
  );

drop policy if exists "lab_assets_select_member" on public.lab_assets;
create policy "lab_assets_select_member"
  on public.lab_assets for select
  using (
    exists (
      select 1 from public.collab_lab_members m
      where m.lab_id = lab_id and m.user_id = auth.uid()
    )
  );

drop policy if exists "lab_assets_insert_member" on public.lab_assets;
create policy "lab_assets_insert_member"
  on public.lab_assets for insert
  with check (
    auth.uid() = created_by
    and exists (
      select 1 from public.collab_lab_members m
      where m.lab_id = lab_id and m.user_id = auth.uid()
    )
  );

drop policy if exists "lab_assets_update_member" on public.lab_assets;
create policy "lab_assets_update_member"
  on public.lab_assets for update
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

grant select, insert, update on public.lab_folders to authenticated;
grant select, insert, update on public.lab_assets to authenticated;

-- Realtime: chat + assets for live Lab collaboration
do $$
begin
  alter publication supabase_realtime add table public.collab_lab_posts;
exception
  when duplicate_object then null;
  when undefined_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.lab_assets;
exception
  when duplicate_object then null;
  when undefined_object then null;
end $$;
