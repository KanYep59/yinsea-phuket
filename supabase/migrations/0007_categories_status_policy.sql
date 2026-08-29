-- ============================================================================
-- YINSEA 后台管理系统 — 分类状态读取权限
-- ============================================================================
-- 目的：代理商只能读取 status = 'active' 的分类，用于代理后台的产品分类筛选；
-- 停用（status = 'inactive'）的分类对代理商不可见，但不删除、不影响任何产品数据。
--
-- 本迁移只更新 categories 表上代理商的读取策略（categories_active_user_read），
-- 由 0005_categories_access.sql 创建。
--   - 不创建、不删除、不修改 categories 表的任何字段；
--   - 不改动 categories_admin_all（管理员仍可通过该策略读取全部分类，包括 inactive）；
--   - 不改动 products、regions 或其他任何表。
-- 可安全重复执行。
-- ============================================================================

drop policy if exists categories_active_user_read on public.categories;

create policy categories_active_user_read on public.categories for select
  using (public.is_logged_in_active() and status = 'active');

-- ============================================================================
-- 完成后：
--   管理员（current_role_is_admin() 为真）通过既有的 categories_admin_all
--   策略继续读取全部分类，包括 status = 'inactive' 的分类；
--   代理商只能读取 status = 'active' 的分类。
-- ============================================================================
