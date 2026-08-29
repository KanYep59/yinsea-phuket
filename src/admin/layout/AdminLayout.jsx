import { useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { navItemsForRole, PAGE_TITLES } from "../lib/navConfig";

export default function AdminLayout() {
  const { profile, role, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const items = navItemsForRole(role);
  const title = PAGE_TITLES[location.pathname] || "隐海后台";

  const handleLogout = async () => {
    await signOut();
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="adm-root">
      <div className="adm-shell">
        <div className={`adm-sidebar-backdrop ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)} />
        <aside className={`adm-sidebar ${menuOpen ? "open" : ""}`}>
          <button className="adm-sidebar-close" onClick={() => setMenuOpen(false)}>✕</button>
          <div className="adm-sidebar-brand">
            <div className="adm-sidebar-brand-cn">隐海</div>
            <div className="adm-sidebar-brand-en">YINSEA PHUKET</div>
            <div className="adm-sidebar-brand-tag">后台管理系统</div>
          </div>
          <nav className="adm-nav">
            {items.map((item) => (
              <NavLink
                key={item.key}
                to={item.path}
                end={item.end}
                className={({ isActive }) => `adm-nav-item${isActive ? " active" : ""}`}
                onClick={() => setMenuOpen(false)}
              >
                <span className="adm-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="adm-sidebar-footer">隐海旅游 · 内部系统</div>
        </aside>

        <div className="adm-content">
          <header className="adm-topbar">
            <div className="adm-topbar-left">
              <button className="adm-hamburger" onClick={() => setMenuOpen(true)}>☰</button>
              <div className="adm-topbar-title">{title}</div>
            </div>
            <div className="adm-topbar-right">
              <div className="adm-user-chip">
                <span className="adm-user-name">{profile?.display_name || profile?.email}</span>
                <span className={`adm-role-badge ${role === "agent" ? "agent" : ""}`}>
                  {role === "admin" ? "管理员" : "代理商"}
                </span>
              </div>
              <button className="adm-btn adm-btn-outline adm-btn-sm" onClick={handleLogout}>退出登录</button>
            </div>
          </header>
          <main className="adm-main">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
