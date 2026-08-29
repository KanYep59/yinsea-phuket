import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./admin.css";
import { AuthProvider } from "./lib/AuthContext";
import RequireAuth from "./components/RequireAuth";
import AdminLayout from "./layout/AdminLayout";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Categories from "./pages/Categories";
import Agents from "./pages/Agents";
import Settings from "./pages/Settings";
import Regions from "./pages/Regions";

// 隐海 YINSEA 后台系统：
//   /admin/login              登录页（管理员、代理商共用同一个登录入口，不使用侧边栏布局）
//   /admin                    管理员登录后的默认首页（仅 role = 'admin' 可进入）
//   /admin/products           管理员产品管理页（仅 role = 'admin' 可进入，全部字段可读可写）
//   /admin/categories         管理员分类管理页（仅 role = 'admin' 可进入）
//   /admin/agents             管理员代理商管理页（仅 role = 'admin' 可进入）
//   /admin/settings           系统设置（管理员、代理商登录后均可进入，管理自己的资料/密码；
//                             管理员额外看到网站基础信息与"地区管理"入口）
//   /admin/settings/regions   管理员地区管理页（仅 role = 'admin' 可进入）
//   /agent/products           代理商登录后的默认页（仅 role = 'agent' 可进入，只读、字段受限）
// 代理商没有独立首页，登录后直接进入 /agent/products，也不能访问 /admin/categories。
// /admin/products 与 /agent/products 共用同一个 Products 组件，组件内部
// 根据 useAuth().isAdmin 判断走管理员的读写视图，还是代理商的只读视图。
//
// 登录后的所有页面统一挂载在同一个路径无关的 <AdminLayout> 嵌套路由下：
// AdminLayout 负责渲染侧边栏、顶部栏（当前页面名称、用户名、角色标签、退出登录），
// 各功能页面只渲染 <Outlet /> 内的自身内容区域，不再各自重复顶部栏和退出登录逻辑。
// 每个子路由仍然各自用 <RequireAuth> 做角色权限判断，权限逻辑本身不变。
// 不依赖、不修改前台 App。
export default function AdminApp() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin/login" element={<Login />} />

          <Route element={<AdminLayout />}>
            <Route
              path="/admin"
              element={
                <RequireAuth role="admin">
                  <Home />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/products"
              element={
                <RequireAuth role="admin">
                  <Products />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <RequireAuth role="admin">
                  <Categories />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/agents"
              element={
                <RequireAuth role="admin">
                  <Agents />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/settings"
              element={
                <RequireAuth>
                  <Settings />
                </RequireAuth>
              }
            />
            <Route
              path="/admin/settings/regions"
              element={
                <RequireAuth role="admin">
                  <Regions />
                </RequireAuth>
              }
            />
            <Route
              path="/agent/products"
              element={
                <RequireAuth role="agent">
                  <Products />
                </RequireAuth>
              }
            />
          </Route>

          <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
          <Route path="/agent" element={<Navigate to="/agent/products" replace />} />
          <Route path="/agent/*" element={<Navigate to="/agent/products" replace />} />

          <Route path="*" element={<Navigate to="/admin/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
