# 隐海 YINSEA 后台管理系统 — 安装说明

后台系统位于 `src/admin/`，通过 `/admin` 路径访问，**完全独立于前台**（`src/App.jsx`
未做任何修改）。前台继续使用 `src/data/products.js` 中的静态数据展示；后台管理的
产品/分类/代理商/订单/客户/图片数据存放在 Supabase 数据库中，是一套全新的数据源。

## 1. 安装依赖

本次新增了两个依赖：`@supabase/supabase-js`（数据库与登录）、`react-router-dom`
（后台内部的页面路由，仅 `/admin/*` 使用，前台不受影响）。

```bash
npm install
```

## 2. 配置 Supabase 项目

1. 打开你的 Supabase 项目 → **SQL Editor**
2. 新建查询，粘贴并运行 `supabase/migrations/0001_admin_schema.sql` 的全部内容
   （该脚本会创建数据表、权限策略与图片存储桶，可安全重复执行）
3. 复制 `.env.example` 为 `.env`，填入你项目的 Project URL 与 anon public key
   （Supabase 控制台 → Project Settings → API）：

```bash
cp .env.example .env
```

```
VITE_SUPABASE_URL=https://xxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxxxxxxxxxxxxxx
```

`.env` 已被 `.gitignore` 忽略，不会被提交到代码仓库。

## 3. 创建第一个管理员账号

出于安全考虑，这一步需要在 Supabase 控制台手动完成一次（之后的代理商账号
可以直接在后台「代理商」页面创建，无需再手动操作）：

1. Supabase 控制台 → **Authentication → Users → Add user**，填写邮箱和密码
2. 回到 **SQL Editor**，执行（把邮箱换成你刚创建的邮箱）：

```sql
insert into public.profiles (id, email, display_name, role)
select id, email, '管理员', 'admin' from auth.users where email = '你的邮箱@example.com'
on conflict (id) do update set role = 'admin', status = 'active';
```

3. 完成后即可用该邮箱和密码登录 `/admin`

## 4. 启动

```bash
npm run dev
```

访问 `http://localhost:5173/admin` 即可看到登录页；前台仍然是
`http://localhost:5173/`，完全不受影响。

## 5. 角色与权限

系统只有两种角色：

- **管理员（admin）**：可以查看和编辑所有内容，包括成本价、供应商信息、内部备注。
- **代理商（agent）**：只能看到产品信息、代理价，并下载素材图片；**看不到成本价
  和内部备注**——这不仅是界面上隐藏，而是在数据库权限（Row Level Security）层面
  直接禁止读取，即使绕过前端页面也无法获取。

代理商的登录账号由管理员在「代理商」页面为其创建（自动生成 Supabase 登录账号
并关联角色），代理商本人可在「系统设置」页自行修改密码。

> 注意：若 Supabase 项目开启了"邮箱确认"（默认可能开启），新创建的代理商账号
> 需要先验证邮箱才能登录。可在 Supabase 控制台 → Authentication → Providers →
> Email 中关闭"Confirm email"，以便管理员创建账号后代理商可直接登录。

## 6. 部署时的路由回退

因为 `/admin/products` 这类地址是前端路由（客户端渲染），生产环境的静态托管
需要把所有路径都回退到 `index.html`，否则直接刷新 `/admin/products` 会 404。
已附带两种常见平台的配置，按你实际使用的平台保留即可：

- Netlify：`public/_redirects`（构建后会被复制到 `dist/_redirects`）
- Vercel：`vercel.json`

## 7. 新增/修改的文件一览

```
src/admin/                     后台系统全部代码（新增）
src/main.jsx                   仅新增：根据路径选择渲染前台 App 还是后台 AdminApp（其余未变）
supabase/migrations/0001_admin_schema.sql   数据库结构与权限策略（新增）
.env.example                   Supabase 环境变量模板（新增）
public/_redirects, vercel.json SPA 路由回退配置（新增）
package.json                   新增 @supabase/supabase-js 与 react-router-dom 依赖
```

`src/App.jsx`、`src/components/`、`src/data/products.js` 等前台文件均未改动。
