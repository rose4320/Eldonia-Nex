-- Shop: Gallery 作品との紐付け（作品管理から直接販売）

alter table public.shop_products
  add column if not exists source_artwork_id uuid references public.artworks (id) on delete set null;

create index if not exists shop_products_source_artwork_id_idx
  on public.shop_products (source_artwork_id)
  where source_artwork_id is not null;
