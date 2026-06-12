-- 002_artworks.sql のロールバック

drop policy if exists "artworks_storage_delete_own" on storage.objects;
drop policy if exists "artworks_storage_update_own" on storage.objects;
drop policy if exists "artworks_storage_insert_own" on storage.objects;
drop policy if exists "artworks_storage_select" on storage.objects;

delete from storage.buckets where id = 'artworks';

drop policy if exists "artworks_delete_own" on public.artworks;
drop policy if exists "artworks_update_own" on public.artworks;
drop policy if exists "artworks_insert_own" on public.artworks;
drop policy if exists "artworks_select_public" on public.artworks;

drop trigger if exists artworks_set_updated_at on public.artworks;
drop table if exists public.artworks;
drop type if exists public.artwork_media_type;
