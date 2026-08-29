// 侧边栏菜单配置：集中管理菜单项、路径、图标与可见角色。
// roles 未包含某角色时，该角色登录后将不显示此菜单项，且路由本身也会拒绝访问。
//
// 菜单已锁定为：
//   管理员：首页 / 产品管理 / 分类管理 / 代理商 / 系统设置
//   代理商：产品管理 / 系统设置
// 不显示订单管理、客户管理、图片库、数据统计。地区管理不放侧边栏，
// 只在「系统设置」页面内提供入口，跳转 /admin/settings/regions。
export const NAV_ITEMS = [
  { key: "home", label: "首页", path: "/admin", icon: "🏠", roles: ["admin"], end: true },
  { key: "products-admin", label: "产品管理", path: "/admin/products", icon: "🛍️", roles: ["admin"] },
  { key: "products-agent", label: "产品管理", path: "/agent/products", icon: "🛍️", roles: ["agent"], end: true },
  { key: "categories", label: "产品分类", path: "/admin/categories", icon: "🗂️", roles: ["admin"] },
  { key: "agents", label: "代理商", path: "/admin/agents", icon: "🤝", roles: ["admin"] },
  { key: "settings", label: "系统设置", path: "/admin/settings", icon: "⚙️", roles: ["admin", "agent"] },
];

export function navItemsForRole(role) {
  return NAV_ITEMS.filter((item) => item.roles.includes(role));
}

// 顶部栏页面标题映射：AdminLayout 根据当前路径显示对应中文标题。
// 地区管理不在侧边栏菜单中，但仍需要一个标题，供 /admin/settings/regions 使用。
export const PAGE_TITLES = {
  "/admin": "首页",
  "/admin/products": "产品管理",
  "/agent/products": "产品管理",
  "/admin/categories": "产品分类",
  "/admin/agents": "代理商",
  "/admin/settings": "系统设置",
  "/admin/settings/regions": "地区管理",
};
