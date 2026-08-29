import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { supabaseConfigured } from "../lib/supabaseClient";

// 包裹需要登录才能访问的路由，role 指定这段路由只允许哪个角色进入
// （'admin' 或 'agent'）。未登录 -> 跳转到 /admin/login；
// 已登录但角色不符 -> 显示"没有权限"。
export default function RequireAuth({ children, role }) {
  const { session, profile, loading, authErrorText } = useAuth();
  const location = useLocation();

  if (!supabaseConfigured) {
    return (
      <div className="adm-root">
        <div style={{ padding: 40, maxWidth: 560, margin: "60px auto" }}>
          <div className="adm-notice danger">
            尚未配置 Supabase 连接信息。请在项目根目录创建 <code>.env</code> 文件，
            填写 <code>VITE_SUPABASE_URL</code> 与 <code>VITE_SUPABASE_ANON_KEY</code>，
            然后重新启动开发服务器。
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="adm-root">
        <div className="adm-loading">正在验证登录状态…</div>
      </div>
    );
  }

  if (!session || !profile) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location, reason: authErrorText || undefined }}
      />
    );
  }

  if (role && profile.role !== role) {
    return (
      <div className="adm-root">
        <div className="adm-login-screen">
          <div className="adm-login-box" style={{ textAlign: "center" }}>
            <div className="adm-login-logo">
              <div className="adm-login-logo-cn">隐海</div>
              <div className="adm-login-logo-en">YINSEA PHUKET</div>
            </div>
            <div className="adm-login-error" style={{ marginTop: 20 }}>没有权限</div>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
