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
  grid_phases: "sensor.kallare_gx_device_elnatsfaser",
  grid_lost_alarm: "sensor.multiplus_ii_48_5000_70_50_id_276_larm_om_forlorat_elnat",
  soc_limit: "sensor.kallare_gx_device_aktiv_soc_grans",
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
  zaptec_session: "sensor.zaptec_laddat_denna_sessionen",
  zaptec_energy_total: "sensor.zaptec_forbrukad_energi",
  zaptec_i1: "sensor.zaptec_strom_fas_1",
  zaptec_i2: "sensor.zaptec_strom_fas_2",
  zaptec_i3: "sensor.zaptec_strom_fas_3",

  tibber_price: "sensor.tibber_pulse_grankullevagen_elpris",
  tibber_consumption: "sensor.tibber_pulse_grankullevagen_ackumulerad_forbrukning",
  tibber_production: "sensor.tibber_pulse_grankullevagen_ackumulerad_produktion",
  tibber_cost: "sensor.tibber_pulse_grankullevagen_ackumulerad_kostnad",
  tibber_reward: "sensor.tibber_pulse_grankullevagen_ackumulerad_beloning",
  solar_yield_total: "sensor.fronius_symo_12_5_3_m_id_20_total_avkastning",
  mp_grid_to_inv: "sensor.multiplus_ii_48_5000_70_50_id_276_energi_fran_ac_in_1_till_vaxelriktare",
  mp_pv_to_inv: "sensor.multiplus_ii_48_5000_70_50_id_276_energi_fran_ut_till_vaxelriktare",
  dc_charge_energy: "sensor.kallare_gx_device_dc_batteri_laddningsenergi",
  dc_discharge_energy: "sensor.kallare_gx_device_dc_batteri_urladdningsenergi",

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
  ev_soc: "sensor.v60_laddningsniva_soc",
  ev_soc_target: "sensor.v60_malladdningsniva",
  ev_charging: "binary_sensor.v60_laddning",
  zaptec_phase_sw: "number.grankullevagen_19_trefas_till_enfas_vaxelstrom",
  zaptec_auto_fas: "input_boolean.zaptec_auto_1_fas",
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
  // power flow as words instead of +/- : pos -> posWord, neg -> negWord, ~0 -> zeroWord
  _flow(n, posWord, negWord, zeroWord, noKw) {
    if (n === null || n === undefined || !isFinite(n)) return "–";
    if (Math.abs(n) < 0.05) return zeroWord;
    return (n > 0 ? posWord : negWord) + (noKw ? "" : " " + Math.abs(n).toFixed(2) + " kW");
  }
  _sgn(n, decimals = 2, suffix = "") {
    if (n === null || n === undefined || !isFinite(n)) return "–";
    const r = Number(n.toFixed(decimals));
    return (r > 0 ? "+" : "") + r.toFixed(decimals) + suffix;
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
          <div class="clock-box">
            <div id="clock" class="clock">--:--</div>
            <div id="clockdate" class="clockdate">–</div>
          </div>
        </div>

        <div class="alarmbanner" id="alarm" style="display:none">
          <div class="al-title" id="al-title">⚠ LARM</div>
          <div class="al-time" id="al-time"></div>
          <div class="al-sub" id="al-sub"></div>
          <div class="al-adv" id="al-adv"></div>
          <div class="al-other" id="al-other"></div>
        </div>

        <div class="panel now">
          <div class="panel-title">Just nu</div>
          <div class="row"><span>☀️ Självförsörjning</span><b id="v-selfsuff">–%</b></div>
          <div class="row"><span>🔆 Solproduktion</span><b id="v-solar">– kW</b></div>
          <div class="row"><span>🏠 Husförbrukning</span><b id="v-house">– kW</b></div>
          <div class="row"><span>🔋 Husbatteri</span><b id="v-batt">–% · – kW</b></div>
          <div class="row"><span>⚡ Nät</span><b id="v-grid">– kW</b></div>
        </div>

        <div class="panel price">
          <div class="panel-title">Elpris just nu</div>
          <div class="price-big" id="v-price">– kr/kWh</div>
          <div class="price-lvl" id="v-price-lvl">–</div>
          <div class="price-sub" id="v-price-sub">Tibber Pulse · Grankullevägen</div>
        </div>

        <div class="panel batt">
          <div class="panel-title">Husbatteri</div>
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
          <div class="panel-title">Dygnet</div>
          <div class="row"><span>☀️ Sol</span><b id="v-day-solar">–</b></div>
          <div class="row"><span>⬇️ Köpt</span><b id="v-day-buy">–</b></div>
          <div class="row"><span>⬆️ Sålt</span><b id="v-day-sell">–</b></div>
          <div class="row"><span>💰 Kostnad</span><b id="v-day-net">–</b></div>
          <div class="row small"><span>Snitt köpt</span><b id="v-day-avg">–</b></div>
          <div class="panel-title" style="margin:6px 0 2px">Energi i batteriet</div>
          <div class="row"><span id="v-bc-kwh">–</span><b id="v-bc-cost">–</b></div>
          <div class="row small"><span>Lagrat värde</span><b id="v-bc-val">–</b></div>
          <div class="row small"><span id="v-bc-est">–</span></div>
        </div>

        <!-- overlay tags positioned over the photo, matching the reference layout -->
        <div class="tag" id="tag-solar" style="left:56%; top:28%;">
          <div class="tag-lbl">SOLPRODUKTION</div><div class="tag-val" id="tag-v-solar">– kW</div>
        </div>
        <div class="tag" id="tag-house" style="left:42%; top:40%;">
          <div class="tag-lbl">HUSFÖRBRUKNING</div><div class="tag-val" id="tag-v-house">– kW</div>
        </div>
        <div class="tag green" id="tag-batt" style="left:39.5%; top:45.5%;">
          <div class="tag-lbl">HUSBATTERI</div><div class="tag-val" id="tag-v-batt">–% · – kW</div>
        </div>
        <div class="tag blue" id="tag-grid" style="left:73%; top:37%;">
          <div class="tag-lbl">NÄT</div><div class="tag-val" id="tag-v-grid">– kW</div>
        </div>
        <div class="carlamp" id="lamp-v60" style="left:28%; top:61.2%;"></div>
        <div class="carlamp" id="lamp-leaf" style="left:58.1%; top:54.6%;"></div>
        <div class="tag green" id="tag-ev" data-action="toggle-controls" style="left:53.5%; top:48.5%; cursor:pointer;">
          <div class="tag-lbl" id="tag-l-ev">LADDBOX</div><div class="tag-val" id="tag-v-ev">– kW</div>
          <div class="tag-sub" id="tag-s1-ev"></div><div class="tag-sub" id="tag-s3-ev" title="Energin i sessionen × Tibbers timpris (som om allt kom från nätet; sol och batteri är inte avdragna)"></div><div class="tag-sub" id="tag-s2-ev"></div>
        </div>
        <div class="tag green" id="tag-v60" style="left:31%; top:66%;">
          <div class="tag-lbl" id="tag-l-v60">V60</div><div class="tag-val" id="tag-v-v60">–</div>
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

        <div class="panel pricechart">
          <div class="pc-head">
            <div class="panel-title" style="margin:0">Elpris framöver · billigt enligt Tibber</div>
          </div>
          <div class="pc-now" id="pc-now">–</div>
          <div class="pc-next" id="pc-next">Hämtar priser…</div>
          <div class="pc-bars" id="pc-bars"></div>
          <div class="pc-tip" id="pc-tip"></div>
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

        <div class="controls" id="controls">
          <div class="controls-head" data-action="toggle-controls"><span>🎛️ Styrning</span><button class="cbtn close" aria-label="Fäll ihop/ut">▾</button></div>
          <div class="controls-grid">
            <section>
              <h4>Zaptec</h4>
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
            <section id="c-v60-sec" style="display:none">
              <h4>V60 · Förvärm</h4>
              <div class="cstat" id="c-v60-status">–</div>
              <div class="crow">
                <button class="cbtn" data-action="v60-heat-on">Starta värme</button>
                <button class="cbtn" data-action="v60-heat-off">Stoppa</button>
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
      else if (a === "v60-heat-on") this._v60Heat(true);
      else if (a === "v60-heat-off") this._v60Heat(false);
      else if (a === "toggle-hose") this._setValve(this._valveIsOn() ? 0 : 30);
    });

    const pcBars = this.shadowRoot.getElementById("pc-bars");
    const pcTip = this.shadowRoot.getElementById("pc-tip");
    const showTip = (ev) => {
      const col = ev.target.closest && ev.target.closest(".pc-col");
      if (!col || !col.dataset.tip) { pcTip.style.display = "none"; return; }
      const pr = pcBars.closest(".pricechart").getBoundingClientRect();
      const cr = col.getBoundingClientRect();
      pcTip.textContent = col.dataset.tip;
      pcTip.style.display = "block";
      const half = pcTip.offsetWidth / 2;
      const x = clamp(cr.left + cr.width / 2 - pr.left, half + 2, pr.width - half - 2);
      pcTip.style.left = x + "px";
      pcTip.style.top = (cr.top - pr.top - 4) + "px";
    };
    pcBars.addEventListener("mouseover", showTip);
    pcBars.addEventListener("mousemove", showTip);
    pcBars.addEventListener("click", showTip);
    pcBars.addEventListener("mouseleave", () => { pcTip.style.display = "none"; });
    this._tickClock();
    setInterval(() => this._tickClock(), 30000);
    this._fetchPrices();
    setInterval(() => this._fetchPrices(), 15 * 60000);
    this._fetchDay();
    setInterval(() => this._fetchDay(), 10 * 60000);
    setTimeout(() => this._fetchSession(), 3000);
    setInterval(() => this._fetchSession(), 2 * 60000);
    setInterval(() => this._renderPrices(), 30000);
    if (window.innerWidth < 900) this._toggleControls();
    this._updateControls();
    setInterval(() => this._updateControls(), 1000);
  }


  // ---------- daily numbers + cost of the energy stored in the battery ----------
  async _fetchDay() {
    if (!this._hass || !this._hass.callWS) return;
    const ws = (q) => this._hass.callWS(Object.assign({ type: "recorder/statistics_during_period" }, q));
    try {
      const mid = new Date(); mid.setHours(0, 0, 0, 0);
      const sid = this._e("solar_yield_total");
      if (sid) {
        const r = await ws({ start_time: mid.toISOString(), end_time: new Date().toISOString(), statistic_ids: [sid], period: "day", types: ["change"] });
        const row = r[sid] && r[sid][r[sid].length - 1];
        this._solarToday = row && row.change != null ? row.change : null;
      }
    } catch (e) { console.warn("grankulle: solar stats failed", e); }
    try {
      const ids = { gin: this._e("mp_grid_to_inv"), pv: this._e("mp_pv_to_inv"), dcc: this._e("dc_charge_energy"), dcd: this._e("dc_discharge_energy"), soc: this._e("battery_soc"), price: this._e("tibber_price") };
      if (Object.values(ids).some((v) => !v)) return;
      const r = await ws({ start_time: new Date(Date.now() - 8 * 86400e3).toISOString(), end_time: new Date().toISOString(), statistic_ids: Object.values(ids), period: "hour", types: ["change", "mean"] });
      const by = {};
      Object.keys(ids).forEach((k) => { by[k] = {}; (r[ids[k]] || []).forEach((p) => { by[k][p.start] = p; }); });
      const times = Object.keys(by.dcc).map(Number).sort((a, b) => a - b);
      if (times.length < 24) return;
      const chg = (k, t) => Math.max(0, (by[k][t] && by[k][t].change) || 0);
      const mean = (k, t) => (by[k][t] && by[k][t].mean != null ? by[k][t].mean : null);
      // capacity (kWh) estimated from net DC energy vs SoC change
      let num = 0, den = 0;
      for (let i = 1; i < times.length; i++) {
        const a = mean("soc", times[i - 1]), b = mean("soc", times[i]);
        if (a == null || b == null) continue;
        const d = (b - a) / 100, net = chg("dcc", times[i]) - chg("dcd", times[i]);
        num += net * d; den += d * d;
      }
      let cap = den > 0 ? num / den : 19;
      if (!(cap > 8 && cap < 40)) cap = 19;
      // average-cost model: grid-charged energy costs the spot price, solar-charged energy costs 0
      let wsum = 0, wc = 0;
      times.forEach((t) => { const e = chg("gin", t), p = mean("price", t); if (p != null && e > 0) { wsum += e * p; wc += e; } });
      let c = wc ? wsum / wc : 1.2;
      const soc0 = mean("soc", times[0]);
      let S = Math.max(0.2, (soc0 != null ? soc0 : 50) / 100 * cap);
      const c0 = c, S0 = S;
      const run = (allGrid) => {
        let cc = c0, SS = S0, lastP = c0;
        times.forEach((t) => {
          let p = mean("price", t); if (p == null) p = lastP; else lastP = p;
          const ec = chg("dcc", t), ed = chg("dcd", t), g = chg("gin", t), pv = chg("pv", t);
          const gs = allGrid ? 1 : (g + pv > 0 ? g / (g + pv) : (ec > 0 ? 1 : 0));
          if (ec > 0) { cc = (SS * cc + ec * gs * p) / (SS + ec); SS += ec; }
          if (ed > 0) SS = Math.max(0.2, SS - ed);
        });
        return cc;
      };
      // c = estimate (split by Multiplus counters), cMax = upper bound (everything grid-charged); lower bound is 0 (everything solar)
      this._battCost = { c: run(false), cMax: run(true), cap };
    } catch (e) { console.warn("grankulle: battery cost failed", e); }
    this._renderDay();
  }
  // Cost of the current Zaptec session at the Tibber price (as if all energy came from the grid; solar/battery are not netted out).
  _sessCostTxt() {
    const c = this._sessCost;
    if (!c || !isFinite(c.cost)) return "";
    return "≈ " + c.cost.toFixed(c.cost < 10 ? 1 : 0) + " kr" + (c.avg != null ? " (" + c.avg.toFixed(2) + " kr/kWh)" : "");
  }
  async _fetchSession() {
    if (!this._hass || !this._hass.callWS) return;
    try {
      const S = this._num("zaptec_session"), eid = this._e("zaptec_energy_total"), pid = this._e("tibber_price");
      const zs = this._st("zaptec_status");
      if (S === null || !eid || !pid || !zs || zs.state === "disconnected") { this._sessCost = null; return; }
      const r = await this._hass.callWS({ type: "recorder/statistics_during_period", start_time: new Date(Date.now() - 36 * 3600e3).toISOString(), end_time: new Date().toISOString(), statistic_ids: [eid, pid], period: "5minute", types: ["change", "state", "mean"] });
      const en = (r[eid] || []).filter((x) => x.change != null), pr = {};
      (r[pid] || []).forEach((x) => { if (x.mean != null) pr[x.start] = x.mean; });
      if (!en.length) return;
      const curE = this._num("zaptec_energy_total"), curP = this._num("tibber_price");
      let lastP = curP != null ? curP : 1;
      let cost = 0, left = S;
      const tail = curE !== null && en[en.length - 1].state != null ? Math.max(0, curE - en[en.length - 1].state) : 0;
      const t0 = Math.min(tail, left); cost += t0 * lastP; left -= t0;
      for (let i = en.length - 1; i >= 0 && left > 0.001; i--) {
        const p = pr[en[i].start] != null ? pr[en[i].start] : lastP; lastP = p;
        const e = Math.min(Math.max(0, en[i].change), left); cost += e * p; left -= e;
      }
      this._sessCost = { cost, avg: S > 0.05 ? cost / S : null, partial: left > 0.3 };
    } catch (e) { console.warn("grankulle: session cost failed", e); }
    this._updateControls();
  }
  _renderDay() {
    const f1 = (v, u) => (v == null || !isFinite(v) ? "–" : v.toFixed(1) + " " + u);
    const kr = (v, d = 0) => (v == null || !isFinite(v) ? "–" : v.toFixed(d) + " kr");
    const buy = this._num("tibber_consumption"), sell = this._num("tibber_production");
    const cost = this._num("tibber_cost"), reward = this._num("tibber_reward");
    this._set("v-day-solar", f1(this._solarToday, "kWh"));
    this._set("v-day-buy", buy == null ? "–" : buy.toFixed(1) + " kWh · " + kr(cost));
    this._set("v-day-sell", sell == null ? "–" : sell.toFixed(1) + " kWh · " + kr(reward));
    this._set("v-day-net", cost == null ? "–" : kr(cost - (reward || 0)));
    this._set("v-day-avg", buy > 0.1 && cost != null ? (cost / buy).toFixed(2) + " kr/kWh" : "–");
    const bc = this._battCost, soc = this._num("battery_soc");
    if (bc && soc != null) {
      const kwh = soc / 100 * bc.cap;
      this._set("v-bc-kwh", kwh.toFixed(1) + " kWh");
      this._set("v-bc-cost", "0–" + bc.cMax.toFixed(2) + " kr/kWh");
      this._set("v-bc-val", "0–" + (kwh * bc.cMax).toFixed(1) + " kr");
      this._set("v-bc-est", "Beräknad (ej mätt): ≈ " + bc.c.toFixed(2) + " kr/kWh");
    }
  }

  // ---------- price plan (Tibber) ----------
  async _fetchPrices() {
    if (!this._hass || !this._hass.callWS) return;
    try {
      const st = new Date(); st.setHours(0, 0, 0, 0);
      const en = new Date(st.getTime() + 49 * 3600e3);
      const f = (d) => d.toISOString().slice(0, 19).replace("T", " ");
      const r = await this._hass.callWS({
        type: "call_service", domain: "tibber", service: "get_prices",
        service_data: { start: f(st), end: f(en) }, return_response: true,
      });
      const home = r && r.response && r.response.prices ? Object.values(r.response.prices)[0] : null;
      if (!home || !home.length) return;
      const hours = {};
      home.forEach((p) => {
        const t = new Date(p.start_time).getTime();
        const k = Math.floor(t / 3600e3);
        (hours[k] = hours[k] || []).push(p.price);
      });
      this._hourly = Object.keys(hours).map(Number).sort((a, b) => a - b).map((k) => ({
        t: k * 3600e3, price: hours[k].reduce((a, b) => a + b, 0) / hours[k].length,
      }));
      this._renderPrices();
    } catch (e) { console.warn("grankulle: tibber get_prices failed", e); this._set("pc-next", "Kunde inte hämta prisdata"); }
  }
  _renderPrices() {
    const bars = this.shadowRoot.getElementById("pc-bars");
    if (!bars || !this._hourly || !this._hourly.length) return;
    const H = this._hourly;
    // Tibber price level: price relative to the average (<60 % very cheap, <90 cheap, <115 normal, <140 expensive, else very expensive).
    // Today uses the Tibber sensor's day average; other days their own average.
    const dayKey = (t) => { const d = new Date(t); return d.getFullYear() * 10000 + d.getMonth() * 100 + d.getDate(); };
    const todayKey = dayKey(Date.now());
    const pst = this._st("tibber_price");
    const sAvg = pst ? parseFloat(pst.attributes && pst.attributes.avg_price) : NaN;
    const byDay = {};
    H.forEach((h) => { (byDay[dayKey(h.t)] = byDay[dayKey(h.t)] || []).push(h); });
    Object.keys(byDay).forEach((k) => {
      const arr = byDay[k];
      let avg = arr.reduce((a, h) => a + h.price, 0) / arr.length;
      if (Number(k) === todayKey && isFinite(sAvg) && sAvg > 0) avg = sAvg;
      arr.forEach((h) => {
        h.ratio = avg > 0 ? h.price / avg : 1;
        h.lvl = h.ratio < 0.6 ? 0 : h.ratio < 0.9 ? 1 : h.ratio < 1.15 ? 2 : h.ratio < 1.4 ? 3 : 4;
        h.cheap = h.lvl <= 1; h.dear = h.lvl >= 3;
      });
    });
    const LVL = ["Mycket billigt", "Billigt", "Normalt", "Dyrt", "Mycket dyrt"];
    const LCOL = ["#1fcf6e", "#3ddc84", "#ffffff", "#f08c3c", "#ff5a4e"];
    const now = Date.now();
    const curK = Math.floor(now / 3600e3) * 3600e3;
    const max = Math.max(...H.map((h) => h.price), 0.01);
    const fmtH = (t) => String(new Date(t).getHours()).padStart(2, "0");
    const dnames = ["sön", "mån", "tis", "ons", "tors", "fre", "lör"];
    let bh = "", ax = "";
    H.forEach((h) => {
      const cls = ["pc-col", "lvl" + h.lvl, h.t < curK ? "past" : "", h.t === curK ? "cur" : ""].join(" ");
      const hp = clamp(Math.max(h.price, 0) / max * 100, 6, 100);
      bh += '<div class="' + cls + '" data-tip="' + dnames[new Date(h.t).getDay()] + " " + fmtH(h.t) + ":00 · " + h.price.toFixed(2) + " kr/kWh · " + LVL[h.lvl] + " (" + Math.round(h.ratio * 100) + ' %)"><div class="pc-bar" style="height:' + hp + '%"></div></div>';
      const hr = new Date(h.t).getHours();
      ax += '<div class="pc-tick' + (hr === 0 ? " day" : "") + '">' + (hr === 0 ? dnames[new Date(h.t).getDay()] : (hr % 3 === 0 ? fmtH(h.t) : "")) + "</div>";
    });
    bars.innerHTML = bh;
    let axis = this.shadowRoot.getElementById("pc-axis");
    if (!axis) { axis = document.createElement("div"); axis.id = "pc-axis"; axis.className = "pc-axis"; bars.parentNode.appendChild(axis); }
    axis.innerHTML = ax;
    // status + upcoming cheap windows
    const cur = H.find((h) => h.t === curK);
    const nowEl = this.shadowRoot.getElementById("pc-now");
    if (cur) {
      nowEl.textContent = LVL[cur.lvl] + " just nu · " + cur.price.toFixed(2) + " kr/kWh · " + Math.round(cur.ratio * 100) + " % av snittet";
      nowEl.style.color = LCOL[cur.lvl];
    } else nowEl.textContent = "–";
    const fut = H.filter((h) => h.t >= curK);
    const wins = [];
    fut.forEach((h) => {
      const last = wins[wins.length - 1];
      if (!h.cheap) return;
      if (last && last.end === h.t) { last.end = h.t + 3600e3; last.sum += h.price; last.n++; }
      else wins.push({ start: h.t, end: h.t + 3600e3, sum: h.price, n: 1 });
    });
    const today0 = new Date(); today0.setHours(0, 0, 0, 0);
    const lbl = (t) => {
      const d = new Date(t); const dd = Math.round((new Date(d).setHours(0, 0, 0, 0) - today0.getTime()) / 86400e3);
      return (dd === 0 ? "" : dd === 1 ? "imorgon " : dnames[d.getDay()] + " ") + fmtH(t);
    };
    let txt;
    if (!wins.length) txt = "Inga billiga timmar kvar i prisdata än (morgondagens priser kommer ca 13:00).";
    else txt = "Billiga timmar: " + wins.slice(0, 3).map((w) => lbl(w.start) + "–" + fmtH(w.end) + " (" + (w.sum / w.n).toFixed(2) + " kr)").join(" · ");
    this._set("pc-next", txt);
  }

  // ---------- controls ----------
  _toggleControls() {
    const el = this.shadowRoot.getElementById("controls");
    if (!el) return;
    el.classList.toggle("collapsed");
    const b = el.querySelector(".controls-head .close");
    if (b) b.textContent = el.classList.contains("collapsed") ? "▸" : "▾";
  }
  _svc(domain, service, key, extra) {
    const id = this._e(key);
    if (!id || !this._hass) return;
    this._hass.callService(domain, service, Object.assign({ entity_id: id }, extra || {}));
  }
  _select(key, option) {
    this._svc("input_select", "select_option", key, { option });
  }
  async _zaptec(on) {
    // pause/resume via installation current limit (0 A = pause, 16 A = resume); stop/resume buttons are unreliable on Zaptec Go 1
    if (!this._hass) return;
    try {
      if (!this._zInst) {
        const devs = await this._hass.callWS({ type: "config/device_registry/list" });
        const d = devs.find((x) => x.model === "Zaptec Installation");
        this._zInst = d && d.id;
      }
      if (this._zInst) this._hass.callService("zaptec", "limit_current", { device_id: this._zInst, available_current: on ? 16 : 0 });
    } catch (e) { console.warn("zaptec limit_current failed", e); }
  }
  _hms(minutes) {
    const h = Math.floor(minutes / 60), m = minutes % 60;
    return String(h).padStart(2, "0") + ":" + String(m).padStart(2, "0") + ":00";
  }
  // The countdown lives in Home Assistant (timer.vattenventil + automations), so the valve
  // closes by itself no matter where it was opened from or whether this browser stays open.
  // Volvo preconditioning buttons (from the official HA "Volvo" integration), auto-discovered by name
  _findVolvoBtn(on) {
    const cfgKey = on ? "v60_heat_on" : "v60_heat_off";
    const ent = (this._config && this._config.entities) || {};
    if (ent[cfgKey]) return ent[cfgKey];
    const h = this._hass; if (!h) return null;
    const re = on ? /(start|starta).*(climat|klimat)|(climat|klimat).*(start|starta)/i : /(stop|stoppa).*(climat|klimat)|(climat|klimat).*(stop|stoppa)/i;
    return Object.keys(h.states).find((k) => k.startsWith("button.") && re.test(k)) || null;
  }
  _v60Heat(on) {
    const id = this._findVolvoBtn(on);
    if (id && this._hass) this._hass.callService("button", "press", { entity_id: id });
  }
  _valveIsOn() {
    const v = this._st("water_valve");
    return !!v && (v.state === "open" || v.state === "opening");
  }
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
    const hv = this.shadowRoot.getElementById("tag-v-hose");
    if (hv) { hv.textContent = minutes === 0 ? "AV" : "PÅ"; }
    const ht = this.shadowRoot.getElementById("tag-hose");
    if (ht) ht.classList.toggle("on", minutes !== 0);
    this._updateControls();
  }
  // Grid "balance": measured over 24 h, a balanced house sits at ~+0.10 kW with ±0.09 kW noise
  // (10-min mean 0.07-0.11 kW). Instant values flip sign ~10x per 10 min, so use a 3-min mean and a band of 0.10 ± 0.15 kW.
  _gridWords(grid, long) {
    const CENTER = 0.10, HALF = 0.15, WIN = 180000;
    const now = Date.now();
    const b = this._gbuf = this._gbuf || [];
    if (!b.length || now - b[b.length - 1].t >= 3000) b.push({ t: now, v: grid });
    while (b.length && now - b[0].t > WIN) b.shift();
    const avg = b.length > 1 && now - b[0].t >= 15000 ? b.reduce((a, x) => a + x.v, 0) / b.length : grid;
    if (Math.abs(avg - CENTER) <= HALF) {
      const live = (grid >= 0 ? "+" : "−") + Math.abs(grid).toFixed(2) + " kW";
      return long ? "Balans · live " + live : "Balans · " + live;
    }
    return this._flow(avg, "Köper", "Säljer", "Balans");
  }

  _markActive(containerId, attr, value) {
    const c = this.shadowRoot.getElementById(containerId);
    if (!c) return;
    c.querySelectorAll(".cbtn").forEach(b => b.classList.toggle("active", b.dataset[attr] === value));
  }
  // Which car is on the Zaptec: 1 active phase = Nissan Leaf, 2+ phases = V60. null when not charging.
  _whichCar() {
    const zs = this._st("zaptec_status");
    if (!zs || zs.state !== "connected_charging") return null;
    const n = ["zaptec_i1", "zaptec_i2", "zaptec_i3"].filter((k) => (this._num(k, 0) || 0) > 3).length;
    if (n === 0) return null;
    return { phases: n, name: n === 1 ? "Nissan Leaf" : "V60", short: n === 1 ? "LEAF" : "V60" };
  }
  _updateControls() {
    const ZSTAT = { connected_charging: "Laddar", connected_finished: "Laddning klar", connected_requesting: "Väntar på start", disconnected: "Ej ansluten" };
    const zs = this._st("zaptec_status");
    const zp = this._num("zaptec_power", 0);
    const car = this._whichCar();
    const evSoc2 = this._num("ev_soc"), evTgt = this._num("ev_soc_target");
    const sessK = this._num("zaptec_session");
    const connected = zs && zs.state !== "disconnected";
    const carTxt = (car ? " · " + car.name + " (" + car.phases + " fas" + (car.phases > 1 ? "er" : "") + ")" : "") + (connected && sessK !== null ? " · " + sessK.toFixed(1) + " kWh denna session" + (this._sessCostTxt() ? " · " + this._sessCostTxt() + " till nätpris" : "") : "");
    const evTxt = carTxt + (evSoc2 !== null && (!car || car.name === "V60") ? " · V60 " + (this._v60stale ? "≈ " : "") + Math.round(evSoc2) + "%" + (this._v60stale ? " (" + this._v60age + " gammal)" : (evTgt !== null ? " → " + Math.round(evTgt) + "%" : "")) : "");
    this._set("c-zaptec-status", zs ? ((ZSTAT[zs.state] || zs.state) + " · " + this._fmt(zp / 1000, 2, " kW") + evTxt) : "–");
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

    const heatOn = this._findVolvoBtn(true);
    const sec = this.shadowRoot.getElementById("c-v60-sec");
    if (sec) sec.style.display = heatOn ? "" : "none";
    if (heatOn) {
      const hb = this._hass.states[heatOn];
      this._set("c-v60-status", hb && hb.state === "unavailable" ? "ej tillgänglig" : "Förvärm kupén");
    }
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
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&wind_speed_unit=ms&timezone=auto&forecast_days=5`;
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

  // Wind from your own weather station (Tempest), converted to m/s. Falls back to Open-Meteo.
  _stationWind() {
    const h = this._hass;
    if (!h) return null;
    const ent = (this._config && this._config.entities) || {};
    const toMs = (st) => {
      if (!st) return null;
      const v = parseFloat(st.state);
      if (!isFinite(v)) return null;
      const u = String((st.attributes && st.attributes.unit_of_measurement) || "").toLowerCase();
      if (u === "km/h" || u === "kph") return v / 3.6;
      if (u === "mph") return v * 0.44704;
      if (u === "kn" || u === "kt" || u === "knots") return v * 0.514444;
      return v;
    };
    const sp = toMs(h.states[ent.weather_wind || "sensor.st_00150138_genomsnittlig_vindhastighet"]);
    if (sp === null) return null;
    const dSt = h.states[ent.weather_wind_dir || "sensor.st_00150138_vindriktning"];
    const dir = dSt ? parseFloat(dSt.state) : NaN;
    return { ms: sp, gust: toMs(h.states[ent.weather_wind_gust || "sensor.st_00150138_vindby"]), dir: isFinite(dir) ? dir : null };
  }
  _applyStationWind() {
    const w = this._stationWind();
    if (!w) return;
    this._set("w-wind", w.ms.toFixed(1) + " m/s");
    this._set("v-windspeed", w.ms.toFixed(1) + " m/s" + (w.gust !== null ? " · by " + w.gust.toFixed(1) : ""));
    if (w.dir !== null) {
      this._set("v-winddir", Math.round(w.dir) + "°");
      const arrow = this.shadowRoot.getElementById("windArrow");
      if (arrow) arrow.setAttribute("transform", `rotate(${w.dir} 50 50)`);
    }
  }

  _renderCurrentWeather() {
    if (!this._forecast || !this._forecast.current) return;
    const c = this._forecast.current;
    const wcode = classifyWeatherCode(c.weather_code);
    this._set("w-icon", WEATHER_ICON[wcode] || "–");
    const descMap = { clear: "Klart", cloudy: "Delvis molnigt", rain: "Regn", snow: "Snöfall", fog: "Dimma" };
    this._set("w-desc", descMap[wcode] || "–");

    if (!this._stationWind()) {
      const dir = c.wind_direction_10m;
      const arrow = this.shadowRoot.getElementById("windArrow");
      if (arrow && typeof dir === "number") arrow.setAttribute("transform", `rotate(${dir} 50 50)`);
      this._set("v-winddir", Math.round(dir) + "°");
      this._set("v-windspeed", this._fmt(c.wind_speed_10m, 1, " m/s"));
      this._set("w-wind", this._fmt(c.wind_speed_10m, 1, " m/s"));
    }
    this._set("v-sens-press", this._fmt(c.surface_pressure, 0, " hPa"));

    // Prefer real weather station values where available; fall back to open-meteo
    if (this._num("weather_humidity") === null) this._set("w-hum", this._fmt(c.relative_humidity_2m, 0, " %"));
  }

  // Victron alarms: grid lost (with battery run-time estimate) and any other active alarm/warning on the Victron devices.
  _updateAlarm() {
    const box = this.shadowRoot.getElementById("alarm");
    if (!box) return;
    const hass = this._hass;
    const now = Date.now();
    // sample the load for a 5 min average
    const houseKw = ((this._num("house_power_l1", 0)) + (this._num("house_power_l2", 0)) + (this._num("house_power_l3", 0))) / 1000;
    const battKw = (this._num("battery_power", 0)) / 1000;
    this._lbuf = (this._lbuf || []).filter((x) => now - x.t < 5 * 60000);
    this._lbuf.push({ t: now, house: houseKw, batt: battKw });
    // other active alarms (throttled)
    if (!this._alarmScan || now - this._alarmScan.t > 10000) {
      const lostId = this._e("grid_lost_alarm");
      const found = [];
      Object.keys(hass.states).forEach((id) => {
        if (id === lostId || !/kallare_gx|multiplus|pylontech|fronius|mppt/i.test(id)) return;
        const d = id.split(".")[0];
        if (d !== "sensor" && d !== "binary_sensor") return;
        const st = hass.states[id];
        const bad = (d === "sensor" && (st.state === "alarm" || st.state === "warning")) || (d === "binary_sensor" && st.attributes.device_class === "problem" && st.state === "on");
        if (bad) found.push((st.attributes.friendly_name || id).replace(/^.*?\)\s*/, "").replace(/^GX Device\s*/, "") + (st.state === "warning" ? " (varning)" : ""));
      });
      this._alarmScan = { t: now, found };
    }
    const lost = this._st("grid_lost_alarm");
    const phases = this._num("grid_phases");
    const gridLost = (lost && lost.state === "alarm") || (phases !== null && phases === 0 && !!lost);
    const others = this._alarmScan.found;
    if (!gridLost && !others.length) { box.style.display = "none"; return; }
    box.style.display = "";
    const hhmm = (d) => d.toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" });
    if (gridLost) {
      this._set("al-title", "⚠ LARM · ELNÄTET ÄR BORTA");
      const since = lost ? new Date(lost.last_changed) : null;
      const soc = this._num("battery_soc"), lim = 0;
      const cap = (this._battCost && this._battCost.cap) || 19;
      const avg = (k) => this._lbuf.reduce((a, x) => a + x[k], 0) / this._lbuf.length;
      const dis = -avg("batt");
      const load = dis > 0.05 ? dis : avg("house");
      let timeTxt = "";
      if (soc === null) timeTxt = "Batteriets nivå okänd";
      else if (avg("batt") > 0.05) timeTxt = "Batteriet laddas just nu";
      else if (soc <= lim) timeTxt = "Batteriet är tomt (0 %)";
      else if (load < 0.05) timeTxt = "Nästan ingen förbrukning";
      else {
        const hrs = ((soc - lim) / 100 * cap) / load;
        const tot = Math.round(hrs * 60), h = Math.floor(tot / 60), m = tot % 60;
        timeTxt = "Batteriet räcker ca " + (h > 0 ? h + " tim " : "") + m + " min";
      }
      this._set("al-time", timeTxt);
      this._set("al-sub", (soc !== null ? "Batteri " + Math.round(soc) + " % → 0 %" : "") + " · drar " + load.toFixed(2) + " kW" + (since ? " · elavbrott sedan " + hhmm(since) : ""));
      this._set("al-adv", "Stäng av alla onödiga förbrukare: varmvattenberedare (VVB), element, luftvärmepump, golvvärme, avfuktare i krypgrund, laddning av bil m.m.");
    } else {
      this._set("al-title", "⚠ VICTRON-LARM");
      this._set("al-time", others[0]);
      this._set("al-sub", "");
      this._set("al-adv", "Kontrollera Victron-anläggningen.");
    }
    this._set("al-other", gridLost && others.length ? "Övriga larm: " + others.join(", ") : (!gridLost && others.length > 1 ? "Övriga larm: " + others.slice(1).join(", ") : ""));
  }

  _update() {
    const hass = this._hass;
    if (!hass) return;
    try { this._updateAlarm(); } catch (e) { console.warn("grankulle: alarm failed", e); }
    this._applyStationWind();

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
    this._set("v-batt", Math.round(battSoc) + "% · " + this._flow(battPower, "Laddar", "Urladdar", "Vilar", true));
    this._set("v-grid", this._gridWords(grid, false));

    this._set("tag-v-solar", this._fmt(solar, 2, " kW"));
    this._set("tag-v-house", this._fmt(house, 2, " kW"));
    this._set("tag-v-batt", Math.round(battSoc) + "% · " + this._flow(battPower, "Laddar", "Urladdar", "Vilar"));
    this._set("tag-v-grid", this._gridWords(grid, true));
    const evSoc = this._num("ev_soc");
    const carNow = this._whichCar();
    const sessKwh = this._num("zaptec_session");
    const zst = this._st("zaptec_status") ? this._st("zaptec_status").state : "";
    this._set("tag-v-ev", this._fmt(zaptec, 2, " kW"));
    this._set("tag-l-ev", carNow ? "LADDBOX · " + carNow.short + " LADDAR" : "LADDBOX");
    const sessTxt = sessKwh !== null ? sessKwh.toFixed(1) + " kWh" : "–";
    const costTxt = this._sessCostTxt();
    this._set("tag-s3-ev", costTxt && zst !== "disconnected" ? "Kostnad " + costTxt : "");
    if (carNow) {
      this._set("tag-s1-ev", sessTxt + " denna session");
      this._set("tag-s2-ev", carNow.phases + (carNow.phases > 1 ? " faser" : " fas") + " · " + (this._num("zaptec_i1", 0) + this._num("zaptec_i2", 0) + this._num("zaptec_i3", 0)).toFixed(0) + " A");
    } else if (zst === "connected_finished") {
      this._set("tag-s1-ev", "Laddning klar · " + sessTxt + " laddat");
      this._set("tag-s2-ev", "Bil ansluten");
    } else if (zst === "connected_requesting") {
      this._set("tag-s1-ev", "Bil ansluten · väntar på start");
      this._set("tag-s2-ev", "");
    } else if (zst === "disconnected") {
      this._set("tag-s1-ev", "Ingen bil ansluten");
      this._set("tag-s2-ev", "");
    } else {
      this._set("tag-s1-ev", "Pausad · " + sessTxt + " laddat");
      this._set("tag-s2-ev", "");
    }
    // pulsing blue light in the windshield of the car that is charging
    const v60Ch = this._st("ev_charging");
    const lampV = this.shadowRoot.getElementById("lamp-v60"), lampL = this.shadowRoot.getElementById("lamp-leaf");
    if (lampV) lampV.classList.toggle("on", carNow ? carNow.short === "V60" : !!(v60Ch && v60Ch.state === "on"));
    if (lampL) lampL.classList.toggle("on", !!(carNow && carNow.short === "LEAF"));
    const evTgt2 = this._num("ev_soc_target");
    const v60 = this.shadowRoot.getElementById("tag-v60");
    if (v60) v60.style.display = evSoc === null ? "none" : "";
    const evCh = this._st("ev_charging");
    const evStObj = this._st("ev_soc");
    const evAgeMs = evStObj && evStObj.last_updated ? Date.now() - Date.parse(evStObj.last_updated) : 0;
    const evStale = evAgeMs > 3 * 3600 * 1000;
    const ageTxt = evAgeMs >= 86400000 ? Math.floor(evAgeMs / 86400000) + " d" : Math.floor(evAgeMs / 3600000) + " h";
    if (v60) v60.style.opacity = evStale ? "0.7" : "";
    this._set("tag-l-v60", evStale ? "V60 · DATA " + ageTxt + " GAMMAL" : "V60" + (evCh && evCh.state === "on" ? " · LADDAR" : ""));
    this._set("tag-v-v60", evSoc === null ? "–" : (evStale ? "≈ " : "") + Math.round(evSoc) + " %" + (!evStale && evTgt2 !== null ? " → " + Math.round(evTgt2) + " %" : ""));
    this._v60stale = evStale; this._v60age = ageTxt;

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
    {
      // Tibber price level (VERY_CHEAP..VERY_EXPENSIVE): price relative to average, Tibber's thresholds 60/90/115/140 %
      const pst = this._st("tibber_price");
      const avg = pst ? parseFloat(pst.attributes && pst.attributes.avg_price) : NaN;
      const lvlEl = this.shadowRoot.getElementById("v-price-lvl");
      if (lvlEl) {
        if (price !== null && isFinite(avg) && avg > 0) {
          const r = price / avg;
          const L = r < 0.6 ? ["Mycket billigt", "#3ddc84"] : r < 0.9 ? ["Billigt", "#8fe36b"] : r < 1.15 ? ["Normalt", "#f0c13c"] : r < 1.4 ? ["Dyrt", "#f08a3c"] : ["Mycket dyrt", "#e2634f"];
          lvlEl.textContent = L[0];
          this._set("v-price-sub", Math.round(r * 100) + " % av snittpriset · Tibber");
          lvlEl.style.color = L[1];
        } else { lvlEl.textContent = "–"; lvlEl.style.color = ""; this._set("v-price-sub", "Tibber Pulse · Grankullevägen"); }
      }
    }

    this._renderDay();

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
    const hoseOn = valveState && (valveState.state === "open" || valveState.state === "opening");
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
    padding: 0.9% 1.5% 0;
  }
  .h1 { font-size: 1.15vw; font-weight: 800; letter-spacing: 0.5px; text-shadow: 0 1px 4px rgba(0,0,0,0.6); }
  .sub { font-size: 0.55vw; opacity: 0.85; letter-spacing: 1px; margin-top: 0; }
  .weather-now, .mini-stats, .clock-box { background: rgba(8,14,12,0.5); backdrop-filter: blur(3px); border-radius: 8px; padding: 0.25vw 0.6vw; }
  .brand { text-shadow: 0 1px 6px rgba(0,0,0,0.85); }
  .weather-now { display: flex; align-items: center; gap: 0.4vw; font-size: 0.9vw; }
  .w-desc { font-size: 0.65vw; opacity: 0.85; align-self: center; }
  .mini-stats { display: flex; gap: 0.9vw; font-size: 0.65vw; }
  .mini-stats div { display: flex; flex-direction: column; align-items: center; }
  .mini-stats small { opacity: 0.65; font-size: 0.48vw; letter-spacing: 0.5px; }
  .clock-box { text-align: right; }
  .clock { font-size: 1.15vw; font-weight: 700; }
  .clockdate { font-size: 0.55vw; opacity: 0.8; text-transform: capitalize; }

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
  .price-lvl { font-size: 0.8vw; font-weight: 800; letter-spacing: 0.5px; margin-top: 2px; text-transform: uppercase; }
  .price-sub { font-size: 0.55vw; opacity: 0.7; margin-top: 2px; }
  .batt { left: 2%; top: 38%; text-align: center; }
  .gauge { width: 4.6vw; height: 4.6vw; margin: 4px auto; display: block; }
  .energyday { left: 2%; top: 62%; width: 14.3%; }
  .energy-cols { display: flex; gap: 16px; }
  .energy-cols .lbl { display: block; font-size: 0.6vw; opacity: 0.7; }
  .energy-cols b { font-size: 0.9vw; }


  .pricechart { left: 20.5%; top: 1.5%; width: 49.5%; box-sizing: border-box; padding: 0.7% 1%; }
  .pc-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.2vw; }
  .pc-share { display: flex; align-items: center; gap: 0.3vw; font-size: 0.6vw; }
  .pc-share .cbtn { min-height: 0; padding: 0 0.45vw; font-size: 0.7vw; }
  .pc-lbl { opacity: 0.65; }
  .pc-now { font-size: max(11px, 0.9vw); font-weight: 800; }
  .pc-next { font-size: max(10px, 0.7vw); opacity: 0.95; margin-bottom: 0.3vw; }
  .pc-bars { display: flex; gap: 1px; align-items: flex-end; height: 3.6vw; }
  .pc-col { cursor: pointer; }
  .pc-col { flex: 1; min-width: 0; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; align-items: stretch; position: relative; }
  .pc-bar { width: 100%; border-radius: 2px 2px 0 0; background: rgba(160,175,190,0.55); }
  .pc-col.lvl0 .pc-bar { background: #1fcf6e; }
  .pc-col.lvl1 .pc-bar { background: #7be3a6; }
  .pc-col.lvl3 .pc-bar { background: rgba(240,140,60,0.85); }
  .pc-col.lvl4 .pc-bar { background: #ff5a4e; }
  .pc-col.past .pc-bar { opacity: 0.32; }
  .pc-col.cur .pc-bar { outline: 1.5px solid #fff; outline-offset: 0; }
  .pc-col.cur::after { content: "▼"; position: absolute; top: -0.2vw; left: 0; right: 0; text-align: center; font-size: 0.45vw; color: #fff; line-height: 1; }
  .pc-axis { display: flex; gap: 1px; margin-top: 3px; }
  .pc-tip { position: absolute; z-index: 20; pointer-events: none; background: rgba(0,0,0,0.88); border: 1px solid rgba(255,255,255,0.35); border-radius: 6px; padding: 3px 8px; font-size: max(11px, 0.8vw); font-weight: 700; white-space: nowrap; transform: translate(-50%, -100%); display: none; }
  .pricechart { overflow: visible; }
  .pc-tick { flex: 1; min-width: 0; font-size: max(10px, 0.72vw); font-weight: 600; opacity: 0.9; text-align: left; white-space: nowrap; overflow: visible; line-height: 1.2; }
  .pc-tick.day { opacity: 1; font-weight: 800; border-left: 1px solid rgba(255,255,255,0.5); padding-left: 2px; }
  .forecast { left: 19%; bottom: 2.5%; width: 32%; }
  .forecast-row { display: flex; justify-content: space-between; gap: 6px; margin-top: 4px; }
  .fday { text-align: center; font-size: 0.65vw; flex: 1; }
  .fday-lbl { opacity: 0.75; }
  .fday-icon { font-size: 1vw; margin: 2px 0; }
  .fday-hi { font-weight: 700; }
  .fday-lo { opacity: 0.7; }
  .fday-rain { opacity: 0.55; font-size: 0.55vw; }

  .wind { right: 21%; bottom: 2.5%; text-align: center; min-width: 0; }
  .compass { width: 3.6vw; height: 3.6vw; }
  #windArrow { transition: transform 0.6s ease; transform-origin: 50px 50px; }

  .sensors { right: 2%; bottom: 2.5%; }

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
  .alarmbanner {
    position: absolute; left: 50%; top: 14%; transform: translateX(-50%); width: 40%; z-index: 20; box-sizing: border-box;
    background: rgba(110, 8, 8, 0.93); border: 2px solid #ff4d4d; border-radius: 12px; padding: 0.7vw 1vw; color: #fff;
    text-align: center; animation: alarmpulse 1.4s ease-in-out infinite;
  }
  @keyframes alarmpulse {
    0%, 100% { box-shadow: 0 0 0.6vw rgba(255, 60, 60, 0.45); }
    50% { box-shadow: 0 0 1.8vw rgba(255, 60, 60, 0.95); }
  }
  .al-title { font-size: 1.15vw; font-weight: 800; letter-spacing: 0.06em; }
  .al-time { font-size: 1.6vw; font-weight: 800; margin-top: 0.25vw; }
  .al-sub { font-size: 0.8vw; opacity: 0.92; margin-top: 0.2vw; }
  .al-adv { font-size: 0.78vw; margin-top: 0.45vw; padding-top: 0.4vw; border-top: 1px solid rgba(255,255,255,0.3); font-weight: 600; }
  .al-other { font-size: 0.72vw; opacity: 0.9; margin-top: 0.3vw; }
  .al-other:empty { display: none; }
  @media (max-width: 900px) { .alarmbanner { width: 94%; padding: 10px 12px; } .al-title { font-size: 15px; } .al-time { font-size: 20px; } .al-sub, .al-adv, .al-other { font-size: 12px; } }
  .tag-sub { font-size: 0.58vw; opacity: 0.85; margin-top: 2px; white-space: nowrap; }
  .tag-sub:empty { display: none; }

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
  .tag { z-index: 6; }
  .carlamp {
    position: absolute; width: 0.6vw; height: 0.6vw; min-width: 6px; min-height: 6px; border-radius: 50%;
    transform: translate(-50%, -50%); pointer-events: none; z-index: 4; display: none;
    background: radial-gradient(circle, #f2feff 0%, #00e0ff 38%, rgba(0,110,255,0) 74%);
    box-shadow: 0 0 0.35vw 0.12vw rgba(0,224,255,0.95), 0 0 0.9vw 0.2vw rgba(0,110,255,0.55);
    animation: lamppulse 1.6s ease-in-out infinite;
  }
  .carlamp.on { display: block; }
  @keyframes lamppulse {
    0%, 100% { opacity: 0.35; transform: translate(-50%, -50%) scale(0.8); }
    50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
  }
  .controls {
    position: absolute; right: 1%; top: 7.5%; width: 27%; max-height: 62%; z-index: 5;
    background: rgba(8, 14, 12, 0.42); backdrop-filter: blur(3px);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 12px; padding: 0.55vw 0.7vw; font-size: max(10px,0.7vw);
    box-shadow: 0 6px 24px rgba(0,0,0,0.35); overflow: auto; box-sizing: border-box;
    transition: background .2s;
  }
  .controls:hover { background: rgba(8, 14, 12, 0.78); }
  .controls.collapsed { width: auto; }
  .controls.collapsed .controls-grid { display: none; }
  .controls.collapsed .controls-head { margin-bottom: 0; gap: 0.8vw; }
  .controls-head { display: flex; justify-content: space-between; align-items: center; font-weight: 800; font-size: max(12px,0.85vw); margin-bottom: 0.4vw; cursor: pointer; }
  .controls-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.4vw; }
  .controls section { background: rgba(255,255,255,0.06); border-radius: 8px; padding: 0.35vw 0.5vw; }
  .controls h4 { margin: 0 0 0.2vw; font-size: max(9px,0.6vw); letter-spacing: 0.8px; text-transform: uppercase; opacity: 0.75; }
  .cstat { font-weight: 600; font-size: max(10.5px,0.68vw); margin-bottom: 0.25vw; }
  .clabel { font-size: max(8.5px,0.5vw); opacity: 0.6; margin: 0.2vw 0 0.1vw; text-transform: uppercase; letter-spacing: 1px; }
  .crow { display: flex; flex-wrap: wrap; gap: 0.25vw; margin-bottom: 0.25vw; align-items: center; }
  .cbtn {
    font: inherit; font-size: max(10px,0.62vw); color: #fff; cursor: pointer;
    background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2);
    border-radius: 6px; padding: 0.2vw 0.4vw; min-height: 1.3vw;
  }
  .cbtn:hover { background: rgba(255,255,255,0.2); }
  .cbtn.active { background: rgba(61,220,132,0.3); border-color: #3ddc84; font-weight: 700; }
  .cbtn.close { padding: 0.05vw 0.4vw; min-height: 0; }
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
