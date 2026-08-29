import { useEffect } from "react";

export function Modal({ title, onClose, children, footer, wide }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="adm-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="adm-modal" style={wide ? { maxWidth: 860 } : undefined}>
        <div className="adm-modal-header">
          <div className="adm-modal-title">{title}</div>
          <button className="adm-modal-close" onClick={onClose}>✕</button>
        </div>
        {children}
        {footer && <div className="adm-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmDialog({ title = "确认操作", message, confirmLabel = "确认", danger, onConfirm, onCancel }) {
  return (
    <Modal
      title={title}
      onClose={onCancel}
      footer={
        <>
          <button className="adm-btn adm-btn-outline" onClick={onCancel}>取消</button>
          <button className={`adm-btn ${danger ? "adm-btn-danger" : "adm-btn-primary"}`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </>
      }
    >
      <p style={{ fontSize: 13, color: "var(--mist)", lineHeight: 1.7 }}>{message}</p>
    </Modal>
  );
}

export function StatusBadge({ status, labels, className }) {
  const label = labels?.[status] ?? status;
  const variant =
    status === "avail" || status === "active" || status === "completed" ? "avail" :
    status === "hot" || status === "pending" ? "hot" :
    status === "full" || status === "cancelled" ? "full" :
    "offline";
  return <span className={`adm-badge adm-badge-${variant} ${className || ""}`}>{label}</span>;
}

export function EmptyState({ title = "暂无数据", desc = "" }) {
  return (
    <div className="adm-empty">
      <div className="adm-empty-title">{title}</div>
      {desc && <div style={{ fontSize: 12 }}>{desc}</div>}
    </div>
  );
}

export function Loading({ label = "加载中…" }) {
  return <div className="adm-loading">{label}</div>;
}

export function Notice({ children, danger }) {
  return <div className={`adm-notice ${danger ? "danger" : ""}`}>{children}</div>;
}
