-- 003_support.sql のロールバック

drop policy if exists "support_ticket_messages_insert_own" on public.support_ticket_messages;
drop policy if exists "support_ticket_messages_select_own" on public.support_ticket_messages;
drop policy if exists "support_tickets_insert" on public.support_tickets;
drop policy if exists "support_tickets_select_own" on public.support_tickets;
drop policy if exists "support_faq_select_published" on public.support_faq_articles;

drop table if exists public.support_ticket_messages;
drop trigger if exists support_tickets_set_updated_at on public.support_tickets;
drop table if exists public.support_tickets;
drop function if exists public.generate_support_ticket_number();

drop trigger if exists support_faq_set_updated_at on public.support_faq_articles;
drop table if exists public.support_faq_articles;

drop type if exists public.support_ticket_status;
drop type if exists public.support_ticket_priority;
drop type if exists public.support_ticket_category;
