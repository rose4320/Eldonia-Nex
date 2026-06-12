-- Eldonia-Nex: WORKS 求人主操作 + 応募ステータス更新
-- 007_works.sql 実行後に適用

drop policy if exists "job_listings_update_own" on public.job_listings;
create policy "job_listings_update_own" on public.job_listings
  for update using (auth.uid() = poster_id)
  with check (auth.uid() = poster_id);

drop policy if exists "job_applications_update_poster" on public.job_applications;
create policy "job_applications_update_poster" on public.job_applications
  for update using (
    auth.uid() in (
      select poster_id from public.job_listings where id = job_id
    )
  );
