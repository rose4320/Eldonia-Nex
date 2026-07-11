-- Eldonia-Nex: critical announcement modal support
-- priority=critical → Frontend modal until dismissed

alter table public.user_notifications
  add column if not exists priority text not null default 'normal';

alter table public.user_notifications
  add column if not exists dismissed_at timestamptz null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'user_notifications_priority_check'
  ) then
    alter table public.user_notifications
      add constraint user_notifications_priority_check
      check (priority in ('normal', 'critical'));
  end if;
end $$;

create index if not exists user_notifications_critical_undismissed_idx
  on public.user_notifications (user_id, created_at desc)
  where kind = 'announcement'
    and priority = 'critical'
    and dismissed_at is null;

comment on column public.user_notifications.priority is
  'normal = bell only; critical = Frontend modal until dismissed';
comment on column public.user_notifications.dismissed_at is
  'When user closes critical announcement modal';
