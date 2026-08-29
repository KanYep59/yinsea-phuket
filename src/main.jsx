import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// 后台管理系统挂载在 /admin（管理员）和 /agent（代理商），与前台完全独立。
// 前台 App.jsx 未被修改；这里只是根据路径选择渲染哪一个应用。
const isBackendRoute =
  window.location.pathname.startsWith('/admin') ||
  window.location.pathname.startsWith('/agent')

async function bootstrap() {
  const root = ReactDOM.createRoot(document.getElementById('root'))
  if (isBackendRoute) {
    const { default: AdminApp } = await import('./admin/AdminApp.jsx')
    root.render(
      <React.StrictMode>
        <AdminApp />
      </React.StrictMode>
    )
  } else {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
  }
}

bootstrap()
