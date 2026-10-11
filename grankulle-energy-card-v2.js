/**
 * Grankulle Energy Card — v2
 * "Photo dashboard": uses a static, CLEAN background photo (no text/UI baked in)
 * with real, live Home Assistant data overlaid in styled panels and tags
 * positioned on the objects in the picture. Trade-off vs v1: the scene itself is a frozen
 * photo (no day/night, no season change, no moving parts) — but the panel
 * numbers are 100% real, live HA data, same as v1.
 *
 * Distinct custom element name from v1 on purpose, so both can be loaded in
 * the same Home Assistant instance without colliding:
 *   v1 -> customElements.define('grankulle-energy-card', ...)
 *   v2 -> customElements.define('grankulle-energy-card-v2', ...)
 */

const DEFAULT_ENTITIES = {
  battery_soc: "sensor.kallare_gx_device_dc_batteri_laddning",
  battery_power: "sensor.kallare_gx_device_dc_batteri_effekt",
  battery_voltage: "sensor.kallare_gx_device_dc_batteri_spanning",
  battery_current: "sensor.kallare_gx_device_dc_batteri_strom",
  battery_temp: null,

  grid_power_l1: "sensor.kallare_gx_device_elnat_effekt_l1",
  grid_power_l2: "sensor.kallare_gx_device_elnat_effekt_l2",
  grid_power_l3: "sensor.kallare_gx_device_elnat_effekt_l3",

  house_power_l1: "sensor.kallare_gx_device_forbrukning_effekt_l1",
  house_power_l2: "sensor.kallare_gx_device_forbrukning_effekt_l2",
  house_power_l3: "sensor.kallare_gx_device_forbrukning_effekt_l3",

  fronius_power: "sensor.fronius_symo_12_5_3_m_id_20_total_effekt",
  zaptec_power: "sensor.zaptec_laddeffekt",

  tibber_price: "sensor.tibber_pulse_grankullevagen_elpris",
  tibber_consumption: "sensor.tibber_pulse_grankullevagen_ackumulerad_forbrukning",
  tibber_production: "sensor.tibber_pulse_grankullevagen_ackumulerad_produktion",

  weather_temp: "sensor.st_00150138_temperatur",
  weather_humidity: "sensor.st_00150138_luftfuktighet",
  weather_uv: "sensor.st_00150138_uv_index",
  weather_rain_today: "sensor.st_00150138_nederbord",

  coop_temp: "sensor.st_00133621_temperatur",
  greenhouse_temp: null,
  greenhouse_humidity: null,

  water_valve: "cover.shellyplus2pm_30c9228094c0",
  water_timer: "timer.vattenventil",
  shelly1: "switch.shelly1_c45bbe7774e8",
  shelly2: "switch.shellyplug_s_4022d882ea60",
  shelly2_power: "sensor.shellyplug_s_4022d882ea60_effekt",
  zaptec_charge_switch: "switch.zaptec_laddar",
  zaptec_status: "sensor.zaptec_laddstatus",
  zaptec_btn_resume: "button.zaptec_ateruppta_laddning",
  zaptec_btn_stop: "button.zaptec_stoppa_laddning",
  zaptec_mode: "input_select.zaptec_ev_mode",
  ev_1fas_mode: "input_select.ev_1fas_mode",
  ev_1fas_status: "binary_sensor.ev_laddning_tillaten_1_fas",
  sun: "sun.sun",
};

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));

const WEATHER_ICON = {
  clear: "☀️", cloudy: "⛅", rain: "🌧️", snow: "❄️", fog: "🌫️",
};
const classifyWeatherCode = (code) => {
  if ([51,53,55,56,57,61,63,65,66,67,80,81,82,95,96,99].includes(code)) return "rain";
  if ([71,73,75,77,85,86].includes(code)) return "snow";
  if ([45,48].includes(code)) return "fog";
  if ([1,2,3].includes(code)) return "cloudy";
  return "clear";
};

class GrankulleEnergyCardV2 extends HTMLElement {
  setConfig(config) {
    if (!config || !config.background_image) {
      throw new Error("Ange 'background_image: <url>' i konfigurationen — se README.");
    }
    this._config = config;
    this._entities = { ...DEFAULT_ENTITIES, ...(config.entities || {}) };
    this._lat = config.latitude || 59.4630143;
    this._lon = config.longitude || 17.8858662;
    this._built = false;
  }

  getCardSize() { return 10; }
  getGridOptions() { return { columns: "full", rows: "auto" }; }

