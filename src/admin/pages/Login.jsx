import { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { supabaseConfigured } from "../lib/supabaseClient";

const HOME_BY_ROLE = { admin: "/admin", agent: "/agent/products" };

export default function Login() {
  const { session, profile, signIn } = useAuth();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(location.state?.reason || "");
  const [submitting, setSubmitting] = useState(false);

  // 已经登录（账号有效、角色明确）-> 自动跳转到对应角色的后台首页，
  // 不需要用户再手动点一次。
  if (session && profile) {
    const home = HOME_BY_ROLE[profile.role] || "/admin/login";
    const dest = location.state?.from?.pathname || home;
    return <Navigate to={dest} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const { errorText } = await signIn(email.trim(), password);
    setSubmitting(false);
    if (errorText) {
      setError(errorText);
    }
    // 登录成功后 session / profile 会更新，上面的判断会自动触发跳转。
  };

  const canSubmit = supabaseConfigured && email.trim() && password && !submitting;

  return (
    <div className="adm-root">
      <div className="adm-login-screen">
        <div className="adm-login-box">
          <div className="adm-login-logo">
            <div className="adm-login-logo-cn">隐海</div>
            <div className="adm-login-logo-en">YINSEA PHUKET</div>
          </div>
          <div className="adm-login-sub">后台管理系统登录</div>

          {!supabaseConfigured && (
            <div className="adm-login-error">
              尚未配置 Supabase 连接信息，请先在项目根目录设置 .env 文件中的
              VITE_SUPABASE_URL 与 VITE_SUPABASE_ANON_KEY。
            </div>
          )}
          {error && <div className="adm-login-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="adm-field">
              <label className="adm-label">邮箱</label>
              <input
                className="adm-input"
                type="email"
                autoComplete="username"
                placeholder="请输入邮箱"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="adm-field">
              <label className="adm-label">密码</label>
              <input
                className="adm-input"
                type="password"
                autoComplete="current-password"
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className="adm-btn adm-btn-primary adm-btn-block" type="submit" disabled={!canSubmit}>
              {submitting ? "登录中…" : "登录后台"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
