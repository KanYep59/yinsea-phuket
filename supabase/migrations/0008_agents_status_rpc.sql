-- ============================================================================
-- YINSEA 后台管理系统 — 代理商启用/停用：原子化 RPC
-- ============================================================================
-- 背景：此前前端是两步分别更新 agents.status 与 profiles.status，
-- 不是同一个数据库事务；第二步失败时会出现"资料已停用，但登录账号仍是
-- active"的不一致状态，违反"停用后不可登录"的规则。
--
-- 本迁移新增一个 security definer 的 RPC：public.set_agent_status()，
-- 在同一个事务内原子更新 agents.status 与其关联的 profiles.status。
--
--   - 不新建表、不新增字段；
--   - 不修改 agents / profiles 现有的 RLS 策略；
--   - 不影响 products、categories、regions、customers、orders 等其他模块；
--   - 只有 public.current_role_is_admin() 为真的管理员才能调用；
--   - 只接受 'active' 或 'disabled' 两个状态值。
-- 可安全重复执行。
-- ============================================================================

create or replace function public.set_agent_status(p_agent_id uuid, p_status text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.current_role_is_admin() then
    raise exception '没有权限执行此操作';
  end if;

  if p_status not in ('active', 'disabled') then
    raise exception '无效的状态值：%（只允许 active 或 disabled）', p_status;
  end if;

  if not exists (select 1 from public.agents where id = p_agent_id) then
    raise exception '代理商不存在（id = %）', p_agent_id;
  end if;

  update public.agents
    set status = p_status,
        updated_at = now()
    where id = p_agent_id;

  update public.profiles
    set status = p_status,
        updated_at = now()
    where role = 'agent' and agent_id = p_agent_id;
end;
$$;

revoke all on function public.set_agent_status(uuid, text) from public;
grant execute on function public.set_agent_status(uuid, text) to authenticated;

-- ============================================================================
-- 完成后：前端应改为调用
--   supabase.rpc("set_agent_status", { p_agent_id, p_status })
-- 而不是分别更新 agents.status 与 profiles.status。
-- ============================================================================
