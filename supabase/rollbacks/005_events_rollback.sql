-- 005_events.sql のロールバック

drop policy if exists "events_delete_organizer" on public.events;
drop policy if exists "events_update_organizer" on public.events;
drop policy if exists "events_insert_organizer" on public.events;
drop policy if exists "events_select_published" on public.events;

drop trigger if exists events_set_updated_at on public.events;
drop table if exists public.events;
drop type if exists public.event_status;
drop type if exists public.event_format;
