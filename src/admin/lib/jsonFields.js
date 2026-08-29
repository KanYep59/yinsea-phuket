// 通用 JSON 字段辅助函数：用于在后台产品表单中安全地编辑
// products 表里的 jsonb 字段（images / includes / notes / highlights / faq / specifications）。
//
// 设计原则：绝不假设已有生产数据的结构。只有当检测到数据确实符合预期的简单结构
// （字符串数组 / 问答数组 / 键值数组）时，才切换成更易用的表单控件；否则回退为
// 原始 JSON 文本框原样往返，保证不会因为猜错结构而破坏已有产品数据。

export function isStringArray(val) {
  return Array.isArray(val) && val.every((v) => typeof v === "string");
}

export function isQaArray(val) {
  return (
    Array.isArray(val) &&
    val.every(
      (v) =>
        v &&
        typeof v === "object" &&
        !Array.isArray(v) &&
        typeof v.q === "string" &&
        typeof v.a === "string"
    )
  );
}

export function isLabelValueArray(val) {
  return (
    Array.isArray(val) &&
    val.every(
      (v) =>
        v &&
        typeof v === "object" &&
        !Array.isArray(v) &&
        typeof v.label === "string" &&
        typeof v.value === "string"
    )
  );
}

// ---- 字符串数组字段（images / includes / notes / highlights）----
export function initLinesField(raw) {
  if (raw == null) return { mode: "lines", text: "" };
  if (Array.isArray(raw) && raw.length === 0) return { mode: "lines", text: "" };
  if (isStringArray(raw)) return { mode: "lines", text: raw.join("\n") };
  return { mode: "json", text: JSON.stringify(raw, null, 2) };
}

export function finalizeLinesField(field) {
  if (field.mode === "lines") {
    return field.text.split("\n").map((s) => s.trim()).filter(Boolean);
  }
  return field.text.trim() ? JSON.parse(field.text) : [];
}

// ---- 问答数组字段（faq）----
export function initQaField(raw) {
  if (raw == null || (Array.isArray(raw) && raw.length === 0)) return { mode: "qa", rows: [] };
  if (isQaArray(raw)) return { mode: "qa", rows: raw.map((r) => ({ q: r.q, a: r.a })) };
  return { mode: "json", text: JSON.stringify(raw, null, 2) };
}

export function finalizeQaField(field) {
  if (field.mode === "qa") {
    return field.rows
      .filter((r) => r.q.trim() || r.a.trim())
      .map((r) => ({ q: r.q.trim(), a: r.a.trim() }));
  }
  return field.text.trim() ? JSON.parse(field.text) : [];
}

// ---- 键值数组字段（specifications）----
export function initKvField(raw) {
  if (raw == null || (Array.isArray(raw) && raw.length === 0)) return { mode: "kv", rows: [] };
  if (isLabelValueArray(raw)) return { mode: "kv", rows: raw.map((r) => ({ label: r.label, value: r.value })) };
  return { mode: "json", text: JSON.stringify(raw, null, 2) };
}

export function finalizeKvField(field) {
  if (field.mode === "kv") {
    return field.rows
      .filter((r) => r.label.trim() || r.value.trim())
      .map((r) => ({ label: r.label.trim(), value: r.value.trim() }));
  }
  return field.text.trim() ? JSON.parse(field.text) : [];
}
