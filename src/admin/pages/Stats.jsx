import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Loading } from "../components/ui";
import { formatTHB, ORDER_STATUS_LABELS } from "../lib/format";

export default function Stats() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [byCategory, setByCategory] = useState([]);
  const [byStatus, setByStatus] = useState([]);
  const [totals, setTotals] = useState({ products: 0, agents: 0, customers: 0, orders: 0, revenue: 0 });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [{ data: cats }, { data: prods }, { data: orders }, agentsCount, customersCount] = await Promise.all([
          supabase.from("categories").select("id, name"),
          supabase.from("products").select("id, category_id"),
          supabase.from("orders").select("id, status, total_price"),
          supabase.from("agents").select("id", { count: "exact", head: true }),
          supabase.from("customers").select("id", { count: "exact", head: true }),
        ]);
        if (cancelled) return;

        const catCounts = (cats || []).map((c) => ({
          label: c.name,
          value: (prods || []).filter((p) => p.category_id === c.id).length,
        })).sort((a, b) => b.value - a.value);
        setByCategory(catCounts);

        const statusCounts = Object.entries(ORDER_STATUS_LABELS).map(([key, label]) => ({
          label,
          value: (orders || []).filter((o) => o.status === key).length,
        }));
        setByStatus(statusCounts);

        const revenue = (orders || [])
          .filter((o) => o.status === "completed")
          .reduce((sum, o) => sum + Number(o.total_price || 0), 0);

        setTotals({
          products: (prods || []).length,
          agents: agentsCount.count ?? 0,
          customers: customersCount.count ?? 0,
          orders: (orders || []).length,
          revenue,
        });
      } catch (e) {
        if (!cancelled) setError(e.message || "数据加载失败");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <Loading />;

  const maxCat = Math.max(1, ...byCategory.map((c) => c.value));
  const maxStatus = Math.max(1, ...byStatus.map((c) => c.value));

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <div className="adm-page-title">数据统计</div>
          <div className="adm-page-sub">经营数据总览</div>
        </div>
      </div>

      {error && <div className="adm-notice danger">{error}</div>}

      <div className="adm-stats-grid">
        <div className="adm-stat-card"><div className="adm-stat-num">{totals.products}</div><div className="adm-stat-label">产品总数</div></div>
        <div className="adm-stat-card"><div className="adm-stat-num">{totals.agents}</div><div className="adm-stat-label">代理商数量</div></div>
        <div className="adm-stat-card"><div className="adm-stat-num">{totals.customers}</div><div className="adm-stat-label">客户总数</div></div>
        <div className="adm-stat-card"><div className="adm-stat-num">{totals.orders}</div><div className="adm-stat-label">订单总数</div></div>
        <div className="adm-stat-card"><div className="adm-stat-num" style={{ fontSize: 22 }}>{formatTHB(totals.revenue)}</div><div className="adm-stat-label">已完成订单总额</div></div>
      </div>

      <div className="adm-panel">
        <div className="adm-panel-title">各分类产品数量</div>
        {byCategory.length === 0 ? (
          <div style={{ fontSize: 12, color: "var(--fog)" }}>暂无数据</div>
        ) : (
          byCategory.map((c) => (
            <div className="adm-bar-row" key={c.label}>
              <div className="adm-bar-label">{c.label}</div>
              <div className="adm-bar-track"><div className="adm-bar-fill" style={{ width: `${(c.value / maxCat) * 100}%` }} /></div>
              <div className="adm-bar-val">{c.value}</div>
            </div>
          ))
        )}
      </div>

      <div className="adm-panel">
        <div className="adm-panel-title">订单状态分布</div>
        {byStatus.map((s) => (
          <div className="adm-bar-row" key={s.label}>
            <div className="adm-bar-label">{s.label}</div>
            <div className="adm-bar-track"><div className="adm-bar-fill" style={{ width: `${(s.value / maxStatus) * 100}%` }} /></div>
            <div className="adm-bar-val">{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
