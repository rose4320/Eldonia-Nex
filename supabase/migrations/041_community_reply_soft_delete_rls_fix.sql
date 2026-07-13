-- Fix soft-delete RLS: Postgres applies SELECT policies to the NEW row on UPDATE.
-- After setting deleted_at, `deleted_at is null` alone blocks the update.

drop policy if exists "community_replies_select" on public.community_replies;
create policy "community_replies_select"
  on public.community_replies
  for select
  using (
    deleted_at is null
    or auth.uid() = author_id
  );

-- Keep update as author-only (soft-delete sets deleted_at / deleted_by)
drop policy if exists "community_replies_update_author" on public.community_replies;
create policy "community_replies_update_author"
  on public.community_replies
  for update
  using (auth.uid() = author_id and deleted_at is null)
  with check (auth.uid() = author_id);
