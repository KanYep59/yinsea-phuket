import { useState, useEffect, useRef } from "react";
import { loadPublicCatalog } from "./lib/publicCatalog.js";
const STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@200;300;400;500&family=Noto+Serif+SC:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --noir: #0a0c0f;
    --deep: #111418;
    --surface: #161b22;
    --card: #1c2330;
    --border: rgba(255,255,255,0.07);
    --gold: #c9a96e;
    --gold-light: #e8d5a3;
    --gold-dim: rgba(201,169,110,0.15);
    --pearl: #f5f0e8;
    --mist: rgba(245,240,232,0.55);
    --fog: rgba(245,240,232,0.25);
    --accent-teal: #4ecdc4;
    --danger: #e05555;
    --success: #4caf7d;
    --warn: #e8a838;
    --font-display: 'Cormorant Garamond', 'Noto Serif SC', serif;
    --font-ui: 'Jost', 'Noto Serif SC', sans-serif;
    --font-cn: 'Noto Serif SC', serif;
    --r: 4px;
    --r-lg: 12px;
  }

  body { background: var(--noir); color: var(--pearl); font-family: var(--font-ui); -webkit-font-smoothing: antialiased; overflow-x: hidden; }
  ::selection { background: var(--gold); color: var(--noir); }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--deep); }
  ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 2px; }
  .app { min-height: 100vh; }
  .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 100; padding: 0 24px; height: 64px; display: flex; align-items: center; justify-content: space-between; background: rgba(10,12,15,0.9); backdrop-filter: blur(20px); border-bottom: 1px solid var(--border); }
  .nav-brand { display: flex; flex-direction: column; line-height: 1; }
  .nav-brand-cn { font-family: var(--font-cn); font-weight: 300; font-size: 18px; color: var(--gold); letter-spacing: 0.15em; }
  .nav-brand-en { font-family: var(--font-display); font-size: 10px; font-weight: 300; color: var(--mist); letter-spacing: 0.35em; text-transform: uppercase; }
  .nav-right { display: flex; align-items: center; gap: 16px; }
  .nav-role-badge { font-size: 10px; font-weight: 400; letter-spacing: 0.2em; text-transform: uppercase; padding: 4px 10px; border: 1px solid var(--gold); color: var(--gold); border-radius: 20px; }
  .nav-btn { background: none; border: none; color: var(--mist); font-family: var(--font-ui); font-size: 12px; font-weight: 300; letter-spacing: 0.1em; cursor: pointer; padding: 6px 12px; border-radius: 20px; transition: all 0.2s; }
  .nav-btn:hover { color: var(--pearl); background: var(--border); }
  .nav-btn.gold { background: var(--gold); color: var(--noir); font-weight: 500; }
  .nav-btn.gold:hover { background: var(--gold-light); }
  .hamburger { display: none; background: none; border: none; cursor: pointer; flex-direction: column; gap: 5px; padding: 8px; }
  .hamburger span { display: block; width: 22px; height: 1px; background: var(--pearl); transition: all 0.3s; }
  .hero { min-height: 100svh; display: flex; flex-direction: column; justify-content: flex-end; padding: 40px 24px; padding-top: 100px; position: relative; overflow: hidden; }
  .hero-bg { position: absolute; inset: 0; background: linear-gradient(135deg, #0a0c0f 0%, #0d1520 40%, #0a1a2e 100%); }
  .hero-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(201,169,110,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.04) 1px, transparent 1px); background-size: 60px 60px; }
  .hero-glow { position: absolute; top: 20%; right: -10%; width: 500px; height: 500px; background: radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%); border-radius: 50%; animation: pulse 6s ease-in-out infinite; }
  .hero-glow2 { position: absolute; bottom: 10%; left: -5%; width: 400px; height: 400px; background: radial-gradient(circle, rgba(78,205,196,0.05) 0%, transparent 70%); border-radius: 50%; animation: pulse 8s ease-in-out infinite reverse; }
  @keyframes pulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.1); opacity: 0.7; } }
  .hero-content { position: relative; z-index: 1; max-width: 600px; }
  .hero-label { font-size: 10px; font-weight: 400; letter-spacing: 0.4em; text-transform: uppercase; color: var(--gold); margin-bottom: 16px; display: flex; align-items: center; gap: 12px; }
  .hero-label::before { content: ''; display: block; width: 30px; height: 1px; background: var(--gold); }
  .hero-title { font-family: var(--font-display); font-size: clamp(42px, 10vw, 72px); font-weight: 300; line-height: 1.1; color: var(--pearl); margin-bottom: 8px; }
  .hero-title span { color: var(--gold); font-style: italic; }
  .hero-subtitle-cn { font-family: var(--font-cn); font-size: clamp(18px, 4vw, 28px); font-weight: 300; color: var(--mist); letter-spacing: 0.25em; margin-bottom: 24px; }
  .hero-desc { font-size: 13px; font-weight: 300; line-height: 1.8; color: var(--fog); max-width: 380px; margin-bottom: 32px; letter-spacing: 0.05em; }
  .hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }
  .btn-primary { padding: 14px 28px; background: var(--gold); color: var(--noir); border: none; font-family: var(--font-ui); font-size: 12px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; border-radius: var(--r); transition: all 0.3s; }
  .btn-primary:hover { background: var(--gold-light); transform: translateY(-1px); }
  .btn-outline { padding: 14px 28px; background: transparent; color: var(--pearl); border: 1px solid var(--border); font-family: var(--font-ui); font-size: 12px; font-weight: 300; letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; border-radius: var(--r); transition: all 0.3s; }
  .btn-outline:hover { border-color: var(--gold); color: var(--gold); }
  .hero-scroll { position: absolute; bottom: 32px; right: 24px; display: flex; flex-direction: column; align-items: center; gap: 8px; animation: scrollBounce 2s ease-in-out infinite; }
  .hero-scroll span { font-size: 9px; letter-spacing: 0.3em; color: var(--fog); text-transform: uppercase; writing-mode: vertical-rl; }
  .hero-scroll-line { width: 1px; height: 40px; background: linear-gradient(to bottom, var(--gold), transparent); }
  @keyframes scrollBounce { 0%,100% { transform: translateY(0); } 50% { transform: translateY(6px); } }
  .stats-bar { background: var(--surface); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 20px 24px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; }
  .stat-item { text-align: center; padding: 8px 4px; border-right: 1px solid var(--border); }
  .stat-item:last-child { border-right: none; }
  .stat-num { font-family: var(--font-display); font-size: 28px; font-weight: 300; color: var(--gold); line-height: 1; }
  .stat-label { font-size: 10px; font-weight: 300; color: var(--fog); letter-spacing: 0.15em; margin-top: 4px; }
  .section { padding: 60px 24px; }
  .section-header { margin-bottom: 36px; }
  .section-label { font-size: 10px; font-weight: 400; letter-spacing: 0.4em; text-transform: uppercase; color: var(--gold); margin-bottom: 10px; display: flex; align-items: center; gap: 10px; }
  .section-label::after { content: ''; flex: 1; max-width: 40px; height: 1px; background: var(--gold); }
  .section-title { font-family: var(--font-display); font-size: clamp(28px, 6vw, 42px); font-weight: 300; line-height: 1.2; color: var(--pearl); }
  .section-title-cn { font-family: var(--font-cn); font-size: 14px; font-weight: 300; color: var(--mist); letter-spacing: 0.2em; margin-top: 6px; }
  .cat-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .cat-card { position: relative; border-radius: var(--r-lg); overflow: hidden; cursor: pointer; aspect-ratio: 1; background: var(--card); border: 1px solid var(--border); transition: all 0.4s; }
  .cat-card:first-child { grid-column: span 2; aspect-ratio: 2.5/1; }
  .cat-card:hover { border-color: var(--gold); transform: translateY(-2px); }
  .cat-bg { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 60px; opacity: 0.12; transition: all 0.4s; }
  .cat-card:hover .cat-bg { opacity: 0.2; transform: scale(1.1); }
  .cat-gradient { position: absolute; inset: 0; background: linear-gradient(to top, rgba(10,12,15,0.9) 0%, transparent 60%); }
  .cat-content { position: absolute; bottom: 0; left: 0; right: 0; padding: 16px; }
  .cat-icon { font-size: 22px; margin-bottom: 6px; }
  .cat-name { font-family: var(--font-cn); font-size: 16px; font-weight: 400; color: var(--pearl); letter-spacing: 0.1em; }
  .cat-name-en { font-size: 10px; font-weight: 300; color: var(--mist); letter-spacing: 0.25em; text-transform: uppercase; margin-top: 2px; }
  .cat-count { position: absolute; top: 12px; right: 12px; font-size: 10px; color: var(--gold); background: rgba(201,169,110,0.1); border: 1px solid rgba(201,169,110,0.3); padding: 3px 8px; border-radius: 20px; letter-spacing: 0.1em; }
  .product-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
  .product-card { background: var(--card); border: 1px solid var(--border); border-radius: var(--r-lg); overflow: hidden; cursor: pointer; transition: all 0.4s; }
  .product-card:hover { border-color: rgba(201,169,110,0.4); transform: translateY(-2px); box-shadow: 0 20px 60px rgba(0,0,0,0.4); }
  .product-img { width: 100%; height: 220px; background: var(--surface); display: flex; align-items: center; justify-content: center; font-size: 64px; position: relative; overflow: hidden; }
  .product-img-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 50%, rgba(10,12,15,0.6)); }
  .product-badges { position: absolute; top: 12px; left: 12px; display: flex; gap: 6px; }
  .badge { font-size: 9px; font-weight: 400; letter-spacing: 0.15em; text-transform: uppercase; padding: 3px 8px; border-radius: 20px; }
  .badge-avail { background: #4caf7d; border: 1px solid #4caf7d; color: #fff; font-weight: 500; text-shadow: 0 1px 2px rgba(0,0,0,0.3); }
  .badge-hot { background: #e8a838; border: 1px solid #e8a838; color: #fff; font-weight: 500; text-shadow: 0 1px 2px rgba(0,0,0,0.3); }
  .badge-full { background: #e05555; border: 1px solid #e05555; color: #fff; font-weight: 500; text-shadow: 0 1px 2px rgba(0,0,0,0.3); }
  .badge-cat { background: rgba(0,0,0,0.55); border: 1px solid rgba(255,255,255,0.25); color: #fff; font-weight: 400; backdrop-filter: blur(4px); }
  .product-body { padding: 16px; }
  .product-name { font-family: var(--font-cn); font-size: 18px; font-weight: 400; color: var(--pearl); letter-spacing: 0.05em; margin-bottom: 4px; }
  .product-name-en { font-size: 11px; font-weight: 300; color: var(--mist); letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 10px; }
  .product-desc { font-size: 12px; font-weight: 300; color: var(--fog); line-height: 1.7; margin-bottom: 14px; }
  .product-price-row { display: flex; align-items: flex-end; justify-content: space-between; }
  .price-from { font-size: 10px; color: var(--fog); letter-spacing: 0.15em; text-transform: uppercase; }
  .price-val { font-family: var(--font-display); font-size: 24px; font-weight: 300; color: var(--gold); line-height: 1; }
  .price-unit { font-size: 10px; color: var(--mist); margin-left: 2px; }
  .price-agent-row { background: rgba(201,169,110,0.05); border: 1px solid rgba(201,169,110,0.1); border-radius: var(--r); padding: 10px 12px; margin-top: 12px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 4px; }
  .price-agent-item { text-align: center; }
  .price-agent-label { font-size: 9px; color: var(--fog); letter-spacing: 0.1em; }
  .price-agent-value { font-size: 13px; font-weight: 400; margin-top: 2px; }
  .price-market { color: var(--mist); }
  .price-agent { color: var(--gold); }
  .price-profit { color: var(--success); }
  .internal-panel { background: rgba(224,85,85,0.05); border: 1px solid rgba(224,85,85,0.15); border-radius: var(--r); padding: 10px 12px; margin-top: 10px; }
  .internal-label { font-size: 9px; color: rgba(224,85,85,0.7); letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; }
  .internal-label::before { content: '🔒'; font-size: 10px; }
  .internal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 11px; }
  .internal-row { display: flex; justify-content: space-between; }
  .internal-key { color: var(--fog); }
  .internal-val { color: var(--pearl); font-weight: 400; }
  .supplier-tag { font-size: 10px; color: var(--accent-teal); background: rgba(78,205,196,0.1); border: 1px solid rgba(78,205,196,0.2); padding: 3px 8px; border-radius: 20px; margin-top: 6px; display: inline-block; }
  .detail-page { padding-top: 64px; min-height: 100vh; }
  .detail-hero { height: 55vw; max-height: 360px; background: var(--card); display: flex; align-items: center; justify-content: center; font-size: 100px; position: relative; overflow: hidden; }
  .detail-hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 40%, var(--noir) 100%); }
  .detail-content { padding: 24px; }
  .detail-header { margin-bottom: 24px; }
  .detail-name { font-family: var(--font-cn); font-size: 28px; font-weight: 400; color: var(--pearl); letter-spacing: 0.05em; line-height: 1.3; }
  .detail-name-en { font-family: var(--font-display); font-size: 14px; font-weight: 300; color: var(--mist); letter-spacing: 0.25em; margin-top: 4px; font-style: italic; }
  .detail-divider { width: 40px; height: 1px; background: var(--gold); margin: 16px 0; }
  .detail-section { margin-bottom: 28px; }
  .detail-section-title { font-size: 11px; font-weight: 500; letter-spacing: 0.25em; text-transform: uppercase; color: var(--gold); margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid var(--border); }
  .detail-text { font-size: 13px; font-weight: 300; line-height: 1.9; color: var(--mist); }
  .include-list, .exclude-list { list-style: none; }
  .include-list li, .exclude-list li { font-size: 13px; font-weight: 300; line-height: 1.6; padding: 6px 0; border-bottom: 1px solid var(--border); display: flex; align-items: flex-start; gap: 8px; color: var(--mist); }
  .include-list li::before { content: '✓'; color: var(--success); flex-shrink: 0; margin-top: 1px; }
  .exclude-list li::before { content: '✕'; color: var(--danger); flex-shrink: 0; margin-top: 1px; }
  .faq-item { border-bottom: 1px solid var(--border); }
  .faq-q { font-size: 13px; font-weight: 400; color: var(--pearl); padding: 12px 0; display: flex; justify-content: space-between; align-items: center; cursor: pointer; }
  .faq-a { font-size: 12px; font-weight: 300; color: var(--mist); line-height: 1.8; padding-bottom: 14px; }
  .price-box { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 20px; }
  .price-box-title { font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; color: var(--fog); margin-bottom: 16px; }
  .price-main { font-family: var(--font-display); font-size: 36px; font-weight: 300; color: var(--gold); }
  .price-currency { font-size: 14px; color: var(--mist); }
  .contact-btns { display: flex; flex-direction: column; gap: 10px; margin-top: 16px; }
  .contact-btn { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 14px; border-radius: var(--r); font-family: var(--font-ui); font-size: 13px; font-weight: 400; letter-spacing: 0.1em; cursor: pointer; border: none; transition: all 0.2s; }
  .contact-wechat { background: #07c160; color: #fff; }
  .contact-whatsapp { background: #25d366; color: #fff; }
.back-btn { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 400; color: var(--pearl); cursor: pointer; padding: 12px 24px; background: none; border: none; transition: color 0.2s; letter-spacing: 0.05em; }
  .back-btn:hover { color: var(--gold); }
  .search-bar { display: flex; align-items: center; gap: 10px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 10px 16px; margin-bottom: 20px; transition: border-color 0.2s; }
  .search-bar:focus-within { border-color: var(--gold); }
  .search-bar input { flex: 1; background: none; border: none; outline: none; font-family: var(--font-ui); font-size: 14px; font-weight: 300; color: var(--pearl); }
  .search-bar input::placeholder { color: var(--fog); }
  .filter-tabs { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 8px; margin-bottom: 20px; scrollbar-width: none; }
  .filter-tabs::-webkit-scrollbar { display: none; }
  .filter-tab { flex-shrink: 0; padding: 7px 16px; border-radius: 20px; font-size: 12px; font-weight: 300; letter-spacing: 0.1em; cursor: pointer; border: 1px solid var(--border); background: none; color: var(--mist); transition: all 0.2s; font-family: var(--font-ui); }
  .filter-tab.active { background: var(--gold); color: var(--noir); border-color: var(--gold); font-weight: 500; }
  .login-overlay { position: fixed; inset: 0; z-index: 200; background: rgba(10,12,15,0.95); backdrop-filter: blur(20px); display: flex; align-items: center; justify-content: center; padding: 24px; }
  .login-box { width: 100%; max-width: 380px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 32px 28px; }
  .login-logo { text-align: center; margin-bottom: 28px; }
  .login-logo-cn { font-family: var(--font-cn); font-size: 26px; font-weight: 300; color: var(--gold); letter-spacing: 0.2em; }
  .login-logo-en { font-family: var(--font-display); font-size: 10px; font-weight: 300; color: var(--mist); letter-spacing: 0.35em; text-transform: uppercase; margin-top: 4px; }
  .login-tabs { display: flex; margin-bottom: 24px; border: 1px solid var(--border); border-radius: var(--r); overflow: hidden; }
  .login-tab { flex: 1; padding: 10px; font-size: 12px; font-weight: 300; letter-spacing: 0.1em; cursor: pointer; border: none; background: none; color: var(--fog); font-family: var(--font-ui); transition: all 0.2s; }
  .login-tab.active { background: var(--gold); color: var(--noir); font-weight: 500; }
  .form-group { margin-bottom: 14px; }
  .form-label { font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--fog); margin-bottom: 6px; display: block; }
  .form-input { width: 100%; background: var(--card); border: 1px solid var(--border); border-radius: var(--r); padding: 11px 14px; font-family: var(--font-ui); font-size: 14px; font-weight: 300; color: var(--pearl); outline: none; transition: border-color 0.2s; }
  .form-input:focus { border-color: var(--gold); }
  .login-hint { font-size: 10px; color: var(--fog); line-height: 1.6; margin-bottom: 20px; background: var(--card); border-radius: var(--r); padding: 10px 12px; }
  .login-hint strong { color: var(--gold); }
  .form-submit { width: 100%; padding: 13px; background: var(--gold); color: var(--noir); border: none; border-radius: var(--r); font-family: var(--font-ui); font-size: 12px; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase; cursor: pointer; transition: all 0.2s; }
  .admin-panel { padding: 80px 24px 40px; }
  .admin-title { font-family: var(--font-display); font-size: 28px; font-weight: 300; color: var(--pearl); }
  .admin-subtitle { font-size: 12px; color: var(--fog); margin-top: 4px; margin-bottom: 28px; }
  .admin-tabs { display: flex; background: var(--surface); border: 1px solid var(--border); border-radius: var(--r); overflow: hidden; margin-bottom: 24px; }
  .admin-tab { flex: 1; padding: 11px 8px; font-size: 11px; cursor: pointer; border: none; background: none; color: var(--fog); font-family: var(--font-ui); transition: all 0.2s; text-align: center; }
  .admin-tab.active { background: var(--deep); color: var(--gold); border-bottom: 2px solid var(--gold); }
  .admin-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 20px; margin-bottom: 16px; }
  .admin-card-title { font-size: 15px; font-weight: 400; color: var(--pearl); }
  .admin-price-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 10px; }
  .admin-price-item { background: var(--card); border-radius: var(--r); padding: 10px; text-align: center; }
  .admin-price-label { font-size: 9px; letter-spacing: 0.15em; text-transform: uppercase; color: var(--fog); margin-bottom: 4px; }
  .supplier-list { margin-top: 12px; }
  .supplier-row { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 12px; }
  .supplier-name { color: var(--mist); }
  .supplier-best { color: var(--success); }
  .supplier-normal { color: var(--pearl); }
  .note-tag { display: inline-block; background: var(--card); border: 1px solid var(--border); border-radius: var(--r); padding: 4px 10px; font-size: 11px; color: var(--mist); margin: 3px; }
  .add-product-btn { width: 100%; padding: 14px; background: linear-gradient(135deg, var(--gold-dim), transparent); border: 1px dashed rgba(201,169,110,0.4); border-radius: var(--r-lg); font-family: var(--font-ui); font-size: 13px; color: var(--gold); cursor: pointer; margin-bottom: 16px; }
  .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
  .stats-card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--r-lg); padding: 16px; }
  .stats-card-num { font-family: var(--font-display); font-size: 32px; font-weight: 300; color: var(--gold); }
  .stats-card-label { font-size: 11px; color: var(--fog); margin-top: 4px; }
  .profit-highlight { color: #4caf7d !important; }
  .contact-float { position: fixed; bottom: 24px; right: 16px; z-index: 90; display: flex; flex-direction: column; gap: 10px; }
  .float-btn { width: 48px; height: 48px; border-radius: 50%; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 22px; box-shadow: 0 4px 20px rgba(0,0,0,0.4); }
  .float-wechat { background: #07c160; }
  .float-whatsapp { background: #25d366; }
  .footer { background: var(--deep); border-top: 1px solid var(--border); padding: 40px 24px 24px; }
  .footer-brand { font-family: var(--font-cn); font-size: 22px; font-weight: 300; color: var(--gold); letter-spacing: 0.2em; margin-bottom: 4px; }
  .footer-tagline { font-family: var(--font-display); font-size: 11px; color: var(--fog); letter-spacing: 0.3em; font-style: italic; margin-bottom: 24px; }
  .footer-links { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
  .footer-links-group h4 { font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: var(--gold); margin-bottom: 12px; }
  .footer-links-group a { display: block; font-size: 12px; color: var(--fog); margin-bottom: 8px; cursor: pointer; }
  .footer-bottom { border-top: 1px solid var(--border); padding-top: 16px; font-size: 10px; color: rgba(245,240,232,0.2); text-align: center; }
  .mobile-menu { position: fixed; inset: 0; z-index: 150; background: var(--noir); padding: 24px; padding-top: 80px; transform: translateX(100%); transition: transform 0.3s ease; display: flex; flex-direction: column; gap: 8px; }
  .mobile-menu.open { transform: translateX(0); }
  .mobile-menu-item { font-family: var(--font-cn); font-size: 22px; color: var(--pearl); padding: 14px 0; border-bottom: 1px solid var(--border); cursor: pointer; display: flex; justify-content: space-between; }
  .mobile-menu-close { position: absolute; top: 20px; right: 20px; background: none; border: none; color: var(--mist); font-size: 24px; cursor: pointer; }
  .faq-item { border-bottom: 1px solid var(--border); }
  .tag-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
  .empty-state { text-align: center; padding: 60px 20px; color: var(--fog); }
  @media (min-width: 640px) { .product-grid { grid-template-columns: repeat(2, 1fr); } .cat-grid { grid-template-columns: repeat(3, 1fr); } .cat-card:first-child { grid-column: span 3; } .hamburger { display: none; } }
  @media (max-width: 639px) { .hamburger { display: flex; } .nav-right .nav-btn:not(.gold) { display: none; } .stats-bar { grid-template-columns: repeat(2, 1fr); } }
`;const CATEGORIES = [
  { id: "yacht", icon: "⛵", name: "游艇出海", en: "Yacht Charter", cover: "https://i.ibb.co/zVD2W28k/photo-2026-06-10-00-59-12.jpg" },
  { id: "villa", icon: "🏛️", name: "奢华别墅", en: "Luxury Villa", cover: "https://i.ibb.co/bgT6WtC1/photo-2026-06-10-00-59-11.jpg" },
  { id: "car", icon: "🚘", name: "豪华包车", en: "Private Transfer", cover: "https://i.ibb.co/ZR7RNTF6/photo-2026-06-10-00-59-09.jpg" },
  { id: "custom", icon: "✨", name: "隐海定制", en: "Bespoke", cover: "https://i.ibb.co/Mk19mKXS/image.png" },
  { id: "photo", icon: "📸", name: "旅拍写真", en: "Travel Photo", cover: "https://i.ibb.co/mVftcPGz/photo-2026-06-26-00-49-38.jpg" },
  { id: "heli", icon: "🚁", name: "直升机", en: "Helicopter", cover: "https://i.ibb.co/CKzXK2yq/large-634-A1398-resized-0f22e28a9c.jpg" },
  { id: "spa", icon: "🎯", name: "极境射击", en: "Shooting Range" },
];
  
export default function App() {
  const [role, setRole] = useState("guest");
  const [page, setPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCat, setSelectedCat] = useState("all");
  const [searchQ, setSearchQ] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [loginTab, setLoginTab] = useState("agent");
  const [menuOpen, setMenuOpen] = useState(false);
  const [catalog, setCatalog] = useState(() => ({
    products: [],
    categories: CATEGORIES,
    regions: [],
  }));

  useEffect(() => {
    let cancelled = false;

    loadPublicCatalog({ fallbackCategories: CATEGORIES }).then((nextCatalog) => {
      if (!cancelled && nextCatalog) setCatalog(nextCatalog);
    }).catch(() => {});

    return () => { cancelled = true; };
  }, []);

  const products = catalog.products;
  const categories = catalog.categories;

  const navigate = (p) => { setPage(p); setMenuOpen(false); window.scrollTo(0, 0); };

  // 官网不保存或校验任何账号密码。选择角色后统一进入正式后台，
  // 由 Supabase 进行真实账号验证并根据账号角色跳转。
  const login = () => {
    window.location.assign(`/admin/login?role=${loginTab}`);
  };

  const logout = () => { setRole("guest"); navigate("home"); };

  const filteredProducts = products.filter(p => {
    const matchCat = selectedCat === "all" || p.cat === selectedCat;
    const matchQ = !searchQ || p.name.includes(searchQ) || p.nameEn.toLowerCase().includes(searchQ.toLowerCase()) || p.desc.includes(searchQ);
    return matchCat && matchQ;
  });

  const statusBadge = (s) => {
    if (s === "avail") return <span className="badge badge-avail">可售</span>;
    if (s === "hot") return <span className="badge badge-hot">紧张</span>;
    if (s === "full") return <span className="badge badge-full">已满</span>;
  };

  return (
    <div className="app">
      <style>{STYLE}</style>
      <nav className="nav">
        <div className="nav-brand" onClick={() => navigate("home")} style={{ cursor: "pointer" }}>
          <span className="nav-brand-cn">隐海</span>
          <span className="nav-brand-en">YINSEA PHUKET</span> 
        </div>
        <div className="nav-right">
          {role !== "guest" && <span className="nav-role-badge">{role === "admin" ? "管理员" : "代理商"}</span>}
          <button className="nav-btn" onClick={() => navigate("products")}>产品库</button>
          {role === "admin" && <button className="nav-btn" onClick={() => navigate("admin")}>后台</button>}
          {role === "guest"
            ? <button className="nav-btn gold" onClick={() => setShowLogin(true)}>登录</button>
            : <button className="nav-btn" onClick={logout}>退出</button>}
          <button className="hamburger" onClick={() => setMenuOpen(true)}>
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        <button className="mobile-menu-close" onClick={() => setMenuOpen(false)}>✕</button>
        {["游艇", "别墅", "SPA", "旅拍", "直升机", "定制"].map(c => (
          <div key={c} className="mobile-menu-item" onClick={() => { navigate("products"); setMenuOpen(false); }}>
            {c} <span style={{ color: "var(--gold)", fontSize: 14 }}>›</span>
          </div>
        ))}
        {role === "guest" && (
          <button className="btn-primary" style={{ marginTop: 20 }} onClick={() => { setShowLogin(true); setMenuOpen(false); }}>
            登录
          </button>
        )}
      </div>

      {showLogin && (
        <div className="login-overlay" onClick={e => e.target === e.currentTarget && setShowLogin(false)}>
          <div className="login-box">
            <div className="login-logo">
              <div className="login-logo-cn">隐海</div>
              <div className="login-logo-en">YINSEA PHUKET</div>
            </div>
            <div className="login-tabs">
              {["agent", "admin"].map(t => (
                <button key={t} className={`login-tab${loginTab === t ? " active" : ""}`} onClick={() => setLoginTab(t)}>
                  {t === "agent" ? "代理商登录" : "管理员登录"}
                </button>
              ))}
            </div>
            <div className="login-hint">
              请使用已分配的正式账号登录
            </div>
            <button className="form-submit" onClick={login}>
              进入{loginTab === "agent" ? "代理商" : "管理员"}登录
            </button>
          </div>
        </div>
      )}

      {page === "home" && <HomePage navigate={navigate} products={products} categories={categories} setSelectedCat={setSelectedCat} statusBadge={statusBadge} setSelectedProduct={setSelectedProduct} role={role} />}
      {page === "join" && <JoinPage navigate={navigate} />}
      {page === "partner" && <PartnerPage navigate={navigate} />}
      {page === "about" && <AboutPage navigate={navigate} />}
      {page === "products" && <ProductsPage products={filteredProducts} categories={categories} role={role} selectedCat={selectedCat} setSelectedCat={setSelectedCat} searchQ={searchQ} setSearchQ={setSearchQ} statusBadge={statusBadge} setSelectedProduct={(p) => { setSelectedProduct(p); navigate("detail"); }} />}
      {page === "detail" && selectedProduct && <DetailPage product={selectedProduct} role={role} back={() => navigate("products")} statusBadge={statusBadge} />}
      {page !== "admin" && <Footer navigate={navigate} />}
      {page !== "admin" && (
        <div className="contact-float">
          <button className="float-btn float-wechat">💬</button>
          <button className="float-btn float-whatsapp">📱</button>
        </div>
      )}
    </div>
  );
}function HomePage({ navigate, products, categories, setSelectedCat, setSelectedProduct, statusBadge, role }) {
  return (
    <>
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-glow" />
        <div className="hero-glow2" />
        <div className="hero-content">
          <div className="hero-label">Phuket Luxury Bespoke</div>
          <h1 className="hero-title">隐海 <span>YINSEA</span></h1>
          <div style={{ marginBottom: 24 }}>
  <div style={{ fontSize: "clamp(18px,4.5vw,26px)", fontWeight: 300, color: "rgba(245,240,232,0.9)", letterSpacing: "0.2em", lineHeight: 1.5, fontFamily: "var(--font-cn)" }}>隐于海之深处</div>
  <div style={{ width: 24, height: 1, background: "rgba(201,169,110,0.5)", margin: "8px 0" }} />
  <div style={{ fontSize: "clamp(18px,4.5vw,26px)", fontWeight: 300, color: "rgba(245,240,232,0.5)", letterSpacing: "0.2em", lineHeight: 1.5, fontFamily: "var(--font-cn)" }}>寻得奢华本真</div>
</div>
          <p className="hero-desc">专为高净值旅行者甄选普吉岛最稀缺的体验资源。游艇、别墅、定制行程，每一刻都是专属奢华。</p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => navigate("products")}>探索产品库</button>
            <button className="btn-outline" onClick={() => navigate("products")}>了解定制服务</button>
          </div>
        </div>
        <div className="hero-scroll"><span>Scroll</span><div className="hero-scroll-line" /></div>
      </section>

      <div className="stats-bar">
        {[["300+", "精选产品"], ["98%", "好评率"], ["5★", "服务评级"], ["24H", "专属响应"]].map(([n, l]) => (
          <div key={l} className="stat-item"><div className="stat-num">{n}</div><div className="stat-label">{l}</div></div>
        ))}
      </div>

      <section className="section">
        <div className="section-header">
          <div className="section-label">Categories</div>
          <h2 className="section-title">产品分类</h2>
          <div className="section-title-cn">探索普吉岛独家资源</div>
        </div>
        <div className="cat-grid">
          {categories.map((cat) => (
            <div key={cat.id} className="cat-card" onClick={() => { setSelectedCat(cat.id); navigate("products"); }}>
              {cat.cover
  ? <img src={cat.cover} alt={cat.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }} />
  : <div className="cat-bg">{cat.icon}</div>
}
              <div className="cat-gradient" />
              <div className="cat-count">{products.filter(p => p.cat === cat.id).length}</div>
              <div className="cat-content">
                <div className="cat-name">{cat.name}</div>
                <div className="cat-name-en">{cat.en}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-header">
          <div className="section-label">Featured</div>
          <h2 className="section-title">精选推荐</h2>
        </div>
        <div className="product-grid">
          {["villa", "yacht", "photo"].map(catId => {
  const topProduct = [...products].filter(item => item.cat === catId).sort((a, b) => b.retail - a.retail)[0];
  return topProduct ? <ProductCard key={topProduct.id} product={topProduct} categories={categories} role={role} statusBadge={statusBadge} onClick={() => { setSelectedProduct(topProduct); navigate("detail"); }} /> : null;
})}
        </div>
      </section>
    </>
  );
}

function ProductsPage({ products, categories, role, selectedCat, setSelectedCat, searchQ, setSearchQ, statusBadge, setSelectedProduct }) {
  const [yachtSub, setYachtSub] = useState("all");

  const sortedProducts = (selectedCat === "yacht" || selectedCat === "villa")
    ? [...products].sort((a, b) => b.retail - a.retail)
    : products;

  const filteredByYachtSub = sortedProducts.filter(p => {
    if (selectedCat !== "yacht") return true;
    if (yachtSub === "all") return true;
    if (yachtSub === "motor") {
      return p.nameEn && (
        p.nameEn.toLowerCase().includes("demarest") ||
        p.nameEn.toLowerCase().includes("happy ours") ||
        p.nameEn.toLowerCase().includes("treasure") ||
        p.nameEn.toLowerCase().includes("olympia") ||
        p.nameEn.toLowerCase().includes("oceana") ||
        p.nameEn.toLowerCase().includes("ferretti") ||
        p.nameEn.toLowerCase().includes("bayc") ||
        p.nameEn.toLowerCase().includes("kati princess") ||
        p.nameEn.toLowerCase().includes("reinwood") ||
        p.nameEn.toLowerCase().includes("moon glider") ||
        p.nameEn.toLowerCase().includes("astondoa") ||
        p.nameEn.toLowerCase().includes("velasco") ||
        p.nameEn.toLowerCase().includes("majesty 48")
      );
    }
   if (yachtSub === "sailing") {
      return p.nameEn && (
        p.nameEn.toLowerCase().includes("catamaran") ||
        p.nameEn.toLowerCase().includes("sailing") ||
        p.nameEn.toLowerCase().includes("lagoon") ||
        p.nameEn.toLowerCase().includes("leopard") ||
        p.nameEn.toLowerCase().includes("bohemian") ||
        p.nameEn.toLowerCase().includes("delight") ||
        p.nameEn.toLowerCase().includes("calypso") ||
        p.nameEn.toLowerCase().includes("shangani") ||
        p.nameEn.toLowerCase().includes("papakang") ||
        p.nameEn.toLowerCase().includes("coco 40") ||
        p.nameEn.toLowerCase().includes("blue indigo") ||
        p.nameEn.toLowerCase().includes("summer 47") ||
        p.nameEn.toLowerCase().includes("senna 47") ||
        p.nameEn.toLowerCase().includes("real 2") ||
        p.nameEn.toLowerCase().includes("shashani") ||
        p.nameEn.toLowerCase().includes("sunwind") ||
        p.nameEn.toLowerCase().includes("ooseven") ||
        p.nameEn.toLowerCase().includes("estrella") ||
        p.nameEn.toLowerCase().includes("fortuna") ||
        p.nameEn.toLowerCase().includes("mario") ||
        p.nameEn.toLowerCase().includes("bellina") ||
        p.nameEn.toLowerCase().includes("wildcat") ||
        p.nameEn.toLowerCase().includes("amandla") ||
        p.nameEn.toLowerCase().includes("ocean dream")
      );
    }
    return true;
  });

  return (
    <div style={{ paddingTop: 80 }}>
      <div className="section" style={{ paddingBottom: 0 }}>
        <div className="section-header">
          <div className="section-label">Resource Library</div>
          <h2 className="section-title">产品资源库</h2>
        </div>
        <div className="search-bar">
          <span>🔍</span>
          <input placeholder="搜索产品名称、分类、关键词…" value={searchQ} onChange={e => setSearchQ(e.target.value)} />
          {searchQ && <span style={{ cursor: "pointer", color: "var(--fog)" }} onClick={() => setSearchQ("")}>✕</span>}
        </div>
        <div className="filter-tabs">
          <button className={`filter-tab${selectedCat === "all" ? " active" : ""}`} onClick={() => { setSelectedCat("all"); setYachtSub("all"); }}>全部</button>
          {categories.map(c => (
            <button key={c.id} className={`filter-tab${selectedCat === c.id ? " active" : ""}`} onClick={() => { setSelectedCat(c.id); setYachtSub("all"); }}>
              {c.icon} {c.name}
            </button>
          ))}
        </div>
        {selectedCat === "yacht" && (
          <div className="filter-tabs" style={{ marginTop: -8 }}>
            <button className={`filter-tab${yachtSub === "all" ? " active" : ""}`} onClick={() => setYachtSub("all")}>
              全部游艇
            </button>
            <button className={`filter-tab${yachtSub === "motor" ? " active" : ""}`} onClick={() => setYachtSub("motor")}
              style={{ background: yachtSub === "motor" ? "rgba(201,169,110,0.2)" : "", borderColor: yachtSub === "motor" ? "var(--gold)" : "", color: yachtSub === "motor" ? "var(--gold)" : "" }}>
              🚢 豪华游艇
            </button>
            <button className={`filter-tab${yachtSub === "sailing" ? " active" : ""}`} onClick={() => setYachtSub("sailing")}
              style={{ background: yachtSub === "sailing" ? "rgba(201,169,110,0.2)" : "", borderColor: yachtSub === "sailing" ? "var(--gold)" : "", color: yachtSub === "sailing" ? "var(--gold)" : "" }}>
              ⛵ 豪华帆船
            </button>
          </div>
        )}
      </div>
      <div className="section" style={{ paddingTop: 16 }}>
        {filteredByYachtSub.length === 0
          ? <div className="empty-state"><div style={{ fontSize: 48 }}>🔍</div><div style={{ marginTop: 16 }}>未找到相关产品</div></div>
          : <div className="product-grid">{filteredByYachtSub.map(p => <ProductCard key={p.id} product={p} categories={categories} role={role} statusBadge={statusBadge} onClick={() => setSelectedProduct(p)} />)}</div>
        }
      </div>
    </div>
  );
}

function ProductCard({ product: p, categories, role, statusBadge, onClick }) {
  const hasAgentPrice = Number.isFinite(p.agent);
  const hasCost = Number.isFinite(p.cost);
  const profit = hasAgentPrice ? p.retail - p.agent : 0;
  const coverImg = p.images && p.images.length > 0 ? p.images[0] : null;
  return (
    <div className="product-card" onClick={onClick}>
      <div className="product-img">
        {coverImg
          ? <img src={coverImg} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }} />
          : <span style={{ fontSize: 80, opacity: 0.3 }}>{p.emoji}</span>
        }
        <div className="product-img-overlay" />
        <div className="product-badges">
          {statusBadge(p.status)}
          <span className="badge badge-cat">{categories.find(c => c.id === p.cat)?.name || "未分类"}</span>
        </div>
      </div>
      <div className="product-body">
        <div className="product-name">{p.name}</div>
        <div className="product-name-en">{p.nameEn}</div>
        <div className="product-desc">{p.desc}</div>
        <div className="product-price-row">
          <div>
            <div className="price-from">Market Price</div>
            <div className="price-val">{p.retail.toLocaleString()} <span className="price-unit">THB</span></div>
          </div>
          <span style={{ fontSize: 20, color: "var(--fog)" }}>›</span>
        </div>
        {(role === "agent" || role === "admin") && hasAgentPrice && (
          <div className="price-agent-row">
            <div className="price-agent-item">
              <div className="price-agent-label">市场价</div>
              <div className="price-agent-value price-market">{p.retail.toLocaleString()}</div>
            </div>
            <div className="price-agent-item">
              <div className="price-agent-label">代理价</div>
              <div className="price-agent-value price-agent">{p.agent.toLocaleString()}</div>
            </div>
            <div className="price-agent-item">
              <div className="price-agent-label">利润空间</div>
              <div className="price-agent-value price-profit">+{profit.toLocaleString()}</div>
            </div>
          </div>
        )}
        {role === "admin" && hasCost && (
          <div className="internal-panel">
            <div className="internal-label">内部数据</div>
            <div className="internal-grid">
              <div className="internal-row"><span className="internal-key">成本价</span><span className="internal-val" style={{ color: "var(--danger)" }}>{p.cost.toLocaleString()} THB</span></div>
              <div className="internal-row"><span className="internal-key">净利润</span><span className="internal-val" style={{ color: "var(--success)" }}>{(p.retail - p.cost).toLocaleString()} THB</span></div>
            </div>
            <div className="supplier-tag">✓ 最低供应: {Math.min(...p.suppliers.map(s => s.price)).toLocaleString()} THB</div>
          </div>
        )}
      </div>
    </div>
  );
}
function JoinPage({ navigate }) {
  return (
    <div style={{ paddingTop: 56, background: "#080c0f", minHeight: "100vh", color: "#f0ebe2", fontFamily: "Georgia, serif" }}>
      <div style={{ padding: "80px 40px 60px", borderBottom: "1px solid rgba(201,169,110,0.1)" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.5em", color: "#c9a96e", textTransform: "uppercase", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 1, background: "#c9a96e" }} />Join Us · 加入隐海
        </div>
        <div style={{ fontSize: 42, fontWeight: 300, color: "#f0ebe2", lineHeight: 1.1, fontStyle: "italic", marginBottom: 8 }}>Build Something Exceptional.</div>
        <div style={{ fontSize: 15, color: "rgba(240,235,226,0.35)", letterSpacing: "0.3em" }}>共同创造，非凡旅程</div>
      </div>
      <div style={{ padding: "56px 40px", borderBottom: "1px solid rgba(201,169,110,0.1)" }}>
        <div style={{ fontSize: 9, letterSpacing: "0.5em", color: "#c9a96e", textTransform: "uppercase", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 24, height: 1, background: "#c9a96e" }} />我们在寻找
        </div>
        <div style={{ fontSize: 22, fontWeight: 300, color: "#f0ebe2", marginBottom: 16 }}>不只是人才，更是同行者</div>
        <div style={{ fontSize: 13, color: "rgba(240,235,226,0.4)", lineHeight: 2.2, maxWidth: 620 }}>我们寻找的不只是优秀的人才，更是拥有相同价值观的同行者。无论您来自旅行行业、酒店服务、市场运营、内容创作、摄影摄像、客户服务，还是拥有独特的专业能力，只要热爱品质、重视细节，并愿意不断突破，我们都期待与您相遇。</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 24 }}>
          {["旅行行业","酒店服务","市场运营","内容创作","摄影摄像","客户服务","独特专业能力"].map(t => (
            <div key={t} style={{ padding: "8px 18px", border: "1px solid rgba(201,169,110,0.2)", color: "rgba(240,235,226,0.45)", fontSize: 11, letterSpacing: "0.1em" }}>{t}</div>
          ))}
        </div>
      </div>
      <div style={{ padding: "56px 40px", borderBottom: "1px solid rgba(201,169,110,0.1)" }}>
        <div style={{ fontSize: 9, letterSpacing: "0.5em", color: "#c9a96e", textTransform: "uppercase", marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 24, height: 1, background: "#c9a96e" }} />我们提供
        </div>
        <div style={{ fontSize: 22, fontWeight: 300, color: "#f0ebe2", marginBottom: 16 }}>卓越的团队，创造卓越的体验</div>
        <div style={{ fontSize: 13, color: "rgba(240,235,226,0.4)", lineHeight: 2.2, maxWidth: 620, marginBottom: 32 }}>在隐海，我们相信，卓越的团队才能创造卓越的体验。这里拥有开放的成长空间、国际化的合作视野、持续学习的机会，以及与优秀伙伴共同打造高端旅行品牌的平台。我们鼓励创造、尊重专业，也相信每一份努力，都值得被看见。</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "rgba(201,169,110,0.08)" }}>
          {[
            { icon: "🌱", title: "开放的成长空间", desc: "鼓励创造、尊重专业，相信每一份努力都值得被看见。" },
            { icon: "🌍", title: "国际化合作视野", desc: "与来自不同背景的优秀伙伴共事，拓宽视野，共同成长。" },
            { icon: "📚", title: "持续学习的机会", desc: "在高端旅行品牌的平台上，持续提升专业能力与行业洞察。" },
          ].map((c, i) => (
            <div key={i} style={{ background: "#080c0f", padding: "28px 24px" }}>
              <div style={{ fontSize: 22, marginBottom: 14 }}>{c.icon}</div>
              <div style={{ fontSize: 13, color: "#f0ebe2", marginBottom: 8 }}>{c.title}</div>
              <div style={{ fontSize: 11, color: "rgba(240,235,226,0.3)", lineHeight: 1.9 }}>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: "56px 40px", textAlign: "center" }}>
        <div style={{ fontSize: 20, fontWeight: 300, color: "#f0ebe2", marginBottom: 12 }}>期待与您相遇</div>
        <div style={{ fontSize: 12, color: "rgba(240,235,226,0.3)", lineHeight: 2, maxWidth: 500, margin: "0 auto 32px" }}>如果您希望与隐海共同成长，欢迎通过官方微信 / WhatsApp / Telegram / Line 提交您的个人简介与作品，我们期待认识每一位优秀的同行者。</div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          {["微信联系","WhatsApp","Telegram","Line"].map((b, i) => (
            <div key={b} style={{ padding: "12px 28px", background: i===0 ? "#c9a96e" : "transparent", color: i===0 ? "#080c0f" : "#c9a96e", border: "1px solid rgba(201,169,110,0.3)", fontSize: 10, letterSpacing: "0.25em", textTransform: "uppercase", cursor: "pointer" }}>{b}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
function PartnerPage({ navigate }) {
  const partners = [
    { icon: "✈️", title: "旅行顾问", desc: "拥有优质客源的独立顾问或旅行社，希望为客户提供更丰富的普吉岛高端体验。" },
    { icon: "⛵", title: "游艇 · 别墅", desc: "拥有优质资源的供应商，希望接触更多高净值客户，实现更高效的资源变现。" },
    { icon: "📱", title: "内容创作者", desc: "在小红书、抖音、微博等平台拥有受众的创作者，与我们共同传递普吉岛的奢华生活方式。" },
    { icon: "🏨", title: "酒店 · 品牌机构", desc: "希望为高端客群提供更完整度假体验的酒店及品牌，与隐海联合打造专属定制方案。" },
    { icon: "💼", title: "企业 · 团建", desc: "需要为团队或客户策划高端普吉岛团建、会议及企业招待活动的机构。" },
    { icon: "✨", title: "其他同行者", desc: "只要认同品质、诚信与共赢的理念，我们愿意倾听任何有意义的合作提案。" },
  ];
  return (
    <div style={{ paddingTop: 56, background: "#080c0f", minHeight: "100vh", color: "#f0ebe2", fontFamily: "Georgia, serif" }}>
      <div style={{ padding: "80px 40px 60px", borderBottom: "1px solid rgba(201,169,110,0.1)" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.5em", color: "#c9a96e", textTransform: "uppercase", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 1, background: "#c9a96e" }} />
          Partnership · 合作计划
        </div>
        <div style={{ fontSize: 42, fontWeight: 300, color: "#f0ebe2", lineHeight: 1.1, fontStyle: "italic", marginBottom: 8 }}>Partnership Beyond Business.</div>
        <div style={{ fontSize: 15, fontWeight: 300, color: "rgba(240,235,226,0.35)", letterSpacing: "0.3em", marginBottom: 28 }}>合作，不止于商业</div>
        <div style={{ fontSize: 14, color: "rgba(240,235,226,0.45)", lineHeight: 2.2, maxWidth: 600, letterSpacing: "0.05em" }}>我们寻找的不只是合作伙伴，更是拥有相同服务理念与品质追求的同行者。无论您是旅行顾问、酒店、游艇、别墅、品牌机构，还是内容创作者，只要认同长期合作、诚信共赢与卓越服务，我们都期待与您携手，为客户带来超越期待的旅行体验。</div>
      </div>
      <div style={{ padding: "56px 40px", borderBottom: "1px solid rgba(201,169,110,0.1)" }}>
        <div style={{ fontSize: 9, letterSpacing: "0.5em", color: "#c9a96e", textTransform: "uppercase", marginBottom: 32, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 24, height: 1, background: "#c9a96e" }} />我们期待的伙伴
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 1, background: "rgba(201,169,110,0.08)" }}>
          {partners.map((p, i) => (
            <div key={i} style={{ background: "#080c0f", padding: "28px 24px" }}>
              <div style={{ fontSize: 24, marginBottom: 14 }}>{p.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 300, color: "#f0ebe2", letterSpacing: "0.08em", marginBottom: 8 }}>{p.title}</div>
              <div style={{ fontSize: 11, color: "rgba(240,235,226,0.3)", lineHeight: 1.9 }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: "56px 40px", borderBottom: "1px solid rgba(201,169,110,0.1)", textAlign: "center" }}>
        <div style={{ width: 40, height: 1, background: "rgba(201,169,110,0.3)", margin: "0 auto 28px" }} />
        <div style={{ fontSize: 20, fontWeight: 300, color: "rgba(240,235,226,0.7)", fontStyle: "italic", lineHeight: 1.8, letterSpacing: "0.05em", marginBottom: 28 }}>
          "真正的合作，<span style={{ color: "#c9a96e" }}>始于信任</span>，成于价值，<span style={{ color: "#c9a96e" }}>共赢于未来</span>。"
        </div>
        <div style={{ width: 40, height: 1, background: "rgba(201,169,110,0.3)", margin: "0 auto" }} />
      </div>
      <div style={{ padding: "56px 40px", textAlign: "center" }}>
        <div style={{ fontSize: 20, fontWeight: 300, color: "#f0ebe2", letterSpacing: "0.1em", marginBottom: 8 }}>期待与您携手</div>
        <div style={{ fontSize: 11, color: "rgba(240,235,226,0.25)", letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 32 }}>Let's Build Something Extraordinary Together</div>
        <div style={{ display: "inline-block", padding: "14px 40px", background: "#c9a96e", color: "#080c0f", fontSize: 11, fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", cursor: "pointer" }}>联系我们</div>
      </div>
    </div>
  );
}
function AboutPage({ navigate }) {
  return (
    <div style={{ paddingTop: 56, background: "#080c0f", minHeight: "100vh", color: "#f0ebe2", fontFamily: "Georgia, serif" }}>
      <div style={{ padding: "80px 40px 60px", borderBottom: "1px solid rgba(201,169,110,0.1)" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.5em", color: "#c9a96e", textTransform: "uppercase", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 32, height: 1, background: "#c9a96e" }} />
          About Us · 关于我们
        </div>
        <div style={{ fontSize: 48, fontWeight: 300, color: "#f0ebe2", lineHeight: 1.1, fontStyle: "italic", marginBottom: 8 }}>Yin Sea · Phuket</div>
        <div style={{ fontSize: 16, fontWeight: 300, color: "rgba(240,235,226,0.35)", letterSpacing: "0.3em", marginBottom: 28 }}>隐于海之深处，寻得奢华本真</div>
        <div style={{ fontSize: 14, color: "rgba(240,235,226,0.45)", lineHeight: 2, maxWidth: 520, letterSpacing: "0.05em" }}>隐海是一个专为高净值旅行者打造的普吉岛高端定制平台。我们甄选最稀缺的私密体验，从顶级游艇到私人别墅，从定制行程到专属服务，每一刻都是你的专属奢华。</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderTop: "1px solid rgba(201,169,110,0.1)" }}>
        {[
          { num: "01", en: "Brand Philosophy", cn: "品牌理念", desc: "Less Ordinary. More Extraordinary.\n少一些平凡，多一些非凡。" },
          { num: "02", en: "Core Advantage", cn: "核心优势", desc: "Beyond Expectations. Beyond Imagination.\n你所期待的，我们已经准备好；你未曾想到的，我们也愿意为你实现。" },
          { num: "03", en: "Service Promise", cn: "服务承诺", desc: "Above Standards. Beyond Service.\n每一份托付，皆以最高标准回应。" },
          { num: "04", en: "Our Team", cn: "团队介绍", desc: "Beyond Local. Beyond Ordinary.\n不止于本地，更不止于寻常。" },
        ].map((item, i) => (
          <div key={i} style={{ padding: 40, borderRight: i % 2 === 0 ? "1px solid rgba(201,169,110,0.1)" : "none", borderBottom: "1px solid rgba(201,169,110,0.1)" }}>
            <div style={{ fontSize: 48, fontWeight: 200, color: "rgba(201,169,110,0.12)", lineHeight: 1, marginBottom: 16 }}>{item.num}</div>
            <div style={{ fontSize: 10, color: "#c9a96e", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 8 }}>{item.en}</div>
            <div style={{ fontSize: 18, fontWeight: 300, color: "#f0ebe2", letterSpacing: "0.1em", marginBottom: 10 }}>{item.cn}</div>
            <div style={{ fontSize: 12, color: "rgba(240,235,226,0.35)", lineHeight: 2, letterSpacing: "0.05em", whiteSpace: "pre-line" }}>{item.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: "60px 40px", textAlign: "center", borderTop: "1px solid rgba(201,169,110,0.1)" }}>
        <div style={{ fontSize: 22, fontWeight: 300, color: "#f0ebe2", letterSpacing: "0.1em", marginBottom: 8 }}>开启你的专属旅程</div>
        <div style={{ fontSize: 11, color: "rgba(240,235,226,0.25)", letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 32 }}>Begin Your Extraordinary Journey</div>
        <div style={{ display: "inline-block", padding: "14px 40px", background: "#c9a96e", color: "#080c0f", fontSize: 11, fontWeight: 500, letterSpacing: "0.3em", textTransform: "uppercase", cursor: "pointer" }}>联系我们</div>
      </div>
    </div>
  );
}
function DetailPage({ product: p, role, back, statusBadge }) {
  const [openFaq, setOpenFaq] = useState(null);
  const [currentImg, setCurrentImg] = useState(0);
  const bestSupplier = p.suppliers?.reduce((a, b) => a.price < b.price ? a : b);
  const images = p.images || [];

  return (
    <div className="detail-page">
      <button className="back-btn" onClick={back}>← 返回产品库</button>

      {images.length > 0 ? (
        <div style={{ position: "relative", background: "#000" }}>
          <img
            src={images[currentImg]}
            alt={p.name}
            style={{ width: "100%", height: "70vw", maxHeight: 420, objectFit: "cover", display: "block", opacity: 0.95 }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(10,12,15,0.8))" }} />
          <div style={{ position: "absolute", top: 12, left: 12 }}>{statusBadge(p.status)}</div>
          <div style={{ position: "absolute", bottom: 12, right: 12, background: "rgba(0,0,0,0.5)", color: "var(--gold)", fontSize: 11, padding: "4px 10px", borderRadius: 20, letterSpacing: "0.1em" }}>
            {currentImg + 1} / {images.length}
          </div>
          {currentImg > 0 && (
            <button onClick={() => setCurrentImg(currentImg - 1)} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", width: 36, height: 36, borderRadius: "50%", fontSize: 18, cursor: "pointer" }}>‹</button>
          )}
          {currentImg < images.length - 1 && (
            <button onClick={() => setCurrentImg(currentImg + 1)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", width: 36, height: 36, borderRadius: "50%", fontSize: 18, cursor: "pointer" }}>›</button>
          )}
          <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "10px 16px", background: "var(--deep)", scrollbarWidth: "none" }}>
            {images.map((img, i) => (
              <img key={i} src={img} alt="" onClick={() => setCurrentImg(i)}
                style={{ width: 60, height: 45, objectFit: "cover", borderRadius: 4, cursor: "pointer", flexShrink: 0, border: i === currentImg ? "2px solid var(--gold)" : "2px solid transparent", opacity: i === currentImg ? 1 : 0.6, transition: "all 0.2s" }}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="detail-hero">
          <span style={{ fontSize: 120, opacity: 0.25 }}>{p.emoji}</span>
          <div className="detail-hero-overlay" />
          <div style={{ position: "absolute", top: 16, left: 16 }}>{statusBadge(p.status)}</div>
        </div>
      )}

      <div className="detail-content">
        <div className="detail-header">
          <div className="detail-name">{p.name}</div>
          <div className="detail-name-en">{p.nameEn}</div>
          <div className="detail-divider" />
          <p className="detail-text">{p.desc}</p>
        </div>
        <div className="price-box">
          <div className="price-box-title">参考价格 / Price Reference</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div style={{ fontSize: 11, color: "var(--fog)", marginBottom: 4 }}>市场价（THB）</div>
              <div className="price-main"><span className="price-currency">฿</span>{p.retail.toLocaleString()}</div>
            </div>
            {(role === "agent" || role === "admin") && Number.isFinite(p.agent) && (
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "var(--fog)", marginBottom: 4 }}>代理价</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--gold)" }}>฿{p.agent.toLocaleString()}</div>
                <div style={{ fontSize: 11, color: "var(--success)", marginTop: 2 }}>利润 +{(p.retail - p.agent).toLocaleString()}</div>
              </div>
            )}
          </div>
          {role === "admin" && Number.isFinite(p.cost) && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)", display: "flex", gap: 20, fontSize: 12 }}>
              <span>成本: <strong style={{ color: "var(--danger)" }}>฿{p.cost.toLocaleString()}</strong></span>
              <span>净利: <strong style={{ color: "var(--success)" }}>฿{(p.retail - p.cost).toLocaleString()}</strong></span>
            </div>
          )}
          <div className="contact-btns">
            <button className="contact-btn contact-wechat">💬 微信咨询预订</button>
            <button className="contact-btn contact-whatsapp">📱 WhatsApp</button>
          </div>
        </div>
        {p.itinerary && <div className="detail-section" style={{ marginTop: 24 }}>
          <div className="detail-section-title">行程安排</div>
          <p className="detail-text">{p.itinerary}</p>
        </div>}
        {p.includes?.length > 0 && <div className="detail-section">
          <div className="detail-section-title">包含内容</div>
          <ul className="include-list">{p.includes?.map((item, i) => <li key={i}>{item}</li>)}</ul>
        </div>}
        {p.excludes?.length > 0 && <div className="detail-section">
          <div className="detail-section-title">不含内容</div>
          <ul className="exclude-list">{p.excludes?.map((item, i) => <li key={i}>{item}</li>)}</ul>
        </div>}
        {p.faq?.length > 0 && <div className="detail-section">
          <div className="detail-section-title">常见问题</div>
          {p.faq?.map((f, i) => (
            <div key={i} className="faq-item">
              <div className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                {f.q} <span style={{ color: "var(--gold)", fontSize: 18 }}>{openFaq === i ? "−" : "+"}</span>
              </div>
              {openFaq === i && <div className="faq-a">{f.a}</div>}
            </div>
          ))}
        </div>}
        {role === "agent" && p.materials?.length > 0 && (
          <div className="detail-section">
            <div className="detail-section-title">推广素材</div>
            {p.materials?.map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: 13, color: "var(--mist)" }}>📄 {m}</span>
                <button style={{ fontSize: 11, color: "var(--gold)", background: "none", border: "1px solid rgba(201,169,110,0.3)", borderRadius: 20, padding: "4px 12px", cursor: "pointer", fontFamily: "var(--font-ui)" }}>下载</button>
              </div>
            ))}
          </div>
        )}
        {role === "admin" && (
          <>
            <div className="detail-section">
              <div className="detail-section-title">供应商价格对比</div>
              <div className="supplier-list">
                {p.suppliers?.map((s, i) => {
                  const isBest = s.price === bestSupplier?.price;
                  return (
                    <div key={i} className="supplier-row">
                      <span className="supplier-name">{s.name} {isBest && "⭐"}</span>
                      <span style={{ color: isBest ? "var(--success)" : "var(--pearl)" }}>฿{s.price.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="detail-section">
              <div className="detail-section-title">内部备注</div>
              <div className="tag-row">{p.notes?.map((n, i) => <span key={i} className="note-tag">💬 {n}</span>)}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Footer({ navigate }) {
  return (
    <footer className="footer">
      <div className="footer-brand">隐海</div>
      <div className="footer-tagline">Hidden Sea · Phuket Luxury Bespoke</div>
      <div className="footer-links">
        <div className="footer-links-group">
          <h4>产品</h4>
          {["游艇出海","奢华别墅","顶级SPA","直升机","隐海定制"].map(l=><a key={l} onClick={()=>navigate("products")}>{l}</a>)}
        </div>
        <div className="footer-links-group">
          <h4>关于我们</h4>
          {["品牌介绍","合作计划","联系我们","加入隐海"].map(l=><a key={l} onClick={l==="品牌介绍" ? ()=>navigate("about") : l==="合作计划" ? ()=>navigate("partner") : l==="加入隐海" ? ()=>navigate("join") : undefined} style={(l==="品牌介绍"||l==="合作计划"||l==="加入隐海") ? {cursor:"pointer"} : {}}>{l}</a>)}
        </div>
      </div>
      <div className="footer-bottom">© 2024 隐海 YINSEA PHUKET · All Rights Reserved</div>
    </footer>
  );
}
