const TEMPLATE_HTML = '<style>\n  @import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap");\n  :root{\n    --bg:#0d1417;\n    --bg-grad: radial-gradient(1200px 600px at 15% -10%, #14232a 0%, #0d1417 55%);\n    --surface:#141c20;\n    --surface-2:#182226;\n    --border:#243136;\n    --text:#e8edee;\n    --text-dim:#8ea0a6;\n    --text-faint:#5d6c71;\n\n    --solar:#f0a83c;\n    --solar-dim:#5a4324;\n    --battery:#42b883;\n    --battery-dim:#274536;\n    --grid:#6f93b8;\n    --grid-dim:#2a3947;\n    --ev:#b18cf0;\n    --ev-dim:#3a3050;\n    --weather:#5ab4e0;\n    --weather-dim:#1f3a47;\n    --price-low:#42b883;\n    --price-mid:#f0a83c;\n    --price-high:#e2634f;\n\n    /* seasonal scene — default (summer) */\n    --sky-top:#5f9fc9;\n    --sky-bottom:#bfe0c9;\n    --celestial:#ffe9a0;\n    --celestial-glow:rgba(255,233,160,0.35);\n    --ground:#4d8f47;\n    --ground-2:#3f7a3c;\n    --foliage:#3f8f47;\n    --foliage-2:#367b3d;\n    --trunk:#5b4330;\n    --house-wall:#e7ded0;\n    --house-roof:#3a3230;\n    --window:#f5c563;\n\n    --car-red:#c23b2e;\n    --car-red-dark:#8f2a20;\n    --car-blue:#3f7fc7;\n    --car-blue-dark:#2c5c92;\n    --panel:#1c2b3d;\n    --panel-line:#3a5570;\n    --soil:#5a4227;\n    --sprout:#5fae4a;\n    --wood:#8a6640;\n    --glass:#d9edf0;\n  }\n\n  [data-season="spring"]{\n    --sky-top:#a9d8ea; --sky-bottom:#eaf3d8;\n    --celestial:#fff3c2; --celestial-glow:rgba(255,243,194,0.4);\n    --ground:#7fbf5e; --ground-2:#69a84e;\n    --foliage:#f1a9c4; --foliage-2:#e78fb0;\n    --trunk:#6b4d35;\n    --house-wall:#f0e8db; --house-roof:#463b37; --window:#ffd989;\n  }\n  [data-season="autumn"]{\n    --sky-top:#e3a860; --sky-bottom:#f3d9a8;\n    --celestial:#ffcf8a; --celestial-glow:rgba(255,207,138,0.4);\n    --ground:#a97a3c; --ground-2:#8f6531;\n    --foliage:#d9772c; --foliage-2:#c2491f;\n    --trunk:#4f3a28;\n    --house-wall:#e6ddce; --house-roof:#392f2c; --window:#ffb865;\n  }\n  [data-season="winter"]{\n    --sky-top:#3d5164; --sky-bottom:#c3d3dc;\n    --celestial:#eef4f8; --celestial-glow:rgba(238,244,248,0.3);\n    --ground:#eef3f5; --ground-2:#d9e3e7;\n    --foliage:#eef3f5; --foliage-2:#d9e3e7;\n    --trunk:#40332a;\n    --house-wall:#dfe7ea; --house-roof:#2c3438; --window:#ffcf7a;\n  }\n\n  *{box-sizing:border-box; margin:0; padding:0;}\n\n  :host{\n    display:block;\n    background:var(--bg-grad), var(--bg);\n    color:var(--text);\n    font-family:\'Inter\', sans-serif;\n    border-radius:16px;\n    overflow:hidden;\n  }\n\n  .wrap{max-width:1320px; margin:0 auto; padding:20px 20px 28px;}\n\n  /* ---------- header ---------- */\n  header{\n    display:flex; align-items:flex-end; justify-content:space-between;\n    margin-bottom:22px; flex-wrap:wrap; gap:16px;\n  }\n  .brand{display:flex; align-items:center; gap:12px;}\n  .brand-mark{\n    width:38px; height:38px; border-radius:9px;\n    background:linear-gradient(135deg, var(--solar), var(--ev));\n    display:flex; align-items:center; justify-content:center;\n    font-family:\'Space Grotesk\'; font-weight:700; color:#0d1417; font-size:16px;\n  }\n  .brand h1{font-family:\'Space Grotesk\'; font-weight:600; font-size:20px; letter-spacing:0.2px;}\n  .brand span{display:block; font-size:12px; color:var(--text-dim); margin-top:1px;}\n  .clock{\n    font-family:\'JetBrains Mono\'; font-size:13px; color:var(--text-dim);\n    text-align:right;\n  }\n  .clock b{color:var(--text); font-weight:500;}\n\n  /* ---------- hero flow ---------- */\n  .hero{\n    background:var(--surface);\n    border:1px solid var(--border);\n    border-radius:16px;\n    padding:22px 26px 10px;\n    margin-bottom:20px;\n    position:relative;\n    overflow:hidden;\n  }\n  .hero-top{\n    display:flex; justify-content:space-between; align-items:flex-start;\n    margin-bottom:6px; flex-wrap:wrap; gap:10px;\n  }\n  .hero-title{font-family:\'Space Grotesk\'; font-size:15px; font-weight:600; color:var(--text);}\n  .hero-sub{font-size:12px; color:var(--text-dim); margin-top:2px;}\n  .hero-stat{text-align:right;}\n  .hero-stat .num{font-family:\'JetBrains Mono\'; font-size:26px; font-weight:600; color:var(--battery);}\n  .hero-stat .lbl{font-size:11px; color:var(--text-dim); text-transform:uppercase; letter-spacing:0.06em;}\n\n  svg.flow{width:100%; height:auto; display:block;}\n  .flow-legend{\n    display:flex; align-items:center; gap:18px; flex-wrap:wrap;\n    padding:10px 22px 0; font-size:11px; color:var(--text-dim);\n  }\n  .flow-legend span{display:flex; align-items:center; gap:6px;}\n  .flow-legend i{width:9px; height:9px; border-radius:50%; display:inline-block;}\n  .flow-legend-note{margin-left:auto; color:var(--text-faint); font-style:italic;}\n  .flow-line{fill:none; stroke-linecap:round;}\n  .flow-dash{stroke-dasharray:2 10; animation:flowmove 1.1s linear infinite;}\n  @keyframes flowmove{to{stroke-dashoffset:-24;}}\n  .flow-pulse{stroke-dasharray:6 20; animation:flowmovebig 1.4s linear infinite; filter:drop-shadow(0 0 3px currentColor);}\n  @keyframes flowmovebig{to{stroke-dashoffset:-52;}}\n  .node-box{fill:var(--surface-2); stroke:var(--border); stroke-width:1;}\n  .node-label{font-family:\'Space Grotesk\'; font-size:12px; font-weight:600; fill:var(--text);}\n  .node-value{font-family:\'JetBrains Mono\'; font-size:13px; font-weight:600;}\n  .edge-badge{font-family:\'JetBrains Mono\'; font-size:11px; font-weight:500;}\n  .edge-pill{fill:var(--surface); stroke:var(--border); stroke-width:1;}\n\n  /* ---------- grid ---------- */\n  .grid{\n    display:grid;\n    grid-template-columns:repeat(4, 1fr);\n    gap:18px;\n    margin-bottom:18px;\n  }\n  @media (max-width:1080px){ .grid{grid-template-columns:repeat(2, 1fr);} }\n  @media (max-width:620px){ .grid{grid-template-columns:1fr;} }\n\n  .card{\n    background:var(--surface);\n    border:1px solid var(--border);\n    border-radius:14px;\n    padding:18px 18px 16px;\n    display:flex; flex-direction:column;\n  }\n  .card-head{display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;}\n  .card-title{display:flex; align-items:center; gap:8px;}\n  .dot{width:8px; height:8px; border-radius:50%;}\n  .card-title h3{font-family:\'Space Grotesk\'; font-size:13px; font-weight:600;}\n  .source-tag{font-size:10px; color:var(--text-faint); text-transform:uppercase; letter-spacing:0.07em;}\n  .status-chip{\n    font-size:10px; padding:3px 8px; border-radius:20px; font-weight:600;\n    text-transform:uppercase; letter-spacing:0.04em;\n  }\n\n  .big-num{font-family:\'JetBrains Mono\'; font-size:30px; font-weight:600; line-height:1;}\n  .big-num small{font-size:14px; color:var(--text-dim); font-weight:500; margin-left:4px;}\n  .sub-line{font-size:12px; color:var(--text-dim); margin-top:6px;}\n\n  .meter{\n    width:100%; height:8px; border-radius:5px; background:var(--surface-2);\n    overflow:hidden; margin-top:14px; border:1px solid var(--border);\n  }\n  .meter-fill{height:100%; border-radius:5px;}\n\n  .stat-row{display:flex; justify-content:space-between; margin-top:12px; font-size:12px;}\n  .stat-row .k{color:var(--text-dim);}\n  .stat-row .v{font-family:\'JetBrains Mono\'; font-weight:500;}\n\n  /* Fronius mini chart */\n  .spark{width:100%; height:52px; margin-top:14px;}\n\n  /* Tibber wide card */\n  .wide-card{grid-column:span 2;}\n  @media (max-width:1080px){ .wide-card{grid-column:span 2;} }\n  @media (max-width:620px){ .wide-card{grid-column:span 1;} }\n\n  .price-bars{\n    display:flex; align-items:flex-end; gap:3px; height:74px; margin-top:16px;\n  }\n  .pbar{flex:1; border-radius:3px 3px 0 0; position:relative; min-width:2px;}\n  .pbar.now::after{\n    content:\'\'; position:absolute; left:50%; top:-8px; transform:translateX(-50%);\n    width:5px; height:5px; border-radius:50%; background:var(--text);\n  }\n  .price-legend{display:flex; justify-content:space-between; font-size:10px; color:var(--text-faint); margin-top:6px; font-family:\'JetBrains Mono\';}\n\n  /* Shelly row */\n  .devices-card{grid-column:span 2;}\n  @media (max-width:1080px){ .devices-card{grid-column:span 2;} }\n  @media (max-width:620px){ .devices-card{grid-column:span 1;} }\n  .device-list{display:flex; flex-direction:column; gap:10px; margin-top:4px;}\n  .device{\n    display:flex; align-items:center; justify-content:space-between;\n    padding:10px 12px; background:var(--surface-2); border:1px solid var(--border);\n    border-radius:10px;\n  }\n  .device-left{display:flex; align-items:center; gap:10px;}\n  .device-icon{\n    width:30px; height:30px; border-radius:8px; display:flex; align-items:center; justify-content:center;\n    background:rgba(240,168,60,0.12); font-size:14px;\n  }\n  .device-name{font-size:13px; font-weight:500;}\n  .device-room{font-size:11px; color:var(--text-faint);}\n  .device-right{display:flex; align-items:center; gap:12px;}\n  .device-power{font-family:\'JetBrains Mono\'; font-size:12px; color:var(--text-dim);}\n  .toggle{\n    width:36px; height:20px; border-radius:20px; position:relative; cursor:pointer; transition:background 0.2s;\n    border:none; flex-shrink:0;\n  }\n  .toggle::after{\n    content:\'\'; position:absolute; top:2px; left:2px; width:16px; height:16px; border-radius:50%;\n    background:#0d1417; transition:transform 0.2s;\n  }\n  .toggle.on{background:var(--battery);}\n  .toggle.on::after{transform:translateX(16px); background:#fff;}\n  .toggle.off{background:var(--surface); border:1px solid var(--border);}\n  .toggle.off::after{background:var(--text-faint);}\n\n  /* footer summary */\n  .footer{\n    display:grid; grid-template-columns:repeat(4,1fr); gap:18px; margin-top:8px;\n  }\n  @media (max-width:780px){ .footer{grid-template-columns:repeat(2,1fr);} }\n  .foot-item{\n    background:var(--surface); border:1px solid var(--border); border-radius:12px;\n    padding:14px 16px;\n  }\n  .foot-item .lbl{font-size:11px; color:var(--text-dim); text-transform:uppercase; letter-spacing:0.05em;}\n  .foot-item .val{font-family:\'JetBrains Mono\'; font-size:18px; font-weight:600; margin-top:4px;}\n\n  .footnote{\n    text-align:center; font-size:11px; color:var(--text-faint); margin-top:26px;\n  }\n\n  .valve-buttons{\n    display:flex; gap:10px; margin-top:16px; flex-wrap:wrap;\n  }\n  .valve-btn{\n    flex:1; min-width:110px; padding:12px 14px; border-radius:10px;\n    background:var(--surface-2); border:1px solid var(--border); color:var(--text);\n    font-family:\'Space Grotesk\'; font-size:13px; font-weight:600; cursor:pointer;\n    transition:background 0.15s, border-color 0.15s;\n  }\n  .valve-btn:hover{border-color:var(--grid);}\n  .valve-btn.active{background:var(--grid-dim); border-color:var(--grid); color:var(--grid);}\n  .valve-btn.off-btn.active{background:var(--surface-2); border-color:var(--border); color:var(--text-dim);}\n\n  /* ---------- seasonal scene ---------- */\n  .scene-card{\n    background:var(--surface);\n    border:1px solid var(--border);\n    border-radius:16px;\n    padding:0;\n    margin-bottom:20px;\n    overflow:hidden;\n    position:relative;\n  }\n  .scene-head{\n    display:flex; justify-content:space-between; align-items:center;\n    padding:16px 22px 0;\n  }\n  .scene-title{font-family:\'Space Grotesk\'; font-size:15px; font-weight:600;}\n  .scene-sub{font-size:12px; color:var(--text-dim); margin-top:2px;}\n  .season-chip{\n    font-size:11px; padding:4px 11px; border-radius:20px; font-weight:600;\n    text-transform:uppercase; letter-spacing:0.05em;\n    background:var(--surface-2); border:1px solid var(--border); color:var(--text);\n  }\n  .scene-frame{\n    position:relative; width:100%; margin-top:12px; line-height:0;\n  }\n  svg.scene{width:100%; height:auto; display:block; transition:filter 0.6s ease;}\n  .sky{transition:fill 0.6s ease;}\n  .foliage-group{transition:opacity 0.5s ease;}\n  .branch-group{transition:opacity 0.5s ease;}\n  [data-season="winter"] .foliage-group{opacity:0;}\n  [data-season="winter"] .branch-group{opacity:1;}\n  .branch-group{opacity:0;}\n  .snow-cap{transition:opacity 0.5s ease; opacity:0;}\n  [data-season="winter"] .snow-cap{opacity:1;}\n  .smoke{opacity:0.55; animation:smokeDrift 6s ease-in-out infinite;}\n  @keyframes smokeDrift{\n    0%{transform:translate(0,0); opacity:0.5;}\n    50%{transform:translate(4px,-14px); opacity:0.25;}\n    100%{transform:translate(-2px,-28px); opacity:0;}\n  }\n\n  .particles{\n    position:absolute; inset:0; overflow:hidden; pointer-events:none;\n  }\n  .particle{\n    position:absolute; top:-5%; border-radius:50%; opacity:0.9;\n    animation-name:fall; animation-timing-function:linear; animation-iteration-count:infinite;\n  }\n  .particle.petal{width:8px; height:6px; background:var(--foliage); border-radius:60% 40% 60% 40%;}\n  .particle.leaf{width:9px; height:9px; background:var(--foliage); border-radius:0 60% 0 60%;}\n  .particle.snow{width:5px; height:5px; background:#fff; border-radius:50%;}\n  .particle.rain{width:2px; height:15px; background:linear-gradient(to bottom, transparent, #bcd9ea); border-radius:2px; animation-name:fallRain;}\n  @keyframes fallRain{\n    0%{transform:translateY(0); opacity:0.9;}\n    100%{transform:translateY(230px); opacity:0.2;}\n  }\n  .cloud-overlay{fill:#1c2933; opacity:0; transition:opacity 0.8s ease;}\n  [data-weather="cloudy"] .cloud-overlay{opacity:0.28;}\n  [data-weather="rain"] .cloud-overlay{opacity:0.4;}\n  [data-weather="rain"] .sun-glow, [data-weather="cloudy"] .sun-glow{opacity:0.15;}\n  [data-weather="rain"] .sun-body, [data-weather="cloudy"] .sun-body{opacity:0.45;}\n  .sun-glow, .sun-body{transition:opacity 0.6s ease;}\n  @keyframes fall{\n    0%{transform:translateY(0) translateX(0) rotate(0deg); opacity:0.9;}\n    100%{transform:translateY(230px) translateX(var(--drift, 20px)) rotate(200deg); opacity:0.15;}\n  }\n\n</style>\n<div class="wrap">\n\n  <header>\n    <div class="brand">\n      <div class="brand-mark">G</div>\n      <div>\n        <h1>Grankullevägen 19</h1>\n        <span>Home energy overview</span>\n      </div>\n    </div>\n    <div class="clock" id="c-clock">–</div>\n  </header>\n\n  <!-- SEASONAL SCENE -->\n  <div class="scene-card" id="sceneCard" data-season="summer">\n    <div class="scene-head">\n      <div>\n        <div class="scene-title">Grankullevägen 19</div>\n        <div class="scene-sub" id="sceneSub">Loading season…</div>\n      </div>\n      <span class="season-chip" id="seasonChip">—</span>\n    </div>\n    <div class="scene-frame">\n      <svg class="scene" viewBox="0 0 1180 230" xmlns="http://www.w3.org/2000/svg">\n        <defs>\n          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">\n            <stop offset="0%" style="stop-color:var(--sky-top)"/>\n            <stop offset="100%" style="stop-color:var(--sky-bottom)"/>\n          </linearGradient>\n        </defs>\n\n        <!-- sky -->\n        <rect class="sky" x="0" y="0" width="1180" height="230" fill="url(#skyGrad)"/>\n\n        <!-- sun / moon -->\n        <circle class="sun-glow" cx="990" cy="52" r="52" fill="var(--celestial-glow)"/>\n        <circle class="sun-body" cx="990" cy="52" r="30" fill="var(--celestial)"/>\n        <rect class="cloud-overlay" x="0" y="0" width="1180" height="230"/>\n\n        <!-- distant hill -->\n        <path d="M0,175 Q300,140 620,170 T1180,160 L1180,230 L0,230 Z" fill="var(--ground-2)" opacity="0.6"/>\n\n        <!-- ground -->\n        <path d="M0,190 Q300,168 620,188 T1180,178 L1180,230 L0,230 Z" fill="var(--ground)"/>\n\n        <!-- greenhouse -->\n        <g transform="translate(30,148)">\n          <polygon points="0,42 90,42 90,20 45,0 0,20" fill="var(--glass)" opacity="0.55" stroke="#ffffff" stroke-width="1.5"/>\n          <rect x="0" y="42" width="90" height="4" fill="var(--wood)"/>\n          <line x1="45" y1="0" x2="45" y2="42" stroke="#ffffff" stroke-width="1" opacity="0.6"/>\n          <line x1="22" y1="11" x2="22" y2="42" stroke="#ffffff" stroke-width="1" opacity="0.5"/>\n          <line x1="68" y1="11" x2="68" y2="42" stroke="#ffffff" stroke-width="1" opacity="0.5"/>\n          <path d="M14,42 L14,26 L24,20 L24,42 Z" fill="var(--sprout)" opacity="0.8"/>\n          <path d="M58,42 L58,24 L70,18 L70,42 Z" fill="var(--foliage)" opacity="0.8"/>\n          <g class="snow-cap"><ellipse cx="45" cy="8" rx="30" ry="5" fill="#fff" opacity="0.85"/></g>\n        </g>\n\n        <!-- garden beds -->\n        <g transform="translate(140,178)">\n          <g>\n            <rect x="0" y="0" width="34" height="14" rx="2" fill="var(--soil)"/>\n            <path d="M4,0 L4,-7 M11,0 L11,-9 M18,0 L18,-7 M25,0 L25,-9 M31,0 L31,-7" stroke="var(--sprout)" stroke-width="2" stroke-linecap="round"/>\n          </g>\n          <g transform="translate(42,4)">\n            <rect x="0" y="0" width="34" height="14" rx="2" fill="var(--soil)"/>\n            <path d="M4,0 L4,-7 M11,0 L11,-9 M18,0 L18,-7 M25,0 L25,-9 M31,0 L31,-7" stroke="var(--foliage)" stroke-width="2" stroke-linecap="round"/>\n          </g>\n          <g transform="translate(84,9)">\n            <rect x="0" y="0" width="34" height="14" rx="2" fill="var(--soil)"/>\n            <path d="M4,0 L4,-7 M11,0 L11,-9 M18,0 L18,-7 M25,0 L25,-9 M31,0 L31,-7" stroke="var(--sprout)" stroke-width="2" stroke-linecap="round"/>\n          </g>\n        </g>\n\n        <!-- chicken coop -->\n        <g transform="translate(255,142)">\n          <rect x="10" y="16" width="4" height="18" fill="var(--wood)"/>\n          <rect x="46" y="16" width="4" height="18" fill="var(--wood)"/>\n          <rect x="4" y="0" width="52" height="18" rx="2" fill="var(--wood)"/>\n          <polygon points="0,0 60,0 30,-16" fill="var(--house-roof)"/>\n          <rect x="22" y="6" width="10" height="10" fill="#2c3438"/>\n          <path d="M4,18 L-10,32" stroke="var(--wood)" stroke-width="4" stroke-linecap="round"/>\n          <g class="snow-cap"><ellipse cx="30" cy="-10" rx="28" ry="5" fill="#fff" opacity="0.85"/></g>\n          <!-- fenced run -->\n          <path d="M60,34 L60,10 M68,34 L68,8 M76,34 L76,10 M84,34 L84,8 M92,34 L92,10" stroke="var(--wood)" stroke-width="2" opacity="0.7"/>\n          <g transform="translate(66,26)">\n            <ellipse cx="0" cy="0" rx="9" ry="6" fill="#e8ded0"/>\n            <circle cx="7" cy="-4" r="4" fill="#e8ded0"/>\n            <polygon points="10,-6 14,-5 10,-3" fill="#c23b2e"/>\n          </g>\n          <g transform="translate(84,28)">\n            <ellipse cx="0" cy="0" rx="8" ry="5.5" fill="#c9a876"/>\n            <circle cx="6" cy="-4" r="3.5" fill="#c9a876"/>\n            <polygon points="9,-5 12,-4 9,-3" fill="#c23b2e"/>\n          </g>\n        </g>\n\n        <!-- tree left -->\n        <g transform="translate(395,0)">\n          <rect x="-6" y="118" width="12" height="60" fill="var(--trunk)" rx="3"/>\n          <g class="branch-group">\n            <path d="M0,150 L-30,120 M0,140 L28,110 M0,130 L-22,95 M0,120 L18,90" stroke="var(--trunk)" stroke-width="4" stroke-linecap="round" fill="none"/>\n          </g>\n          <g class="foliage-group">\n            <circle cx="-18" cy="110" r="26" fill="var(--foliage)"/>\n            <circle cx="16" cy="100" r="30" fill="var(--foliage-2)"/>\n            <circle cx="2" cy="80" r="26" fill="var(--foliage)"/>\n          </g>\n          <g class="snow-cap">\n            <ellipse cx="-18" cy="98" rx="15" ry="7" fill="#fff" opacity="0.85"/>\n            <ellipse cx="16" cy="86" rx="16" ry="7" fill="#fff" opacity="0.85"/>\n            <ellipse cx="2" cy="68" rx="14" ry="6" fill="#fff" opacity="0.85"/>\n          </g>\n        </g>\n\n        <!-- house with rooftop solar -->\n        <g transform="translate(560,60)">\n          <polygon points="-10,60 110,60 130,15 -30,15" fill="var(--house-roof)"/>\n          <g transform="translate(-14,20) rotate(-16)">\n            <rect x="0" y="0" width="70" height="30" fill="var(--panel)" rx="1"/>\n            <path d="M0,7.5 L70,7.5 M0,15 L70,15 M0,22.5 L70,22.5 M17.5,0 L17.5,30 M35,0 L35,30 M52.5,0 L52.5,30"\n                  stroke="var(--panel-line)" stroke-width="1"/>\n            <path d="M4,4 L20,4" stroke="#7fa8c9" stroke-width="1.5" opacity="0.5"/>\n          </g>\n          <rect x="0" y="60" width="90" height="80" fill="var(--house-wall)"/>\n          <rect x="14" y="82" width="24" height="24" fill="var(--window)" opacity="0.95"/>\n          <rect x="52" y="82" width="24" height="24" fill="var(--window)" opacity="0.95"/>\n          <rect x="38" y="112" width="20" height="28" fill="var(--trunk)"/>\n          <rect x="78" y="0" width="10" height="26" fill="var(--house-roof)"/>\n          <ellipse class="smoke" cx="83" cy="-6" rx="6" ry="8" fill="#cfd9dd"/>\n        </g>\n\n        <!-- driveway: red Volvo V60 -->\n        <g transform="translate(715,158)">\n          <ellipse cx="16" cy="34" rx="46" ry="5" fill="#000" opacity="0.15"/>\n          <path d="M0,30 L2,16 Q6,6 20,6 L34,6 Q46,6 50,14 L64,16 Q70,18 70,26 L70,30 Z" fill="var(--car-red)"/>\n          <path d="M20,8 L34,8 Q42,8 45,14 L21,14 Z" fill="#2a2f33" opacity="0.85"/>\n          <rect x="0" y="26" width="70" height="6" fill="var(--car-red-dark)"/>\n          <circle cx="16" cy="32" r="8" fill="#20262a"/>\n          <circle cx="16" cy="32" r="3.2" fill="#8a949a"/>\n          <circle cx="56" cy="32" r="8" fill="#20262a"/>\n          <circle cx="56" cy="32" r="3.2" fill="#8a949a"/>\n        </g>\n\n        <!-- charging station + blue Nissan Leaf -->\n        <g transform="translate(845,120)">\n          <rect x="0" y="20" width="8" height="48" rx="2" fill="#3a4247"/>\n          <rect x="-3" y="10" width="14" height="18" rx="3" fill="#232b2f"/>\n          <circle cx="4" cy="18" r="2" fill="var(--ev)"/>\n          <path class="flow-line flow-dash" d="M4,28 C4,45 40,50 62,52" stroke="var(--ev)" stroke-width="2"/>\n\n          <g transform="translate(60,38)">\n            <ellipse cx="14" cy="32" rx="42" ry="5" fill="#000" opacity="0.15"/>\n            <path d="M0,26 L3,14 Q7,5 20,5 L30,5 Q40,5 44,13 L58,15 Q64,17 64,24 L64,26 Z" fill="var(--car-blue)"/>\n            <path d="M20,7 L30,7 Q37,7 40,13 L21,13 Z" fill="#1c232a" opacity="0.85"/>\n            <rect x="0" y="22" width="64" height="6" fill="var(--car-blue-dark)"/>\n            <circle cx="14" cy="28" r="7.5" fill="#20262a"/>\n            <circle cx="14" cy="28" r="3" fill="#8a949a"/>\n            <circle cx="50" cy="28" r="7.5" fill="#20262a"/>\n            <circle cx="50" cy="28" r="3" fill="#8a949a"/>\n          </g>\n        </g>\n\n        <!-- tree right -->\n        <g transform="translate(1040,10)">\n          <rect x="-5" y="128" width="10" height="52" fill="var(--trunk)" rx="3"/>\n          <g class="branch-group">\n            <path d="M0,155 L-24,130 M0,145 L22,122 M0,135 L-16,105" stroke="var(--trunk)" stroke-width="3.5" stroke-linecap="round" fill="none"/>\n          </g>\n          <g class="foliage-group">\n            <circle cx="-14" cy="118" r="22" fill="var(--foliage-2)"/>\n            <circle cx="12" cy="112" r="24" fill="var(--foliage)"/>\n          </g>\n          <g class="snow-cap">\n            <ellipse cx="-14" cy="106" rx="12" ry="6" fill="#fff" opacity="0.85"/>\n            <ellipse cx="12" cy="98" rx="13" ry="6" fill="#fff" opacity="0.85"/>\n          </g>\n        </g>\n      </svg>\n      <div class="particles" id="particles"></div>\n    </div>\n  </div>\n\n  <div class="hero">\n    <div class="hero-top">\n      <div>\n        <div class="hero-title">Live power flow</div>\n        <div class="hero-sub" id="fv-sub">Nät → MultiPlus (AC in/ut) → hus · batteri på DC-sidan</div>\n      </div>\n      <div class="hero-stat">\n        <div class="num" id="fv-selfsuff">–</div>\n        <div class="lbl">Andel egen sol idag (ackumulerat)</div>\n      </div>\n    </div>\n\n    <div class="flow-legend">\n      <span><i style="background:#6f93b8"></i>Nät</span>\n      <span><i style="background:#42b883"></i>Batteri</span>\n      <span><i style="background:#f0a83c"></i>Sol</span>\n      <span><i style="background:#3a4247"></i>Inaktivt just nu</span>\n      <span class="flow-legend-note">Pilriktning = åt vilket håll effekten går</span>\n    </div>\n\n    <svg class="flow" viewBox="0 0 1180 280" xmlns="http://www.w3.org/2000/svg">\n      <defs>\n        <marker id="arrowGrid" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">\n          <path d="M0,0 L10,5 L0,10 Z" fill="#6f93b8"/>\n        </marker>\n        <marker id="arrowBattery" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">\n          <path d="M0,0 L10,5 L0,10 Z" fill="#42b883"/>\n        </marker>\n        <marker id="arrowDim" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">\n          <path d="M0,0 L10,5 L0,10 Z" fill="#3a4247"/>\n        </marker>\n      </defs>\n\n      <!-- edges -->\n      <!-- Batteri (DC) → MultiPlus (discharging now, small) -->\n      <path class="flow-line" id="fv-path-batt" d="M 335 74 C 335 88, 335 96, 335 108" stroke="#42b883" stroke-width="3" marker-end="url(#arrowBattery)" style="color:#42b883"/>\n      <!-- Nät → MultiPlus AC-in (main import) -->\n      <path class="flow-line" id="fv-path-gridin" d="M 170 226 C 260 226, 300 190, 320 174" stroke="#6f93b8" stroke-width="4.5" marker-end="url(#arrowGrid)" style="color:#6f93b8"/>\n      <!-- MultiPlus AC-ut → Hus (combined output) -->\n      <path class="flow-line" id="fv-path-gridout" d="M 470 138 C 560 138, 580 128, 620 116" stroke="#6f93b8" stroke-width="4.5" marker-end="url(#arrowGrid)" style="color:#6f93b8"/>\n      <!-- Fronius ↔ output bus near Hus (inactive, 0W) -->\n      <path class="flow-line" id="fv-path-fronius" d="M 690 200 C 690 170, 680 150, 660 132" stroke="#3a4247" stroke-width="2" marker-end="url(#arrowDim)"/>\n      <!-- Hus → EV (inactive, not connected) -->\n      <path class="flow-line" id="fv-path-ev" d="M 830 100 C 900 90, 930 90, 970 90" stroke="#3a4247" stroke-width="2" marker-end="url(#arrowDim)"/>\n\n      <!-- Batteri node (DC side) -->\n      <rect class="node-box" x="230" y="16" width="200" height="58" rx="10"/>\n      <text class="node-label" x="330" y="38" text-anchor="middle">Batteri (DC)</text>\n      <text class="node-value" id="fv-battery" x="330" y="58" text-anchor="middle" fill="#42b883">– % SoC</text>\n\n      <!-- MultiPlus node -->\n      <rect class="node-box" x="230" y="108" width="240" height="66" rx="10"/>\n      <text class="node-label" x="350" y="130" text-anchor="middle">MultiPlus-II</text>\n      <text class="node-value" x="350" y="149" text-anchor="middle" fill="#e8edee">AC in → AC ut</text>\n      <text class="node-value" id="fv-multiplus" x="350" y="166" text-anchor="middle" fill="#6f93b8" style="font-size:11px;">– kW genom</text>\n\n      <!-- Nät node -->\n      <rect class="node-box" x="30" y="200" width="140" height="56" rx="10"/>\n      <text class="node-label" x="100" y="222" text-anchor="middle">Nät</text>\n      <text class="node-value" id="fv-grid" x="100" y="241" text-anchor="middle" fill="#6f93b8">–</text>\n\n      <!-- Hus node -->\n      <rect class="node-box" x="620" y="86" width="140" height="56" rx="10"/>\n      <text class="node-label" x="690" y="108" text-anchor="middle">Hus</text>\n      <text class="node-value" id="fv-house" x="690" y="127" text-anchor="middle" fill="#e8edee">–</text>\n\n      <!-- Fronius node -->\n      <rect class="node-box" x="620" y="200" width="140" height="56" rx="10"/>\n      <text class="node-label" x="690" y="222" text-anchor="middle">Fronius (sol)</text>\n      <text class="node-value" id="fv-fronius" x="690" y="241" text-anchor="middle" fill="#5d6c71">–</text>\n\n      <!-- EV node -->\n      <rect class="node-box" x="970" y="64" width="140" height="56" rx="10"/>\n      <text class="node-label" x="1040" y="86" text-anchor="middle">EV-laddare</text>\n      <text class="node-value" id="fv-ev" x="1040" y="105" text-anchor="middle" fill="#5d6c71">–</text>\n    </svg>\n  </div>\n\n\n  <!-- WIDGET GRID -->\n  <div class="grid">\n\n    <!-- VICTRON -->\n    <div class="card">\n      <div class="card-head">\n        <div class="card-title">\n          <span class="dot" style="background:var(--battery)"></span>\n          <div>\n            <h3>Battery</h3>\n            <div class="source-tag">Victron · GX / Pylontech</div>\n          </div>\n        </div>\n        <span class="status-chip" id="c-batt-chip" style="background:var(--battery-dim); color:var(--battery)">–</span>\n      </div>\n      <div class="big-num" id="c-batt-soc">–<small>% SoC</small></div>\n      <div class="sub-line" id="c-batt-sub">–</div>\n      <div class="meter"><div class="meter-fill" id="c-batt-meter" style="width:0%; background:var(--battery)"></div></div>\n      <div class="stat-row"><span class="k">Spänning</span><span class="v" id="c-batt-volt">–</span></div>\n      <div class="stat-row"><span class="k">Celltemperatur</span><span class="v" id="c-batt-temp">–</span></div>\n    </div>\n\n    <!-- FRONIUS -->\n    <div class="card">\n      <div class="card-head">\n        <div class="card-title">\n          <span class="dot" style="background:var(--solar)"></span>\n          <div>\n            <h3>Solar</h3>\n            <div class="source-tag">Fronius Symo 12.5-3-M</div>\n          </div>\n        </div>\n        <span class="status-chip" id="c-fro-chip" style="background:var(--surface-2); color:var(--text-dim)">–</span>\n      </div>\n      <div class="big-num" id="c-fro-power">–<small>W nu</small></div>\n      <div class="sub-line" id="c-fro-sub">–</div>\n      <svg class="spark" viewBox="0 0 260 52" preserveAspectRatio="none">\n        <path d="M0,50 L15,48 L30,42 L45,30 L60,20 L75,10 L90,6 L105,4 L120,3 L135,5 L150,8 L165,12 L180,15 L195,18 L210,22 L225,25 L240,28 L260,32"\n              fill="none" stroke="#f0a83c" stroke-width="2"/>\n        <path d="M0,50 L15,48 L30,42 L45,30 L60,20 L75,10 L90,6 L105,4 L120,3 L135,5 L150,8 L165,12 L180,15 L195,18 L210,22 L225,25 L240,28 L260,32 L260,52 L0,52 Z"\n              fill="#f0a83c" opacity="0.12"/>\n      </svg>\n      <div class="stat-row"><span class="k">Total livstidsproduktion</span><span class="v" id="c-fro-lifetime">–</span></div>\n    </div>\n\n    <!-- ZAPTEC -->\n    <div class="card">\n      <div class="card-head">\n        <div class="card-title">\n          <span class="dot" style="background:var(--ev)"></span>\n          <div>\n            <h3>EV charger</h3>\n            <div class="source-tag">Zaptec</div>\n          </div>\n        </div>\n        <span class="status-chip" id="c-zap-chip" style="background:var(--surface-2); color:var(--text-dim)">–</span>\n      </div>\n      <div class="big-num" id="c-zap-power">–<small>W</small></div>\n      <div class="sub-line" id="c-zap-sub">–</div>\n      <div class="stat-row"><span class="k">Kontakt</span><span class="v" id="c-zap-plug">–</span></div>\n      <div class="stat-row"><span class="k">Laddning</span><span class="v" id="c-zap-charging">–</span></div>\n      <div class="stat-row"><span class="k">Max laddström</span><span class="v" id="c-zap-maxcurrent">–</span></div>\n    </div>\n\n    <!-- TEMPEST WEATHERFLOW -->\n    <div class="card">\n      <div class="card-head">\n        <div class="card-title">\n          <span class="dot" style="background:var(--weather)"></span>\n          <div>\n            <h3>Weather</h3>\n            <div class="source-tag">Tempest Taknock · Utomhus</div>\n          </div>\n        </div>\n        <span class="status-chip" id="c-wx-chip" style="background:var(--weather-dim); color:var(--weather)">–</span>\n      </div>\n      <div class="big-num" id="c-wx-temp">–<small>°C</small></div>\n      <div class="sub-line" id="c-wx-sub">–</div>\n      <div class="stat-row"><span class="k">Daggpunkt</span><span class="v" id="c-wx-dew">–</span></div>\n      <div class="stat-row"><span class="k">Våt bulbtemperatur</span><span class="v" id="c-wx-wetbulb">–</span></div>\n      <div class="stat-row"><span class="k">Regn (idag)</span><span class="v" id="c-wx-rain">–</span></div>\n      <div class="stat-row"><span class="k">UV-index</span><span class="v" id="c-wx-uv">–</span></div>\n      <div class="stat-row" style="border-top:1px solid var(--border); padding-top:10px; margin-top:2px;">\n        <span class="k">🐔 Hönshus</span><span class="v" id="c-coop">–</span>\n      </div>\n    </div>\n\n    <!-- TIBBER -->\n    <div class="card wide-card">\n      <div class="card-head">\n        <div class="card-title">\n          <span class="dot" style="background:var(--price-mid)"></span>\n          <div>\n            <h3>Tibber Pulse</h3>\n            <div class="source-tag">Grankullevägen</div>\n          </div>\n        </div>\n        <span class="status-chip" id="c-tib-chip" style="background:var(--battery-dim); color:var(--battery)">–</span>\n      </div>\n      <div class="big-num" id="c-tib-price">–<small>SEK/kWh</small></div>\n      <div class="sub-line" id="c-tib-sub">–</div>\n      <div class="stat-row"><span class="k">Månadskostnad hittills</span><span class="v" id="c-tib-month">–</span></div>\n      <div class="stat-row"><span class="k">Ackumulerad belöning (såld el)</span><span class="v" id="c-tib-reward" style="color:var(--battery)">–</span></div>\n      <div class="stat-row"><span class="k">Ackumulerad förbrukning / produktion</span><span class="v" id="c-tib-accum">–</span></div>\n    </div>\n\n  </div>\n\n  <!-- SHELLY DEVICES -->\n  <div class="grid" style="grid-template-columns:1fr;">\n    <div class="card devices-card" style="grid-column:1/-1;">\n      <div class="card-head">\n        <div class="card-title">\n          <span class="dot" style="background:var(--grid)"></span>\n          <div>\n            <h3>Smart plugs & switches</h3>\n            <div class="source-tag">Shelly</div>\n          </div>\n        </div>\n        <span class="source-tag" id="c-shelly-count">–</span>\n      </div>\n      <div class="device-list">\n        <div class="device">\n          <div class="device-left">\n            <div class="device-icon">🔌</div>\n            <div>\n              <div class="device-name" id="c-shelly-name">Shelly 1</div>\n              <div class="device-room">shelly1</div>\n            </div>\n          </div>\n          <div class="device-right">\n            <span class="device-power" id="c-shelly-state">–</span>\n            <button class="toggle" id="c-shelly-toggle" data-action="toggle-shelly" aria-label="Toggle shelly1"></button>\n          </div>\n        </div>\n        <div class="device">\n          <div class="device-left">\n            <div class="device-icon">🔌</div>\n            <div>\n              <div class="device-name">shellyplug-s</div>\n              <div class="device-room" id="c-shelly2-power">–</div>\n            </div>\n          </div>\n          <div class="device-right">\n            <span class="device-power" id="c-shelly2-state">–</span>\n            <button class="toggle" id="c-shelly2-toggle" data-action="toggle-shelly2" aria-label="Toggle shelly2"></button>\n          </div>\n        </div>\n      </div>\n      <div class="sub-line">Fler Shelly-enheter kan läggas till i kortets konfiguration.</div>\n    </div>\n\n    <!-- ESS TVINGA LADDNING (husbatteri) -->\n    <div class="card devices-card" style="grid-column:1/-1;">\n      <div class="card-head">\n        <div class="card-title">\n          <span class="dot" style="background:var(--battery)"></span>\n          <div>\n            <h3>Husbatteri — tvinga laddning</h3>\n            <div class="source-tag">Victron ESS · åsidosätter smart-schema</div>\n          </div>\n        </div>\n        <span class="status-chip" id="c-ess-chip" style="background:var(--surface-2); color:var(--text-dim)">–</span>\n      </div>\n      <div class="valve-buttons">\n        <button class="valve-btn" id="c-ess-toggle" data-action="toggle-ess">Växla tvingad laddning</button>\n      </div>\n      <div class="sub-line" style="margin-top:12px;">Riktig styrning — växlar <code>switch</code>-entiteten direkt i din Home Assistant.</div>\n    </div>\n\n    <!-- VATTENVENTIL (Shelly 2 PM, kommande) -->\n    <div class="card devices-card" style="grid-column:1/-1;">\n      <div class="card-head">\n        <div class="card-title">\n          <span class="dot" style="background:var(--grid)"></span>\n          <div>\n            <h3>Vattenventil</h3>\n            <div class="source-tag">Shelly 2 PM · kommer snart</div>\n          </div>\n        </div>\n        <span class="status-chip" id="valveChip" style="background:var(--surface-2); color:var(--text-dim)">Av</span>\n      </div>\n      <div class="big-num" id="valveTimer" style="font-size:22px;">Ventilen är avstängd</div>\n      <div class="valve-buttons">\n        <button class="valve-btn off-btn" data-action="valve" data-minutes="0">Av</button>\n        <button class="valve-btn" data-action="valve" data-minutes="30">På 30 min</button>\n        <button class="valve-btn" data-action="valve" data-minutes="60">På 1 tim</button>\n        <button class="valve-btn" data-action="valve" data-minutes="120">På 2 tim</button>\n      </div>\n      <div class="sub-line" style="margin-top:12px;">Förhandsvisning — knapparna kopplas till riktig on/off + timer när Shelly 2 PM-enheten är installerad och exponerad.</div>\n    </div>\n  </div>\n\n  <!-- FOOTER SUMMARY -->\n  <div class="footer">\n    <div class="foot-item"><div class="lbl">Ackumulerad produktion</div><div class="val" id="f-prod" style="color:var(--solar)">–</div></div>\n    <div class="foot-item"><div class="lbl">Ackumulerad förbrukning</div><div class="val" id="f-cons" style="color:var(--grid)">–</div></div>\n    <div class="foot-item"><div class="lbl">Ackumulerad kostnad</div><div class="val" id="f-cost" style="color:var(--text)">–</div></div>\n    <div class="foot-item"><div class="lbl">Månadskostnad hittills</div><div class="val" id="f-month" style="color:var(--text)">–</div></div>\n  </div>\n\n  <div class="footnote" id="c-updated">Live · Home Assistant</div>\n</div>\n\n<script>\n\n</div>\n';

