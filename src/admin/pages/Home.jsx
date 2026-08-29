import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../lib/AuthContext";
import { Loading, StatusBadge, EmptyState } from "../components/ui";
import { formatDateTime, formatTHB, STATUS_LABELS } from "../lib/format";

// 管理员后台首页（/admin，仅管理员可进入）。
// 只统计产品、分类、代理商三项数量，不查询 orders、product_images，
// 不显示订单总数、成交额、图片总数。
//
// "最近更新的产品"按 products.updated_at 倒序取 8 条（0006_products_updated_at.sql
// 已为 products 补齐 updated_at 字段并加上自动更新触发器）。
export default function Home() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ products: 0, categories: 0, agents: 0 });
  const [recent, setRecent] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      const [p, c, ag, recentRes] = await Promise.all([
        supabase.from("products").select("id", { count: "exact", head: true }),
        supabase.from("categories").select("id", { count: "exact", head: true }),
        supabase.from("agents").select("id", { count: "exact", head: true }),
        supabase
          .from("products")
          .select("id, name, emoji, status, agent, updated_at")
          .order("updated_at", { ascending: false })
          .limit(8),
      ]);
      const firstErr = [p, c, ag, recentRes].find((r) => r.error)?.error;
      if (cancelled) return;
      if (firstErr) {
        setError(firstErr.message);
      } else {
        setStats({ products: p.count ?? 0, categories: c.count ?? 0, agents: ag.count ?? 0 });
        setRecent(recentRes.data || []);
      }
      setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="adm-page-header">
            <div>
              <div className="adm-page-title">欢迎回来，{profile?.display_name || "同事"}</div>
              <div className="adm-page-sub">隐海 YINSEA 后台管理系统总览</div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <Link to="/admin/products" className="adm-btn adm-btn-primary">产品管理</Link>
              <Link to="/admin/categories" className="adm-btn adm-btn-outline">分类管理</Link>
              <Link to="/admin/agents" className="adm-btn adm-btn-outline">代理商</Link>
              <Link to="/admin/settings" className="adm-btn adm-btn-outline">系统设置</Link>
            </div>
          </div>

          {error && <div className="adm-notice danger">{error}</div>}

          <div className="adm-stats-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            <div className="adm-stat-card">
              <div className="adm-stat-num">{stats.products}</div>
              <div className="adm-stat-label">产品总数</div>
            </div>
            <div className="adm-stat-card">
              <div className="adm-stat-num">{stats.categories}</div>
              <div className="adm-stat-label">分类总数</div>
            </div>
            <div className="adm-stat-card">
              <div className="adm-stat-num">{stats.agents}</div>
              <div className="adm-stat-label">代理商总数</div>
            </div>
          </div>

          <div className="adm-panel">
            <div className="adm-panel-title">最近更新的产品</div>
            {recent.length === 0 ? (
              <EmptyState title="暂无产品" desc="前往「产品管理」添加第一个产品" />
            ) : (
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>产品名称</th>
                      <th>状态</th>
                      <th>代理价</th>
                      <th>最近更新时间</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((p) => (
                      <tr key={p.id}>
                        <td>{p.emoji} {p.name}</td>
                        <td><StatusBadge status={p.status} labels={STATUS_LABELS} /></td>
                        <td className="adm-cell-gold">{formatTHB(p.agent)}</td>
                        <td className="adm-cell-muted">{formatDateTime(p.updated_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div style={{ marginTop: 16 }}>
              <Link to="/admin/products" className="adm-btn adm-btn-outline adm-btn-sm">前往产品管理 →</Link>
            </div>
          </div>
        </>
      )}
    </>
  );
}
