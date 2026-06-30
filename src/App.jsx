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
  { id: "spa", icon: "💆", name: "顶级SPA", en: "Luxury Spa" },
  { id: "photo", icon: "📸", name: "旅拍写真", en: "Travel Photo", cover: "https://i.ibb.co/mVftcPGz/photo-2026-06-26-00-49-38.jpg" },
  { id: "heli", icon: "🚁", name: "直升机", en: "Helicopter" },
  { id: "custom", icon: "✨", name: "隐海定制", en: "Bespoke" },
];

const PRODUCTS = [
  {
    id: 64, cat: "custom", status: "avail",
    name: "闺蜜假期", nameEn: "Girls' Escape",
    emoji: "✨",
    images: [
      "https://i.ibb.co/Dg6ZN5dv/image.png",
    ],
    desc: "最好的旅行，是与最好的朋友同行。放慢脚步，享受阳光、海风、美食与欢笑。从精致度假到拍照打卡，从放松疗愈到海岛探索，隐海为每一次相聚创造更多值得分享的回忆。",
    retail: 9999, agent: 9999, cost: 9999,
    includes: [
      "私人别墅住宿安排",
      "游艇出海安排",
      "Beach Club体验",
      "SPA护理",
      "下午茶",
      "摄影旅拍",
      "特色餐厅推荐",
      "购物推荐",
      "酒吧体验",
    ],
    excludes: [
      "具体费用根据需求定制报价（标注价格为客制化起价）",
    ],
    suppliers: [
      { name: "隐海定制团队", price: 9999 },
    ],
    notes: [
      "适合人群：闺蜜出游、女生旅行、毕业旅行、度假放松",
      "可定制体验：私人别墅、游艇出海、Beach Club、SPA护理、下午茶、摄影旅拍、特色餐厅、购物推荐、酒吧体验",
      "完全定制化产品，需先沟通需求再出具体方案",
      "建议提前2-4周联系以便充分筹备",
    ],
    faq: [
      { q: "需要提前多久预约？", a: "建议提前2-4周联系，特殊场地或热门日期建议更早安排。" },
      { q: "费用怎么计算？", a: "标价为客制化起价，最终费用根据住宿、游艇、SPA等具体需求组合后给出报价。" },
      { q: "可以策划生日或毕业庆祝吗？", a: "可以！我们可以协助布置场景、安排摄影记录庆祝时刻。" },
      { q: "需要提供哪些信息？", a: "旅行日期、天数、同行人数、预算偏好、住宿偏好、体验偏好、是否有特别时刻、其他特别需求。" },
    ],
    itinerary: "沟通需求（旅行日期/天数/人数/预算/住宿/体验偏好/特别时刻）→ 定制专属方案 → 确认细节 → 旅程执行 → 摄影记录闺蜜美好时光",
    materials: [
      "闺蜜假期概念图1张",
      "小红书推广文案（闺蜜出游版）",
      "朋友圈推广文案",
      "毕业旅行/生日庆祝专属方案模板",
      "客户需求收集表",
    ],
  },
  {
    id: 63, cat: "custom", status: "avail",
    name: "蜜月臻旅", nameEn: "Honeymoon Journey",
    emoji: "✨",
    images: [
      "https://i.ibb.co/pBsncRkY/image.png",
    ],
    desc: "每一段爱情，都值得一场独一无二的旅程。从浪漫海景、私人游艇、日落晚餐，到求婚仪式、纪念日庆祝与专属摄影，隐海将每一个细节融入旅程，让爱意在普吉岛留下最美好的回忆。",
    retail: 9999, agent: 9999, cost: 9999,
    includes: [
      "私人别墅住宿安排",
      "游艇出海安排",
      "浪漫布置",
      "摄影摄像服务",
      "烛光晚餐",
      "SPA体验",
      "专属礼遇",
    ],
    excludes: [
      "具体费用根据需求定制报价（标注价格为客制化起价）",
    ],
    suppliers: [
      { name: "隐海定制团队", price: 9999 },
    ],
    notes: [
      "适合人群：蜜月旅行、求婚策划、纪念日庆祝、情侣度假",
      "可定制体验：私人别墅、游艇出海、浪漫布置、摄影摄像、烛光晚餐、SPA体验、专属礼遇",
      "完全定制化产品，需先沟通需求再出具体方案",
      "建议提前2-4周联系以便充分筹备",
    ],
    faq: [
      { q: "需要提前多久预约？", a: "建议提前2-4周联系，特殊场地或热门日期建议更早安排。" },
      { q: "费用怎么计算？", a: "标价为客制化起价，最终费用根据住宿、游艇、摄影等具体需求组合后给出报价。" },
      { q: "可以策划求婚吗？", a: "可以！我们可以协助布置求婚场景、安排摄影摄像记录整个过程。" },
      { q: "需要提供哪些信息？", a: "旅行日期、天数、同行人数、预算偏好、住宿偏好、体验偏好、是否有特殊时刻、其他特别需求。" },
    ],
    itinerary: "沟通需求（旅行日期/天数/人数/预算/住宿/体验偏好/特殊时刻）→ 定制专属方案 → 确认细节 → 旅程执行 → 专属摄影记录美好回忆",
    materials: [
      "蜜月臻旅概念图1张",
      "小红书推广文案（蜜月定制版）",
      "朋友圈推广文案",
      "求婚策划专属方案模板",
      "客户需求收集表",
    ],
  },
  {
    id: 60, cat: "yacht", status: "avail",
    name: "Amandla动力双体船", nameEn: "Amandla Power Catamaran Chalong",
    emoji: "⛵",
    images: [
      "https://i.ibb.co/TqxBL3X3/1639818669-1-S-10846216.jpg",
      "https://i.ibb.co/B2Bcdh8z/1639818669-2-S-10846217.jpg",
      "https://i.ibb.co/B5gHdwnx/1639818669-3-S-10846218.jpg",
      "https://i.ibb.co/LDgm9YvP/1639818669-4-S-10846219.jpg",
      "https://i.ibb.co/S7571PLM/1639818669-5-S-10846220.jpg",
      "https://i.ibb.co/G4dzb33V/1639818669-6-S-10846221.jpg",
      "https://i.ibb.co/XZgDjSVG/1639818669-7-S-10846222.jpg",
    ],
    desc: "Amandla动力双体船，查龙出发，全天/半天多条航线，含午餐+充气游泳池+SUP桨板+钓鱼装备。从珊瑚岛31,250起至拉查+拉查诺伊66,250，淡旺季分级定价，以8人为基准。",
    retail: 50000, agent: 45000, cost: 42500,
    includes: [
      "查龙码头小型货车接送",
      "全体船员",
      "午餐",
      "水果及小吃",
      "软饮料及冰块",
      "音响系统",
      "意外保险",
      "SUP桨板×1",
      "充气游泳池×1",
      "钓鱼装备/浮潜装备",
    ],
    excludes: [
      "国家公园门票及岛屿入场费",
      "增值税",
      "9-20人每人加1,250 THB",
      "2次潜水（1,800 THB）",
    ],
    suppliers: [
      { name: "PL", price: 42500 },
    ],
    notes: [
      "8人起订，9-20人每人加1,250泰铢",
      "淡季(5-10月)价格更低：珊瑚岛半日31,250/拉查+拉查诺伊60,000",
      "旺季全年价：珊瑚岛半日37,500/拉查+拉查诺伊66,250",
      "含午餐+充气游泳池，性价比突出",
      "不含增值税，报价时需注意",
    ],
    faq: [
      { q: "最少几人可以订？", a: "最少8人起订，9-20人每人加1,250泰铢。" },
      { q: "有淡旺季价格差吗？", a: "有！淡季（5-10月）价格更低，例如珊瑚岛半日淡季31,250/旺季37,500泰铢。" },
      { q: "含午餐吗？", a: "含！午餐+水果小吃+软饮料全包，还有充气游泳池和SUP桨板。" },
      { q: "可以潜水吗？", a: "可以，2次潜水需额外支付1,800泰铢。" },
      { q: "最贵的航线是哪条？", a: "拉查亚岛+拉查诺伊或迈顿+凯岛，旺季66,250泰铢，适合追求新鲜感的客户。" },
    ],
    itinerary: "查龙码头小型货车接送 → 登船(09:00/14:00) → 巡游选定航线（珊瑚岛/迈顿/拉查岛等）→ 充气游泳池/SUP/浮潜/钓鱼 → 船上午餐 → 返航",
    materials: [
      "Amandla动力双体船实拍图7张",
      "小红书推广文案（含午餐充气泳池版）",
      "朋友圈推广文案",
      "淡旺季航线价格对比表",
      "抖音短视频脚本",
    ],
  },
  {
    id: 59, cat: "yacht", status: "avail",
    name: "Shangani 70英尺豪华双体船", nameEn: "Shangani 70ft Luxury Catamaran Phuket",
    emoji: "⛵",
    images: [
      "https://i.ibb.co/ZRP4ZrfC/1645801352-144-FAF9-C0-BBA7-4-C76-8-CAB-E37718-A940-C2.jpg",
      "https://i.ibb.co/kgCvjhpT/1645801352-227-D556-D0-7739-4-E43-B356-12714-DF0-F42-E.jpg",
      "https://i.ibb.co/kgVbVxWq/1645801352-429-A1-B55-B-6926-4741-989-C-146998-CE09-FA.jpg",
      "https://i.ibb.co/qFkSJ899/1645801352-3014-F3-D96-F030-4-F95-88-FB-B73234336-B20.jpg",
      "https://i.ibb.co/DD7YKCJn/1645802075-516-FD066-A-EB6-A-4868-95-CC-97129-ACEEA5-F.jpg",
      "https://i.ibb.co/nq0PqnPz/1645802075-654-A23359-1-D84-408-F-A699-46401-D8-F7-C07.jpg",
      "https://i.ibb.co/LzxBYd7N/1645802075-856-E631-F0-421-F-4583-8-D5-A-87148620-C884.jpg",
      "https://i.ibb.co/8gTdcdcy/1645802159-9-B75-B0-BBE-FF2-D-49-ED-BEBA-35-C2-EB76-F4-AE.jpg",
    ],
    desc: "Shangani 70英尺豪华双体船，含漂浮按摩浴缸+水肺潜水+每人6瓶啤酒（最多100瓶）+午餐+增值税。最多60人大型团建首选，旺季206,250/淡季187,500，过夜24H套餐可选。",
    retail: 190000, agent: 171000, cost: 161500,
    includes: [
      "往返码头陆路接送",
      "午餐",
      "软饮/水/冰块",
      "全套船员服务",
      "每位成人6瓶啤酒（最多100瓶）",
      "毛巾/保险/小吃/新鲜水果/迎宾饮品",
      "增值税",
      "充气滑梯/浮潜钓鱼装备/皮划艇/SUP桨板",
      "漂浮按摩浴缸/漂浮大垫/面条座椅",
      "水肺潜水（需提前预订）",
    ],
    excludes: [
      "国家公园门票",
      "船员小费",
      "燃油附加费（部分目的地）",
      "水下推进器（15,000 THB，需提前预订）",
      "按摩师（5,000 THB，需提前预订）",
      "21-30人每人加2,500 THB",
      "51-60人每人加2,500 THB",
      "皮皮岛燃油附加费（31,250 THB，仅过夜行程）",
    ],
    suppliers: [
      { name: "PL", price: 161500 },
    ],
    notes: [
      "旺季(11-4月)206,250/淡季(5-10月)187,500，以20人为基准",
      "大型团建31-50人235,000，51-60人每人再加2,500",
      "半日游全年122,500（20人），含啤酒最多50罐",
      "过夜24H：旺季243,750/淡季225,000（最多12成人+4儿童）",
      "注意：不提供皮皮岛一日游，皮皮岛需过夜+加31,250燃油附加费",
    ],
    faq: [
      { q: "最多坐几人？", a: "一日游最多60人（20人基准，21-60人每人加2,500），过夜最多12成人+4儿童。" },
      { q: "含啤酒吗？", a: "含！每位成人6瓶啤酒，一日游最多100瓶，半日游最多50罐。" },
      { q: "可以去皮皮岛吗？", a: "不提供皮皮岛一日游，须预订至少一晚过夜行程并加付31,250泰铢燃油附加费。" },
      { q: "有漂浮按摩浴缸吗？", a: "有！漂浮按摩浴缸是本船特色，还可加订按摩师上船（5,000泰铢）。" },
      { q: "可以水肺潜水吗？", a: "可以，需提前预订，包含在基本价格内。" },
    ],
    itinerary: "往返接送至码头 → 登船迎宾饮品 → 巡游朗艾/凯府/攀牙湾/纳卡等航线 → 漂浮按摩浴缸/水肺潜水/充气滑梯体验 → 船上午餐+啤酒 → 返航或过夜",
    materials: [
      "Shangani 70英尺豪华双体船实拍图8张",
      "小红书推广文案（含按摩浴缸大型团建版）",
      "朋友圈推广文案",
      "大型团建人数价格对比表",
      "过夜套餐专属方案",
    ],
  },
  {
    id: 58, cat: "yacht", status: "avail",
    name: "卡利普索泻湖440帆船双体船", nameEn: "Calypso Lagoon 440 Sailing Catamaran",
    emoji: "⛵",
    images: [
      "https://i.ibb.co/Z6GVqq10/1683094596-1.jpg",
      "https://i.ibb.co/Rk26LRJd/1683094596-2.jpg",
      "https://i.ibb.co/gZLGfMm4/1683094596-3.jpg",
      "https://i.ibb.co/KcXXZwwX/1683094596-4.jpg",
      "https://i.ibb.co/99T0zfJP/1683094596-5.jpg",
      "https://i.ibb.co/KzfjVT61/1683094596-6.jpg",
      "https://i.ibb.co/Y7nnQWBg/1683094596-7.jpg",
      "https://i.ibb.co/Z77h8tn/1683094596-8.jpg",
      "https://i.ibb.co/RT775LXS/1683094596-9.jpg",
    ],
    desc: "卡利普索泻湖440帆船双体船，4双人舱+2卧铺舱，最多25人。提供半日/全日多条航线，珊瑚岛/拉查岛/迈顿岛/普罗姆特普角日落均可选，含皮划艇+SUP桨板+钓鱼用具。春节期间40,000泰铢。",
    retail: 34000, agent: 30600, cost: 28900,
    includes: [
      "船长及船员",
      "软饮/时令水果",
      "浮潜面罩/救生衣",
      "手持式渔具/保险",
      "1艘皮划艇/1块SUP桨板",
    ],
    excludes: [
      "酒店接送",
      "酒精饮料",
      "国家公园门票",
      "7%增值税（公司账单需要时）",
      "超10人：成人加1,250/儿童(4-11岁)加1,000 THB",
      "额外皮划艇/SUP（875 THB各）",
      "脚蹼（250 THB）",
      "大型蹦床（1,875 THB）",
      "充气泳池（2,500 THB）",
      "春节附加费（2024年2月9-15日额外加6,000 THB）",
    ],
    suppliers: [
      { name: "PL", price: 28900 },
    ],
    notes: [
      "与喜悦泻湖440同价位，航线相同，可作备选船只推荐",
      "春节期间价格上涨至40,000泰铢，需提前告知客户",
      "半日游上午21,250-22,500/下午25,000-28,750",
      "全日游33,125-34,375",
      "最多25人，比喜悦泻湖440容量略小",
    ],
    faq: [
      { q: "最多坐几人？", a: "最多25人，以10人为基准，超出成人每人加1,250/儿童加1,000泰铢。" },
      { q: "春节期间价格会涨吗？", a: "是的，春节期间（2月9-15日）价格为40,000泰铢，需提前告知客户。" },
      { q: "有蹦床和充气泳池吗？", a: "可加选，大型蹦床1,875/充气泳池2,500泰铢，需提前预订。" },
      { q: "下午场可以看日落吗？", a: "可以！珊瑚岛+普罗姆特普角下午行程14:00-18:30，28,750泰铢。" },
      { q: "和喜悦泻湖440有什么区别？", a: "两船价格相同，容量略有差异（卡利普索25人 vs 喜悦35人），可根据团体大小灵活选择。" },
    ],
    itinerary: "查龙码头登船(09:00/10:00/14:00) → 巡游珊瑚岛/迈顿岛/拉查岛/普罗姆特普角等 → 浮潜/皮划艇/SUP/钓鱼 → 下午场含日落观景 → 返航",
    materials: [
      "卡利普索泻湖440实拍图9张",
      "小红书推广文案（灵活日落帆船版）",
      "朋友圈推广文案",
      "半日/全日航线价格对比表",
      "抖音短视频脚本",
    ],
  },
  {
    id: 57, cat: "yacht", status: "avail",
    name: "喜悦泻湖440帆船双体船", nameEn: "Delight Lagoon 440 Sailing Catamaran",
    emoji: "⛵",
    images: [
      "https://i.ibb.co/5h3ZSb9r/1706495930-1-SAILING-CATAMARAN-DELIGHT-LAGOON-440-002.jpg",
      "https://i.ibb.co/zHjZqrQ9/1706495930-2-SAILING-CATAMARAN-DELIGHT-LAGOON-440-003.jpg",
      "https://i.ibb.co/S7wksdWk/1706495930-3-SAILING-CATAMARAN-DELIGHT-LAGOON-440-004.jpg",
      "https://i.ibb.co/C3rM8D2X/1706495930-4-SAILING-CATAMARAN-DELIGHT-LAGOON-440-005.jpg",
      "https://i.ibb.co/X6hBmny/1706495930-5-SAILING-CATAMARAN-DELIGHT-LAGOON-440-006.jpg",
      "https://i.ibb.co/hRvcJ1nt/1706495930-6-SAILING-CATAMARAN-DELIGHT-LAGOON-440-007.jpg",
      "https://i.ibb.co/F4DJVgn2/1706495930-7-SAILING-CATAMARAN-DELIGHT-LAGOON-440-008.jpg",
      "https://i.ibb.co/S4F3BvmT/1706495930-8-SAILING-CATAMARAN-DELIGHT-LAGOON-440-009.jpg",
      "https://i.ibb.co/MyHKjhqH/1706495930-9-SAILING-CATAMARAN-DELIGHT-LAGOON-440-010.jpg",
    ],
    desc: "喜悦泻湖440帆船双体船，最多35人（建议20人），4双人舱+2上下铺，含全日游午餐+皮划艇+SUP桨板。提供半日/全日多条航线，珊瑚岛/拉查岛/迈顿岛/普罗姆特普角日落均可选。",
    retail: 34000, agent: 30600, cost: 28900,
    includes: [
      "船长及船员",
      "软饮/时令水果",
      "浮潜面罩/救生衣",
      "午餐（全天仅限一餐）",
      "手钓用具/保险",
      "1艘皮划艇/1块SUP桨板",
    ],
    excludes: [
      "酒店接送",
      "酒精饮料",
      "国家公园门票",
      "7%增值税（公司账单需要时）",
      "超10人：成人加1,250/儿童(4-11岁)加1,000 THB",
      "额外皮划艇/SUP（875 THB各）",
      "脚蹼（250 THB）",
      "大型蹦床（1,875 THB）",
      "充气泳池（2,500 THB）",
    ],
    suppliers: [
      { name: "PL", price: 28900 },
    ],
    notes: [
      "比波西米亚号略贵但含午餐，性价比更高",
      "半日游上午21,250-22,500/下午25,000-28,750",
      "全日游33,125-34,375，含午餐",
      "最多35人，适合中型团建及家庭出游",
      "餐饮灵活：可自带/船上点餐/岛上用餐",
    ],
    faq: [
      { q: "最多坐几人？", a: "最多35人（建议20人），以10人为基准，超出成人每人加1,250/儿童加1,000泰铢。" },
      { q: "全日游含午餐吗？", a: "含！全日游含一顿午餐，这是与同类帆船相比的差异化优势。" },
      { q: "有蹦床和充气泳池吗？", a: "可加选，大型蹦床1,875/充气泳池2,500泰铢，需提前预订。" },
      { q: "下午场可以看日落吗？", a: "可以！多条下午行程含普罗姆特普角日落，14:00-18:30。" },
      { q: "有客舱吗？", a: "有4个双人舱和2个上下铺，适合过夜行程（需另行咨询）。" },
    ],
    itinerary: "查龙码头登船(09:00/10:00/14:00) → 巡游珊瑚岛/迈顿岛/拉查岛/普罗姆特普角等 → 浮潜/皮划艇/SUP/钓鱼 → 船上午餐（全日游）→ 下午场含日落观景 → 返航",
    materials: [
      "喜悦泻湖440实拍图9张",
      "小红书推广文案（含午餐日落帆船版）",
      "朋友圈推广文案",
      "半日/全日航线价格对比表",
      "抖音短视频脚本",
    ],
  },
  {
    id: 56, cat: "yacht", status: "avail",
    name: "波西米亚号50英尺双体帆船", nameEn: "Bohemian 50ft Sailing Catamaran Phuket",
    emoji: "⛵",
    images: [
      "https://i.ibb.co/4ZcQTVCS/1687763251-1-IMG-0753.jpg",
      "https://i.ibb.co/wNrFbLgV/1687763251-2-IMG-0755.jpg",
      "https://i.ibb.co/Gvk0DLJ7/1687763251-3-IMG-0754.jpg",
      "https://i.ibb.co/PvkWGJvF/1687763251-4-IMG-0756.jpg",
      "https://i.ibb.co/gZf1SWSg/1687763251-5-IMG-0757.jpg",
      "https://i.ibb.co/RGBR0zmr/1687763251-6-IMG-0758.jpg",
      "https://i.ibb.co/Wvz3pmHz/1687763251-7-IMG-0759.jpg",
    ],
    desc: "波西米亚号50英尺双体帆船，最多35人，以10人为基准定价。提供半日/全日多条航线，含珊瑚岛/迈顿岛/拉查岛/普罗姆特普角日落等，含皮划艇+SUP桨板+钓鱼用具。",
    retail: 30000, agent: 27000, cost: 25500,
    includes: [
      "船票及船员",
      "软饮/时令水果",
      "浮潜面罩/救生衣",
      "手持式钓鱼用具",
      "保险",
      "1艘皮划艇/1块SUP桨板",
    ],
    excludes: [
      "超10人：成人加1,000/儿童(4-11岁)加625 THB",
      "额外皮划艇（875 THB）/额外SUP（875 THB）",
      "脚蹼（250 THB）",
      "大型蹦床（1,875 THB）",
      "充气泳池（2,500 THB）",
      "交通接送（可应要求提供）",
      "餐食（可船上点餐/自带/岛上用餐）",
    ],
    suppliers: [
      { name: "PL", price: 25500 },
    ],
    notes: [
      "基准10人，成人超出每人加1,000/儿童加625，最多35人",
      "半日游上午16,250-18,750/下午21,250-23,750",
      "全日游29,375-32,500，拉查+珊瑚+日落最热门",
      "可按需加选蹦床/充气泳池/额外水上玩具",
      "餐饮灵活：可自带/船上点餐/岛上用餐",
    ],
    faq: [
      { q: "最多坐几人？", a: "最多35人，以10人为基准，超出成人每人加1,000泰铢，4-11岁儿童加625泰铢。" },
      { q: "可以带自己的食物吗？", a: "可以！餐饮非常灵活，可自带、船上点餐或在岛上用餐。" },
      { q: "有蹦床吗？", a: "可加选！大型蹦床1,875泰铢，充气泳池2,500泰铢，需提前预订。" },
      { q: "下午场可以看日落吗？", a: "可以！多条下午行程含普罗姆特普角日落，14:00-19:00，价格21,250-23,750泰铢。" },
      { q: "全日游最受欢迎的航线？", a: "拉查岛+珊瑚岛+普罗姆特普角32,500泰铢，兼顾浮潜、海岛和日落，性价比最高。" },
    ],
    itinerary: "查龙码头登船(09:00/10:00/14:00) → 巡游珊瑚岛/迈顿岛/拉查岛/普罗姆特普角等 → 浮潜/皮划艇/SUP/钓鱼 → 下午场含日落观景 → 返航",
    materials: [
      "波西米亚号实拍图7张",
      "小红书推广文案（灵活餐饮日落帆船版）",
      "朋友圈推广文案",
      "半日/全日航线价格对比表",
      "抖音短视频脚本",
    ],
  },
  {
    id: 55, cat: "yacht", status: "avail",
    name: "Estrella 43英尺动力双体帆船", nameEn: "Estrella 43ft Power Catamaran",
    emoji: "⛵",
    images: [
      "https://i.ibb.co/1tFsGqPW/1704688882-1-CATAMARAN-ESTRELLA-001.jpg",
      "https://i.ibb.co/Cp81NJyx/1704688882-2-DJI-0200.jpg",
      "https://i.ibb.co/F4qZXXLy/1704688882-3-EST01.jpg",
      "https://i.ibb.co/wTCRGFD/1704689049-42-S5-A3759.jpg",
      "https://i.ibb.co/W4Dn9Y3n/1704689136-52-S5-A3767.jpg",
      "https://i.ibb.co/gZtnkpBN/1704689263-62-S5-A3808.jpg",
      "https://i.ibb.co/CKt3PgD2/1704689336-7-EST09.jpg",
      "https://i.ibb.co/70K4Tf4/1704689336-8-EST24.jpg",
      "https://i.ibb.co/1tmdPdFq/1704689336-9-EST08.jpg",
    ],
    desc: "Estrella 43英尺2019年新造动力双体帆船，3间客舱2浴室，最多18人，含烧烤台+飞桥日光浴平台+全空调。全年统一价，含午餐+往返接送+海洋公园，以8人为基准定价。",
    retail: 170000, agent: 153000, cost: 144500,
    includes: [
      "往返接送",
      "岛屿费及海洋国家公园",
      "保险",
      "小吃/午餐/饮用水/软饮料/新鲜水果",
      "音响系统/全空调/沙龙/飞桥",
      "8马力附属艇/厨房",
      "前甲板日光浴垫/烧烤台",
      "2块SUP桨板/皮划艇/水上玩具",
    ],
    excludes: [
      "超8人每人加3,125 THB（最多18人）",
      "酒水",
      "水肺潜水（需另付费）",
    ],
    suppliers: [
      { name: "PL", price: 144500 },
    ],
    notes: [
      "全年统一价，半日148,750/全日173,750（无淡旺季之分）",
      "基准8人，超出每人加3,125，最多18人",
      "2019年新造，配备烧烤台+飞桥，适合派对及家庭聚会",
      "含午餐+往返接送+海洋公园门票，全包价格透明",
      "可航行甲米/攀牙湾/拉差/珊瑚岛/迈通/皮皮岛",
    ],
    faq: [
      { q: "最多坐几人？", a: "基准8人，超出每人加3,125泰铢，最多18人。" },
      { q: "价格全年统一吗？", a: "是！全年统一价，半日148,750/全日173,750，无淡旺季差价，预算好规划。" },
      { q: "含午餐和接送吗？", a: "含！往返接送+午餐+饮料+水果+海洋公园门票全包。" },
      { q: "有烧烤设施吗？", a: "有！配备烧烤台，适合聚会派对，飞桥日光浴平台也是热门拍照打卡区。" },
      { q: "可以去哪些地方？", a: "甲米、攀牙湾、拉差岛、凯府、珊瑚岛、迈通岛、皮皮岛均可。" },
    ],
    itinerary: "往返接送至码头 → 登船(10:00) → 巡游甲米/攀牙湾/拉差/珊瑚岛/皮皮岛等 → 浮潜/皮划艇/烧烤/飞桥日光浴 → 船上午餐 → 返航(18:00)",
    materials: [
      "Estrella 43实拍图9张",
      "小红书推广文案（2019新船烧烤飞桥版）",
      "朋友圈推广文案",
      "半日/全日游价格对比表",
      "抖音短视频脚本",
    ],
  },
  {
    id: 54, cat: "yacht", status: "avail",
    name: "Ooseven Lagoon 56英尺帆船", nameEn: "Ooseven Lagoon 56 Sailing Catamaran",
    emoji: "⛵",
    images: [
      "https://i.ibb.co/FbynJTjg/1705630647-1-SAILING-CATAMARAN-OOSEVEN-LAGOON-56-001.jpg",
      "https://i.ibb.co/C5pqTXQL/1705630725-2-SAILING-CATAMARAN-OOSEVEN-LAGOON-56-010.jpg",
      "https://i.ibb.co/fVxZtc8c/1705630725-3-SAILING-CATAMARAN-OOSEVEN-LAGOON-56-002.jpg",
      "https://i.ibb.co/fd4hWLy3/1705630725-4-SAILING-CATAMARAN-OOSEVEN-LAGOON-56-004.jpg",
      "https://i.ibb.co/gLzyqKsQ/1705630725-5-SAILING-CATAMARAN-OOSEVEN-LAGOON-56-003.jpg",
      "https://i.ibb.co/HLqBkyPs/1705630725-6-SAILING-CATAMARAN-OOSEVEN-LAGOON-56-005.jpg",
      "https://i.ibb.co/HfGJ2tRJ/1705630774-8-SAILING-CATAMARAN-OOSEVEN-LAGOON-56-008.jpg",
      "https://i.ibb.co/q3H7hK1N/1705630774-9-SAILING-CATAMARAN-OOSEVEN-LAGOON-56-009.jpg",
    ],
    desc: "Ooseven Lagoon 56英尺豪华帆船双体船，5间客舱最多20人，含潜水压缩机+10个气瓶+4G无线网络+Nespresso咖啡机。提供半日/全日游及定制斯米兰群岛/安达曼群岛行程，含午餐。",
    retail: 70000, agent: 63000, cost: 59500,
    includes: [
      "迎宾饮品/软饮/水果/小吃",
      "午餐",
      "浮潜装备（呼吸管/面镜/脚蹼）",
      "4块SUP桨板/钓鱼用具",
      "燃油（4小时航程）",
      "面包车接送",
      "国家公园门票",
      "服务人员/沙滩巾/冷毛巾",
      "潜水压缩机+10个气瓶（使用需另付费）",
      "全套帆船索具/空调/4G无限网络/Nespresso咖啡机",
    ],
    excludes: [
      "酒水",
      "水肺潜水装备（需另付费）",
      "超10人：成人1,500/儿童750 THB（最多20人）",
      "搬迁费（查龙码头12,500/普吉西海岸37,500）",
      "半日游：淡季65,000/旺季75,000/高峰82,500",
      "全日游：淡季131,250/旺季150,000/高峰167,500",
    ],
    suppliers: [
      { name: "PL", price: 59500 },
    ],
    notes: [
      "含潜水压缩机+10个气瓶，是少有配备潜水设施的帆船",
      "可定制斯米兰群岛/安达曼群岛南部/甲米/董里等远程行程",
      "Ao Por出发，10:00-18:00",
      "三档定价：淡季/旺季/高峰季（半日和全日均分档）",
      "Nespresso咖啡机+4G网络，豪华配置",
    ],
    faq: [
      { q: "最多坐几人？", a: "基准10人，超出成人加1,500/儿童加750泰铢，最多20人。" },
      { q: "可以潜水吗？", a: "可以！船上配备潜水压缩机和10个气瓶，使用需额外付费。水肺装备也需另付。" },
      { q: "可以去斯米兰群岛吗？", a: "可以！提供定制游轮行程前往斯米兰群岛、安达曼群岛南部等，请提前咨询。" },
      { q: "价格分几个档次？", a: "分淡季(5-10月)/旺季(11-4月)/高峰季(12.15-1.15)三档，半日65,000起，全日131,250起。" },
      { q: "含午餐吗？", a: "含！每日包船含午餐、迎宾饮品、水果小吃，不含酒水。" },
    ],
    itinerary: "面包车接送至Ao Por码头(10:00) → 迎宾饮品+小吃 → 巡游选定航线 → 浮潜/SUP桨板/潜水体验 → 船上午餐 → 返航(18:00)",
    materials: [
      "Ooseven Lagoon 56实拍图8张",
      "小红书推广文案（含潜水豪华帆船版）",
      "朋友圈推广文案",
      "斯米兰群岛定制行程介绍",
      "抖音短视频脚本",
    ],
  },
  {
    id: 53, cat: "yacht", status: "avail",
    name: "野猫号双体帆船", nameEn: "Wildcat Catamaran Phuket Chalong",
    emoji: "⛵",
    images: [
      "https://i.ibb.co/MjsJ06C/1706175901-1-LINE-ALBUM-22.jpg",
      "https://i.ibb.co/Xx1ytptY/1706175901-2-LINE-ALBUM-16.jpg",
      "https://i.ibb.co/v6LhgQGy/1706175901-3-LINE-ALBUM-1.jpg",
      "https://i.ibb.co/KxyYBB7z/1706175901-4-LINE-ALBUM-2.jpg",
      "https://i.ibb.co/fYXHy86j/1706175901-5-LINE-ALBUM-19.jpg",
      "https://i.ibb.co/bjSGGFKx/1706175901-6-LINE-ALBUM-18.jpg",
      "https://i.ibb.co/mr2DxMXR/1706175901-7-LINE-ALBUM-8.jpg",
      "https://i.ibb.co/sdVrBRN7/1706175901-8-LINE-ALBUM-5.jpg",
      "https://i.ibb.co/Kxhj9gdR/1706175901-9-LINE-ALBUM-17.jpg",
    ],
    desc: "野猫号双体帆船，查龙出发，最多35人，航线最丰富！提供攀牙湾/皮皮岛/珊瑚岛/拉查岛/迈顿岛/凯岛/日落等10+条航线，含桨板+皮划艇+充气浮板，灵活定制出海体验。",
    retail: 22000, agent: 19800, cost: 18700,
    includes: [
      "浮潜装备（面罩及呼吸管）",
      "意外保险/救生衣",
      "桨板/皮划艇/充气浮板",
    ],
    excludes: [
      "餐食",
      "接送服务（1,875-2,500 THB）",
      "导游（1,250-2,500 THB）",
      "摄影师（3,750-6,250 THB）",
      "空调（3,125 THB）",
      "水上滑梯（3,125 THB）",
      "国家公园门票",
      "长尾船",
      "岛屿费用（100-500 THB/人）",
    ],
    suppliers: [
      { name: "PL", price: 18700 },
    ],
    notes: [
      "航线最丰富，10+条路线可选，从13,750到47,500泰铢不等",
      "最便宜：半日珊瑚岛上午13,750",
      "最贵：皮皮岛全天47,500",
      "日落行程16:30-20:00，普罗姆帖海角日落17,500",
      "空调/水上滑梯/摄影师均可按需加选",
    ],
    faq: [
      { q: "有多少条航线可选？", a: "超过10条航线，从半日珊瑚岛（13,750）到皮皮岛全天（47,500），攀牙湾/拉查+珊瑚+日落等均可选。" },
      { q: "最多坐几人？", a: "最多35人。" },
      { q: "含空调吗？", a: "不含，需额外加收3,125泰铢，可按需选配。" },
      { q: "可以看日落吗？", a: "有日落专属行程！普罗姆帖海角日落16:30-20:00，17,500泰铢；拉查+珊瑚+日落23,750泰铢。" },
      { q: "含餐食吗？", a: "不含，导游和接送均需另付费，可按需选配。" },
    ],
    itinerary: "查龙码头登船(09:00/08:30/14:00/16:30) → 根据所选航线巡游 → 浮潜/桨板/皮划艇体验 → 可选日落观景 → 返航",
    materials: [
      "野猫号双体帆船实拍图9张",
      "小红书推广文案（多航线灵活选择版）",
      "朋友圈推广文案",
      "10+条航线价格对比表",
      "抖音短视频脚本",
    ],
  },
  {
    id: 52, cat: "yacht", status: "avail",
    name: "海洋之梦40英尺双体帆船", nameEn: "Ocean Dream 40ft Catamaran Ao Por",
    emoji: "⛵",
    images: [
      "https://i.ibb.co/Z6Cf3sT9/1706759123-1003.jpg",
      "https://i.ibb.co/YBWDGdDf/1706759123-2004.jpg",
      "https://i.ibb.co/RpVhw8bh/1706759123-3025.jpg",
      "https://i.ibb.co/ccvbY8qw/1706759123-4022.jpg",
      "https://i.ibb.co/Hfpg2TtT/1706759123-5023.jpg",
      "https://i.ibb.co/vvKSmgJw/1706759123-6006.jpg",
      "https://i.ibb.co/B514tS7v/1706759123-7011.jpg",
    ],
    desc: "海洋之梦40英尺双体帆船，Ao Por出发，最多10人，2间私人舱室2浴室，含英语导游+底钓装备+浮潜。可选凯诺岛浮潜钓鱼或攀牙湾詹姆斯邦德岛，可携带酒精饮料上船。",
    retail: 21250, agent: 19125, cost: 18062,
    includes: [
      "船长/船员/英语导游",
      "瓶装饮用水/软饮料",
      "小吃及水果",
      "救生衣（成人及儿童尺寸）",
      "浮潜装备",
      "底钓装备（3套）",
      "旅游保险/船上毛巾",
      "2间私人舱室/2间带淋浴浴室",
      "厨房餐桌/手机充电器/蓝牙音箱",
      "往返海滩及浮潜点橡皮艇",
    ],
    excludes: [
      "酒店往返交通（2,000 THB）",
      "午餐套餐",
      "攀牙湾国家公园门票",
      "皮划艇服务（375 THB/人）",
      "超6人每人加1,250 THB（最多10人）",
    ],
    suppliers: [
      { name: "PL", price: 18062 },
    ],
    notes: [
      "允许携带酒精饮料上船，对中国客户非常友好",
      "基准6人21,250，超出每人加1,250，最多10人",
      "两条航线可选：凯诺岛（浮潜+底钓）或攀牙湾+詹姆斯邦德岛（观光+独木舟）",
      "2间私人舱室+2浴室，适合小家庭或情侣",
      "Ao Por出发，普吉岛东北部最方便",
    ],
    faq: [
      { q: "最多坐几人？", a: "基准6人，第7人起每人加1,250泰铢，最多10人。" },
      { q: "可以带酒上船吗？", a: "可以！允许携带酒精饮料上船，是本船的特色之一。" },
      { q: "有哪两条航线？", a: "1）凯诺岛：浮潜、沙滩、底钓烤鱼；2）攀牙湾+詹姆斯邦德岛：观光、独木舟、探索泻湖。" },
      { q: "有私人舱室吗？", a: "有2间私人舱室和2间带淋浴的浴室，适合希望有私密空间的客户。" },
      { q: "含午餐吗？", a: "不含，午餐套餐需另付。但可在船上自行钓鱼烹饪新鲜烤鱼！" },
    ],
    itinerary: "Ao Por Grand Marina登船(09:30) → 巡游凯诺岛或攀牙湾/詹姆斯邦德岛 → 浮潜/底钓/独木舟体验 → 船上休闲 → 返航(17:00)",
    materials: [
      "海洋之梦双体帆船实拍图7张",
      "小红书推广文案（可带酒私密小船版）",
      "朋友圈推广文案",
      "两条航线对比介绍",
      "抖音短视频脚本",
    ],
  },
  {
    id: 51, cat: "yacht", status: "avail",
    name: "Aquila日出44双体船", nameEn: "Aquila Sunrise 44 Catamaran Phuket",
    emoji: "⛵",
    images: [
      "https://i.ibb.co/7tBNM3f3/1706762167-1-Aquila23.jpg",
      "https://i.ibb.co/n8mwzTvd/1706762689-2-Aquila01.jpg",
      "https://i.ibb.co/FLc4bymh/1706762689-3-Aquila02.jpg",
      "https://i.ibb.co/8grHswgH/1706763047-4-Aquila04.jpg",
      "https://i.ibb.co/LzPqddvD/1706763047-5-Aquila29.jpg",
      "https://i.ibb.co/wFD2DzN3/1706763079-6-Aquila35.jpg",
      "https://i.ibb.co/0ytJ7RZH/1706763079-7-Aquila42.jpg",
      "https://i.ibb.co/mVhfTjKZ/1706763157-8-Aquila48.jpg",
      "https://i.ibb.co/zTQd315T/1706763157-9-Aquila59.jpg",
    ],
    desc: "Aquila日出44双体船，3间VIP舱，最多15人。含泰式午餐+大型滑梯+桨板+独木舟+浮潜+钓鱼。提供日游/多日豪华套餐，夏季87,500至高峰季134,250，2天1夜至1周均可。",
    retail: 87500, agent: 78750, cost: 74375,
    includes: [
      "专业船长/船员/服务员",
      "热带时令水果/小吃",
      "泰式午餐（日游）",
      "软饮（水/可乐/苏打水/橙汁/冰块）",
      "毛巾/救生衣/旅行保险",
      "大型滑梯/2根桨板/漂浮垫/独木舟",
      "浮潜设备/钓鱼用具",
    ],
    excludes: [
      "国家公园门票（日游）",
      "往返交通",
      "超8小时费用（10,000 THB/小时）",
      "7%增值税",
      "拉差诺岛/甲米四岛附加费（+12,500 THB）",
      "兰塔岛附加费（+31,250 THB）",
      "过夜套餐：船上餐饮及厨师",
    ],
    suppliers: [
      { name: "PL", price: 74375 },
    ],
    notes: [
      "三档定价：夏季(5-9月)87,500/旺季(10-4月)111,750/高峰季(12.20-1.20)134,250",
      "过夜套餐：2天1夜175,000-257,050/1周597,500-850,000（视季节）",
      "3间VIP舱最多15人，私密感强适合蜜月/家庭",
      "含泰式午餐是差异化卖点",
      "过夜含酒店至码头往返交通+国家公园门票",
    ],
    faq: [
      { q: "最多坐几人？", a: "3间VIP舱，基准10人，11-15人每人加2,250泰铢。" },
      { q: "价格含午餐吗？", a: "日游含泰式午餐，过夜套餐不含船上餐饮及厨师（需另付）。" },
      { q: "可以多日游吗？", a: "支持2天1夜至1周豪华套餐，夏季175,000至高峰季850,000泰铢。" },
      { q: "可以去兰塔岛吗？", a: "可以，需加收31,250泰铢附加费，甲米四岛加12,500泰铢。" },
      { q: "价格含增值税吗？", a: "不含7%增值税，报价时需另加。" },
    ],
    itinerary: "往返接送至码头 → 登船 → 巡游拉查岛/攀牙湾/甲米四岛等 → 大型滑梯/独木舟/浮潜/钓鱼 → 泰式午餐 → 返航或过夜",
    materials: [
      "Aquila日出44实拍图9张",
      "小红书推广文案（VIP舱多日游版）",
      "朋友圈推广文案",
      "季节价格+多日套餐对比表",
      "抖音短视频脚本",
    ],
  },
  {
    id: 50, cat: "yacht", status: "avail",
    name: "超级马里奥Indigo 53动力双体船", nameEn: "Super Mario Indigo 53 Power Catamaran",
    emoji: "⛵",
    images: [
      "https://i.ibb.co/kVSywkW9/1707021135-1-Indigo53.jpg",
      "https://i.ibb.co/vC0DRTJk/1707021772-2-Indigo53-1.jpg",
      "https://i.ibb.co/9H0RzHCb/1707021828-3-Indigo53-2.jpg",
      "https://i.ibb.co/hJHc5Bpy/1707021828-4005.jpg",
      "https://i.ibb.co/Fq3jpwT1/1707022092-52nd-floor.jpg",
      "https://i.ibb.co/VWYxnNhq/1707022092-62nd-floor.jpg",
      "https://i.ibb.co/PsxnTxwL/1707022180-8-Inside-the-boat.jpg",
      "https://i.ibb.co/yBMsfTKf/1707022180-9-Second-class-of-ships.jpg",
      "https://i.ibb.co/BKQ0MNbr/1707022180-72nd-floor.jpg",
    ],
    desc: "超级马里奥Indigo 53动力双体船，查龙出发，最多55人，8小时包船含自助餐+浮潜+充气滑梯+皮划艇+增值税。可达拉查岛/珊瑚岛/皮皮岛/攀牙湾，1-15人75,900泰铢起。",
    retail: 75900, agent: 68310, cost: 64515,
    includes: [
      "8小时包船",
      "一顿自助餐",
      "非酒精饮料/时令水果/小吃",
      "浮潜用具/救生衣",
      "充气滑梯/皮划艇",
      "保险",
      "查龙码头泊位费",
      "增值税",
      "上述目的地燃油",
    ],
    excludes: [
      "酒店接送",
      "国家公园门票及岛屿入场费",
      "毛巾",
      "烧烤（250 THB/人，最少10人起）",
      "超15人每人加1,250 THB",
      "超8小时每小时加5,000 THB（最多10小时）",
      "长途附加费（竹子岛6,250/詹姆斯邦德岛12,500/甲米18,750/阁哈岛43,750）",
    ],
    suppliers: [
      { name: "PL", price: 64515 },
    ],
    notes: [
      "与Mario兄弟Indigo 53为同型船，价格更低（75,900 vs 88,900）",
      "1-15人75,900，超出每人加1,250，最多55人",
      "最早09:00出发，最晚18:30返航",
      "含增值税及查龙码头泊位费，报价透明",
      "可延伸至甲米/詹姆斯邦德岛/阁哈岛，需加收长途附加费",
    ],
    faq: [
      { q: "和Mario兄弟Indigo 53有什么区别？", a: "同型船，超级马里奥价格更低（75,900 vs 88,900），可根据预算灵活选择。" },
      { q: "最多坐几人？", a: "最多55人，1-15人75,900泰铢，超出每人加1,250泰铢。" },
      { q: "含餐食吗？", a: "含一顿自助餐、非酒精饮料、时令水果和小吃。" },
      { q: "可以去皮皮岛/甲米吗？", a: "可以，需加收长途附加费：竹子岛6,250/詹姆斯邦德岛12,500/甲米18,750泰铢。" },
      { q: "有半日游吗？", a: "不提供半日包船，最短8小时，可延长至最多10小时，每小时加5,000泰铢。" },
    ],
    itinerary: "查龙码头登船(09:00) → 巡游拉查岛/珊瑚岛/迈通岛/皮皮岛等 → 充气滑梯/皮划艇/浮潜体验 → 自助餐 → 返航(最晚18:30)",
    materials: [
      "超级马里奥Indigo 53实拍图9张",
      "小红书推广文案（超值大船版）",
      "朋友圈推广文案",
      "与Mario兄弟价格对比表",
      "抖音短视频脚本",
    ],
  },
  {
    id: 49, cat: "yacht", status: "avail",
    name: "Fortuna Happy双体船", nameEn: "Fortuna Happy Yacht Charter Phuket",
    emoji: "⛵",
    images: [
      "https://i.ibb.co/219yQcbw/1706770492-1-YACTH-Fortuna-Happy-Yacht-Charter-001.jpg",
      "https://i.ibb.co/pBWYQqJD/1706770525-2-YACTH-Fortuna-Happy-Yacht-Charter-010.jpg",
      "https://i.ibb.co/yFzSqyyr/1706770525-3-YACTH-Fortuna-Happy-Yacht-Charter-008.jpg",
      "https://i.ibb.co/TMrm6mXK/1706770559-4-YACTH-Fortuna-Happy-Yacht-Charter-002.jpg",
      "https://i.ibb.co/0j89hwqK/1706770559-5-YACTH-Fortuna-Happy-Yacht-Charter-005.jpg",
      "https://i.ibb.co/8nDY7SJd/1706770559-6-YACTH-Fortuna-Happy-Yacht-Charter-006.jpg",
      "https://i.ibb.co/cSv0r3vh/1706770605-7-YACTH-Fortuna-Happy-Yacht-Charter-009.jpg",
      "https://i.ibb.co/21DRwVzK/1706770605-8-YACTH-Fortuna-Happy-Yacht-Charter-007.jpg",
      "https://i.ibb.co/6cxMxYKf/1706770605-9-YACTH-Fortuna-Happy-Yacht-Charter-003.jpg",
    ],
    desc: "Fortuna Happy双体船，查龙出发，最多50人，提供6/8/10小时灵活包船。含桨板+皮划艇+充气泳池+水上滑梯+浮潜装备，皮皮岛10小时81,250泰铢，旺季加12,500泰铢。",
    retail: 51000, agent: 45900, cost: 43350,
    includes: [
      "船长及船员",
      "热带水果/软饮/冰块",
      "1块桨板/1艘皮划艇",
      "1个充气泳池（8小时及以上）",
      "1个水上滑梯",
      "浮潜面罩/毛巾",
      "蓝牙音响系统",
      "意外保险",
    ],
    excludes: [
      "岛屿门票",
      "出租车往返码头",
      "午餐",
      "7%增值税",
      "31-50人超员费（937-1,875 THB/人，视行程）",
      "旺季/春节附加费（12.15-2.15加12,500 THB）",
      "超时费（6,250 THB/小时）",
    ],
    suppliers: [
      { name: "PL", price: 43350 },
    ],
    notes: [
      "6小时39,375/8小时50,625/皮皮岛10小时81,250",
      "旺季及春节（12.15-2.15）所有行程加12,500泰铢",
      "31-50人超员每人加937-1,875泰铢",
      "预订需50%定金，余款出发前付清",
      "不含7%增值税，报价时需注意",
    ],
    faq: [
      { q: "有哪些行程时长？", a: "6小时39,375/8小时50,625/皮皮岛10小时81,250泰铢，超时每小时加6,250。" },
      { q: "旺季要加钱吗？", a: "是的，12月15日至2月15日旺季及春节期间，所有行程加收12,500泰铢。" },
      { q: "最多坐几人？", a: "标准30人，31-50人需每人加收937-1,875泰铢（视行程）。" },
      { q: "含午餐吗？", a: "不含，但含热带水果、软饮和冰块。可自行安排午餐或另外订购。" },
      { q: "价格含增值税吗？", a: "不含7%增值税，报价时需另加。" },
    ],
    itinerary: "查龙码头登船 → 巡游选定航线（珊瑚岛/拉查岛/皮皮岛等）→ 桨板/皮划艇/充气泳池/水上滑梯体验 → 浮潜 → 返航",
    materials: [
      "Fortuna Happy双体船实拍图9张",
      "小红书推广文案（灵活包船版）",
      "朋友圈推广文案",
      "6/8/10小时价格对比表",
      "抖音短视频脚本",
    ],
  },
  {
    id: 48, cat: "yacht", status: "avail",
    name: "Mario兄弟Indigo 53动力双体船", nameEn: "Mario's Brother Indigo 53 Power Catamaran",
    emoji: "⛵",
    images: [
      "https://i.ibb.co/CZ0bfpc/1707023719-1-S-2965514-0.jpg",
      "https://i.ibb.co/gLknZXGd/1707023719-2-S-3022887-0.jpg",
      "https://i.ibb.co/sdcxWM0s/1707023719-3-S-3022870-0.jpg",
      "https://i.ibb.co/q38Vyz1p/1707023782-4-S-3022879-0.jpg",
      "https://i.ibb.co/xtQMgQDG/1707023782-5-S-3022886-0.jpg",
      "https://i.ibb.co/tp2SthMt/1707023782-7-S-3022853-0.jpg",
      "https://i.ibb.co/rG7c1hzb/1707023782-8-S-3022856-0.jpg",
    ],
    desc: "Mario兄弟Indigo 53动力双体船，查龙出发，最多55人，8小时包船含自助餐+浮潜+充气滑梯+皮划艇+增值税。可达拉查岛/珊瑚岛/皮皮岛/攀牙湾等多条航线，1-15人88,900泰铢起。",
    retail: 88000, agent: 79200, cost: 74800,
    includes: [
      "8小时包船",
      "一顿自助餐",
      "非酒精饮料/时令水果/小吃",
      "浮潜用具/救生衣",
      "充气滑梯/皮划艇",
      "保险",
      "查龙码头泊位费",
      "增值税",
      "上述目的地燃油",
    ],
    excludes: [
      "酒店接送",
      "国家公园门票及岛屿入场费",
      "毛巾",
      "烧烤（250 THB/人，最少10人起）",
      "超15人每人加1,250 THB",
      "超8小时每小时加5,000 THB（最多10小时）",
      "长途附加费（竹子岛6,250/詹姆斯邦德岛12,500/甲米18,750/阁哈岛43,750）",
    ],
    suppliers: [
      { name: "PL", price: 74800 },
    ],
    notes: [
      "1-15人88,900，超出每人加1,250，最多55人",
      "最早09:00出发，最晚18:30返航",
      "含增值税及查龙码头泊位费，报价透明",
      "不提供半日包船，仅全天8小时起",
      "可延伸至甲米/詹姆斯邦德岛/阁哈岛，需加收长途附加费",
    ],
    faq: [
      { q: "最多坐几人？", a: "最多55人，1-15人88,900泰铢，超出每人加1,250泰铢。" },
      { q: "含餐食吗？", a: "含一顿自助餐、非酒精饮料、时令水果和小吃。" },
      { q: "可以去皮皮岛/甲米吗？", a: "可以，但需加收长途附加费：竹子岛6,250/詹姆斯邦德岛12,500/甲米18,750泰铢。" },
      { q: "有半日游吗？", a: "不提供半日包船，最短8小时全天。可延长至最多10小时，每小时加5,000泰铢。" },
      { q: "价格含增值税吗？", a: "含！同时包含查龙码头泊位费，报价透明。" },
    ],
    itinerary: "查龙码头登船(09:00) → 巡游拉查岛/珊瑚岛/迈通岛/皮皮岛等 → 充气滑梯/皮划艇/浮潜体验 → 自助餐 → 返航(最晚18:30)",
    materials: [
      "Indigo 53动力双体船实拍图7张",
      "小红书推广文案（全包自助餐版）",
      "朋友圈推广文案",
      "多航线长途附加费价格表",
      "抖音短视频脚本",
    ],
  },
  {
    id: 47, cat: "yacht", status: "avail",
    name: "Shashani豹式43英尺双体船", nameEn: "Shashani Leopard 43 Catamaran Phuket",
    emoji: "⛵",
    images: [
      "https://i.ibb.co/rXCRL6P/1709550878-1-IMG-1965.jpg",
      "https://i.ibb.co/gMLDd82C/1709550878-2-IMG-1966.jpg",
      "https://i.ibb.co/B2JvXXBJ/1709550878-3-IMG-1964.png",
      "https://i.ibb.co/RTC934v5/1709550878-4-IMG-1967.jpg",
      "https://i.ibb.co/0Vd3nJDS/1709550878-6-IMG-1968.jpg",
      "https://i.ibb.co/fGr3ZSkP/1709550878-7-IMG-1969.jpg",
      "https://i.ibb.co/Qyt1ZWz/1709550878-8-IMG-1970.jpg",
      "https://i.ibb.co/DfXL4HMm/1709550878-9-IMG-1971.jpg",
    ],
    desc: "Shashani豹式Leopard 43英尺双体船，含午餐+啤酒（每人6瓶）+漂浮按摩浴缸+水肺潜水，以10人为基准定价。提供半日/全日/过夜多种套餐，攀牙湾/纳卡/朗艾等多条航线。",
    retail: 120000, agent: 108000, cost: 102000,
    includes: [
      "往返码头陆路交通",
      "午餐",
      "软饮/水/冰块",
      "全套船员服务",
      "每位成人每天6瓶啤酒（最多60瓶）",
      "毛巾/保险/小吃/新鲜水果/迎宾饮品",
      "增值税",
      "充气滑梯/浮潜钓鱼装备/皮划艇/SUP桨板/漂浮按摩浴缸/浮垫",
      "水肺潜水（需提前预订）",
    ],
    excludes: [
      "国家公园门票",
      "船员小费",
      "燃油附加费（部分目的地）",
      "海上充气艇（15,000 THB，需提前预订）",
      "按摩师（5,000 THB，需提前预订）",
      "11-15人每人加2,500 THB（一日游）",
      "11-20人每人加2,500 THB（半日游）",
    ],
    suppliers: [
      { name: "PL", price: 102000 },
    ],
    notes: [
      "一日游价格：11.1-12.14及1.16-10.31均91,250；12.15-1.15旺季103,750",
      "半日游全年68,750（最多10人，11-20人每人加2,500）",
      "过夜24H：淡旺季140,000/高峰156,250（最多6人）",
      "含漂浮按摩浴缸是极差异化卖点",
      "可加按摩师上船（5,000泰铢），适合豪华蜜月推荐",
    ],
    faq: [
      { q: "有漂浮按摩浴缸吗？", a: "有！漂浮按摩浴缸是本船独特亮点，还可加订按摩师上船服务（5,000泰铢）。" },
      { q: "含啤酒吗？", a: "含！每位成人每天6瓶啤酒，最多60瓶，非常适合朋友聚会。" },
      { q: "最多坐几人？", a: "一日游基准10人（11-15人每人加2,500），半日游基准10人（11-20人每人加2,500）。" },
      { q: "可以水肺潜水吗？", a: "可以！需提前预订，水肺潜水包含在基本价格内。" },
      { q: "可以过夜吗？", a: "支持24小时过夜包船，最多6人，淡旺季140,000/高峰156,250泰铢。" },
    ],
    itinerary: "往返接送至码头 → 登船迎宾饮品 → 巡游攀牙湾/纳卡/朗艾等航线 → 浮潜/水肺潜水/SUP桨板 → 漂浮按摩浴缸体验 → 船上午餐+啤酒 → 返航",
    materials: [
      "Shashani豹式双体船实拍图8张",
      "小红书推广文案（漂浮按摩浴缸版）",
      "朋友圈推广文案",
      "半日/全日/过夜套餐价格表",
      "抖音短视频脚本",
    ],
  },
  {
    id: 46, cat: "yacht", status: "avail",
    name: "REAL 2豹式39英尺帆船", nameEn: "REAL 2 Leopard 39 Catamaran Ao Por",
    emoji: "⛵",
    images: [
      "https://i.ibb.co/LDfgL7gr/1707792277-1-DJI-0227-Enhanced-NR.jpg",
      "https://i.ibb.co/4wpHmyXy/1707792317-2-Sunny-Leopard38-180621-0029-0.jpg",
      "https://i.ibb.co/kszGHCrk/1707792317-3-Sunny-Leopard38-180621-0026.jpg",
      "https://i.ibb.co/Mk4P24QZ/1707792395-42-S5-A0890-Enhanced-NR.jpg",
      "https://i.ibb.co/wZhKdgKC/1707792395-52-S5-A0897-Enhanced-NR.jpg",
      "https://i.ibb.co/tM9fJWDH/1707792501-7-IMG-6763.jpg",
      "https://i.ibb.co/5hBDk2fY/1707792501-62-S5-A0761-Enhanced-NR.jpg",
      "https://i.ibb.co/3mWvKpfB/1707792584-9-IMG-6769.jpg",
      "https://i.ibb.co/dJWT4dxd/1707792584-82-S5-A0649-Enhanced-NR.jpg",
    ],
    desc: "REAL 2豹式Leopard 39双体帆船，2023年翻新，4间客舱2浴室全空调，最多19人。提供全年半日/全日游，含往返接送+午餐+海洋公园+充气玩具+蹦床，以4人为基准定价，超出每人1,875泰铢。",
    retail: 48000, agent: 43200, cost: 40800,
    includes: [
      "往返接送",
      "岛屿费及海洋国家公园",
      "旅行保险",
      "小吃及午餐",
      "饮用水/软饮/新鲜水果",
      "充气玩具",
      "音响系统/空调/蹦床/厨房",
    ],
    excludes: [
      "超4人每人加1,875 THB（最多19人）",
    ],
    suppliers: [
      { name: "PL", price: 40800 },
    ],
    notes: [
      "价格基于4人：半日游37,187.5/全日游47,812.5（全年统一价）",
      "超出4人每人加1,875泰铢，最多19人",
      "2023年翻新，4间客舱2浴室全空调，私密感强",
      "含午餐+往返接送+海洋公园，全包服务",
      "Ao Por出发，适合普吉岛东北部客户",
    ],
    faq: [
      { q: "价格基于几人？", a: "基于4人定价，半日游37,187.5/全日游47,812.5泰铢，超出每人加1,875泰铢，最多19人。" },
      { q: "有客舱空调吗？", a: "有！4间客舱2浴室全配空调，是同类帆船中少见的高配置。" },
      { q: "含午餐吗？", a: "全日游含午餐，另有小吃、软饮、新鲜水果。" },
      { q: "从哪里出发？", a: "常驻Ao Por码头，在纳卡诺伊、卡伊和攀牙湾提供游船服务。" },
      { q: "有蹦床吗？", a: "有！配备船上蹦床，是中国游客最喜欢的娱乐设施之一。" },
    ],
    itinerary: "往返接送至Ao Por码头 → 登船出发 → 纳卡诺伊/卡伊岛/攀牙湾巡游 → 浮潜及充气玩具/蹦床体验 → 船上午餐 → 返航",
    materials: [
      "REAL 2豹式帆船实拍图9张",
      "小红书推广文案（豪华帆船空调舱版）",
      "朋友圈推广文案",
      "半日/全日游价格对比表",
      "抖音短视频脚本",
    ],
  },
  {
    id: 45, cat: "yacht", status: "avail",
    name: "Senna 47英尺双体帆船", nameEn: "Senna 47ft Catamaran Phuket",
    emoji: "⛵",
    images: [
      "https://i.ibb.co/b5GK6K33/1707794504-17-M-LG-SENNA-5.jpg",
      "https://i.ibb.co/3LrPsrC/1707794559-27-M-LG-SENNA-7.jpg",
      "https://i.ibb.co/QF251xd9/1707794633-37-M-LG-SENNA-4.jpg",
      "https://i.ibb.co/8D3fwnTW/1707794633-47-M-LG-SENNA-3.jpg",
      "https://i.ibb.co/Nn637qZQ/1707795422-57-M-LG-SENNA-11.jpg",
      "https://i.ibb.co/7N6xJsQC/1707795439-67-M-LG-SENNA-12.jpg",
      "https://i.ibb.co/wZhcXg9n/1707795499-77-M-LG-SENNA-10.jpg",
      "https://i.ibb.co/RMxkGtD/1707795499-87-M-LG-SENNA-9.jpg",
      "https://i.ibb.co/BK3SwJp4/1707795646-97-M-LG-SENNA-8.jpg",
    ],
    desc: "Senna 47英尺双体帆船，查龙出发，最多30人，含英语服务员+迎宾黑甘蔗汁+7%增值税。半日/全日多条航线，允许自带食物饮料，下午日落场含普罗姆帖海角。",
    retail: 29000, agent: 26100, cost: 24650,
    includes: [
      "1名专业船长+1名船员+1名英语服务人员",
      "迎宾饮品（黑甘蔗汁）+普吉岛迎宾小吃",
      "软饮（可乐/芬达/雪碧）+饮用水",
      "时令水果",
      "救生衣/面罩/呼吸管/沙滩巾",
      "急救用品+旅行意外保险",
      "7%政府税",
    ],
    excludes: [
      "国家公园门票",
      "岛屿入岛费",
      "陆路交通",
      "餐饮（可自带，免费）",
      "钓竿/水上玩具（需另付费预订）",
      "烧烤服务（1,250 THB/次）",
      "节假日附加费（3,000-6,000 THB）",
    ],
    suppliers: [
      { name: "PL", price: 24650 },
    ],
    notes: [
      "1-15人每人1,250泰铢，最多30人",
      "半日游上午19,900；下午21,900（含日落）",
      "全日游24,900-29,900，多条航线可选",
      "允许自带食物饮料，对中国客户非常友好",
      "比蓝色靛蓝号和夏季号略贵，适合推荐给追求品质的客户",
    ],
    faq: [
      { q: "最多坐几人？", a: "1-15人每人1,250泰铢，超出另计，最多30人。" },
      { q: "可以自带食物吗？", a: "可以！允许携带食物和饮料上船，无需额外付费。" },
      { q: "下午场有什么特别？", a: "下午场14:30-19:00含普罗姆帖海角日落观景，绝美日落体验。" },
      { q: "全日游可以去哪？", a: "拉查岛+珊瑚岛、迈顿岛+珊瑚岛、凯诺岛+迈顿岛等，8小时29,900泰铢。" },
      { q: "和其他47英尺帆船有什么区别？", a: "配置基本相同，Senna市场价29,000，略高于蓝色靛蓝和夏季号，船况和体验更佳。" },
    ],
    itinerary: "查龙码头登船 → 迎宾黑甘蔗汁+普吉特色小吃 → 巡游选定航线（珊瑚岛/拉查岛/迈顿岛等）→ 浮潜及岛屿停靠 → 下午场含日落观景 → 返航",
    materials: [
      "Senna双体帆船实拍图9张",
      "小红书推广文案（Senna帆船版）",
      "朋友圈推广文案",
      "半日/全日航线价格对比表",
      "抖音短视频脚本",
    ],
  },
  {
    id: 44, cat: "yacht", status: "avail",
    name: "夏季号47英尺双体帆船", nameEn: "Summer 47ft Catamaran Phuket",
    emoji: "⛵",
    images: [
      "https://i.ibb.co/KP2RqX4/1707796301-17-M-Summer-1.jpg",
      "https://i.ibb.co/SXjF8XWS/1707796355-27-M-Summer-10.jpg",
      "https://i.ibb.co/rG3XXnzB/1707796355-37-M-Summer-2.jpg",
      "https://i.ibb.co/JWwCrZKB/1707796421-47-M-Summer-4.jpg",
      "https://i.ibb.co/Kpn790ML/1707796421-57-M-Summer-11.jpg",
      "https://i.ibb.co/BHhL2hnV/1707796460-67-M-Summer-7.jpg",
      "https://i.ibb.co/4wR0G2tX/1707796460-77-M-Summer-8.jpg",
      "https://i.ibb.co/0VMR71Nm/1707796460-87-M-Summer-9.jpg",
    ],
    desc: "夏季号47英尺双体帆船，查龙出发，最多30人，含英语服务员+迎宾黑甘蔗汁+7%增值税。半日/全日多条航线，允许自带食物饮料，下午日落场含普罗姆帖海角，性价比突出。",
    retail: 26000, agent: 23400, cost: 22100,
    includes: [
      "1名专业船长+1名船员+1名英语服务人员",
      "迎宾饮品（黑甘蔗汁）+普吉岛迎宾小吃",
      "软饮（可乐/芬达/雪碧）+饮用水",
      "时令水果",
      "救生衣/面罩/呼吸管/沙滩巾",
      "急救用品+旅行意外保险",
      "7%政府税",
    ],
    excludes: [
      "国家公园门票",
      "岛屿入场费",
      "陆路交通",
      "餐饮（可自带，免费）",
      "钓竿/水上玩具（需另付费预订）",
      "烧烤服务（1,250 THB/次）",
      "节假日附加费（3,000-6,000 THB）",
    ],
    suppliers: [
      { name: "PL", price: 22100 },
    ],
    notes: [
      "1-15人每人1,250泰铢，最多30人",
      "半日游上午19,900；下午21,900（含日落）",
      "全日游24,900-29,900，多条航线可选",
      "允许自带食物饮料，对中国客户非常友好",
      "节假日包船附加费3,000（半日）/6,000（全日）",
    ],
    faq: [
      { q: "最多坐几人？", a: "1-15人每人1,250泰铢，超出另计，最多30人。" },
      { q: "可以自带食物吗？", a: "可以！允许携带食物和饮料上船，无需额外付费。" },
      { q: "下午场有什么特别？", a: "下午场14:30-19:00含普罗姆帖海角日落观景，绝美日落体验。" },
      { q: "全日游可以去哪？", a: "拉查岛+珊瑚岛、迈顿岛+珊瑚岛、凯诺岛+迈顿岛等，8小时29,900泰铢。" },
      { q: "和蓝色靛蓝号有什么区别？", a: "配置基本相同，夏季号市场价略高（26,000 vs 25,000），可根据档期灵活选择。" },
    ],
    itinerary: "查龙码头登船 → 迎宾黑甘蔗汁+普吉特色小吃 → 巡游选定航线（珊瑚岛/拉查岛/迈顿岛等）→ 浮潜及岛屿停靠 → 下午场含日落观景 → 返航",
    materials: [
      "夏季号双体帆船实拍图8张",
      "小红书推广文案（夏日帆船版）",
      "朋友圈推广文案",
      "半日/全日航线价格对比表",
      "抖音短视频脚本",
    ],
  },
  {
    id: 43, cat: "yacht", status: "avail",
    name: "蓝色靛蓝号47英尺双体帆船", nameEn: "Blue Indigo 47ft Catamaran Phuket",
    emoji: "⛵",
    images: [
      "https://i.ibb.co/GvPny8Pn/1707796756-17-M-NLG-BLUE-INDIGO-1.jpg",
      "https://i.ibb.co/NdZpL5JC/1707796756-27-M-NLG-BLUE-INDIGO-5.jpg",
      "https://i.ibb.co/LDRtGCzS/1707796913-37-M-NLG-BLUE-INDIGO-6.jpg",
      "https://i.ibb.co/cdzr8Bb/1707796913-47-M-NLG-BLUE-INDIGO-7.jpg",
      "https://i.ibb.co/dsqctHHx/1707796913-57-M-NLG-BLUE-INDIGO-9.jpg",
      "https://i.ibb.co/5h7Kd27v/1707797299-67-M-NLG-BLUE-INDIGO-10.jpg",
      "https://i.ibb.co/tMq14nRD/1707797299-77-M-NLG-BLUE-INDIGO-11.jpg",
      "https://i.ibb.co/whxpDsPn/1707797299-87-M-NLG-BLUE-INDIGO-12.jpg",
      "https://i.ibb.co/Swwb2KFK/1707797299-97-M-NLG-BLUE-INDIGO-14.jpg",
    ],
    desc: "蓝色靛蓝号47英尺双体帆船，查龙出发，最多30人，含英语服务员+迎宾黑甘蔗汁+7%增值税。提供半日/全日多条航线，可自带食物饮料，下午日落场含普罗姆帖海角，性价比突出。",
    retail: 25000, agent: 22500, cost: 21250,
    includes: [
      "1名专业船长+1名船员+1名英语服务人员",
      "迎宾饮品（黑甘蔗汁）+普吉岛迎宾小吃",
      "软饮（可乐/芬达/雪碧）+饮用水",
      "时令水果",
      "救生衣/面罩/呼吸管/沙滩巾",
      "急救用品+旅行意外保险",
      "7%政府税",
    ],
    excludes: [
      "国家公园门票",
      "岛屿入岛费",
      "陆路交通",
      "餐饮（可自带，免费）",
      "钓竿/水上玩具（需另付费预订）",
      "烧烤服务（1,250 THB/次）",
      "节假日附加费（3,000-6,000 THB）",
    ],
    suppliers: [
      { name: "PL", price: 21250 },
    ],
    notes: [
      "1-15人每人1,250泰铢，最多30人",
      "半日游上午19,900（珊瑚岛/迈顿岛）；下午21,900（含日落）",
      "全日游24,900-29,900，拉查岛/迈顿/凯诺岛等多线",
      "允许自带食物饮料，对中国客户非常友好",
      "节假日包船附加费3,000（半日）/6,000（全日）",
    ],
    faq: [
      { q: "最多坐几人？", a: "1-15人每人1,250泰铢，超出另计，最多30人。" },
      { q: "可以自带食物吗？", a: "可以！允许携带食物和饮料上船，无需额外付费，非常适合自备中式食材。" },
      { q: "下午场有什么特别？", a: "下午场14:30-19:00含普罗姆帖海角日落观景，是普吉岛最美日落航线之一。" },
      { q: "全日游可以去哪？", a: "拉查岛+珊瑚岛、迈顿岛+珊瑚岛、凯诺岛+迈顿岛等多条航线，8小时29,900泰铢。" },
      { q: "价格含增值税吗？", a: "含7%政府税，报价透明无隐藏费用。" },
    ],
    itinerary: "查龙码头登船 → 迎宾黑甘蔗汁+普吉特色小吃 → 巡游选定航线（珊瑚岛/拉查岛/迈顿岛等）→ 浮潜及岛屿停靠 → 下午场含日落观景 → 返航",
    materials: [
      "蓝色靛蓝号双体帆船实拍图9张",
      "小红书推广文案（自带食物日落版）",
      "朋友圈推广文案",
      "半日/全日航线价格对比表",
      "抖音短视频脚本",
    ],
  },
  {
    id: 42, cat: "yacht", status: "avail",
    name: "Sunwind帆船双体船", nameEn: "Sunwind Sailing Catamaran Ao Por",
    emoji: "⛵",
    images: [
      "https://i.ibb.co/hRjVvFg5/1707882250-1-GS704533.jpg",
      "https://i.ibb.co/tpcxHrL0/1707882309-2-DJI-0833.jpg",
      "https://i.ibb.co/qfPfGsX/1707882309-3-DJI-0932-1-Enhanced-NR.jpg",
      "https://i.ibb.co/NnmzBZZ0/1707882361-4-GS704769.jpg",
      "https://i.ibb.co/n8CjChZt/1707882411-5-GS705114.jpg",
      "https://i.ibb.co/MDQZ5P2K/1707882411-6-GS705131.jpg",
      "https://i.ibb.co/dwKPKr6s/1707882535-7-GS704923-Edit.jpg",
      "https://i.ibb.co/mrrjC4xv/1707882568-8-GS705212.jpg",
      "https://i.ibb.co/q39BdGHC/1707882607-9-GS705134-Edit-Edit.jpg",
    ],
    desc: "Sunwind豪华帆船双体船，Ao Por出发，最多85人，7.5小时私人包船。含透明皮划艇+充气游泳池+4个卫生间+7%增值税+攀牙湾门票，适合超大型团建及企业活动，各码头均可出发。",
    retail: 160000, agent: 144000, cost: 136000,
    includes: [
      "专业经验丰富的船员",
      "面罩/浮潜装备/救生衣",
      "旅行保险",
      "接驳艇",
      "时令水果",
      "2个露天淋浴间/4个卫生间",
      "攀牙湾国家公园门票（泰国人）",
      "迎宾饮品",
      "透明皮划艇/充气游泳池",
      "毛巾",
      "7%政府税",
    ],
    excludes: [
      "攀牙湾国家公园门票（外国人：成人300/儿童150 THB）",
      "餐食（需另安排）",
      "各码头搬迁费（8,000-27,000 THB，视出发地）",
    ],
    suppliers: [
      { name: "PL", price: 136000 },
    ],
    notes: [
      "最多85人，是普吉岛容量最大的帆船之一",
      "按人数8档定价：30人内76,875至85人内158,750",
      "7.5小时包船，11:00-18:30灵活安排",
      "含透明皮划艇是差异化卖点，非常适合拍照",
      "各码头均可出发，搬迁费8,000-27,000另计",
    ],
    faq: [
      { q: "最多坐几人？", a: "最多85人，按人数8档定价，30人内76,875泰铢起，85人内158,750泰铢。" },
      { q: "有透明皮划艇吗？", a: "有！透明皮划艇是本船特色，可清晰看到海底，非常适合拍照打卡。" },
      { q: "从哪里出发？", a: "泊于Ao Por码头，全岛各主要码头均可出发，搬迁费8,000-27,000泰铢另计。" },
      { q: "国家公园门票包含吗？", a: "泰国人门票包含，外国游客需额外支付成人300/儿童150泰铢。" },
      { q: "适合大型团建吗？", a: "非常适合！85人容量+7.5小时包船+4个卫生间，是普吉岛超大型团建首选。" },
    ],
    itinerary: "各码头登船(11:00) → 攀牙湾巡游 → 透明皮划艇探险 → 浮潜及充气游泳池 → 美丽岛屿停留 → 返航(18:30)",
    materials: [
      "Sunwind帆船双体船实拍图9张",
      "小红书推广文案（透明皮划艇版）",
      "朋友圈推广文案",
      "超大型团建价格方案",
      "抖音短视频脚本",
    ],
  },
  {
    id: 41, cat: "yacht", status: "avail",
    name: "贝利纳帆船双体船", nameEn: "Bellina Sailing Catamaran Phuket",
    emoji: "⛵",
    images: [
      "https://i.ibb.co/4ZrSDr7R/1723044860-1-IMG-2443.jpg",
      "https://i.ibb.co/hxj2PV46/1723044860-2-IMG-2441.jpg",
      "https://i.ibb.co/zjypL1v/1723044860-3-IMG-2440.jpg",
      "https://i.ibb.co/SX5Xtsmf/1723044860-4-IMG-2442.jpg",
      "https://i.ibb.co/TBVh2VWn/1723044860-5-IMG-2439.jpg",
      "https://i.ibb.co/ymRpwvGx/1723044860-6-IMG-2438.jpg",
      "https://i.ibb.co/zhStBbGb/1723044860-7-IMG-2437.jpg",
      "https://i.ibb.co/0yhMxcns/1723044860-8-IMG-2436.jpg",
      "https://i.ibb.co/v6Zv2xmf/1723044860-9-IMG-2435.jpg",
    ],
    desc: "贝利纳70㎡宽敞帆船双体船，最多55人，配2个卫生间+4-5名专业船员，8小时私人包船含珊瑚岛+拉查岛，适合大型团建/企业活动。皮皮岛/詹姆斯邦德岛可选，各码头均可出发。",
    retail: 60000, agent: 54000, cost: 51000,
    includes: [
      "软饮/水/新鲜水果",
      "4-5名专业船员",
      "面罩/呼吸管/救生衣",
      "旅行保险",
      "接驳艇",
      "燃油",
      "珊瑚岛+拉查岛（免费包含）",
    ],
    excludes: [
      "泰式餐点（500 THB/人）",
      "国家公园门票",
      "珊瑚岛+拉查岛+迈顿岛附加费（5,350 THB）",
      "皮皮岛附加费（16,050 THB）",
      "詹姆斯邦德岛附加费（13,910 THB）",
      "各码头搬迁费（8,000-27,000 THB，视出发地）",
    ],
    suppliers: [
      { name: "PL", price: 51000 },
    ],
    notes: [
      "55人超大容量，70㎡宽敞空间，适合大型团建/企业活动",
      "1-30人50,000/31-40人56,250/41-50人62,500/51-55人68,750",
      "8小时09:00-21:00，时间灵活",
      "珊瑚岛+拉查岛免费包含，性价比突出",
      "全岛各码头均可出发，搬迁费8,000-27,000另计",
    ],
    faq: [
      { q: "最多坐几人？", a: "最多55人，按人数分四档定价，1-30人50,000泰铢起。" },
      { q: "从哪个码头出发？", a: "全岛各主要码头均可出发，卡伦/芭东/卡马拉/班涛/甲米等，搬迁费8,000-27,000另计。" },
      { q: "可以去皮皮岛吗？", a: "可以，需加收16,050泰铢附加费。詹姆斯邦德岛需加13,910泰铢。" },
      { q: "珊瑚岛和拉查岛免费吗？", a: "是的！珊瑚岛+拉查岛包含在基本价格内，迈顿岛需加5,350泰铢。" },
      { q: "适合大型团建吗？", a: "非常适合！55人容量+70㎡宽敞空间+8小时包船，是普吉岛大型企业团建首选之一。" },
    ],
    itinerary: "各码头登船(09:00) → 珊瑚岛+拉查岛巡游浮潜 → 可选迈顿岛/皮皮岛/詹姆斯邦德岛 → 船上餐饮休闲 → 返航(至21:00)",
    materials: [
      "贝利纳双体帆船实拍图9张",
      "小红书推广文案（大型团建帆船版）",
      "朋友圈推广文案",
      "多人团建价格方案",
      "抖音短视频脚本",
    ],
  },
  {
    id: 40, cat: "yacht", status: "avail",
    name: "Coco 40英尺双体帆船", nameEn: "Coco 40ft Catamaran Phuket",
    emoji: "⛵",
    images: [
      "https://i.ibb.co/nqvkkQ4B/1708422227-17-M-LG-COCO-1.jpg",
      "https://i.ibb.co/CKyTsn9G/1708422291-27-M-LG-COCO-6.jpg",
      "https://i.ibb.co/7djBX2Jw/1708422333-37-M-LG-COCO-9.jpg",
      "https://i.ibb.co/sdF1fGDy/1708422390-47-M-LG-COCO-12.jpg",
      "https://i.ibb.co/0VrR775V/1708422460-57-M-LG-COCO-13.jpg",
      "https://i.ibb.co/KxdwHwjg/1708422460-67-M-LG-COCO-14.jpg",
    ],
    desc: "Coco 40英尺双体帆船，查龙出发，最多20人，含英语导游+迎宾黑甘蔗汁+普吉特色小吃+7%增值税。提供半日/全日多条航线，允许自带食物饮料，性价比突出。",
    retail: 18000, agent: 16200, cost: 15300,
    includes: [
      "1名专业船长+1名船员+1名英语导游",
      "迎宾饮品（黑甘蔗汁）+普吉岛特色小吃",
      "软饮（可乐/芬达/雪碧）+饮用水",
      "时令水果",
      "救生衣/面罩/呼吸管/沙滩巾",
      "急救用品+旅行意外保险",
      "7%政府税",
    ],
    excludes: [
      "国家公园门票",
      "岛屿入岛费",
      "陆路交通",
      "餐饮（可自带，免费）",
      "钓竿/水上玩具（需另付费预订）",
      "烧烤服务（1,250 THB/次）",
      "节假日附加费（3,000-6,000 THB）",
    ],
    suppliers: [
      { name: "PL", price: 15300 },
    ],
    notes: [
      "允许自带食物饮料上船，无需额外付费，对中国客户非常友好",
      "半日游上午17,900（珊瑚岛/迈顿岛）；下午19,900（含日落）",
      "全日游24,900，拉查岛/迈顿岛/珊瑚岛/凯诺岛等多线",
      "节假日包船附加费3,000（半日）/6,000（全日）",
      "超时延长每小时3,750，最晚20:00",
    ],
    faq: [
      { q: "最多坐几人？", a: "1-15人17,900泰铢，超出每人加1,250泰铢，最多20人。" },
      { q: "可以自带食物吗？", a: "可以！允许携带食物和饮料上船，无需额外付费，非常适合自备烧烤或中式食材。" },
      { q: "下午场有什么特别？", a: "下午场14:30-19:00含普罗姆帖海角日落观景，是普吉岛最美日落航线之一。" },
      { q: "全日游可以去哪？", a: "拉查岛+珊瑚岛、迈顿岛+珊瑚岛、凯诺岛+迈顿岛等多条航线，8小时24,900泰铢。" },
      { q: "价格含增值税吗？", a: "含7%政府税，报价透明。" },
    ],
    itinerary: "查龙码头登船 → 迎宾黑甘蔗汁+普吉特色小吃 → 巡游选定航线（珊瑚岛/拉查岛/迈顿岛等）→ 浮潜及岛屿停靠 → 下午场含日落观景 → 返航",
    materials: [
      "Coco双体帆船实拍图6张",
      "小红书推广文案（自带食物友好版）",
      "朋友圈推广文案",
      "半日/全日航线价格对比表",
      "抖音短视频脚本",
    ],
  },
  {
    id: 39, cat: "yacht", status: "avail",
    name: "Papakang动力双体船", nameEn: "Papakang Power Catamaran Phuket",
    emoji: "⛵",
    images: [
      "https://i.ibb.co/KptNxSc7/1708498734-1-DJI-0196.jpg",
      "https://i.ibb.co/LWh2H0T/1708498801-2-DJI-0142.jpg",
      "https://i.ibb.co/sdDv7T0p/1708498801-3-AK8-Q7081.jpg",
      "https://i.ibb.co/ZRgRgxWW/1708498909-4-AK8-Q7098.jpg",
      "https://i.ibb.co/ZzB4SmRv/1708498909-5-AK8-Q7078.jpg",
      "https://i.ibb.co/mkbGXVh/1708498980-6-AK8-Q7068.jpg",
      "https://i.ibb.co/2YKpTffg/1708498980-7-AK8-Q7036.jpg",
      "https://i.ibb.co/tpMt3zSL/1708498980-8-AK8-Q7016.jpg",
      "https://i.ibb.co/7x2146Ky/1708498980-93-S5-A1972.jpg",
    ],
    desc: "Papakang豪华动力双体船，最多80人，配滑梯+灯光音响系统+迎宾饮品，适合大型团建及企业包船。提供上午/下午日落/全日多条航线，可达卡洪海滩、攀牙湾、皮皮岛，性价比极高。",
    retail: 110000, agent: 99000, cost: 93500,
    includes: [
      "救生衣/面罩/呼吸管",
      "滑梯",
      "灯光音响系统",
      "迎宾饮品/饮用水/软饮/水果/小吃",
      "沙滩椅（卡洪海滩）",
      "清凉毛巾",
      "意外保险",
    ],
    excludes: [
      "陆路交通",
      "导游",
      "午餐（船上餐饮加收6,250 THB）",
      "长尾船往返拉查岛/凯岛/皮皮岛交通",
      "迈顿岛门票",
    ],
    suppliers: [
      { name: "PL", price: 93500 },
    ],
    notes: [
      "最多80人，是普吉岛少有的超大容量包船选择",
      "上午场(9:00-13:00)：1-40人46,250/41-80人58,750",
      "下午日落场(14:00-19:30)：1-40人58,750/41-80人71,250",
      "全日游含拉差/迈顿/凯岛：1-40人83,750/41-80人96,250",
      "攀牙湾/皮皮岛60人包船120,000，大型团建首选",
      "配备滑梯+灯光音响，适合派对及团建活动",
    ],
    faq: [
      { q: "最多坐几人？", a: "最多80人，分1-40人和41-80人两档定价，攀牙湾/皮皮岛路线按60人计120,000。" },
      { q: "适合大型团建吗？", a: "非常适合！80人容量+滑梯+灯光音响，是普吉岛大型团建/企业活动的首选包船。" },
      { q: "下午场有什么特别？", a: "下午场14:00-19:30，含普罗姆帖海岬日落和克拉廷角观景，绝美日落体验。" },
      { q: "含午餐吗？", a: "不含，船上餐饮需额外加收6,250泰铢。" },
      { q: "可以去皮皮岛吗？", a: "可以，攀牙湾+皮皮岛路线60人包船120,000泰铢，需额外长尾船接驳。" },
    ],
    itinerary: "查龙码头登船 → 卡洪海滩（阁熙岛）浮潜滑梯 → 可选拉差岛/迈顿/凯岛/攀牙湾/皮皮岛 → 下午场含日落观景 → 返航",
    materials: [
      "Papakang动力双体船实拍图9张",
      "小红书推广文案（大型团建包船版）",
      "朋友圈推广文案",
      "多人团建价格方案",
      "抖音短视频脚本",
    ],
  },
  {
    id: 38, cat: "yacht", status: "avail",
    name: "Aumakua双体帆船", nameEn: "Aumakua Catamaran Phuket",
    emoji: "⛵",
    images: [
      "https://i.ibb.co/1tJ0wNw5/1708654508-1aum1-0.jpg",
      "https://i.ibb.co/twY80kkY/1708655320-2-0.jpg",
      "https://i.ibb.co/WpttXcTx/1708655320-3-NKP18713-0.jpg",
      "https://i.ibb.co/CphS7FRT/1708655381-4-NW1-D9883-0.jpg",
      "https://i.ibb.co/JR3gBVBd/1708655381-5-AUMAKUA-014-0.jpg",
      "https://i.ibb.co/5gznn6Hc/1708655949-8-AK8-Q5947-0.jpg",
      "https://i.ibb.co/4R2shY8Y/1708655949-9-AUMAKUA-016-0.jpg",
      "https://i.ibb.co/RGf6NpwT/1708655949-643019-0.jpg",
      "https://i.ibb.co/gFmQGMpc/1708655949-743017-0.jpg",
    ],
    desc: "Aumakua豪华双体帆船，查龙出发，最多30人，提供上午半日/下午日落半日/全日游，可达卡洪海滩（科赫伊岛）、拉差岛、迈顿岛、凯岛。下午场含日落观景，超值推荐。",
    retail: 23000, agent: 20700, cost: 19550,
    includes: [
      "救生衣/面罩/呼吸管",
      "饮用水/软饮/水果/零食",
      "沙滩椅（卡洪海滩）",
      "清凉毛巾",
      "意外保险",
    ],
    excludes: [
      "陆路交通",
      "导游",
      "午餐（船上餐饮加收6,250 THB）",
      "长尾船往返拉差岛/凯岛/皮皮岛/迈顿岛门票",
    ],
    suppliers: [
      { name: "PL", price: 19550 },
    ],
    notes: [
      "上午场(8:00-13:00)：1-20人13,750/21-30人16,250",
      "下午日落场(14:00-19:30)：1-20人17,500/21-30人21,250（含日落观景）",
      "全日游(9:00-16:00/17:00)：1-20人22,500/21-30人216,250",
      "船上餐饮需额外加收6,250泰铢",
      "下午日落场含普罗姆帖海岬日落+克拉廷角，是独特卖点",
    ],
    faq: [
      { q: "最多坐几人？", a: "最多30人，1-20人和21-30人分两档定价。" },
      { q: "下午场有什么特别？", a: "下午场14:00-19:30，含普罗姆帖海岬日落和克拉廷角观景，是观赏普吉岛日落的绝佳选择。" },
      { q: "含午餐吗？", a: "不含，船上餐饮需额外加收6,250泰铢。" },
      { q: "从哪里出发？", a: "从查龙码头出发，泊于查龙湾。" },
      { q: "可以去皮皮岛吗？", a: "皮皮岛需额外长尾船接驳及门票费用，不含在基本价格内。" },
    ],
    itinerary: "查龙码头登船 → 卡洪海滩（科赫伊岛）游览浮潜 → 可选拉差岛/迈顿岛/凯岛 → 下午场含普罗姆帖海岬日落观景 → 返航",
    materials: [
      "Aumakua双体帆船实拍图9张",
      "小红书推广文案（日落双体帆船版）",
      "朋友圈推广文案",
      "上午/下午/全日游价格对比表",
      "抖音短视频脚本",
    ],
  },
  {
    id: 37, cat: "yacht", status: "avail",
    name: "Majesty 48豪华游艇", nameEn: "Majesty 48 Luxury Yacht Phuket",
    emoji: "⛵",
    images: [
      "https://i.ibb.co/Ng6ZsSHG/1595399772-1-Majasty-48-Phuket-Luxury-Yacht-Charter-Thailand-5.png",
      "https://i.ibb.co/BHW5g1zq/1595399772-2-Majasty-48-Phuket-Luxury-Yacht-Charter-Thailand-1.png",
      "https://i.ibb.co/1JmrmPfq/1595399772-3-Majasty-48-Phuket-Luxury-Yacht-Charter-Thailand-10.jpg",
      "https://i.ibb.co/v4kNJDdx/1595399810-4-Majasty-48-Phuket-Luxury-Yacht-Charter-Thailand-8.jpg",
      "https://i.ibb.co/mrmBvdGQ/1595399810-5-Majasty-48-Phuket-Luxury-Yacht-Charter-Thailand-9.jpg",
      "https://i.ibb.co/B5zZhJrg/1595399810-6-Majasty-48-Phuket-Luxury-Yacht-Charter-Thailand-11.jpg",
      "https://i.ibb.co/0j5wSJk9/1595399853-7-Majasty-48-Phuket-Luxury-Yacht-Charter-Thailand-3.jpg",
      "https://i.ibb.co/BVVm23DJ/1595399853-8-Majasty-48-Phuket-Luxury-Yacht-Charter-Thailand-4.jpg",
      "https://i.ibb.co/8D7sPNnq/1595399853-9-Majasty-48-Phuket-Luxury-Yacht-Charter-Thailand-14.jpg",
    ],
    desc: "Majesty 48豪华游艇，2014年建造，3间客舱，日间20人/过夜6人，巡航速度20节。含精致午餐（10人内）+7%增值税+国家公园门票+Bose音响+LED电视，泊于AO PO GRAND码头。",
    retail: 135000, agent: 121500, cost: 114750,
    includes: [
      "专业船长及3名船员",
      "矿泉水/软饮/果汁/冰块/茶咖啡",
      "小吃及新鲜热带水果",
      "精致午餐（最多10人，可选中式/泰式/国际）",
      "所有国家公园及海洋公园门票",
      "保险",
      "7%增值税及税费",
      "浮潜装备/救生衣",
      "TS280 RIB充气艇（雅马哈9.9马力）",
      "LED电视/Bose音响/热带空调",
    ],
    excludes: [
      "餐饮附加费（1,000-1,800 THB/人）",
    ],
    suppliers: [
      { name: "PL", price: 114750 },
    ],
    notes: [
      "价格含7%增值税，报价透明无隐藏",
      "三档定价：5-10月90,000/11-12.19及1.11-4月110,000/12.20-1.10高峰135,000",
      "含精致午餐（10人内）是核心卖点",
      "停泊AO PO GRAND码头，适合普吉岛东北部客户",
      "日间最多20人，过夜最多6人",
    ],
    faq: [
      { q: "价格含午餐吗？", a: "含！为最多10人提供精致午餐，可选中式、泰式或国际美食。" },
      { q: "价格含增值税吗？", a: "含7%增值税及税费，无隐藏费用。" },
      { q: "最多坐几人？", a: "日间最多20人，过夜最多6人（3间客舱）。" },
      { q: "停靠哪个码头？", a: "泊于AO PO GRAND码头，适合普吉岛东北部出发。" },
      { q: "旺季和淡季价格差多少？", a: "淡季90,000，旺季110,000，高峰季（12.20-1.10）135,000。" },
    ],
    itinerary: "AO PO GRAND码头登船 → 巡游攀牙湾/卡伊岛/纳卡岛等 → 浮潜及岛屿停靠 → 精致午餐 → Bose音响娱乐 → 返航",
    materials: [
      "Majesty 48游艇实拍图9张",
      "小红书推广文案（含午餐全包版）",
      "朋友圈推广文案",
      "淡旺峰季价格对比表",
      "抖音短视频脚本",
    ],
  },
  {
    id: 36, cat: "yacht", status: "avail",
    name: "Velasco 43F法国游艇", nameEn: "Jeanneau Velasco 43F Yacht",
    emoji: "⛵",
    images: [
      "https://i.ibb.co/4gs5BY6t/1639809092-132.jpg",
      "https://i.ibb.co/tFVdcqs/1639809092-1-S-10813492.jpg",
      "https://i.ibb.co/KRpqZVC/1639809092-2-S-10813481.jpg",
      "https://i.ibb.co/4QzB6n2/1639809092-3-S-10813475.jpg",
      "https://i.ibb.co/mrs6YgD3/1639809182-4-S-10813489.jpg",
      "https://i.ibb.co/pBHqHnBL/1639809182-5-S-10813488.jpg",
      "https://i.ibb.co/jZz5QsT1/1639809182-7-S-10813482.jpg",
      "https://i.ibb.co/fGSQThF5/1639809182-8-S-10813486.jpg",
      "https://i.ibb.co/23Q636mz/1639809182-9-S-10813483.jpg",
    ],
    desc: "法国Jeanneau Velasco 43F游艇，13.7米，28节最高航速，2间客舱2浴室，最多12人（超员至14人）。多条航线可选从卡伊岛到皮皮岛/甲米/攀牙湾，淡旺季分级定价灵活实惠。",
    retail: 100000, agent: 90000, cost: 85000,
    includes: [
      "游艇全程使用",
      "专业船长及船员",
      "基本饮料及服务",
    ],
    excludes: [
      "超10人每人加2,500 THB（最多14人）",
      "餐食（需另安排）",
      "国家公园门票",
      "燃油附加费（视航线而定）",
    ],
    suppliers: [
      { name: "PL", price: 85000 },
    ],
    notes: [
      "价格分淡季(5-10月)/旺季(11-4月)/高峰季(12.15-1.15)三档",
      "最便宜：卡伊+迈通淡季85,000",
      "最贵：皮皮岛/攀牙湾/甲米高峰季116,875",
      "超10人每人加2,500，最多14人",
      "法国品牌Jeanneau，28节高速是卖点",
    ],
    faq: [
      { q: "最多坐几人？", a: "标准10人，超出每人加2,500泰铢，最多14人。" },
      { q: "最便宜的行程是哪个？", a: "卡伊岛+迈通岛淡季一日游85,000泰铢，性价比最高。" },
      { q: "可以去皮皮岛吗？", a: "可以，淡季106,250/旺季111,565/高峰116,875泰铢。" },
      { q: "速度有多快？", a: "最高航速28节，巡航15-20节，是同类中速度较快的游艇。" },
      { q: "价格含午餐吗？", a: "基本价格不含餐食，需另行安排。" },
    ],
    itinerary: "码头登船 → 巡游选定航线（卡伊岛/迈通/珊瑚岛/拉查岛/皮皮岛/攀牙湾/甲米等）→ 浮潜及岛屿停靠 → 返航",
    materials: [
      "Velasco 43F游艇实拍图9张",
      "小红书推广文案（法国游艇版）",
      "朋友圈推广文案",
      "多航线季节价格对比表",
      "抖音短视频脚本",
    ],
  },
  {
    id: 35, cat: "yacht", status: "avail",
    name: "Astondoa 102 GLX豪华游艇", nameEn: "Astondoa 102 GLX Luxury Yacht",
    emoji: "⛵",
    images: [
      "https://i.ibb.co/9k7z257B/1596793660-1-PHU-AST102-BLO-1.jpg",
      "https://i.ibb.co/DDxrzT9Q/1596793660-2-PHU-AST102-BLO-10.jpg",
      "https://i.ibb.co/k6xXXDYT/1596793660-3-PHU-AST102-BLO-5.jpg",
      "https://i.ibb.co/Jw1wPNsg/1596793688-4-PHU-AST102-BLO-9.jpg",
      "https://i.ibb.co/4nFd32df/1596793688-5-PHU-AST102-BLO-8.jpg",
      "https://i.ibb.co/9HhsP4Hg/1596793688-6-PHU-AST102-BLO-7.jpg",
      "https://i.ibb.co/HLZpCnGx/1596793735-7-PHU-AST102-BLO-3.jpg",
      "https://i.ibb.co/JFm184KW/1596793735-8-PHU-AST102-BLO-4.jpg",
      "https://i.ibb.co/TxZCj64r/1596793735-9-PHU-AST102-BLO-2.jpg",
    ],
    desc: "Astondoa 102 GLX豪华游艇，2009年建造2019年翻新，4间客舱，日间25人/过夜8人。含Seadoo水上摩托艇+桨板+烧烤炉+精致午餐（10人），以10人为基准定价，最高航速24节。",
    retail: 440000, agent: 396000, cost: 374000,
    includes: [
      "8小时游艇全程使用（含小艇）",
      "浮潜套装/LED电视/DVD/Bose音响/烧烤炉",
      "专业船长/船员/女招待",
      "攀牙湾+纳卡或朗亚伊+纳卡燃油费",
      "最多10人精致午餐",
      "国家公园门票",
      "2018年款Seadoo水上摩托艇",
      "浮潜面罩/救生衣/桨板/拖曳翼",
    ],
    excludes: [
      "7%增值税",
      "酒店至码头交通",
      "超10人每人加3,000 THB",
      "超4小时航行每小时加25,000 THB",
      "皮皮岛/拉查诺+亚燃油附加费120,000 THB",
      "迈顿+珊瑚岛或甲米燃油附加费60,000 THB",
      "凯诺克+凯奈+纳卡燃油附加费20,000 THB",
    ],
    suppliers: [
      { name: "PL", price: 374000 },
    ],
    notes: [
      "价格分三档：5-10月350,000/11-12.19月400,000/12.20-1.10高峰420,000",
      "两日一夜：5-10月370,000/11-4月420,000/高峰440,000",
      "10人超员每人加3,000泰铢，最多25人",
      "含Seadoo水上摩托艇是核心卖点",
      "Bose音响+LED电视+DVD影碟库娱乐配置齐全",
    ],
    faq: [
      { q: "最多坐几人？", a: "日间最多25人（基准10人，超出每人加3,000泰铢），过夜最多8人。" },
      { q: "有水上摩托艇吗？", a: "有！配备2018年款Seadoo水上摩托艇，包含在价格内。" },
      { q: "去皮皮岛要加钱吗？", a: "需要，皮皮岛/拉查诺+亚路线需加收120,000泰铢燃油附加费。" },
      { q: "价格按几人计算？", a: "基准10人，超出每人3,000泰铢，不含7%增值税及酒店至码头交通。" },
      { q: "可以过夜吗？", a: "支持两日一夜包船，5-10月370,000，旺季420,000，高峰440,000。" },
    ],
    itinerary: "码头登船(10:00) → 攀牙湾+纳卡岛巡游 → Seadoo水上摩托艇体验 → 浮潜及桨板 → 精致午餐（10人内）→ 烧烤/娱乐 → 返航(18:00)",
    materials: [
      "Astondoa 102游艇实拍图9张",
      "小红书推广文案（水上摩托艇版）",
      "朋友圈推广文案",
      "季节价格对比表",
      "抖音短视频脚本",
    ],
  },
  {
    id: 34, cat: "yacht", status: "avail",
    name: "月球滑翔机90英尺动力游艇", nameEn: "Moon Glider 90ft Power Yacht",
    emoji: "⛵",
    images: [
      "https://i.ibb.co/zTsT2Xwg/1696234930-1moon-glider.jpg",
      "https://i.ibb.co/prPVb4Hw/1641820622-26-A064-F8-F-BD3-C-4-CD2-BC10-CDE85-A5-DFDB5.jpg",
      "https://i.ibb.co/ccFgdgZ0/1641820622-3-F31137-E8-0-C2-B-40-FD-B6-B2-7-E96-B1-F80-D85.jpg",
      "https://i.ibb.co/QFMxLQbw/1641820622-4-AAA7-D0-CB-C7-B6-41-CB-A31-B-741-C4-E9274-A1.jpg",
      "https://i.ibb.co/5gyw1RCJ/1641820622-5-D927098-A-B3-F3-4387-828-E-82-D63-FBC9-C4-B.jpg",
      "https://i.ibb.co/Kj06kKnP/1641820622-6-C26-CF164-D2-D8-4-EBC-AE83-2-F354-BDD49-E6.jpg",
      "https://i.ibb.co/gM1P3knG/1641820622-8-EE9-FB388-6025-4-A3-F-A56-E-BCB7-DE6-C1127.jpg",
      "https://i.ibb.co/DfY6Zyj5/1641820622-78-F057-E50-1-BC9-48-E4-B87-E-6-AAE20862008.jpg",
      "https://i.ibb.co/ZpcDbJSn/1641822609-900425-B37-3441-4980-89-E4-4-B07-CDA5981-D.jpg",
    ],
    desc: "Moon Glider 90英尺动力游艇，2021年翻新，巡航速度25-30节，3间客舱4浴室，最多18人。含午餐+充气玩具+皮划艇+钓鱼装备，提供半日/全日多条航线，以12人为基准定价。",
    retail: 300000, agent: 270000, cost: 255000,
    includes: [
      "船长及船员",
      "住宿地至码头接送",
      "午餐（全日游）",
      "新鲜水果及软饮",
      "泰国身份证岛屿门票",
      "充气玩具/唐老鸭/喷射快艇/皮划艇/钓鱼用具",
      "浮潜用具",
      "安全装备及旅行保险",
    ],
    excludes: [
      "超12人每人加收3,750 THB（最多18人）",
      "半日游不含午餐",
    ],
    suppliers: [
      { name: "PL", price: 255000 },
    ],
    notes: [
      "价格基于12人，超出每人3,750泰铢，最多18人",
      "巡航速度25-30节，是同类游艇中最快之一",
      "半日游201,875（纳卡/朗亚/凯诺克/凯奈）",
      "全日游6小时265,625，8小时318,750-340,000",
      "皮皮岛/拉查/甲米/迈顿8小时340,000封顶",
    ],
    faq: [
      { q: "最多坐几人？", a: "以12人为基准定价，超出每人加3,750泰铢，最多18人。" },
      { q: "速度有多快？", a: "巡航速度25-30节，是同类游艇中速度最快的之一，更快到达目的地。" },
      { q: "半日游可以去哪？", a: "半日游4小时可选纳卡-朗亚或凯诺克-凯奈，201,875泰铢（含早或午）。" },
      { q: "全日游有哪些选择？", a: "6小时凯-纳卡-朗亚265,625；8小时可选攀牙湾/凯-迈通318,750，或拉差亚/皮皮岛/甲米340,000。" },
      { q: "含午餐吗？", a: "全日游含午餐，半日游不含。" },
    ],
    itinerary: "住宿地接送 → 码头登船(09:00/10:00) → 高速巡游选定航线 → 浮潜及皮划艇/钓鱼体验 → 船上午餐（全日）→ 返航",
    materials: [
      "Moon Glider游艇实拍图9张",
      "小红书推广文案（高速游艇版）",
      "朋友圈推广文案",
      "半日/全日航线价格对比表",
      "抖音短视频脚本",
    ],
  },
  {
    id: 33, cat: "yacht", status: "avail",
    name: "Reinwood Princess 78游艇", nameEn: "Reinwood Princess 78 Yacht",
    emoji: "⛵",
    images: [
      "https://i.ibb.co/rr02ZHk/1696230447-1-Yacht-reinwood.png",
      "https://i.ibb.co/Y7KVccCm/1696230543-28tzq9h3m.png",
      "https://i.ibb.co/S7tXF648/1643177848-3-S-11649059.jpg",
      "https://i.ibb.co/nNcJPmd4/1643177848-4-S-11649060.jpg",
      "https://i.ibb.co/6RS1Rhnz/1643177848-6-S-11649062.jpg",
      "https://i.ibb.co/bj9dH2xL/1643177848-7-S-11649063.jpg",
      "https://i.ibb.co/zWV3140t/1643177848-8-S-11649064.jpg",
      "https://i.ibb.co/zW6wRPLg/1643177848-9-S-11649065.jpg",
    ],
    desc: "Reinwood Princess 78豪华游艇，4间客舱4浴室，含按摩浴缸+烧烤架，可达皮皮岛/拉查岛/攀牙湾/甲米/斯米兰群岛，支持过夜多日游，配1船长+3船员+2服务员专属服务。",
    retail: 400000, agent: 360000, cost: 340000,
    includes: [
      "1名专业船长+3名船员+2名服务员",
      "1顿船上餐食",
      "免费时令水果",
      "免费软饮（水/果汁/可乐）",
      "1份免费啤酒",
      "免费船上小吃",
      "浮潜用具/甜甜圈/桨板等水上玩具",
      "8人国家公园门票",
      "船只燃油",
      "住宿地至码头接送",
      "意外保险",
    ],
    excludes: [
      "船上厨师（额外8,000 THB）",
      "菜单以外餐饮",
      "迈通国家公园门票（每人2,500 THB）",
      "过夜费用（一日游费用×天数+30,000 THB/晚）",
      "斯米兰群岛附加费（旺季531,000/淡季510,000）",
    ],
    suppliers: [
      { name: "PL", price: 340000 },
    ],
    notes: [
      "全日游：皮皮岛/拉查岛/攀牙/甲米，旺季350,000/淡季320,000",
      "斯米兰群岛旺季531,000/淡季510,000，距离最远",
      "过夜费用=一日游价×天数+30,000/晚",
      "含按摩浴缸是差异化卖点",
      "厨师需额外8,000泰铢，建议搭配餐饮套餐推荐",
    ],
    faq: [
      { q: "可以去斯米兰群岛吗？", a: "可以！旺季531,000泰铢，淡季510,000泰铢，是普吉岛出发最远的顶级航线之一。" },
      { q: "有按摩浴缸吗？", a: "有！船上配备按摩浴缸和烧烤架，是本船独特卖点。" },
      { q: "过夜怎么计费？", a: "过夜费用=一日游价格×天数，再加每晚30,000泰铢过夜附加费。" },
      { q: "有厨师吗？", a: "需额外支付8,000泰铢，菜单以外的餐饮另计。" },
      { q: "最多住几人？", a: "4间客舱可住8人，配1间船员舱。" },
    ],
    itinerary: "住宿地接送至码头 → 登船出发(10:00) → 巡游选定航线（皮皮岛/拉查岛/攀牙湾/甲米/斯米兰群岛）→ 浮潜及水上玩具 → 按摩浴缸/烧烤体验 → 返航(18:00)或过夜",
    materials: [
      "Reinwood Princess 78游艇实拍图8张",
      "小红书推广文案（按摩浴缸+斯米兰群岛版）",
      "朋友圈推广文案",
      "多日游+斯米兰群岛专属方案",
      "抖音短视频脚本",
    ],
  },
  {
    id: 32, cat: "yacht", status: "avail",
    name: "KATI Princess S65游艇", nameEn: "KATI Princess S65 Yacht",
    emoji: "⛵",
    images: [
      "https://i.ibb.co/XcSCGxs/1704511548-2-YACHT-KATI-Princess-S65-002.jpg",
      "https://i.ibb.co/R4Q5hT4Z/1704511548-3-YACHT-KATI-Princess-S65-005.jpg",
      "https://i.ibb.co/t0q71yf/1704511548-4-YACHT-KATI-Princess-S65-004.jpg",
      "https://i.ibb.co/BVgHPkwB/1704511548-5-YACHT-KATI-Princess-S65-006.jpg",
      "https://i.ibb.co/LdJZk3WB/1704511548-6-YACHT-KATI-Princess-S65-010.jpg",
      "https://i.ibb.co/7dMkvdjt/1704511629-8-YACHT-KATI-Princess-S65-009.jpg",
      "https://i.ibb.co/8g85ThTb/1704511629-9-YACHT-KATI-Princess-S65-011.jpg",
      "https://i.ibb.co/21nf5YRL/1704512857-7-YACHT-KATI-Princess-S65-007.jpg",
      "https://i.ibb.co/yFYj3PRN/1704513715-1-YACHT-KATI-Princess-S65-001.jpg",
    ],
    desc: "KATI Princess S65豪华游艇，65英尺，2017年建造，3间客舱3浴室，日间最多12人，过夜最多6人。提供半日/全日/多日豪华套餐，巡航速度20节，可达攀牙湾、皮皮岛、甲米等热门航线。",
    retail: 550000, agent: 495000, cost: 467500,
    includes: [
      "游艇全程使用",
      "码头接送",
      "专业船长及3-4名船员",
      "水果/小吃/软饮/啤酒/饮用水",
      "国家公园门票",
      "浮潜装备/毛巾/救生衣/保险",
    ],
    excludes: [
      "午餐（可选，1,500 THB/人起）",
      "燃油附加费（超4小时，25,000 THB/小时）",
      "船员小费",
    ],
    suppliers: [
      { name: "PL", price: 467500 },
    ],
    notes: [
      "半日游淡季262,500/旺季325,000；全日游淡季300,000/旺季362,500",
      "过夜套餐3-4间客舱：24H淡季450,000/旺季543,750",
      "7天6夜最高2,537,500泰铢（旺季）",
      "长期过夜超5晚改为最多4人2间客舱",
      "巡航速度20节，比同类游艇更快到达目的地",
    ],
    faq: [
      { q: "最多坐几人？", a: "日间最多12人，过夜最多6人（3间客舱），5晚以上改为最多4人（2间客舱）。" },
      { q: "全日游可以去哪？", a: "攀牙湾、甲米宏岛、皮皮岛、拉查岛、迈顿岛、凯岛，8小时10:00-18:00。" },
      { q: "半日游多少钱？", a: "淡季（5-10月）262,500，旺季（11-4月）325,000。" },
      { q: "可以多日游吗？", a: "支持2天1夜至7天6夜套餐，价格600,000至2,537,500泰铢（视季节）。" },
      { q: "燃油附加费怎么算？", a: "每日超过4小时使用发动机，每小时加收25,000泰铢。" },
    ],
    itinerary: "码头接送登船(10:00) → 巡游选定航线（攀牙湾/皮皮岛/拉查岛等）→ 浮潜及岛屿停靠 → 船上小吃饮品 → 返航(18:00)或过夜",
    materials: [
      "KATI Princess S65游艇实拍图9张",
      "小红书推广文案（私密小团体版）",
      "朋友圈推广文案",
      "多日游套餐价格表",
      "抖音短视频脚本",
    ],
  },
  {
    id: 31, cat: "yacht", status: "avail",
    name: "蒙特卡洛86超级游艇", nameEn: "BAYC Asia Monte Carlo 86 Superyacht",
    emoji: "⛵",
    images: [
      "https://i.ibb.co/whx1v9j5/1704508845-1-Yacht-BAYC-ASIA-MONTE-CARLO-YACHTS-86-002.jpg",
      "https://i.ibb.co/cK6cY8YQ/1704508947-2-Yacht-BAYC-ASIA-MONTE-CARLO-YACHTS-86-003.jpg",
      "https://i.ibb.co/C3Hvz46K/1704509097-3-Yacht-BAYC-ASIA-MONTE-CARLO-YACHTS-86-004.jpg",
      "https://i.ibb.co/twFJXsCP/1704509292-4-Yacht-BAYC-ASIA-MONTE-CARLO-YACHTS-86-005.jpg",
      "https://i.ibb.co/k22KcRrH/1704509407-5-Yacht-BAYC-ASIA-MONTE-CARLO-YACHTS-86-006.jpg",
      "https://i.ibb.co/spyz8v5z/1704509512-6-Yacht-BAYC-ASIA-MONTE-CARLO-YACHTS-86-007.jpg",
      "https://i.ibb.co/ds2NWvLg/1704509679-7-Yacht-BAYC-ASIA-MONTE-CARLO-YACHTS-86-008.jpg",
      "https://i.ibb.co/rGRDxFKB/1704509818-8-Yacht-BAYC-ASIA-MONTE-CARLO-YACHTS-86-010.jpg",
      "https://i.ibb.co/TBLX133z/1704509893-9-Yacht-BAYC-ASIA-MONTE-CARLO-YACHTS-86-009.jpg",
    ],
    desc: "蒙特卡洛86超级游艇BAYC Asia，86英尺26.3米，配陀螺稳定器防横摇，4间客舱住8人，日间最多20人。提供全日游及2-7天多日豪华套餐，可达攀牙湾、詹姆斯邦德岛、皮皮岛等顶级航线。",
    retail: 640000, agent: 576000, cost: 544000,
    includes: [
      "游艇/客舱/附属艇/水上玩具全套使用权",
      "往返酒店/别墅/机场交通",
      "专业船长及3-5名船员",
      "水果/小吃/软饮/啤酒/水",
      "国家公园门票",
      "浮潜装备/救生衣/毛巾/保险",
      "2块SUP桨板/漂浮垫/浮潜装备",
      "液压升降游泳平台/烧烤设施",
      "蓝牙音响/4G Wi-Fi/全舱空调/全舱电视",
      "海水淡化器/甲板淋浴",
    ],
    excludes: [
      "超10人每人加收2,500泰铢（最多20人）",
      "午餐（每人1,500泰铢起）",
      "皮皮岛/攀牙湾/甲米/拉查/迈顿燃油附加费（25,000 THB）",
      "船员小费",
      "潜水服务（需另付费）",
      "水下推进器租赁（需另付费）",
    ],
    suppliers: [
      { name: "PL", price: 544000 },
    ],
    notes: [
      "陀螺稳定器防横摇是顶级配置，适合晕船客户",
      "全日游淡季425,500/旺季487,500，含攀牙湾/詹姆斯邦德岛/卡伊+纳卡等",
      "7天6夜套餐最高达3,412,500泰铢（旺季）",
      "过夜最多8人，4间客舱（2间双人+2间双床）",
      "超10人日游每人加2500，燃油附加费25,000另计",
    ],
    faq: [
      { q: "什么是陀螺稳定器？", a: "陀螺稳定器可大幅减少船体横摇，让容易晕船的客人也能舒适享受出海体验。" },
      { q: "最多坐几人？", a: "日间最多20人（超10人每人加2,500泰铢），过夜最多8人。" },
      { q: "全日游可以去哪？", a: "攀牙湾+詹姆斯邦德岛、卡伊+纳卡岛、卡伊+迈顿岛，淡季425,500/旺季487,500。" },
      { q: "可以多日游吗？", a: "支持24小时至7天6夜豪华套餐，价格637,500至3,412,500泰铢（视季节）。" },
      { q: "有潜水服务吗？", a: "可安排，需额外收费。水下推进器租赁也需另付费。" },
    ],
    itinerary: "酒店/别墅/机场接送 → 码头登船 → 攀牙湾/詹姆斯邦德岛/皮皮岛等顶级航线巡游 → 浮潜及水上玩具体验 → 烧烤餐饮 → 返航或过夜",
    materials: [
      "蒙特卡洛86超级游艇实拍图9张",
      "小红书推广文案（超级游艇顶奢版）",
      "朋友圈推广文案",
      "多日游套餐价格表",
      "抖音短视频脚本",
    ],
  },
  {
    id: 30, cat: "yacht", status: "avail",
    name: "Ferretti 80 Sofia豪华游艇", nameEn: "Ferretti 80 Sofia Luxury Yacht",
    emoji: "⛵",
    images: [
      "https://i.ibb.co/hJzP5WhQ/1705553725-1-YACHT-FERRETTI-80-SOFIA-003.jpg",
      "https://i.ibb.co/Xxk99HNf/1705553725-2-YACHT-FERRETTI-80-SOFIA-002.jpg",
      "https://i.ibb.co/Ng68Th0m/1705553725-3-YACHT-FERRETTI-80-SOFIA-004.jpg",
      "https://i.ibb.co/G3B5NVxv/1705553831-4-YACHT-FERRETTI-80-SAFARI-005.jpg",
      "https://i.ibb.co/VyFtX6V/1705553831-5-YACHT-FERRETTI-80-SOFIA-006.jpg",
      "https://i.ibb.co/vvZtS91J/1705553831-7-YACHT-FERRETTI-80-SOFIA-008.jpg",
      "https://i.ibb.co/6R3VXtRF/1705553831-8-YACHT-FERRETTI-80-SOFIA-009.jpg",
      "https://i.ibb.co/Txm42jb8/1705553831-9-YACHT-FERRETTI-80-SOFIA-010.jpg",
    ],
    desc: "Ferretti 80 Sofia豪华游艇，24.5米，2021年翻新，4间客舱可住8人，日间最多25人。含泰式精致午餐+全套水上玩具（充气泳池/SUP/滑水板/钓鱼装备），价格含7%增值税。",
    retail: 190000, agent: 171000, cost: 161500,
    includes: [
      "8小时游艇全程使用",
      "燃油费（按行程）",
      "专业船长/船员/女服务员",
      "免费水/软饮/果汁/茶咖啡/小吃/水果",
      "泰式精致午餐",
      "7%增值税及适用政府税费",
      "充气泳池/2个SUP桨板/拖曳水上沙发/滑水板/跪板",
      "30套浮潜装备/4根底钓竿/2根拖钓竿",
    ],
    excludes: [
      "水上摩托艇（额外10,000 THB/天）",
    ],
    suppliers: [
      { name: "PL", price: 161500 },
    ],
    notes: [
      "价格含7%增值税，报价透明无隐藏费用",
      "含泰式精致午餐是差异化卖点",
      "4间客舱：2间特大床+2间双人床，过夜最多8人",
      "皮皮岛/拉查岛9小时行程193,750为最高价",
      "水上摩托艇需额外加收10,000泰铢/天",
    ],
    faq: [
      { q: "含午餐吗？", a: "含！提供全天泰式精致午餐，这是本船的特色之一。" },
      { q: "最多坐几人？", a: "一日游最多25人，过夜包船最多8人（4间客舱）。" },
      { q: "半日游可以去哪？", a: "半日游4小时可选纳卡岛（112,500）、攀牙湾+宏岛或开岛（118,750）。" },
      { q: "全日游最远去哪？", a: "可选皮皮岛或拉查岛+迈顿岛9小时行程，193,750泰铢。" },
      { q: "有水上摩托艇吗？", a: "有，需额外加收10,000泰铢/天。" },
    ],
    itinerary: "码头登船(09:00) → 巡游选定航线（纳卡岛/攀牙湾/皮皮岛等）→ 浮潜及水上玩具体验 → 泰式精致午餐 → 钓鱼体验 → 返航(17:00/18:00)",
    materials: [
      "Ferretti Sofia游艇实拍图8张",
      "小红书推广文案（含午餐豪华版）",
      "朋友圈推广文案",
      "半日/全日游价格对比表",
    ],
  },
  {
    id: 28, cat: "yacht", status: "avail",
    name: "Princess 65英尺Oceana号游艇", nameEn: "Princess 65ft Oceana Yacht",
    emoji: "⛵",
    images: [
      "https://i.ibb.co/mCkRWqVV/1705984188-1-YACHT-65ft-Princess-Yacht-Oceana-002.jpg",
      "https://i.ibb.co/sfbTd4g/1705984188-2-YACHT-65ft-Princess-Yacht-Oceana-004.jpg",
      "https://i.ibb.co/Zj75Dtw/1705984188-3-YACHT-65ft-Princess-Yacht-Oceana-005.jpg",
      "https://i.ibb.co/CpBkXyWr/1705984188-4-YACHT-65ft-Princess-Yacht-Oceana-007.jpg",
      "https://i.ibb.co/XfvYQsr7/1705984188-5-YACHT-65ft-Princess-Yacht-Oceana-008.jpg",
      "https://i.ibb.co/Mk2p1xJS/1705984188-6-YACHT-65ft-Princess-Yacht-Oceana-009.jpg",
      "https://i.ibb.co/DH14xZxc/1705984188-7-YACHT-65ft-Princess-Yacht-Oceana-010.jpg",
      "https://i.ibb.co/BKjtMnwD/1705984188-8-YACHT-65ft-Princess-Yacht-Oceana-012.jpg",
      "https://i.ibb.co/fWMcPWV/1705984188-9-YACHT-65ft-Princess-Yacht-Oceana-018.jpg",
    ],
    desc: "Princess 65英尺豪华游艇Oceana号，全包套餐含24瓶啤酒+葡萄酒+全套水上玩具（立式桨板/滑水板/香蕉船/拖曳沙发等），多条航线可选，含面包车接送及攀牙湾皮划艇之旅，性价比突出。",
    retail: 180000, agent: 162000, cost: 153000,
    includes: [
      "游艇全程使用",
      "船长/水手/女服务员",
      "软饮+冰块+24瓶啤酒（胜狮/象牌/狮牌/喜力）+1瓶葡萄酒",
      "午餐（一日游）或三餐（过夜游）",
      "水果及小吃",
      "2个立式桨板/1个滑水板/1个跪板/1个拖曳沙发/1个香蕉船",
      "充气游艇泳池、浮潜及钓鱼装备、毛巾",
      "无线网络、Netflix电视、室内外音响、全空调",
      "85马力中控台附属艇",
      "救生衣及意外保险",
      "码头面包车接送",
      "攀牙湾皮划艇之旅",
    ],
    excludes: [
      "国家公园门票",
      "7%增值税",
      "半日包船不含午餐",
      "超10人每人加收1,875泰铢",
      "延长行程（11,000 THB/小时）",
      "水上摩托艇（3,300 THB/小时）",
      "码头搬迁费（11,000-16,500泰铢，视码头而定）",
    ],
    suppliers: [
      { name: "PL", price: 153000 },
    ],
    notes: [
      "全包套餐含酒水及全套水上玩具，性价比突出",
      "价格分淡季(5-10月)/旺季(11-4月)/高峰季(12.15-1.15)三档",
      "卡伊岛111,250起，皮皮岛/甲米/拉查岛161,250-186,250",
      "预订需50%定金，尾款出发前7天付清",
      "取消政策：30天前全退，15-29天退50%，14天内不退",
    ],
    faq: [
      { q: "包含哪些酒水？", a: "含24瓶啤酒（胜狮/象牌/狮牌/喜力）和1瓶葡萄酒，软饮和冰块免费。" },
      { q: "有哪些水上玩具？", a: "2个立式桨板、1个滑水板、1个跪板、1个拖曳沙发、1个香蕉船、充气游艇泳池，全部包含在价格内。" },
      { q: "可以去几个岛？", a: "可选卡伊岛(5H)、卡伊+纳卡岛、攀牙湾、迈顿+卡伊、甲米、拉查+迈顿、皮皮岛(均8H)。" },
      { q: "取消政策是什么？", a: "30天前取消全额退定金，15-29天退50%，14天内不退还。" },
      { q: "超过10人怎么算？", a: "每多1人加收1,875泰铢。" },
    ],
    itinerary: "面包车接送至码头 → 登船出发(09:00-19:00) → 根据航线巡游岛屿 → 浮潜及全套水上玩具体验 → 船上午餐及饮品 → 攀牙湾皮划艇之旅 → 返航",
    materials: [
      "Oceana号游艇实拍图9张",
      "小红书推广文案（全包水上玩具版）",
      "朋友圈推广文案",
      "多航线季节价格对比表",
    ],
  },
  {
    id: 27, cat: "yacht", status: "avail",
    name: "MY Olympia 76英尺豪华游艇", nameEn: "MY Olympia 76ft Luxury Yacht",
    emoji: "⛵",
    images: [
      "https://i.ibb.co/HDD50Xb4/1724386442-1-IMG-2491.jpg",
      "https://i.ibb.co/wFwfyLM6/1724386442-2-IMG-2490.jpg",
      "https://i.ibb.co/84tTdPmp/1724386442-3-IMG-2489.jpg",
      "https://i.ibb.co/xKbWThZp/1724386442-4-IMG-2488.jpg",
      "https://i.ibb.co/F4FYF5TX/1724386442-5-IMG-2487.jpg",
      "https://i.ibb.co/kVGKbP2c/1724386442-6-IMG-2486.jpg",
      "https://i.ibb.co/nMHSSmrC/1724386442-7-IMG-2485.jpg",
      "https://i.ibb.co/Gv5dJf58/1724386442-8-IMG-2484.jpg",
      "https://i.ibb.co/35rpZ5QN/1724386442-9-IMG-2483.jpg",
    ],
    desc: "MY Olympia 76英尺豪华机动游艇，4间客舱5人船员，日间可载20-25人，过夜8人。提供半日/全日/两日一夜/三日两夜豪华套餐，畏皮皮岛、甲米、拉查岛等热门航线，配4.2米附属艇及全套水上玩具。",
    retail: 210000, agent: 189000, cost: 178500,
    includes: [
      "全船4间客舱使用权",
      "燃油（每日3小时以内）",
      "船上设备使用",
      "4.2米附属艇（60马力雅马哈四冲程发动机）",
      "充气玩具/滑水板/水上滑板",
      "免费矿泉水/软饮/新鲜水果",
      "国家公园门票",
      "适用政府税及服务费",
      "普吉岛内往返酒店/别墅/机场交通",
    ],
    excludes: [
      "燃油附加费（如有）",
      "斯米兰群岛附加费（75,000 THB）",
      "21-25人超额费用（2,500 THB/人）",
      "餐饮费用（按需求另定）",
    ],
    suppliers: [
      { name: "PL", price: 178500 },
    ],
    notes: [
      "日间最多25人，过夜最多8人，灯人容量分级明确",
      "半日91,000-198,000，全日191,250-265,625（淡旺峰）",
      "两日一夜361,250-510,000，三日两夜531,250-743,750",
      "周末加收10,000泰铢（旺季及高峰季）",
      "取消政策严格：14天内取消收50%，48小时内全额收取",
      "斯米兰群岛需额外加收75,000泰铢",
    ],
    faq: [
      { q: "最多坐几人？", a: "日间包船20-25人，过夜包船最多8人（4间客舱）。" },
      { q: "去皮皮岛/甲米/拉查岛怎么选？", a: "全日豪华套餐可选皮皮岛、甲米、拉查岛或攀牙+甲米洪等多个选项。" },
      { q: "可以多日游吗？", a: "可以！提供两日一夜（340,000起）和三日两夜（500,000起）豪华套餐，含多个航线选择。" },
      { q: "取消政策是什么？", a: "出发前14天内取消收50%费用，48小时内取消收全额费用，请谨慎安排行程。" },
      { q: "去斯米兰群岛要加钱吗？", a: "需要，额外加收75,000泰铢。" },
    ],
    itinerary: "酒店/别墅/机场接送 → 码头登船 → 根据套餐巡游皮皮岛/甲米/拉查岛等 → 浮潜及水上玩具体验 → 船上餐食 → 返航或过夜",
    materials: [
      "MY Olympia游艇实拍图9张",
      "小红书推广文案（大型团体游艇版）",
      "朋友圈推广文案",
      "多日游套餐价格对比表",
    ],
  },
  {
    id: 26, cat: "yacht", status: "avail",
    name: "宝藏号62英尺豪华游艇", nameEn: "Treasure 62ft Luxury Yacht",
    emoji: "⛵",
    images: [
      "https://i.ibb.co/TxhdHHvc/1736587761-1-IMG-3043.jpg",
      "https://i.ibb.co/zhwLFTXP/1736587761-2-IMG-3046.jpg",
      "https://i.ibb.co/wrg1dvXZ/1736587761-3-IMG-3036.jpg",
      "https://i.ibb.co/HfC1cBND/1736587761-4-IMG-3022.jpg",
      "https://i.ibb.co/m5prjWhs/1736587761-5-IMG-3040.jpg",
      "https://i.ibb.co/DHR3KhpW/1736587761-6-IMG-3026.jpg",
      "https://i.ibb.co/xqNPXB9T/1736587761-8-IMG-3020.jpg",
      "https://i.ibb.co/JW47H3wk/1736587761-9-IMG-3048.jpg",
    ],
    desc: "62英尺豪华游艇宝藏号，提供半日/全日/过夜多种行程，可达珊瑚岛、拉查岛、皮皮岛、甲米四岛等热门航线，淡旺季及高峰季分级定价，灵活满足不同预算客户。",
    retail: 215600, agent: 194040, cost: 183260,
    includes: [
      "专业船长及船员",
      "游艇全程使用",
      "行程内所有岛屿停靠及浮潜",
    ],
    excludes: [
      "餐食（需另外安排）",
      "国家公园门票（视行程而定）",
      "船员小费",
      "燃油附加费（超时另计）",
    ],
    suppliers: [
      { name: "PL", price: 183260 },
    ],
    notes: [
      "价格分淡季(5-10月)/旺季(11-4月)/高峰季(12.20-1.10)三档",
      "半日游上午86,900-103,900 / 下午97,900-141,900（淡旺峰）",
      "全日游106,600-215,600，行程越远价格越高",
      "甲米四岛/詹姆斯邦德岛是最高价行程，适合追求新鲜感的客户",
      "可根据客户预算灵活推荐不同航线",
    ],
    faq: [
      { q: "半日游和全日游怎么选？", a: "半日游5小时去珊瑚岛性价比高；全日游8小时可去更远的皮皮岛、拉查岛、甲米四岛等。" },
      { q: "价格为什么差这么多？", a: "价格分淡季(5-10月)、旺季(11-4月)、高峰季(12.20-1.10)三档，行程越远、季节越旺价格越高。" },
      { q: "可以去甲米吗？", a: "可以！全日游可选甲米路线：洪岛+帕克比亚岛、凯岛+塔莱瓦克岛+波达岛，或詹姆斯邦德岛+洪岛。" },
      { q: "可以过夜吗？", a: "支持过夜行程，价格根据季节另行报价。" },
    ],
    itinerary: "码头登船 → 根据所选航线巡游（珊瑚岛/拉查岛/皮皮岛/甲米四岛等）→ 浮潜及岛屿停靠 → 船上休闲 → 返航",
    materials: [
      "宝藏号游艇实拍图8张",
      "小红书推广文案（多航线选择版）",
      "朋友圈推广文案",
      "淡旺峰季价格对比表",
    ],
  },
  {
    id: 25, cat: "yacht", status: "avail",
    name: "安菲尔德公主V39游艇", nameEn: "Anfield Princess V39 Yacht",
    emoji: "⛵",
    images: [
      "https://i.ibb.co/4wg6J6nD/1704515219-1-Yacht-ANFIELD-Princess-V39-001.jpg",
      "https://i.ibb.co/MxBJHCQY/1704515219-2-Yacht-ANFIELD-Princess-V39-002.jpg",
      "https://i.ibb.co/LGswSfd/1704515219-3-Yacht-ANFIELD-Princess-V39-003.jpg",
      "https://i.ibb.co/xtHLnDsR/1704515219-4-Yacht-ANFIELD-Princess-V39-004.jpg",
      "https://i.ibb.co/VYzBwjFS/1704515219-5-Yacht-ANFIELD-Princess-V39-005.jpg",
      "https://i.ibb.co/yn5qKMLN/1704515219-6-Yacht-ANFIELD-Princess-V39-006.jpg",
      "https://i.ibb.co/hRzPwF6s/1704515219-7-Yacht-ANFIELD-Princess-V39-007.jpg",
      "https://i.ibb.co/4wmCqVZP/1704515219-8-Yacht-ANFIELD-Princess-V39-008.jpg",
      "https://i.ibb.co/WvDTV89t/1704515219-9-Yacht-ANFIELD-Princess-V39-009.jpg",
    ],
    desc: "Princess V39游艇，2间客舱1间浴室，空调，最多6人。半日游可达卡伊岛/纳卡岛，全日游可达攀牙湾、皮皮岛、拉查岛等热门航线，配液压升降游泳平台及全套水上玩具。",
    retail: 123750, agent: 111375, cost: 105188,
    includes: [
      "游艇全程使用",
      "码头接送",
      "专业船长及船员",
      "水果/小吃/软饮/啤酒/饮用水",
      "国家公园门票",
      "浮潜装备/毛巾/救生衣",
      "保险",
      "液压升降游泳平台、烧烤设施、甲板淋浴",
      "蓝牙音乐、4G Wi-Fi",
      "RIB快艇、SUP桨板、漂浮躺椅、浮潜装备",
    ],
    excludes: [
      "午餐（每人1000泰铢起）",
      "船员小费",
      "燃油附加费（每日超4小时，每小时12,500泰铢）",
      "钓鱼装备（可应要求提供）",
    ],
    suppliers: [
      { name: "PL", price: 105188 },
    ],
    notes: [
      "全日游价格：5-10月111,250 / 11-4月123,750（旺季溢价约11%）",
      "半日游价格：5-10月95,000 / 11-4月105,000",
      "全日游8小时，10:00-18:00",
      "最多6人，紧凑型游艇适合小团体",
      "配液压游泳平台是差异化卖点",
    ],
    faq: [
      { q: "最多坐几人？", a: "2间客舱1浴室，最多6人，适合小家庭或朋友聚会。" },
      { q: "全日游可以去哪些地方？", a: "攀牙湾、甲米宏岛、皮皮岛、拉查岛、迈顿岛、凯岛等热门航线，8小时10:00-18:00。" },
      { q: "半日游可以去哪？", a: "卡伊岛和纳卡岛，适合不想太累的轻松出海。" },
      { q: "午餐含吗？", a: "不含，每人约1000泰铢起，可代订。" },
      { q: "有什么水上玩具？", a: "RIB快艇、SUP桨板、漂浮躺椅、浮潜装备，钓鱼装备可应要求提供。" },
    ],
    itinerary: "码头接送登船 → 攀牙湾/皮皮岛/拉查岛巡游 → 浮潜及岛屿停靠 → 甲板烧烤/小吃 → 液压平台游泳 → 返航",
    materials: [
      "Princess V39游艇实拍图9张",
      "小红书推广文案（小团体一日游版）",
      "朋友圈推广文案",
      "半日游/全日游价格对比表",
    ],
  },
  {
    id: 24, cat: "yacht", status: "avail",
    name: "Happy Ours 58英尺豪华游艇", nameEn: "Happy Ours 58ft Luxury Yacht",
    emoji: "⛵",
    images: [
      "https://i.ibb.co/nsy0pWt4/1707707631-3-MDP-335.jpg",
      "https://i.ibb.co/xtjd7DX7/1707707361-2-MDP-257.jpg",
      "https://i.ibb.co/p8GQkZR/1707707720-4-MDP-128.jpg",
      "https://i.ibb.co/MxH5rHNB/1707708313-5-MDP-169.jpg",
      "https://i.ibb.co/KcKHP0zF/1707708389-6-MDP-805.jpg",
      "https://i.ibb.co/qFLGHWkw/1707708482-7-MDP-21.jpg",
      "https://i.ibb.co/5Xn7xrR6/1707708630-8-MDP-105.jpg",
    ],
    desc: "Happy Ours 58英尺豪华游艇，可选半天/全天包船，畏攀牙湾、卡伊岛、纳卡岛等多条经典航线，标准载客8人，适合多人聚会及一日游出海。",
    retail: 150000, agent: 135000, cost: 127500,
    includes: [
      "全天8小时或半天4小时包船",
      "标准载客8人",
      "宣传册标注的全套服务",
      "船长及船员服务",
    ],
    excludes: [
      "皮皮岛/拉查岛/甲米四岛燃油附加费（37,500 THB）",
      "9-12人超额费用（2,500 THB/人）",
      "过夜行程（24H加收100,000 THB，32H另计）",
      "钓鱼行程（额外20,000 THB，含4根鱼竿及鱼饵）",
    ],
    suppliers: [
      { name: "PL", price: 127500 },
    ],
    notes: [
      "价格随季节波动：12.15-1.15旺季全天150,000；11.1-12.14及1.16-4.31为140,000；5.1-10.31淡季120,000",
      "半天统一95,000（淡季80,000）",
      "皮皮岛/拉查岛/甲米四岛需加收燃油附加费37,500",
      "标准8人，9-12人每人加收2,500",
      "可选过夜行程（含2卧2卫+三餐）及钓鱼行程",
    ],
    faq: [
      { q: "半天和全天有什么区别？", a: "半天4小时可游攀牙湾/卡伊岛/纳卡岛；全天8小时可去更远的瑶亚岛、皮皮岛、甲米四岛等。" },
      { q: "去皮皮岛要加钱吗？", a: "是的，皮皮岛/拉查岛/甲米四岛需加收37,500泰铢燃油附加费。" },
      { q: "最多坐几人？", a: "标准8人，9-12人大团体每人加收2,500泰铢。" },
      { q: "可以过夜吗？", a: "可以，24小时过夜行程加收100,000泰铢（最多4人，含2卧2卫三餐）。" },
      { q: "可以钓鱼吗？", a: "可以，额外20,000泰铢，含4根鱼竿和鱼饵。" },
    ],
    itinerary: "码头登船 → 攀牙湾/卡伊岛/纳卡岛巡游 → 浮潜及岛屿停靠 → 船上餐食 → 返航",
    materials: [
      "Happy Ours游艇实拍图7张",
      "小红书推广文案（一日游版）",
      "朋友圈推广文案",
      "季节价格对比表",
    ],
  },
  {
    id: 23, cat: "yacht", status: "avail",
    name: "Demarest 106英尺豪华游艇", nameEn: "Demarest 106ft Luxury Yacht",
    emoji: "⛵",
    images: [
      "https://i.ibb.co/Kcbxmgqy/1708325708-2-LINE-ALBUM-1922024-18.jpg",
      "https://i.ibb.co/0pb5hmpp/1708325708-3-LINE-ALBUM-1922024-13.jpg",
      "https://i.ibb.co/tMTwcQd1/1708325744-4-LINE-ALBUM-1922024-10.jpg",
      "https://i.ibb.co/xKwPP4p4/1708325744-5-LINE-ALBUM-1922024-12.jpg",
      "https://i.ibb.co/nNBbsP4d/1708325798-6-LINE-ALBUM-1922024-8.jpg",
      "https://i.ibb.co/3yr3L087/1708325798-7-LINE-ALBUM-1922024-11.jpg",
      "https://i.ibb.co/5h2fnwwS/1708325798-8-LINE-ALBUM-1922024-3.jpg",
      "https://i.ibb.co/6cRt8NfM/1708325798-9-LINE-ALBUM-1922024-7.jpg",
      "https://i.ibb.co/B5MhSc10/f-k-l-d-h-j-l-k-f-g-h-g-h.jpg",
    ],
    desc: "106英尺豪华游艇Demarest，2002年建造2019年翻新，5间客舱可住12位宾客，6人专业船员。配备水上摩托艇、香蕉船、滑水、浮潜装备等全套水上玩具，全天畅玩安达曼海。",
    retail: 570000, agent: 513000, cost: 484500,
    includes: [
      "专业船长及6名船员",
      "船上所有设施使用权",
      "小吃/水果/矿泉水/软饮/咖啡/茶",
      "沙滩巾、浮潜装备",
      "船上所有餐食",
      "无线网络、安全设备",
      "燃油（4小时发动机使用）",
      "水上摩托艇、接驳艇",
      "国家公园门票",
      "水上摩托艇/甜甜圈/香蕉船/立式桨板/滑水等水上玩具",
    ],
    excludes: [
      "7%增值税",
      "超过4小时后的燃油附加费",
      "船员小费",
    ],
    suppliers: [
      { name: "PL", price: 484500 },
    ],
    notes: [
      "供应商PL，享受市场价85%成本/90%代理价",
      "5间客舱12人豪华配置，适合家庭/朋友多日包船",
      "旺季（12.15-1.15）价格上浮，需注意季节定价",
      "全套水上玩具是核心卖点",
      "客户实际报价需按季节调整，此处为基准价",
    ],
    faq: [
      { q: "可以玩多久？", a: "标准4小时发动机使用，超时需另付燃油附加费。" },
      { q: "最多坐几人？", a: "5间客舱可住12位宾客，配6人专业船员。" },
      { q: "有哪些水上项目？", a: "水上摩托艇、甜甜圈、香蕉船、立式桨板、滑水、浮潜、钓鱼等一应俱全。" },
      { q: "价格含税吗？", a: "不含7%增值税及船员小费，需另计。" },
    ],
    itinerary: "码头登船 → 安达曼海巡航 → 国家公园岛屿浮潜 → 水上玩具体验 → 船上精致餐食 → 日落返航",
    materials: [
      "Demarest游艇官方实拍图9张",
      "小红书推广文案（豪华游艇版）",
      "朋友圈推广文案",
      "多日包船专属方案",
    ],
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
    id: 29, cat: "villa", status: "avail",
    name: "卡马拉静谧私人海滩别墅", nameEn: "Kamala Private Beach Villa",
    emoji: "🏛️",
    images: [
      "https://i.ibb.co/TMfrYss0/photo-2026-06-14-00-49-36.jpg",
      "https://i.ibb.co/sdF1Q2RS/photo-2026-06-14-00-49-37.jpg",
      "https://i.ibb.co/hJKhVdLg/photo-2026-06-14-00-49-38-2.jpg",
      "https://i.ibb.co/pBvKk1Vd/photo-2026-06-14-00-49-38.jpg",
      "https://i.ibb.co/cK00KWys/photo-2026-06-14-00-49-39.jpg",
      "https://i.ibb.co/zhDPhPwB/photo-2026-06-14-00-49-40.jpg",
      "https://i.ibb.co/DfbPwTFJ/photo-2026-06-14-00-49-41-2.jpg",
      "https://i.ibb.co/pBJnQC2C/photo-2026-06-14-00-49-41.jpg",
      "https://i.ibb.co/N8PpMYB/photo-2026-06-14-00-49-42.jpg",
      "https://i.ibb.co/XfhCkfF0/photo-2026-06-14-00-49-43.jpg",
      "https://i.ibb.co/1t3TtfQB/photo-2026-06-14-00-49-44-2.jpg",
      "https://i.ibb.co/N2cwgyT2/photo-2026-06-14-00-49-44.jpg",
      "https://i.ibb.co/gFjPgSgW/photo-2026-06-14-00-49-45.jpg",
      "https://i.ibb.co/h1sNr6cW/photo-2026-06-14-00-49-46-2.jpg",
      "https://i.ibb.co/YGzSdxH/photo-2026-06-14-00-49-46.jpg",
      "https://i.ibb.co/5hWTZPGx/photo-2026-06-14-00-49-47.jpg",
      "https://i.ibb.co/kV92Xw9K/photo-2026-06-14-00-49-48-2.jpg",
      "https://i.ibb.co/BH4tVW6F/photo-2026-06-14-00-49-48.jpg",
      "https://i.ibb.co/B5vZXTRB/photo-2026-06-14-00-49-49.jpg",
      "https://i.ibb.co/8LkzSKD9/photo-2026-06-14-00-49-50-2.jpg",
      "https://i.ibb.co/7x0hzgkc/photo-2026-06-14-00-49-50.jpg",
      "https://i.ibb.co/kgRSksbT/photo-2026-06-14-00-49-51.jpg",
      "https://i.ibb.co/ns6zrc5W/photo-2026-06-14-00-49-52.jpg",
      "https://i.ibb.co/mVD5tXKv/photo-2026-06-14-00-49-53-2.jpg",
      "https://i.ibb.co/5g3yL9Xb/photo-2026-06-14-00-49-53.jpg",
      "https://i.ibb.co/NgXKbg8B/photo-2026-06-14-00-49-54.jpg",
    ],
    desc: "卡马拉富豪街五卧豪华海滨别墅，普吉岛西部少有的私人沙滩别墅，直达沙滩，水晶蓝泳池横跨露台，坐拥碧绿海湾全景。全职厨师+管家+保洁五星级服务，可住10人。",
    retail: 44000, agent: 41500, cost: 39000,
    includes: [
      "每日早餐",
      "全职多语言管家24H在线",
      "全职保洁员每日清洁",
      "全职厨师服务",
      "私人沙滩使用权",
      "水晶蓝泳池+泳池露台",
      "无线网络",
      "投影屏幕客厅",
      "10人室内用餐区",
    ],
    excludes: [
      "电费（8泰铢/度）",
      "午晚餐食材费用",
      "游艇之旅（需另付费）",
      "高尔夫球场（需另付费）",
    ],
    suppliers: [
      { name: "SSC", price: 39000 },
    ],
    notes: [
      "普吉岛西部少有私人沙滩别墅，稀缺性强",
      "卡马拉富豪街安全庄园内，私密安全",
      "适合携带儿童家庭、蜜月及特别活动",
      "含全职厨师是核心卖点，五星服务",
      "可承接特别活动如婚礼、生日派对",
    ],
    faq: [
      { q: "有私人沙滩吗？", a: "有！这是普吉岛西部少有的带私人沙滩别墅，可直接从别墅走到沙滩。" },
      { q: "最多住几人？", a: "5间卧室可住10人（1间主套房+4间客房，均配1.8米双人床）。" },
      { q: "含早餐吗？", a: "含每日早餐，全职厨师提供，另可安排午晚餐（食材费用另计）。" },
      { q: "电费怎么算？", a: "8泰铢/度，按实际用量结算。" },
      { q: "适合什么活动？", a: "非常适合家庭度假、蜜月、特别活动及企业招待，私人沙滩可举办私人聚会。" },
    ],
    itinerary: "管家迎接入住 → 私人沙滩漫步 → 水晶蓝泳池休闲 → 厨师定制晚宴 → 日落海湾全景欣赏",
    materials: [
      "别墅高清实拍图26张",
      "小红书推广文案（私人沙滩版）",
      "朋友圈推广文案",
      "蜜月/家庭度假专属方案",
      "抖音短视频脚本",
    ],
  },
  {
    id: 22, cat: "villa", status: "avail",
    name: "奈涵亭海之梦别墅", nameEn: "Ting Hai no Yume Naiharn Villa",
    emoji: "🏛️",
    images: [
      "https://i.ibb.co/4nmh416r/photo-2026-06-11-04-05-23.jpg",
      "https://i.ibb.co/nNv9Ct0c/photo-2026-06-11-04-05-24.jpg",
      "https://i.ibb.co/Y43sDx6c/photo-2026-06-11-04-05-25-2.jpg",
      "https://i.ibb.co/hJJ95vfh/photo-2026-06-11-04-05-25.jpg",
      "https://i.ibb.co/ksxwGHGg/photo-2026-06-11-04-05-26.jpg",
      "https://i.ibb.co/67zCF10M/photo-2026-06-11-04-05-27-2.jpg",
      "https://i.ibb.co/HLb2xK1M/photo-2026-06-11-04-05-27.jpg",
      "https://i.ibb.co/fVXQqVJK/photo-2026-06-11-04-05-28.jpg",
      "https://i.ibb.co/4575MpQ/photo-2026-06-11-04-05-29.jpg",
      "https://i.ibb.co/Xcxmgs5/photo-2026-06-11-04-05-30-2.jpg",
      "https://i.ibb.co/qFdLd0xS/photo-2026-06-11-04-05-30.jpg",
      "https://i.ibb.co/JRKJfNLQ/photo-2026-06-11-04-05-31.jpg",
      "https://i.ibb.co/pjKGpLRm/photo-2026-06-11-04-05-32-2.jpg",
      "https://i.ibb.co/rKr1HknM/photo-2026-06-11-04-05-32.jpg",
      "https://i.ibb.co/hF66r0gy/photo-2026-06-11-04-05-33.jpg",
      "https://i.ibb.co/pjGp8LnZ/photo-2026-06-11-04-05-34-2.jpg",
      "https://i.ibb.co/FkkVYZjx/photo-2026-06-11-04-05-34.jpg",
      "https://i.ibb.co/7txbB9jp/photo-2026-06-11-04-05-35-2.jpg",
      "https://i.ibb.co/TzSx8dJ/photo-2026-06-11-04-05-35.jpg",
      "https://i.ibb.co/RpmQvpxX/photo-2026-06-11-04-05-36.jpg",
      "https://i.ibb.co/y7GwkDN/photo-2026-06-11-04-05-37.jpg",
      "https://i.ibb.co/tMk35NXg/photo-2026-06-11-04-05-38-2.jpg",
      "https://i.ibb.co/jkc4PLNj/photo-2026-06-11-04-05-38.jpg",
      "https://i.ibb.co/27k7mCqZ/photo-2026-06-11-04-05-39.jpg",
      "https://i.ibb.co/tp9gN6Lp/photo-2026-06-11-04-05-40-2.jpg",
      "https://i.ibb.co/DgH129Vj/photo-2026-06-11-04-05-40.jpg",
      "https://i.ibb.co/ZzLpL9qp/photo-2026-06-11-04-05-41.jpg",
      "https://i.ibb.co/Xfy6PS4x/photo-2026-06-11-04-05-42.jpg",
    ],
    desc: "拉威与奈涵之间独立高档别墅区，1350㎡宽敞空间，步行10分钟奈涵海滩，4卧5卫每间含浴缸，BBQ户外区+泳池凉亭，天然氧吧热带园林。",
    retail: 12500, agent: 11500, cost: 10500,
    includes: [
      "中英泰三语管家服务",
      "洗漱用品全套（牙刷/牙膏/沐浴露/护发素/拖鞋/浴巾）",
      "每间卧室独立卫生间含浴缸",
      "私人泳池+泳池凉亭",
      "BBQ户外用餐区",
      "全屋Wi-Fi",
    ],
    excludes: [
      "电费（7泰铢/度，实拍电表）",
      "押金（10,000 THB，退房退还）",
      "漂浮早餐/下午茶（3,000 THB/次）",
      "厨师服务（3,000 THB/餐）",
      "机场接送（需另付费）",
      "超额入住（500 THB/位/晚）",
      "加床（1,000 THB/晚）",
    ],
    suppliers: [
      { name: "JH", price: 10500 },
    ],
    notes: [
      "步行10分钟奈涵海滩，从后门走更近",
      "1350㎡超大面积，同价位罕见",
      "利润空间合理（11500-10500=1000）",
      "适合家庭度假、蜜月、小型聚会",
      "延迟退房1000泰铢/小时，超4小时全天收费",
    ],
    faq: [
      { q: "距离奈涵海滩多远？", a: "步行约10分钟（走别墅后门更近），是普吉岛最美海滩之一。" },
      { q: "最多住几人？", a: "标准8人，超出500泰铢/位/晚，可加床1000泰铢/晚。" },
      { q: "有厨师服务吗？", a: "有，3000泰铢/餐，可做泰餐/中餐/BBQ，需提前预约。" },
      { q: "周边有什么？", a: "步行6-8分钟7-11和租车店，附近有海景米其林餐厅、拉威海鲜市场、普吉大佛。" },
      { q: "电费怎么算？", a: "7泰铢/度，入退房实拍电表，押金1万泰铢可抵扣。" },
    ],
    itinerary: "管家迎接入住 → 泳池凉亭放松 → 步行奈涵海滩日落 → BBQ晚宴 → 次日拉威海鲜市场早市",
    materials: [
      "别墅高清实拍图28张",
      "小红书推广文案（奈涵海滩版）",
      "朋友圈推广文案",
      "蜜月/家庭度假专属方案",
      "抖音短视频脚本",
    ],
  },
  {
    id: 21, cat: "villa", status: "avail",
    name: "班涛柒月Laguna别墅", nameEn: "Radi Pool Villas Bangtao",
    emoji: "🏛️",
    images: [
      "https://i.ibb.co/MxjDS80n/photo-2026-06-11-03-44-35.jpg",
      "https://i.ibb.co/DfCf7KX3/photo-2026-06-11-03-44-36.jpg",
      "https://i.ibb.co/6c5WfpCv/photo-2026-06-11-03-44-37.jpg",
      "https://i.ibb.co/gLFd0sL4/photo-2026-06-11-03-44-38-2.jpg",
      "https://i.ibb.co/SDsvD54c/photo-2026-06-11-03-44-38.jpg",
      "https://i.ibb.co/jkvGYBHt/photo-2026-06-11-03-44-39.jpg",
      "https://i.ibb.co/FLcRczNH/photo-2026-06-11-03-44-40-2.jpg",
      "https://i.ibb.co/VY8kMvW1/photo-2026-06-11-03-44-40.jpg",
      "https://i.ibb.co/kgVZtLhK/photo-2026-06-11-03-44-41.jpg",
      "https://i.ibb.co/wZmjMN8F/photo-2026-06-11-03-44-42-2.jpg",
      "https://i.ibb.co/hx3rmyDz/photo-2026-06-11-03-44-42.jpg",
      "https://i.ibb.co/sJbDXDD3/photo-2026-06-11-03-44-43.jpg",
      "https://i.ibb.co/SwchpXRx/photo-2026-06-11-03-44-44.jpg",
      "https://i.ibb.co/gLgXXmgx/photo-2026-06-11-03-44-45-2.jpg",
      "https://i.ibb.co/Y4wB78Qw/photo-2026-06-11-03-44-45.jpg",
      "https://i.ibb.co/LzG4cY32/photo-2026-06-11-03-44-46.jpg",
      "https://i.ibb.co/JRsWQ118/photo-2026-06-11-03-44-47-2.jpg",
      "https://i.ibb.co/VcNs9Vxq/photo-2026-06-11-03-44-47.jpg",
      "https://i.ibb.co/vxHjJB9p/photo-2026-06-11-03-44-48.jpg",
      "https://i.ibb.co/k2hWS4bV/photo-2026-06-11-03-44-49.jpg",
      "https://i.ibb.co/FbKfxxSL/photo-2026-06-11-03-44-50-2.jpg",
      "https://i.ibb.co/rGxkvpvH/photo-2026-06-11-03-44-50.jpg",
      "https://i.ibb.co/j9XP9cnn/photo-2026-06-11-03-44-51.jpg",
      "https://i.ibb.co/8gPXpyzG/photo-2026-06-11-03-44-52.jpg",
    ],
    desc: "班涛富人区Radi Pool Villas，24小时安保，4卧4卫每间带浴缸，私人泳池，步行5分钟7-11。同区16套别墅可合并接待100+人团建，紧邻Laguna国际度假区。",
    retail: 20000, agent: 18500, cost: 17500,
    includes: [
      "全天候多语言管家服务",
      "24小时安保",
      "私人泳池（每日循环8小时）",
      "开放式厨房全套厨具",
      "全屋极速Wi-Fi",
      "洗漱用品全套",
      "每间卧室独立卫生间含浴缸",
    ],
    excludes: [
      "电费（7泰铢/度，实拍电表）",
      "押金（10,000 THB，退房退还）",
      "机场接送（付费）",
      "包车/出海（付费）",
      "漂浮早餐/下午茶（3,000 THB/次）",
      "厨师服务（3,000 THB/餐）",
      "超额入住（1,000 THB/位/晚）",
    ],
    suppliers: [
      { name: "JH", price: 17500 },
    ],
    notes: [
      "同区16套别墅可合并，最多100+人团建",
      "紧邻Laguna国际度假区，班涛/Layan海滩5-8分钟",
      "每间卧室含浴缸是差异化卖点",
      "机场仅20分钟，交通极便利",
      "步行5分钟7-11，周边配套成熟",
    ],
    faq: [
      { q: "入住退房时间？", a: "15:00后入住，12:00前退房。延迟退房2000泰铢/小时，超2小时按一天收费。" },
      { q: "最多住几人？", a: "标准8人，超出1000泰铢/位/晚，可加气垫床1500泰铢/晚。" },
      { q: "距离海滩多远？", a: "Laguna海滩5分钟，Bangtao海滩8分钟，Layan海滩约10分钟。" },
      { q: "可以办大型团建吗？", a: "可以！同区16套别墅可合并，最多接待100+人，提前联系管家安排。" },
      { q: "周边有什么好玩的？", a: "步行可达Boat Avenue购物街，附近有Catch Beach Club、Blue Tree水上乐园、大象保护营、三大班涛夜市。" },
    ],
    itinerary: "管家迎接入住 → 私人泳池休闲 → 步行Boat Avenue购物街 → Laguna国际度假区探索 → Catch Beach Club夜生活",
    materials: [
      "别墅高清实拍图24张",
      "小红书推广文案（班涛富人区版）",
      "朋友圈推广文案",
      "100人团建专属方案",
      "抖音短视频脚本",
    ],
  },
  {
    id: 20, cat: "villa", status: "avail",
    name: "卡马拉Sky6号海景别墅", nameEn: "Kamala Sky Villa No.6",
    emoji: "🏛️",
    images: [
      "https://i.ibb.co/1JmWFbsN/photo-2026-06-10-00-42-33.jpg",
      "https://i.ibb.co/60VYcHc8/photo-2026-06-10-00-42-34.jpg",
      "https://i.ibb.co/FLxRnj84/photo-2026-06-10-00-42-35-2.jpg",
      "https://i.ibb.co/mQzHzWJ/photo-2026-06-10-00-42-35.jpg",
      "https://i.ibb.co/0yQCnHVT/photo-2026-06-10-00-42-36.jpg",
      "https://i.ibb.co/PZGwSqYz/photo-2026-06-10-00-42-37-2.jpg",
      "https://i.ibb.co/tM8Dxz1c/photo-2026-06-10-00-42-37.jpg",
      "https://i.ibb.co/SDmDz4fk/photo-2026-06-10-00-42-38.jpg",
      "https://i.ibb.co/pr4pzcJm/photo-2026-06-10-00-42-39.jpg",
      "https://i.ibb.co/m5CgxF5Z/photo-2026-06-10-00-42-40-2.jpg",
      "https://i.ibb.co/gMmr6sQZ/photo-2026-06-10-00-42-40.jpg",
      "https://i.ibb.co/RpCY0yX5/photo-2026-06-10-00-42-41.jpg",
      "https://i.ibb.co/KxdW6pZF/photo-2026-06-10-00-42-42.jpg",
      "https://i.ibb.co/qM0YFWk5/photo-2026-06-10-00-42-43-2.jpg",
      "https://i.ibb.co/QvY2sLg1/photo-2026-06-10-00-42-43.jpg",
      "https://i.ibb.co/Wvdg59nh/photo-2026-06-10-00-42-44.jpg",
      "https://i.ibb.co/wFw5Xjs0/photo-2026-06-10-00-42-45.jpg",
      "https://i.ibb.co/jvNBfXc1/photo-2026-06-10-00-42-46-2.jpg",
      "https://i.ibb.co/WWqckShk/photo-2026-06-10-00-42-46.jpg",
      "https://i.ibb.co/Q7TBr4nR/photo-2026-06-10-00-42-47.jpg",
      "https://i.ibb.co/QvSfbsNx/photo-2026-06-10-00-42-48.jpg",
      "https://i.ibb.co/M5pffhqt/photo-2026-06-10-00-42-49-2.jpg",
      "https://i.ibb.co/Lhvr1Ncg/photo-2026-06-10-00-42-49.jpg",
      "https://i.ibb.co/GfztDVwK/photo-2026-06-10-00-42-50.jpg",
      "https://i.ibb.co/xSbNm7zP/photo-2026-06-10-00-42-51.jpg",
      "https://i.ibb.co/4nFtsgTr/photo-2026-06-10-00-38-03.jpg",
    ],
    desc: "卡马拉富人区The Exclusive Sky 6号，4卧5卫可住8人，海景私人泳池12×3米，主卧配浴缸，同区12套可合并接待100+人团建。芭东10分钟，卡马拉海滩8分钟。",
    retail: 22500, agent: 21000, cost: 19500,
    includes: [
      "每日免费早餐（中式/泰式/美式）",
      "每日保姆清洁（8:30-17:30）",
      "免费洗衣服务",
      "免费私人停车位",
      "每日矿泉水及咖啡",
      "洗漱用品全套",
      "中英泰三语管家服务",
      "私人海景泳池（12×3米）",
      "开放式厨房全套厨具",
      "全屋极速Wi-Fi",
    ],
    excludes: [
      "电费（7泰铢/度）",
      "押金（10,000 THB，退房退还）",
      "漂浮早餐/下午茶（3,000 THB/次）",
      "厨师服务（3,000 THB/餐）",
      "超额入住（1,000 THB/位/晚）",
      "延迟退房（2,000 THB/小时）",
    ],
    suppliers: [
      { name: "JH", price: 19500 },
    ],
    notes: [
      "与1-5号同配置，主卧含浴缸",
      "同区12套别墅可合并，最多100+人团建",
      "可与1-5号打包推荐",
      "5岁内小朋友2位免费",
      "住7天以上免费全屋清洁一次",
    ],
    faq: [
      { q: "和其他Sky别墅有什么区别？", a: "6号配置与1-5号基本相同，主卧含浴缸，可组合预订满足更多人入住需求。" },
      { q: "最多住几人？", a: "标准8人，超出1000泰铢/位/晚，可加气垫床1500泰铢/晚。" },
      { q: "可以多套一起预订吗？", a: "可以！同区12套别墅可合并，最多接待100+人，非常适合大型团建。" },
      { q: "距离海滩多远？", a: "卡马拉海滩8分钟，芭东海滩10分钟，芭东酒吧街15分钟。" },
      { q: "电费怎么算？", a: "7泰铢/度，出门请关空调和灯，押金1万泰铢可抵扣。" },
    ],
    itinerary: "管家迎接入住 → 欢迎水果咖啡 → 海景泳池休闲 → 驾车10分钟芭东海滩 → 可选私厨晚宴或周边餐厅",
    materials: [
      "别墅高清实拍图26张",
      "小红书推广文案（卡马拉富人区版）",
      "1-6号打包团建方案",
      "朋友圈推广文案",
      "抖音短视频脚本",
    ],
  },
  {
    id: 19, cat: "villa", status: "avail",
    name: "卡马拉Sky5号海景别墅", nameEn: "Kamala Sky Villa No.5",
    emoji: "🏛️",
    images: [
      "https://i.ibb.co/hFX1rZXk/photo-2026-06-10-00-37-45.jpg",
      "https://i.ibb.co/jvTrX39h/photo-2026-06-10-00-37-46.jpg",
      "https://i.ibb.co/C3ZhT62K/photo-2026-06-10-00-37-47-2.jpg",
      "https://i.ibb.co/M5p2XtTw/photo-2026-06-10-00-37-47.jpg",
      "https://i.ibb.co/bgwPT9Cd/photo-2026-06-10-00-37-48.jpg",
      "https://i.ibb.co/whZJWc58/photo-2026-06-10-00-37-49-2.jpg",
      "https://i.ibb.co/0RsPBNTt/photo-2026-06-10-00-37-49.jpg",
      "https://i.ibb.co/x8f7L4rR/photo-2026-06-10-00-37-50.jpg",
      "https://i.ibb.co/1trdx1rf/photo-2026-06-10-00-37-51-2.jpg",
      "https://i.ibb.co/TxYgdYVW/photo-2026-06-10-00-37-51.jpg",
      "https://i.ibb.co/G3cwNMQF/photo-2026-06-10-00-37-52.jpg",
      "https://i.ibb.co/TBqp42N4/photo-2026-06-10-00-37-53.jpg",
      "https://i.ibb.co/XksVs4Gt/photo-2026-06-10-00-37-54-2.jpg",
      "https://i.ibb.co/QFP2xmN5/photo-2026-06-10-00-37-54.jpg",
      "https://i.ibb.co/mCTf7z6t/photo-2026-06-10-00-37-55-2.jpg",
      "https://i.ibb.co/Dg7bwrT9/photo-2026-06-10-00-37-55.jpg",
      "https://i.ibb.co/mFHd0Ccz/photo-2026-06-10-00-37-56.jpg",
      "https://i.ibb.co/p6bGPwPn/photo-2026-06-10-00-37-57-2.jpg",
      "https://i.ibb.co/B57wPrk0/photo-2026-06-10-00-37-57.jpg",
      "https://i.ibb.co/4wSWxQfq/photo-2026-06-10-00-37-58.jpg",
      "https://i.ibb.co/Q3ns9n0K/photo-2026-06-10-00-37-59-2.jpg",
      "https://i.ibb.co/Y4CnfL1C/photo-2026-06-10-00-37-59.jpg",
      "https://i.ibb.co/SDbxTqbY/photo-2026-06-10-00-38-00.jpg",
      "https://i.ibb.co/Q7Wp73Qn/photo-2026-06-10-00-38-01.jpg",
      "https://i.ibb.co/4nFtsgTr/photo-2026-06-10-00-38-03.jpg",
    ],
    desc: "卡马拉富人区The Exclusive Sky 5号，4卧5卫可住8人，海景私人泳池12×3米，主卧配浴缸，同区12套可合并接待100+人团建。芭东10分钟，卡马拉海滩8分钟。",
    retail: 22500, agent: 21000, cost: 19500,
    includes: [
      "每日免费早餐（中式/泰式/美式）",
      "每日保姆清洁（8:30-17:30）",
      "免费洗衣服务",
      "免费私人停车位",
      "每日矿泉水及咖啡",
      "洗漱用品全套",
      "中英泰三语管家服务",
      "私人海景泳池（12×3米）",
      "开放式厨房全套厨具",
      "全屋极速Wi-Fi",
    ],
    excludes: [
      "电费（7泰铢/度）",
      "押金（10,000 THB，退房退还）",
      "漂浮早餐/下午茶（3,000 THB/次）",
      "厨师服务（3,000 THB/餐）",
      "超额入住（1,000 THB/位/晚）",
      "延迟退房（2,000 THB/小时）",
    ],
    suppliers: [
      { name: "JH", price: 19500 },
    ],
    notes: [
      "与1-4号同配置，主卧含浴缸",
      "同区12套别墅可合并，最多100+人团建",
      "可与1-4号打包推荐，享团建优惠",
      "5岁内小朋友2位免费",
      "住7天以上免费全屋清洁一次",
    ],
    faq: [
      { q: "和其他Sky别墅有什么区别？", a: "5号主卧配备浴缸，其他配置与1-4号相同，可组合预订。" },
      { q: "最多住几人？", a: "标准8人，超出1000泰铢/位/晚，可加气垫床1500泰铢/晚。" },
      { q: "可以多套一起预订吗？", a: "可以！同区12套别墅可合并，最多接待100+人，非常适合大型团建。" },
      { q: "距离海滩多远？", a: "卡马拉海滩8分钟，芭东海滩10分钟，芭东酒吧街15分钟。" },
      { q: "电费怎么算？", a: "7泰铢/度，出门请关空调和灯，押金1万泰铢可抵扣。" },
    ],
    itinerary: "管家迎接入住 → 欢迎水果咖啡 → 海景泳池休闲 → 驾车10分钟芭东海滩 → 可选私厨晚宴或周边餐厅",
    materials: [
      "别墅高清实拍图25张",
      "小红书推广文案（卡马拉富人区版）",
      "1-5号打包团建方案",
      "朋友圈推广文案",
      "抖音短视频脚本",
    ],
  },
  {
    id: 18, cat: "villa", status: "avail",
    name: "卡马拉Sky4号海景别墅", nameEn: "Kamala Sky Villa No.4",
    emoji: "🏛️",
    images: [
      "https://i.ibb.co/2727ynSF/photo-2026-06-10-00-32-30.jpg",
      "https://i.ibb.co/Y71xVkjg/photo-2026-06-10-00-32-31.jpg",
      "https://i.ibb.co/CKjSBcgj/photo-2026-06-10-00-32-32-2.jpg",
      "https://i.ibb.co/sJNRTRm9/photo-2026-06-10-00-32-32.jpg",
      "https://i.ibb.co/zVNtQbWj/photo-2026-06-10-00-32-33.jpg",
      "https://i.ibb.co/TMj3gFMV/photo-2026-06-10-00-21-51.jpg",
      "https://i.ibb.co/nsMhtns1/photo-2026-06-10-00-32-35-2.jpg",
      "https://i.ibb.co/XZC8chkP/photo-2026-06-10-00-32-35.jpg",
      "https://i.ibb.co/G41qFW03/photo-2026-06-10-00-32-36.jpg",
      "https://i.ibb.co/VcJn0h3P/photo-2026-06-10-00-32-37.jpg",
      "https://i.ibb.co/0VtZrTG7/photo-2026-06-10-00-32-38-2.jpg",
      "https://i.ibb.co/tTHzNJnq/photo-2026-06-10-00-32-38.jpg",
      "https://i.ibb.co/Xk684RXq/photo-2026-06-10-00-32-39.jpg",
      "https://i.ibb.co/9HZ4PK2Y/photo-2026-06-10-00-32-40-2.jpg",
      "https://i.ibb.co/fLDVW82/photo-2026-06-10-00-32-40.jpg",
      "https://i.ibb.co/5WV6m1HY/photo-2026-06-10-00-32-41.jpg",
      "https://i.ibb.co/7tTQP71V/photo-2026-06-10-00-32-42-2.jpg",
      "https://i.ibb.co/0vkWW4q/photo-2026-06-10-00-32-42.jpg",
      "https://i.ibb.co/0VvH9Jxs/photo-2026-06-10-00-32-43.jpg",
      "https://i.ibb.co/TqMxCKfY/photo-2026-06-10-00-32-44-2.jpg",
      "https://i.ibb.co/jkbFHCTq/photo-2026-06-10-00-32-44.jpg",
      "https://i.ibb.co/0yvwwZZN/photo-2026-06-10-00-32-45.jpg",
      "https://i.ibb.co/9kc6gXRk/photo-2026-06-10-00-32-46.jpg",
      "https://i.ibb.co/fd7cV4mf/photo-2026-06-10-00-32-47-2.jpg",
      "https://i.ibb.co/sdGbm2sd/photo-2026-06-10-00-32-47.jpg",
      "https://i.ibb.co/C5w37R3q/photo-2026-06-10-00-32-48.jpg",
      "https://i.ibb.co/HfJvGf7c/photo-2026-06-10-00-32-49.jpg",
      "https://i.ibb.co/sd9Mk1Ks/photo-2026-06-10-00-32-50-2.jpg",
      "https://i.ibb.co/V0VWpkwx/photo-2026-06-10-00-32-50.jpg",
      "https://i.ibb.co/QFrQnV87/photo-2026-06-10-00-32-51.jpg",
    ],
    desc: "卡马拉富人区The Exclusive Sky 4号，4卧5卫可住8人，海景私人泳池12×3米，配备书房+茶台，主卧海景+衣帽间，同区可合并100+人团建。",
    retail: 22500, agent: 21000, cost: 19500,
    includes: [
      "每日免费早餐（中式/泰式/美式）",
      "每日保姆清洁（8:30-17:30）",
      "免费洗衣服务",
      "免费私人停车位",
      "每日矿泉水及咖啡",
      "洗漱用品全套",
      "中英泰三语管家服务",
      "私人海景泳池（12×3米）",
      "开放式厨房全套厨具",
      "书房、茶台、全屋极速Wi-Fi",
    ],
    excludes: [
      "电费（7泰铢/度）",
      "押金（10,000 THB，退房退还）",
      "漂浮早餐/下午茶（3,000 THB/次）",
      "厨师服务（3,000 THB/餐）",
      "超额入住（1,000 THB/位/晚）",
      "延迟退房（2,000 THB/小时）",
    ],
    suppliers: [
      { name: "JH", price: 19500 },
    ],
    notes: [
      "4号特色：配备书房+茶台，适合商务客户",
      "同区12套别墅可合并，最多100+人团建",
      "可与1/2/3号打包推荐",
      "5岁内小朋友2位免费",
      "住7天以上免费全屋清洁一次",
    ],
    faq: [
      { q: "4号和其他几号有什么区别？", a: "4号配备书房和茶台，更适合商务出行或需要安静办公空间的客户。" },
      { q: "最多住几人？", a: "标准8人，超出1000泰铢/位/晚，可加气垫床1500泰铢/晚。" },
      { q: "可以四套一起预订吗？", a: "可以！1+2+3+4号合并可住32人，同区共12套可接待100+人。" },
      { q: "距离海滩多远？", a: "卡马拉海滩8分钟，芭东海滩10分钟，芭东酒吧街15分钟。" },
      { q: "电费怎么算？", a: "7泰铢/度，出门请关空调和灯，押金1万泰铢可抵扣。" },
    ],
    itinerary: "管家迎接入住 → 欢迎水果咖啡 → 茶台品茗放松 → 海景泳池休闲 → 驾车10分钟芭东海滩 → 可选私厨晚宴",
    materials: [
      "别墅高清实拍图30张",
      "小红书推广文案（商务度假版）",
      "1-4号打包团建方案",
      "朋友圈推广文案",
      "抖音短视频脚本",
    ],
  },
  {
    id: 17, cat: "villa", status: "avail",
    name: "卡马拉Sky3号海景别墅", nameEn: "Kamala Sky Villa No.3",
    emoji: "🏛️",
    images: [
      "https://i.ibb.co/TqxGHbv1/photo-2026-06-10-00-26-16.jpg",
      "https://i.ibb.co/LDdNzZ2S/photo-2026-06-10-00-26-17.jpg",
      "https://i.ibb.co/R4GjvNnd/photo-2026-06-10-00-26-18.jpg",
      "https://i.ibb.co/FqWM1jP2/photo-2026-06-10-00-26-19.jpg",
      "https://i.ibb.co/sJtzHyRs/photo-2026-06-10-00-26-20-2.jpg",
      "https://i.ibb.co/nHbhYkT/photo-2026-06-10-00-26-20.jpg",
      "https://i.ibb.co/cSfPfzwX/photo-2026-06-10-00-26-21.jpg",
      "https://i.ibb.co/Kz9GYbXg/photo-2026-06-10-00-26-22.jpg",
      "https://i.ibb.co/cS4bvXNL/photo-2026-06-10-00-26-23-2.jpg",
      "https://i.ibb.co/TBKVfX5V/photo-2026-06-10-00-26-23.jpg",
      "https://i.ibb.co/9LZpnNV/photo-2026-06-10-00-26-24.jpg",
      "https://i.ibb.co/v4SLjWrX/photo-2026-06-10-00-26-25.jpg",
      "https://i.ibb.co/QjmrgdkB/photo-2026-06-10-00-26-26-2.jpg",
      "https://i.ibb.co/Hf2shLMB/photo-2026-06-10-00-26-26.jpg",
      "https://i.ibb.co/27ytgkkR/photo-2026-06-10-00-26-27.jpg",
      "https://i.ibb.co/tM3vmymy/photo-2026-06-10-00-26-28.jpg",
      "https://i.ibb.co/20VbDvgB/photo-2026-06-10-00-26-29-2.jpg",
      "https://i.ibb.co/Gf45K7jt/photo-2026-06-10-00-26-29.jpg",
      "https://i.ibb.co/FqNP1nJH/photo-2026-06-10-00-26-30.jpg",
      "https://i.ibb.co/bjTBQ0q3/photo-2026-06-10-00-26-31.jpg",
      "https://i.ibb.co/QhMLWWG/photo-2026-06-10-00-26-32.jpg",
      "https://i.ibb.co/kgYkyDk1/photo-2026-06-10-00-26-35.jpg",
      "https://i.ibb.co/HDbrSg6w/photo-2026-06-10-00-26-36.jpg",
      "https://i.ibb.co/B5YJ6drZ/photo-2026-06-10-00-26-37.jpg",
      "https://i.ibb.co/GvtvSzK2/photo-2026-06-10-00-26-38.jpg",
      "https://i.ibb.co/JWzjhXNd/photo-2026-06-10-00-26-39.jpg",
    ],
    desc: "卡马拉富人区The Exclusive Sky 3号，4卧5卫可住8人，海景私人泳池12×3米，主卧配浴缸+衣帽间，同区可合并100+人团建。芭东10分钟，卡马拉海滩8分钟。",
    retail: 22500, agent: 21000, cost: 19500,
    includes: [
      "每日免费早餐（中式/泰式/美式）",
      "每日保姆清洁（8:30-17:30）",
      "免费洗衣服务",
      "免费私人停车位",
      "每日矿泉水及咖啡",
      "洗漱用品全套",
      "中英泰三语管家服务",
      "私人海景泳池（12×3米）",
      "开放式厨房全套厨具",
      "全屋极速Wi-Fi",
    ],
    excludes: [
      "电费（7泰铢/度）",
      "押金（10,000 THB，退房退还）",
      "漂浮早餐/下午茶（3,000 THB/次）",
      "厨师服务（3,000 THB/餐）",
      "超额入住（1,000 THB/位/晚）",
      "延迟退房（2,000 THB/小时）",
    ],
    suppliers: [
      { name: "JH", price: 19500 },
    ],
    notes: [
      "与1号2号相同配置，主卧有浴缸+衣帽间升级",
      "同区12套别墅可合并，最多100+人团建",
      "可与1号2号打包推荐，享团建优惠",
      "5岁内小朋友2位免费",
      "住7天以上免费全屋清洁一次",
    ],
    faq: [
      { q: "和1号2号别墅有什么区别？", a: "配置基本相同，3号主卧配备浴缸和衣帽间，略有升级。可三套同时预订合并使用。" },
      { q: "最多住几人？", a: "标准8人，超出1000泰铢/位/晚，可加气垫床1500泰铢/晚。" },
      { q: "可以三套一起预订吗？", a: "可以！1+2+3号合并可住24人，适合大家庭或中型团建。" },
      { q: "距离海滩多远？", a: "卡马拉海滩8分钟，芭东海滩10分钟，芭东酒吧街15分钟。" },
      { q: "电费怎么算？", a: "7泰铢/度，出门请关空调和灯，押金1万泰铢可抵扣。" },
    ],
    itinerary: "管家迎接入住 → 欢迎水果咖啡 → 海景泳池休闲 → 驾车10分钟芭东海滩 → 可选私厨晚宴或周边餐厅",
    materials: [
      "别墅高清实拍图26张",
      "小红书推广文案（卡马拉富人区版）",
      "1号+2号+3号打包团建方案",
      "朋友圈推广文案",
      "抖音短视频脚本",
    ],
  },
  {
    id: 16, cat: "villa", status: "avail",
    name: "卡马拉Sky2号海景别墅", nameEn: "Kamala Sky Villa No.2",
    emoji: "🏛️",
    images: [
      "https://i.ibb.co/KcNXz7bH/photo-2026-06-10-00-21-47.jpg",
      "https://i.ibb.co/fdpFWMqG/photo-2026-06-10-00-21-49-2.jpg",
      "https://i.ibb.co/7tCT12xM/photo-2026-06-10-00-21-49.jpg",
      "https://i.ibb.co/Ps93L0qL/photo-2026-06-10-00-21-50.jpg",
      "https://i.ibb.co/rRkzbFKg/photo-2026-06-10-00-21-51-2.jpg",
      "https://i.ibb.co/TMj3gFMV/photo-2026-06-10-00-21-51.jpg",
      "https://i.ibb.co/ZpLJJW7v/photo-2026-06-10-00-21-52.jpg",
      "https://i.ibb.co/B5gkYgYy/photo-2026-06-10-00-21-53-2.jpg",
      "https://i.ibb.co/sJcH7bQP/photo-2026-06-10-00-21-53.jpg",
      "https://i.ibb.co/TM1Y0Jk1/photo-2026-06-10-00-21-54-2.jpg",
      "https://i.ibb.co/m5nBqwC1/photo-2026-06-10-00-21-54.jpg",
      "https://i.ibb.co/v6Q9M2CJ/photo-2026-06-10-00-21-55.jpg",
      "https://i.ibb.co/Q70QdKxY/photo-2026-06-10-00-21-56-2.jpg",
      "https://i.ibb.co/nMbTCXQ3/photo-2026-06-10-00-21-56.jpg",
      "https://i.ibb.co/ZRFTgxvh/photo-2026-06-10-00-21-57.jpg",
      "https://i.ibb.co/1g95TgH/photo-2026-06-10-00-21-58-2.jpg",
      "https://i.ibb.co/YT02xK2t/photo-2026-06-10-00-21-58.jpg",
      "https://i.ibb.co/cXSLQH7K/photo-2026-06-10-00-21-59.jpg",
      "https://i.ibb.co/xtVfz7rw/photo-2026-06-10-00-22-00-2.jpg",
      "https://i.ibb.co/WmKjQs5/photo-2026-06-10-00-22-00.jpg",
      "https://i.ibb.co/1fH8k6mk/photo-2026-06-10-00-22-01.jpg",
      "https://i.ibb.co/5hMNGLCW/photo-2026-06-10-00-22-02-2.jpg",
      "https://i.ibb.co/rG63KTPz/photo-2026-06-10-00-22-02.jpg",
      "https://i.ibb.co/j9rdh5FP/photo-2026-06-10-00-22-03.jpg",
      "https://i.ibb.co/fdxDBTZj/photo-2026-06-10-00-22-04-2.jpg",
      "https://i.ibb.co/nN2dbRMX/photo-2026-06-10-00-22-04.jpg",
    ],
    desc: "卡马拉富人区The Exclusive Sky 2号，4卧5卫可住8人，海景私人泳池12×3米，与1号别墅同区，可合并使用接待100+人团建。芭东10分钟，卡马拉海滩8分钟。",
    retail: 22500, agent: 21000, cost: 19500,
    includes: [
      "每日免费早餐（中式/泰式/美式）",
      "每日保姆清洁（8:30-17:30）",
      "免费洗衣服务",
      "免费私人停车位",
      "每日矿泉水及咖啡",
      "洗漱用品全套",
      "中英泰三语管家服务",
      "私人海景泳池（12×3米）",
      "开放式厨房全套厨具",
      "全屋极速Wi-Fi",
    ],
    excludes: [
      "电费（7泰铢/度）",
      "押金（10,000 THB，退房退还）",
      "漂浮早餐/下午茶（3,000 THB/次）",
      "厨师服务（3,000 THB/餐）",
      "超额入住（1,000 THB/位/晚）",
      "延迟退房（2,000 THB/小时）",
    ],
    suppliers: [
      { name: "JH", price: 19500 },
    ],
    notes: [
      "与1号别墅相同配置，可与1号打包推荐",
      "同区12套别墅可合并，最多100+人团建",
      "价格与1号相同，推荐同时预订享团建优惠",
      "5岁内小朋友2位免费",
      "住7天以上免费全屋清洁一次",
    ],
    faq: [
      { q: "和1号别墅有什么区别？", a: "配置完全相同，图片展示角度不同，可与1号别墅同时预订，合并接待更多宾客。" },
      { q: "最多住几人？", a: "标准8人，超出1000泰铢/位/晚，可加气垫床1500泰铢/晚。" },
      { q: "可以办大型团建吗？", a: "可以！与1号及同区其他别墅合并，最多接待100+人。" },
      { q: "距离海滩多远？", a: "卡马拉海滩8分钟，芭东海滩10分钟，芭东酒吧街15分钟。" },
      { q: "电费怎么算？", a: "7泰铢/度，出门请关空调和灯，押金1万泰铢可抵扣。" },
    ],
    itinerary: "管家迎接入住 → 欢迎水果咖啡 → 海景泳池休闲 → 驾车10分钟芭东海滩 → 可选私厨晚宴或周边餐厅",
    materials: [
      "别墅高清实拍图26张",
      "小红书推广文案（卡马拉富人区版）",
      "朋友圈推广文案",
      "1号+2号打包团建方案",
      "抖音短视频脚本",
    ],
  },
  {
    id: 15, cat: "villa", status: "avail",
    name: "卡马拉Sky1号海景别墅", nameEn: "Kamala Sky Villa No.1",
    emoji: "🏛️",
    images: [
      "https://i.ibb.co/svRcDySw/photo-2026-06-10-00-10-56.jpg",
      "https://i.ibb.co/wFwss1Fz/photo-2026-06-10-00-10-57.jpg",
      "https://i.ibb.co/bgGkq5VF/photo-2026-06-10-00-10-59-2.jpg",
      "https://i.ibb.co/WNpKRBWF/photo-2026-06-10-00-10-59.jpg",
      "https://i.ibb.co/Tq8fj3h9/photo-2026-06-10-00-11-00.jpg",
      "https://i.ibb.co/G3VzpCfm/photo-2026-06-10-00-11-01.jpg",
      "https://i.ibb.co/fVyxLz0W/photo-2026-06-10-00-11-02.jpg",
      "https://i.ibb.co/X0nvMLZ/photo-2026-06-10-00-11-03.jpg",
      "https://i.ibb.co/gZ9zSJsd/photo-2026-06-10-00-11-04-2.jpg",
      "https://i.ibb.co/GvfvhFn8/photo-2026-06-10-00-11-04.jpg",
      "https://i.ibb.co/5hwzfJyg/photo-2026-06-10-00-11-05.jpg",
      "https://i.ibb.co/B2xKvsrb/photo-2026-06-10-00-11-06-2.jpg",
      "https://i.ibb.co/Wp08st19/photo-2026-06-10-00-11-06.jpg",
      "https://i.ibb.co/WNqzqmD7/photo-2026-06-10-00-11-07.jpg",
      "https://i.ibb.co/S7JQ3RP4/photo-2026-06-10-00-11-08-2.jpg",
      "https://i.ibb.co/DBcXRky/photo-2026-06-10-00-11-08.jpg",
      "https://i.ibb.co/fYHvkTdT/photo-2026-06-10-00-11-09.jpg",
      "https://i.ibb.co/q3W07ZW7/photo-2026-06-10-00-11-10-2.jpg",
      "https://i.ibb.co/JRG0dqx4/photo-2026-06-10-00-11-10.jpg",
      "https://i.ibb.co/h1wFRgcx/photo-2026-06-10-00-11-11.jpg",
      "https://i.ibb.co/qLsM0wDh/photo-2026-06-10-00-11-12.jpg",
      "https://i.ibb.co/Hwz4FRs/photo-2026-06-10-00-11-13.jpg",
      "https://i.ibb.co/ZR1yD5Vf/photo-2026-06-10-00-11-14-2.jpg",
      "https://i.ibb.co/cKQGBnyx/photo-2026-06-10-00-11-14.jpg",
      "https://i.ibb.co/4ZVXH6X7/photo-2026-06-10-00-11-16-2.jpg",
      "https://i.ibb.co/Zp1S0F3h/photo-2026-06-10-00-11-16.jpg",
      "https://i.ibb.co/qPmNX81/photo-2026-06-10-00-11-17.jpg",
      "https://i.ibb.co/CKnv4YFZ/photo-2026-06-10-00-11-18.jpg",
    ],
    desc: "卡马拉富人区The Exclusive Sky，4卧5卫可住8人，海景私人泳池12×3米，同区12套别墅可合并使用，最多接待100+人团建。芭东10分钟，卡马拉海滩8分钟。",
    retail: 22500, agent: 21000, cost: 19500,
    includes: [
      "每日免费早餐（中式/泰式/美式）",
      "每日保姆清洁（8:30-17:30）",
      "免费洗衣服务",
      "免费私人停车位",
      "每日矿泉水及咖啡",
      "洗漱用品全套",
      "中英泰三语管家服务",
      "私人海景泳池（12×3米，每日循环8小时）",
      "开放式厨房全套厨具",
      "全屋极速Wi-Fi",
    ],
    excludes: [
      "电费（7泰铢/度）",
      "押金（10,000 THB，退房退还）",
      "漂浮早餐/下午茶（3,000 THB/次）",
      "厨师服务（3,000 THB/餐）",
      "超额入住（1,000 THB/位/晚）",
      "延迟退房（2,000 THB/小时）",
    ],
    suppliers: [
      { name: "JH", price: 19500 },
    ],
    notes: [
      "同区12套别墅可合并，最多100+人，超大团建首选",
      "卡马拉富人区，芭东10分钟，地理位置优越",
      "5岁内小朋友2位免费，适合亲子家庭",
      "室内禁烟禁榴莲禁山竹，违者重罚",
      "住7天以上免费全屋清洁一次",
    ],
    faq: [
      { q: "最多住几人？", a: "标准8人，超出1000泰铢/位/晚，可加气垫床1500泰铢/晚。" },
      { q: "可以办大型团建吗？", a: "可以！同区12套别墅可合并，共约48间卧室，最多接待100+人。" },
      { q: "距离海滩多远？", a: "卡马拉海滩8分钟，芭东海滩10分钟，芭东酒吧街15分钟。" },
      { q: "电费怎么算？", a: "7泰铢/度，出门请关空调和灯，押金1万泰铢可抵扣。" },
      { q: "可以提前入住吗？", a: "需提前与管家沟通，延迟退房2000泰铢/小时，超2小时按一天收费。" },
    ],
    itinerary: "管家迎接入住 → 欢迎水果咖啡 → 海景泳池休闲 → 驾车10分钟芭东海滩 → 可选私厨晚宴或周边餐厅",
    materials: [
      "别墅高清实拍图28张",
      "小红书推广文案（卡马拉富人区版）",
      "朋友圈推广文案",
      "100人团建专属方案",
      "抖音短视频脚本",
    ],
  },
  {
    id: 14, cat: "villa", status: "avail",
    name: "拉威山海之梦别墅", nameEn: "Shan Hai no Yume Villa Rawai",
    emoji: "🏛️",
    images: [
      "https://i.ibb.co/LdsFp9MT/photo-2026-06-09-23-59-27.jpg",
      "https://i.ibb.co/1fDKLrjx/photo-2026-06-09-23-59-28.jpg",
      "https://i.ibb.co/CphC2Zdb/photo-2026-06-09-23-59-29-2.jpg",
      "https://i.ibb.co/qMMgCGSt/photo-2026-06-09-23-59-29.jpg",
      "https://i.ibb.co/0RTV59jB/photo-2026-06-09-23-59-30.jpg",
      "https://i.ibb.co/dJjF5hD8/photo-2026-06-09-23-59-31.jpg",
      "https://i.ibb.co/b5P1VT7V/photo-2026-06-09-23-59-32-2.jpg",
      "https://i.ibb.co/R40qxR2B/photo-2026-06-09-23-59-32.jpg",
      "https://i.ibb.co/XkWjRLmz/photo-2026-06-09-23-59-33.jpg",
      "https://i.ibb.co/n8g4hWMK/photo-2026-06-09-23-59-34.jpg",
      "https://i.ibb.co/rKNJwZJm/photo-2026-06-09-23-59-35-2.jpg",
      "https://i.ibb.co/7xc19ztH/photo-2026-06-09-23-59-35.jpg",
      "https://i.ibb.co/tM3JTRh4/photo-2026-06-09-23-59-36.jpg",
      "https://i.ibb.co/8gMpGTF6/photo-2026-06-09-23-59-37-2.jpg",
      "https://i.ibb.co/Z60c0H3M/photo-2026-06-09-23-59-37.jpg",
      "https://i.ibb.co/rRZB4w0z/photo-2026-06-09-23-59-38.jpg",
      "https://i.ibb.co/kVyWZ1hB/photo-2026-06-09-23-59-39.jpg",
      "https://i.ibb.co/CspRmS0L/photo-2026-06-09-23-59-40-2.jpg",
      "https://i.ibb.co/LzzmcsXy/photo-2026-06-09-23-59-40.jpg",
      "https://i.ibb.co/PvYsgx9z/photo-2026-06-09-23-59-41.jpg",
      "https://i.ibb.co/CswH9y8G/photo-2026-06-09-23-59-42-2.jpg",
      "https://i.ibb.co/ZRXk2YNc/photo-2026-06-09-23-59-42.jpg",
      "https://i.ibb.co/wFDrczTM/photo-2026-06-09-23-59-43.jpg",
      "https://i.ibb.co/gL3NrsqR/photo-2026-06-09-23-59-44.jpg",
      "https://i.ibb.co/WQ26DQS/photo-2026-06-09-23-59-45-2.jpg",
      "https://i.ibb.co/99mY5Zkz/photo-2026-06-09-23-59-45.jpg",
      "https://i.ibb.co/FL3mMCsQ/photo-2026-06-09-23-59-46.jpg",
      "https://i.ibb.co/zhgTHYpp/photo-2026-06-09-23-59-47.jpg",
    ],
    desc: "拉威海滩700米，步行6分钟到海边，4卧5卫1600㎡，15米无边泳池，全自动麻将机+BBQ+水吧台，自然氧气森林，适合家庭度假与生日派对。",
    retail: 21500, agent: 20000, cost: 18500,
    includes: [
      "每日免费早餐（中式/泰式/美式）",
      "每日保姆清洁（8:30-17:30）",
      "免费洗衣服务",
      "免费私人停车位",
      "每日矿泉水及咖啡",
      "洗漱用品全套",
      "中英泰三语管家服务",
      "15米无边泳池",
      "全自动麻将机、BBQ烧烤炉、水吧台",
    ],
    excludes: [
      "漂浮早餐/下午茶（3,000 THB/次）",
      "厨师服务午晚餐（3,000 THB/餐）",
      "接送机（需另付费）",
      "电费（另计）",
    ],
    suppliers: [
      { name: "JH", price: 18500 },
    ],
    notes: [
      "与天海之梦同区域，可打包推荐",
      "4卧版本价格更低，适合小家庭",
      "全自动麻将机是卖点，中国客户最爱",
      "步行6分钟拉威海滩，3分钟海鲜市场",
      "利润空间合理（20000-18500=1500）",
    ],
    faq: [
      { q: "距离海滩多远？", a: "步行5-6分钟到拉威海滩，3分钟到拉威海鲜市场，奈涵海滩5分钟车程。" },
      { q: "最多住几人？", a: "4卧室，建议最多8人，可加床。" },
      { q: "有麻将吗？", a: "有！配备全自动麻将机，是中国客户最喜爱的配置之一。" },
      { q: "有厨师服务吗？", a: "有，厨师服务费3000泰铢/餐，可做泰餐/中餐/BBQ，需提前预约。" },
      { q: "和天海之梦有什么区别？", a: "山海之梦是4卧版本，价格更低；天海之梦是5卧版本，适合人数更多的团体。两套别墅紧邻，可合并使用。" },
    ],
    itinerary: "管家迎接入住 → 欢迎水果咖啡 → 15米无边泳池畅游 → 麻将娱乐时光 → 步行拉威海鲜市场晚餐 → 次日奈涵/神仙半岛探索",
    materials: [
      "别墅高清实拍图28张",
      "小红书推广文案（拉威海滩版）",
      "朋友圈推广文案",
      "与天海之梦打包推广方案",
      "抖音短视频脚本",
    ],
  },
  {
    id: 13, cat: "villa", status: "avail",
    name: "拉威天海之梦别墅", nameEn: "Tian Hai no Yume Villa Rawai",
    emoji: "🏛️",
    images: [
      "https://i.ibb.co/XfqzNf6h/2026-06-09-11-49-30.png",
      "https://i.ibb.co/jv36WKn5/photo-2026-06-09-23-50-06.jpg",
      "https://i.ibb.co/Qv7QHxLF/photo-2026-06-09-23-50-07.jpg",
      "https://i.ibb.co/CpFh7J4b/photo-2026-06-09-23-50-08.jpg",
      "https://i.ibb.co/pv9Tztr9/photo-2026-06-09-23-50-09.jpg",
      "https://i.ibb.co/cSk8dzzk/photo-2026-06-09-23-50-10.jpg",
      "https://i.ibb.co/rGqfzvtK/photo-2026-06-09-23-50-11-2.jpg",
      "https://i.ibb.co/ZRZw3cvs/photo-2026-06-09-23-50-11.jpg",
      "https://i.ibb.co/yF1fCVjf/photo-2026-06-09-23-50-12.jpg",
      "https://i.ibb.co/23QKV1pP/photo-2026-06-09-23-50-13.jpg",
      "https://i.ibb.co/xtL5dTjM/photo-2026-06-09-23-50-14.jpg",
      "https://i.ibb.co/BVJj7Hvs/photo-2026-06-09-23-50-15-2.jpg",
      "https://i.ibb.co/CXFsQCG/photo-2026-06-09-23-50-15.jpg",
      "https://i.ibb.co/DPpq7gKH/photo-2026-06-09-23-50-16.jpg",
      "https://i.ibb.co/4B9DLss/photo-2026-06-09-23-50-17-2.jpg",
      "https://i.ibb.co/04D5RMy/photo-2026-06-09-23-50-17.jpg",
      "https://i.ibb.co/39Sgs1Qj/photo-2026-06-09-23-50-18-2.jpg",
      "https://i.ibb.co/GQD4vyvk/photo-2026-06-09-23-50-18.jpg",
      "https://i.ibb.co/7J93LP13/photo-2026-06-09-23-50-19.jpg",
      "https://i.ibb.co/F43Lg351/photo-2026-06-09-23-50-20.jpg",
      "https://i.ibb.co/fzs8sPST/photo-2026-06-09-23-50-21.jpg",
      "https://i.ibb.co/pjWhmpGc/photo-2026-06-09-23-50-22-2.jpg",
      "https://i.ibb.co/Z6D5nP1p/photo-2026-06-09-23-50-22.jpg",
      "https://i.ibb.co/Xxgj4pp6/photo-2026-06-09-23-50-23-2.jpg",
      "https://i.ibb.co/0pkpChdd/photo-2026-06-09-23-50-23.jpg",
      "https://i.ibb.co/HWBdf1B/photo-2026-06-09-23-50-24.jpg",
      "https://i.ibb.co/wZxk4yCv/photo-2026-06-09-23-50-25.jpg",
      "https://i.ibb.co/2YWBVsGk/photo-2026-06-09-23-50-26-2.jpg",
      "https://i.ibb.co/mVhgC1GJ/photo-2026-06-09-23-50-26.jpg",
      "https://i.ibb.co/Cp7bGq2S/photo-2026-06-09-23-50-27.jpg",
    ],
    desc: "拉威海滩700米，步行6分钟到海边，5卧6卫1600㎡，15米无边泳池含深浅水区，桑拿房+BBQ+凉亭，自然氧气森林环境，适合家庭度假与生日派对。",
    retail: 23500, agent: 21700, cost: 20200,
    includes: [
      "每日免费早餐（中式/泰式/美式）",
      "每日保姆清洁（8:30-17:30）",
      "免费洗衣服务",
      "免费私人停车位",
      "每日矿泉水及咖啡",
      "洗漱用品全套（牙刷/牙膏/洗发水/沐浴露等）",
      "中英泰三语管家服务",
      "15米无边泳池（深浅水区）",
      "桑拿房、BBQ烧烤炉、凉亭",
    ],
    excludes: [
      "漂浮早餐/下午茶（3,000 THB/次）",
      "厨师服务午晚餐（3,000 THB/餐）",
      "接送机（需另付费）",
      "电费（另计）",
    ],
    suppliers: [
      { name: "JH", price: 20200 },
    ],
    notes: [
      "拉威区性价比最高别墅之一",
      "步行6分钟拉威海滩，3分钟拉威海鲜市场",
      "适合家庭度假、生日派对、朋友聚会",
      "桑拿房是差异化卖点，同价位少见",
      "奈涵/神仙半岛/卡塔均在10分钟内",
    ],
    faq: [
      { q: "距离海滩多远？", a: "步行5-6分钟到拉威海滩，3分钟到拉威海鲜市场，奈涵海滩5分钟车程。" },
      { q: "最多住几人？", a: "5卧室，建议最多10人，可加床。" },
      { q: "有厨师服务吗？", a: "有，厨师服务费3000泰铢/餐，可做泰餐/中餐/BBQ，需提前预约。" },
      { q: "有桑拿吗？", a: "有！别墅配备桑拿房，是同价位别墅中少见的配置。" },
      { q: "适合带小孩吗？", a: "非常适合！泳池分深浅水区，周边有奈涵海滩、普吉大佛等亲子景点。" },
    ],
    itinerary: "管家迎接入住 → 欢迎水果咖啡 → 15米无边泳池畅游 → 步行拉威海鲜市场晚餐 → 别墅桑拿放松 → 次日奈涵/神仙半岛探索",
    materials: [
      "别墅高清实拍图30张",
      "小红书推广文案（拉威海滩版）",
      "朋友圈推广文案",
      "家庭度假专属方案",
      "抖音短视频脚本",
    ],
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
    desc: "Toyota Alphard埃尔法商务座驾，航空级豪华座椅，专业中文司机全程服务。机场接送单程3300 THB，8小时包车8000 THB，适合家庭、商务及高端度假客户。",
    retail: 8000, agent: 6500, cost: 5000,
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
      { name: "善元堂（包车）", price: 5000 },
      { name: "善元堂（接送机）", price: 2500 },
    ],
    notes: [
      "接送机：市场价3300 / 代理价3000 / 成本2500",
      "包车8H：市场价8000 / 代理价6500 / 成本5000",
      "包车利润空间好（8000-6500=1500）",
      "中文司机是核心卖点，中国客户满意度极高",
      "可与别墅/游艇套餐捆绑销售",
    ],
    faq: [
      { q: "机场接送多少钱？", a: "普吉国际机场单程3300 THB，含中文司机接机、协助行李、航班延误免费等待。" },
      { q: "包车几小时？怎么收费？", a: "标准8小时8,000 THB，超出部分1,000 THB/小时。" },
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
    id: 12, cat: "car", status: "avail",
    name: "VIP商务车10人包车", nameEn: "Toyota VIP Van Private Transfer",
    emoji: "🚐",
    images: [
      "https://i.ibb.co/SwFWBYwb/photo-2026-06-09-03-12-54.jpg",
      "https://i.ibb.co/sdkqxbwd/photo-2026-06-09-03-12-56.jpg",
      "https://i.ibb.co/5xsxydrq/photo-2026-06-09-03-12-57.jpg",
      "https://i.ibb.co/nMqX6RRH/photo-2026-06-09-03-12-58.jpg",
      "https://i.ibb.co/8grC0Vjj/photo-2026-06-09-03-12-59.jpg",
    ],
    desc: "Toyota VIP Van豪华商务车，最多10人乘坐，超大行李空间，专业中文司机全程服务。机场接送1,800 THB，8小时包车4,000 THB，家庭/团队出游首选。",
    retail: 4000, agent: 3500, cost: 3000,
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
      { name: "善元堂（包车）", price: 3000 },
      { name: "善元堂（接送机）", price: 1200 },
    ],
    notes: [
      "接送机：市场价1800 / 代理价1500 / 成本1200",
      "包车8H：市场价4000 / 代理价3500 / 成本3000",
      "10人大容量是核心卖点，适合家庭及团队",
      "可与别墅套餐捆绑，提升客单价",
      "与Alphard形成高低搭配，满足不同预算客户",
    ],
    faq: [
      { q: "最多坐几人？", a: "最多10位乘客，行李空间超大，家庭及团队出游首选。" },
      { q: "机场接送多少钱？", a: "普吉国际机场单程1,800 THB，含中文司机、协助行李、航班延误免费等待。" },
      { q: "包车几小时？", a: "标准8小时4,000 THB，行程自由定制，景点餐厅随心安排。" },
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
    id: 62, cat: "photo", status: "avail",
    name: "普吉岛法式叙事风格旅拍", nameEn: "Phuket French Style Travel Photography",
    emoji: "📸",
    images: [
      "https://i.ibb.co/wrgGtrYD/photo-2026-06-26-01-49-48.jpg",
      "https://i.ibb.co/7NZTTmVT/photo-2026-06-26-01-49-49.jpg",
      "https://i.ibb.co/HLt8rzhh/photo-2026-06-26-01-49-50-2.jpg",
      "https://i.ibb.co/ZCqR2wQ/photo-2026-06-26-01-49-50.jpg",
      "https://i.ibb.co/gHRv8J1/photo-2026-06-26-01-49-51.jpg",
      "https://i.ibb.co/DDsJCTWY/photo-2026-06-26-01-49-52-2.jpg",
      "https://i.ibb.co/HDMHPmQd/photo-2026-06-26-01-49-52.jpg",
      "https://i.ibb.co/CpcR9q9s/photo-2026-06-26-01-49-53-2.jpg",
      "https://i.ibb.co/nMm23pdX/photo-2026-06-26-01-49-53.jpg",
      "https://i.ibb.co/bRKp30GH/photo-2026-06-26-01-49-54.jpg",
      "https://i.ibb.co/Vc8BKTYX/photo-2026-06-26-01-49-55.jpg",
      "https://i.ibb.co/kVmRSZ3L/photo-2026-06-26-01-49-56.jpg",
      "https://i.ibb.co/998w78GF/photo-2026-06-26-01-49-57.jpg",
    ],
    desc: "法式叙事风格旅拍，胶片复古与现代慵懒之间。极度依赖自然光黄金时刻，低饱和胶片色调，抓拍随风发丝奔跑背影，加人不加价，底片全送精修交付。",
    retail: 18500, agent: 16650, cost: 15725,
    includes: [
      "1H：底片全送，6张精修（4000 THB）",
      "2H：底片全送，15张精修（6800 THB）",
      "半天4H：底片全送，20张精修（10000 THB）",
      "全天8H：底片全送，25张精修（18500 THB）",
      "索尼和佳能双机拍摄",
      "百度网盘底片交付24H内",
      "加人不加价",
    ],
    excludes: [
      "额外精修200 THB每张",
      "交通费机场迈考Naka岛1000 THB",
      "交通费卡马拉拉威班涛沙滩500 THB",
      "场地费门票费餐食费提前告知",
    ],
    suppliers: [
      { name: "普吉岛约拍跳岛", price: 15725 },
    ],
    notes: [
      "普吉镇卡伦卡塔区域无交通费",
      "加人不加价是核心卖点适合闺蜜情侣家庭",
      "50%定金确认订单拍摄结束付尾款",
      "可免费改期4天前取消全退48H前退50%48H内不退定金",
    ],
    faq: [
      { q: "拍摄风格是什么", a: "法式叙事风格，胶片复古与现代慵懒之间，低饱和胶片色调，抓拍自然流露瞬间，自带松弛感生活方式。" },
      { q: "多人拍摄加价吗", a: "不加价！加人不加价是本摄影师的特色，非常适合闺蜜情侣家庭出游。" },
      { q: "照片什么时候交付", a: "尾款付清后24H内发送底片百度网盘，自行选片后48H内返精修图。" },
      { q: "可以取消或改期吗", a: "可免费改期。取消：4天前全退，48H前退50%，48H内定金不退。" },
    ],
    itinerary: "提前沟通时间地点风格 → 支付50%定金确认 → 拍摄当天按约定时间开始 → 结束后付尾款 → 24H内收底片 → 选片后48H内收精修图",
    materials: [
      "旅拍样片13张",
      "小红书推广文案法式慵懒风版",
      "朋友圈推广文案",
    ],
  },
{
    id: 61, cat: "photo", status: "avail",
    name: "普吉岛胶片感情绪旅拍", nameEn: "Phuket Film Style Travel Photography",
    emoji: "📸",
    images: [
      "https://i.ibb.co/mVftcPGz/photo-2026-06-26-00-49-38.jpg",
      "https://i.ibb.co/zT52kBRJ/photo-2026-06-26-00-49-41.jpg",
      "https://i.ibb.co/b0NgWjq/photo-2026-06-26-00-49-42.jpg",
      "https://i.ibb.co/PfW2b7w/photo-2026-06-26-00-49-43.jpg",
      "https://i.ibb.co/wN7x7vvx/photo-2026-06-26-00-49-44.jpg",
      "https://i.ibb.co/5Xn87Dyq/photo-2026-06-26-00-49-45-2.jpg",
      "https://i.ibb.co/QFkw7hnV/photo-2026-06-26-00-49-45.jpg",
      "https://i.ibb.co/mVbLRbBX/photo-2026-06-26-00-49-46.jpg",
      "https://i.ibb.co/vvHXMvcR/photo-2026-06-26-00-49-47.jpg",
      "https://i.ibb.co/B5BJMbYx/photo-2026-06-26-00-49-48.jpg",
    ],
    desc: "胶片感电影感自然情绪松弛状态。Sony a7m4加CCD加iPhone 17 Pro三机拍摄，注重人与环境的真实连接。单人群像亲子纪实旅拍多种风格，底片全送加精修交付。",
    retail: 18500, agent: 16650, cost: 14800,
    includes: [
      "1H：80张底片全送，5张精修（3200 THB）",
      "2H：180张底片全送，10张精修（5700 THB）",
      "半天4H：300张底片全送，15张精修（10000 THB）",
      "全天8H：600张底片全送，24张精修（18500 THB）",
      "Sony a7m4加CCD加iPhone 17 Pro三机拍摄",
      "百度网盘底片交付24H内",
    ],
    excludes: [
      "额外精修100 THB每张",
      "交通费卡马拉300芭东卡伦卡塔500拉威麦考900 THB",
      "场地费门票费餐食费提前告知",
      "多人加拍500 THB每人",
    ],
    suppliers: [
      { name: "Savy不会拍", price: 14800 },
    ],
    notes: [
      "普吉镇邦涛苏林区域无交通费",
      "多人拍摄每人加500泰铢",
      "50%定金确认订单拍摄结束付尾款",
      "可免费改期4天前取消全退48H前退50%48H内不退定金",
    ],
    faq: [
      { q: "拍摄风格是什么", a: "胶片感电影感自然情绪松弛状态，注重人与环境的真实连接，捕捉自然流露的瞬间。" },
      { q: "用什么设备拍摄", a: "Sony a7m4佳能ixus210机皇CCD iPhone 17 Pro三机拍摄底片全送。" },
      { q: "多人拍摄怎么收费", a: "以上为1人价格多一人加500泰铢每人。" },
      { q: "照片什么时候交付", a: "尾款付清后24H内发送底片百度网盘，自行选片后48H内返精修图。" },
    ],
    itinerary: "提前沟通时间地点风格 → 支付50%定金确认 → 拍摄当天按约定时间开始 → 结束后付尾款 → 24H内收底片 → 选片后48H内收精修图",
    materials: [
      "旅拍样片10张",
      "小红书推广文案胶片情绪旅拍版",
      "朋友圈推广文案",
    ],
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
      {page === "join" && <JoinPage navigate={navigate} />}
      {page === "partner" && <PartnerPage navigate={navigate} />}
      {page === "about" && <AboutPage navigate={navigate} />}
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
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="cat-card" onClick={() => { setSelectedCat(cat.id); navigate("products"); }}>
              {cat.cover
  ? <img src={cat.cover} alt={cat.name} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }} />
  : <div className="cat-bg">{cat.icon}</div>
}
              <div className="cat-gradient" />
              <div className="cat-count">{PRODUCTS.filter(p => p.cat === cat.id).length}</div>
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
  const topProduct = [...PRODUCTS].filter(item => item.cat === catId).sort((a, b) => b.retail - a.retail)[0];
  return topProduct ? <ProductCard key={topProduct.id} product={topProduct} role={role} statusBadge={statusBadge} onClick={() => { setSelectedProduct(topProduct); navigate("detail"); }} /> : null;
})}
        </div>
      </section>
    </>
  );
}

function ProductsPage({ products, role, selectedCat, setSelectedCat, searchQ, setSearchQ, statusBadge, setSelectedProduct }) {
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
          {CATEGORIES.map(c => (
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
          : <div className="product-grid">{filteredByYachtSub.map(p => <ProductCard key={p.id} product={p} role={role} statusBadge={statusBadge} onClick={() => setSelectedProduct(p)} />)}</div>
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

