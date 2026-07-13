-- Eldonia-Nex: Community reply soft-delete (§23 — no hard delete)
-- Author may soft-delete own replies; public list hides deleted rows.

alter table public.community_replies
  add column if not exists deleted_at timestamptz null,
  add column if not exists deleted_by uuid null references public.profiles (id) on delete set null;

create index if not exists community_replies_thread_alive_idx
  on public.community_replies (thread_id, created_at)
  where deleted_at is null;

comment on column public.community_replies.deleted_at is
  'Soft-delete timestamp; null = visible';

-- Public reads: only non-deleted
drop policy if exists "community_replies_select" on public.community_replies;
create policy "community_replies_select"
  on public.community_replies
  for select
  using (deleted_at is null);

-- Author soft-delete / undelete (MVP: soft-delete only from app)
drop policy if exists "community_replies_update_author" on public.community_replies;
create policy "community_replies_update_author"
  on public.community_replies
  for update
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

grant update on public.community_replies to authenticated;

-- Decrement reply_count when soft-deleted
create or replace function public.bump_thread_reply_count_on_soft_delete()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if old.deleted_at is null and new.deleted_at is not null then
    update public.community_threads
    set reply_count = greatest(0, reply_count - 1),
        updated_at = now()
    where id = new.thread_id;
  elsif old.deleted_at is not null and new.deleted_at is null then
    update public.community_threads
    set reply_count = reply_count + 1,
        updated_at = now()
    where id = new.thread_id;
  end if;
  return new;
end;
$$;

drop trigger if exists community_replies_soft_delete_count on public.community_replies;
create trigger community_replies_soft_delete_count
  after update of deleted_at on public.community_replies
  for each row
  execute function public.bump_thread_reply_count_on_soft_delete();
