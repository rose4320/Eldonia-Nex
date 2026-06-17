-- Eldonia-Nex: PostgREST / Supabase JS 用の API ロール権限
-- マイグレーションで作成したテーブルに anon / authenticated の DML が無く
-- 「permission denied for table ...」になるのを防ぐ

grant usage on schema public to postgres, anon, authenticated, service_role;

grant all on all tables in schema public to postgres, service_role;
grant all on all sequences in schema public to postgres, service_role;
grant all on all routines in schema public to postgres, service_role;

grant select, insert, update, delete on all tables in schema public to authenticated;
grant select on all tables in schema public to anon;

grant usage on all sequences in schema public to anon, authenticated, service_role;

-- カスタム enum 型（INSERT 時に必要）
grant usage on type public.artwork_media_type to anon, authenticated, service_role;
grant usage on type public.event_format to anon, authenticated, service_role;
grant usage on type public.event_status to anon, authenticated, service_role;
grant usage on type public.job_status to anon, authenticated, service_role;
grant usage on type public.job_type to anon, authenticated, service_role;
grant usage on type public.portfolio_visibility to anon, authenticated, service_role;
grant usage on type public.shop_product_type to anon, authenticated, service_role;
grant usage on type public.support_ticket_category to anon, authenticated, service_role;
grant usage on type public.support_ticket_priority to anon, authenticated, service_role;
grant usage on type public.support_ticket_status to anon, authenticated, service_role;

-- 今後のマイグレーションで追加されるオブジェクトにも適用
alter default privileges in schema public
  grant all on tables to postgres, service_role;

alter default privileges in schema public
  grant select, insert, update, delete on tables to authenticated;

alter default privileges in schema public
  grant select on tables to anon;

alter default privileges in schema public
  grant all on sequences to postgres, service_role;

alter default privileges in schema public
  grant usage on sequences to anon, authenticated, service_role;

alter default privileges in schema public
  grant all on routines to postgres, service_role;
