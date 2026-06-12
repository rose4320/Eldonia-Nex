drop policy if exists "orders_insert_own" on public.orders;
drop policy if exists "orders_select_own" on public.orders;
drop trigger if exists orders_set_updated_at on public.orders;
drop table if exists public.orders;
