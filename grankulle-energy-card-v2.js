/**
 * Grankulle Energy Card — v2
 * "Photo dashboard": uses a static background photo (your reference image)
 * with real, live Home Assistant data overlaid in styled panels — matching
 * the ChatGPT mockup's look. Trade-off vs v1: the scene itself is a frozen
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
  battery_temp: "sensor.kallare_gx_device_dc_batteri_temperatur",

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
          <div class="row small"><span>Temperatur</span><b id="v-tbatt">– °C</b></div>
        </div>

        <div class="panel energyday">
          <div class="panel-title">Dagens energi</div>
          <div class="energy-cols">
            <div><span class="lbl">☀️ Sol</span><b id="v-day-solar">– kWh</b></div>
            <div><span class="lbl">🏠 Hus</span><b id="v-day-house">– kWh</b></div>
          </div>
        </div>

        <!-- overlay tags positioned over the photo, matching the reference layout -->
        <div class="tag" id="tag-solar" style="left:41%; top:27%;">
          <div class="tag-lbl">SOLPRODUKTION</div><div class="tag-val" id="tag-v-solar">– kW</div>
        </div>
        <div class="tag" id="tag-house" style="left:36%; top:43%;">
          <div class="tag-lbl">HUSFÖRBRUKNING</div><div class="tag-val" id="tag-v-house">– kW</div>
        </div>
        <div class="tag green" id="tag-batt" style="left:59%; top:43%;">
          <div class="tag-lbl">BATTERI</div><div class="tag-val" id="tag-v-batt">–% · – kW</div>
        </div>
        <div class="tag blue" id="tag-grid" style="left:74%; top:43%;">
          <div class="tag-lbl">NÄT</div><div class="tag-val" id="tag-v-grid">– kW</div>
        </div>
        <div class="tag green" id="tag-greenhouse" style="right:2%; top:28%;">
          <div class="tag-lbl">VÄXTHUS</div><div class="tag-val" id="tag-v-greenhouse">–</div>
        </div>
        <div class="tag" id="tag-coop" style="right:2%; top:61%;">
          <div class="tag-lbl">HÖNSHUS</div><div class="tag-val" id="tag-v-coop">–</div>
        </div>
        <div class="tag blue" id="tag-hose" style="right:9%; top:49%; cursor:pointer;">
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

        <div class="navbar">
          <div class="nav-item active">🏠 Översikt</div>
          <div class="nav-item">⚡ Energi</div>
          <div class="nav-item">⛅ Väder</div>
          <div class="nav-item">🌱 Trädgård</div>
          <div class="nav-item">🚗 Bilar</div>
          <div class="nav-item">🔋 Batteri</div>
          <div class="nav-item">⚡ Tibber</div>
          <div class="nav-item">📊 Historik</div>
        </div>
      </div>
    `;

    this.shadowRoot.getElementById("tag-hose").addEventListener("click", () => {
      const id = this._e("water_valve");
      if (!id || !this._hass) return;
      const st = this._hass.states[id];
      const service = st && st.state === "open" ? "close_cover" : "open_cover";
      this._hass.callService("cover", service, { entity_id: id });
    });

    this._tickClock();
    setInterval(() => this._tickClock(), 30000);
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

    const pct = clamp(battSoc, 0, 100);
    const el = this.shadowRoot.getElementById("battRing");
    if (el) el.setAttribute("stroke-dashoffset", String(314 * (1 - pct / 100)));
    this._set("battPct", Math.round(pct) + "%");
    this._set("v-vbatt", this._fmt(battV, 1, " V"));
    this._set("v-ibatt", this._fmt(battI, 1, " A"));
    this._set("v-tbatt", this._fmt(battT, 1, " °C"));

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
    this._set("tag-v-greenhouse",
      ghTemp === null ? "–" : ghTemp.toFixed(1) + " °C" + (ghHum !== null ? " · " + Math.round(ghHum) + "%" : ""));

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
    aspect-ratio: 1402 / 1122;
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
  .now { left: 2%; top: 11%; }
  .price { left: 2%; top: 34%; text-align: center; }
  .price-big { font-size: 1.6vw; font-weight: 700; }
  .price-sub { font-size: 0.55vw; opacity: 0.7; margin-top: 2px; }
  .batt { left: 2%; top: 44%; text-align: center; }
  .gauge { width: 5.5vw; height: 5.5vw; margin: 4px auto; display: block; }
  .energyday { left: 2%; top: 68%; }
  .energy-cols { display: flex; gap: 16px; }
  .energy-cols .lbl { display: block; font-size: 0.6vw; opacity: 0.7; }
  .energy-cols b { font-size: 0.9vw; }

  .forecast { left: 27%; bottom: 2%; width: 34%; }
  .forecast-row { display: flex; justify-content: space-between; gap: 6px; margin-top: 4px; }
  .fday { text-align: center; font-size: 0.65vw; flex: 1; }
  .fday-lbl { opacity: 0.75; }
  .fday-icon { font-size: 1vw; margin: 2px 0; }
  .fday-hi { font-weight: 700; }
  .fday-lo { opacity: 0.7; }
  .fday-rain { opacity: 0.55; font-size: 0.55vw; }

  .wind { right: 20%; bottom: 2%; text-align: center; }
  .compass { width: 4.5vw; height: 4.5vw; }
  #windArrow { transition: transform 0.6s ease; transform-origin: 50px 50px; }

  .sensors { right: 2%; bottom: 2%; }

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
