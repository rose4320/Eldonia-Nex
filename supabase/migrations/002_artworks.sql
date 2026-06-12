-- Eldonia-Nex: artworks テーブル + Storage バケット（GALLEY）
-- 001_profiles.sql 実行後に適用

-- ---------------------------------------------------------------------------
-- media_type
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'artwork_media_type') then
    create type public.artwork_media_type as enum (
      'image',
      'video',
      'audio',
      'document'
    );
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- artworks
-- ---------------------------------------------------------------------------
create table if not exists public.artworks (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid not null references public.profiles (id) on delete cascade,
  title text not null,
  description text,
  media_type public.artwork_media_type not null default 'image',
  media_url text not null,
  thumbnail_url text,
  category text not null default 'other',
  tags text[] not null default '{}',
  is_public boolean not null default true,
  view_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint artworks_title_length check (char_length(title) between 1 and 100),
  constraint artworks_description_length check (
    description is null or char_length(description) <= 2000
  )
);

create index if not exists artworks_creator_id_idx on public.artworks (creator_id);
create index if not exists artworks_created_at_idx on public.artworks (created_at desc);
create index if not exists artworks_is_public_idx on public.artworks (is_public)
  where is_public = true;

drop trigger if exists artworks_set_updated_at on public.artworks;
create trigger artworks_set_updated_at
  before update on public.artworks
  for each row
  execute function public.set_updated_at();

comment on table public.artworks is 'GALLEY 作品';

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.artworks enable row level security;

drop policy if exists "artworks_select_public" on public.artworks;
create policy "artworks_select_public"
  on public.artworks
  for select
  using (is_public = true or auth.uid() = creator_id);

drop policy if exists "artworks_insert_own" on public.artworks;
create policy "artworks_insert_own"
  on public.artworks
  for insert
  with check (auth.uid() = creator_id);

drop policy if exists "artworks_update_own" on public.artworks;
create policy "artworks_update_own"
  on public.artworks
  for update
  using (auth.uid() = creator_id)
  with check (auth.uid() = creator_id);

drop policy if exists "artworks_delete_own" on public.artworks;
create policy "artworks_delete_own"
  on public.artworks
  for delete
  using (auth.uid() = creator_id);

-- ---------------------------------------------------------------------------
-- Storage: artworks バケット
-- Dashboard > Storage でも作成可。SQL から作成する場合:
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'artworks',
  'artworks',
  true,
  524288000,
  array[
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/quicktime',
    'audio/mpeg',
    'audio/wav',
    'audio/flac',
    'application/pdf'
  ]
)
on conflict (id) do nothing;

drop policy if exists "artworks_storage_select" on storage.objects;
create policy "artworks_storage_select"
  on storage.objects
  for select
  using (bucket_id = 'artworks');

drop policy if exists "artworks_storage_insert_own" on storage.objects;
create policy "artworks_storage_insert_own"
  on storage.objects
  for insert
  with check (
    bucket_id = 'artworks'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "artworks_storage_update_own" on storage.objects;
create policy "artworks_storage_update_own"
  on storage.objects
  for update
  using (
    bucket_id = 'artworks'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "artworks_storage_delete_own" on storage.objects;
create policy "artworks_storage_delete_own"
  on storage.objects
  for delete
  using (
    bucket_id = 'artworks'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
