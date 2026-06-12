-- Eldonia-Nex: 返信数カウンタ自動更新
-- 006_community.sql 実行後に適用

create or replace function public.bump_thread_reply_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.community_threads
  set reply_count = reply_count + 1,
      updated_at = now()
  where id = new.thread_id;
  return new;
end;
$$;

drop trigger if exists community_replies_bump_count on public.community_replies;
create trigger community_replies_bump_count
  after insert on public.community_replies
  for each row
  execute function public.bump_thread_reply_count();
