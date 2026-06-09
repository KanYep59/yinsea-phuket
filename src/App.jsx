import { useState, useEffect, useRef } from "react";

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
  .badge-avail { background: rgba(76,175,125,0.2); border: 1px solid rgba(76,175,125,0.5); color: #4caf7d; }
  .badge-hot { background: rgba(232,168,56,0.2); border: 1px solid rgba(232,168,56,0.5); color: #e8a838; }
  .badge-full { background: rgba(224,85,85,0.2); border: 1px solid rgba(224,85,85,0.5); color: #e05555; }
  .badge-cat { background: rgba(201,169,110,0.1); border: 1px solid rgba(201,169,110,0.3); color: var(--gold); }
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
  .back-btn { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 300; color: var(--mist); cursor: pointer; padding: 8px 24px; background: none; border: none; transition: color 0.2s; }
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
  { id: "yacht", icon: "⛵", name: "游艇出海", en: "Yacht Charter", count: 12 },
  { id: "villa", icon: "🏛️", name: "奢华别墅", en: "Luxury Villa", count: 8 },
  { id: "car", icon: "🚘", name: "豪华包车", en: "Private Transfer", count: 6 },
  { id: "spa", icon: "💆", name: "顶级SPA", en: "Luxury Spa", count: 15 },
  { id: "photo", icon: "📸", name: "旅拍写真", en: "Travel Photo", count: 10 },
  { id: "heli", icon: "🚁", name: "直升机", en: "Helicopter", count: 3 },
  { id: "custom", icon: "✨", name: "高端定制", en: "Bespoke", count: 5 },
];

const PRODUCTS = [
  {
    id: 1, cat: "yacht", status: "hot",
    name: "黑珍珠号游艇", nameEn: "Black Pearl Yacht",
    emoji: "⛵", desc: "全球限量级奢华游艇，配备私人厨师与调酒师，环游皮皮岛绝美海域，尊享专属日落派对。",
    retail: 38000, agent: 32000, cost: 26000,
    includes: ["私人厨师", "调酒师服务", "浮潜装备", "水上摩托", "专属摄影", "全程接驳"],
    excludes: ["额外饮品", "岛屿上岸费", "小费"],
    suppliers: [{ name: "泰国海上蓝", price: 26000 }, { name: "卡塔海事", price: 27500 }, { name: "皮皮岛船社", price: 28000 }],
    notes: ["旺季涨价约15%", "中国客好评率98%", "需提前3天预订"],
    faq: [{ q: "几点出发?", a: "灵活安排，推荐10:00或14:00，可根据潮汐调整。" }, { q: "最多几人?", a: "最多承接20人，建议12人以内最佳体验。" }],
    itinerary: "09:30 豪华别墅/酒店接送 → 10:00 码头登船 → 11:00 珊瑚岛浮潜 → 13:00 船上精致午餐 → 15:00 皮皮岛观光 → 17:30 日落派对 → 19:00 返程",
    materials: ["游艇全套高清图30张", "小红书精修文案3版", "朋友圈文案", "抖音脚本"]
  },
  {
    id: 2, cat: "villa", status: "avail",
    name: "玛瑞娜海岸线庄园", nameEn: "Marina Coast Estate",
    emoji: "🏛️",
images: [
  "https://i.ibb.co/5Wz2VrfD/photo-2026-06-08-02-50-40.jpg",
  "https://i.ibb.co/S45B3P9m/photo-2026-06-08-02-50-44.jpg",
  "https://i.ibb.co/F4Z7L441/photo-2026-06-08-02-50-48.jpg",
  "https://i.ibb.co/rrH6QJY/photo-2026-06-08-02-50-52.jpg",
  "https://i.ibb.co/7xzjbJLD/photo-2026-06-08-02-50-55.jpg",
  "https://i.ibb.co/1fbHjbxF/photo-2026-06-08-02-50-57.jpg",
  "https://i.ibb.co/SDCSvxxf/photo-2026-06-08-02-51-00.jpg",
  "https://i.ibb.co/jP8TRN1x/photo-2026-06-08-02-51-03.jpg",
  "https://i.ibb.co/rKFtHSmz/photo-2026-06-08-02-51-05.jpg",
  "https://i.ibb.co/20hSt0WQ/photo-2026-06-08-02-51-07.jpg",
  "https://i.ibb.co/ZRb6p2MW/photo-2026-06-08-02-51-10.jpg",
  "https://i.ibb.co/yFKvWjPy/photo-2026-06-08-02-51-12.jpg",
  "https://i.ibb.co/wh9X1zTD/photo-2026-06-08-02-51-15.jpg",
  "https://i.ibb.co/TBk8FH1m/photo-2026-06-08-02-51-18.jpg",
  "https://i.ibb.co/XxZ6JkXc/photo-2026-06-08-02-51-21.jpg",
  "https://i.ibb.co/S4Km4V0y/photo-2026-06-08-02-51-24.jpg",
  "https://i.ibb.co/VWN482yH/photo-2026-06-08-02-51-26.jpg",
  "https://i.ibb.co/zH5gKs7L/photo-2026-06-08-02-51-29.jpg",
  "https://i.ibb.co/JRm88Vzk/photo-2026-06-08-02-51-31.jpg",
  "https://i.ibb.co/tMbk6H5z/photo-2026-06-08-02-51-34.jpg",
  "https://i.ibb.co/GQwDD6Nm/photo-2026-06-08-02-51-36.jpg",
  "https://i.ibb.co/sJb0Cvzw/photo-2026-06-08-02-51-38.jpg",
  "https://i.ibb.co/dw1W4wS3/photo-2026-06-08-02-51-40.jpg",
  "https://i.ibb.co/nNJrrPtQ/photo-2026-06-08-02-51-42.jpg",
  "https://i.ibb.co/Z6Ytr4NV/photo-2026-06-08-02-51-44.jpg",
  "https://i.ibb.co/4Znf103N/photo-2026-06-08-02-51-47.jpg",
  "https://i.ibb.co/1Y9cpKCk/photo-2026-06-08-02-51-49.jpg",
  "https://i.ibb.co/jvCrpxbw/photo-2026-06-08-02-51-51.jpg",
],
    desc: "坐落于宁静的Cape Yamu半岛，占地4700㎡，俯瞰安达曼海与攀牙湾全景。6卧室可住12人，柚木与意大利进口家私，现代泰式融合欧式风情，各大明星网红同款别墅。",
    retail: 60000, agent: 51000, cost: 44000,
    includes: [
      "中英泰三语管家24H",
      "两位全职女佣（24H）",
      "每日精美早餐（中西泰式）",
      "机场接送（免费）",
      "5×20米私人无边泳池",
      "私人沙滩",
      "影音室（Netflix/YouTube）",
      "智能音箱系统",
      "自动麻将",
      "免费制定普吉岛旅行攻略",
      "高速无线网络",
      "优质床上用品及无限清洁用水"
    ],
    excludes: [
      "电费（7泰铢/度，实拍电表结算）",
      "漂浮早餐/下午茶（3,000 THB/次）",
      "私厨服务（4,000 THB/次，需提前1天预约）",
      "别墅包车、出海游玩（付费）",
      "加气垫床（1,500 THB/位/天）",
      "超额入住（超12人，500 THB/位/天）",
      "入住押金（20,000 THB，退房退还）"
    ],
    suppliers: [
      { name: "JH", price: 9500 },
      { name: "VIKCY", price: 9000 }
    ],
    notes: [
      "VIKCY为最低成本渠道",
      "押金2万泰铢，退房退还",
      "电费另计，入退房实拍电表",
      "室内禁烟（罚5000THB）禁榴莲（罚2000THB）",
      "各大明星网红同款，小红书爆款潜力高"
    ],
    faq: [
      { q: "入住和退房时间？", a: "12:00前退房，15:00后入住。如需提前入住或延迟退房请提前与管家沟通。" },
      { q: "最多住几人？", a: "标准入住12人，超出按500 THB/位/天收费，可加气垫床1500 THB/位/天。" },
      { q: "有没有厨师服务？", a: "有私厨服务，中餐/海鲜/烧烤/火锅均可，服务费4000 THB/次，需提前一天预约。" },
      { q: "离市区多远？", a: "距网红COMO度假村500米，ATV探险公园5分钟车程，7-11便利店600米。" },
      { q: "漂浮早餐怎么预约？", a: "提前告知管家即可安排，费用3000 THB/次。" }
    ],
    itinerary: "管家机场迎接（免费接送） → 别墅办理入住 → 欢迎下午茶 → 自由享用私人泳池与沙滩 → 日落时分安达曼海全景 → 可选私厨晚宴或出海行程",
    materials: [
      "别墅高清实拍图30张",
      "无人机航拍视频",
      "小红书爆款文案（明星同款版）",
      "朋友圈推广文案",
      "抖音短视频脚本"
    ]
  },
  {
    id: 10, cat: "villa", status: "avail",
    name: "科西里蓝色海景别墅", nameEn: "Blue Villa Ko Sirey",
    emoji: "🏛️",
    images: [
      "https://i.ibb.co/kVR9JtdX/photo-2026-06-09-02-19-05.jpg",
      "https://i.ibb.co/ksc0QkVh/photo-2026-06-09-02-19-03.jpg",
      "https://i.ibb.co/JwJtMDbT/photo-2026-06-09-02-19-06-2.jpg",
      "https://i.ibb.co/Tqw6wbcH/photo-2026-06-09-02-19-06.jpg",
      "https://i.ibb.co/dsxqNrjb/photo-2026-06-09-02-19-07.jpg",
      "https://i.ibb.co/qLqhVXDR/photo-2026-06-09-02-19-08-2.jpg",
      "https://i.ibb.co/rRWvS9pd/photo-2026-06-09-02-19-08.jpg",
      "https://i.ibb.co/WW7TLW0b/photo-2026-06-09-02-19-09.jpg",
      "https://i.ibb.co/PzcJqdFN/photo-2026-06-09-02-19-10.jpg",
      "https://i.ibb.co/5xShwsrQ/photo-2026-06-09-02-19-11-2.jpg",
      "https://i.ibb.co/rRTqKKm5/photo-2026-06-09-02-19-11.jpg",
      "https://i.ibb.co/zWwTmvcR/photo-2026-06-09-02-19-12.jpg",
      "https://i.ibb.co/1J2pScwx/photo-2026-06-09-02-19-13.jpg",
      "https://i.ibb.co/pvQqDNC5/photo-2026-06-09-02-19-14-2.jpg",
      "https://i.ibb.co/TDQrpfYT/photo-2026-06-09-02-19-14.jpg",
      "https://i.ibb.co/8LpqrLq1/photo-2026-06-09-02-19-15.jpg",
      "https://i.ibb.co/bgfW0TzP/photo-2026-06-09-02-19-16-2.jpg",
      "https://i.ibb.co/FkcCwvNb/photo-2026-06-09-02-19-16.jpg",
      "https://i.ibb.co/6RvKsRTp/photo-2026-06-09-02-19-17.jpg",
      "https://i.ibb.co/ZR9tRk5J/photo-2026-06-09-02-19-18.jpg",
      "https://i.ibb.co/4ndk5vfF/photo-2026-06-09-02-19-19-2.jpg",
      "https://i.ibb.co/Hpg1KPBN/photo-2026-06-09-02-19-19.jpg",
      "https://i.ibb.co/k23zG3qB/photo-2026-06-09-02-19-20.jpg",
    ],
    desc: "Ko Sirey海滩超一线180度无敌海景，6卧室全海景房可住12人，130㎡挑高客厅，无边泳池伴日出日落。同区四套别墅共20卧室，可接大型团建。",
    retail: 22000, agent: 20000, cost: 17000,
    includes: [
      "中文管家服务",
      "私人旅游行程定制",
      "无边泳池",
      "麻将机、厨具、洗衣机等设备齐全",
      "私人停车位",
      "免费用水",
    ],
    excludes: [
      "电费（7泰铢/度，实拍电表结算）",
      "押金（20,000 THB，退房退还）",
      "私厨上门服务（需另付费）",
      "包车/包船（需另付费）",
    ],
    suppliers: [
      { name: "VIKCY", price: 17000 },
    ],
    notes: [
      "同区四套别墅可打通，共20卧室，适合超大团建",
      "Ko Sirey位置较偏，芭东30分钟，适合追求私密的客户",
      "利润空间较好（代理20000 vs 成本17000）",
      "室内禁烟禁榴莲禁宠物，违者罚款5000THB",
      "钥匙丢失赔偿3500THB，需护照登记",
    ],
    faq: [
      { q: "入住退房时间？", a: "15:00后入住，12:00前退房，押金20000泰铢入住时支付。" },
      { q: "最多住几人？", a: "6卧室最多住12人，同区四套别墅可合并使用，最多80人团建。" },
      { q: "距离芭东多远？", a: "芭东酒吧街30分钟，查龙码头25分钟，普吉镇夜市10分钟。" },
      { q: "可以办大型团建吗？", a: "可以！同区四套别墅共20卧室，是大型团建、企业活动的绝佳选择，请提前联系。" },
      { q: "电费怎么计算？", a: "7泰铢/度，入退房实拍电表，按实际用量结算，请节约用电。" },
    ],
    itinerary: "管家迎接入住 → 欣赏Ko Sirey海滩日出 → 无边泳池休闲 → 180度海景日落 → 可选私厨或包车夜市",
    materials: [
      "别墅高清实拍图23张",
      "小红书推广文案（日出日落版）",
      "朋友圈推广文案",
      "大型团建专属方案",
      "抖音短视频脚本",
    ],
  },
  {
    id: 9, cat: "villa", status: "avail",
    name: "芭东蔚蓝海浪别墅", nameEn: "Azure Wave Patong Beach Villa",
    emoji: "🏛️",
    images: [
      "https://i.ibb.co/cXhLBR2f/photo-2026-06-09-00-22-42.jpg",
      "https://i.ibb.co/LXKDd40n/photo-2026-06-09-00-22-44.jpg",
      "https://i.ibb.co/CsXsRTTv/photo-2026-06-09-00-22-45-2.jpg",
      "https://i.ibb.co/kLRpwSr/photo-2026-06-09-00-22-45.jpg",
      "https://i.ibb.co/MxwrMhYr/photo-2026-06-09-00-22-46.jpg",
      "https://i.ibb.co/wNj8d9NH/photo-2026-06-09-00-22-47.jpg",
      "https://i.ibb.co/VpHpGsH2/photo-2026-06-09-00-22-48.jpg",
      "https://i.ibb.co/7dsN903x/photo-2026-06-09-00-22-49.jpg",
      "https://i.ibb.co/YTdTpWtM/photo-2026-06-09-00-22-50.jpg",
      "https://i.ibb.co/dJ29NN9V/photo-2026-06-09-00-22-51-2.jpg",
      "https://i.ibb.co/mr3pDNS2/photo-2026-06-09-00-22-51.jpg",
      "https://i.ibb.co/v4MTvRcp/photo-2026-06-09-00-22-52.jpg",
      "https://i.ibb.co/237FDp9m/photo-2026-06-09-00-22-53.jpg",
      "https://i.ibb.co/4ZzLBJBh/photo-2026-06-09-00-22-54.jpg",
      "https://i.ibb.co/YFKgtKY7/photo-2026-06-09-00-22-55-2.jpg",
      "https://i.ibb.co/cK5mm8fR/photo-2026-06-09-00-22-55.jpg",
      "https://i.ibb.co/FqnxCHrH/photo-2026-06-09-00-22-56.jpg",
      "https://i.ibb.co/F4Nnxyhp/photo-2026-06-09-00-22-57.jpg",
      "https://i.ibb.co/8DzghhWq/photo-2026-06-09-00-22-58.jpg",
      "https://i.ibb.co/0VV0xgdq/photo-2026-06-09-00-22-59-2.jpg",
      "https://i.ibb.co/HfCXnFVp/photo-2026-06-09-00-22-59.jpg",
      "https://i.ibb.co/rRpBg60t/photo-2026-06-09-00-23-00.jpg",
      "https://i.ibb.co/cX8JpPDy/photo-2026-06-09-00-23-01.jpg",
      "https://i.ibb.co/6RD2mwh0/photo-2026-06-09-00-23-02.jpg",
      "https://i.ibb.co/jP54DhPQ/photo-2026-06-09-00-23-03-2.jpg",
      "https://i.ibb.co/WNHVskC5/photo-2026-06-09-00-23-03.jpg",
      "https://i.ibb.co/tpQ1jY6J/photo-2026-06-09-00-23-04.jpg",
      "https://i.ibb.co/1J8yRWJP/photo-2026-06-09-00-23-06.jpg",
    ],
    desc: "芭东核心山海景观带，步行抵达芭东海滩，5分钟直达Bangla酒吧街。6卧7床可住14人，无边泳池与安达曼海天一线，日落随手一拍皆是电影画面。",
    retail: 33000, agent: 31500, cost: 30000,
    includes: [
      "免费早餐（中式/美式/泰式三选一）",
      "2名全职女佣每日清洁",
      "中英泰文管家全程服务",
      "免费接机（住3晚以上）",
      "无边泳池、健身房、台球室",
      "自动麻将机、PS5、蓝牙音响",
      "婴儿床及婴儿餐椅",
      "欢迎果盘及饮料",
      "免费Wi-Fi（75Mbps）",
      "私人草坪（可承接婚礼）",
    ],
    excludes: [
      "电费（8泰铢/度，或包电费+2,500 THB/晚）",
      "私厨服务（3,000 THB/次，食材另计）",
      "漂浮早餐/下午茶（3,000 THB/次）",
    ],
    suppliers: [
      { name: "黄金右脚", price: 30000 },
    ],
    notes: [
      "芭东核心位置，步行海滩，5分钟酒吧街，地理位置是最大卖点",
      "利润空间小（代理31500 vs 成本30000），注意定价",
      "适合朋友聚会、生日派对、家庭度假、企业团建",
      "可承接婚礼，有私人草坪",
      "6卧14人是同价位别墅中容量最大的",
    ],
    faq: [
      { q: "距离海滩多远？", a: "步行即可抵达芭东海滩，5分钟到Bangla酒吧街，7-11便利店就在周边。" },
      { q: "最多住几人？", a: "6卧7床，最多住14人。" },
      { q: "有厨师服务吗？", a: "有，厨师服务费3000泰铢/次，可做中餐/泰餐/BBQ/火锅/海鲜/意大利餐，食材另计。" },
      { q: "电费怎么算？", a: "8泰铢/度单独结算，或选择包电费套餐每晚加2500泰铢。" },
      { q: "可以办婚礼吗？", a: "可以！有私人草坪，可承接婚礼及生日派对，请提前联系管家安排。" },
    ],
    itinerary: "管家迎接入住 → 欢迎果盘 → 步行探索芭东海滩 → 无边泳池日落时光 → 可选私厨晚宴或步行5分钟Bangla酒吧街",
    materials: [
      "别墅高清实拍图28张",
      "无人机航拍视频",
      "小红书推广文案（芭东核心位置版）",
      "朋友圈推广文案",
      "抖音短视频脚本",
    ],
  },
  {
    id: 8, cat: "villa", status: "avail",
    name: "雅木半岛Casa Skyline别墅", nameEn: "Casa Skyline Villas Cape Yamu",
    emoji: "🏛️",
    images: [
      "https://i.ibb.co/jxJYLn5/photo-2026-06-09-00-10-53.jpg",
      "https://i.ibb.co/XhKJdmN/photo-2026-06-09-00-10-56.jpg",
      "https://i.ibb.co/HTJvfnVm/photo-2026-06-09-00-10-59.jpg",
      "https://i.ibb.co/jPLtNQzF/photo-2026-06-09-00-11-01.jpg",
      "https://i.ibb.co/RTkrSKTv/photo-2026-06-09-00-11-03.jpg",
      "https://i.ibb.co/YFRJZjgQ/photo-2026-06-09-00-11-04.jpg",
      "https://i.ibb.co/pvpw50H1/photo-2026-06-09-00-11-05-2.jpg",
      "https://i.ibb.co/cXJ89559/photo-2026-06-09-00-11-05.jpg",
      "https://i.ibb.co/Hf01k647/photo-2026-06-09-00-11-06.jpg",
      "https://i.ibb.co/ns9PL0GF/photo-2026-06-09-00-11-07.jpg",
      "https://i.ibb.co/5X0KsSk6/photo-2026-06-09-00-11-08.jpg",
      "https://i.ibb.co/jZ3jH9rq/photo-2026-06-09-00-11-09.jpg",
      "https://i.ibb.co/fzWxLvsH/photo-2026-06-09-00-11-10-2.jpg",
      "https://i.ibb.co/Zz4bfttJ/photo-2026-06-09-00-11-10.jpg",
      "https://i.ibb.co/ymW4MMb4/photo-2026-06-09-00-11-11.jpg",
      "https://i.ibb.co/mrWv222R/photo-2026-06-09-00-11-12.jpg",
      "https://i.ibb.co/tpGdBjLc/photo-2026-06-09-00-11-13.jpg",
      "https://i.ibb.co/67YpmSxt/photo-2026-06-09-00-11-14-2.jpg",
      "https://i.ibb.co/vCN9MzYt/photo-2026-06-09-00-11-14.jpg",
      "https://i.ibb.co/JRx2JXKp/photo-2026-06-09-00-11-15.jpg",
      "https://i.ibb.co/SDymH1qB/photo-2026-06-09-00-11-16.jpg",
      "https://i.ibb.co/k6Kb3H9k/photo-2026-06-09-00-11-17.jpg",
      "https://i.ibb.co/15wSyDB/photo-2026-06-09-00-11-18-2.jpg",
      "https://i.ibb.co/ZtfxLmm/photo-2026-06-09-00-11-18.jpg",
      "https://i.ibb.co/SDNk3Ry3/photo-2026-06-09-00-11-19.jpg",
      "https://i.ibb.co/cXSdnMMr/photo-2026-06-09-00-11-20.jpg",
      "https://i.ibb.co/9mt1xjSd/photo-2026-06-09-00-11-21.jpg",
      "https://i.ibb.co/PzQVt97y/photo-2026-06-09-00-11-22-2.jpg",
      "https://i.ibb.co/358jfcqF/photo-2026-06-09-00-11-22.jpg",
      "https://i.ibb.co/twzNQt9C/photo-2026-06-09-00-11-23.jpg",
      "https://i.ibb.co/TD87ycXS/photo-2026-06-09-00-11-24.jpg",
      "https://i.ibb.co/7xqSBgLs/photo-2026-06-09-00-11-25.jpg",
      "https://i.ibb.co/Z6PtQR6C/photo-2026-06-09-00-11-26.jpg",
      "https://i.ibb.co/VYtfnxv5/photo-2026-06-09-00-11-27-2.jpg",
      "https://i.ibb.co/9khD1s19/photo-2026-06-09-00-11-27.jpg",
      "https://i.ibb.co/xqZTGM4c/photo-2026-06-09-00-11-28.jpg",
      "https://i.ibb.co/5XtWTNPD/photo-2026-06-09-00-11-29.jpg",
    ],
    desc: "雅木半岛Cape Yamu顶级私密豪宅区，2024全新装修，270度全海景，25米无边泳池，6卧室含私人影院、健身房、SPA区，中英泰管家24H服务，步行2分钟可出海。",
    retail: 33000, agent: 31500, cost: 30000,
    includes: [
      "中英泰三语管家24H在线",
      "两位全职女佣（7:00-18:00）每日清洁",
      "全职厨师（早餐免费，午晚餐150 THB/位）",
      "免费早餐（多国口味）",
      "欢迎水果及欢迎茶",
      "漂浮下午茶（住3晚以上免费1次）",
      "免费接送机（住3晚以上）",
      "25米无边淡水泳池（自动夜灯）",
      "私人影院、健身房、SPA理疗区、桌球室",
      "专职泳池管家及花园管家",
    ],
    excludes: [
      "电费（按实际用量，通常2,000~3,000 THB/天）",
      "押金（20,000 THB，退房退还，可抵电费及餐饮）",
      "午晚餐食材费用",
    ],
    suppliers: [
      { name: "黄金右脚", price: 30000 },
    ],
    notes: [
      "利润空间极小（代理31500 vs 成本30000），需谨慎定价",
      "Cape Yamu顶级私密地段，差异化卖点强",
      "2024全新装修，270度海景是核心卖点",
      "步行2分钟Yamu码头可出海去PP岛/皇帝岛/珊瑚岛",
      "适合高端客户，企业招待，摄影旅拍",
    ],
    faq: [
      { q: "入住退房时间？", a: "15:00后入住，12:00前退房。" },
      { q: "最多住几人？", a: "6卧室8床，最多住12人，可加床。" },
      { q: "电费怎么计算？", a: "按实际用量，每日通常2000~3000泰铢，入退房拍电表结算，押金可抵扣。" },
      { q: "漂浮下午茶怎么预约？", a: "提前告知管家，住3晚以上免费1次。" },
      { q: "附近可以出海吗？", a: "步行2分钟到Yamu码头，可出海去PP岛、皇帝岛、珊瑚岛，海钓、潜水均可安排。" },
    ],
    itinerary: "管家机场迎接（住3晚以上免费）→ 欢迎水果茶 → 自由享用25米无边泳池 → 270度日落全景 → 可选私厨晚宴或BBQ → Yamu码头出海",
    materials: [
      "别墅高清实拍图37张",
      "无人机航拍视频",
      "小红书推广文案",
      "朋友圈推广文案",
      "抖音短视频脚本",
    ],
  },
  {
    id: 7, cat: "villa", status: "avail",
    name: "卡马拉Casawiki日落别墅", nameEn: "Casawiki Sunset Villas",
    emoji: "🏛️",
    images: [
      "https://i.ibb.co/mC5q62dC/photo-2026-06-08-22-16-03.jpg",
      "https://i.ibb.co/zhfDjt1N/photo-2026-06-08-22-16-05.jpg",
      "https://i.ibb.co/qF1D6wR7/photo-2026-06-08-22-16-27.jpg",
      "https://i.ibb.co/5WQ2BvxF/photo-2026-06-08-22-16-29.jpg",
      "https://i.ibb.co/pjWLq5Gs/photo-2026-06-08-22-16-33.jpg",
      "https://i.ibb.co/Xk4Yxh3b/photo-2026-06-08-22-16-34.jpg",
      "https://i.ibb.co/pBfTKdpS/photo-2026-06-08-22-16-36.jpg",
      "https://i.ibb.co/vCLfc46t/photo-2026-06-08-22-16-37.jpg",
      "https://i.ibb.co/1fjtKgQD/photo-2026-06-08-22-16-38.jpg",
      "https://i.ibb.co/Jj46sBcJ/photo-2026-06-08-22-16-39.jpg",
      "https://i.ibb.co/twhbq1K3/photo-2026-06-08-22-16-41.jpg",
      "https://i.ibb.co/7xTxr3VP/photo-2026-06-08-22-16-42.jpg",
      "https://i.ibb.co/Xxx1n2Cr/photo-2026-06-08-22-16-43.jpg",
      "https://i.ibb.co/wFdHT9nb/photo-2026-06-08-22-16-44.jpg",
      "https://i.ibb.co/YT1W6dXj/photo-2026-06-08-22-16-46.jpg",
      "https://i.ibb.co/Pz5nZBz2/photo-2026-06-08-22-16-47.jpg",
      "https://i.ibb.co/Mx3bJsfj/photo-2026-06-08-22-16-48.jpg",
      "https://i.ibb.co/ZpVS0Hst/photo-2026-06-08-22-16-49.jpg",
      "https://i.ibb.co/39mXmBN6/photo-2026-06-08-22-17-58.jpg",
      "https://i.ibb.co/RkPCSJN4/photo-2026-06-08-22-18-00.jpg",
      "https://i.ibb.co/xKCC3djQ/photo-2026-06-08-22-18-01.jpg",
      "https://i.ibb.co/kgxvzs38/photo-2026-06-08-22-18-03.jpg",
      "https://i.ibb.co/n8LLSktF/photo-2026-06-08-22-18-04.jpg",
      "https://i.ibb.co/HLsvG4Kh/photo-2026-06-08-22-18-06.jpg",
      "https://i.ibb.co/Pq3xJBM/photo-2026-06-08-22-18-07.jpg",
      "https://i.ibb.co/HL0NmPCS/photo-2026-06-08-22-18-08.jpg",
      "https://i.ibb.co/F4rffHKB/photo-2026-06-08-22-18-10.jpg",
      "https://i.ibb.co/Kz2q9t19/photo-2026-06-08-22-18-11.jpg",
      "https://i.ibb.co/Z6GyCGJ0/photo-2026-06-08-22-18-12.jpg",
    ],
    desc: "马思唯/GAI明星同款！卡马拉百万富豪街Cape Sienna，价值1.2亿，180度无敌海景，25米无边盐水恒温泳池，6全海景卧室可住12人，4层别墅一层直达私家海滩。",
    retail: 47000, agent: 42000, cost: 39000,
    includes: [
      "两位全职女佣 + 1位厨师",
      "每日早餐（中式/西式，300 THB/人）",
      "25米盐水恒温无边泳池（24H）",
      "全自动麻将桌、PS设备",
      "免费Wi-Fi",
      "私家车库",
      "每日清洁服务",
      "私家海滩（可游泳/钓鱼/拍照）",
      "婴儿床加床服务（1,500 THB/晚）",
    ],
    excludes: [
      "电费（8泰铢/度）",
      "厨师服务（2,500~3,000 THB/餐，食材另加20%）",
      "入住押金（20,000 THB，退房退还）",
      "加床费（1,500 THB/晚）",
    ],
    suppliers: [
      { name: "黄金右脚", price: 39000 },
    ],
    notes: [
      "马思唯/GAI明星同款，小红书爆款潜力极高",
      "Cape Sienna酒店旁，卡马拉百万富豪街顶级地段",
      "利润空间较小（代理42000 vs 成本39000）",
      "可承接企业团建、重要客户招待",
      "一层直达海边，差异化卖点突出",
    ],
    faq: [
      { q: "入住退房时间？", a: "15:00后入住，12:00前退房，需提前沟通如需调整。" },
      { q: "最多住几人？", a: "6卧室标准住12人，可加床每晚1500泰铢。" },
      { q: "有厨师服务吗？", a: "有，每餐2500~3000泰铢服务费，食材费用另加20%，需提前告知。" },
      { q: "电费怎么算？", a: "8泰铢/度，入退房时实拍电表结算。" },
      { q: "可以去海边吗？", a: "可以！别墅一层楼梯直达私家海滩，可游泳、钓鱼、拍照。" },
    ],
    itinerary: "管家迎接入住 → 欢迎果盘 → 自由享用25米无边泳池 → 180度日落海景 → 可选私厨晚宴或BBQ → 一层私家海滩夜钓",
    materials: [
      "别墅高清实拍图29张",
      "无人机航拍视频",
      "小红书爆款文案（马思唯/GAI同款版）",
      "朋友圈推广文案",
      "抖音短视频脚本",
    ],
  },
  {
    id: 6, cat: "villa", status: "avail",
    name: "卡马拉Sara海景别墅", nameEn: "Villa Sara Kamala",
    emoji: "🏛️",
    images: [
      "https://i.ibb.co/ds5vYVPw/photo-2026-06-08-03-36-00.jpg",
      "https://i.ibb.co/PZ0JS7Ns/photo-2026-06-08-03-36-02.jpg",
      "https://i.ibb.co/WWHB5877/photo-2026-06-08-03-36-04.jpg",
      "https://i.ibb.co/vMz5dkz/photo-2026-06-08-03-36-06.jpg",
      "https://i.ibb.co/Xrrc0sQb/photo-2026-06-08-03-36-08.jpg",
      "https://i.ibb.co/4RJNVRGS/photo-2026-06-08-03-36-10.jpg",
      "https://i.ibb.co/rG4pXqXr/photo-2026-06-08-03-36-12.jpg",
      "https://i.ibb.co/4rX5m9n/photo-2026-06-08-03-36-14.jpg",
      "https://i.ibb.co/v4qHbVYt/photo-2026-06-08-03-36-16.jpg",
      "https://i.ibb.co/GQjGbdww/photo-2026-06-08-03-36-17.jpg",
      "https://i.ibb.co/0R58z0bK/photo-2026-06-08-03-36-19.jpg",
      "https://i.ibb.co/MDSB66PZ/photo-2026-06-08-03-36-23.jpg",
      "https://i.ibb.co/BX4t26j/photo-2026-06-08-03-36-25.jpg",
      "https://i.ibb.co/hJ4rH067/photo-2026-06-08-03-36-27.jpg",
      "https://i.ibb.co/Q7wqbg1v/photo-2026-06-08-03-36-28.jpg",
      "https://i.ibb.co/1fkV0sk7/photo-2026-06-08-03-36-30.jpg",
      "https://i.ibb.co/gbXVVmDz/photo-2026-06-08-03-36-32.jpg",
      "https://i.ibb.co/ymqfWfxD/photo-2026-06-08-03-36-34.jpg",
      "https://i.ibb.co/4ZG7PG44/photo-2026-06-08-03-36-36.jpg",
      "https://i.ibb.co/LXMpMZrm/photo-2026-06-08-03-36-37.jpg",
      "https://i.ibb.co/SX6z2k7d/photo-2026-06-08-03-36-39.jpg",
      "https://i.ibb.co/qL8vbwCz/photo-2026-06-08-03-36-41.jpg",
      "https://i.ibb.co/F4mY0dCb/photo-2026-06-08-03-36-43.jpg",
      "https://i.ibb.co/7xSkBYzL/photo-2026-06-08-03-36-44.jpg",
      "https://i.ibb.co/RTcPkpRb/photo-2026-06-08-03-36-46.jpg",
      "https://i.ibb.co/v63Q9vPV/photo-2026-06-08-03-36-48.jpg",
      "https://i.ibb.co/LX6G4H9h/photo-2026-06-08-03-36-50.jpg",
      "https://i.ibb.co/qMRLrnQC/photo-2026-06-08-03-36-52.jpg",
      "https://i.ibb.co/b9yGXc5/photo-2026-06-08-03-36-54.jpg",
      "https://i.ibb.co/q3wn2QCR/photo-2026-06-08-03-36-56.jpg",
    ],
    desc: "王嘉尔明星同款！卡马拉百万富翁大道Samsara庄园，7卧室6卫可住13人，21米无边泳池直面安达曼海壮观日落，与Naka五星度假酒店比邻。",
    retail: 83000, agent: 77000, cost: 73000,
    includes: [
      "免费接送机（入住退房日）",
      "每日免费早餐（中式/美式/泰式）",
      "每天免费300度电",
      "中英泰文管家（行程/餐厅/游艇/高尔夫/SPA预订）",
      "3名全职女佣每日清洁",
      "21米无边泳池",
      "健身房、台球室、自动麻将机",
      "PS5游戏机、蓝牙音响",
      "婴儿床及婴儿餐椅",
      "欢迎果盘及饮料",
      "免费Wi-Fi（75Mbps）",
      "私人草坪（可承接婚礼）",
    ],
    excludes: [
      "超出300度电费（7泰铢/度）",
      "私厨服务（4,000 THB/次，食材另计）",
      "漂浮早餐/下午茶（3,000 THB/次）",
      "午晚餐食材费用",
    ],
    suppliers: [
      { name: "JH", price: 73000 },
    ],
    notes: [
      "王嘉尔明星同款，小红书爆款潜力极高",
      "市场价83000，代理价77000，利润空间较小需注意",
      "Samsara庄园顶级地段，卡马拉百万富翁大道",
      "可承接婚礼、企业团建",
    ],
    faq: [
      { q: "入住退房时间？", a: "12:00前退房，15:00后入住，如需调整请提前与管家沟通。" },
      { q: "最多住几人？", a: "7卧室最多住13人。" },
      { q: "有私厨服务吗？", a: "有，厨师费4000泰铢/次，可做中餐/泰餐/BBQ/火锅/海鲜/意大利餐，食材根据账单报销。" },
      { q: "距离芭东多远？", a: "芭东海滩12分钟车程，芭东酒吧街15-20分钟，7-11便利店3分钟。" },
      { q: "可以办婚礼吗？", a: "可以！别墅有私人草坪，可承接婚礼及企业活动，请提前联系管家安排。" },
    ],
    itinerary: "管家机场迎接（免费接送） → 欢迎果盘饮料 → 自由享用21米无边泳池 → 日落时分安达曼海全景 → 可选私厨晚宴或周边餐厅",
    materials: [
      "别墅高清实拍图30张",
      "无人机航拍视频",
      "小红书爆款文案（王嘉尔同款版）",
      "朋友圈推广文案",
      "抖音短视频脚本",
    ],
  },
  {
    id: 3, cat: "spa", status: "avail",
    name: "Keemala竹屋SPA", nameEn: "Keemala Signature Spa",
    emoji: "💆", desc: "藏于热带雨林中的五星级SPA殿堂，采用古法泰式疗法与海岛精油，360分钟全身心蜕变体验。",
    retail: 8500, agent: 7200, cost: 5800,
    suppliers: [{ name: "Keemala直采", price: 5800 }, { name: "第三方代理", price: 6400 }],
    notes: ["淡季有时可争取折扣", "可配合别墅套餐打包"],
    faq: [{ q: "需提前多久预约?", a: "建议提前2-5天，旺季7天以上。" }],
    itinerary: "专车接送 → 迎宾花环 → 身体评估 → 古法按摩 → 精油疗愈 → 冥想收尾 → 健康茶点",
    includes: ["交通接送", "全程疗程", "精油赠品", "健康套餐"],
    excludes: ["额外护肤品", "升级项目"],
    materials: ["Keemala官方授权图", "中文推广文案", "小红书种草帖"]
  },
  {
    id: 11, cat: "car", status: "avail",
    name: "VIP商务车10人包车", nameEn: "Toyota VIP Van Private Transfer",
    emoji: "🚐",
    images: [
      "https://i.ibb.co/SwFWBYwb/photo-2026-06-09-03-12-54.jpg",
      "https://i.ibb.co/sdkqxbwd/photo-2026-06-09-03-12-56.jpg",
      "https://i.ibb.co/5xsxydrq/photo-2026-06-09-03-12-57.jpg",
      "https://i.ibb.co/nMqX6RRH/photo-2026-06-09-03-12-58.jpg",
      "https://i.ibb.co/8grC0Vjj/photo-2026-06-09-03-12-59.jpg",
    ],
    desc: "Toyota VIP Van豪华商务车，最多10人乘坐，超大行李空间，专业中文司机全程服务。机场接送7,500 THB，8小时包车18,000 THB，家庭/团队出游首选。",
    retail: 18000, agent: 16500, cost: 14600,
    includes: [
      "Toyota VIP Van豪华商务车",
      "专业中文司机",
      "最多10人乘坐",
      "超大行李空间",
      "航班延误免费等待（机场接送）",
      "8小时自由定制行程（包车）",
      "景点/餐厅/购物中心随心安排",
    ],
    excludes: [
      "过路费及停车费",
      "超时费用",
      "餐饮费用",
    ],
    suppliers: [
      { name: "善元堂（包车）", price: 14600 },
      { name: "善元堂（接送机）", price: 5850 },
    ],
    notes: [
      "接送机：市场价7500 / 代理价6500 / 成本5850",
      "包车8H：市场价18000 / 代理价16500 / 成本14600",
      "10人大容量是核心卖点，适合家庭及团队",
      "可与别墅套餐捆绑，提升客单价",
      "与Alphard形成高低搭配，满足不同预算客户",
    ],
    faq: [
      { q: "最多坐几人？", a: "最多10位乘客，行李空间超大，家庭及团队出游首选。" },
      { q: "机场接送多少钱？", a: "普吉国际机场单程7,500 THB，含中文司机、协助行李、航班延误免费等待。" },
      { q: "包车几小时？", a: "标准8小时18,000 THB，行程自由定制，景点餐厅随心安排。" },
      { q: "和Alphard有什么区别？", a: "VIP Van容量更大（10人），价格更实惠；Alphard更豪华（7人），适合商务/高端客户。" },
    ],
    itinerary: "机场/酒店准时接车 → 中文司机协助行李 → 自由定制游览路线 → 景点/餐厅/购物 → 准时送回目的地",
    materials: [
      "VIP Van实拍图5张",
      "小红书推广文案（多人出行版）",
      "朋友圈推广文案",
      "包车套餐对比表（Alphard vs VIP Van）",
    ],
  },
  {
    id: 12, cat: "car", status: "avail",
    name: "埃尔法豪华专车服务", nameEn: "Alphard Luxury Transfer",
    emoji: "🚘",
    images: [
      "https://i.ibb.co/wZ4KdrnS/photo-2026-06-09-02-50-29.jpg",
      "https://i.ibb.co/twRDzYF7/photo-2026-06-09-02-50-31.jpg",
      "https://i.ibb.co/pByPBcxd/photo-2026-06-09-02-50-33.jpg",
      "https://i.ibb.co/LhpDLPtx/photo-2026-06-09-02-50-34.jpg",
      "https://i.ibb.co/1f1wd1x8/photo-2026-06-09-02-50-35.jpg",
      "https://i.ibb.co/F4mMYYfR/photo-2026-06-09-02-50-37.jpg",
      "https://i.ibb.co/Xx2DCGgK/photo-2026-06-09-02-50-38.jpg",
      "https://i.ibb.co/FLcRdjFR/photo-2026-06-09-02-50-39.jpg",
      "https://i.ibb.co/yFsmhyhZ/photo-2026-06-09-02-50-41.jpg",
      "https://i.ibb.co/HTGdnRxN/photo-2026-06-09-02-50-42.jpg",
    ],
    desc: "Toyota Alphard埃尔法商务座驾，航空级豪华座椅，专业中文司机全程服务。机场接送单程15,000 THB，8小时包车36,000 THB，适合家庭、商务及高端度假客户。",
    retail: 36000, agent: 28000, cost: 24400,
    includes: [
      "Toyota Alphard埃尔法豪华6座驾 可座6人",
      "专业中文司机",
      "航班延误免费等待（机场接送）",
      "协助搬运行李",
      "8小时自由定制行程（包车）",
      "景点/餐厅/购物中心随心安排",
    ],
    excludes: [
      "过路费及停车费",
      "超时费用（1,000 THB/小时）",
      "餐饮费用",
    ],
    suppliers: [
      { name: "善元堂（包车）", price: 24400 },
      { name: "善元堂（接送机）", price: 12500 },
    ],
    notes: [
      "接送机：市场价15000 / 代理价14000 / 成本12500",
      "包车8H：市场价36000 / 代理价28000 / 成本24400",
      "包车利润空间好（28000-24400=3600）",
      "中文司机是核心卖点，中国客户满意度极高",
      "可与别墅/游艇套餐捆绑销售",
    ],
    faq: [
      { q: "机场接送多少钱？", a: "普吉国际机场单程15,000 THB，含中文司机接机、协助行李、航班延误免费等待。" },
      { q: "包车几小时？怎么收费？", a: "标准8小时36,000 THB，超出部分1,000 THB/小时。" },
      { q: "可以自由安排行程吗？", a: "完全可以！景点、餐厅、购物中心随心安排，司机全程中文服务。" },
      { q: "适合几人乘坐？", a: "Alphard最多7人，宽敞舒适，适合家庭、情侣及商务出行。" },
    ],
    itinerary: "机场/酒店准时接车 → 中文司机协助行李 → 自由定制游览路线 → 景点/餐厅/购物 → 准时送回目的地",
    materials: [
      "埃尔法实拍图10张",
      "小红书推广文案（高端出行版）",
      "朋友圈推广文案",
      "机场接送专属海报",
    ],
  },
  {
    id: 4, cat: "heli", status: "avail",
    name: "直升机日落私飞", nameEn: "Sunset Helicopter Flight",
    emoji: "🚁", desc: "从高空俯瞰普吉岛全景，黄金日落时分私人直升机体验，含空中香槟，限2-4人成团。",
    retail: 28000, agent: 24000, cost: 19500,
    suppliers: [{ name: "Blue Sky Aviation", price: 19500 }, { name: "Air Andaman", price: 21000 }],
    notes: ["受天气影响，需准备备用方案", "需提前5天确认"],
    faq: [{ q: "天气取消怎么办?", a: "免费改期一次，不可退款，建议购买旅行险。" }],
    itinerary: "酒店接送 → 直升机坪登机 → 空中私飞50分钟 → 香槟庆典 → 返回",
    includes: ["50分钟飞行", "空中香槟", "专属摄影师"],
    excludes: ["额外延时", "地面安排"],
    materials: ["空中实拍图", "INS风推广视频"]
  },
  {
    id: 5, cat: "photo", status: "avail",
    name: "小红书爆款海岛旅拍", nameEn: "Island Photography Session",
    emoji: "📸", desc: "专业摄影师配合顶级场地，涵盖游艇、别墅、泳池、日落海滩，成片率100%，当天精修出图。",
    retail: 5800, agent: 4800, cost: 3500,
    suppliers: [{ name: "岛上摄影工作室", price: 3500 }, { name: "自由摄影师B", price: 3800 }],
    notes: ["摄影师中文沟通，客户喜爱度极高"],
    faq: [{ q: "几张精修图?", a: "30-50张精修，原图全留。" }],
    itinerary: "造型准备1H → 游艇场景拍摄 → 别墅泳池写真 → 日落海滩收尾",
    includes: ["摄影师", "30+精修图", "当日交付"],
    excludes: ["服装", "化妆造型"],
    materials: ["样片集锦", "小红书专属推广套件"]
  },
];export default function App() {
  const [role, setRole] = useState("guest");
  const [page, setPage] = useState("home");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCat, setSelectedCat] = useState("all");
  const [searchQ, setSearchQ] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [loginTab, setLoginTab] = useState("agent");
  const [loginForm, setLoginForm] = useState({ user: "", pass: "" });
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminTab, setAdminTab] = useState("products");

  const navigate = (p) => { setPage(p); setMenuOpen(false); window.scrollTo(0, 0); };

  const login = () => {
    if (loginTab === "agent" && loginForm.pass === "agent888") { setRole("agent"); setShowLogin(false); }
    else if (loginTab === "admin" && loginForm.pass === "admin888") { setRole("admin"); setShowLogin(false); navigate("admin"); }
    else alert("密码错误，请联系管理员");
  };

  const logout = () => { setRole("guest"); navigate("home"); };

  const filteredProducts = PRODUCTS.filter(p => {
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
          {role !== "guest" && <span className="nav-role-badge">{role === "admin" ? "内部员工" : "代理商"}</span>}
          <button className="nav-btn" onClick={() => navigate("products")}>产品库</button>
          {role === "admin" && <button className="nav-btn" onClick={() => navigate("admin")}>后台</button>}
          {role === "guest"
            ? <button className="nav-btn gold" onClick={() => setShowLogin(true)}>代理登录</button>
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
            代理商登录
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
                  {t === "agent" ? "代理商" : "内部员工"}
                </button>
              ))}
            </div>
            <div className="login-hint">
              演示密码：<strong>{loginTab === "agent" ? "agent888" : "admin888"}</strong>
            </div>
            <div className="form-group">
              <label className="form-label">账号</label>
              <input className="form-input" placeholder="请输入账号" value={loginForm.user} onChange={e => setLoginForm({ ...loginForm, user: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">密码</label>
              <input className="form-input" type="password" placeholder="请输入密码" value={loginForm.pass} onChange={e => setLoginForm({ ...loginForm, pass: e.target.value })} onKeyDown={e => e.key === "Enter" && login()} />
            </div>
            <button className="form-submit" onClick={login}>登 录</button>
          </div>
        </div>
      )}

      {page === "home" && <HomePage navigate={navigate} setSelectedCat={setSelectedCat} statusBadge={statusBadge} setSelectedProduct={setSelectedProduct} role={role} />}
      {page === "products" && <ProductsPage products={filteredProducts} role={role} selectedCat={selectedCat} setSelectedCat={setSelectedCat} searchQ={searchQ} setSearchQ={setSearchQ} statusBadge={statusBadge} setSelectedProduct={(p) => { setSelectedProduct(p); navigate("detail"); }} />}
      {page === "detail" && selectedProduct && <DetailPage product={selectedProduct} role={role} back={() => navigate("products")} statusBadge={statusBadge} />}
      {page === "admin" && role === "admin" && <AdminPage adminTab={adminTab} setAdminTab={setAdminTab} />}
      {page !== "admin" && <Footer navigate={navigate} />}
      {page !== "admin" && (
        <div className="contact-float">
          <button className="float-btn float-wechat">💬</button>
          <button className="float-btn float-whatsapp">📱</button>
        </div>
      )}
    </div>
  );
}function HomePage({ navigate, setSelectedCat, setSelectedProduct, statusBadge, role }) {
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
          <div className="hero-subtitle-cn">隐海 · 普吉岛高端定制</div>
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
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="cat-card" onClick={() => { setSelectedCat(cat.id); navigate("products"); }}>
              <div className="cat-bg">{cat.icon}</div>
              <div className="cat-gradient" />
              <div className="cat-count">{cat.count}</div>
              <div className="cat-content">
                <div className="cat-icon">{cat.icon}</div>
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
          {PRODUCTS.slice(0, 3).map(p => (
            <ProductCard key={p.id} product={p} role={role} statusBadge={statusBadge} onClick={() => { setSelectedProduct(p); navigate("detail"); }} />
          ))}
        </div>
      </section>
    </>
  );
}

