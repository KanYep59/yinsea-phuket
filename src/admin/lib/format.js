// 泰铢金额格式化：฿12,345
export function formatTHB(value) {
  const n = Number(value ?? 0);
  return "฿" + n.toLocaleString("zh-CN", { maximumFractionDigits: 0 });
}

// 中文日期格式：2026年8月24日
export function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });
}

// 中文日期时间格式：2026年8月24日 14:30
export function formatDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("zh-CN", {
    year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export const STATUS_LABELS = {
  avail: "可售",
  hot: "紧张",
  full: "已满",
  offline: "已下架",
};

export const ORDER_STATUS_LABELS = {
  pending: "待确认",
  confirmed: "已确认",
  completed: "已完成",
  cancelled: "已取消",
};

export const PROFILE_STATUS_LABELS = {
  active: "启用",
  disabled: "已停用",
};
