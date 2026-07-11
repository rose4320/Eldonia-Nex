-- Shop: 配布ファイル URL（ジャケット image_url とは別）

alter table public.shop_products
  add column if not exists download_url text;

comment on column public.shop_products.image_url is '一覧・詳細のジャケット / カバー画像';
comment on column public.shop_products.download_url is 'デジタル商品の配布ファイル URL（音源・PDF・3D 等）';
