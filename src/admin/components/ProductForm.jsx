import { useState } from "react";
import { Modal } from "./ui";
import { supabase } from "../lib/supabaseClient";
import {
  initLinesField, finalizeLinesField,
  initQaField, finalizeQaField,
  initKvField, finalizeKvField,
} from "../lib/jsonFields";
import ProductImagesEditor from "./ProductImagesEditor";

// 建议的销售状态（不是强制枚举）：现有生产数据的真实取值范围未知，
// 用 <datalist> 给出常用建议，同时保留自由输入，避免因为猜错固定选项
// 而把已有产品的真实状态值改写成错误的值。
const STATUS_SUGGESTIONS = [
  { value: "avail", label: "可售" },
  { value: "hot", label: "紧张" },
  { value: "full", label: "已满" },
  { value: "offline", label: "已下架" },
];

export default function ProductForm({ product, categories, regions, onClose, onSaved, onImagesChanged }) {
  const isEdit = Boolean(product?.id);

  const [form, setForm] = useState(() => ({
    id: product?.id || null,
    name: product?.name || "",
    name_en: product?.name_en || "",
    slug: product?.slug || "",
    emoji: product?.emoji || "",
    category_id: product?.category_id != null ? String(product.category_id) : "",
    region_id: product?.region_id || "",
    status: product?.status || "avail",
    sort_order: product?.sort_order ?? 0,
    featured: Boolean(product?.featured),
    retail: product?.retail ?? 0,
    agent: product?.agent ?? 0,
    cost: product?.cost ?? 0,
    description: product?.description || "",
    summary: product?.summary || "",
  }));

  const [includesField, setIncludesField] = useState(() => initLinesField(product?.includes));
  const [highlightsField, setHighlightsField] = useState(() => initLinesField(product?.highlights));
  const [notesField, setNotesField] = useState(() => initLinesField(product?.notes));
  const [faqField, setFaqField] = useState(() => initQaField(product?.faq));
  const [specField, setSpecField] = useState(() => initKvField(product?.specifications));

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const addFaqRow = () => setFaqField((f) => ({ ...f, rows: [...f.rows, { q: "", a: "" }] }));
  const updateFaqRow = (i, key, val) =>
    setFaqField((f) => ({ ...f, rows: f.rows.map((r, idx) => (idx === i ? { ...r, [key]: val } : r)) }));
  const removeFaqRow = (i) => setFaqField((f) => ({ ...f, rows: f.rows.filter((_, idx) => idx !== i) }));

  const addSpecRow = () => setSpecField((f) => ({ ...f, rows: [...f.rows, { label: "", value: "" }] }));
  const updateSpecRow = (i, key, val) =>
    setSpecField((f) => ({ ...f, rows: f.rows.map((r, idx) => (idx === i ? { ...r, [key]: val } : r)) }));
  const removeSpecRow = (i) => setSpecField((f) => ({ ...f, rows: f.rows.filter((_, idx) => idx !== i) }));

  const save = async () => {
    if (!form.name.trim()) { setError("请填写产品中文名称"); return; }
    if (!form.slug.trim()) { setError("请填写产品 slug"); return; }
    if (!form.region_id) { setError("请选择产品所在地区"); return; }

    let includes, highlights, notes, faq, specifications;
    try {
      includes = finalizeLinesField(includesField);
    } catch { setError("「费用包含」字段的 JSON 格式不正确，请检查后重试"); return; }
    try {
      highlights = finalizeLinesField(highlightsField);
    } catch { setError("「亮点」字段的 JSON 格式不正确，请检查后重试"); return; }
    try {
      notes = finalizeLinesField(notesField);
    } catch { setError("「内部备注」字段的 JSON 格式不正确，请检查后重试"); return; }
    try {
      faq = finalizeQaField(faqField);
    } catch { setError("「常见问题」字段的 JSON 格式不正确，请检查后重试"); return; }
    try {
      specifications = finalizeKvField(specField);
    } catch { setError("「规格参数」字段的 JSON 格式不正确，请检查后重试"); return; }

    setSaving(true);
    setError("");

    const payload = {
      name: form.name.trim(),
      name_en: form.name_en.trim(),
      slug: form.slug.trim(),
      emoji: form.emoji,
      category_id: form.category_id || null,
      region_id: form.region_id,
      status: form.status.trim() || "avail",
      sort_order: Number(form.sort_order) || 0,
      featured: Boolean(form.featured),
      retail: Number(form.retail) || 0,
      agent: Number(form.agent) || 0,
      cost: Number(form.cost) || 0,
      description: form.description,
      summary: form.summary,
      // 图片字段不在这里处理：保存时绝不写入 images，避免覆盖或清空已有图片。
      // 图片改为「后台上传 → Supabase Storage → 自动生成 URL → 写入 products.images」，
      // 由 ProductImagesEditor 独立完成，与这里的核心字段保存互不影响。
      includes,
      highlights,
      notes,
      faq,
      specifications,
    };

    const { data, error } = isEdit
      ? await supabase.from("products").update(payload).eq("id", form.id).select().single()
      : await supabase.from("products").insert(payload).select().single();

    setSaving(false);
    if (error) { setError(error.message); return; }
    onSaved(data);
  };

  return (
    <Modal
      title={isEdit ? "编辑产品" : "新建产品"}
      onClose={onClose}
      wide
      footer={
        <>
          <button className="adm-btn adm-btn-outline" onClick={onClose}>取消</button>
          <button className="adm-btn adm-btn-primary" onClick={save} disabled={saving}>
            {saving ? "保存中…" : "保存"}
          </button>
        </>
      }
    >
      {error && <div className="adm-notice danger">{error}</div>}

      <div className="adm-form-grid">
        <div className="adm-field">
          <label className="adm-label">产品中文名称</label>
          <input className="adm-input" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="如：玛雅湾直升机探索之旅" />
        </div>
        <div className="adm-field">
          <label className="adm-label">英文名称（资料用）</label>
          <input className="adm-input" value={form.name_en} onChange={(e) => set("name_en", e.target.value)} />
        </div>

        <div className="adm-field">
          <label className="adm-label">所属地区 <span style={{ color: "var(--danger)" }}>*</span></label>
          <select className="adm-select" value={form.region_id} onChange={(e) => set("region_id", e.target.value)}>
            <option value="" disabled>请选择地区</option>
            {regions.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
        <div className="adm-field">
          <label className="adm-label">所属分类</label>
          <select className="adm-select" value={form.category_id} onChange={(e) => set("category_id", e.target.value)}>
            <option value="">未分类</option>
            {categories.map((c) => (
              <option key={c.id} value={String(c.id)}>{c.emoji} {c.name}</option>
            ))}
          </select>
        </div>

        <div className="adm-field">
          <label className="adm-label">Slug（技术字段，前台链接使用）</label>
          <input className="adm-input" value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="如：maya-bay-heli" />
        </div>
        <div className="adm-field">
          <label className="adm-label">图标（emoji）</label>
          <input className="adm-input" value={form.emoji} onChange={(e) => set("emoji", e.target.value)} placeholder="🚁" />
        </div>

        <div className="adm-field">
          <label className="adm-label">销售状态</label>
          <input
            className="adm-input"
            list="adm-status-suggestions"
            value={form.status}
            onChange={(e) => set("status", e.target.value)}
            placeholder="avail"
          />
          <datalist id="adm-status-suggestions">
            {STATUS_SUGGESTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </datalist>
        </div>
        <div className="adm-field">
          <label className="adm-label">排序（数字越小越靠前）</label>
          <input className="adm-input" type="number" value={form.sort_order} onChange={(e) => set("sort_order", e.target.value)} />
        </div>

        <div className="adm-field" style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 26 }}>
          <input
            id="adm-featured"
            type="checkbox"
            checked={form.featured}
            onChange={(e) => set("featured", e.target.checked)}
          />
          <label htmlFor="adm-featured" className="adm-label" style={{ margin: 0 }}>设为主推产品</label>
        </div>
        <div className="adm-field" />

        <div className="adm-field">
          <label className="adm-label">零售价（泰铢）</label>
          <input className="adm-input" type="number" value={form.retail} onChange={(e) => set("retail", e.target.value)} />
        </div>
        <div className="adm-field">
          <label className="adm-label">代理价（泰铢）</label>
          <input className="adm-input" type="number" value={form.agent} onChange={(e) => set("agent", e.target.value)} />
        </div>
        <div className="adm-field full">
          <label className="adm-label" style={{ color: "var(--danger)" }}>成本价（泰铢）— 仅管理员可见</label>
          <input className="adm-input" type="number" value={form.cost} onChange={(e) => set("cost", e.target.value)} />
        </div>

        <div className="adm-field full">
          <label className="adm-label">产品摘要</label>
          <textarea className="adm-textarea" value={form.summary} onChange={(e) => set("summary", e.target.value)} />
        </div>
        <div className="adm-field full">
          <label className="adm-label">产品描述</label>
          <textarea className="adm-textarea" value={form.description} onChange={(e) => set("description", e.target.value)} />
        </div>
      </div>

      <JsonLinesBlock label="亮点（每行一条）" field={highlightsField} setField={setHighlightsField} />
      <JsonLinesBlock label="费用包含（每行一条）" field={includesField} setField={setIncludesField} />

      <div className="adm-field full">
        <label className="adm-label">产品图片</label>
        <ProductImagesEditor
          productId={product?.id || null}
          images={product?.images}
          onImagesChanged={onImagesChanged}
        />
      </div>

      <div className="adm-field full" style={{ marginTop: 6 }}>
        <label className="adm-label">常见问题（FAQ）</label>
        {faqField.mode === "qa" ? (
          <>
            {faqField.rows.map((f, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input className="adm-input" placeholder="问题" value={f.q} onChange={(e) => updateFaqRow(i, "q", e.target.value)} />
                <input className="adm-input" placeholder="回答" value={f.a} onChange={(e) => updateFaqRow(i, "a", e.target.value)} />
                <button type="button" className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => removeFaqRow(i)}>删除</button>
              </div>
            ))}
            <button type="button" className="adm-btn adm-btn-outline adm-btn-sm" onClick={addFaqRow}>+ 添加问题</button>
          </>
        ) : (
          <RawJsonEditor field={faqField} setField={setFaqField} />
        )}
      </div>

      <div className="adm-field full">
        <label className="adm-label">规格参数</label>
        {specField.mode === "kv" ? (
          <>
            {specField.rows.map((s, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <input className="adm-input" placeholder="名称，如：时长" value={s.label} onChange={(e) => updateSpecRow(i, "label", e.target.value)} />
                <input className="adm-input" placeholder="内容，如：3 小时" value={s.value} onChange={(e) => updateSpecRow(i, "value", e.target.value)} />
                <button type="button" className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => removeSpecRow(i)}>删除</button>
              </div>
            ))}
            <button type="button" className="adm-btn adm-btn-outline adm-btn-sm" onClick={addSpecRow}>+ 添加规格</button>
          </>
        ) : (
          <RawJsonEditor field={specField} setField={setSpecField} />
        )}
      </div>

      <JsonLinesBlock
        label="内部备注（每行一条）— 仅管理员可见"
        field={notesField}
        setField={setNotesField}
        danger
      />
    </Modal>
  );
}

function JsonLinesBlock({ label, field, setField, danger }) {
  return (
    <div className="adm-field full">
      <label className="adm-label" style={danger ? { color: "var(--danger)" } : undefined}>{label}</label>
      {field.mode === "json" ? (
        <RawJsonEditor field={field} setField={setField} />
      ) : (
        <textarea
          className="adm-textarea"
          value={field.text}
          onChange={(e) => setField({ mode: "lines", text: e.target.value })}
        />
      )}
    </div>
  );
}

function RawJsonEditor({ field, setField }) {
  return (
    <>
      <div className="adm-notice" style={{ marginBottom: 8, fontSize: 12 }}>
        该字段现有数据结构较复杂，已切换为 JSON 原始编辑模式，请谨慎修改。
      </div>
      <textarea
        className="adm-textarea"
        style={{ fontFamily: "monospace" }}
        value={field.text}
        onChange={(e) => setField({ ...field, text: e.target.value })}
      />
    </>
  );
}
