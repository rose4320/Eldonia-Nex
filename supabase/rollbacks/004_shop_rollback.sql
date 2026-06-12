-- 004_shop.sql のロールバック

drop policy if exists "shop_products_delete_seller" on public.shop_products;
drop policy if exists "shop_products_update_seller" on public.shop_products;
drop policy if exists "shop_products_insert_seller" on public.shop_products;
drop policy if exists "shop_products_select_active" on public.shop_products;

drop trigger if exists shop_products_set_updated_at on public.shop_products;
drop table if exists public.shop_products;
drop type if exists public.shop_product_type;
