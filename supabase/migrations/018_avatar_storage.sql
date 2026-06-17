-- Eldonia-Nex: profile avatar storage
-- 001_profiles.sql 実行後に適用

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'avatars',
  'avatars',
  true,
  5242880,
  array[
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "avatars_storage_select" on storage.objects;
create policy "avatars_storage_select"
  on storage.objects
  for select
  using (bucket_id = 'avatars');

drop policy if exists "avatars_storage_insert_own" on storage.objects;
create policy "avatars_storage_insert_own"
  on storage.objects
  for insert
  with check (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "avatars_storage_update_own" on storage.objects;
create policy "avatars_storage_update_own"
  on storage.objects
  for update
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

drop policy if exists "avatars_storage_delete_own" on storage.objects;
create policy "avatars_storage_delete_own"
  on storage.objects
  for delete
  using (
    bucket_id = 'avatars'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
