const TEMPLATE_HTML = '<style>\n  @import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap");\n  :host{\n    --bg:#0d1417;\n    --bg-grad: radial-gradient(1200px 600px at 15% -10%, #14232a 0%, #0d1417 55%);\n    --surface:#141c20;\n    --surface-2:#182226;\n    --border:#243136;\n    --text:#e8edee;\n    --text-dim:#8ea0a6;\n    --text-faint:#5d6c71;\n\n    --solar:#f0a83c;\n    --solar-dim:#5a4324;\n    --battery:#42b883;\n    --battery-dim:#274536;\n    --grid:#6f93b8;\n    --grid-dim:#2a3947;\n    --ev:#b18cf0;\n    --ev-dim:#3a3050;\n    --weather:#5ab4e0;\n    --weather-dim:#1f3a47;\n    --price-low:#42b883;\n    --price-mid:#f0a83c;\n    --price-high:#e2634f;\n\n    /* seasonal scene — default (summer) */\n    --sky-top:#5f9fc9;\n    --sky-bottom:#bfe0c9;\n    --celestial:#ffe9a0;\n    --celestial-glow:rgba(255,233,160,0.35);\n    --ground:#4d8f47;\n    --ground-2:#3f7a3c;\n    --foliage:#3f8f47;\n    --foliage-2:#367b3d;\n    --trunk:#5b4330;\n    --house-wall:#e7ded0;\n    --house-roof:#3a3230;\n    --window:#f5c563;\n\n    --car-red:#c23b2e;\n    --car-red-dark:#8f2a20;\n    --car-blue:#3f7fc7;\n    --car-blue-dark:#2c5c92;\n    --panel:#1c2b3d;\n    --panel-line:#3a5570;\n    --soil:#5a4227;\n    --sprout:#5fae4a;\n    --wood:#8a6640;\n    --glass:#d9edf0;\n  }\n\n  [data-season="spring"]{\n    --sky-top:#a9d8ea; --sky-bottom:#eaf3d8;\n    --celestial:#fff3c2; --celestial-glow:rgba(255,243,194,0.4);\n    --ground:#7fbf5e; --ground-2:#69a84e;\n    --foliage:#f1a9c4; --foliage-2:#e78fb0;\n    --trunk:#6b4d35;\n    --house-wall:#f0e8db; --house-roof:#463b37; --window:#ffd989;\n  }\n  [data-season="autumn"]{\n    --sky-top:#e3a860; --sky-bottom:#f3d9a8;\n    --celestial:#ffcf8a; --celestial-glow:rgba(255,207,138,0.4);\n    --ground:#a97a3c; --ground-2:#8f6531;\n    --foliage:#d9772c; --foliage-2:#c2491f;\n    --trunk:#4f3a28;\n    --house-wall:#e6ddce; --house-roof:#392f2c; --window:#ffb865;\n  }\n  [data-season="winter"]{\n    --sky-top:#3d5164; --sky-bottom:#c3d3dc;\n    --celestial:#eef4f8; --celestial-glow:rgba(238,244,248,0.3);\n    --ground:#eef3f5; --ground-2:#d9e3e7;\n    --foliage:#eef3f5; --foliage-2:#d9e3e7;\n    --trunk:#40332a;\n    --house-wall:#dfe7ea; --house-roof:#2c3438; --window:#ffcf7a;\n  }\n\n  *{box-sizing:border-box; margin:0; padding:0;}\n\n  :host{\n    display:block;\n    background:var(--bg-grad), var(--bg);\n    color:var(--text);\n    font-family:\'Inter\', sans-serif;\n    border-radius:16px;\n    overflow:hidden;\n  }\n\n  .wrap{max-width:1320px; margin:0 auto; padding:20px 20px 28px;}\n\n  /* ---------- header ---------- */\n  header{\n    display:flex; align-items:flex-end; justify-content:space-between;\n    margin-bottom:22px; flex-wrap:wrap; gap:16px;\n  }\n  .brand{display:flex; align-items:center; gap:12px;}\n  .brand-mark{\n    width:38px; height:38px; border-radius:9px;\n    background:linear-gradient(135deg, var(--solar), var(--ev));\n    display:flex; align-items:center; justify-content:center;\n    font-family:\'Space Grotesk\'; font-weight:700; color:#0d1417; font-size:16px;\n  }\n  .brand h1{font-family:\'Space Grotesk\'; font-weight:600; font-size:20px; letter-spacing:0.2px;}\n  .brand span{display:block; font-size:12px; color:var(--text-dim); margin-top:1px;}\n  .clock{\n    font-family:\'JetBrains Mono\'; font-size:13px; color:var(--text-dim);\n    text-align:right;\n  }\n  .clock b{color:var(--text); font-weight:500;}\n\n  /* ---------- hero flow ---------- */\n  .hero{\n    background:var(--surface);\n    border:1px solid var(--border);\n    border-radius:16px;\n    padding:22px 26px 10px;\n    margin-bottom:20px;\n    position:relative;\n    overflow:hidden;\n  }\n  .hero-top{\n    display:flex; justify-content:space-between; align-items:flex-start;\n    margin-bottom:6px; flex-wrap:wrap; gap:10px;\n  }\n  .hero-title{font-family:\'Space Grotesk\'; font-size:15px; font-weight:600; color:var(--text);}\n  .hero-sub{font-size:12px; color:var(--text-dim); margin-top:2px;}\n  .hero-stat{text-align:right;}\n  .hero-stat .num{font-family:\'JetBrains Mono\'; font-size:26px; font-weight:600; color:var(--battery);}\n  .hero-stat .lbl{font-size:11px; color:var(--text-dim); text-transform:uppercase; letter-spacing:0.06em;}\n\n  svg.flow{width:100%; height:auto; display:block;}\n  .flow-scroll{overflow-x:auto; -webkit-overflow-scrolling:touch;}\n  @media (max-width:700px){\n    .flow-scroll{margin:0 -22px; padding:0 22px;}\n    svg.flow{width:820px; min-width:820px;}\n  }\n  .flow-legend{\n    display:flex; align-items:center; gap:18px; flex-wrap:wrap;\n    padding:10px 22px 0; font-size:11px; color:var(--text-dim);\n  }\n  .flow-legend span{display:flex; align-items:center; gap:6px;}\n  .flow-legend i{width:14px; height:14px; border-radius:50%; display:inline-block;}\n  .flow-legend{font-size:13px;}\n  .flow-legend span{gap:8px;}\n  .flow-legend-note{margin-left:auto; color:var(--text-faint); font-style:italic;}\n  .flow-line{fill:none; stroke-linecap:round;}\n  .flow-dot{opacity:0; transition:opacity 0.4s ease;}\n  .flow-dot.active{opacity:1;}\n  .hose-drops{opacity:0; transition:opacity 0.3s ease;}\n  .hose-drops.active{opacity:1;}\n  .hose-drops.active circle{animation:hoseSpray 0.8s ease-out infinite;}\n  .hose-drops.active circle:nth-child(2){animation-delay:0s;}\n  .hose-drops.active circle:nth-child(3){animation-delay:0.09s;}\n  .hose-drops.active circle:nth-child(4){animation-delay:0.18s;}\n  .hose-drops.active circle:nth-child(5){animation-delay:0.27s;}\n  .hose-drops.active circle:nth-child(6){animation-delay:0.05s;}\n  .hose-drops.active circle:nth-child(7){animation-delay:0.14s;}\n  .hose-drops.active circle:nth-child(8){animation-delay:0.22s;}\n  @keyframes hoseSpray{0%{transform:translate(0,0) scale(1); opacity:1;} 100%{transform:translate(-16px,12px) scale(0.5); opacity:0;}}\n  #hose-group:hover path{stroke:#4a86ab;}\n  #hose-button:hover circle:nth-child(2){stroke:var(--grid);}\n  #hose-button-ring{transition:opacity 0.3s ease;}\n  #hose-button.active #hose-button-ring{opacity:1;}\n  #hose-button.active #hose-button-icon{fill:var(--grid);}\n  #hose-button.active circle:nth-child(2){fill:var(--grid-dim);}\n  .flow-dash{stroke-dasharray:2 10; animation:flowmove 1.1s linear infinite;}\n  @keyframes flowmove{to{stroke-dashoffset:-24;}}\n  .flow-pulse{stroke-dasharray:6 20; animation:flowmovebig 1.4s linear infinite; filter:drop-shadow(0 0 3px currentColor);}\n  @keyframes flowmovebig{to{stroke-dashoffset:-52;}}\n  .node-box{fill:var(--surface-2); stroke:var(--border); stroke-width:1;}\n  .node-label{font-family:\'Space Grotesk\'; font-size:12px; font-weight:600; fill:var(--text);}\n  .node-value{font-family:\'JetBrains Mono\'; font-size:13px; font-weight:600;}\n  .edge-badge{font-family:\'JetBrains Mono\'; font-size:11px; font-weight:500;}\n  .edge-pill{fill:var(--surface); stroke:var(--border); stroke-width:1;}\n\n  /* ---------- grid ---------- */\n  .grid{\n    display:grid;\n    grid-template-columns:repeat(4, 1fr);\n    gap:18px;\n    margin-bottom:18px;\n  }\n  @media (max-width:1080px){ .grid{grid-template-columns:repeat(2, 1fr);} }\n  @media (max-width:620px){ .grid{grid-template-columns:1fr;} }\n\n  .card{\n    background:var(--surface);\n    border:1px solid var(--border);\n    border-radius:14px;\n    padding:18px 18px 16px;\n    display:flex; flex-direction:column;\n  }\n  .card-head{display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;}\n  .card-title{display:flex; align-items:center; gap:8px;}\n  .dot{width:8px; height:8px; border-radius:50%;}\n  .card-title h3{font-family:\'Space Grotesk\'; font-size:13px; font-weight:600;}\n  .source-tag{font-size:10px; color:var(--text-faint); text-transform:uppercase; letter-spacing:0.07em;}\n  .status-chip{\n    font-size:10px; padding:3px 8px; border-radius:20px; font-weight:600;\n    text-transform:uppercase; letter-spacing:0.04em;\n  }\n\n  .big-num{font-family:\'JetBrains Mono\'; font-size:30px; font-weight:600; line-height:1;}\n  .big-num small{font-size:14px; color:var(--text-dim); font-weight:500; margin-left:4px;}\n  .sub-line{font-size:12px; color:var(--text-dim); margin-top:6px;}\n\n  .meter{\n    width:100%; height:8px; border-radius:5px; background:var(--surface-2);\n    overflow:hidden; margin-top:14px; border:1px solid var(--border);\n  }\n  .meter-fill{height:100%; border-radius:5px;}\n\n  .stat-row{display:flex; justify-content:space-between; margin-top:12px; font-size:12px;}\n  .stat-row .k{color:var(--text-dim);}\n  .stat-row .v{font-family:\'JetBrains Mono\'; font-weight:500;}\n\n  /* Fronius mini chart */\n  .spark{width:100%; height:52px; margin-top:14px;}\n\n  /* Tibber wide card */\n  .wide-card{grid-column:span 2;}\n  @media (max-width:1080px){ .wide-card{grid-column:span 2;} }\n  @media (max-width:620px){ .wide-card{grid-column:span 1;} }\n\n  .price-bars{\n    display:flex; align-items:flex-end; gap:3px; height:74px; margin-top:16px;\n  }\n  .pbar{flex:1; border-radius:3px 3px 0 0; position:relative; min-width:2px;}\n  .pbar.now::after{\n    content:\'\'; position:absolute; left:50%; top:-8px; transform:translateX(-50%);\n    width:5px; height:5px; border-radius:50%; background:var(--text);\n  }\n  .price-legend{display:flex; justify-content:space-between; font-size:10px; color:var(--text-faint); margin-top:6px; font-family:\'JetBrains Mono\';}\n\n  /* Shelly row */\n  .devices-card{grid-column:span 2;}\n  @media (max-width:1080px){ .devices-card{grid-column:span 2;} }\n  @media (max-width:620px){ .devices-card{grid-column:span 1;} }\n  .device-list{display:flex; flex-direction:column; gap:10px; margin-top:4px;}\n  .device{\n    display:flex; align-items:center; justify-content:space-between;\n    padding:10px 12px; background:var(--surface-2); border:1px solid var(--border);\n    border-radius:10px;\n  }\n  .device-left{display:flex; align-items:center; gap:10px;}\n  .device-icon{\n    width:30px; height:30px; border-radius:8px; display:flex; align-items:center; justify-content:center;\n    background:rgba(240,168,60,0.12); font-size:14px;\n  }\n  .device-name{font-size:13px; font-weight:500;}\n  .device-room{font-size:11px; color:var(--text-faint);}\n  .device-right{display:flex; align-items:center; gap:12px;}\n  .device-power{font-family:\'JetBrains Mono\'; font-size:12px; color:var(--text-dim);}\n  .toggle{\n    width:56px; height:32px; border-radius:32px; position:relative; cursor:pointer; transition:background 0.2s;\n    border:none; flex-shrink:0;\n  }\n  .toggle::after{\n    content:\'\'; position:absolute; top:3px; left:3px; width:26px; height:26px; border-radius:50%;\n    background:#0d1417; transition:transform 0.2s; box-shadow:0 1px 3px rgba(0,0,0,0.3);\n  }\n  .toggle.on{background:var(--battery);}\n  .toggle.on::after{transform:translateX(24px); background:#fff;}\n  .toggle.off{background:var(--surface); border:1px solid var(--border);}\n  .toggle.off::after{background:var(--text-faint);}\n\n  /* footer summary */\n  .footer{\n    display:grid; grid-template-columns:repeat(4,1fr); gap:18px; margin-top:8px;\n  }\n  @media (max-width:780px){ .footer{grid-template-columns:repeat(2,1fr);} }\n  .foot-item{\n    background:var(--surface); border:1px solid var(--border); border-radius:12px;\n    padding:14px 16px;\n  }\n  .foot-item .lbl{font-size:11px; color:var(--text-dim); text-transform:uppercase; letter-spacing:0.05em;}\n  .foot-item .val{font-family:\'JetBrains Mono\'; font-size:18px; font-weight:600; margin-top:4px;}\n\n  .footnote{\n    text-align:center; font-size:11px; color:var(--text-faint); margin-top:26px;\n  }\n\n  .valve-buttons{\n    display:flex; gap:10px; margin-top:16px; flex-wrap:wrap;\n  }\n  .valve-btn{\n    flex:1; min-width:110px; padding:12px 14px; border-radius:10px;\n    background:var(--surface-2); border:1px solid var(--border); color:var(--text);\n    font-family:\'Space Grotesk\'; font-size:13px; font-weight:600; cursor:pointer;\n    transition:background 0.15s, border-color 0.15s;\n  }\n  .valve-btn:hover{border-color:var(--grid);}\n  .valve-btn.active{background:var(--grid-dim); border-color:var(--grid); color:var(--grid);}\n  .valve-btn.off-btn.active{background:var(--surface-2); border-color:var(--border); color:var(--text-dim);}\n  .temp-stepper{display:flex; align-items:center; gap:14px; margin-top:16px;}\n  .temp-step-btn{\n    width:52px; height:52px; border-radius:50%; font-size:26px; font-weight:700; line-height:1;\n    background:var(--surface-2); border:2px solid var(--border); color:var(--text); cursor:pointer;\n    display:flex; align-items:center; justify-content:center; transition:background 0.15s, border-color 0.15s, transform 0.1s;\n    font-family:\'Space Grotesk\';\n  }\n  .temp-step-btn:hover{border-color:var(--grid); color:var(--grid);}\n  .temp-step-btn:active{transform:scale(0.92); background:var(--grid-dim);}\n  .temp-step-display{\n    flex:1; text-align:center; font-family:\'Space Grotesk\'; font-size:12px; color:var(--text-dim);\n    text-transform:uppercase; letter-spacing:0.06em; line-height:1.3;\n  }\n  .temp-step-display span{font-family:\'JetBrains Mono\'; font-size:24px; font-weight:700; color:var(--text); text-transform:none; letter-spacing:0;}\n\n  /* ---------- seasonal scene ---------- */\n  .scene-card{\n    background:var(--surface);\n    border:1px solid var(--border);\n    border-radius:16px;\n    padding:0;\n    margin-bottom:20px;\n    overflow:hidden;\n    position:relative;\n  }\n  .scene-head{\n    display:flex; justify-content:space-between; align-items:center;\n    padding:16px 22px 0;\n  }\n  .scene-title{font-family:\'Space Grotesk\'; font-size:15px; font-weight:600;}\n  .scene-sub{font-size:12px; color:var(--text-dim); margin-top:2px;}\n  .season-chip{\n    font-size:11px; padding:4px 11px; border-radius:20px; font-weight:600;\n    text-transform:uppercase; letter-spacing:0.05em;\n    background:var(--surface-2); border:1px solid var(--border); color:var(--text);\n  }\n  .scene-frame{\n    position:relative; width:100%; margin-top:12px; line-height:0;\n  }\n  svg.scene{width:100%; height:auto; display:block; transition:filter 0.6s ease;}\n  .sky{transition:fill 0.6s ease;}\n  .foliage-group{transition:opacity 0.5s ease;}\n  .branch-group{transition:opacity 0.5s ease;}\n  [data-season="winter"] .foliage-group{opacity:0;}\n  [data-season="winter"] .branch-group{opacity:1;}\n  .branch-group{opacity:0;}\n  .snow-cap{transition:opacity 0.5s ease; opacity:0;}\n  [data-season="winter"] .snow-cap{opacity:1;}\n  .smoke{opacity:0.55; animation:smokeDrift 6s ease-in-out infinite;}\n  @keyframes smokeDrift{\n    0%{transform:translate(0,0); opacity:0.5;}\n    50%{transform:translate(4px,-14px); opacity:0.25;}\n    100%{transform:translate(-2px,-28px); opacity:0;}\n  }\n\n  .particles{\n    position:absolute; inset:0; overflow:hidden; pointer-events:none;\n  }\n  .particle{\n    position:absolute; top:-5%; border-radius:50%; opacity:0.9;\n    animation-name:fall; animation-timing-function:linear; animation-iteration-count:infinite;\n  }\n  .particle.petal{width:8px; height:6px; background:var(--foliage); border-radius:60% 40% 60% 40%;}\n  .particle.leaf{width:9px; height:9px; background:var(--foliage); border-radius:0 60% 0 60%;}\n  .particle.snow{width:5px; height:5px; background:#fff; border-radius:50%;}\n  .particle.rain{width:2px; height:15px; background:linear-gradient(to bottom, transparent, #bcd9ea); border-radius:2px; animation-name:fallRain;}\n  @keyframes fallRain{\n    0%{transform:translateY(0); opacity:0.9;}\n    100%{transform:translateY(230px); opacity:0.2;}\n  }\n  .cloud-overlay{fill:#1c2933; opacity:0; transition:opacity 0.8s ease;}\n  [data-weather="cloudy"] .cloud-overlay{opacity:0.28;}\n  [data-weather="rain"] .cloud-overlay{opacity:0.4;}\n  [data-weather="rain"] .sun-glow, [data-weather="cloudy"] .sun-glow{opacity:0.15;}\n  [data-weather="rain"] .sun-body, [data-weather="cloudy"] .sun-body{opacity:0.45;}\n  .sun-glow, .sun-body{transition:opacity 0.6s ease;}\n  @keyframes fall{\n    0%{transform:translateY(0) translateX(0) rotate(0deg); opacity:0.9;}\n    100%{transform:translateY(230px) translateX(var(--drift, 20px)) rotate(200deg); opacity:0.15;}\n  }\n\n</style>\n<div class="wrap">\n\n  <header>\n    <div class="brand">\n      <div class="brand-mark">G</div>\n      <div>\n        <h1>Grankullevägen 19</h1>\n        <span>Home energy overview</span>\n      </div>\n    </div>\n    <div class="clock" id="c-clock">–</div>\n  </header>\n\n  <!-- SEASONAL SCENE -->\n  <div class="scene-card" id="sceneCard" data-season="summer">\n    <div class="scene-head">\n      <div>\n        <div class="scene-title">Grankullevägen 19</div>\n        <div class="scene-sub" id="sceneSub">Loading season…</div>\n      </div>\n      <span class="season-chip" id="seasonChip">—</span>\n    </div>\n    <div class="scene-frame">\n      <svg class="scene" viewBox="0 0 1180 230" xmlns="http://www.w3.org/2000/svg">\n        <defs>\n          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">\n            <stop offset="0%" style="stop-color:var(--sky-top)"/>\n            <stop offset="100%" style="stop-color:var(--sky-bottom)"/>\n          </linearGradient>\n        </defs>\n\n        <!-- sky -->\n        <rect class="sky" x="0" y="0" width="1180" height="230" fill="url(#skyGrad)"/>\n\n        <!-- sun / moon -->\n        <circle class="sun-glow" cx="990" cy="52" r="52" fill="var(--celestial-glow)"/>\n        <circle class="sun-body" cx="990" cy="52" r="30" fill="var(--celestial)"/>\n        <rect class="cloud-overlay" x="0" y="0" width="1180" height="230"/>\n\n        <!-- live temp badge -->\n        <g transform="translate(60,32)" style="cursor:default;">\n          <rect x="-6" y="-16" width="90" height="30" rx="14" fill="var(--surface)" opacity="0.85" stroke="var(--border)"/>\n          <text id="scene-temp" x="14" y="4" font-family="JetBrains Mono" font-size="15" font-weight="600" fill="var(--text)">–°</text>\n          <text x="14" y="4" font-family="Space Grotesk" font-size="15" dx="34" fill="var(--text-dim)"></text>\n        </g>\n\n        <!-- distant hill -->\n        <path d="M0,175 Q300,140 620,170 T1180,160 L1180,230 L0,230 Z" fill="var(--ground-2)" opacity="0.6"/>\n\n        <!-- ground -->\n        <path d="M0,190 Q300,168 620,188 T1180,178 L1180,230 L0,230 Z" fill="var(--ground)"/>\n\n        <!-- greenhouse -->\n        <g transform="translate(30,148)">\n          <polygon points="0,42 90,42 90,20 45,0 0,20" fill="var(--glass)" opacity="0.55" stroke="#ffffff" stroke-width="1.5"/>\n          <rect x="0" y="42" width="90" height="4" fill="var(--wood)"/>\n          <line x1="45" y1="0" x2="45" y2="42" stroke="#ffffff" stroke-width="1" opacity="0.6"/>\n          <line x1="22" y1="11" x2="22" y2="42" stroke="#ffffff" stroke-width="1" opacity="0.5"/>\n          <line x1="68" y1="11" x2="68" y2="42" stroke="#ffffff" stroke-width="1" opacity="0.5"/>\n          <path d="M14,42 L14,26 L24,20 L24,42 Z" fill="var(--sprout)" opacity="0.8"/>\n          <path d="M58,42 L58,24 L70,18 L70,42 Z" fill="var(--foliage)" opacity="0.8"/>\n          <g class="snow-cap"><ellipse cx="45" cy="8" rx="30" ry="5" fill="#fff" opacity="0.85"/></g>\n        </g>\n\n        <!-- garden beds -->\n        <g transform="translate(140,178)">\n          <g>\n            <rect x="0" y="0" width="34" height="14" rx="2" fill="var(--soil)"/>\n            <path d="M4,0 L4,-7 M11,0 L11,-9 M18,0 L18,-7 M25,0 L25,-9 M31,0 L31,-7" stroke="var(--sprout)" stroke-width="2" stroke-linecap="round"/>\n          </g>\n          <g transform="translate(42,4)">\n            <rect x="0" y="0" width="34" height="14" rx="2" fill="var(--soil)"/>\n            <path d="M4,0 L4,-7 M11,0 L11,-9 M18,0 L18,-7 M25,0 L25,-9 M31,0 L31,-7" stroke="var(--foliage)" stroke-width="2" stroke-linecap="round"/>\n          </g>\n          <g transform="translate(84,9)">\n            <rect x="0" y="0" width="34" height="14" rx="2" fill="var(--soil)"/>\n            <path d="M4,0 L4,-7 M11,0 L11,-9 M18,0 L18,-7 M25,0 L25,-9 M31,0 L31,-7" stroke="var(--sprout)" stroke-width="2" stroke-linecap="round"/>\n          </g>\n        </g>\n\n        <!-- vattenslang (Shelly Plus 2PM) — rak konsekvent riktning, spigot till munstycke -->\n        <g id="hose-group" style="cursor:pointer;" data-action="toggle-hose">\n          <circle cx="585" cy="178" r="7" fill="var(--wood)"/>\n          <rect x="581" y="171" width="8" height="6" fill="#7a8a90"/>\n          <path d="M585,178 C545,184 500,190 460,196" stroke="#3a6b8f" stroke-width="5" fill="none" stroke-linecap="round"/>\n          <!-- spraymunstycke, vinklat efter slangens riktning -->\n          <g transform="translate(460,196) rotate(172)">\n            <rect x="-6" y="-7" width="20" height="14" rx="4" fill="#2c4a5e"/>\n            <path d="M13,-4 L26,-6 L26,6 L13,4 Z" fill="#1c2b36"/>\n          </g>\n          <g id="hose-drops" class="hose-drops">\n            <path d="M420,192 L378,176 L384,196 Z" fill="#a8dcf5" opacity="0.22"/>\n            <circle cx="418" cy="190" r="3.4" fill="#c5ecff"/>\n            <circle cx="406" cy="184" r="3" fill="#a8dcf5"/>\n            <circle cx="398" cy="194" r="3.2" fill="#c5ecff"/>\n            <circle cx="410" cy="202" r="2.8" fill="#a8dcf5"/>\n            <circle cx="390" cy="180" r="2.6" fill="#c5ecff"/>\n            <circle cx="424" cy="200" r="2.6" fill="#a8dcf5"/>\n            <circle cx="382" cy="192" r="2.4" fill="#c5ecff"/>\n          </g>\n        </g>\n\n        <!-- tydlig tryckknapp för slangen — vid spigoten -->\n        <g id="hose-button" style="cursor:pointer;" data-action="toggle-hose" transform="translate(540,158)">\n          <circle id="hose-button-ring" r="21" fill="none" stroke="var(--grid)" stroke-width="3" opacity="0"/>\n          <circle r="17" fill="var(--surface-2)" stroke="var(--border)" stroke-width="1.5"/>\n          <path d="M0,-8 C5,-3 5,5 0,8 C-5,5 -5,-3 0,-8 Z" id="hose-button-icon" fill="var(--text-dim)"/>\n        </g>\n\n        <!-- chicken coop -->\n        <g transform="translate(255,142)">\n          <rect x="10" y="16" width="4" height="18" fill="var(--wood)"/>\n          <rect x="46" y="16" width="4" height="18" fill="var(--wood)"/>\n          <rect x="4" y="0" width="52" height="18" rx="2" fill="var(--wood)"/>\n          <polygon points="0,0 60,0 30,-16" fill="var(--house-roof)"/>\n          <rect x="22" y="6" width="10" height="10" fill="#2c3438"/>\n          <path d="M4,18 L-10,32" stroke="var(--wood)" stroke-width="4" stroke-linecap="round"/>\n          <g class="snow-cap"><ellipse cx="30" cy="-10" rx="28" ry="5" fill="#fff" opacity="0.85"/></g>\n          <!-- fenced run -->\n          <g transform="translate(30,-26)">\n            <rect x="-20" y="-14" width="40" height="18" rx="9" fill="var(--surface)" opacity="0.85" stroke="var(--border)"/>\n            <text id="scene-coop-temp" x="0" y="-1" text-anchor="middle" font-family="JetBrains Mono" font-size="11" font-weight="600" fill="var(--weather)">–°</text>\n          </g>\n          <path d="M60,34 L60,10 M68,34 L68,8 M76,34 L76,10 M84,34 L84,8 M92,34 L92,10" stroke="var(--wood)" stroke-width="2" opacity="0.7"/>\n          <g transform="translate(66,26)">\n            <ellipse cx="0" cy="0" rx="9" ry="6" fill="#e8ded0"/>\n            <circle cx="7" cy="-4" r="4" fill="#e8ded0"/>\n            <polygon points="10,-6 14,-5 10,-3" fill="#c23b2e"/>\n          </g>\n          <g transform="translate(84,28)">\n            <ellipse cx="0" cy="0" rx="8" ry="5.5" fill="#c9a876"/>\n            <circle cx="6" cy="-4" r="3.5" fill="#c9a876"/>\n            <polygon points="9,-5 12,-4 9,-3" fill="#c23b2e"/>\n          </g>\n        </g>\n\n        <!-- tree left -->\n        <g transform="translate(395,0)">\n          <rect x="-6" y="118" width="12" height="60" fill="var(--trunk)" rx="3"/>\n          <g class="branch-group">\n            <path d="M0,150 L-30,120 M0,140 L28,110 M0,130 L-22,95 M0,120 L18,90" stroke="var(--trunk)" stroke-width="4" stroke-linecap="round" fill="none"/>\n          </g>\n          <g class="foliage-group">\n            <circle cx="-18" cy="110" r="26" fill="var(--foliage)"/>\n            <circle cx="16" cy="100" r="30" fill="var(--foliage-2)"/>\n            <circle cx="2" cy="80" r="26" fill="var(--foliage)"/>\n          </g>\n          <g class="snow-cap">\n            <ellipse cx="-18" cy="98" rx="15" ry="7" fill="#fff" opacity="0.85"/>\n            <ellipse cx="16" cy="86" rx="16" ry="7" fill="#fff" opacity="0.85"/>\n            <ellipse cx="2" cy="68" rx="14" ry="6" fill="#fff" opacity="0.85"/>\n          </g>\n        </g>\n\n        <!-- house with rooftop solar -->\n        <g transform="translate(560,60)">\n          <polygon points="-10,60 110,60 130,15 -30,15" fill="var(--house-roof)"/>\n          <g transform="translate(-14,20) rotate(-16)">\n            <rect x="0" y="0" width="70" height="30" fill="var(--panel)" rx="1"/>\n            <path d="M0,7.5 L70,7.5 M0,15 L70,15 M0,22.5 L70,22.5 M17.5,0 L17.5,30 M35,0 L35,30 M52.5,0 L52.5,30"\n                  stroke="var(--panel-line)" stroke-width="1"/>\n            <path d="M4,4 L20,4" stroke="#7fa8c9" stroke-width="1.5" opacity="0.5"/>\n          </g>\n          <rect x="0" y="60" width="90" height="80" fill="var(--house-wall)"/>\n          <rect x="14" y="82" width="24" height="24" fill="var(--window)" opacity="0.95"/>\n          <rect x="52" y="82" width="24" height="24" fill="var(--window)" opacity="0.95"/>\n          <rect x="38" y="112" width="20" height="28" fill="var(--trunk)"/>\n          <rect x="78" y="0" width="10" height="26" fill="var(--house-roof)"/>\n          <ellipse class="smoke" cx="83" cy="-6" rx="6" ry="8" fill="#cfd9dd"/>\n        </g>\n\n        <!-- driveway: red Volvo V60 -->\n        <g transform="translate(715,158)">\n          <ellipse cx="16" cy="34" rx="46" ry="5" fill="#000" opacity="0.15"/>\n          <path d="M0,30 L2,16 Q6,6 20,6 L34,6 Q46,6 50,14 L64,16 Q70,18 70,26 L70,30 Z" fill="var(--car-red)"/>\n          <path d="M20,8 L34,8 Q42,8 45,14 L21,14 Z" fill="#2a2f33" opacity="0.85"/>\n          <rect x="0" y="26" width="70" height="6" fill="var(--car-red-dark)"/>\n          <circle cx="16" cy="32" r="8" fill="#20262a"/>\n          <circle cx="16" cy="32" r="3.2" fill="#8a949a"/>\n          <circle cx="56" cy="32" r="8" fill="#20262a"/>\n          <circle cx="56" cy="32" r="3.2" fill="#8a949a"/>\n          <circle cx="70" cy="24" r="3" fill="var(--ev)"/>\n        </g>\n\n        <!-- charging station + blue Nissan Leaf -->\n        <g transform="translate(845,120)">\n          <rect x="0" y="20" width="8" height="48" rx="2" fill="#3a4247"/>\n          <rect x="-3" y="10" width="14" height="18" rx="3" fill="#232b2f"/>\n          <circle cx="4" cy="18" r="2" fill="var(--ev)"/>\n          <path class="flow-line" id="scene-charge-cable" d="M4,28 C-20,50 -45,60 -60,64" stroke="var(--ev)" stroke-width="2"/>\n\n          <g transform="translate(60,38)">\n            <ellipse cx="14" cy="32" rx="42" ry="5" fill="#000" opacity="0.15"/>\n            <path d="M0,26 L3,14 Q7,5 20,5 L30,5 Q40,5 44,13 L58,15 Q64,17 64,24 L64,26 Z" fill="var(--car-blue)"/>\n            <path d="M20,7 L30,7 Q37,7 40,13 L21,13 Z" fill="#1c232a" opacity="0.85"/>\n            <rect x="0" y="22" width="64" height="6" fill="var(--car-blue-dark)"/>\n            <circle cx="14" cy="28" r="7.5" fill="#20262a"/>\n            <circle cx="14" cy="28" r="3" fill="#8a949a"/>\n            <circle cx="50" cy="28" r="7.5" fill="#20262a"/>\n            <circle cx="50" cy="28" r="3" fill="#8a949a"/>\n          </g>\n        </g>\n\n        <!-- tree right -->\n        <g transform="translate(1040,10)">\n          <rect x="-5" y="128" width="10" height="52" fill="var(--trunk)" rx="3"/>\n          <g class="branch-group">\n            <path d="M0,155 L-24,130 M0,145 L22,122 M0,135 L-16,105" stroke="var(--trunk)" stroke-width="3.5" stroke-linecap="round" fill="none"/>\n          </g>\n          <g class="foliage-group">\n            <circle cx="-14" cy="118" r="22" fill="var(--foliage-2)"/>\n            <circle cx="12" cy="112" r="24" fill="var(--foliage)"/>\n          </g>\n          <g class="snow-cap">\n            <ellipse cx="-14" cy="106" rx="12" ry="6" fill="#fff" opacity="0.85"/>\n            <ellipse cx="12" cy="98" rx="13" ry="6" fill="#fff" opacity="0.85"/>\n          </g>\n        </g>\n      </svg>\n      <div class="particles" id="particles"></div>\n    </div>\n  </div>\n\n  <div class="hero">\n    <div class="hero-top">\n      <div>\n        <div class="hero-title">Live power flow</div>\n        <div class="hero-sub" id="fv-sub">Nät → MultiPlus (AC in/ut) → hus · batteri på DC-sidan</div>\n      </div>\n    </div>\n\n    <div class="flow-legend">\n      <span><i style="background:#6f93b8"></i>Nät</span>\n      <span><i style="background:#42b883"></i>Batteri</span>\n      <span><i style="background:#f0a83c"></i>Sol</span>\n      <span><i style="background:#3a4247"></i>Inaktivt just nu</span>\n      <span class="flow-legend-note">Pilriktning = åt vilket håll effekten går</span>\n    </div>\n\n    <div class="flow-scroll">\n    <svg class="flow" viewBox="0 0 1180 550" xmlns="http://www.w3.org/2000/svg">\n      <defs>\n        <marker id="arrowGrid" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">\n          <path d="M0,0 L10,5 L0,10 Z" fill="#6f93b8"/>\n        </marker>\n        <marker id="arrowBattery" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">\n          <path d="M0,0 L10,5 L0,10 Z" fill="#42b883"/>\n        </marker>\n        <marker id="arrowDim" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">\n          <path d="M0,0 L10,5 L0,10 Z" fill="#3a4247"/>\n        </marker>\n      </defs>\n\n      <!-- edges -->\n      <!-- Batteri (DC) ↔ MultiPlus, vertical spine -->\n      <path class="flow-line" id="fv-path-batt" d="M 350 120 C 350 150, 350 180, 350 210" stroke="#42b883" stroke-width="3" style="color:#42b883"/>\n      <g class="flow-dot" id="fv-dot-batt"><circle r="4" fill="#42b883"><animateMotion id="fv-motion-batt" dur="4.0s" begin="0.0s" repeatCount="indefinite" path="M 350 120 C 350 150, 350 180, 350 210"/></circle><circle r="4" fill="#42b883"><animateMotion id="fv-motion-batt2" dur="4.0s" begin="0.8s" repeatCount="indefinite" path="M 350 120 C 350 150, 350 180, 350 210"/></circle><circle r="4" fill="#42b883"><animateMotion id="fv-motion-batt3" dur="4.0s" begin="1.6s" repeatCount="indefinite" path="M 350 120 C 350 150, 350 180, 350 210"/></circle><circle r="4" fill="#42b883"><animateMotion id="fv-motion-batt4" dur="4.0s" begin="2.4s" repeatCount="indefinite" path="M 350 120 C 350 150, 350 180, 350 210"/></circle><circle r="4" fill="#42b883"><animateMotion id="fv-motion-batt5" dur="4.0s" begin="3.2s" repeatCount="indefinite" path="M 350 120 C 350 150, 350 180, 350 210"/></circle></g>\n      <!-- Nät ↔ MultiPlus, vertical spine -->\n      <path class="flow-line" id="fv-path-gridin" d="M 350 410 C 350 380, 350 350, 350 320" stroke="#6f93b8" stroke-width="4.5" style="color:#6f93b8"/>\n      <g class="flow-dot" id="fv-dot-gridin"><circle r="4.5" fill="#6f93b8"><animateMotion id="fv-motion-gridin" dur="4.0s" begin="0.0s" repeatCount="indefinite" path="M 350 410 C 350 380, 350 350, 350 320"/></circle><circle r="4.5" fill="#6f93b8"><animateMotion id="fv-motion-gridin2" dur="4.0s" begin="0.8s" repeatCount="indefinite" path="M 350 410 C 350 380, 350 350, 350 320"/></circle><circle r="4.5" fill="#6f93b8"><animateMotion id="fv-motion-gridin3" dur="4.0s" begin="1.6s" repeatCount="indefinite" path="M 350 410 C 350 380, 350 350, 350 320"/></circle><circle r="4.5" fill="#6f93b8"><animateMotion id="fv-motion-gridin4" dur="4.0s" begin="2.4s" repeatCount="indefinite" path="M 350 410 C 350 380, 350 350, 350 320"/></circle><circle r="4.5" fill="#6f93b8"><animateMotion id="fv-motion-gridin5" dur="4.0s" begin="3.2s" repeatCount="indefinite" path="M 350 410 C 350 380, 350 350, 350 320"/></circle></g>\n      <!-- MultiPlus → Hus -->\n      <path class="flow-line" id="fv-path-gridout" d="M 470 235 C 600 150, 680 90, 720 65" stroke="#6f93b8" stroke-width="4.5" style="color:#6f93b8"/>\n      <g class="flow-dot" id="fv-dot-gridout"><circle r="4.5" fill="#6f93b8"><animateMotion id="fv-motion-gridout" dur="4.0s" begin="0.0s" repeatCount="indefinite" path="M 470 235 C 600 150, 680 90, 720 65"/></circle><circle r="4.5" fill="#6f93b8"><animateMotion id="fv-motion-gridout2" dur="4.0s" begin="0.8s" repeatCount="indefinite" path="M 470 235 C 600 150, 680 90, 720 65"/></circle><circle r="4.5" fill="#6f93b8"><animateMotion id="fv-motion-gridout3" dur="4.0s" begin="1.6s" repeatCount="indefinite" path="M 470 235 C 600 150, 680 90, 720 65"/></circle><circle r="4.5" fill="#6f93b8"><animateMotion id="fv-motion-gridout4" dur="4.0s" begin="2.4s" repeatCount="indefinite" path="M 470 235 C 600 150, 680 90, 720 65"/></circle><circle r="4.5" fill="#6f93b8"><animateMotion id="fv-motion-gridout5" dur="4.0s" begin="3.2s" repeatCount="indefinite" path="M 470 235 C 600 150, 680 90, 720 65"/></circle></g>\n      <!-- Fronius → MultiPlus (direct AC-coupled connection) -->\n      <path class="flow-line" id="fv-path-fronius" d="M 720 465 C 650 380, 580 320, 470 295" stroke="#3a4247" stroke-width="2"/>\n      <g class="flow-dot" id="fv-dot-fronius"><circle r="4" fill="#f0a83c"><animateMotion id="fv-motion-fronius" dur="4.0s" begin="0.0s" repeatCount="indefinite" path="M 720 465 C 650 380, 580 320, 470 295"/></circle><circle r="4" fill="#f0a83c"><animateMotion id="fv-motion-fronius2" dur="4.0s" begin="0.8s" repeatCount="indefinite" path="M 720 465 C 650 380, 580 320, 470 295"/></circle><circle r="4" fill="#f0a83c"><animateMotion id="fv-motion-fronius3" dur="4.0s" begin="1.6s" repeatCount="indefinite" path="M 720 465 C 650 380, 580 320, 470 295"/></circle><circle r="4" fill="#f0a83c"><animateMotion id="fv-motion-fronius4" dur="4.0s" begin="2.4s" repeatCount="indefinite" path="M 720 465 C 650 380, 580 320, 470 295"/></circle><circle r="4" fill="#f0a83c"><animateMotion id="fv-motion-fronius5" dur="4.0s" begin="3.2s" repeatCount="indefinite" path="M 720 465 C 650 380, 580 320, 470 295"/></circle></g>\n      <!-- MultiPlus → EV-laddare (direct) -->\n      <path class="flow-line" id="fv-path-ev" d="M 470 265 C 580 265, 650 265, 720 265" stroke="#3a4247" stroke-width="2"/>\n      <g class="flow-dot" id="fv-dot-ev"><circle r="4" fill="#b18cf0"><animateMotion id="fv-motion-ev" dur="4.0s" begin="0.0s" repeatCount="indefinite" path="M 470 265 C 580 265, 650 265, 720 265"/></circle><circle r="4" fill="#b18cf0"><animateMotion id="fv-motion-ev2" dur="4.0s" begin="0.8s" repeatCount="indefinite" path="M 470 265 C 580 265, 650 265, 720 265"/></circle><circle r="4" fill="#b18cf0"><animateMotion id="fv-motion-ev3" dur="4.0s" begin="1.6s" repeatCount="indefinite" path="M 470 265 C 580 265, 650 265, 720 265"/></circle><circle r="4" fill="#b18cf0"><animateMotion id="fv-motion-ev4" dur="4.0s" begin="2.4s" repeatCount="indefinite" path="M 470 265 C 580 265, 650 265, 720 265"/></circle><circle r="4" fill="#b18cf0"><animateMotion id="fv-motion-ev5" dur="4.0s" begin="3.2s" repeatCount="indefinite" path="M 470 265 C 580 265, 650 265, 720 265"/></circle></g>\n\n      <!-- Batteri node (DC side) -->\n      <rect class="node-box" x="250" y="10" width="200" height="110" rx="10"/>\n      <text class="node-label" x="350" y="34" text-anchor="middle">Batteri (DC)</text>\n      <text class="node-value" id="fv-battery" x="350" y="58" text-anchor="middle" fill="#42b883" style="font-size:15px;">– % SoC</text>\n\n      <!-- MultiPlus node -->\n      <rect class="node-box" x="230" y="210" width="240" height="110" rx="10"/>\n      <text class="node-label" x="350" y="234" text-anchor="middle">MultiPlus-II</text>\n      <text class="node-value" x="350" y="254" text-anchor="middle" fill="#e8edee">AC in → AC ut</text>\n      <text class="node-value" id="fv-multiplus" x="350" y="272" text-anchor="middle" fill="#6f93b8" style="font-size:11px;">– kW genom</text>\n\n      <!-- Nät node -->\n      <rect class="node-box" x="280" y="410" width="140" height="110" rx="10"/>\n      <text class="node-label" x="350" y="434" text-anchor="middle">Nät</text>\n      <text class="node-value" id="fv-grid" x="350" y="455" text-anchor="middle" fill="#6f93b8">–</text>\n      <text id="fv-grid-l1" x="292" y="476" font-family="JetBrains Mono" font-size="10" fill="#8ea0a6">L1: –</text>\n      <text id="fv-grid-l2" x="292" y="490" font-family="JetBrains Mono" font-size="10" fill="#8ea0a6">L2: –</text>\n      <text id="fv-grid-l3" x="292" y="504" font-family="JetBrains Mono" font-size="10" fill="#8ea0a6">L3: –</text>\n\n      <!-- Hus node -->\n      <rect class="node-box" x="720" y="10" width="200" height="110" rx="10"/>\n      <text class="node-label" x="820" y="34" text-anchor="middle">Hus (exkl. EV)</text>\n      <text class="node-value" id="fv-house" x="820" y="58" text-anchor="middle" fill="#e8edee">–</text>\n      <text id="fv-house-l1" x="736" y="80" font-family="JetBrains Mono" font-size="10" fill="#8ea0a6">L1: –</text>\n      <text id="fv-house-l2" x="736" y="94" font-family="JetBrains Mono" font-size="10" fill="#8ea0a6">L2: –</text>\n      <text id="fv-house-l3" x="736" y="108" font-family="JetBrains Mono" font-size="10" fill="#8ea0a6">L3: –</text>\n\n      <!-- EV node -->\n      <rect class="node-box" x="720" y="210" width="200" height="110" rx="10"/>\n      <text class="node-label" x="820" y="234" text-anchor="middle">EV-laddare</text>\n      <text class="node-value" id="fv-ev" x="820" y="257" text-anchor="middle" fill="#5d6c71">–</text>\n      <text id="fv-ev-l1" x="736" y="280" font-family="JetBrains Mono" font-size="10" fill="#8ea0a6">L1: –</text>\n      <text id="fv-ev-l2" x="736" y="294" font-family="JetBrains Mono" font-size="10" fill="#8ea0a6">L2: –</text>\n      <text id="fv-ev-l3" x="736" y="308" font-family="JetBrains Mono" font-size="10" fill="#8ea0a6">L3: –</text>\n\n      <!-- Fronius node -->\n      <rect class="node-box" x="720" y="410" width="200" height="110" rx="10"/>\n      <text class="node-label" x="820" y="434" text-anchor="middle">Fronius (sol)</text>\n      <text class="node-value" id="fv-fronius" x="820" y="457" text-anchor="middle" fill="#5d6c71">–</text>\n      <text id="fv-fronius-l1" x="736" y="480" font-family="JetBrains Mono" font-size="10" fill="#8ea0a6">L1: –</text>\n      <text id="fv-fronius-l2" x="736" y="494" font-family="JetBrains Mono" font-size="10" fill="#8ea0a6">L2: –</text>\n      <text id="fv-fronius-l3" x="736" y="508" font-family="JetBrains Mono" font-size="10" fill="#8ea0a6">L3: –</text>\n    </svg>\n    </div>\n  </div>\n\n\n  <!-- WIDGET GRID -->\n  <div class="grid">\n\n    <!-- VICTRON -->\n    <div class="card">\n      <div class="card-head">\n        <div class="card-title">\n          <span class="dot" style="background:var(--battery)"></span>\n          <div>\n            <h3>Battery</h3>\n            <div class="source-tag">Victron · GX / Pylontech</div>\n          </div>\n        </div>\n        <span class="status-chip" id="c-batt-chip" style="background:var(--battery-dim); color:var(--battery)">–</span>\n      </div>\n      <div class="big-num" id="c-batt-soc">–<small>% SoC</small></div>\n      <div class="sub-line" id="c-batt-sub">–</div>\n      <div class="meter"><div class="meter-fill" id="c-batt-meter" style="width:0%; background:var(--battery)"></div></div>\n      <div class="stat-row"><span class="k">Spänning</span><span class="v" id="c-batt-volt">–</span></div>\n      <div class="stat-row"><span class="k">Celltemperatur</span><span class="v" id="c-batt-temp">–</span></div>\n      <div class="stat-row"><span class="k">Ström</span><span class="v" id="c-batt-current">–</span></div>\n    </div>\n\n    <!-- FRONIUS -->\n    <div class="card">\n      <div class="card-head">\n        <div class="card-title">\n          <span class="dot" style="background:var(--solar)"></span>\n          <div>\n            <h3>Solar</h3>\n            <div class="source-tag">Fronius Symo 12.5-3-M</div>\n          </div>\n        </div>\n        <span class="status-chip" id="c-fro-chip" style="background:var(--surface-2); color:var(--text-dim)">–</span>\n      </div>\n      <div class="big-num" id="c-fro-power">–<small>W nu</small></div>\n      <div class="sub-line" id="c-fro-sub">–</div>\n      <div class="stat-row"><span class="k">Ström (L1/L2/L3)</span><span class="v" id="c-fro-current">–</span></div>\n      \n    </div>\n\n    <!-- ZAPTEC -->\n    <div class="card">\n      <div class="card-head">\n        <div class="card-title">\n          <span class="dot" style="background:var(--ev)"></span>\n          <div>\n            <h3>EV charger</h3>\n            <div class="source-tag">Zaptec</div>\n          </div>\n        </div>\n        <span class="status-chip" id="c-zap-chip" style="background:var(--surface-2); color:var(--text-dim)">–</span>\n      </div>\n      <div class="big-num" id="c-zap-power">–<small>W</small></div>\n      <div class="sub-line" id="c-zap-sub">–</div>\n      <div class="stat-row"><span class="k">Kontakt</span><span class="v" id="c-zap-plug">–</span></div>\n      <div class="stat-row"><span class="k">Laddning</span><span class="v" id="c-zap-charging">–</span></div>\n      <div class="stat-row"><span class="k">Max laddström</span><span class="v" id="c-zap-maxcurrent">–</span></div>\n      <div class="stat-row"><span class="k">Ström (L1/L2/L3)</span><span class="v" id="c-zap-current">–</span></div>\n      <div class="valve-buttons" style="margin-top:12px;">\n        <button class="valve-btn off-btn" id="zap-charge-off" data-action="toggle-zaptec-off">Stoppa laddning</button>\n        <button class="valve-btn" id="zap-charge-on" data-action="toggle-zaptec-on">Starta laddning</button>\n      </div>\n    </div>\n\n    <!-- TEMPEST WEATHERFLOW -->\n    <div class="card">\n      <div class="card-head">\n        <div class="card-title">\n          <span class="dot" style="background:var(--weather)"></span>\n          <div>\n            <h3>Weather</h3>\n            <div class="source-tag">Tempest Taknock · Utomhus</div>\n          </div>\n        </div>\n        <span class="status-chip" id="c-wx-chip" style="background:var(--weather-dim); color:var(--weather)">–</span>\n      </div>\n      <div class="big-num" id="c-wx-temp">–<small>°C</small></div>\n      <div class="sub-line" id="c-wx-sub">–</div>\n      <div class="stat-row"><span class="k">Daggpunkt</span><span class="v" id="c-wx-dew">–</span></div>\n      <div class="stat-row"><span class="k">Regn (idag)</span><span class="v" id="c-wx-rain">–</span></div>\n      <div class="stat-row"><span class="k">UV-index</span><span class="v" id="c-wx-uv">–</span></div>\n      <div class="sub-line" id="c-wx-uv-tip" style="display:none;"></div>\n      <div class="stat-row" style="border-top:1px solid var(--border); padding-top:12px; margin-top:4px; align-items:center;">\n        <span class="k">🐔 Hönshus</span><span class="v" id="c-coop" style="font-size:20px; font-weight:700; color:var(--weather);">–</span>\n      </div>\n    </div>\n\n    <!-- TIBBER -->\n    <div class="card wide-card">\n      <div class="card-head">\n        <div class="card-title">\n          <span class="dot" style="background:var(--price-mid)"></span>\n          <div>\n            <h3>Tibber Pulse</h3>\n            <div class="source-tag">Grankullevägen</div>\n          </div>\n        </div>\n        <span class="status-chip" id="c-tib-chip" style="background:var(--battery-dim); color:var(--battery)">–</span>\n      </div>\n      <div class="big-num" id="c-tib-price">–<small>SEK/kWh</small></div>\n      <div class="sub-line" id="c-tib-sub">–</div>\n            <div class="stat-row" style="border-top:1px solid var(--border); padding-top:10px; margin-top:2px;"><span class="k" style="font-weight:600;">Intjänat (såld el)</span><span class="v"></span></div>\n      <div class="stat-row"><span class="k">Idag</span><span class="v" id="c-tib-reward-day" style="color:var(--battery)">–</span></div>\n      <div class="stat-row"><span class="k">Denna månad</span><span class="v" id="c-tib-reward-month" style="color:var(--battery)">–</span></div>\n      <div class="stat-row"><span class="k">Detta år</span><span class="v" id="c-tib-reward-year" style="color:var(--battery)">–</span></div>\n      <div class="stat-row" style="border-top:1px solid var(--border); padding-top:10px; margin-top:2px;"><span class="k" style="font-weight:600;">Kostnad</span><span class="v"></span></div>\n      <div class="stat-row"><span class="k">Idag</span><span class="v" id="c-tib-cost-day">–</span></div>\n      <div class="stat-row"><span class="k">Denna månad</span><span class="v" id="c-tib-month">–</span></div>\n      <div class="stat-row"><span class="k">Detta år</span><span class="v" id="c-tib-cost-year">–</span></div>\n    </div>\n\n  </div>\n\n  <!-- SHELLY DEVICES -->\n  <div class="grid" style="grid-template-columns:1fr;">\n    <div class="card devices-card" style="grid-column:1/-1;">\n      <div class="card-head">\n        <div class="card-title">\n          <span class="dot" style="background:var(--grid)"></span>\n          <div>\n            <h3>Smart plugs & switches</h3>\n            <div class="source-tag">Shelly</div>\n          </div>\n        </div>\n        <span class="source-tag" id="c-shelly-count">–</span>\n      </div>\n      <div class="device-list">\n        <div class="device">\n          <div class="device-left">\n            <div class="device-icon">🔌</div>\n            <div>\n              <div class="device-name" id="c-shelly-name">Shelly 1</div>\n              <div class="device-room">shelly1</div>\n            </div>\n          </div>\n          <div class="device-right">\n            <span class="device-power" id="c-shelly-state">–</span>\n            <button class="toggle" id="c-shelly-toggle" data-action="toggle-shelly" aria-label="Toggle shelly1"></button>\n          </div>\n        </div>\n        <div class="device">\n          <div class="device-left">\n            <div class="device-icon">🔌</div>\n            <div>\n              <div class="device-name">shellyplug-s</div>\n              <div class="device-room" id="c-shelly2-power">–</div>\n            </div>\n          </div>\n          <div class="device-right">\n            <span class="device-power" id="c-shelly2-state">–</span>\n            <button class="toggle" id="c-shelly2-toggle" data-action="toggle-shelly2" aria-label="Toggle shelly2"></button>\n          </div>\n        </div>\n      </div>\n      <div class="sub-line">Fler Shelly-enheter kan läggas till i kortets konfiguration.</div>\n    </div>\n\n    <!-- EV 1-FAS LASTBALANSERING -->\n    <div class="card devices-card" style="grid-column:1/-1;">\n      <div class="card-head">\n        <div class="card-title">\n          <span class="dot" style="background:var(--solar)"></span>\n          <div>\n            <h3>EV-laddare 1-fas — lastbalansering</h3>\n            <div class="source-tag">Shellyplug-s · automatisk</div>\n          </div>\n        </div>\n        <span class="status-chip" id="c-ev1f-chip" style="background:var(--surface-2); color:var(--text-dim)">–</span>\n      </div>\n      <div class="stat-row"><span class="k">☀️ Solöverskott</span><span class="v" id="c-ev1f-sol">–</span></div>\n      <div class="stat-row"><span class="k">💰 Billig el just nu</span><span class="v" id="c-ev1f-pris">–</span></div>\n      <div class="stat-row"><span class="k">🔋 Batteri &gt; 80%</span><span class="v" id="c-ev1f-batt">–</span></div>\n      <div class="sub-line" style="margin-top:10px;">Styrs helt automatiskt av en HA-automation — laddar när något av villkoren är uppfyllt.</div>\n    </div>\n\n    <!-- VATTENVENTIL -->\n    <div class="card devices-card" style="grid-column:1/-1;">\n      <div class="card-head">\n        <div class="card-title">\n          <span class="dot" style="background:var(--grid)"></span>\n          <div>\n            <h3>Vattenslang</h3>\n            <div class="source-tag">Shelly Plus 2PM</div>\n          </div>\n        </div>\n        <span class="status-chip" id="valveChip" style="background:var(--surface-2); color:var(--text-dim)">Av</span>\n      </div>\n      <div class="big-num" id="valveTimer" style="font-size:22px;">Vattnet är avstängt</div>\n      <div class="valve-buttons">\n        <button class="valve-btn off-btn" data-action="valve" data-minutes="0">Av</button>\n        <button class="valve-btn" data-action="valve" data-minutes="30">På 30 min</button>\n        <button class="valve-btn" data-action="valve" data-minutes="60">På 1 tim</button>\n        <button class="valve-btn" data-action="valve" data-minutes="120">På 2 tim</button>\n      </div>\n      <div class="sub-line" style="margin-top:12px;">Riktig styrning — öppnar/stänger <code>cover.shellyplus2pm_30c9228094c0</code> direkt.</div>\n    </div>\n\n    <!-- TADO AC -->\n    <div class="card devices-card" style="grid-column:1/-1;">\n      <div class="card-head">\n        <div class="card-title">\n          <span class="dot" style="background:var(--weather)"></span>\n          <div>\n            <h3>Tado — AC</h3>\n            <div class="source-tag">Klimatstyrning</div>\n          </div>\n        </div>\n        <span class="status-chip" id="c-tado-chip" style="background:var(--surface-2); color:var(--text-dim)">–</span>\n      </div>\n      <div class="big-num" id="c-tado-current">–<small>°C nu</small></div>\n      <div class="sub-line" id="c-tado-sub">–</div>\n      <div class="valve-buttons">\n        <button class="valve-btn off-btn" id="tado-off-btn" data-action="tado-off">Av</button>\n        <button class="valve-btn" id="tado-auto-btn" data-action="tado-auto">Auto</button>\n        <button class="valve-btn" id="tado-cool-btn" data-action="tado-cool">Kyla</button>\n        <button class="valve-btn" id="tado-heat-btn" data-action="tado-heat">Värme</button>\n      </div>\n      <div class="temp-stepper">\n        <button class="temp-step-btn" data-action="tado-temp-down" aria-label="Sänk temperatur">−</button>\n        <div class="temp-step-display">Mål<br><span id="c-tado-target">–</span>°C</div>\n        <button class="temp-step-btn" data-action="tado-temp-up" aria-label="Höj temperatur">+</button>\n      </div>\n      <div class="sub-line" style="margin-top:12px;">Riktig styrning — anropar <code>climate</code>-tjänster direkt i din Home Assistant.</div>\n    </div>\n\n    \n  </div>\n\n  <!-- FOOTER SUMMARY -->\n  <div class="footer">\n    <div class="foot-item"><div class="lbl">Ackumulerad produktion</div><div class="val" id="f-prod" style="color:var(--solar)">–</div></div>\n    <div class="foot-item"><div class="lbl">Ackumulerad förbrukning</div><div class="val" id="f-cons" style="color:var(--grid)">–</div></div>\n    <div class="foot-item"><div class="lbl">Ackumulerad kostnad</div><div class="val" id="f-cost" style="color:var(--text)">–</div></div>\n    <div class="foot-item"><div class="lbl">Månadskostnad hittills</div><div class="val" id="f-month" style="color:var(--text)">–</div></div>\n  </div>\n\n  <div class="footnote" id="c-updated">Live · Home Assistant</div>\n</div>\n\n<script>\n\n</div>\n';

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
  getGridOptions() { return { columns: "full", rows: "auto", min_columns: 6 }; }

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
    return decimals === undefined ? n : parseFloat(n.toFixed(decimals));
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

  _callClimateMode(mode) {
    const id = this._e('tado_climate');
    if (!id || !this._hass) return;
    this._hass.callService('climate', 'set_hvac_mode', { entity_id: id, hvac_mode: mode });
  }

  _callClimateTempStep(delta) {
    const id = this._e('tado_climate');
    if (!id || !this._hass) return;
    const st = this._hass.states[id];
    if (!st) return;
    const current = parseFloat(st.attributes.temperature);
    if (isNaN(current)) return;
    const next = Math.round(current + delta);
    // optimistic UI update — show the new target instantly, don't wait for the round trip
    this._set('c-tado-target', next.toFixed(0));
    this._hass.callService('climate', 'set_temperature', { entity_id: id, temperature: next });
  }

  // ---------- period accounting (day/month/year) for Tibber money values ----------
  // Reward sensor resets to 0 every midnight -> accumulate day totals into month/year.
  _periodFromDailyReset(key, todayValue, seedMonth, seedYear) {
    if (todayValue === null) return { day: null, month: null, year: null };
    const now = new Date();
    const yearKey = String(now.getFullYear());
    const monthKey = yearKey + '-' + String(now.getMonth()+1).padStart(2,'0');
    const dayKey = monthKey + '-' + String(now.getDate()).padStart(2,'0');
    const storeKey = 'grankulle_period_dr_' + key + '_v1';
    let s;
    try { s = JSON.parse(localStorage.getItem(storeKey) || 'null'); } catch(e) { s = null; }
    if (!s) {
      s = { year: yearKey, yearTotal: seedYear - seedMonth, month: monthKey, monthTotal: seedMonth - todayValue, lastDay: dayKey, lastDayValue: todayValue };
    } else if (s.lastDay !== dayKey) {
      s.monthTotal += s.lastDayValue;
      if (s.month !== monthKey) {
        s.yearTotal += s.monthTotal;
        s.month = monthKey;
        s.monthTotal = 0;
        if (s.year !== yearKey) { s.year = yearKey; s.yearTotal = 0; }
      }
      s.lastDay = dayKey;
      s.lastDayValue = todayValue;
    } else {
      s.lastDayValue = todayValue;
    }
    try { localStorage.setItem(storeKey, JSON.stringify(s)); } catch(e) {}
    return { day: s.lastDayValue, month: s.monthTotal + s.lastDayValue, year: s.yearTotal + s.monthTotal + s.lastDayValue };
  }

  // Cost sensor is a running month-to-date total (doesn't reset daily) -> derive day via delta, accumulate year via month rollover.
  _periodFromMonthlyRunning(key, currentMonthValue, seedMonth, seedYear) {
    if (currentMonthValue === null) return { day: null, month: null, year: null };
    const now = new Date();
    const yearKey = String(now.getFullYear());
    const monthKey = yearKey + '-' + String(now.getMonth()+1).padStart(2,'0');
    const dayKey = monthKey + '-' + String(now.getDate()).padStart(2,'0');
    const storeKey = 'grankulle_period_mr_' + key + '_v1';
    let s;
    try { s = JSON.parse(localStorage.getItem(storeKey) || 'null'); } catch(e) { s = null; }
    if (!s) {
      s = { month: monthKey, yearAccum: seedYear - seedMonth, lastMonthValue: currentMonthValue, day: dayKey, dayBaseline: currentMonthValue - (currentMonthValue - seedMonth >= 0 ? 0 : 0) };
      s.dayBaseline = currentMonthValue; // best guess: today's contribution unknown at first run, start delta at 0
    } else if (s.month !== monthKey) {
      s.yearAccum += s.lastMonthValue;
      s.month = monthKey;
      s.day = dayKey;
      s.dayBaseline = 0;
      s.lastMonthValue = currentMonthValue;
    } else if (s.day !== dayKey) {
      s.day = dayKey;
      s.dayBaseline = s.lastMonthValue;
      s.lastMonthValue = currentMonthValue;
    } else {
      s.lastMonthValue = currentMonthValue;
    }
    try { localStorage.setItem(storeKey, JSON.stringify(s)); } catch(e) {}
    return { day: currentMonthValue - s.dayBaseline, month: currentMonthValue, year: s.yearAccum + currentMonthValue };
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
      if (action === 'valve') this._setValve(parseInt(btn.dataset.minutes, 10));
      if (action === 'toggle-hose') this._setValve(this._valveOffAt ? 0 : 30);
      if (action === 'toggle-zaptec-off') this._call('switch', 'turn_off', 'zaptec_charge_switch');
      if (action === 'toggle-zaptec-on') this._call('switch', 'turn_on', 'zaptec_charge_switch');
      if (action === 'tado-off') this._callClimateMode('off');
      if (action === 'tado-auto') this._callClimateMode('auto');
      if (action === 'tado-cool') this._callClimateMode('cool');
      if (action === 'tado-heat') this._callClimateMode('heat');
      if (action === 'tado-temp-up') this._callClimateTempStep(1);
      if (action === 'tado-temp-down') this._callClimateTempStep(-1);
    });

    this._applySeasonAndWeather();
    this._tickClock();
    setInterval(() => this._tickClock(), 30000);
    setInterval(() => this._updateValveTimer(), 1000);
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
    this._set('c-batt-current', this._fmt(this._num('battery_current', 1), 1, ' A'));

    // Fronius
    const froPower = this._num('fronius_power', 0);
    const froLifetime = this._num('fronius_lifetime', 0);
    this._set('c-fro-power', froPower === null ? '\u2013' : Math.round(froPower));
    this.shadowRoot.getElementById('c-fro-power').innerHTML = (froPower === null ? '\u2013' : Math.round(froPower)) + '<small>W nu</small>';
    this._set('c-fro-chip', (froPower && froPower > 20) ? 'Producerar' : 'Ingen produktion');
    this._set('c-fro-sub', froLifetime === null ? '\u2013' : ('Totalt ' + Math.round(froLifetime).toLocaleString('sv-SE') + ' kWh sedan start'));
    const froI1 = this._num('fronius_current_l1',1), froI2 = this._num('fronius_current_l2',1), froI3 = this._num('fronius_current_l3',1);
    this._set('c-fro-current', [froI1,froI2,froI3].every(v=>v!==null) ? froI1+' / '+froI2+' / '+froI3+' A' : '\u2013');
    
    // Zaptec
    const zapConn = this._val('zaptec_connection');
    const zapPlug = this._val('zaptec_plug');
    const zapCharging = this._val('zaptec_charging');
    const zapMaxA = this._val('zaptec_max_current');
    const zapPower = this._num('zaptec_power', 0);
    const zapCurrent = this._num('zaptec_current', 1);
    this.shadowRoot.getElementById('c-zap-power').innerHTML =
      (zapPower !== null ? Math.round(zapPower) : (zapCurrent !== null ? Math.round(zapCurrent * 230) : '\u2013')) + '<small>W</small>';
    this._set('c-zap-chip', zapCharging === 'on' ? 'Laddar' : (zapPlug === 'on' ? 'Ansluten' : 'Fr\u00e5nkopplad'));
    this._set('c-zap-sub', zapCharging === 'on' ? 'Bilen laddar just nu' : (zapPlug === 'on' ? 'Ansluten, laddar inte' : 'Ingen bil ansluten just nu'));
    this._set('c-zap-plug', zapPlug === 'on' ? 'Ansluten' : 'Ej ansluten');
    this._set('c-zap-charging', zapCharging === 'on' ? 'P\u00e5' : 'Av');
    this._set('c-zap-maxcurrent', zapMaxA === null ? '\u2013' : zapMaxA + ' A');
    const zapI1 = this._num('zaptec_current_l1',1), zapI2 = this._num('zaptec_current_l2',1), zapI3 = this._num('zaptec_current_l3',1);
    this._set('c-zap-current', [zapI1,zapI2,zapI3].every(v=>v!==null) ? zapI1+' / '+zapI2+' / '+zapI3+' A' : (zapCurrent===null?'\u2013':zapCurrent+' A'));
    const zapChargeState = this._val('zaptec_charge_switch');
    const zapOffBtn = this.shadowRoot.getElementById('zap-charge-off');
    const zapOnBtn = this.shadowRoot.getElementById('zap-charge-on');
    if (zapOffBtn && zapOnBtn) {
      zapOffBtn.classList.toggle('active', zapChargeState === 'off');
      zapOnBtn.classList.toggle('active', zapChargeState === 'on');
    }
    const cableEl = this.shadowRoot.getElementById('scene-charge-cable');
    if (cableEl) {
      cableEl.classList.toggle('flow-pulse', zapCharging === 'on');
      cableEl.setAttribute('stroke', zapCharging === 'on' ? 'var(--ev)' : '#3a4247');
    }

    // Weather
    const wxTemp = this._num('weather_temp', 1);
    const sceneTempEl = this.shadowRoot.getElementById('scene-temp');
    if (sceneTempEl) sceneTempEl.textContent = (wxTemp === null ? '\u2013' : Math.round(wxTemp)) + '\u00b0';
    const wxFeels = this._num('weather_feels', 1);
    const wxHum = this._num('weather_humidity', 0);
    const wxDew = this._num('weather_dewpoint', 1);
    this.shadowRoot.getElementById('c-wx-temp').innerHTML = (wxTemp === null ? '\u2013' : wxTemp) + '<small>\u00b0C</small>';
    this._set('c-wx-sub', 'K\u00e4nns som ' + this._fmt(wxFeels,1,'\u00b0C') + ' \u00b7 luftfuktighet ' + this._fmt(wxHum,0,'%'));
    this._set('c-wx-dew', this._fmt(wxDew,1,'\u00b0C'));
    this._set('c-wx-rain', this._fmt(this._num('weather_rain_today',1),1,' mm'));
    const uvVal = this._num('weather_uv', 1);
    this._set('c-wx-uv', this._fmt(uvVal,1,''));
    const uvEl = this.shadowRoot.getElementById('c-wx-uv');
    if (uvEl && uvVal !== null) {
      let uvColor = 'var(--battery)';
      if (uvVal >= 11) uvColor = '#c23b2e';
      else if (uvVal >= 8) uvColor = '#e2634f';
      else if (uvVal >= 6) uvColor = '#f0a83c';
      else if (uvVal >= 3) uvColor = '#e8d24a';
      uvEl.style.color = uvColor;
      uvEl.style.fontWeight = uvVal >= 8 ? '700' : '500';
    }
    const uvTipEl = this.shadowRoot.getElementById('c-wx-uv-tip');
    if (uvTipEl) {
      if (uvVal !== null && uvVal >= 11) {
        uvTipEl.textContent = 'Extremt \u2014 undvik solen mitt p\u00e5 dagen, SPF 50+ och heltäckande kläder';
        uvTipEl.style.display = 'block';
        uvTipEl.style.color = '#e2634f';
      } else if (uvVal !== null && uvVal >= 8) {
        uvTipEl.textContent = 'Mycket starkt \u2014 stanna i skuggan mitt p\u00e5 dagen, SPF 30+';
        uvTipEl.style.display = 'block';
        uvTipEl.style.color = '#e2634f';
      } else if (uvVal !== null && uvVal >= 6) {
        uvTipEl.textContent = 'Starkt \u2014 SPF 30+, solglasögon, undvik direkt sol mitt p\u00e5 dagen';
        uvTipEl.style.display = 'block';
        uvTipEl.style.color = 'var(--text-dim)';
      } else {
        uvTipEl.style.display = 'none';
      }
    }
    const coopTemp = this._num('coop_temp', 1);
    const sceneCoopEl = this.shadowRoot.getElementById('scene-coop-temp');
    if (sceneCoopEl) sceneCoopEl.textContent = (coopTemp === null ? '\u2013' : Math.round(coopTemp)) + '\u00b0';
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
    const rewardPeriods = this._periodFromDailyReset('reward', reward, 568, 1472);
    this._set('c-tib-reward-day', this._fmt(rewardPeriods.day, 2, ' SEK'));
    this._set('c-tib-reward-month', this._fmt(rewardPeriods.month, 2, ' SEK'));
    this._set('c-tib-reward-year', this._fmt(rewardPeriods.year, 2, ' SEK'));

    const costPeriods = this._periodFromMonthlyRunning('cost', monthCost, 107, 533);
    this._set('c-tib-cost-day', this._fmt(costPeriods.day, 2, ' SEK'));
    this._set('c-tib-month', this._fmt(costPeriods.month, 2, ' SEK'));
    this._set('c-tib-cost-year', this._fmt(costPeriods.year, 2, ' SEK'));
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
    // EV-laddare 1-fas lastbalansering
    const ev1fasState = this._st('ev_1fas_status');
    if (ev1fasState) {
      const allowed = ev1fasState.state === 'on';
      this._set('c-ev1f-chip', allowed ? 'Laddning till\u00e5ten' : 'Laddning paus');
      const chipEl = this.shadowRoot.getElementById('c-ev1f-chip');
      if (chipEl) {
        chipEl.style.background = allowed ? 'var(--battery-dim)' : 'var(--surface-2)';
        chipEl.style.color = allowed ? 'var(--battery)' : 'var(--text-dim)';
      }
      const attrs = ev1fasState.attributes;
      this._set('c-ev1f-sol', attrs.sol_overskott_ok ? ('Ja, ' + attrs.sol_overskott_w + ' W') : 'Nej');
      this._set('c-ev1f-pris', attrs.billig_el_ok ? 'Ja' : 'Nej');
      this._set('c-ev1f-batt', attrs.batteri_over_80_ok ? 'Ja' : 'Nej');
    }

    // Tado AC
    const tadoState = this._st('tado_climate');
    if (tadoState) {
      const hvacMode = tadoState.state;
      const currentTemp = parseFloat(tadoState.attributes.current_temperature);
      const targetTemp = parseFloat(tadoState.attributes.temperature);
      const modeNames = { off:'Av', auto:'Auto', cool:'Kylning', heat:'V\u00e4rme', dry:'Avfuktning', fan_only:'Fl\u00e4kt' };
      this._set('c-tado-chip', modeNames[hvacMode] || hvacMode || '\u2013');
      this.shadowRoot.getElementById('c-tado-current').innerHTML = (isNaN(currentTemp) ? '\u2013' : currentTemp.toFixed(1)) + '<small>\u00b0C nu</small>';
      const tadoTargetDisplay = hvacMode === 'off'
        ? (isNaN(currentTemp) ? '\u2013' : Math.round(currentTemp).toString())
        : (isNaN(targetTemp) ? '\u2013' : Math.round(targetTemp).toString());
      this._set('c-tado-target', tadoTargetDisplay);
      this._set('c-tado-sub', tadoState.attributes.hvac_action ? ('Status: ' + tadoState.attributes.hvac_action) : '');
      ['off','auto','cool','heat'].forEach(m => {
        const btn = this.shadowRoot.getElementById('tado-' + m + '-btn');
        if (btn) btn.classList.toggle('active', hvacMode === m);
      });
    }

    // Vattenslang (cover-entitet) — synka riktig status om ingen lokal timer kör just nu
    const valveState = this._st('water_valve');
    if (valveState && this._valveOffAt === null) {
      const chip = this.shadowRoot.getElementById('valveChip');
      const timerEl = this.shadowRoot.getElementById('valveTimer');
      const isOpen = valveState.state === 'open';
      if (chip) {
        chip.textContent = isOpen ? 'P\u00e5' : 'Av';
        chip.style.background = isOpen ? 'var(--grid-dim)' : 'var(--surface-2)';
        chip.style.color = isOpen ? 'var(--grid)' : 'var(--text-dim)';
      }
      if (timerEl) timerEl.textContent = isOpen ? 'P\u00e5slaget (utan lokal timer)' : 'Vattnet \u00e4r avst\u00e4ngt';
      const hd2 = this.shadowRoot.getElementById('hose-drops'); if (hd2) hd2.classList.toggle('active', isOpen);
      const hb2 = this.shadowRoot.getElementById('hose-button'); if (hb2) hb2.classList.toggle('active', isOpen);
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
    const gridAmpTotal = ['grid_current_l1','grid_current_l2','grid_current_l3'].map(k=>this._num(k,1)).filter(v=>v!==null);
    const gridAmpText = gridAmpTotal.length ? ' \u00b7 ' + gridAmpTotal.reduce((a,b)=>a+b,0).toFixed(1) + ' A' : '';
    this._set('fv-grid', this._fmt(gridSum/1000, 2, ' kW') + (gridSum >= 0 ? ' in' : ' ut') + gridAmpText);

    // "F\u00f6rbrukning" on the GX device measures everything downstream on the house panel,
    // which includes the Zaptec charger (same el-central) \u2014 subtract it so "Hus" shows the
    // house's own load only, not double-counted with the separate EV-laddare node.
    const zapPowerForHouse = this._num('zaptec_power', 0) || 0;
    const houseOnlyPower = houseSum - zapPowerForHouse;
    const houseCurrentPhases = ['house_current_l1','house_current_l2','house_current_l3'];
    const zapCurrentPhases = ['zaptec_current_l1','zaptec_current_l2','zaptec_current_l3'];
    let houseOnlyAmp = null;
    if (houseCurrentPhases.every(k => this._num(k,1) !== null)) {
      houseOnlyAmp = houseCurrentPhases.reduce((sum,k,i) => {
        const houseA = this._num(k,1);
        const zapA = this._num(zapCurrentPhases[i],1);
        return sum + (houseA - (zapA !== null ? zapA : 0));
      }, 0);
    }
    const houseAmpText = houseOnlyAmp !== null ? ' \u00b7 ' + houseOnlyAmp.toFixed(1) + ' A' : '';
    this._set('fv-house', this._fmt(houseOnlyPower/1000, 2, ' kW') + houseAmpText);
    this._set('fv-fronius', froPower === null ? '\u2013' : this._fmt(froPower/1000, 2, ' kW'));

    // per-phase breakdown text (VRM-style)
    ['1','2','3'].forEach(n => {
      const gp = this._num('grid_power_l' + n, 0);
      this._set('fv-grid-l' + n, 'L' + n + ': ' + (gp === null ? '\u2013' : Math.round(gp) + ' W'));

      const hp = this._num('house_power_l' + n, 0);
      const zc = this._num('zaptec_current_l' + n, 1);
      const hpOnly = hp !== null ? hp - (zc !== null ? zc * 230 : 0) : null;
      this._set('fv-house-l' + n, 'L' + n + ': ' + (hpOnly === null ? '\u2013' : Math.round(hpOnly) + ' W'));

      const zi = this._num('zaptec_current_l' + n, 1);
      this._set('fv-ev-l' + n, 'L' + n + ': ' + (zi === null ? '\u2013' : zi + ' A'));

      const fp = this._num('fronius_power_l' + n, 0);
      this._set('fv-fronius-l' + n, 'L' + n + ': ' + (fp === null ? '\u2013' : Math.round(fp) + ' W'));
    });

    const zapCharging = this._val('zaptec_charging');
    const zapPlug = this._val('zaptec_plug');
    const zapPowerVal = this._num('zaptec_power', 0);
    const zapEvText = zapCharging === 'on'
      ? ('Laddar' + (zapPowerVal !== null ? ' \u00b7 ' + (zapPowerVal/1000).toFixed(1) + ' kW' : ''))
      : (zapPlug === 'on' ? 'Ansluten' : 'Ej ansluten');
    this._set('fv-ev', zapEvText);

    // helper: set a path's d + keep its traveling dot in sync, toggle active state
    const setEdge = (pathId, dotId, motionId, dValue, isActive) => {
      const p = this.shadowRoot.getElementById(pathId);
      const dot = this.shadowRoot.getElementById(dotId);
      if (p && dValue) p.setAttribute('d', dValue);
      if (dValue) {
        [motionId, motionId + '2', motionId + '3'].forEach(mid => {
          const m = this.shadowRoot.getElementById(mid);
          if (m) m.setAttribute('path', dValue);
        });
      }
      if (dot) dot.classList.toggle('active', !!isActive);
    };

    // battery edge direction/color (charging: Batteri<-MultiPlus, discharging: Batteri->MultiPlus)
    const battChargeD = 'M 350 210 C 350 180, 350 150, 350 120';
    const battDischargeD = 'M 350 120 C 350 150, 350 180, 350 210';
    if (battState === 'charging') {
      setEdge('fv-path-batt', 'fv-dot-batt', 'fv-motion-batt', battChargeD, true);
    } else if (battState === 'discharging') {
      setEdge('fv-path-batt', 'fv-dot-batt', 'fv-motion-batt', battDischargeD, true);
    } else {
      setEdge('fv-path-batt', 'fv-dot-batt', 'fv-motion-batt', battDischargeD, false);
    }

    // grid <-> multiplus <-> house: reverse direction when exporting (gridSum < 0)
    const gridInImportD = 'M 350 410 C 350 380, 350 350, 350 320';
    const gridInExportD = 'M 350 320 C 350 350, 350 380, 350 410';
    const gridOutImportD = 'M 470 235 C 600 150, 680 90, 720 65';
    const gridOutExportD = 'M 720 65 C 680 80, 600 130, 470 185';
    const importing = gridSum >= 0;
    setEdge('fv-path-gridin', 'fv-dot-gridin', 'fv-motion-gridin', importing ? gridInImportD : gridInExportD, Math.abs(gridSum) > 20);
    // Hus is always MultiPlus \u2192 Hus (a house consumes, it never feeds power back) \u2014
    // this must NOT follow the grid's import/export sign, only whether there's meaningful flow.
    setEdge('fv-path-gridout', 'fv-dot-gridout', 'fv-motion-gridout', gridOutImportD, houseOnlyPower > 20);

    const froActive = froPower !== null && froPower > 20;
    setEdge('fv-path-fronius', 'fv-dot-fronius', 'fv-motion-fronius', null, froActive);
    const froPath = this.shadowRoot.getElementById('fv-path-fronius');
    if (froPath) froPath.setAttribute('stroke', froActive ? '#f0a83c' : '#3a4247');

    const evActive = zapCharging === 'on';
    setEdge('fv-path-ev', 'fv-dot-ev', 'fv-motion-ev', null, evActive);
    const evPath = this.shadowRoot.getElementById('fv-path-ev');
    if (evPath) evPath.setAttribute('stroke', evActive ? '#b18cf0' : '#3a4247');
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
    if (this._valveTimeout) { clearTimeout(this._valveTimeout); this._valveTimeout = null; }

    if (minutes === 0) {
      this._valveOffAt = null;
      this._call('cover', 'close_cover', 'water_valve');
      chip.textContent = 'Av';
      chip.style.background = 'var(--surface-2)';
      chip.style.color = 'var(--text-dim)';
      timerEl.textContent = 'Vattnet \u00e4r avst\u00e4ngt';
      if (btns[0]) btns[0].classList.add('active');
      const hd0 = this.shadowRoot.getElementById('hose-drops'); if (hd0) hd0.classList.remove('active');
      const hb0 = this.shadowRoot.getElementById('hose-button'); if (hb0) hb0.classList.remove('active');
    } else {
      this._valveOffAt = Date.now() + minutes * 60000;
      this._call('cover', 'open_cover', 'water_valve');
      chip.textContent = 'P\u00e5';
      chip.style.background = 'var(--grid-dim)';
      chip.style.color = 'var(--grid)';
      btns.forEach(b => { if (b.dataset.minutes == minutes) b.classList.add('active'); });
      this._updateValveTimer();
      const hd1 = this.shadowRoot.getElementById('hose-drops'); if (hd1) hd1.classList.add('active');
      const hb1 = this.shadowRoot.getElementById('hose-button'); if (hb1) hb1.classList.add('active');
      this._valveTimeout = setTimeout(() => this._setValve(0), minutes * 60000);
    }
  }
  _updateValveTimer() {
    const timerEl = this.shadowRoot.getElementById('valveTimer');
    if (!timerEl || !this._valveOffAt) return;
    const remaining = Math.max(0, this._valveOffAt - Date.now());
    if (remaining <= 0) { return; }
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