  set hass(hass) {
    this._hass = hass;
    if (!this._built) {
      this._buildDom();
      this._built = true;
      this._fetchForecast();
    }
    this._update();
  }

  _e(key) { return this._entities[key]; }
  _st(key) {
    const id = this._e(key);
    if (!id || !this._hass || !this._hass.states[id]) return null;
    return this._hass.states[id];
  }
  _num(key, fallback = null) {
    const s = this._st(key);
    const v = s ? parseFloat(s.state) : NaN;
    return Number.isFinite(v) ? v : fallback;
  }
  _set(id, text) {
    const el = this.shadowRoot.getElementById(id);
    if (el) el.textContent = text;
  }
  _fmt(n, decimals = 1, suffix = "") {
    if (n === null || n === undefined || Number.isNaN(n)) return "–";
    return n.toFixed(decimals) + suffix;
  }

  _buildDom() {
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>${STYLE}</style>
      <div class="photo-card" style="background-image:url('${this._config.background_image}')">

        <div class="topbar">
          <div class="brand">
            <div class="h1">GRANKULLEVÄGEN 19</div>
            <div class="sub">ENERGI · HEM · VÄDER · TRÄDGÅRD</div>
          </div>
          <div class="weather-now">
            <span id="w-icon">–</span>
            <span id="w-temp" class="w-temp">–,– °C</span>
            <span id="w-desc" class="w-desc">–</span>
          </div>
          <div class="mini-stats">
            <div><span id="w-wind">– m/s</span><small>VIND</small></div>
            <div><span id="w-rain">– mm</span><small>REGN</small></div>
            <div><span id="w-hum">– %</span><small>LUFTFUKT.</small></div>
          </div>
          <div class="clock-box">
            <div id="clock" class="clock">--:--</div>
            <div id="clockdate" class="clockdate">–</div>
          </div>
        </div>

        <div class="panel now">
          <div class="panel-title">Just nu</div>
          <div class="row"><span>☀️ Självförsörjning</span><b id="v-selfsuff">–%</b></div>
          <div class="row"><span>🔆 Solproduktion</span><b id="v-solar">– kW</b></div>
          <div class="row"><span>🏠 Husförbrukning</span><b id="v-house">– kW</b></div>
          <div class="row"><span>🔋 Batteri</span><b id="v-batt">–% · – kW</b></div>
          <div class="row"><span>⚡ Nät</span><b id="v-grid">– kW</b></div>
        </div>

        <div class="panel price">
          <div class="panel-title">Elpris just nu</div>
          <div class="price-big" id="v-price">– kr/kWh</div>
          <div class="price-sub">Tibber Pulse · Grankullevägen</div>
        </div>

        <div class="panel batt">
          <div class="panel-title">Batteri status</div>
          <svg viewBox="0 0 120 120" class="gauge">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#ffffff22" stroke-width="10"/>
            <circle id="battRing" cx="60" cy="60" r="50" fill="none" stroke="#3ddc84" stroke-width="10"
                    stroke-dasharray="314" stroke-dashoffset="314" transform="rotate(-90 60 60)" stroke-linecap="round"/>
            <text id="battPct" x="60" y="66" text-anchor="middle" font-size="24" fill="#fff">–%</text>
          </svg>
          <div class="row small"><span>Spänning</span><b id="v-vbatt">– V</b></div>
          <div class="row small"><span>Ström</span><b id="v-ibatt">– A</b></div>
          <div class="row small" id="row-tbatt"><span>Temperatur</span><b id="v-tbatt">– °C</b></div>
        </div>

        <div class="panel energyday">
          <div class="panel-title">Dagens energi</div>
          <div class="energy-cols">
            <div><span class="lbl">☀️ Sol</span><b id="v-day-solar">– kWh</b></div>
            <div><span class="lbl">🏠 Hus</span><b id="v-day-house">– kWh</b></div>
          </div>
        </div>

        <!-- overlay tags positioned over the photo, matching the reference layout -->
        <div class="tag" id="tag-solar" style="left:56%; top:28%;">
          <div class="tag-lbl">SOLPRODUKTION</div><div class="tag-val" id="tag-v-solar">– kW</div>
        </div>
        <div class="tag" id="tag-house" style="left:42%; top:40%;">
          <div class="tag-lbl">HUSFÖRBRUKNING</div><div class="tag-val" id="tag-v-house">– kW</div>
        </div>
        <div class="tag green" id="tag-batt" style="left:59%; top:46%;">
          <div class="tag-lbl">BATTERI</div><div class="tag-val" id="tag-v-batt">–% · – kW</div>
        </div>
        <div class="tag blue" id="tag-grid" style="left:73%; top:37%;">
          <div class="tag-lbl">NÄT</div><div class="tag-val" id="tag-v-grid">– kW</div>
        </div>
        <div class="tag green" id="tag-ev" data-action="toggle-controls" style="left:48.5%; top:47%; cursor:pointer;">
          <div class="tag-lbl">LADDBOX</div><div class="tag-val" id="tag-v-ev">– kW</div>
        </div>
        <div class="tag green" id="tag-greenhouse" style="left:91%; top:27%; display:none;">
          <div class="tag-lbl">VÄXTHUS</div><div class="tag-val" id="tag-v-greenhouse">–</div>
        </div>
        <div class="tag" id="tag-coop" style="left:87%; top:58%;">
          <div class="tag-lbl">HÖNSHUS</div><div class="tag-val" id="tag-v-coop">–</div>
        </div>
        <div class="tag blue" id="tag-hose" data-action="toggle-hose" style="left:84%; top:52%; cursor:pointer;">
          <div class="tag-lbl">SLANG</div><div class="tag-val" id="tag-v-hose">–</div>
        </div>

        <div class="panel forecast">
          <div class="panel-title">Väder framöver</div>
          <div class="forecast-row" id="forecastRow">
            <div class="fday">–</div><div class="fday">–</div><div class="fday">–</div><div class="fday">–</div><div class="fday">–</div>
          </div>
        </div>

        <div class="panel wind">
          <div class="panel-title">Vind just nu</div>
          <svg viewBox="0 0 100 100" class="compass">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#ffffff33" stroke-width="1.5"/>
            <text x="50" y="14" text-anchor="middle" font-size="9" fill="#ffffff88">N</text>
            <g id="windArrow" transform="rotate(0 50 50)">
              <path d="M50,14 L44,50 L50,42 L56,50 Z" fill="#42a5f5"/>
            </g>
          </svg>
          <div class="row small"><span id="v-winddir">–°</span><b id="v-windspeed">– m/s</b></div>
        </div>

        <div class="panel sensors">
          <div class="panel-title">Sensorer</div>
          <div class="row small"><span>🌡️ Ute temp</span><b id="v-sens-temp">– °C</b></div>
          <div class="row small"><span>💧 Luftfuktighet</span><b id="v-sens-hum">– %</b></div>
          <div class="row small"><span>🌀 Lufttryck</span><b id="v-sens-press">– hPa</b></div>
          <div class="row small"><span>☀️ UV-index</span><b id="v-sens-uv">–</b></div>
        </div>

        <div class="controls" id="controls" style="display:none">
          <div class="controls-head"><span>Styrning</span><button class="cbtn close" data-action="toggle-controls" aria-label="Stäng">✕</button></div>
          <div class="controls-grid">
            <section>
              <h4>Zaptec · 3-fas</h4>
              <div class="cstat" id="c-zaptec-status">–</div>
              <div class="crow">
                <button class="cbtn" data-action="zaptec-on">Starta laddning</button>
                <button class="cbtn" data-action="zaptec-off">Stoppa laddning</button>
              </div>
              <div class="clabel">Läge</div>
              <div class="crow" id="c-zaptec-modes">
                <button class="cbtn" data-action="mode-zaptec" data-mode="endast_sol">Endast sol</button>
                <button class="cbtn" data-action="mode-zaptec" data-mode="sol_plus_lite">Sol + lite</button>
                <button class="cbtn" data-action="mode-zaptec" data-mode="billig_el">Billig el</button>
                <button class="cbtn" data-action="mode-zaptec" data-mode="ladda_direkt">Ladda direkt</button>
              </div>
            </section>
            <section>
              <h4>EV 1-fas · Shelly-plugg</h4>
              <div class="cstat" id="c-1fas-status">–</div>
              <div class="crow"><button class="cbtn" id="c-shelly2" data-action="toggle-shelly2">–</button></div>
              <div class="clabel">Läge</div>
              <div class="crow" id="c-1fas-modes">
                <button class="cbtn" data-action="mode-1fas" data-mode="endast_sol">Endast sol</button>
                <button class="cbtn" data-action="mode-1fas" data-mode="sol_plus_lite">Sol + lite</button>
                <button class="cbtn" data-action="mode-1fas" data-mode="billig_el">Billig el</button>
                <button class="cbtn" data-action="mode-1fas" data-mode="ladda_direkt">Ladda direkt</button>
              </div>
            </section>
            <section>
              <h4>Vattenventil</h4>
              <div class="cstat" id="c-valve-status">–</div>
              <div class="crow" id="c-valve-btns">
                <button class="cbtn" data-action="valve" data-minutes="0">Av</button>
                <button class="cbtn" data-action="valve" data-minutes="30">30 min</button>
                <button class="cbtn" data-action="valve" data-minutes="60">1 tim</button>
                <button class="cbtn" data-action="valve" data-minutes="120">2 tim</button>
              </div>
            </section>
            <section>
              <h4>Shelly 1</h4>
              <div class="crow"><button class="cbtn" id="c-shelly1" data-action="toggle-shelly1">–</button></div>
            </section>
          </div>
        </div>

        <div class="navbar">
          <div class="nav-item active">🏠 Översikt</div>
          <div class="nav-item">⚡ Energi</div>
          <div class="nav-item">⛅ Väder</div>
          <div class="nav-item">🌱 Trädgård</div>
          <div class="nav-item">🚗 Bilar</div>
          <div class="nav-item">🔋 Batteri</div>
          <div class="nav-item">⚡ Tibber</div>
          <div class="nav-item">📊 Historik</div>
          <div class="nav-item ctl" data-action="toggle-controls">🎛️ Styrning</div>
        </div>
      </div>
    `;

    this.shadowRoot.addEventListener("click", (ev) => {
      const t = ev.target.closest("[data-action]");
      if (!t) { return; }
      const a = t.dataset.action;
      if (a === "toggle-controls") this._toggleControls();
      else if (a === "zaptec-on") this._zaptec(true);
      else if (a === "zaptec-off") this._zaptec(false);
      else if (a === "toggle-shelly1") this._svc("switch", "toggle", "shelly1");
      else if (a === "toggle-shelly2") this._svc("switch", "toggle", "shelly2");
      else if (a === "mode-zaptec") this._select("zaptec_mode", t.dataset.mode);
      else if (a === "mode-1fas") this._select("ev_1fas_mode", t.dataset.mode);
      else if (a === "valve") this._setValve(parseInt(t.dataset.minutes, 10));
      else if (a === "toggle-hose") this._setValve(this._valveOffAt ? 0 : 30);
    });

    this._tickClock();
    setInterval(() => this._tickClock(), 30000);
    setInterval(() => { const c = this.shadowRoot.getElementById("controls"); if (c && c.style.display !== "none") this._updateControls(); }, 1000);
  }


  // ---------- controls ----------
  _toggleControls() {
    const el = this.shadowRoot.getElementById("controls");
    if (el) el.style.display = el.style.display === "none" ? "block" : "none";
  }
  _svc(domain, service, key, extra) {
    const id = this._e(key);
    if (!id || !this._hass) return;
    this._hass.callService(domain, service, Object.assign({ entity_id: id }, extra || {}));
  }
  _select(key, option) {
    this._svc("input_select", "select_option", key, { option });
  }
  _zaptec(on) {
    const sw = this._st("zaptec_charge_switch");
    if (sw && sw.state !== "unavailable") this._svc("switch", on ? "turn_on" : "turn_off", "zaptec_charge_switch");
    else this._svc("button", "press", on ? "zaptec_btn_resume" : "zaptec_btn_stop");
  }
  _hms(minutes) {
    const h = Math.floor(minutes / 60), m = minutes % 60;
    return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0") + ":00";
  }
  // The countdown lives in Home Assistant (timer.vattenventil + automations), so the valve
  // closes by itself no matter where it was opened from or whether this browser stays open.
  _setValve(minutes) {
    const hasTimer = !!this._st("water_timer");
    if (this._valveTimeout) { clearTimeout(this._valveTimeout); this._valveTimeout = null; }
    if (minutes === 0) {
      this._valveOffAt = null;
      if (hasTimer) this._svc("timer", "cancel", "water_timer");
      this._svc("cover", "close_cover", "water_valve");
    } else {
      if (hasTimer) {
        this._svc("timer", "start", "water_timer", { duration: this._hms(minutes) });
      } else {
        // fallback when the HA timer helper is missing: browser-only timer
        this._valveOffAt = Date.now() + minutes * 60000;
        this._valveTimeout = setTimeout(() => this._setValve(0), minutes * 60000);
      }
      this._svc("cover", "open_cover", "water_valve");
    }
    this._updateControls();
  }
  _markActive(containerId, attr, value) {
    const c = this.shadowRoot.getElementById(containerId);
    if (!c) return;
    c.querySelectorAll(".cbtn").forEach(b => b.classList.toggle("active", b.dataset[attr] === value));
  }
  _updateControls() {
    const ZSTAT = { connected_charging: "Laddar", connected_finished: "Laddning klar", connected_requesting: "Väntar på start", disconnected: "Ej ansluten" };
    const zs = this._st("zaptec_status");
    const zp = this._num("zaptec_power", 0);
    this._set("c-zaptec-status", zs ? ((ZSTAT[zs.state] || zs.state) + " · " + this._fmt(zp / 1000, 2, " kW")) : "–");
    const zm = this._st("zaptec_mode");
    this._markActive("c-zaptec-modes", "mode", zm ? zm.state : "");
    if (!zm) this._set("c-zaptec-status", (zs ? ((ZSTAT[zs.state] || zs.state) + " · " + this._fmt(zp / 1000, 2, " kW")) : "–") + " · läge saknas");

    const ok1 = this._st("ev_1fas_status");
    const s2 = this._st("shelly2");
    const s2p = this._num("shelly2_power");
    this._set("c-1fas-status", (ok1 ? (ok1.state === "on" ? "Laddning tillåten" : "Pausad") : "–") + (s2p !== null ? " · " + Math.round(s2p) + " W" : ""));
    this._set("c-shelly2", s2 ? (s2.state === "on" ? "Plugg: PÅ (tryck för AV)" : s2.state === "off" ? "Plugg: AV (tryck för PÅ)" : "Plugg: ej tillgänglig") : "–");
    const m1 = this._st("ev_1fas_mode");
    this._markActive("c-1fas-modes", "mode", m1 ? m1.state : "");

    const s1 = this._st("shelly1");
    this._set("c-shelly1", s1 ? (s1.state === "on" ? "PÅ (tryck för AV)" : s1.state === "off" ? "AV (tryck för PÅ)" : "ej tillgänglig") : "–");

    const v = this._st("water_valve");
    const open = !!v && (v.state === "open" || v.state === "opening");
    const wt = this._st("water_timer");
    let vt = v ? (open ? "På" : "Av") : "–";
    let remMs = null, durMin = null;
    if (wt && wt.state === "active" && wt.attributes.finishes_at) {
      remMs = Math.max(0, new Date(wt.attributes.finishes_at).getTime() - Date.now());
      const dp = String(wt.attributes.duration || "").split(":").map(Number);
      if (dp.length >= 2) durMin = dp[0] * 60 + dp[1];
    } else if (!wt && this._valveOffAt) {
      remMs = Math.max(0, this._valveOffAt - Date.now());
    }
    if (open && remMs !== null) {
      vt += " · stänger om " + Math.floor(remMs / 60000) + " min " + String(Math.floor((remMs % 60000) / 1000)).padStart(2, "0") + " s";
    } else if (open) {
      vt += " · ingen timer";
    }
    this._set("c-valve-status", vt);
    this._markActive("c-valve-btns", "minutes", open ? (durMin !== null ? String(durMin) : "") : "0");
  }

  _tickClock() {
    const now = new Date();
    this._set("clock", now.toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" }));
    this._set("clockdate", now.toLocaleDateString("sv-SE", { weekday: "long", day: "2-digit", month: "long" }));
  }

  _fetchForecast() {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${this._lat}&longitude=${this._lon}` +
      `&current=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m,relative_humidity_2m,surface_pressure` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=5`;
    fetch(url).then(r => r.json()).then(data => {
      this._forecast = data;
      this._renderForecast();
      this._renderCurrentWeather();
    }).catch(() => {});
  }

  _renderForecast() {
    if (!this._forecast || !this._forecast.daily) return;
    const d = this._forecast.daily;
    const row = this.shadowRoot.getElementById("forecastRow");
    if (!row) return;
    const days = ["Sön","Mån","Tis","Ons","Tor","Fre","Lör"];
    row.innerHTML = d.time.map((t, i) => {
      const date = new Date(t);
      const label = i === 0 ? "Idag" : days[date.getDay()];
      const wcode = classifyWeatherCode(d.weather_code[i]);
      const icon = WEATHER_ICON[wcode] || "–";
      return `<div class="fday">
        <div class="fday-lbl">${label}</div>
        <div class="fday-icon">${icon}</div>
        <div class="fday-hi">${Math.round(d.temperature_2m_max[i])}°</div>
        <div class="fday-lo">${Math.round(d.temperature_2m_min[i])}°</div>
        <div class="fday-rain">${d.precipitation_sum[i].toFixed(1)} mm</div>
      </div>`;
    }).join("");
  }

  _renderCurrentWeather() {
    if (!this._forecast || !this._forecast.current) return;
    const c = this._forecast.current;
    const wcode = classifyWeatherCode(c.weather_code);
    this._set("w-icon", WEATHER_ICON[wcode] || "–");
    const descMap = { clear: "Klart", cloudy: "Delvis molnigt", rain: "Regn", snow: "Snöfall", fog: "Dimma" };
    this._set("w-desc", descMap[wcode] || "–");

    const dir = c.wind_direction_10m;
    const arrow = this.shadowRoot.getElementById("windArrow");
    if (arrow && typeof dir === "number") arrow.setAttribute("transform", `rotate(${dir} 50 50)`);
    this._set("v-winddir", Math.round(dir) + "°");
    this._set("v-windspeed", this._fmt(c.wind_speed_10m, 1, " m/s"));
    this._set("w-wind", this._fmt(c.wind_speed_10m, 1, " m/s"));
    this._set("v-sens-press", this._fmt(c.surface_pressure, 0, " hPa"));

    // Prefer real weather station values where available; fall back to open-meteo
    if (this._num("weather_humidity") === null) this._set("w-hum", this._fmt(c.relative_humidity_2m, 0, " %"));
  }

  _update() {
    const hass = this._hass;
    if (!hass) return;

    const solar = (this._num("fronius_power", 0)) / 1000;
    const zaptec = (this._num("zaptec_power", 0)) / 1000;
    const houseRaw = (
      (this._num("house_power_l1", 0)) + (this._num("house_power_l2", 0)) + (this._num("house_power_l3", 0))
    ) / 1000;
    const house = Math.max(0, houseRaw - zaptec);
    const grid = (
      (this._num("grid_power_l1", 0)) + (this._num("grid_power_l2", 0)) + (this._num("grid_power_l3", 0))
    ) / 1000;
    const battSoc = this._num("battery_soc", 0);
    const battPower = (this._num("battery_power", 0)) / 1000;
    const battV = this._num("battery_voltage");
    const battI = this._num("battery_current");
    const battT = this._num("battery_temp");

    const selfSuff = house > 0
      ? clamp(Math.round(((solar + Math.max(0, -battPower)) / house) * 100), 0, 100)
      : 100;

    this._set("v-selfsuff", selfSuff + "%");
    this._set("v-solar", this._fmt(solar, 2, " kW"));
    this._set("v-house", this._fmt(house, 2, " kW"));
    this._set("v-batt", Math.round(battSoc) + "% · " + this._fmt(battPower, 2, " kW"));
    this._set("v-grid", this._fmt(grid, 2, " kW"));

    this._set("tag-v-solar", this._fmt(solar, 2, " kW"));
    this._set("tag-v-house", this._fmt(house, 2, " kW"));
    this._set("tag-v-batt", Math.round(battSoc) + "% · " + this._fmt(battPower, 2, " kW"));
    this._set("tag-v-grid", this._fmt(grid, 2, " kW"));
    this._set("tag-v-ev", this._fmt(zaptec, 2, " kW"));

    const pct = clamp(battSoc, 0, 100);
    const el = this.shadowRoot.getElementById("battRing");
    if (el) el.setAttribute("stroke-dashoffset", String(314 * (1 - pct / 100)));
    this._set("battPct", Math.round(pct) + "%");
    this._set("v-vbatt", this._fmt(battV, 1, " V"));
    this._set("v-ibatt", this._fmt(battI, 1, " A"));
    this._set("v-tbatt", this._fmt(battT, 1, " °C"));
    const rowT = this.shadowRoot.getElementById("row-tbatt");
    if (rowT) rowT.style.display = battT === null ? "none" : "";

    const price = this._num("tibber_price");
    this._set("v-price", price === null ? "–" : price.toFixed(2) + " kr/kWh");

    this._set("v-day-solar", this._fmt(this._num("tibber_production"), 1, " kWh"));
    this._set("v-day-house", this._fmt(this._num("tibber_consumption"), 1, " kWh"));

    const wxTemp = this._num("weather_temp");
    const wxHum = this._num("weather_humidity");
    const wxUv = this._num("weather_uv");
    const wxRain = this._num("weather_rain_today");
    if (wxTemp !== null) { this._set("w-temp", wxTemp.toFixed(1) + " °C"); this._set("v-sens-temp", wxTemp.toFixed(1) + " °C"); }
    if (wxHum !== null) { this._set("w-hum", Math.round(wxHum) + " %"); this._set("v-sens-hum", Math.round(wxHum) + " %"); }
    if (wxUv !== null) this._set("v-sens-uv", wxUv.toFixed(1));
    if (wxRain !== null) this._set("w-rain", wxRain.toFixed(1) + " mm");

    const coopTemp = this._num("coop_temp");
    this._set("tag-v-coop", coopTemp === null ? "–" : coopTemp.toFixed(1) + " °C");

    const ghTemp = this._num("greenhouse_temp");
    const ghHum = this._num("greenhouse_humidity");
    const ghTag = this.shadowRoot.getElementById("tag-greenhouse");
    if (ghTag) ghTag.style.display = ghTemp === null ? "none" : "";
    this._set("tag-v-greenhouse",
      ghTemp === null ? "–" : ghTemp.toFixed(1) + " °C" + (ghHum !== null ? " · " + Math.round(ghHum) + "%" : ""));

    this._updateControls();

    const valveState = this._st("water_valve");
    const hoseOn = valveState && valveState.state === "open";
    this._set("tag-v-hose", hoseOn ? "PÅ" : "AV");
    const hoseTag = this.shadowRoot.getElementById("tag-hose");
    if (hoseTag) hoseTag.classList.toggle("on", !!hoseOn);
  }
}

const STYLE = `
  :host { display: block; }
  .photo-card {
    position: relative;
    width: 100%;
    aspect-ratio: 1412 / 1114;
    background-size: cover;
    background-position: center;
    border-radius: 16px;
    overflow: hidden;
    color: #fff;
    font-family: system-ui, -apple-system, sans-serif;
  }
  .topbar {
    position: absolute; top: 0; left: 0; right: 0;
    display: flex; align-items: flex-start; justify-content: space-between;
    padding: 2% 2.5% 0;
  }
  .h1 { font-size: 1.5vw; font-weight: 800; letter-spacing: 0.5px; text-shadow: 0 1px 4px rgba(0,0,0,0.6); }
  .sub { font-size: 0.7vw; opacity: 0.85; letter-spacing: 1px; margin-top: 2px; }
  .weather-now, .mini-stats, .clock-box { background: rgba(8,14,12,0.5); backdrop-filter: blur(3px); border-radius: 10px; padding: 0.5vw 0.9vw; }
  .brand { text-shadow: 0 1px 6px rgba(0,0,0,0.85); }
  .weather-now { display: flex; align-items: center; gap: 0.6vw; font-size: 1.1vw; }
  .w-desc { font-size: 0.65vw; opacity: 0.85; align-self: center; }
  .mini-stats { display: flex; gap: 1.2vw; font-size: 0.75vw; }
  .mini-stats div { display: flex; flex-direction: column; align-items: center; }
  .mini-stats small { opacity: 0.65; font-size: 0.55vw; letter-spacing: 0.5px; }
  .clock-box { text-align: right; }
  .clock { font-size: 1.6vw; font-weight: 700; }
  .clockdate { font-size: 0.65vw; opacity: 0.8; text-transform: capitalize; }

  .panel {
    position: absolute;
    background: rgba(8, 14, 12, 0.68);
    backdrop-filter: blur(3px);
    border-radius: 10px;
    padding: 1% 1.2%;
    font-size: 0.85vw;
    min-width: 15%;
  }
  .panel-title { font-size: 0.6vw; opacity: 0.65; letter-spacing: 1px; margin-bottom: 6px; text-transform: uppercase; }
  .panel .row { display: flex; justify-content: space-between; gap: 10px; padding: 2px 0; }
  .panel .row.small { font-size: 0.7vw; opacity: 0.9; }
  .now, .price, .batt, .energyday { width: 15.5%; min-width: 0; box-sizing: border-box; }
  .now { left: 2%; top: 10%; }
  .price { left: 2%; top: 28%; text-align: center; }
  .price-big { font-size: 1.6vw; font-weight: 700; }
  .price-sub { font-size: 0.55vw; opacity: 0.7; margin-top: 2px; }
  .batt { left: 2%; top: 38%; text-align: center; }
  .gauge { width: 4.6vw; height: 4.6vw; margin: 4px auto; display: block; }
  .energyday { left: 2%; top: 80%; }
  .energy-cols { display: flex; gap: 16px; }
  .energy-cols .lbl { display: block; font-size: 0.6vw; opacity: 0.7; }
  .energy-cols b { font-size: 0.9vw; }

  .forecast { left: 19%; bottom: 9%; width: 32%; }
  .forecast-row { display: flex; justify-content: space-between; gap: 6px; margin-top: 4px; }
  .fday { text-align: center; font-size: 0.65vw; flex: 1; }
  .fday-lbl { opacity: 0.75; }
  .fday-icon { font-size: 1vw; margin: 2px 0; }
  .fday-hi { font-weight: 700; }
  .fday-lo { opacity: 0.7; }
  .fday-rain { opacity: 0.55; font-size: 0.55vw; }

  .wind { right: 21%; bottom: 9%; text-align: center; min-width: 0; }
  .compass { width: 3.6vw; height: 3.6vw; }
  #windArrow { transition: transform 0.6s ease; transform-origin: 50px 50px; }

  .sensors { right: 2%; bottom: 9%; }

  .tag {
    position: absolute;
    background: rgba(8, 14, 12, 0.72);
    border-radius: 8px;
    padding: 0.4% 0.8%;
    font-size: 0.65vw;
    border-left: 3px solid #f0a83c;
    transform: translate(-50%, 0);
  }
  .tag.green { border-left-color: #3ddc84; }
  .tag.blue { border-left-color: #42a5f5; }
  .tag.on { border-left-color: #42a5f5; box-shadow: 0 0 8px rgba(66,165,245,0.5); }
  .tag-lbl { opacity: 0.75; letter-spacing: 0.5px; font-size: 0.55vw; }
  .tag-val { font-weight: 700; font-size: 0.85vw; margin-top: 1px; }

  .navbar {
    position: absolute; left: 2%; bottom: 2%; right: 2%;
    display: flex; gap: 1%;
    background: rgba(20, 40, 30, 0.55);
    border-radius: 10px;
    padding: 0.5%;
  }
  .nav-item { flex: 1; text-align: center; font-size: 0.6vw; padding: 0.4vw; border-radius: 8px; opacity: 0.75; }
  .nav-item.active { background: rgba(61, 220, 132, 0.25); opacity: 1; font-weight: 700; }

  .nav-item.ctl { cursor: pointer; background: rgba(240,168,60,0.18); opacity: 1; font-weight: 700; }
  .tag[data-action] { cursor: pointer; }
  .controls {
    position: absolute; right: 1.2%; top: 12%; width: 24%; max-height: 72%; z-index: 5;
    background: rgba(8, 14, 12, 0.93); backdrop-filter: blur(6px);
    border-radius: 14px; padding: 1% 1.1%; font-size: 0.8vw;
    box-shadow: 0 12px 40px rgba(0,0,0,0.6); overflow: auto; box-sizing: border-box;
  }
  .controls-head { display: flex; justify-content: space-between; align-items: center; font-weight: 800; font-size: 1.1vw; margin-bottom: 0.8vw; }
  .controls-grid { display: grid; grid-template-columns: 1fr; gap: 0.6vw; }
  .controls section { background: rgba(255,255,255,0.05); border-radius: 10px; padding: 0.6vw 0.8vw; }
  .controls h4 { margin: 0 0 0.4vw; font-size: 0.8vw; letter-spacing: 1px; text-transform: uppercase; opacity: 0.7; }
  .cstat { font-weight: 600; margin-bottom: 0.5vw; }
  .clabel { font-size: 0.6vw; opacity: 0.6; margin: 0.4vw 0 0.2vw; text-transform: uppercase; letter-spacing: 1px; }
  .crow { display: flex; flex-wrap: wrap; gap: 0.4vw; margin-bottom: 0.4vw; align-items: center; }
  .cbtn {
    font: inherit; font-size: 0.75vw; color: #fff; cursor: pointer;
    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.18);
    border-radius: 8px; padding: 0.3vw 0.6vw; min-height: 1.8vw;
  }
  .cbtn:hover { background: rgba(255,255,255,0.2); }
  .cbtn.active { background: rgba(61,220,132,0.3); border-color: #3ddc84; font-weight: 700; }
  .cbtn.close { padding: 0.2vw 0.7vw; }
  .ctemp { font-weight: 800; font-size: 1.2vw; min-width: 4vw; text-align: center; }
  @media (max-width: 900px) { .controls { left: 3%; right: 3%; width: auto; top: 8%; bottom: auto; max-height: 80%; } .controls, .cbtn, .controls h4 { font-size: 13px; } .controls-head { font-size: 16px; } .ctemp { font-size: 18px; } .cbtn { min-height: 36px; padding: 6px 12px; } }
  @media (max-width: 700px) {
    .panel, .tag { font-size: 11px; }
    .h1 { font-size: 16px; } .sub { font-size: 9px; }
  }
`;

customElements.define("grankulle-energy-card-v2", GrankulleEnergyCardV2);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "grankulle-energy-card-v2",
  name: "Grankulle Energy Card v2 (photo)",
  description: "Fotobaserad live-dashboard för Grankullevägen 19",
});
