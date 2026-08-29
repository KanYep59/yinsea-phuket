import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Modal, ConfirmDialog, Loading, EmptyState, StatusBadge } from "../components/ui";
import { formatDate, formatTHB, ORDER_STATUS_LABELS } from "../lib/format";

const STATUS_OPTIONS = [
  { value: "pending", label: "待确认" },
  { value: "confirmed", label: "已确认" },
  { value: "completed", label: "已完成" },
  { value: "cancelled", label: "已取消" },
];

const emptyForm = {
  id: null, product_id: "", customer_id: "", agent_id: "", unit_price: 0, quantity: 1,
  travel_date: "", status: "pending", notes: "",
};

export default function Orders() {
  const [rows, setRows] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    const [{ data: orders, error: err }, { data: prods }, { data: custs }, { data: ags }] = await Promise.all([
      supabase.from("orders").select("*").order("created_at", { ascending: false }),
      supabase.from("products").select("id, name, agent_price, retail_price"),
      supabase.from("customers").select("id, name"),
      supabase.from("agents").select("id, company_name"),
    ]);
    if (err) setError(err.message);
    setRows(orders || []);
    setProducts(prods || []);
    setCustomers(custs || []);
    setAgents(ags || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const productName = (id) => products.find((p) => p.id === id)?.name || "—";
  const customerName = (id) => customers.find((c) => c.id === id)?.name || "—";
  const agentName = (id) => agents.find((a) => a.id === id)?.company_name || "隐海直客";

  const filtered = useMemo(
    () => (statusFilter === "all" ? rows : rows.filter((r) => r.status === statusFilter)),
    [rows, statusFilter]
  );

  const openCreate = () => setForm({ ...emptyForm });
  const openEdit = (row) => setForm({ ...row, travel_date: row.travel_date || "" });

  const onProductChange = (productId) => {
    const p = products.find((x) => x.id === productId);
    setForm((f) => ({ ...f, product_id: productId, unit_price: p?.agent_price ?? f.unit_price }));
  };

  const save = async () => {
    if (!form.product_id) { setError("请选择产品"); return; }
    setSaving(true);
    setError("");
    const unit = Number(form.unit_price) || 0;
    const qty = Number(form.quantity) || 1;
    const payload = {
      product_id: form.product_id,
      customer_id: form.customer_id || null,
      agent_id: form.agent_id || null,
      unit_price: unit,
      quantity: qty,
      total_price: unit * qty,
      travel_date: form.travel_date || null,
      status: form.status,
      notes: form.notes,
    };
    const { error } = form.id
      ? await supabase.from("orders").update(payload).eq("id", form.id)
      : await supabase.from("orders").insert(payload);
    setSaving(false);
    if (error) { setError(error.message); return; }
    setForm(null);
    load();
  };

  const remove = async () => {
    const { error } = await supabase.from("orders").delete().eq("id", deleteTarget.id);
    if (error) setError(error.message);
    setDeleteTarget(null);
    load();
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="adm-page-header">
        <div>
          <div className="adm-page-title">订单管理</div>
          <div className="adm-page-sub">跟踪产品订单的状态与金额</div>
        </div>
        <button className="adm-btn adm-btn-primary" onClick={openCreate}>+ 新建订单</button>
      </div>

      {error && <div className="adm-notice danger">{error}</div>}

      <div className="adm-filter-row" style={{ marginBottom: 18 }}>
        <button className={`adm-filter-chip ${statusFilter === "all" ? "active" : ""}`} onClick={() => setStatusFilter("all")}>全部状态</button>
        {STATUS_OPTIONS.map((o) => (
          <button key={o.value} className={`adm-filter-chip ${statusFilter === o.value ? "active" : ""}`} onClick={() => setStatusFilter(o.value)}>
            {o.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="暂无订单" desc="点击右上角新建第一个订单" />
      ) : (
        <div className="adm-table-wrap">
          <table className="adm-table">
            <thead>
              <tr>
                <th>订单编号</th>
                <th>产品</th>
                <th>客户</th>
                <th>代理商</th>
                <th>金额</th>
                <th>出行日期</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td className="adm-cell-muted">{o.order_no}</td>
                  <td>{productName(o.product_id)}</td>
                  <td className="adm-cell-muted">{customerName(o.customer_id)}</td>
                  <td className="adm-cell-muted">{agentName(o.agent_id)}</td>
                  <td className="adm-cell-gold">{formatTHB(o.total_price)}</td>
                  <td className="adm-cell-muted">{o.travel_date ? formatDate(o.travel_date) : "—"}</td>
                  <td><StatusBadge status={o.status} labels={ORDER_STATUS_LABELS} /></td>
                  <td>
                    <div className="adm-cell-actions">
                      <button className="adm-btn adm-btn-outline adm-btn-sm" onClick={() => openEdit(o)}>编辑</button>
                      <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => setDeleteTarget(o)}>删除</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {form && (
        <Modal
          title={form.id ? "编辑订单" : "新建订单"}
          onClose={() => setForm(null)}
          footer={
            <>
              <button className="adm-btn adm-btn-outline" onClick={() => setForm(null)}>取消</button>
              <button className="adm-btn adm-btn-primary" onClick={save} disabled={saving}>{saving ? "保存中…" : "保存"}</button>
            </>
          }
        >
          <div className="adm-form-grid">
            <div className="adm-field full">
              <label className="adm-label">产品</label>
              <select className="adm-select" value={form.product_id} onChange={(e) => onProductChange(e.target.value)}>
                <option value="">请选择产品</option>
                {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            <div className="adm-field">
              <label className="adm-label">客户</label>
              <select className="adm-select" value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })}>
                <option value="">未指定</option>
                {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="adm-field">
              <label className="adm-label">代理商</label>
              <select className="adm-select" value={form.agent_id} onChange={(e) => setForm({ ...form, agent_id: e.target.value })}>
                <option value="">隐海直客</option>
                {agents.map((a) => <option key={a.id} value={a.id}>{a.company_name}</option>)}
              </select>
            </div>
            <div className="adm-field">
              <label className="adm-label">单价（泰铢）</label>
              <input className="adm-input" type="number" value={form.unit_price} onChange={(e) => setForm({ ...form, unit_price: e.target.value })} />
            </div>
            <div className="adm-field">
              <label className="adm-label">数量</label>
              <input className="adm-input" type="number" min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
            </div>
            <div className="adm-field">
              <label className="adm-label">出行日期</label>
              <input className="adm-input" type="date" value={form.travel_date} onChange={(e) => setForm({ ...form, travel_date: e.target.value })} />
            </div>
            <div className="adm-field">
              <label className="adm-label">订单状态</label>
              <select className="adm-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="adm-field full">
              <label className="adm-label">备注</label>
              <textarea className="adm-textarea" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="删除订单"
          message={`确定要删除订单「${deleteTarget.order_no}」吗？此操作不可撤销。`}
          confirmLabel="删除"
          danger
          onConfirm={remove}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