function ProductsPage({ products, role, selectedCat, setSelectedCat, searchQ, setSearchQ, statusBadge, setSelectedProduct }) {
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
          <button className={`filter-tab${selectedCat === "all" ? " active" : ""}`} onClick={() => setSelectedCat("all")}>全部</button>
          {CATEGORIES.map(c => (
            <button key={c.id} className={`filter-tab${selectedCat === c.id ? " active" : ""}`} onClick={() => setSelectedCat(c.id)}>
              {c.icon} {c.name}
            </button>
          ))}
        </div>
      </div>
      <div className="section" style={{ paddingTop: 16 }}>
        {products.length === 0
          ? <div className="empty-state"><div style={{fontSize:48}}>🔍</div><div style={{marginTop:16}}>未找到相关产品</div></div>
          : <div className="product-grid">{products.map(p => <ProductCard key={p.id} product={p} role={role} statusBadge={statusBadge} onClick={() => setSelectedProduct(p)} />)}</div>
        }
      </div>
    </div>
  );
}

function ProductCard({ product: p, role, statusBadge, onClick }) {
  const profit = p.retail - p.agent;
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
          <span className="badge badge-cat">{CATEGORIES.find(c => c.id === p.cat)?.name}</span>
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
        {(role === "agent" || role === "admin") && (
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
        {role === "admin" && (
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
            {(role === "agent" || role === "admin") && (
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "var(--fog)", marginBottom: 4 }}>代理价</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--gold)" }}>฿{p.agent.toLocaleString()}</div>
                <div style={{ fontSize: 11, color: "var(--success)", marginTop: 2 }}>利润 +{(p.retail - p.agent).toLocaleString()}</div>
              </div>
            )}
          </div>
          {role === "admin" && (
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
        <div className="detail-section" style={{ marginTop: 24 }}>
          <div className="detail-section-title">行程安排</div>
          <p className="detail-text">{p.itinerary}</p>
        </div>
        <div className="detail-section">
          <div className="detail-section-title">包含内容</div>
          <ul className="include-list">{p.includes?.map((item, i) => <li key={i}>{item}</li>)}</ul>
        </div>
        <div className="detail-section">
          <div className="detail-section-title">不含内容</div>
          <ul className="exclude-list">{p.excludes?.map((item, i) => <li key={i}>{item}</li>)}</ul>
        </div>
        <div className="detail-section">
          <div className="detail-section-title">常见问题</div>
          {p.faq?.map((f, i) => (
            <div key={i} className="faq-item">
              <div className="faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                {f.q} <span style={{ color: "var(--gold)", fontSize: 18 }}>{openFaq === i ? "−" : "+"}</span>
              </div>
              {openFaq === i && <div className="faq-a">{f.a}</div>}
            </div>
          ))}
        </div>
        {role === "agent" && (
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

function AdminPage({ adminTab, setAdminTab }) {
  const totalProfit = PRODUCTS.reduce((s, p) => s + (p.retail - p.cost), 0);
  return (
    <div className="admin-panel">
      <div className="admin-title">后台管理系统</div>
      <div className="admin-subtitle">隐海 YINSEA · 内部专用</div>
      <div className="stats-grid">
        <div className="stats-card"><div className="stats-card-num">{PRODUCTS.length}</div><div className="stats-card-label">在架产品</div></div>
        <div className="stats-card"><div className="stats-card-num profit-highlight">฿{(totalProfit/1000).toFixed(0)}K</div><div className="stats-card-label">综合利润空间</div></div>
        <div className="stats-card"><div className="stats-card-num">12</div><div className="stats-card-label">活跃代理商</div></div>
        <div className="stats-card"><div className="stats-card-num">98%</div><div className="stats-card-label">客户好评率</div></div>
      </div>
      <div className="admin-tabs">
        {["products","agents","suppliers","settings"].map(t => (
          <button key={t} className={`admin-tab${adminTab===t?" active":""}`} onClick={() => setAdminTab(t)}>
            {t==="products"?"产品管理":t==="agents"?"代理账号":t==="suppliers"?"供应商":"系统设置"}
          </button>
        ))}
      </div>
      {adminTab === "products" && (
        <>
          <button className="add-product-btn">＋ 新增产品</button>
          {PRODUCTS.map(p => (
            <div key={p.id} className="admin-card">
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:14 }}>
                <div>
                  <div className="admin-card-title">{p.emoji} {p.name}</div>
                  <div style={{ fontSize:11, color:"var(--fog)", marginTop:3 }}>{CATEGORIES.find(c=>c.id===p.cat)?.name}</div>
                </div>
                <div style={{ display:"flex", gap:8 }}>
                  <button className="admin-action-btn" style={{ fontSize:11, padding:"5px 12px", borderRadius:20, border:"1px solid var(--border)", background:"none", color:"var(--mist)", cursor:"pointer", fontFamily:"var(--font-ui)" }}>编辑</button>
                  <button className="admin-action-btn" style={{ fontSize:11, padding:"5px 12px", borderRadius:20, border:"1px solid var(--border)", background:"none", color:"var(--danger)", cursor:"pointer", fontFamily:"var(--font-ui)" }}>删除</button>
                </div>
              </div>
              <div className="admin-price-grid">
                <div className="admin-price-item"><div className="admin-price-label">市场价</div><div style={{ fontSize:16, color:"var(--mist)" }}>฿{p.retail.toLocaleString()}</div></div>
                <div className="admin-price-item"><div className="admin-price-label">代理价</div><div style={{ fontSize:16, color:"var(--gold)" }}>฿{p.agent.toLocaleString()}</div></div>
                <div className="admin-price-item"><div className="admin-price-label">成本价</div><div style={{ fontSize:16, color:"var(--danger)" }}>฿{p.cost.toLocaleString()}</div></div>
              </div>
              <div className="supplier-list">
                {p.suppliers?.map((s,i) => {
                  const isBest = s.price === Math.min(...p.suppliers.map(x=>x.price));
                  return (
                    <div key={i} className="supplier-row">
                      <span className="supplier-name">{isBest?"⭐ ":""}{s.name}</span>
                      <span style={{ color: isBest?"var(--success)":"var(--pearl)" }}>฿{s.price.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
              {p.notes && <div className="tag-row" style={{marginTop:10}}>{p.notes.map((n,i)=><span key={i} className="note-tag">{n}</span>)}</div>}
            </div>
          ))}
        </>
      )}
      {adminTab === "agents" && (
        <div className="admin-card">
          <div className="admin-card-title" style={{marginBottom:16}}>代理商账号管理</div>
          {[{name:"上海旅界旅行",code:"AG001",level:"钻石"},{name:"北京优途假期",code:"AG002",level:"金牌"},{name:"广州奢游社",code:"AG003",level:"银牌"}].map((a,i)=>(
            <div key={i} className="supplier-row">
              <div><div style={{fontSize:14,color:"var(--pearl)"}}>{a.name}</div><div style={{fontSize:11,color:"var(--fog)"}}>{a.code}</div></div>
              <span style={{fontSize:11,color:"var(--gold)",background:"rgba(201,169,110,0.1)",border:"1px solid rgba(201,169,110,0.3)",padding:"2px 8px",borderRadius:20}}>{a.level}</span>
            </div>
          ))}
        </div>
      )}
      {adminTab === "suppliers" && (
        <div className="admin-card">
          <div className="admin-card-title" style={{marginBottom:16}}>供应商数据库</div>
          {[{name:"泰国海上蓝",contact:"张经理",tel:"+66 81 234 5678",cat:"游艇"},{name:"Villa Heaven",contact:"Smith",tel:"+66 82 345 6789",cat:"别墅"},{name:"Blue Sky Aviation",contact:"CapT",tel:"+66 83 456 7890",cat:"直升机"}].map((s,i)=>(
            <div key={i} style={{padding:"14px 0",borderBottom:"1px solid var(--border)"}}>
              <div style={{display:"flex",justifyContent:"space-between"}}>
                <div className="admin-card-title">{s.name}</div>
                <span className="badge badge-cat">{s.cat}</span>
              </div>
              <div style={{fontSize:12,color:"var(--fog)",marginTop:6,lineHeight:1.8}}>联系人: {s.contact} · 📞 {s.tel}</div>
            </div>
          ))}
        </div>
      )}
      {adminTab === "settings" && (
        <div className="admin-card">
          <div className="admin-card-title" style={{marginBottom:16}}>系统设置</div>
          {[["品牌名称","隐海 YINSEA PHUKET"],["联系微信","yinsea_phuket"],["WhatsApp","+66 91 234 5678"],["货币显示","泰铢 THB"]].map(([k,v],i)=>(
            <div key={i} className="supplier-row">
              <span className="supplier-name">{k}</span>
              <span style={{color:"var(--pearl)"}}>{v}</span>
            </div>
          ))}
        </div>
      )}
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
          {["游艇出海","奢华别墅","顶级SPA","直升机","高端定制"].map(l=><a key={l} onClick={()=>navigate("products")}>{l}</a>)}
        </div>
        <div className="footer-links-group">
          <h4>关于我们</h4>
          {["品牌介绍","合作代理","联系我们","加入团队"].map(l=><a key={l}>{l}</a>)}
        </div>
      </div>
      <div className="footer-bottom">© 2024 隐海 YINSEA PHUKET · All Rights Reserved</div>
    </footer>
  );
}