class GrankulleEnergyCard extends HTMLElement {
  setConfig(config) {
    if (!config || !config.entities) {
      throw new Error("Konfiguration saknas — ange 'entities:' med dina entity-id:n. Se exempel-YAML i dokumentationen.");
    }
    this._config = config;
    this._valveOffAt = null;
    this._built = false;
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._built) {
      this._buildDom();
      this._built = true;
    }
    this._update();
  }

  getCardSize() { return 12; }

  // ---------- helpers ----------
  _e(key) {
    return this._config.entities ? this._config.entities[key] : null;
  }
  _st(key) {
    const id = this._e(key);
    if (!id || !this._hass || !this._hass.states[id]) return null;
    return this._hass.states[id];
  }
  _val(key) {
    const s = this._st(key);
    return s ? s.state : null;
  }
  _num(key, decimals) {
    const v = this._val(key);
    const n = parseFloat(v);
    if (v === null || isNaN(n)) return null;
    return decimals === undefined ? n : n.toFixed(decimals);
  }
  _set(id, text) {
    const el = this.shadowRoot.getElementById(id);
    if (el) el.textContent = text;
  }
  _setStyle(id, prop, value) {
    const el = this.shadowRoot.getElementById(id);
    if (el) el.style[prop] = value;
  }
  _fmt(n, decimals, suffix) {
    if (n === null || n === undefined || isNaN(n)) return '\u2013';
    return n.toFixed(decimals !== undefined ? decimals : 1) + (suffix || '');
  }

  _call(domain, service, key) {
    const id = this._e(key);
    if (!id || !this._hass) return;
    this._hass.callService(domain, service, { entity_id: id });
  }

  // ---------- DOM build (once) ----------
  _buildDom() {
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = TEMPLATE_HTML;

    this.shadowRoot.addEventListener('click', (ev) => {
      const btn = ev.target.closest('[data-action]');
      if (!btn) return;
      const action = btn.dataset.action;
      if (action === 'toggle-shelly') this._call('switch', 'toggle', 'shelly1');
      if (action === 'toggle-shelly2') this._call('switch', 'toggle', 'shelly2');
      if (action === 'toggle-ess') this._call('switch', 'toggle', 'ess_force');
      if (action === 'valve') this._setValve(parseInt(btn.dataset.minutes, 10));
    });

    this._applySeasonAndWeather();
    this._tickClock();
    setInterval(() => this._tickClock(), 30000);
    setInterval(() => this._updateValveTimer(), 1000);
    this._setValve(0);
  }

  // ---------- live data update ----------
  _update() {
    if (!this._hass) return;

    // Victron battery
    const soc = this._num('battery_soc', 0);
    const battPower = this._num('battery_power', 0);
    const battState = this._val('battery_state'); // charging / discharging / idle
    this._set('c-batt-soc', (soc === null ? '\u2013' : soc) );
    this.shadowRoot.getElementById('c-batt-soc').innerHTML = (soc === null ? '\u2013' : soc) + '<small>% SoC</small>';
    const stateLabel = battState === 'charging' ? 'Laddar' : (battState === 'discharging' ? 'Urladdar' : 'Vilar');
    this._set('c-batt-chip', stateLabel);
    this._set('c-batt-sub', (battPower === null ? '\u2013' : (battPower/1000).toFixed(2) + ' kW') + ' \u00b7 ' + stateLabel.toLowerCase());
    this._setStyle('c-batt-meter', 'width', (soc === null ? 0 : soc) + '%');
    this._set('c-batt-volt', this._fmt(this._num('battery_voltage', 1), 1, ' V'));
    this._set('c-batt-temp', this._fmt(this._num('battery_temp', 1), 1, ' \u00b0C'));

    // Fronius
    const froPower = this._num('fronius_power', 0);
    const froLifetime = this._num('fronius_lifetime', 0);
    this._set('c-fro-power', froPower === null ? '\u2013' : Math.round(froPower));
    this.shadowRoot.getElementById('c-fro-power').innerHTML = (froPower === null ? '\u2013' : Math.round(froPower)) + '<small>W nu</small>';
    this._set('c-fro-chip', (froPower && froPower > 20) ? 'Producerar' : 'Ingen produktion');
    this._set('c-fro-sub', froLifetime === null ? '\u2013' : ('Totalt ' + Math.round(froLifetime).toLocaleString('sv-SE') + ' kWh sedan start'));
    this._set('c-fro-lifetime', froLifetime === null ? '\u2013' : Math.round(froLifetime).toLocaleString('sv-SE') + ' kWh');

    // Zaptec
    const zapConn = this._val('zaptec_connection');
    const zapPlug = this._val('zaptec_plug');
    const zapCharging = this._val('zaptec_charging');
    const zapMaxA = this._val('zaptec_max_current');
    this._set('c-zap-chip', zapCharging === 'on' ? 'Laddar' : (zapPlug === 'on' ? 'Ansluten' : 'Fr\u00e5nkopplad'));
    this._set('c-zap-sub', zapCharging === 'on' ? 'Bilen laddar just nu' : (zapPlug === 'on' ? 'Ansluten, laddar inte' : 'Ingen bil ansluten just nu'));
    this._set('c-zap-plug', zapPlug === 'on' ? 'Ansluten' : 'Ej ansluten');
    this._set('c-zap-charging', zapCharging === 'on' ? 'P\u00e5' : 'Av');
    this._set('c-zap-maxcurrent', zapMaxA === null ? '\u2013' : zapMaxA + ' A');

    // Weather
    const wxTemp = this._num('weather_temp', 1);
    const wxFeels = this._num('weather_feels', 1);
    const wxHum = this._num('weather_humidity', 0);
    const wxDew = this._num('weather_dewpoint', 1);
    const wxWetbulb = this._num('weather_wetbulb', 1);
    this.shadowRoot.getElementById('c-wx-temp').innerHTML = (wxTemp === null ? '\u2013' : wxTemp) + '<small>\u00b0C</small>';
    this._set('c-wx-sub', 'K\u00e4nns som ' + this._fmt(wxFeels,1,'\u00b0C') + ' \u00b7 luftfuktighet ' + this._fmt(wxHum,0,'%'));
    this._set('c-wx-dew', this._fmt(wxDew,1,'\u00b0C'));
    this._set('c-wx-wetbulb', this._fmt(wxWetbulb,1,'\u00b0C'));
    this._set('c-wx-rain', this._fmt(this._num('weather_rain_today',1),1,' mm'));
    this._set('c-wx-uv', this._fmt(this._num('weather_uv',1),1,''));
    const coopTemp = this._num('coop_temp', 1);
    const coopHum = this._num('coop_humidity', 0);
    this._set('c-coop', (coopTemp===null?'\u2013':coopTemp+'\u00b0C') + ' \u00b7 ' + (coopHum===null?'\u2013':coopHum+'%') + ' fukt');

    // Tibber
    const price = this._num('tibber_price', 3);
    const power = this._num('tibber_power', 0);
    const avgPower = this._num('tibber_avg_power', 0);
    const monthCost = this._num('tibber_month_cost', 2);
    const reward = this._num('tibber_reward', 2);
    const consumption = this._num('tibber_consumption', 2);
    const production = this._num('tibber_production', 2);
    this.shadowRoot.getElementById('c-tib-price').innerHTML = (price===null?'\u2013':price) + '<small>SEK/kWh</small>';
    this._set('c-tib-chip', (price !== null && price < 0.6) ? 'Billigt just nu' : 'Normal-/h\u00f6gpris');
    this._set('c-tib-sub', 'Effekt just nu: ' + this._fmt(power,0,' W') + ' \u00b7 snitt ' + this._fmt(avgPower,0,' W'));
    this._set('c-tib-month', this._fmt(monthCost,2,' SEK'));
    this._set('c-tib-reward', this._fmt(reward,2,' SEK'));
    this._set('c-tib-accum', this._fmt(consumption,2,'') + ' / ' + this._fmt(production,2,'') + ' kWh');

    // Shelly toggle
    const shellyState = this._st('shelly1');
    if (shellyState) {
      const on = shellyState.state === 'on';
      this._set('c-shelly-state', on ? 'P\u00e5' : 'Av');
      const toggle = this.shadowRoot.getElementById('c-shelly-toggle');
      if (toggle) toggle.className = 'toggle ' + (on ? 'on' : 'off');
      this._set('c-shelly-name', (this._config.shelly_label || 'Shelly'));
    }
    const shelly2State = this._st('shelly2');
    if (shelly2State) {
      const on2 = shelly2State.state === 'on';
      this._set('c-shelly2-state', on2 ? 'P\u00e5' : 'Av');
      const toggle2 = this.shadowRoot.getElementById('c-shelly2-toggle');
      if (toggle2) toggle2.className = 'toggle ' + (on2 ? 'on' : 'off');
      const p2 = this._num('shelly2_power', 1);
      this._set('c-shelly2-power', p2 === null ? 'shellyplug-s' : (p2 + ' W'));
    }
    const shellyCount = (this._e('shelly1') ? 1 : 0) + (this._e('shelly2') ? 1 : 0);
    this._set('c-shelly-count', shellyCount + ' ansluten' + (shellyCount === 1 ? '' : 'a') + ' enhet' + (shellyCount === 1 ? '' : 'er'));

    // ESS force charge
    const essState = this._st('ess_force');
    if (essState) {
      const on = essState.state === 'on';
      this._set('c-ess-chip', on ? 'Tvingad laddning P\u00e5' : 'Av (smart-schema aktivt)');
      this.shadowRoot.getElementById('c-ess-chip').style.background = on ? 'var(--battery-dim)' : 'var(--surface-2)';
      this.shadowRoot.getElementById('c-ess-chip').style.color = on ? 'var(--battery)' : 'var(--text-dim)';
    }

    // Footer
    this._set('f-prod', this._fmt(production,2,' kWh'));
    this._set('f-cons', this._fmt(consumption,2,' kWh'));
    this._set('f-cost', reward === null ? '\u2013' : ('+' + reward.toFixed(2) + ' SEK s\u00e5ld el'));
    this._set('f-month', this._fmt(monthCost,2,' SEK'));

    // Power flow diagram
    this._updateFlow(soc, battPower, battState, froPower);
  }

  _updateFlow(soc, battPower, battState, froPower) {
    const gridSum = ['grid_power_l1','grid_power_l2','grid_power_l3']
      .map(k => this._num(k, 0)).filter(v => v !== null)
      .reduce((a,b) => a+b, 0);
    const houseSum = ['house_power_l1','house_power_l2','house_power_l3']
      .map(k => this._num(k, 0)).filter(v => v !== null)
      .reduce((a,b) => a+b, 0);

    this._set('fv-battery', (soc===null?'\u2013':soc) + '% SoC \u00b7 ' + this._fmt(battPower/1000, 2, ' kW'));
    this._set('fv-multiplus', this._fmt(gridSum/1000, 2, ' kW genom'));
    this._set('fv-grid', this._fmt(gridSum/1000, 2, ' kW') + (gridSum >= 0 ? ' in' : ' ut'));
    this._set('fv-house', this._fmt(houseSum/1000, 2, ' kW'));
    this._set('fv-fronius', froPower === null ? '\u2013' : this._fmt(froPower/1000, 2, ' kW'));

    const zapCharging = this._val('zaptec_charging');
    const zapPlug = this._val('zaptec_plug');
    this._set('fv-ev', zapCharging === 'on' ? 'Laddar' : (zapPlug === 'on' ? 'Ansluten' : 'Ej ansluten'));

    // battery edge direction/color
    const battPath = this.shadowRoot.getElementById('fv-path-batt');
    if (battPath) {
      if (battState === 'charging') {
        battPath.setAttribute('d', 'M 335 108 C 335 96, 335 88, 335 74');
        battPath.classList.add('flow-pulse');
      } else if (battState === 'discharging') {
        battPath.setAttribute('d', 'M 335 74 C 335 88, 335 96, 335 108');
        battPath.classList.add('flow-pulse');
      } else {
        battPath.classList.remove('flow-pulse');
      }
    }
    const gridInPath = this.shadowRoot.getElementById('fv-path-gridin');
    const gridOutPath = this.shadowRoot.getElementById('fv-path-gridout');
    [gridInPath, gridOutPath].forEach(p => { if (p) p.classList.toggle('flow-pulse', Math.abs(gridSum) > 20); });

    const froPath = this.shadowRoot.getElementById('fv-path-fronius');
    if (froPath) froPath.classList.toggle('flow-pulse', froPower !== null && froPower > 20);
    if (froPath) froPath.setAttribute('stroke', (froPower !== null && froPower > 20) ? '#f0a83c' : '#3a4247');

    const evPath = this.shadowRoot.getElementById('fv-path-ev');
    if (evPath) evPath.classList.toggle('flow-pulse', zapCharging === 'on');
    if (evPath) evPath.setAttribute('stroke', zapCharging === 'on' ? '#b18cf0' : '#3a4247');

    const consumption = this._num('tibber_consumption', 2);
    const production = this._num('tibber_production', 2);
    if (consumption && production !== null && consumption > 0) {
      this._set('fv-selfsuff', Math.round((production/consumption)*100) + '%');
    }
  }

  // ---------- season + weather scene (self-contained, no hass needed) ----------
  _applySeasonAndWeather() {
    const seasonNames = { spring:'V\u00e5r', summer:'Sommar', autumn:'H\u00f6st', winter:'Vinter' };
    const seasonDesc = {
      spring:'Knoppar och blom kring huset',
      summer:'Gr\u00f6nska i full blom',
      autumn:'L\u00f6ven f\u00e4rgas och faller',
      winter:'Sn\u00f6t\u00e4ckt och tyst'
    };
    const getSeason = (date) => {
      const m = date.getMonth();
      if (m === 11 || m <= 1) return 'winter';
      if (m >= 2 && m <= 4) return 'spring';
      if (m >= 5 && m <= 7) return 'summer';
      return 'autumn';
    };
    const classifyWeatherCode = (code) => {
      if ([51,53,55,56,57,61,63,65,66,67,80,81,82,95,96,99].includes(code)) return 'rain';
      if ([71,73,75,77,85,86].includes(code)) return 'snow';
      if ([1,2,3,45,48].includes(code)) return 'cloudy';
      return 'clear';
    };
    const decideParticleType = (season, weather) => {
      if (weather === 'rain') return 'rain';
      if (weather === 'snow') return 'snow';
      if (season === 'spring') return 'petal';
      if (season === 'autumn') return 'leaf';
      return 'none';
    };
    const spawnParticles = (type) => {
      const container = this.shadowRoot.getElementById('particles');
      if (!container) return;
      container.innerHTML = '';
      const config = { petal:14, leaf:16, snow:26, rain:34, none:0 };
      const count = config[type] || 0;
      for (let i = 0; i < count; i++){
        const p = document.createElement('div');
        p.className = 'particle ' + type;
        p.style.left = (Math.random() * 100) + '%';
        p.style.setProperty('--drift', (Math.random() * 60 - 30) + 'px');
        const duration = type === 'rain' ? (0.6 + Math.random() * 0.5) : (5 + Math.random() * 6);
        p.style.animationDuration = duration + 's';
        p.style.animationDelay = (Math.random() * duration) + 's';
        container.appendChild(p);
      }
    };

    const now = new Date();
    const season = getSeason(now);
    const sceneCard = this.shadowRoot.getElementById('sceneCard');
    if (sceneCard) sceneCard.setAttribute('data-season', season);
    this._set('seasonChip', seasonNames[season]);
    this._set('sceneSub', seasonDesc[season]);

    const lat = (this._config.latitude || 59.4630143);
    const lon = (this._config.longitude || 17.8858662);
    fetch('https://api.open-meteo.com/v1/forecast?latitude=' + lat + '&longitude=' + lon + '&current=weather_code&timezone=auto')
      .then(r => r.json())
      .then(data => {
        const code = data.current && data.current.weather_code;
        const weather = classifyWeatherCode(code);
        if (sceneCard) sceneCard.setAttribute('data-weather', weather);
        const weatherText = { clear:'Klart', cloudy:'Molnigt', rain:'Regn', snow:'Sn\u00f6fall' }[weather];
        this._set('sceneSub', seasonDesc[season] + ' \u00b7 ' + weatherText + ' just nu');
        spawnParticles(decideParticleType(season, weather));
      })
      .catch(() => spawnParticles(decideParticleType(season, 'clear')));
  }

  _tickClock() {
    const now = new Date();
    const opts = { weekday:'short', day:'2-digit', month:'short' };
    const el = this.shadowRoot.getElementById('c-clock');
    if (el) {
      el.innerHTML = now.toLocaleDateString(undefined, opts) + ' &nbsp; <b>' +
        now.toLocaleTimeString(undefined, {hour:'2-digit', minute:'2-digit'}) + '</b>';
    }
  }

  // ---------- water valve (local preview — no real device yet) ----------
  _setValve(minutes) {
    const chip = this.shadowRoot.getElementById('valveChip');
    const timerEl = this.shadowRoot.getElementById('valveTimer');
    if (!chip || !timerEl) return;
    this.shadowRoot.querySelectorAll('.valve-btn').forEach(b => b.classList.remove('active'));
    const btns = this.shadowRoot.querySelectorAll('.valve-btn');
    if (minutes === 0) {
      this._valveOffAt = null;
      chip.textContent = 'Av';
      chip.style.background = 'var(--surface-2)';
      chip.style.color = 'var(--text-dim)';
      timerEl.textContent = 'Ventilen \u00e4r avst\u00e4ngd';
      if (btns[0]) btns[0].classList.add('active');
    } else {
      this._valveOffAt = Date.now() + minutes * 60000;
      chip.textContent = 'P\u00e5';
      chip.style.background = 'var(--grid-dim)';
      chip.style.color = 'var(--grid)';
      btns.forEach(b => { if (b.dataset.minutes == minutes) b.classList.add('active'); });
      this._updateValveTimer();
    }
  }
  _updateValveTimer() {
    const timerEl = this.shadowRoot.getElementById('valveTimer');
    if (!timerEl || !this._valveOffAt) return;
    const remaining = Math.max(0, this._valveOffAt - Date.now());
    if (remaining <= 0) { this._setValve(0); return; }
    const mins = Math.floor(remaining / 60000);
    const secs = Math.floor((remaining % 60000) / 1000);
    timerEl.textContent = 'St\u00e4nger av om ' + mins + ' min ' + secs.toString().padStart(2,'0') + ' s';
  }
}

customElements.define('grankulle-energy-card', GrankulleEnergyCard);

// Register with the Lovelace card picker (optional but nice-to-have)
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'grankulle-energy-card',
  name: 'Grankullevägen 19 — Energy Card',
  description: 'Live energi-dashboard: Victron, Fronius, Zaptec, Tibber, Shelly, väder.'
});
