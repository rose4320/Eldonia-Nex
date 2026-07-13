-- Eldonia-Nex: participant event tickets (1 purchase = 1 ticket)
-- docs/18_Events機能要件定義書.md §8

do $$
begin
  if not exists (select 1 from pg_type where typname = 'event_ticket_status') then
    create type public.event_ticket_status as enum ('valid', 'used', 'cancelled', 'refunded');
  end if;
end $$;

create table if not exists public.event_tickets (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events (id) on delete cascade,
  order_id uuid references public.orders (id) on delete set null,
  holder_user_id uuid not null references public.profiles (id) on delete cascade,
  ticket_code uuid not null unique default gen_random_uuid(),
  qr_token text not null,
  status public.event_ticket_status not null default 'valid',
  checked_in_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists event_tickets_holder_idx
  on public.event_tickets (holder_user_id, created_at desc);

create index if not exists event_tickets_event_idx
  on public.event_tickets (event_id);

create index if not exists event_tickets_order_event_idx
  on public.event_tickets (order_id, event_id)
  where order_id is not null;

comment on table public.event_tickets is 'Events 参加者チケット（1 UUID = 1 QR）';

alter table public.event_tickets enable row level security;

drop policy if exists "event_tickets_select_holder" on public.event_tickets;
create policy "event_tickets_select_holder"
  on public.event_tickets
  for select
  using (auth.uid() = holder_user_id);

drop policy if exists "event_tickets_select_organizer" on public.event_tickets;
create policy "event_tickets_select_organizer"
  on public.event_tickets
  for select
  using (
    exists (
      select 1
      from public.events e
      where e.id = event_tickets.event_id
        and e.organizer_id = auth.uid()
    )
  );

-- Atomic issuance (service role / security definer only)
create or replace function public.issue_event_tickets_for_line(
  p_order_id uuid,
  p_holder_user_id uuid,
  p_event_id uuid,
  p_quantity integer
)
returns uuid[]
language plpgsql
security definer
set search_path = public
as $$
declare
  v_capacity integer;
  v_sold integer;
  v_status public.event_status;
  v_existing integer;
  v_ids uuid[] := '{}';
  i integer;
  v_ticket_id uuid;
begin
  if p_quantity is null or p_quantity < 1 then
    raise exception 'invalid_quantity';
  end if;

  select count(*)::integer
  into v_existing
  from public.event_tickets
  where order_id = p_order_id
    and event_id = p_event_id;

  if v_existing > 0 then
    select coalesce(array_agg(id order by created_at), '{}')
    into v_ids
    from public.event_tickets
    where order_id = p_order_id
      and event_id = p_event_id;
    return v_ids;
  end if;

  select capacity, tickets_sold, status
  into v_capacity, v_sold, v_status
  from public.events
  where id = p_event_id
  for update;

  if not found then
    raise exception 'event_not_found';
  end if;

  if v_status <> 'published' then
    raise exception 'event_not_published';
  end if;

  if v_capacity is not null and v_sold + p_quantity > v_capacity then
    raise exception 'event_sold_out';
  end if;

  for i in 1..p_quantity loop
    insert into public.event_tickets (
      event_id,
      order_id,
      holder_user_id,
      ticket_code,
      qr_token,
      status
    )
    values (
      p_event_id,
      p_order_id,
      p_holder_user_id,
      gen_random_uuid(),
      replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', ''),
      'valid'
    )
    returning id into v_ticket_id;

    v_ids := array_append(v_ids, v_ticket_id);
  end loop;

  update public.events
  set tickets_sold = tickets_sold + p_quantity
  where id = p_event_id;

  return v_ids;
end;
$$;

revoke all on function public.issue_event_tickets_for_line(uuid, uuid, uuid, integer) from public;
grant execute on function public.issue_event_tickets_for_line(uuid, uuid, uuid, integer) to service_role;
