-- ============================================================================
-- YINSEA 后台管理系统 — 分类读取权限补齐
-- ============================================================================
-- 目的：让已登录的管理员与代理商读取既有的 categories，供产品列表显示及筛选。
--
-- 不创建、不删除、不修改 categories 或 products 的任何数据和字段。
-- 管理员可管理分类；代理商只能读取分类，不能新增、修改或删除。
-- 可安全重复执行。
-- ============================================================================

alter table public.categories enable row level security;

-- 管理员：保留完整分类管理权限。
drop policy if exists categories_admin_all on public.categories;
create policy categories_admin_all on public.categories for all
  using (public.current_role_is_admin())
  with check (public.current_role_is_admin());

-- 代理商：仅用于显示及筛选产品分类，不能写入分类。
drop policy if exists categories_active_user_read on public.categories;
create policy categories_active_user_read on public.categories for select
  using (public.is_logged_in_active());

grant select on public.categories to authenticated;

-- ============================================================================
-- 完成后刷新后台产品页；既有产品的分类名称与分类筛选应正常显示。
-- ============================================================================
