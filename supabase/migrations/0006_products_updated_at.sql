-- ============================================================================
-- YINSEA 后台管理系统 — 产品更新时间
-- ============================================================================
-- 目的：让后台首页的「最近更新的产品」按真实更新时间排序。
--
-- 本迁移不会修改产品价格、分类、地区、图片、描述或任何业务资料；
-- 仅新增/补齐 updated_at，并在之后每次编辑产品时自动更新时间。
-- 现有产品首次补齐时沿用 created_at，避免把所有产品误标为今天刚更新。
-- 可安全重复执行。
-- ============================================================================

alter table public.products add column if not exists updated_at timestamptz;

update public.products
set updated_at = coalesce(created_at, now())
where updated_at is null;

alter table public.products alter column updated_at set default now();
alter table public.products alter column updated_at set not null;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

-- ============================================================================
-- 完成后：每次保存产品都会自动记录真实的更新时间。
-- ============================================================================
