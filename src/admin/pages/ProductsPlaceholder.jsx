import { useAuth } from "../lib/AuthContext";

// 临时占位页：本任务只完成登录与路由保护，产品管理页面本身留到下一步再做。
// 能看到这个页面，就说明登录 + 角色路由已经工作正常。
const ROLE_LABEL = { admin: "管理员", agent: "代理商" };

export default function ProductsPlaceholder({ role }) {
  const { profile, signOut } = useAuth();

  return (
    <div className="adm-root">
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <header className="adm-topbar">
          <div className="adm-topbar-left">
            <div className="adm-topbar-title">产品管理</div>
          </div>
          <div className="adm-topbar-right">
            <div className="adm-user-chip">
              <span className="adm-user-name">{profile?.display_name || profile?.email}</span>
              <span className={`adm-role-badge ${role === "agent" ? "agent" : ""}`}>
                {ROLE_LABEL[role]}
              </span>
            </div>
            <button className="adm-btn adm-btn-outline adm-btn-sm" onClick={signOut}>退出登录</button>
          </div>
        </header>
        <main className="adm-main" style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
          <div style={{ textAlign: "center" }}>
            <div className="adm-page-title">产品管理即将上线</div>
            <div className="adm-page-sub" style={{ marginTop: 10 }}>
              登录成功，当前身份：{ROLE_LABEL[role]} · {profile?.email}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
