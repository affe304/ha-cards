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
  mp_state: "sensor.multiplus_ii_48_5000_70_50_id_276_tillstand",
  mp_dc_p: "sensor.multiplus_ii_48_5000_70_50_id_276_dc_effekt",
  mp_dc_v: "sensor.multiplus_ii_48_5000_70_50_id_276_dc_spanning",
  mp_dc_a: "sensor.multiplus_ii_48_5000_70_50_id_276_dc_strom",
  mp_in_p1: "sensor.multiplus_ii_48_5000_70_50_id_276_ingangseffekt_l1",
  mp_out_p1: "sensor.multiplus_ii_48_5000_70_50_id_276_utgangseffekt_l1",
  mp_in_v1: "sensor.multiplus_ii_48_5000_70_50_id_276_ingangsspanning_l1",
  mp_out_a1: "sensor.multiplus_ii_48_5000_70_50_id_276_utgangsstrom_l1",
  mp_out_va1: "sensor.multiplus_ii_48_5000_70_50_id_276_skenbar_utgangseffekt_l1",
  mp_in_p2: "sensor.multiplus_ii_48_5000_70_50_id_276_ingangseffekt_l2",
  mp_out_p2: "sensor.multiplus_ii_48_5000_70_50_id_276_utgangseffekt_l2",
  mp_in_v2: "sensor.multiplus_ii_48_5000_70_50_id_276_ingangsspanning_l2",
  mp_out_a2: "sensor.multiplus_ii_48_5000_70_50_id_276_utgangsstrom_l2",
  mp_out_va2: "sensor.multiplus_ii_48_5000_70_50_id_276_skenbar_utgangseffekt_l2",
  mp_in_p3: "sensor.multiplus_ii_48_5000_70_50_id_276_ingangseffekt_l3",
  mp_out_p3: "sensor.multiplus_ii_48_5000_70_50_id_276_utgangseffekt_l3",
  mp_in_v3: "sensor.multiplus_ii_48_5000_70_50_id_276_ingangsspanning_l3",
  mp_out_a3: "sensor.multiplus_ii_48_5000_70_50_id_276_utgangsstrom_l3",
  mp_out_va3: "sensor.multiplus_ii_48_5000_70_50_id_276_skenbar_utgangseffekt_l3",
  mp_in_f1: "sensor.multiplus_ii_48_5000_70_50_id_276_ingangsfrekvens_l1",
  mp_out_f1: "sensor.multiplus_ii_48_5000_70_50_id_276_utgangsfrekvens_l1",
  mp_u0_in: "sensor.multiplus_ii_48_5000_70_50_id_276_0_linje_1_ingangseffekt",
  mp_u0_out: "sensor.multiplus_ii_48_5000_70_50_id_276_0_linje_1_utgangseffekt",
  mp_u0_inv: "sensor.multiplus_ii_48_5000_70_50_id_276_0_inverterad_effekt",
  mp_u1_in: "sensor.multiplus_ii_48_5000_70_50_id_276_1_linje_1_ingangseffekt",
  mp_u1_out: "sensor.multiplus_ii_48_5000_70_50_id_276_1_linje_1_utgangseffekt",
  mp_u1_inv: "sensor.multiplus_ii_48_5000_70_50_id_276_1_inverterad_effekt",
  mp_u2_in: "sensor.multiplus_ii_48_5000_70_50_id_276_2_linje_1_ingangseffekt",
  mp_u2_out: "sensor.multiplus_ii_48_5000_70_50_id_276_2_linje_1_utgangseffekt",
  mp_u2_inv: "sensor.multiplus_ii_48_5000_70_50_id_276_2_inverterad_effekt",
  mp_e_pass: "sensor.multiplus_ii_48_5000_70_50_id_276_energi_fran_ac_in_1_till_ac_ut",
  mp_e_inv_load: "sensor.multiplus_ii_48_5000_70_50_id_276_energi_fran_vaxelriktare_till_ac_ut",
  mp_e_out_grid: "sensor.multiplus_ii_48_5000_70_50_id_276_energi_fran_ac_ut_till_ac_in_1",
  mp_e_inv_grid: "sensor.multiplus_ii_48_5000_70_50_id_276_energi_fran_vaxelriktare_till_ac_in_1",
  dc_charge_energy: "sensor.kallare_gx_device_dc_batteri_laddningsenergi",
  dc_discharge_energy: "sensor.kallare_gx_device_dc_batteri_urladdningsenergi",

  weather_temp: "sensor.st_00150138_temperatur",
  weather_wind: "sensor.st_00150138_genomsnittlig_vindhastighet",
  weather_gust: "sensor.st_00150138_vindby",
  weather_wind_dir: "sensor.st_00150138_vindriktning",
  weather_pressure: "sensor.st_00150138_lufttryck",
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
  ev_soc: "sensor.volvo_v60_batteri",                          // official Volvo integration (was Tibber: sensor.v60_laddningsniva_soc)
  ev_soc_target: "sensor.volvo_v60_malbatteriets_laddningsniva",
  v60_heat_on: "button.volvo_v60_starta_klimatiseringen",
  v60_heat_off: "button.volvo_v60_stoppa_klimatiseringen",
  ev_charging: "sensor.volvo_v60_laddningsstatus",
  zaptec_phase_sw: "number.grankullevagen_19_trefas_till_enfas_vaxelstrom",
  zaptec_auto_fas: "input_boolean.zaptec_auto_1_fas",
  zaptec_btn_resume: "button.zaptec_ateruppta_laddning",
  zaptec_btn_stop: "button.zaptec_stoppa_laddning",
  zaptec_mode: "input_select.zaptec_ev_mode",
  ess_min_soc: "number.kallare_gx_device_ess_minsta_soc_grans",
  frame_player: "media_player.65_the_frame_tq65ls03fauxxc",   // Samsung The Frame (samsungtv)
  frame_remote: "remote.65_the_frame_tq65ls03fauxxc",
  frame_cast: "media_player.the_frame",                        // same TV as a Cast target (used to show the dashboard)
  ess_min_soc_normal: "input_number.ess_minsta_soc_normal",   // value the minimum SoC returns to when "Ladda fullt" ends (also used by the automations)
  dess_mode_sw: "switch.dynamic_ess_operating_mode_tillstand",   // virtual Node-RED switch: on = Trade, off = Green
  vma_count: "sensor.vma_halland",
  vma_headline: "sensor.vma_halland_rubrik",
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
          <div class="topright">
            <div class="wind-box" title="Vind just nu – klicka för historik" data-action="detail-open" data-tab="vader" style="cursor:pointer">
              <svg viewBox="0 0 100 100" class="compass">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#ffffff55" stroke-width="3"/>
                <text x="50" y="22" text-anchor="middle" font-size="16" fill="#ffffffaa">N</text>
                <g id="windArrow" transform="rotate(0 50 50)">
                  <path d="M50,14 L42,50 L50,42 L58,50 Z" fill="#42a5f5"/>
                </g>
              </svg>
              <div class="wind-txt"><small>VIND</small><b id="v-windspeed">– m/s</b><span><span id="v-winddir">–°</span><span id="v-windgust"></span></span></div>
            </div>
            <div class="clock-box">
              <div id="clock" class="clock">--:--</div>
              <div id="clockdate" class="clockdate">–</div>
            </div>
          </div>
        </div>

        <div class="leftcol">
        <div class="panel now" data-action="detail-open" data-tab="hus">
          <div class="panel-title">Just nu</div>
          <div class="row"><span>☀️ Självförsörjning</span><b id="v-selfsuff">–%</b></div>
          <div class="row"><span>🔆 Solproduktion</span><b id="v-solar">– kW</b></div>
          <div class="row"><span>🏠 Husförbrukning</span><b id="v-house">– kW</b></div>
          <div class="row"><span>🔋 Husbatteri</span><b id="v-batt">–% · – kW</b></div>
          <div class="row"><span>⚡ Nät</span><b id="v-grid">– kW</b></div>
        </div>

        <div class="panel price" data-action="detail-open" data-tab="pris">
          <div class="panel-title">Elpris just nu</div>
          <div class="price-big" id="v-price">– kr/kWh</div>
          <div class="price-lvl" id="v-price-lvl">–</div>
          <div class="price-sub" id="v-price-sub">Tibber Pulse · Grankullevägen</div>
        </div>

        <div class="panel batt" data-action="detail-open" data-tab="batt">
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

        <div class="panel energyday" data-action="detail-open" data-tab="nat">
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
        </div>

        <!-- overlay tags positioned over the photo, matching the reference layout -->
        <div class="tag" id="tag-solar" data-action="detail-open" data-tab="sol" style="left:56%; top:28%;">
          <div class="tag-lbl">SOLPRODUKTION</div><div class="tag-val" id="tag-v-solar">– kW</div>
        </div>
        <div class="tag" id="tag-house" data-action="detail-open" data-tab="hus" style="left:42%; top:40%;">
          <div class="tag-lbl">HUSFÖRBRUKNING</div><div class="tag-val" id="tag-v-house">– kW</div>
        </div>
        <div class="tag green" id="tag-batt" data-action="detail-open" data-tab="batt" style="left:39.5%; top:45.5%;">
          <div class="tag-lbl">HUSBATTERI</div><div class="tag-val" id="tag-v-batt">–% · – kW</div>
        </div>
        <div class="tag blue" id="tag-grid" data-action="detail-open" data-tab="nat" style="left:71.5%; top:46%;">
          <div class="tag-lbl">NÄT</div><div class="tag-val" id="tag-v-grid">– kW</div>
        </div>
        <div class="carlamp" id="lamp-v60" style="left:28%; top:61.2%;"></div>
        <div class="carlamp" id="lamp-leaf" style="left:58.1%; top:54.6%;"></div>
        <div class="tag green" id="tag-ev" data-action="detail-open" data-tab="bil" style="left:53.5%; top:48.5%; cursor:pointer;">
          <div class="tag-lbl" id="tag-l-ev">LADDBOX</div><div class="tag-val" id="tag-v-ev">– kW</div>
          <div class="tag-sub" id="tag-s1-ev"></div><div class="tag-sub" id="tag-s3-ev" title="Bara den del som kom från nätet × Tibbers timpris. Sol och batteri räknas som gratis. Beräknat i 5-minutersteg utifrån husets effektbalans (nät, sol, batteri) – ej mätt per bil."></div><div class="tag-sub" id="tag-s2-ev"></div>
        </div>
        <div class="tag green" id="tag-v60" data-action="detail-open" data-tab="bil" style="left:31%; top:66%;">
          <div class="tag-lbl" id="tag-l-v60">V60</div><div class="tag-val" id="tag-v-v60">–</div>
        </div>
        <div class="tag green" id="tag-greenhouse" style="left:91%; top:27%; display:none;">
          <div class="tag-lbl">VÄXTHUS</div><div class="tag-val" id="tag-v-greenhouse">–</div>
        </div>
        <div class="tag" id="tag-coop" data-action="detail-open" data-tab="vader" style="left:87%; top:58%;">
          <div class="tag-lbl">HÖNSHUS</div><div class="tag-val" id="tag-v-coop">–</div>
        </div>
        <div class="tag blue" id="tag-hose" data-action="toggle-hose" style="left:84%; top:52%; cursor:pointer;">
          <div class="tag-lbl">SLANG</div><div class="tag-val" id="tag-v-hose">–</div>
        </div>

        <div class="topcol">
        <div class="panel warnbanner" id="warnbox" style="display:none">
          <div class="wb-title" id="wb-title"></div>
          <div id="wb-list"></div>
        </div>
        <div class="alarmbanner" id="alarm" style="display:none">
          <div class="al-title" id="al-title">⚠ LARM</div>
          <div class="al-time" id="al-time"></div>
          <div class="al-sub" id="al-sub"></div>
          <div class="al-adv" id="al-adv"></div>
          <div class="al-other" id="al-other"></div>
        </div>
        <div class="panel pricechart">
          <div class="pc-head" data-action="detail-open" data-tab="pris" title="Klicka för detaljer" style="cursor:pointer">
            <div class="panel-title" style="margin:0">Elpris framöver · billigt enligt Tibber</div>
          </div>
          <div class="pc-now" id="pc-now">–</div>
          <div class="pc-next" id="pc-next">Hämtar priser…</div>
          <div class="pc-bars" id="pc-bars"></div>
          <div class="pc-tip" id="pc-tip"></div>
        </div>

        <div class="panel eventlog" id="evpanel">
          <div class="panel-title">Senaste dygnet · händelser</div>
          <div id="ev-list"><div class="ev-d">Hämtar…</div></div>
        </div>
        </div>

        <div class="panel sensors" data-action="detail-open" data-tab="vader" title="Visa väderhistorik">
          <div class="panel-title">Sensorer</div>
          <div class="row small"><span>🌡️ Ute temp</span><b id="v-sens-temp">– °C</b></div>
          <div class="row small"><span>💧 Luftfuktighet</span><b id="v-sens-hum">– %</b></div>
          <div class="row small"><span>🌀 Lufttryck</span><b id="v-sens-press">– hPa</b></div>
          <div class="row small"><span>☀️ UV-index</span><b id="v-sens-uv">–</b></div>
          <div class="row small"><span>🐔 Hönshus</span><b id="v-sens-coop">– °C</b></div>
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
              <div class="v60-head"><svg class="ctl-car" viewBox="0 0 64 28" aria-hidden="true"><path d="M3 20 V15.5 Q3 13.3 5.4 12.8 L15 11 L20 5.6 Q21 4.5 22.8 4.5 H46 Q47.8 4.5 49 5.8 L53 11 L58.6 12.2 Q61 12.8 61 15.4 V20 Z" fill="#e0262e"/><path d="M21.4 6.2 H45.6 L50 11 H17 Z" fill="#cfe9f7" opacity="0.9"/><path d="M33 6.2 V11" stroke="#e0262e" stroke-width="1.6"/><path d="M4 17 H60" stroke="#a81a21" stroke-width="1"/><circle cx="17" cy="20.5" r="5.2" fill="#1c1c1c"/><circle cx="17" cy="20.5" r="2.1" fill="#b9bcc0"/><circle cx="47" cy="20.5" r="5.2" fill="#1c1c1c"/><circle cx="47" cy="20.5" r="2.1" fill="#b9bcc0"/><rect x="57.5" y="13.6" width="3.4" height="2.2" rx="0.8" fill="#ffe9a6"/></svg><div><h4>V60 · Förvärm</h4>
              <div class="cstat" id="c-v60-status">–</div></div></div>
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
            <section id="c-frame-sec">
              <h4>The Frame</h4>
              <div class="cstat" id="c-frame-status">–</div>
              <div class="crow">
                <button class="cbtn" data-action="frame" data-do="art" title="Växla till Art mode">Art mode</button>
                <button class="cbtn" data-action="frame" data-do="off" title="Håll in strömknappen: stänger av helt">Helt av</button>
                <button class="cbtn" data-action="frame" data-do="on">På</button>
                <button class="cbtn" data-action="frame" data-do="dash" title="Visa denna dashboard på TV:n (Cast)">Visa dashboard</button>
                <button class="cbtn" data-action="detail-open" data-tab="frame" title="Alla reglage: volym, källa, fjärrkontroll">Alla reglage ▸</button>
              </div>
            </section>
            <section>
              <h4>Husbatteri</h4>
              <div class="crow"><button class="cbtn" id="c-battfull" data-action="batt-full">–</button></div>
              <div class="clabel" title="Dynamic ESS operating mode">Dynamic ESS</div>
              <div class="crow" id="c-dess">
                <button class="cbtn" data-action="dess-mode" data-mode="trade">Trade</button>
                <button class="cbtn" data-action="dess-mode" data-mode="green">Green</button>
              </div>
            </section>
          </div>
        </div>

      </div>
      <div class="detail" id="detail" style="display:none">
        <div class="d-box">
          <div class="d-head"><div class="d-tabs" id="d-tabs"></div><div class="d-range" id="d-range"></div><button class="d-close" data-action="detail-close" aria-label="Stäng">✕</button></div>
          <div class="d-body" id="d-body"></div>
        </div>
      </div>
    `;

    this.shadowRoot.addEventListener("click", (ev) => {
      if (ev.target.id === "detail") { this._closeDetail(); return; }
      const t = ev.target.closest("[data-action]");
      if (!t) { return; }
      const a = t.dataset.action;
      if (a === "detail-open") this._openDetail(t.dataset.tab);
      else if (a === "detail-tab") { this._dTab = t.dataset.tab; this._renderDetail(); if (this._dTab === "plan") this._loadPlan(); }
      else if (a === "detail-range") { this._dRange = t.dataset.range; this._renderDetail(); this._loadDetail(); }
      else if (a === "detail-close") this._closeDetail();
      else if (a === "toggle-controls") this._toggleControls();
      else if (a === "zaptec-on") this._zaptec(true);
      else if (a === "zaptec-off") this._zaptec(false);
      else if (a === "toggle-shelly1") this._svc("switch", "toggle", "shelly1");
      else if (a === "toggle-shelly2") this._svc("switch", "toggle", "shelly2");
      else if (a === "mode-zaptec") this._select("zaptec_mode", t.dataset.mode);
      else if (a === "mode-1fas") this._select("ev_1fas_mode", t.dataset.mode);
      else if (a === "valve") this._setValve(parseInt(t.dataset.minutes, 10));
      else if (a === "v60-heat-on") this._v60Heat(true);
      else if (a === "v60-heat-off") this._v60Heat(false);
      else if (a === "batt-full") this._battFull();
      else if (a === "frame") this._frame(t.dataset.do);
      else if (a === "frame-key") this._frameKey(t.dataset.key, t.dataset.hold);
      else if (a === "frame-src") { this._svc("media_player", "select_source", "frame_player", { source: t.dataset.src }); this._frameRefresh(); }
      else if (a === "frame-vol") this._svc("remote", "send_command", "frame_remote", { command: [t.dataset.d === "up" ? "KEY_VOLUP" : "KEY_VOLDOWN"], num_repeats: parseInt(t.dataset.n || "1", 10), delay_secs: 0.15 });
      else if (a === "frame-mute") this._frameKey("KEY_MUTE");
      else if (a === "frame-media") { this._svc("media_player", t.dataset.do, "frame_player"); this._frameRefresh(); }
      else if (a === "dess-mode") this._svc("switch", t.dataset.mode === "trade" ? "turn_on" : "turn_off", "dess_mode_sw");
      else if (a === "toggle-hose") this._setValve(this._valveIsOn() ? 0 : 30);
    });

    // back to the main view 30 s after the last touch/mouse/scroll/key in the detail window
    const detEl = this.shadowRoot.getElementById("detail");
    if (detEl) ["pointerdown", "pointermove", "touchstart", "touchmove", "wheel", "scroll", "keydown", "click"].forEach((n) => detEl.addEventListener(n, () => this._idleReset(), { capture: true, passive: true }));

    if (!window.__grankulleAct) {
      window.__grankulleAct = Date.now();
      ["pointerdown", "keydown", "touchstart", "wheel"].forEach((n) => document.addEventListener(n, () => { window.__grankulleAct = Date.now(); }, { capture: true, passive: true }));
      document.addEventListener("visibilitychange", () => { if (!document.hidden && window.__grankulleCard) window.__grankulleCard._dayCheck(); });
    }
    if (!window.__grankulleEsc) { window.__grankulleEsc = true; document.addEventListener("keydown", (e) => { if (e.key === "Escape" && window.__grankulleCard) window.__grankulleCard._closeDetail(); }); }
    window.__grankulleCard = this;
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
    setTimeout(() => this._fetchWarnings(), 2500);
    setInterval(() => this._fetchWarnings(), 10 * 60000);
    setInterval(() => this._renderWarnings(), 30000);
    setTimeout(() => this._fetchEvents(), 4000);
    setInterval(() => this._fetchEvents(), 5 * 60000);
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
  // Session / event charging cost = grid share of each 5-min bucket x Tibber price (solar and battery energy counted as free).
  // ---------- weather warnings (SMHI open data) + VMA (via optional HA sensors) ----------
  async _fetchWarnings() {
    try {
      const r = await fetch("https://opendata-download-warnings.smhi.se/ibww/api/version/1/warning.json");
      if (!r.ok) throw new Error("HTTP " + r.status);
      const j = await r.json();
      const rank = { RED: 4, ORANGE: 3, YELLOW: 2, MESSAGE: 1 };
      const out = [];
      j.forEach((ev) => (ev.warningAreas || []).forEach((a) => {
        const aff = (a.affectedAreas || []).map((x) => x.sv || "").join("|");
        const name = (a.areaName && a.areaName.sv) || "";
        // Onsala: Hallands län, Hallandskusten and Kattegatt
        if (!/Hallands län|Hallandskusten|Kattegatt/i.test(aff + "|" + name)) return;
        const lvl = (a.warningLevel && a.warningLevel.code) || "MESSAGE";
        const desc = (a.descriptions || []).map((d) => ((d.title && d.title.sv) || "") + ": " + ((d.text && d.text.sv) || "")).join("\n");
        out.push({ id: ev.id + "-" + a.id, lvl, rank: rank[lvl] || 0, event: (a.eventDescription && a.eventDescription.sv) || (ev.event && ev.event.sv) || "Varning", area: name.replace(/\.$/, ""), start: Date.parse(a.approximateStart), end: a.approximateEnd ? Date.parse(a.approximateEnd) : null, desc });
      }));
      out.sort((a, b) => b.rank - a.rank || a.start - b.start);
      this._warns = out;
    } catch (e) { console.warn("grankulle: SMHI warnings failed", e); }
    this._renderWarnings();
  }
  _renderWarnings() {
    const box = this.shadowRoot.getElementById("warnbox");
    if (!box) return;
    const now = Date.now();
    const list = (this._warns || []).filter((w) => !w.end || w.end > now);
    const vc = this._num("vma_count", 0), vh = this._st("vma_headline");
    const vma = vc > 0 ? (vh && vh.state && vh.state !== "unknown" && vh.state !== "unavailable" ? vh.state : "Viktigt meddelande till allmänheten (VMA) är utfärdat") : null;
    if (!list.length && !vma) { box.style.display = "none"; return; }
    const lvlName = { RED: "Röd varning", ORANGE: "Orange varning", YELLOW: "Gul varning", MESSAGE: "Meddelande" };
    const top = vma ? "RED" : list[0].lvl;
    box.className = "panel warnbanner lv-" + top.toLowerCase();
    box.style.display = "";
    this._set("wb-title", (vma ? "🚨 VMA · " : "⚠ ") + (vma ? "Viktigt meddelande" : lvlName[top] + (list.length > 1 ? " · " + list.length + " st" : "")) + " · Onsala/Halland");
    const t = (w) => {
      if (w.start > now) return "från " + this._dayHm(w.start) + (w.end ? " till " + this._dayHm(w.end) : "");
      return w.end ? "till " + this._dayHm(w.end) : "pågår";
    };
    const dot = { RED: "🟥", ORANGE: "🟧", YELLOW: "🟨", MESSAGE: "🟦" };
    const esc = (x) => String(x).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
    this.shadowRoot.getElementById("wb-list").innerHTML = (vma ? '<div class="wb-row"><span class="wb-vma">' + esc(vma) + "</span></div>" : "") + list.map((w) => '<div class="wb-row" title="' + esc(w.desc) + '"><span>' + dot[w.lvl] + "</span><b>" + esc(w.event) + "</b><span>" + esc(w.area) + '</span><span class="wb-t">' + t(w) + "</span></div>").join("");
  }
  // ---------- event list: what happened in the last 24 h ----------
  async _fetchEvents() {
    if (!this._hass || !this._hass.callWS) return;
    try {
      const now = Date.now(), t0 = now - 24 * 3600e3, B = 5 * 60000;
      const sid = (k) => this._e(k);
      const hIds = [sid("grid_lost_alarm"), sid("zaptec_status")].filter(Boolean);
      const sIds = ["battery_soc", "dc_discharge_energy", "zaptec_energy_total", "tibber_price", "zaptec_i1", "zaptec_i2", "zaptec_i3", "grid_power_l1", "grid_power_l2", "grid_power_l3", "house_power_l1", "house_power_l2", "house_power_l3", "fronius_power", "battery_power"].map(sid).filter(Boolean);
      const hist = await this._hass.callWS({ type: "history/history_during_period", start_time: new Date(t0 - 3600e3).toISOString(), end_time: new Date(now).toISOString(), entity_ids: hIds, minimal_response: true, no_attributes: true, significant_changes_only: false });
      const st = await this._hass.callWS({ type: "recorder/statistics_during_period", start_time: new Date(t0 - 3600e3).toISOString(), end_time: new Date(now).toISOString(), statistic_ids: sIds, period: "5minute", types: ["change", "mean"] });
      const rows = (k) => (st[sid(k)] || []).map((r) => ({ t: typeof r.start === "number" ? r.start : Date.parse(r.start), change: r.change, mean: r.mean }));
      const intervals = (id, pred) => {
        const rs = (hist[id] || []).map((x) => { const v = x.lu || x.lc || x.last_updated || x.last_changed; return { t: typeof v === "number" ? v * 1000 : Date.parse(v), s: x.s !== undefined ? x.s : x.state }; });
        const out = []; let cur = null;
        rs.forEach((r) => { const on = pred(r.s); if (on && !cur) cur = { s: r.t, e: null }; if (!on && cur) { cur.e = r.t; out.push(cur); cur = null; } });
        if (cur) out.push(cur);
        return out;
      };
      const inR = (arr, s, e) => arr.filter((r) => r.t >= Math.floor(s / B) * B - B && r.t <= (e || now));
      const soc = rows("battery_soc"), dcd = rows("dc_discharge_energy"), en = rows("zaptec_energy_total"), pr = rows("tibber_price");
      const cur = [rows("zaptec_i1"), rows("zaptec_i2"), rows("zaptec_i3")];
      const mix = this._mixFn(st);
      const near = (arr, t) => { let best = null; arr.forEach((r) => { if (r.mean != null && r.t <= t + B && (!best || r.t > best.t)) best = r; }); return best ? best.mean : null; };
      const ev = [];
      const lostId = sid("grid_lost_alarm");
      if (lostId) intervals(lostId, (s) => s === "alarm").forEach((iv) => {
        if (iv.e !== null && iv.e < t0) return;
        const end = iv.e || now;
        const dis = inR(dcd, iv.s, iv.e).reduce((a, r) => a + Math.max(0, r.change || 0), 0);
        const socA = near(soc, iv.s), socB = near(soc, end);
        const socs = inR(soc, iv.s, iv.e).map((r) => r.mean).filter((v) => v != null);
        const lows = socs.length ? Math.min.apply(null, socs) : null;
        const hrs = (end - iv.s) / 3600e3;
        const parts = [];
        if (socA != null && socB != null) parts.push("Batteri " + Math.round(socA) + " % → " + Math.round(socB) + " %");
        if (dis > 0.05) parts.push(dis.toFixed(1) + " kWh ur batteriet");
        if (dis > 0.05 && hrs > 0.1) parts.push("snitt " + (dis / hrs).toFixed(2) + " kW");
        if (lows != null) parts.push("lägst " + Math.round(lows) + " %");
        ev.push({ t: iv.s, sev: "red", icon: "⚡", title: iv.e ? "Elavbrott " + this._evT(iv.s) + "–" + this._evT(iv.e, iv.s) + " (" + this._evDur(end - iv.s) + ")" : "Elavbrott pågår sedan " + this._evT(iv.s) + " (" + this._evDur(end - iv.s) + ")", detail: parts.join(" · ") });
      });
      const zId = sid("zaptec_status");
      if (zId) {
        const raw = intervals(zId, (s) => s === "connected_charging").map((iv) => ({ s: iv.s, e: iv.e }));
        const merged = [];
        raw.forEach((iv) => {
          const last = merged[merged.length - 1];
          if (last && last.e !== null && iv.s - last.e < 20 * 60000) last.e = iv.e; else merged.push({ s: iv.s, e: iv.e });
        });
        merged.forEach((iv) => {
          if (iv.e !== null && iv.e < t0) return;
          const bs = inR(en, iv.s, iv.e);
          const kwh = bs.reduce((a, r) => a + Math.max(0, r.change || 0), 0);
          let lastP = 1, cost = 0, gridK = 0;
          bs.forEach((r) => { const p = near(pr, r.t); if (p != null) lastP = p; const k = Math.max(0, r.change || 0), sh = mix(r.t), f = sh == null ? 1 : sh; cost += k * f * lastP; gridK += k * f; });
          const nph = cur.filter((c) => Math.max.apply(null, [0].concat(inR(c, iv.s, iv.e).map((r) => r.mean || 0))) > 4).length;
          let kwhS = kwh, costS = cost, pctS = kwh > 0 ? (gridK / kwh) * 100 : null;
          // ongoing session: the live session counter is ahead of the 5-min statistics, so use the session figures
          const sc = this._sessCost, sNow = this._num("zaptec_session");
          if (iv.e === null && sc && isFinite(sc.cost) && sNow !== null && sNow > kwh) { kwhS = sNow; costS = sc.cost; pctS = sc.gridPct; }
          if (kwh < 0.15 && iv.e !== null) return;
          const car = nph === 1 ? "Nissan Leaf" : nph >= 2 ? "V60" : "Bil";
          ev.push({ t: iv.s, sev: "green", icon: "🔌", title: "Laddning " + car + " " + this._evT(iv.s) + (iv.e ? "–" + this._evT(iv.e, iv.s) : " · pågår"), detail: kwhS.toFixed(1) + " kWh · " + (pctS != null && kwhS > 0 ? Math.round(pctS) + " % från nätet · " : "") + "≈ " + costS.toFixed(costS < 10 ? 1 : 0) + " kr" + (nph ? " · " + nph + (nph > 1 ? " faser" : " fas") : "") });
        });
      }
      ev.sort((a, b) => b.t - a.t);
      this._events = ev.slice(0, 8);
    } catch (e) { console.warn("grankulle: events failed", e); }
    this._renderEvents();
  }
  _evT(t, ref) {
    const d = new Date(t), today = new Date(); today.setHours(0, 0, 0, 0);
    const hm = d.toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" });
    const dd = new Date(t); dd.setHours(0, 0, 0, 0);
    if (ref !== undefined) { const rd = new Date(ref); rd.setHours(0, 0, 0, 0); return dd.getTime() === rd.getTime() ? hm : "nästa dag " + hm; }
    if (dd.getTime() === today.getTime()) return "i dag " + hm;
    if (dd.getTime() === today.getTime() - 86400e3) return "igår " + hm;
    return hm;
  }
  _evDur(ms) {
    const m = Math.max(0, Math.round(ms / 60000)), h = Math.floor(m / 60);
    return h > 0 ? h + " tim " + (m % 60) + " min" : m + " min";
  }
  _renderEvents() {
    const box = this.shadowRoot.getElementById("ev-list");
    if (!box) return;
    const ev = this._events || [];
    box.innerHTML = ev.length ? ev.map((e) => '<div class="ev ev-' + e.sev + '"><div class="ev-t">' + e.icon + " " + e.title + '</div><div class="ev-d">' + e.detail + "</div></div>").join("") : '<div class="ev-d">Inga händelser det senaste dygnet</div>';
  }
  // ---------- detail view: click a tile on the photo to open tabs with the data behind it ----------
  _detailTabs() {
    return [
      { k: "sol", t: "☀️ Sol" }, { k: "hus", t: "🏠 Hus" }, { k: "batt", t: "🔋 Batteri" },
      { k: "nat", t: "⚡ Nät" }, { k: "bil", t: "🚗 Bil" }, { k: "pris", t: "💰 Elpris" }, { k: "plan", t: "🗓 Plan" }, { k: "vader", t: "🌬️ Väder" }, { k: "mp", t: "🔌 Multiplus" },
    ].concat(this._st("frame_player") ? [{ k: "frame", t: "📺 The Frame" }] : []);
  }
  _openDetail(tab) {
    this._dTab = tab || this._dTab || "sol";
    this._dRange = this._dRange || "24h";
    const o = this.shadowRoot.getElementById("detail");
    if (!o) return;
    o.style.display = "flex";
    this._idleReset();
    this._renderDetail();
    this._loadDetail();
    if (this._dTab === "plan") this._loadPlan();
    clearInterval(this._dTimer);
    this._dTimer = setInterval(() => { this._renderDetail(); }, 15000);
    clearInterval(this._dLoad);
    this._dLoad = setInterval(() => { this._loadDetail(); if (this._dTab === "plan") this._loadPlan(); }, 90000);
  }
  _idleReset() {
    clearTimeout(this._dIdle);
    const o = this.shadowRoot && this.shadowRoot.getElementById("detail");
    if (!o || o.style.display === "none") return;
    this._dIdle = setTimeout(() => this._closeDetail(), this._idleMs || 30000);
  }
  _closeDetail() {
    const o = this.shadowRoot.getElementById("detail");
    if (o) o.style.display = "none";
    clearInterval(this._dTimer); clearInterval(this._dLoad); clearTimeout(this._dIdle);
  }
  async _loadDetail() {
    if (!this._hass || !this._hass.callWS) return;
    const range = this._dRange || "24h";
    const now = Date.now();
    const c = this._dCache = this._dCache || {};
    if (c[range] && now - c[range].at < 60000) { this._dData = c[range].d; this._renderDetail(); return; }
    try {
      const span = range === "24h" ? 24 * 3600e3 : 7 * 24 * 3600e3, per = range === "24h" ? "5minute" : "hour";
      const keys = ["fronius_power", "house_power_l1", "house_power_l2", "house_power_l3", "grid_power_l1", "grid_power_l2", "grid_power_l3", "battery_power", "battery_soc", "zaptec_power", "tibber_price", "dc_charge_energy", "dc_discharge_energy", "mp_dc_p", "mp_in_p1", "mp_in_p2", "mp_in_p3", "mp_out_p1", "mp_out_p2", "mp_out_p3", "weather_temp", "coop_temp", "weather_wind", "weather_gust", "weather_wind_dir", "weather_pressure"];
      const ids = keys.map((k) => this._e(k)).filter(Boolean);
      const st = await this._hass.callWS({ type: "recorder/statistics_during_period", start_time: new Date(now - span).toISOString(), end_time: new Date(now).toISOString(), statistic_ids: ids, period: per, types: ["mean", "change", "max"] });
      const wu = this._st("weather_wind"), wunit = wu && wu.attributes ? String(wu.attributes.unit_of_measurement || "") : "";
      const windF = /km/i.test(wunit) ? 1 / 3.6 : /mph/i.test(wunit) ? 0.44704 : /kn/i.test(wunit) ? 0.5144 : 1;
      const rows = (k, f, field) => ((st[this._e(k)] || []).map((r) => ({ t: typeof r.start === "number" ? r.start : Date.parse(r.start), v: r[field || "mean"] == null ? null : r[field || "mean"] * (f || 1) })));
      const sum = (ks, f) => {
        const m = {};
        ks.forEach((k) => rows(k, f).forEach((r) => { if (r.v != null) m[r.t] = (m[r.t] || 0) + r.v; }));
        return Object.keys(m).map(Number).sort((a, b) => a - b).map((t) => ({ t, v: m[t] }));
      };
      const house3 = sum(["house_power_l1", "house_power_l2", "house_power_l3"], 0.001);
      const car = rows("zaptec_power", 0.001).filter((r) => r.v != null);
      const carM = {}; car.forEach((r) => { carM[r.t] = r.v; });
      const hus = house3.map((r) => ({ t: r.t, v: Math.max(0, r.v - (carM[r.t] || 0)) }));
      const d = {
        range, at: now, dt: per === "5minute" ? 1 / 12 : 1, span,
        sol: rows("fronius_power", 0.001).filter((r) => r.v != null), hus, car, house: house3,
        grid: sum(["grid_power_l1", "grid_power_l2", "grid_power_l3"], 0.001),
        batt: rows("battery_power", 0.001).filter((r) => r.v != null),
        soc: rows("battery_soc").filter((r) => r.v != null),
        price: rows("tibber_price").filter((r) => r.v != null),
        mpin: sum(["mp_in_p1", "mp_in_p2", "mp_in_p3"], 0.001), mpout: sum(["mp_out_p1", "mp_out_p2", "mp_out_p3"], 0.001),
        mpo1: rows("mp_out_p1", 0.001).filter((r) => r.v != null), mpo2: rows("mp_out_p2", 0.001).filter((r) => r.v != null), mpo3: rows("mp_out_p3", 0.001).filter((r) => r.v != null),
        mpdc: rows("mp_dc_p", 0.001).filter((r) => r.v != null),
        wtemp: rows("weather_temp").filter((r) => r.v != null), wcoop: rows("coop_temp").filter((r) => r.v != null),
        wwind: rows("weather_wind", windF).filter((r) => r.v != null), wgust: rows("weather_gust", windF).filter((r) => r.v != null),
        wgustMax: rows("weather_gust", windF, "max").filter((r) => r.v != null),
        wdir: rows("weather_wind_dir").filter((r) => r.v != null), wpres: rows("weather_pressure").filter((r) => r.v != null),
        chg: rows("dc_charge_energy", 1, "change").reduce((a, r) => a + Math.max(0, r.v || 0), 0),
        dis: rows("dc_discharge_energy", 1, "change").reduce((a, r) => a + Math.max(0, r.v || 0), 0),
      };
      c[range] = { at: now, d };
      this._dData = d;
    } catch (e) { console.warn("grankulle: detail data failed", e); this._dData = { range, error: true }; }
    this._renderDetail();
  }
  // ----- small helpers for the detail view
  _kwh(a, dt, f) { return a.reduce((s, r) => s + (f ? f(r.v) : r.v) * dt, 0); }
  _peak(a) { let b = null; a.forEach((r) => { if (r.v != null && (!b || r.v > b.v)) b = r; }); return b; }
  _hm(t) { return new Date(t).toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" }); }
  _dayHm(t) {
    const d = new Date(t), td = new Date(); td.setHours(0, 0, 0, 0);
    const dd = new Date(t); dd.setHours(0, 0, 0, 0);
    const diff = Math.round((dd - td) / 86400e3);
    return (diff === 0 ? "i dag " : diff === -1 ? "igår " : diff === 1 ? "i morgon " : d.toLocaleDateString("sv-SE", { weekday: "short", day: "numeric" }) + " ") + this._hm(t);
  }
  _n(x, d = 1) { return x == null || !isFinite(x) ? "–" : x.toFixed(d); }
  _tile(label, value, sub, cls) {
    return '<div class="d-tile' + (cls ? " " + cls : "") + '"><div class="d-tl">' + label + '</div><div class="d-tv">' + value + '</div>' + (sub ? '<div class="d-ts">' + sub + "</div>" : "") + "</div>";
  }
  _hrs(h) {
    if (h == null || !isFinite(h) || h < 0) return "–";
    const m = Math.round(h * 60);
    return m >= 60 ? Math.floor(m / 60) + " tim " + (m % 60) + " min" : m + " min";
  }
  _niceTicks(lo, hi) {
    const raw = (hi - lo) / 4 || 1, p = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / p;
    const step = (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p, out = [];
    for (let v = Math.ceil(lo / step) * step; v <= hi + step * 1e-6; v += step) out.push(Math.abs(v) < step * 1e-6 ? 0 : v);
    return out;
  }
  // series: [{name, color, pts:[{t,v}], area, step, split:[posColor,negColor], dash}], o: {unit, d, min, max, t0, t1, h}
  _dChart(title, series, o = {}) {
    const W = 860, H = o.h || 220, L = 46, R = 12, T = 10, B = 24;
    const span = this._dData && this._dData.span ? this._dData.span : 24 * 3600e3;
    const t1 = o.t1 || Date.now(), t0 = o.t0 || t1 - span;
    const pts = [].concat.apply([], series.map((s) => s.pts.filter((p) => p.v != null && p.t >= t0 && p.t <= t1)));
    if (!pts.length) return '<div class="d-chart-wrap"><div class="d-ct">' + title + '</div><div class="d-empty">Ingen data för perioden</div></div>';
    let lo = o.min != null ? o.min : Math.min(0, Math.min.apply(null, pts.map((p) => p.v)));
    let hi = o.max != null ? o.max : Math.max.apply(null, pts.map((p) => p.v));
    if (hi <= lo) hi = lo + 1;
    if (o.max == null) hi += (hi - lo) * 0.08;
    const X = (t) => L + ((t - t0) / (t1 - t0)) * (W - L - R), Y = (v) => T + ((hi - v) / (hi - lo)) * (H - T - B);
    const y0 = Y(Math.min(Math.max(0, lo), hi));
    const id = "dc" + (this._dN = (this._dN || 0) + 1);
    let g = "";
    this._niceTicks(lo, hi).forEach((v) => { g += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(v).toFixed(1) + '" y2="' + Y(v).toFixed(1) + '" class="d-grid"/><text x="' + (L - 6) + '" y="' + (Y(v) + 3).toFixed(1) + '" class="d-ax" text-anchor="end">' + (o.axfmt ? o.axfmt(v) : (Math.abs(v) >= 10 ? v.toFixed(0) : v.toFixed(1).replace(/\.0$/, ""))) + "</text>"; });
    const span2 = t1 - t0, stepH = span2 <= 30 * 3600e3 ? 3 : span2 <= 60 * 3600e3 ? 6 : 24;
    const dd = new Date(t0); dd.setMinutes(0, 0, 0);
    while (dd.getTime() < t0 || dd.getHours() % stepH !== 0) dd.setHours(dd.getHours() + 1);
    for (let t = dd.getTime(); t <= t1; dd.setHours(dd.getHours() + stepH), t = dd.getTime()) {
      const lab = stepH < 24 ? String(new Date(t).getHours()).padStart(2, "0") : new Date(t).toLocaleDateString("sv-SE", { weekday: "short", day: "numeric" });
      g += '<line x1="' + X(t).toFixed(1) + '" x2="' + X(t).toFixed(1) + '" y1="' + T + '" y2="' + (H - B) + '" class="d-grid v"/><text x="' + X(t).toFixed(1) + '" y="' + (H - 7) + '" class="d-ax" text-anchor="middle">' + lab + "</text>";
    }
    if (o.t1 && o.t1 > Date.now()) { const xn = X(Date.now()).toFixed(1); g += '<line x1="' + xn + '" x2="' + xn + '" y1="' + T + '" y2="' + (H - B) + '" class="d-now"/>'; }
    let body = "", defs = "";
    series.forEach((s, i) => {
      const a = s.pts.filter((p) => p.v != null && p.t >= t0 && p.t <= t1);
      if (!a.length) return;
      let dpath = "";
      a.forEach((p, j) => { const x = X(p.t).toFixed(1), y = Y(p.v).toFixed(1); dpath += j === 0 ? "M" + x + " " + y : s.step ? "H" + x + "V" + y : "L" + x + " " + y; });
      const area = dpath + (s.step ? "H" + X(a[a.length - 1].t + 3600e3).toFixed(1) : "") + "L" + X(a[a.length - 1].t).toFixed(1) + " " + y0.toFixed(1) + "L" + X(a[0].t).toFixed(1) + " " + y0.toFixed(1) + "Z";
      if (s.split) {
        defs += '<clipPath id="' + id + "p" + i + '"><rect x="0" y="0" width="' + W + '" height="' + y0.toFixed(1) + '"/></clipPath><clipPath id="' + id + "n" + i + '"><rect x="0" y="' + y0.toFixed(1) + '" width="' + W + '" height="' + H + '"/></clipPath>';
        body += '<path d="' + area + '" fill="' + s.split[0] + '" fill-opacity="0.35" clip-path="url(#' + id + "p" + i + ')"/><path d="' + area + '" fill="' + s.split[1] + '" fill-opacity="0.35" clip-path="url(#' + id + "n" + i + ')"/>';
        body += '<path d="' + dpath + '" fill="none" stroke="' + s.split[0] + '" stroke-width="1.6" clip-path="url(#' + id + "p" + i + ')"/><path d="' + dpath + '" fill="none" stroke="' + s.split[1] + '" stroke-width="1.6" clip-path="url(#' + id + "n" + i + ')"/>';
      } else {
        if (s.area) body += '<path d="' + area + '" fill="' + s.color + '" fill-opacity="0.28"/>';
        body += '<path d="' + dpath + '" fill="none" stroke="' + s.color + '" stroke-width="1.8"' + (s.dash ? ' stroke-dasharray="5 4"' : "") + "/>";
      }
    });
    this._dCharts = this._dCharts || {};
    this._dCharts[id] = { series, t0, t1, lo, hi, W, H, L, R, T, B, o };
    const lg = series.map((s) => s.legend ? s.legend.map((l) => '<span><i style="background:' + l[0] + '"></i>' + l[1] + "</span>").join("") : s.name ? '<span><i style="background:' + s.color + '"></i>' + s.name + "</span>" : "").join("");
    const legend = lg ? '<div class="d-leg">' + lg + "</div>" : "";
    return '<div class="d-chart-wrap"><div class="d-ct">' + title + legend + '</div><div class="d-chart" data-chart="' + id + '"><svg viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="none"><defs>' + defs + "</defs>" + g + body + '<line class="d-guide" x1="0" x2="0" y1="' + T + '" y2="' + (H - B) + '" style="display:none"/></svg><div class="d-tip"></div></div></div>';
  }
  _wireCharts() {
    this.shadowRoot.querySelectorAll(".d-chart").forEach((el) => {
      const c = this._dCharts && this._dCharts[el.dataset.chart];
      if (!c) return;
      const svg = el.querySelector("svg"), guide = el.querySelector(".d-guide"), tip = el.querySelector(".d-tip");
      const move = (ev) => {
        const r = svg.getBoundingClientRect();
        const fx = (ev.clientX - r.left) / r.width, vx = fx * c.W;
        if (vx < c.L || vx > c.W - c.R) { guide.style.display = "none"; tip.style.display = "none"; return; }
        const t = c.t0 + ((vx - c.L) / (c.W - c.L - c.R)) * (c.t1 - c.t0);
        const lines = [];
        c.series.forEach((s) => {
          let best = null;
          s.pts.forEach((p) => { if (p.v != null && (!best || Math.abs(p.t - t) < Math.abs(best.t - t))) best = p; });
          if (best && Math.abs(best.t - t) < (c.t1 - c.t0) / 20) lines.push((s.name ? s.name + ": " : "") + (c.o.d != null ? best.v.toFixed(c.o.d) : best.v.toFixed(2)) + " " + (c.o.unit || ""));
        });
        guide.setAttribute("x1", vx); guide.setAttribute("x2", vx); guide.style.display = "";
        tip.innerHTML = "<b>" + this._dayHm(t) + "</b><br>" + (lines.join("<br>") || "–");
        tip.style.display = "block";
        const w = tip.offsetWidth, px = fx * r.width;
        if (ev.pointerType === "touch") {
          // beside the finger (never under it): to the right if there is room, otherwise to the left
          tip.style.left = Math.min(Math.max(px + 28 + w <= r.width ? px + 28 : px - 28 - w, 0), Math.max(0, r.width - w)) + "px";
        } else tip.style.left = Math.min(Math.max(px - w / 2, 0), r.width - w) + "px";
      };
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerdown", (ev) => {
        // only one chart shows its value box at a time
        this.shadowRoot.querySelectorAll(".d-chart").forEach((o) => { if (o !== el) { const g2 = o.querySelector(".d-guide"), t2 = o.querySelector(".d-tip"); if (g2) g2.style.display = "none"; if (t2) t2.style.display = "none"; } });
        move(ev);
      });
      // with a finger the value box stays after lifting; it goes away when tapping outside the charts
      el.addEventListener("pointerleave", (ev) => { if (ev.pointerType === "touch") return; guide.style.display = "none"; tip.style.display = "none"; });
    });
    const bodyEl = this.shadowRoot.getElementById("d-body");
    if (bodyEl && !this._tipOutside) {
      this._tipOutside = true;
      this.shadowRoot.addEventListener("pointerdown", (ev) => {
        if (ev.target && ev.target.closest && ev.target.closest(".d-chart")) return;
        this.shadowRoot.querySelectorAll(".d-chart .d-guide, .d-chart .d-tip").forEach((n) => { n.style.display = "none"; });
      });
    }
  }
  _renderDetail() {
    const root = this.shadowRoot, body = root.getElementById("d-body");
    if (!body || root.getElementById("detail").style.display === "none") return;
    root.getElementById("d-tabs").innerHTML = this._detailTabs().map((t) => '<button class="d-tab' + (t.k === this._dTab ? " on" : "") + '" data-action="detail-tab" data-tab="' + t.k + '">' + t.t + "</button>").join("");
    root.getElementById("d-range").innerHTML = [["24h", "24 tim"], ["7d", "7 dygn"]].map((r) => '<button class="d-rb' + (r[0] === this._dRange ? " on" : "") + '" data-action="detail-range" data-range="' + r[0] + '">' + r[1] + "</button>").join("");
    const rg = root.getElementById("d-range"); if (rg) rg.style.display = this._dTab === "frame" ? "none" : "";
    if (this._dTab === "frame") {
      if (this._frameBusy && Date.now() - this._frameBusy < 4000) return;
      const sc = body.scrollTop, fo = this._dTab_frame();
      body.innerHTML = '<div class="d-tiles">' + fo.tiles.join("") + "</div>" + fo.extra;
      body.scrollTop = sc;
      return;
    }
    const d = this._dData;
    if (!d || d.range !== this._dRange) { body.innerHTML = '<div class="d-empty">Hämtar data…</div>'; return; }
    if (d.error) { body.innerHTML = '<div class="d-empty">Kunde inte hämta historik från Home Assistant.</div>'; return; }
    const fn = this["_dTab_" + this._dTab];
    if (!fn) return;
    const scroll = body.scrollTop;
    this._dCharts = {};
    let out;
    try { out = fn.call(this, d); } catch (e) { console.warn("grankulle: detail render failed", e); out = { tiles: [], charts: ['<div class="d-empty">Kunde inte visa detaljerna.</div>'] }; }
    body.innerHTML = '<div class="d-tiles">' + out.tiles.join("") + "</div>" + out.charts.join("") + (out.extra || "");
    this._wireCharts();
    body.scrollTop = scroll;
  }
  _rng() { return this._dRange === "24h" ? "senaste dygnet" : "senaste 7 dygnen"; }
  _dTab_sol(d) {
    const now = this._num("fronius_power", 0) / 1000, pk = this._peak(d.sol), tot = this._kwh(d.sol, d.dt);
    const ys = this._st("solar_yield_total");
    return {
      tiles: [
        this._tile("Just nu", this._n(now, 2) + " kW", now > 0.05 ? "producerar" : "ingen produktion"),
        this._tile("Idag", this._n(this._solarToday, 1) + " kWh", "sedan midnatt"),
        this._tile("Topp " + this._rng(), pk ? this._n(pk.v, 2) + " kW" : "–", pk ? this._dayHm(pk.t) : ""),
        this._tile("Totalt " + this._rng(), this._n(tot, 1) + " kWh", this._dRange === "7d" ? "snitt " + this._n(tot / 7, 1) + " kWh/dygn" : ""),
        this._tile("Prognos idag (VRM)", this._vrmN("uppskattad_energiproduktion_idag") == null ? "–" : this._n(this._vrmN("uppskattad_energiproduktion_idag"), 1) + " kWh", this._vrmN("uppskattad_energiproduktion_aterstaende_idag") != null ? "kvar " + this._n(this._vrmN("uppskattad_energiproduktion_aterstaende_idag"), 1) + " kWh" : ""),
        this._tile("Prognos imorgon (VRM)", this._vrmN("beraknad_energiproduktion_imorgon") == null ? "–" : this._n(this._vrmN("beraknad_energiproduktion_imorgon"), 1) + " kWh", this._vrmT("hogsta_rusningstid_imorgon") ? "topp " + this._vrmT("hogsta_rusningstid_imorgon") : ""),
        this._tile("Sedan start", ys ? this._n(parseFloat(ys.state), 0) + " " + (ys.attributes.unit_of_measurement || "") : "–", "Fronius totalt"),
      ],
      charts: [this._dChart("Solproduktion", [{ color: "#ffc83d", pts: d.sol, area: true }], { unit: "kW", d: 2 })],
    };
  }
  _dTab_hus(d) {
    const raw = ((this._num("house_power_l1", 0)) + (this._num("house_power_l2", 0)) + (this._num("house_power_l3", 0))) / 1000, car = (this._num("zaptec_power", 0)) / 1000;
    const now = Math.max(0, raw - car), pk = this._peak(d.hus), tot = this._kwh(d.hus, d.dt), tcar = this._kwh(d.car, d.dt);
    const avg = d.hus.length ? d.hus.reduce((a, r) => a + r.v, 0) / d.hus.length : null;
    return {
      tiles: [
        this._tile("Just nu", this._n(now, 2) + " kW", "utan billaddning"),
        this._tile("Snitt " + this._rng(), this._n(avg, 2) + " kW"),
        this._tile("Topp", pk ? this._n(pk.v, 2) + " kW" : "–", pk ? this._dayHm(pk.t) : ""),
        this._tile("Förbrukat " + this._rng(), this._n(tot, 1) + " kWh", "hus utan bil"),
        this._tile("Billaddning " + this._rng(), this._n(tcar, 1) + " kWh", tot + tcar > 0 ? Math.round((tcar / (tot + tcar)) * 100) + " % av all förbrukning" : ""),
        this._tile("Självförsörjning nu", (this.shadowRoot.getElementById("v-selfsuff") || {}).textContent || "–"),
      ],
      charts: [this._dChart("Husförbrukning (utan bil)", [{ name: "Hus", color: "#5ab0ff", pts: d.hus, area: true }, { name: "Bil", color: "#3ddc84", pts: d.car }], { unit: "kW", d: 2 })],
    };
  }
  _dTab_batt(d) {
    const soc = this._num("battery_soc"), p = (this._num("battery_power", 0)) / 1000, cap = (this._battCost && this._battCost.cap) || 19;
    let est = "–", estSub = "";
    if (soc != null && p < -0.05) { est = this._hrs(((soc / 100) * cap) / -p); estSub = "tills 0 % vid nuvarande uttag"; }
    else if (soc != null && p > 0.05) { est = this._hrs((((100 - soc) / 100) * cap) / p); estSub = "tills 100 %"; }
    const bc = this._battCost;
    return {
      tiles: [
        this._tile("Laddning", this._n(soc, 0) + " %", "≈ " + this._n((soc || 0) / 100 * cap, 1) + " av " + this._n(cap, 0) + " kWh"),
        this._tile("Effekt nu", this._n(Math.abs(p), 2) + " kW", p > 0.05 ? "laddar" : p < -0.05 ? "urladdar" : "vilar"),
        this._tile(p < -0.05 ? "Tid kvar" : "Tid till full", est, estSub),
        this._tile("Laddat " + this._rng(), this._n(d.chg, 1) + " kWh"),
        this._tile("Urladdat " + this._rng(), this._n(d.dis, 1) + " kWh"),
        this._tile("Spänning / ström", this._n(this._num("battery_voltage"), 1) + " V · " + this._n(this._num("battery_current"), 1) + " A"),
        this._tile("Energins kostnad", bc ? "0–" + this._n(bc.cMax, 2) + " kr/kWh" : "–", bc ? "beräknad (ej mätt): ≈ " + this._n(bc.c, 2) + " kr/kWh" : ""),
      ],
      charts: [
        this._dChart("Laddningsnivå", [{ color: "#4dd0e1", pts: d.soc, area: true }], { unit: "%", d: 0, min: 0, max: 100 }),
        this._dChart("Batterieffekt", [{ legend: [["#3ddc84", "Laddar"], ["#ff9f43", "Urladdar"]], color: "#3ddc84", split: ["#3ddc84", "#ff9f43"], pts: d.batt }], { unit: "kW", d: 2, h: 190 }),
      ],
    };
  }
  _dTab_nat(d) {
    const now = ((this._num("grid_power_l1", 0)) + (this._num("grid_power_l2", 0)) + (this._num("grid_power_l3", 0))) / 1000;
    const buy = this._kwh(d.grid, d.dt, (v) => Math.max(0, v)), sell = this._kwh(d.grid, d.dt, (v) => Math.max(0, -v));
    const imp = this._peak(d.grid), exp = this._peak(d.grid.map((r) => ({ t: r.t, v: -r.v })));
    const ph = [1, 2, 3].map((i) => this._n((this._num("grid_power_l" + i, 0)), 0)).join(" / ");
    const tb = this._num("tibber_consumption"), ts = this._num("tibber_production"), tc = this._num("tibber_cost"), tr = this._num("tibber_reward");
    return {
      tiles: [
        this._tile("Just nu", this._n(Math.abs(now), 2) + " kW", now > 0.05 ? "köper från nätet" : now < -0.05 ? "säljer till nätet" : "balans"),
        this._tile("Köpt " + this._rng(), this._n(buy, 1) + " kWh"),
        this._tile("Sålt " + this._rng(), this._n(sell, 1) + " kWh"),
        this._tile("Högsta köp", imp && imp.v > 0 ? this._n(imp.v, 2) + " kW" : "–", imp && imp.v > 0 ? this._dayHm(imp.t) : ""),
        this._tile("Högsta sälj", exp && exp.v > 0 ? this._n(exp.v, 2) + " kW" : "–", exp && exp.v > 0 ? this._dayHm(exp.t) : ""),
        this._tile("Fasbelastning L1 / L2 / L3", ph + " W"),
        this._tile("Idag köpt", this._n(tb, 1) + " kWh", tc != null ? "kostnad " + this._n(tc, 0) + " kr" : ""),
        this._tile("Idag sålt", this._n(ts, 1) + " kWh", tr != null ? "ersättning " + this._n(tr, 0) + " kr" : ""),
      ],
      charts: [this._dChart("Nätets effekt (över 0 = köper, under 0 = säljer)", [{ legend: [["#ff7a59", "Köper"], ["#3ddc84", "Säljer"]], color: "#ff7a59", split: ["#ff7a59", "#3ddc84"], pts: d.grid }], { unit: "kW", d: 2 })],
    };
  }
  _dTab_bil(d) {
    const car = this._whichCar(), zs = this._st("zaptec_status"), p = (this._num("zaptec_power", 0)) / 1000;
    const stTxt = { disconnected: "Ingen bil ansluten", connected_requesting: "Ansluten · väntar på start", connected_charging: "Laddar", connected_finished: "Laddning klar" }[zs ? zs.state : ""] || (zs ? zs.state : "–");
    const sess = this._num("zaptec_session"), sc = this._sessCost;
    const tot = this._kwh(d.car, d.dt), pk = this._peak(d.car);
    const cur = [1, 2, 3].map((i) => this._n(this._num("zaptec_i" + i, 0), 0)).join(" / ");
    const soc = this._num("ev_soc"), tgt = this._num("ev_soc_target");
    const evs = (this._events || []).filter((e) => e.icon === "🔌");
    return {
      tiles: [
        this._tile("Status", stTxt, car ? car.name + " · " + car.phases + (car.phases > 1 ? " faser" : " fas") : ""),
        this._tile("Effekt nu", this._n(p, 2) + " kW", "ström L1/L2/L3: " + cur + " A"),
        this._tile("Denna session", sess != null ? this._n(sess, 1) + " kWh" : "–", sc && isFinite(sc.cost) ? "kostnad ≈ " + this._n(sc.cost, 1) + " kr · " + (sc.gridPct != null ? sc.gridPct + " % från nätet" : "") : ""),
        this._tile("V60 laddning", soc != null ? this._n(soc, 0) + (tgt != null ? " → " + this._n(tgt, 0) : "") + " %" : "–"),
        this._tile("Laddat " + this._rng(), this._n(tot, 1) + " kWh", pk ? "högst " + this._n(pk.v, 2) + " kW" : ""),
      ],
      charts: [this._dChart("Laddeffekt", [{ color: "#3ddc84", pts: d.car, area: true }], { unit: "kW", d: 2, h: 190 })],
      extra: '<div class="d-ct">Laddningar senaste dygnet <span class="d-note">kostnad = nätandel × Tibber-pris, sol och batteri räknas som gratis</span></div>' + (evs.length ? evs.map((e) => '<div class="ev ev-green"><div class="ev-t">' + e.title + '</div><div class="ev-d">' + e.detail + "</div></div>").join("") : '<div class="d-empty">Inga laddningar senaste dygnet</div>'),
    };
  }
  // ----- Dynamic ESS plan: read straight from the GX device (MQTT over WebSocket, same as the Victron GUI) -- LAN only
  async _loadPlan() {
    const c = this._planCache;
    if (c && Date.now() - c.at < 45000) return;
    if (this._planBusy) return;
    this._planBusy = true;
    try {
      const host = (this._config && this._config.gx_host) || "192.168.1.129";
      const slots = await this._gxPlan(host, this._config && this._config.gx_portal_id);
      this._plan = { at: Date.now(), slots };
      this._planCache = { at: Date.now() };
    } catch (e) { this._plan = { at: Date.now(), error: String((e && e.message) || e) }; }
    this._planBusy = false;
    this._renderDetail();
  }
  _gxPlan(host, portalId) {
    const enc = new TextEncoder(), dec = new TextDecoder();
    const str = (x) => { const b = enc.encode(x); return [b.length >> 8, b.length & 255, ...b]; };
    const rl = (n) => { const o = []; do { let d = n % 128; n = Math.floor(n / 128); if (n > 0) d |= 128; o.push(d); } while (n > 0); return o; };
    const pkt = (t, body) => new Uint8Array([t, ...rl(body.length), ...body]);
    return new Promise((resolve, reject) => {
      let ws, pid = portalId || null, done = false, subscribed = false;
      const got = {};
      const finish = (err) => {
        if (done) return; done = true; clearTimeout(tm);
        try { ws.close(); } catch (e) {}
        if (err) return reject(new Error(err));
        const base = "N/" + pid + "/settings/0/Settings/DynamicEss/Schedule/";
        const v = (i, k) => { try { return JSON.parse(got[base + i + "/" + k]).value; } catch (e) { return null; } };
        const out = [];
        for (let i = 0; i < 96; i++) {
          const st = v(i, "Start");
          if (st == null) continue;
          out.push({ t: st * 1000, dur: (v(i, "Duration") || 900) * 1000, strat: v(i, "Strategy"), target: v(i, "TargetSoc"), soc: v(i, "Soc"), feed: v(i, "AllowGridFeedIn"), flags: v(i, "Flags") });
        }
        out.sort((a, b) => a.t - b.t);
        if (!out.length) return reject(new Error("tom plan"));
        resolve(out);
      };
      const tm = setTimeout(() => finish(pid ? null : "GX svarar inte"), 7000);
      try { ws = new WebSocket("ws://" + host + "/websocket-mqtt", "mqtt"); } catch (e) { clearTimeout(tm); return reject(e); }
      ws.binaryType = "arraybuffer";
      ws.onerror = () => finish("kan inte nå GX-enheten (" + host + ")");
      ws.onopen = () => ws.send(pkt(0x10, [...str("MQTT"), 4, 2, 0, 60, ...str("grankullecard" + Math.random().toString(16).slice(2, 8))]));
      let buf = new Uint8Array(0), last = 0;
      const sub = () => {
        subscribed = true;
        ws.send(pkt(0x82, [0, 2, ...str("N/" + pid + "/settings/0/Settings/DynamicEss/Schedule/#"), 0]));
        ws.send(pkt(0x30, [...str("R/" + pid + "/keepalive")]));
        setTimeout(() => finish(), 2500);
      };
      ws.onmessage = (ev) => {
        const d = new Uint8Array(ev.data), nb = new Uint8Array(buf.length + d.length); nb.set(buf); nb.set(d, buf.length); buf = nb;
        while (buf.length >= 2) {
          let i = 1, m = 1, len = 0, b;
          do { if (i >= buf.length) return; b = buf[i++]; len += (b & 127) * m; m *= 128; } while (b & 128);
          if (buf.length < i + len) return;
          const t = buf[0] >> 4, body = buf.slice(i, i + len); buf = buf.slice(i + len);
          if (t === 2) {
            if (pid) sub(); else ws.send(pkt(0x82, [0, 1, ...str("N/+/system/0/Serial"), 0]));
          } else if (t === 3) {
            const tl = (body[0] << 8) | body[1], topic = dec.decode(body.slice(2, 2 + tl)), pay = dec.decode(body.slice(2 + tl));
            if (!pid) { const mm = topic.match(/^N\/([^/]+)\/system\/0\/Serial/); if (mm) { pid = mm[1]; sub(); } }
            else got[topic] = pay;
          }
        }
      };
    });
  }
  // VRM forecasts (victron_remote_monitoring integration): PV production and consumption per day / hour
  _vrm(suffix) {
    const hs = this._hass ? this._hass.states : {};
    const x = hs["sensor.victron_remote_monitoring_" + suffix];
    if (!x) return null;
    if (/^(unknown|unavailable)$/.test(x.state)) return null;
    return x.state;
  }
  _vrmN(suffix) { const v = this._vrm(suffix); const n = v == null ? NaN : parseFloat(v); return isFinite(n) ? n : null; }
  _vrmT(suffix) { const v = this._vrm(suffix); if (!v) return ""; const t = Date.parse(v); return isFinite(t) ? this._hm(t) : ""; }
  _vrmTiles() {
    const k = (v, d = 1) => (v == null ? "–" : this._n(v, d) + " kWh");
    const solI = this._vrmN("uppskattad_energiproduktion_idag"), solK = this._vrmN("uppskattad_energiproduktion_aterstaende_idag"), solM = this._vrmN("beraknad_energiproduktion_imorgon");
    const fI = this._vrmN("beraknad_energiforbrukning_idag"), fK = this._vrmN("beraknad_energiforbrukning_aterstaende_idag"), fM = this._vrmN("beraknad_energiforbrukning_imorgon");
    const sub = (a, b) => (a != null ? "kvar idag " + this._n(a, 1) + " kWh" : "") + (b ? " · topp " + b : "");
    return [
      this._tile("☀️ Sol idag (VRM-prognos)", k(solI), sub(solK, this._vrmT("hogsta_rusningstid_idag"))),
      this._tile("☀️ Sol imorgon (prognos)", k(solM), this._vrmT("hogsta_rusningstid_imorgon") ? "topp " + this._vrmT("hogsta_rusningstid_imorgon") : ""),
      this._tile("🏠 Förbrukning idag (prognos)", k(fI), sub(fK, this._vrmT("hogsta_forbrukningstopptid_idag"))),
      this._tile("🏠 Förbrukning imorgon (prognos)", k(fM), this._vrmT("hogsta_forbrukningstopptid_imorgon") ? "topp " + this._vrmT("hogsta_forbrukningstopptid_imorgon") : ""),
      this._tile("Nästa timme (prognos)", this._n(this._vrmN("beraknad_energiproduktion_nasta_timme"), 2) + " / " + this._n(this._vrmN("beraknad_energiforbrukning_nasta_timme"), 2), "kWh sol / förbrukning"),
    ];
  }
  // sol vs. förbrukning per day as paired bars
  _vrmBars() {
    const days = [["Igår", "uppskattad_energiproduktion_igar", "beraknad_energiforbrukning_igar"], ["Idag", "uppskattad_energiproduktion_idag", "beraknad_energiforbrukning_idag"], ["Imorgon", "beraknad_energiproduktion_imorgon", "beraknad_energiforbrukning_imorgon"]]
      .map((d) => ({ n: d[0], sol: this._vrmN(d[1]), use: this._vrmN(d[2]) }));
    const max = Math.max(1, ...days.map((d) => Math.max(d.sol || 0, d.use || 0)));
    const bar = (v, col) => '<div style="display:flex;align-items:center;gap:8px;margin:2px 0"><div style="height:12px;border-radius:3px;background:' + col + ';width:' + Math.round(((v || 0) / max) * 62) + '%"></div><span style="font-size:12px;opacity:.85">' + this._n(v, 1) + " kWh</span></div>";
    return '<div class="d-ct">Prognos per dygn (VRM) <span class="d-leg"><span><i style="background:#ffc83d"></i>Sol</span><span><i style="background:#5ab0ff"></i>Förbrukning</span></span></div>' +
      days.map((d) => '<div style="display:grid;grid-template-columns:64px 1fr;gap:6px;align-items:center;margin-bottom:6px"><div style="font-size:13px;font-weight:700">' + d.n + "</div><div>" + bar(d.sol, "#ffc83d") + bar(d.use, "#5ab0ff") +
        (d.sol != null && d.use != null ? '<div style="font-size:12px;opacity:.7">' + (d.sol - d.use >= 0 ? "överskott " : "underskott ") + this._n(Math.abs(d.sol - d.use), 1) + " kWh</div>" : "") + "</div></div>").join("");
  }
  _dTab_plan(d) {
    const P = this._plan, now = Date.now();
    const sName = (k) => ({ 0: "Målnivå", 1: "Egenförbrukning", 2: "Prioritera batteri", 3: "Prioritera nät" }[k] || "okänd (" + k + ")");
    const sCol = { 0: "#4dd0e1", 1: "#3ddc84", 2: "#ffc83d", 3: "#ff7a59" };
    const ha = (k) => { const x = this._hass && this._hass.states[k]; return x ? x.state : null; };
    const mode = this._st("dess_mode_sw");
    const modeTxt = mode ? (mode.state === "on" ? "Trade" : mode.state === "off" ? "Green" : "–") : "–";
    const strat = { targetsoc: "Målnivå", selfconsume: "Egenförbrukning", probattery: "Prioritera batteri", progrid: "Prioritera nät" };
    const reac = { idle_no_opportunity: "Vilar – ingen fördel just nu", scheduled_selfconsume: "Egenförbrukning enligt plan", scheduled_charge_allow_grid: "Laddar från nätet enligt plan", scheduled_charge_enhanced: "Laddar extra enligt plan", selfconsume_accept_charge: "Egenförbrukning, tar emot laddning", idle_scheduled_feedin: "Vilar, säljer enligt plan", scheduled_discharge: "Urladdar enligt plan", selfconsume_accept_discharge: "Egenförbrukning, tillåter urladdning", idle_maintain_surplus: "Vilar, behåller överskott", idle_maintain_targetsoc: "Vilar, håller målnivån", scheduled_charge_smooth_transition: "Laddar mjukt enligt plan", scheduled_charge_feedin: "Laddar och säljer enligt plan", scheduled_charge_no_grid: "Laddar utan nät enligt plan", scheduled_minimum_discharge: "Minimal urladdning enligt plan", selfconsume_no_grid: "Egenförbrukning utan nät" };
    const hdr = [
      ...this._vrmTiles(),
      this._tile("Läge", modeTxt, modeTxt === "Trade" ? "köper billigt, säljer dyrt" : modeTxt === "Green" ? "sol först, ingen nätladdning för handel" : ""),
      this._tile("Strategi", strat[ha("dynamisk_ess_strategi")] || ha("dynamisk_ess_strategi") || "–", "VRM:s grundinställning"),
      this._tile("Just nu", reac[ha("dynamisk_ess_reaktiv_strategi")] || ha("dynamisk_ess_reaktiv_strategi") || "–"),
      this._tile("Målnivå", ha("dynamisk_ess_malniva_soc") ? this._n(parseFloat(ha("dynamisk_ess_malniva_soc")), 0) + " %" : "–", "batteri nu " + this._n(this._num("battery_soc"), 0) + " %"),
    ];
    // HA entity ids of the Victron integration are fixed by name; look them up lazily
    const hs = this._hass ? this._hass.states : {}, pick = (suffix) => { const k = Object.keys(hs).find((x) => x.endsWith(suffix)); return k ? hs[k].state : null; };
    const o = 5;
    hdr[o + 1] = this._tile("Strategi", strat[pick("dynamisk_ess_strategi")] || pick("dynamisk_ess_strategi") || "–", "VRM:s grundinställning");
    const rc = pick("dynamisk_ess_reaktiv_strategi");
    hdr[o + 2] = this._tile("Just nu", reac[rc] || rc || "–");
    const mt = pick("dynamisk_ess_malniva_soc");
    hdr[o + 3] = this._tile("Målnivå", mt && isFinite(parseFloat(mt)) ? this._n(parseFloat(mt), 0) + " %" : "–", "batteri nu " + this._n(this._num("battery_soc"), 0) + " %");
    if (!P) return { tiles: hdr, charts: ['<div class="d-empty">Hämtar planen från GX-enheten…</div>'], extra: this._vrmBars() };
    if (P.error) return { tiles: hdr, charts: ['<div class="d-empty">Kunde inte läsa planen: ' + P.error + '. Planen hämtas direkt från GX-enheten och kräver att du är hemma på nätverket (http).</div>'], extra: this._vrmBars() };
    const sl = P.slots.filter((x) => x.t + x.dur > now);
    if (!sl.length) return { tiles: hdr, charts: ['<div class="d-empty">Planen är tom just nu.</div>'] };
    const seg = [];
    sl.forEach((x) => { const l = seg[seg.length - 1]; if (l && l.strat === x.strat && l.feed === x.feed) { l.end = x.t + x.dur; l.t1 = x.target; } else seg.push({ strat: x.strat, feed: x.feed, start: x.t, end: x.t + x.dur, t0: x.target, t1: x.target }); });
    const end = sl[sl.length - 1].t + sl[sl.length - 1].dur;
    const nxt = seg[1];
    hdr.push(this._tile("Nästa byte", nxt ? this._dayHm(nxt.start) : "–", nxt ? sName(nxt.strat) : "oförändrat resten av planen"));
    hdr.push(this._tile("Planen täcker", "till " + this._dayHm(end), sl.length + " perioder à " + Math.round(sl[0].dur / 60000) + " min"));
    const price = (this._hourly || []).filter((r) => r.t + 3600e3 > now && r.t < end).map((r) => ({ t: r.t, v: r.price }));
    const charts = [
      this._vrmBars(),
      this._dChart("Planerad målnivå (batteri %) och faktisk nivå", [{ name: "Plan (mål)", color: "#ffc83d", step: true, pts: sl.map((x) => ({ t: x.t, v: x.target })) }, { name: "Faktisk", color: "#4dd0e1", pts: d.soc }], { unit: "%", d: 0, min: 0, max: 100, t0: now - 6 * 3600e3, t1: end, h: 200 }),
    ];
    if (price.length) charts.push(this._dChart("Elpris under planen", [{ color: "#f2c94c", step: true, area: true, pts: price }], { unit: "kr/kWh", d: 2, t0: now - 6 * 3600e3, t1: end, h: 150 }));
    const rows = seg.map((g) => '<div class="ev" style="border-left-color:' + (sCol[g.strat] || "#888") + '"><div class="ev-t">' + this._hm(g.start) + "–" + this._hm(g.end) + " · " + sName(g.strat) + '</div><div class="ev-d">målnivå ' + this._n(g.t0, 0) + (Math.round(g.t1) !== Math.round(g.t0) ? " → " + this._n(g.t1, 0) : "") + " %" + (g.feed ? " · försäljning tillåten" : "") + "</div></div>").join("");
    const note = '<div class="d-note" style="margin-top:8px">Strategierna är de som DESS schemalagt i GX-enheten. Exakt hur mycket som köps eller säljs per period beslutas löpande av systemet.</div>';
    return { tiles: hdr, charts, extra: '<div class="d-ct">Planen i klartext</div>' + rows + note };
  }
  _dTab_vader(d) {
    const dirTxt = (deg) => deg == null ? "–" : ["N", "NNO", "NO", "ONO", "O", "OSO", "SO", "SSO", "S", "SSV", "SV", "VSV", "V", "VNV", "NV", "NNV"][Math.round(deg / 22.5) % 16];
    const wu = this._st("weather_wind"), wunit = wu && wu.attributes ? String(wu.attributes.unit_of_measurement || "") : "";
    const f = /km/i.test(wunit) ? 1 / 3.6 : /mph/i.test(wunit) ? 0.44704 : /kn/i.test(wunit) ? 0.5144 : 1;
    const nowW = this._num("weather_wind"), nowG = this._num("weather_gust"), dir = this._num("weather_wind_dir"), tNow = this._num("weather_temp"), pNow = this._num("weather_pressure");
    const wavg = d.wwind.length ? d.wwind.reduce((a, r) => a + r.v, 0) / d.wwind.length : null;
    const gmax = d.wgustMax && d.wgustMax.length ? this._peak(d.wgustMax) : this._peak(d.wgust);
    const wmax = this._peak(d.wwind);
    // circular mean of the wind direction, weighted by wind speed
    let sx = 0, sy = 0; d.wdir.forEach((r) => { const w = (d.wwind.find((x) => x.t === r.t) || { v: 1 }).v, a = r.v * Math.PI / 180; sx += w * Math.sin(a); sy += w * Math.cos(a); });
    const mdir = d.wdir.length ? (Math.atan2(sx, sy) * 180 / Math.PI + 360) % 360 : null;
    const tmin = d.wtemp.length ? d.wtemp.reduce((b, r) => (r.v < b.v ? r : b)) : null, tmax = d.wtemp.length ? d.wtemp.reduce((b, r) => (r.v > b.v ? r : b)) : null;
    const tavg = d.wtemp.length ? d.wtemp.reduce((a, r) => a + r.v, 0) / d.wtemp.length : null;
    const p0 = d.wpres.length ? d.wpres[0].v : null, ptr = pNow != null && p0 != null ? pNow - p0 : null;
    const ms = (v) => this._n(v == null ? null : v * f, 1) + " m/s";
    const pr = d.wpres.map((r) => r.v);
    const pLo = pr.length ? Math.floor(Math.min.apply(null, pr) - 1) : 990, pHi = pr.length ? Math.ceil(Math.max.apply(null, pr) + 1) : 1030;
    return {
      tiles: [
        this._tile("Vind nu", ms(nowW), dir != null ? dirTxt(dir) + " " + Math.round(dir) + "°" : ""),
        this._tile("Byvind nu", ms(nowG)),
        this._tile("Högsta byvind " + this._rng(), gmax ? this._n(gmax.v, 1) + " m/s" : "–", gmax ? this._dayHm(gmax.t) : ""),
        this._tile("Medelvind " + this._rng(), this._n(wavg, 1) + " m/s", wmax ? "mest " + this._n(wmax.v, 1) + " m/s (timmedel) " + this._dayHm(wmax.t) : ""),
        this._tile("Vanligaste riktning", mdir != null ? dirTxt(mdir) + " " + Math.round(mdir) + "°" : "–", "viktad efter vindstyrka"),
        this._tile("Temperatur nu", this._n(tNow, 1) + " °C", d.wtemp.length ? "snitt " + this._n(tavg, 1) + " °C" : ""),
        this._tile("Lägst", tmin ? this._n(tmin.v, 1) + " °C" : "–", tmin ? this._dayHm(tmin.t) : ""),
        this._tile("Högst", tmax ? this._n(tmax.v, 1) + " °C" : "–", tmax ? this._dayHm(tmax.t) : ""),
        ...(d.wcoop.length || this._num("coop_temp") != null ? (() => {
          const cn = this._num("coop_temp"), cmin = d.wcoop.length ? d.wcoop.reduce((b, r) => (r.v < b.v ? r : b)) : null, cmax = d.wcoop.length ? d.wcoop.reduce((b, r) => (r.v > b.v ? r : b)) : null;
          const outAt = (r) => {
            if (!r || !d.wtemp.length) return "";
            const o = d.wtemp.reduce((b, x) => (Math.abs(x.t - r.t) < Math.abs(b.t - r.t) ? x : b));
            return Math.abs(o.t - r.t) > 2 * 3600e3 ? "" : '<br><span style="color:#ff5a5a;font-weight:700">ute ' + this._n(o.v, 1) + " °C</span>";
          };
          return [
            this._tile("🐔 Hönshus nu", this._n(cn, 1) + " °C", cn != null && tNow != null ? '<span style="color:#ff5a5a;font-weight:700">' + (cn - tNow >= 0 ? "+" : "") + this._n(cn - tNow, 1) + " °C mot ute</span>" : ""),
            this._tile("🐔 Hönshus lägst", cmin ? this._n(cmin.v, 1) + " °C" : "–", cmin ? this._dayHm(cmin.t) + outAt(cmin) : ""),
            this._tile("🐔 Hönshus högst", cmax ? this._n(cmax.v, 1) + " °C" : "–", cmax ? this._dayHm(cmax.t) + outAt(cmax) : ""),
          ];
        })() : []),
        this._tile("Lufttryck", pNow != null ? this._n(pNow, 0) + " hPa" : "–", ptr != null ? (ptr >= 0 ? "+" : "") + this._n(ptr, 1) + " hPa under perioden" : ""),
      ],
      charts: [
        this._dChart("Vind (m/s)", [{ name: "Medelvind", color: "#5ab0ff", pts: d.wwind, area: true }, { name: "Byvind (max)", color: "#ff9f43", pts: d.wgustMax && d.wgustMax.length ? d.wgustMax : d.wgust }], { unit: "m/s", d: 1 }),
        this._dChart("Temperatur (°C)", [{ name: "Väderstation", color: "#ff7a59", pts: d.wtemp }].concat(d.wcoop.length ? [{ name: "Hönshus", color: "#3ddc84", pts: d.wcoop }] : []), { unit: "°C", d: 1, min: d.wtemp.length ? Math.floor(Math.min.apply(null, d.wtemp.concat(d.wcoop).map((r) => r.v)) - 1) : undefined, max: d.wtemp.length ? Math.ceil(Math.max.apply(null, d.wtemp.concat(d.wcoop).map((r) => r.v)) + 1) : undefined }),
        this._dChart("Lufttryck (hPa)", [{ color: "#4dd0e1", pts: d.wpres }], { unit: "hPa", d: 0, min: pLo, max: pHi, h: 170 }),
      ],
    };
  }
  _dTab_mp(d) {
    const n = (k) => this._num(k, null), kw = (k) => { const v = n(k); return v == null ? null : v / 1000; };
    const sumK = (ks) => { let t = 0, c = 0; ks.forEach((k) => { const v = n(k); if (v != null) { t += v; c++; } }); return c ? t / 1000 : null; };
    const stS = this._st("mp_state"), stTxt = { off: "Av", low_power: "Lågeffekt", fault: "FEL", bulk: "Bulk", absorption: "Absorption", float: "Underhållsladdning", storage: "Förvaring", equalize: "Utjämning", passthru: "Genomsläpp", inverting: "Växelriktar", power_assist: "Power assist", power_supply: "Nätaggregat", sustain: "Vänteläge", external_control: "Extern styrning" }[stS ? stS.state : ""] || (stS ? stS.state : "–");
    const inK = sumK(["mp_in_p1", "mp_in_p2", "mp_in_p3"]), outK = sumK(["mp_out_p1", "mp_out_p2", "mp_out_p3"]), dcK = kw("mp_dc_p");
    const ph = (pre) => [1, 2, 3].map((i) => this._n(n(pre + i), 0)).join(" / ");
    const alarms = [["larm_om_forlorat_elnat", "Förlorat nät"], ["larm_for_hog_dc_spanning", "Hög DC-spänning"], ["larm_for_hog_dc_strom", "Hög DC-ström"], ["larm_for_hog_temperatur", "Hög temperatur"], ["larm_for_lag_batteriniva", "Låg batterinivå"], ["overbelastningslarm", "Överbelastning"], ["rippellarm", "Rippel"], ["spanningssensorlarm", "Spänningssensor"], ["temperatursensorlarm", "Temperatursensor"], ["fasrotationslarm", "Fasrotation"]];
    const P = "sensor.multiplus_ii_48_5000_70_50_id_276_", H = this._hass && this._hass.states || {};
    const act = alarms.filter((a) => H[P + a[0]] && !/^(no_alarm|unknown|unavailable)$/.test(H[P + a[0]].state)).map((a) => a[1]);
    const known = alarms.filter((a) => H[P + a[0]]).length;
    const phNames = ["L1", "L2", "L3"];
    const unit = (u) => { const i = n("mp_u" + u + "_in"), o = n("mp_u" + u + "_out"), v = n("mp_u" + u + "_inv"); return this._tile("Enhet " + u + " · " + phNames[u], this._n(o, 0) + " W ut", "in " + this._n(i, 0) + " W · inverterar " + this._n(v, 0) + " W"); };
    const e = (k) => { const v = n(k); return v == null ? "–" : this._n(v, v < 100 ? 1 : 0) + " kWh"; };
    const nom = 230;
    const volts = [1, 2, 3].map((i) => this._n(n("mp_in_v" + i), 0)).join("/");
    return {
      tiles: [
        this._tile("Tillstånd", stTxt, ({ bulk: "snabbladdar batteriet", absorption: "toppladdar", float: "underhåll", inverting: "kör på batteri", passthru: "nätet rakt igenom" }[stS ? stS.state : ""] || "") + " · 3 enheter"),
        this._tile("Larm", act.length ? act.join(", ") : known ? "Inga larm" : "–", known ? known + " larm övervakas" : "", act.length ? "d-warn" : ""),
        this._tile("Från nätet (in)", this._n(inK, 2) + " kW", "L1/L2/L3: " + ph("mp_in_p") + " W"),
        this._tile("Till huset (ut)", this._n(outK, 2) + " kW", "L1/L2/L3: " + ph("mp_out_p") + " W"),
        this._tile("DC-sida", this._n(dcK, 2) + " kW", this._n(n("mp_dc_v"), 1) + " V · " + this._n(n("mp_dc_a"), 1) + " A"),
        this._tile("Nätspänning L1/L2/L3", volts + " V", this._n(n("mp_in_f1"), 2) + " Hz in · " + this._n(n("mp_out_f1"), 2) + " Hz ut"),
        this._tile("Utström L1/L2/L3", [1, 2, 3].map((i) => this._n(n("mp_out_a" + i), 1)).join("/") + " A", "skenbart: " + ph("mp_out_va") + " VA"),
        unit(0), unit(1), unit(2),
        this._tile("Nät → batteri (totalt)", e("mp_grid_to_inv"), "sedan start"),
        this._tile("AC-ut sol → batteri", e("mp_pv_to_inv"), "sedan start"),
        this._tile("Batteri → hus", e("mp_e_inv_load"), "sedan start"),
        this._tile("Genomsläpp nät → hus", e("mp_e_pass"), "sedan start"),
        this._tile("Till nätet", e("mp_e_out_grid"), "från AC-ut · batteri→nät " + e("mp_e_inv_grid")),
      ],
      charts: [
        this._dChart("Effekt ut per fas (Multiplus → hus)", [{ name: "L1", color: "#ffc83d", pts: d.mpo1 }, { name: "L2", color: "#5ab0ff", pts: d.mpo2 }, { name: "L3", color: "#3ddc84", pts: d.mpo3 }], { unit: "kW", d: 2 }),
        this._dChart("Totalt: nät in / hus ut", [{ name: "Från nätet", color: "#ff7a59", pts: d.mpin }, { name: "Till huset", color: "#5ab0ff", pts: d.mpout }], { unit: "kW", d: 2, h: 190 }),
        this._dChart("DC-effekt (batterisidan)", [{ color: "#4dd0e1", pts: d.mpdc, area: true }], { unit: "kW", d: 2, h: 160 }),
      ],
    };
  }
  _dTab_pris(d) {
    const now = this._num("tibber_price"), H = this._hourly || [], t = Date.now();
    const hourStart = Math.floor(t / 3600e3) * 3600e3;
    const fut = H.filter((r) => r.t >= hourStart).map((r) => ({ t: r.t, v: r.price }));
    const past = d.price.filter((r) => r.t < hourStart);
    const all = past.map((r) => r.v).concat(fut.map((r) => r.v));
    const avg = past.length ? past.reduce((a, r) => a + r.v, 0) / past.length : null;
    let lo = null, hi = null;
    past.concat(fut).forEach((r) => { if (!lo || r.v < lo.v) lo = r; if (!hi || r.v > hi.v) hi = r; });
    let best = null;
    for (let i = 0; i + 2 < fut.length; i++) { const a = (fut[i].v + fut[i + 1].v + fut[i + 2].v) / 3; if (!best || a < best.a) best = { a, t: fut[i].t }; }
    const t1 = fut.length ? fut[fut.length - 1].t + 3600e3 : t;
    return {
      tiles: [
        this._tile("Just nu", this._n(now, 2) + " kr/kWh", (this.shadowRoot.getElementById("v-price-lvl") || {}).textContent || ""),
        this._tile("Snitt " + this._rng(), this._n(avg, 2) + " kr/kWh", now != null && avg ? Math.round((now / avg) * 100) + " % av snittet nu" : ""),
        this._tile("Billigast", lo ? this._n(lo.v, 2) + " kr/kWh" : "–", lo ? this._dayHm(lo.t) : ""),
        this._tile("Dyrast", hi ? this._n(hi.v, 2) + " kr/kWh" : "–", hi ? this._dayHm(hi.t) : ""),
        this._tile("Billigaste 3 timmarna framåt", best ? this._n(best.a, 2) + " kr/kWh" : "–", best ? "börjar " + this._dayHm(best.t) : "väntar på morgondagens priser"),
      ],
      charts: [this._dChart("Elpris per timme (streckat = kommande)", [{ name: "Historik", color: "#f2c94c", step: true, area: true, pts: past }, { name: "Kommande", color: "#ffe28a", step: true, dash: true, pts: fut }], { unit: "kr/kWh", d: 2, t1: t1 > t ? t1 : t, t0: t - this._dData.span })],
    };
  }

  // Share (0..1) of the house load -- and thus of the car -- that was bought from the grid right now.
  // Inputs in kW: g = grid import (+), h = house incl. car, pv = solar, b = battery charge (+).
  // Solar surplus is assumed to charge the battery first, so only the rest of the battery charging is grid energy.
  // The car is treated as drawing the same mix of grid / solar / battery as the rest of the house (average mix).
  _gridShare(g, h, pv, b) {
    if (g == null || h == null) return null;
    const H = Math.max(0.05, h);
    const pvSurplus = Math.max(0, (pv || 0) - H);
    const gridToBatt = Math.max(0, (b || 0) - pvSurplus);
    return Math.min(H, Math.max(0, g - gridToBatt)) / H;
  }
  // Builds share(t) from a statistics_during_period result that includes the 5-minute means of grid, house, solar and battery power.
  _mixFn(st) {
    const m = (k) => { const o = {}; (st[this._e(k)] || []).forEach((r) => { if (r.mean != null) o[typeof r.start === "number" ? r.start : Date.parse(r.start)] = r.mean; }); return o; };
    const g = ["grid_power_l1", "grid_power_l2", "grid_power_l3"].map(m), h = ["house_power_l1", "house_power_l2", "house_power_l3"].map(m), pv = m("fronius_power"), b = m("battery_power");
    const sum = (a, t) => { let x = 0, n = 0; a.forEach((o) => { if (o[t] != null) { x += o[t]; n++; } }); return n ? x / 1000 : null; };
    return (t) => this._gridShare(sum(g, t), sum(h, t), pv[t] != null ? pv[t] / 1000 : 0, b[t] != null ? b[t] / 1000 : 0);
  }
  _mixNow() {
    const n = (k) => this._num(k, 0) / 1000;
    const h = n("house_power_l1") + n("house_power_l2") + n("house_power_l3");
    return this._gridShare(n("grid_power_l1") + n("grid_power_l2") + n("grid_power_l3"), h, n("fronius_power"), n("battery_power"));
  }
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
      const r = await this._hass.callWS({ type: "recorder/statistics_during_period", start_time: new Date(Date.now() - 36 * 3600e3).toISOString(), end_time: new Date().toISOString(), statistic_ids: [eid, pid].concat(["grid_power_l1", "grid_power_l2", "grid_power_l3", "house_power_l1", "house_power_l2", "house_power_l3", "fronius_power", "battery_power"].map((k) => this._e(k)).filter(Boolean)), period: "5minute", types: ["change", "state", "mean"] });
      const en = (r[eid] || []).filter((x) => x.change != null), pr = {};
      (r[pid] || []).forEach((x) => { if (x.mean != null) pr[x.start] = x.mean; });
      const mix = this._mixFn(r), nowSh = this._mixNow();
      if (!en.length) return;
      const curE = this._num("zaptec_energy_total"), curP = this._num("tibber_price");
      let lastP = curP != null ? curP : 1;
      let cost = 0, left = S, gridK = 0;
      const tail = curE !== null && en[en.length - 1].state != null ? Math.max(0, curE - en[en.length - 1].state) : 0;
      const t0 = Math.min(tail, left), f0 = nowSh == null ? 1 : nowSh; cost += t0 * f0 * lastP; gridK += t0 * f0; left -= t0;
      for (let i = en.length - 1; i >= 0 && left > 0.001; i--) {
        const p = pr[en[i].start] != null ? pr[en[i].start] : lastP; lastP = p;
        const e = Math.min(Math.max(0, en[i].change), left), sh = mix(typeof en[i].start === "number" ? en[i].start : Date.parse(en[i].start)), f = sh == null ? 1 : sh; cost += e * f * p; gridK += e * f; left -= e;
      }
      this._sessCost = { cost, avg: S > 0.05 ? cost / S : null, gridPct: S > 0.05 ? Math.min(100, Math.round((gridK / (S - Math.max(0, left))) * 100)) : null, partial: left > 0.3 };
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
  // "Ladda fullt": raise the ESS minimum SoC to 100 % (the system then holds / recharges the battery).
  // It ends by itself: an automation in Home Assistant restores the normal limit once the battery is full; pressing again restores it at once.
  // The normal limit is kept in input_number.ess_minsta_soc_normal (written here when Ladda fullt is switched on).
  _battFull() {
    const id = this._e("ess_min_soc");
    if (!id || !this._hass) return;
    const cur = this._num("ess_min_soc"), helper = this._e("ess_min_soc_normal"), hv = this._num("ess_min_soc_normal");
    let target = 100;
    if (cur !== null && cur >= 99) {
      target = hv !== null ? hv : 29;
      try { const p = parseFloat(localStorage.getItem("grankulle_prev_minsoc")); if (hv === null && p) target = p; } catch (e) {}
    } else if (cur !== null) {
      if (helper && this._hass.states[helper]) this._hass.callService("input_number", "set_value", { entity_id: helper, value: cur });
      try { localStorage.setItem("grankulle_prev_minsoc", String(cur)); } catch (e) {}
    }
    this._hass.callService("number", "set_value", { entity_id: id, value: target });
  }
  // Samsung The Frame: turn_off on a Frame = Art mode, a held power key = fully off; the dashboard is cast with Home Assistant's Cast "show view"
  _frame(what) {
    if (!this._hass) return;
    if (what === "art") this._svc("media_player", "turn_off", "frame_player");
    else if (what === "on") this._svc("media_player", "turn_on", "frame_player");
    else if (what === "off") this._svc("remote", "send_command", "frame_remote", { command: ["KEY_POWER"], hold_secs: 4 });
    else if (what === "dash") this._svc("cast", "show_lovelace_view", "frame_cast", { view_path: "0", dashboard_path: "dashboard-v2" });
  }
  _frameKey(key, hold) {
    if (!this._hass || !key) return;
    const data = { command: [key] };
    if (hold) data.hold_secs = parseFloat(hold);
    this._svc("remote", "send_command", "frame_remote", data);
  }
  _frameRefresh() { clearTimeout(this._frameRt); this._frameRt = setTimeout(() => { if (this._dTab === "frame") this._renderDetail(); }, 900); }
  _dTab_frame() {
    const fp = this._st("frame_player"), a = (fp && fp.attributes) || {};
    const state = !fp ? "–" : fp.state === "on" ? "På / Art mode" : fp.state === "off" ? "Avstängd / standby" : "Ej tillgänglig";
    const k = (key, label, cls, hold) => '<button class="fr-b ' + (cls || "") + '" data-action="frame-key" data-key="' + key + '"' + (hold ? ' data-hold="' + hold + '"' : "") + ">" + label + "</button>";
    const srcs = (a.source_list || []).map((x) => '<button class="fr-b' + (a.source === x ? " on" : "") + '" data-action="frame-src" data-src="' + x + '">' + x + "</button>").join("");
    const out = '<div class="fr-wrap">' +
      '<div class="fr-card"><div class="d-ct">Ström och läge</div><div class="fr-row">' +
        '<button class="fr-b" data-action="frame" data-do="art">🖼 Art mode</button>' +
        '<button class="fr-b" data-action="frame" data-do="on">⏻ På</button>' +
        '<button class="fr-b warn" data-action="frame" data-do="off">⏼ Helt av</button>' +
      '</div><div class="d-note">Art mode = TV:n vilar och visar konst. Helt av = håller in strömknappen i 4 s.</div></div>' +
      '<div class="fr-card"><div class="d-ct">Volym <span class="d-note">skickas som fjärrkontrollstryck, nivån kan inte läsas av</span></div>' +
        '<div class="fr-row"><button class="fr-b big" data-action="frame-vol" data-d="down" data-n="5">−−</button><button class="fr-b big" data-action="frame-vol" data-d="down">−</button>' +
        '<button class="fr-b big" data-action="frame-vol" data-d="up">+</button><button class="fr-b big" data-action="frame-vol" data-d="up" data-n="5">++</button>' +
        '<button class="fr-b" data-action="frame-mute">🔇 Ljud av/på</button></div><div class="d-note">−− och ++ ändrar fem steg.</div></div>' +
      '<div class="fr-card"><div class="d-ct">Källa</div><div class="fr-row">' + (srcs || '<span class="d-note">Inga källor rapporterade (TV:n är avstängd)</span>') + k("KEY_SOURCE", "Källmeny") + "</div></div>" +
      '<div class="fr-card"><div class="d-ct">Fjärrkontroll</div><div class="fr-remote">' +
        '<div class="fr-dpad">' + k("KEY_UP", "▲", "u") + k("KEY_LEFT", "◀", "l") + k("KEY_ENTER", "OK", "ok") + k("KEY_RIGHT", "▶", "r") + k("KEY_DOWN", "▼", "d") + "</div>" +
        '<div class="fr-keys">' + k("KEY_RETURN", "↩ Tillbaka") + k("KEY_HOME", "🏠 Hem") + k("KEY_MENU", "☰ Meny") + k("KEY_INFO", "ℹ Info") + k("KEY_EXIT", "✕ Avsluta") + k("KEY_TOOLS", "🔧 Verktyg") +
        k("KEY_CHUP", "CH ▲") + k("KEY_CHDOWN", "CH ▼") + k("KEY_GUIDE", "📅 Guide") + "</div></div>" +
        '<div class="fr-row" style="margin-top:10px">' + k("KEY_REWIND", "⏪") + k("KEY_PLAY", "▶") + k("KEY_PAUSE", "⏸") + k("KEY_STOP", "⏹") + k("KEY_FF", "⏩") + "</div></div>" +
      '<div class="fr-card"><div class="d-ct">Siffror</div><div class="fr-row">' + [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => k("KEY_" + n, String(n))).join("") + "</div></div>" +
      '<div class="d-note" style="margin-top:8px">Knapparna skickas som fjärrkontrollstryck via Samsung-integrationen. TV:n måste vara på (inte helt avstängd) för att ta emot dem. Konstbibliotek och bildväxling går inte att styra härifrån.</div>' +
      "</div>";
    return { tiles: [
      this._tile("Läge", state, a.source ? "källa: " + a.source : ""),
    ], charts: [], extra: out };
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
    // short average (10 s) only to stop the word flickering around zero; a long window made the tile lag minutes behind
    const CENTER = 0.10, HALF = 0.15, WIN = 10000;
    const now = Date.now();
    const b = this._gbuf = this._gbuf || [];
    if (!b.length || now - b[b.length - 1].t >= 2000) b.push({ t: now, v: grid });
    while (b.length && now - b[0].t > WIN) b.shift();
    const avg = b.length > 1 ? b.reduce((a, x) => a + x.v, 0) / b.length : grid;
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
    const carTxt = (car ? " · " + car.name + " (" + car.phases + " fas" + (car.phases > 1 ? "er" : "") + ")" : "") + (connected && sessK !== null ? " · " + sessK.toFixed(1) + " kWh denna session" + (this._sessCostTxt() ? " · " + this._sessCostTxt() : "") : "");
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

    const lim = this._num("ess_min_soc");
    const full = lim !== null && lim >= 99, bsoc = this._num("battery_soc");
    const bf = this.shadowRoot.getElementById("c-battfull");
    if (bf) { bf.textContent = lim === null ? "ej tillgänglig" : full ? "Håller fulladdat · släpper när fullt (tryck för normal)" : "Ladda fullt";
      bf.title = lim === null ? "" : "ESS minsta SoC-gräns: " + Math.round(lim) + " %"; bf.classList.toggle("active", full); }

    const fp = this._st("frame_player"), fsec = this.shadowRoot.getElementById("c-frame-sec");
    if (fsec) { fsec.style.display = fp ? "" : "none"; this._set("c-frame-status", fp ? (fp.state === "on" ? "Ansluten (på / Art mode)" : fp.state === "off" ? "Avstängd" : "ej tillgänglig") : "–"); }
    const dm = this._st("dess_mode_sw");
    this._markActive("c-dess", "mode", dm ? (dm.state === "on" ? "trade" : dm.state === "off" ? "green" : "") : "");
    const dc = this.shadowRoot.getElementById("c-dess"); if (dc) dc.style.display = dm ? "" : "none";

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

  // Day rollover: at midnight (also detected when a sleeping tablet wakes up) every cached number is thrown away and
  // fetched again, and the detail window is closed. Around 04:00 the page is reloaded when nobody is using it, so a
  // wall tablet also picks up new card versions and never carries stale state for days.
  _dayCheck() {
    const now = new Date(), k = now.toDateString();
    if (this._dayKey === undefined) { this._dayKey = k; this._loadedAt = Date.now(); return; }
    if (k !== this._dayKey) { this._dayKey = k; this._dayReset(); }
    const idleMs = Date.now() - (window.__grankulleAct || 0);
    const detOpen = (() => { const o = this.shadowRoot && this.shadowRoot.getElementById("detail"); return !!o && o.style.display !== "none"; })();
    if (now.getHours() === 4 && Date.now() - this._loadedAt > 3 * 3600e3 && idleMs > 5 * 60e3 && !detOpen && !document.hidden) location.reload();
  }
  _dayReset() {
    this._closeDetail();
    this._dCache = {}; this._dData = null; this._plan = null; this._planCache = null;
    this._solarToday = null; this._sessCost = null; this._events = []; this._lbuf = []; this._gbuf = [];
    this._fetchDay(); this._fetchPrices(); this._fetchSession(); this._fetchEvents(); this._fetchWarnings();
    if (this._fetchForecast) this._fetchForecast();
  }
  _tickClock() {
    this._dayCheck();
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
    this._set("v-windspeed", w.ms.toFixed(1) + " m/s");
    this._set("v-windgust", w.gust !== null ? " · by " + w.gust.toFixed(1) : "");
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
    const evp = this.shadowRoot.getElementById("evpanel");
    if (!gridLost && !others.length) { box.style.display = "none"; if (evp) evp.style.display = ""; return; }
    box.style.display = "";
    if (evp) evp.style.display = "none";
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
    this._set("tag-s3-ev", costTxt && zst !== "disconnected" ? "Kostnad " + costTxt + (this._sessCost && this._sessCost.gridPct != null ? " · " + this._sessCost.gridPct + " % nät" : "") : "");
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
    if (lampV) lampV.classList.toggle("on", carNow ? carNow.short === "V60" : !!(v60Ch && /^(on|charging)$/.test(v60Ch.state)));
    if (lampL) lampL.classList.toggle("on", !!(carNow && carNow.short === "LEAF"));
    const evTgt2 = this._num("ev_soc_target");
    const v60 = this.shadowRoot.getElementById("tag-v60");
    if (v60) v60.style.display = evSoc === null ? "none" : "";
    const evCh = this._st("ev_charging");
    const evStObj = this._st("ev_soc");
    const evAgeMs = evStObj && evStObj.last_updated ? Date.now() - Date.parse(evStObj.last_updated) : 0;
    const evStale = evAgeMs > 3 * 3600 * 1000 && !(evStObj && /volvo/.test(evStObj.entity_id || ""));
    const ageTxt = evAgeMs >= 86400000 ? Math.floor(evAgeMs / 86400000) + " d" : Math.floor(evAgeMs / 3600000) + " h";
    if (v60) v60.style.opacity = evStale ? "0.7" : "";
    this._set("tag-l-v60", evStale ? "V60 · DATA " + ageTxt + " GAMMAL" : "V60" + (evCh && /^(on|charging)$/.test(evCh.state) ? " · LADDAR" : ""));
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
    this._set("v-sens-coop", coopTemp === null ? "–" : coopTemp.toFixed(1) + " °C");

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
    container-type: inline-size;
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
  /* left column: four panels spread evenly from the top to the bottom edge (same bottom margin as wind/sensors on the right) */
  .leftcol { position: absolute; left: 2%; top: 10%; bottom: 2.5%; width: 15.5%; display: flex; flex-direction: column; justify-content: space-between; z-index: 3; pointer-events: none; }
  .leftcol .panel { position: static; width: 100%; padding: 1vw 1.2vw; pointer-events: auto; }
  .price { text-align: center; }
  .price-big { font-size: 1.6vw; font-weight: 700; }
  .price-lvl { font-size: 0.8vw; font-weight: 800; letter-spacing: 0.5px; margin-top: 2px; text-transform: uppercase; }
  .price-sub { font-size: 0.55vw; opacity: 0.7; margin-top: 2px; }
  .batt { text-align: center; }
  .gauge { width: 4.6vw; height: 4.6vw; margin: 4px auto; display: block; }
  .energyday { }
  .energy-cols { display: flex; gap: 16px; }
  .energy-cols .lbl { display: block; font-size: 0.6vw; opacity: 0.7; }
  .energy-cols b { font-size: 0.9vw; }


  /* price chart with the event list directly underneath, so they can never overlap whatever the width */
  .topcol { position: absolute; left: 0; top: 1.5%; width: 100%; display: flex; flex-direction: column; gap: 0.9vw; pointer-events: none; z-index: 4; }
  .topcol .panel { position: relative; margin-left: 20.5%; pointer-events: auto; }
  .topcol .alarmbanner { position: relative; left: auto; top: auto; transform: none; margin-left: 20.5%; width: 49.5%; }
  .warnbanner { width: 49.5%; box-sizing: border-box; padding: 0.6vw 1vw; border: 2px solid #f2c94c; background: rgba(40, 32, 6, 0.92); }
  .warnbanner.lv-orange { border-color: #ff9f43; background: rgba(54, 30, 6, 0.93); }
  .warnbanner.lv-red { border-color: #ff4d4d; background: rgba(90, 8, 8, 0.94); animation: alarmpulse 1.4s ease-in-out infinite; }
  .warnbanner.lv-message { border-color: #6aa7ff; background: rgba(10, 26, 48, 0.92); }
  .wb-title { font-size: 0.8vw; font-weight: 800; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 0.25vw; }
  .wb-row { font-size: 0.8vw; margin-top: 0.2vw; display: flex; gap: 0.5vw; align-items: baseline; }
  .wb-row b { font-weight: 800; }
  .wb-row .wb-t { opacity: 0.8; font-size: 0.7vw; margin-left: auto; white-space: nowrap; }
  .wb-vma { font-weight: 800; color: #ffb3b3; }
  .pricechart { width: 49.5%; box-sizing: border-box; padding: 0.7% 1%; }
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

  .topright { display: flex; gap: 0.5vw; align-items: stretch; }
  .wind-box { display: flex; align-items: center; gap: 0.45vw; background: rgba(8,14,12,0.5); backdrop-filter: blur(3px); border-radius: 8px; padding: 0.25vw 0.7vw; }
  .wind-txt { display: flex; flex-direction: column; line-height: 1.15; }
  .wind-txt small { font-size: 0.48vw; opacity: 0.65; letter-spacing: 0.5px; }
  .wind-txt b { font-size: 0.85vw; font-weight: 700; white-space: nowrap; }
  .wind-txt span { font-size: 0.55vw; opacity: 0.8; }
  .compass { width: 2.6vw; height: 2.6vw; }
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
  .v60-head { display: flex; align-items: center; gap: 0.6vw; }
  .v60-head h4 { margin-top: 0; }
  .ctl-car { width: 4.2vw; min-width: 56px; height: auto; flex: none; filter: drop-shadow(0 0 3px rgba(224,38,46,0.45)); }
  .tag.blue { border-left-color: #42a5f5; }
  .tag.on { border-left-color: #42a5f5; box-shadow: 0 0 8px rgba(66,165,245,0.5); }
  .tag-lbl { opacity: 0.75; letter-spacing: 0.5px; font-size: 0.55vw; }
  .tag-val { font-weight: 700; font-size: 0.85vw; margin-top: 1px; }
  .eventlog { width: 28.5%; max-height: 8.6cqw; overflow-y: auto; box-sizing: border-box; }
  .ev { border-left: 3px solid #888; padding: 0.1vw 0 0.1vw 0.5vw; margin-top: 0.3vw; }
  .ev-red { border-left-color: #ff5a5a; }
  .ev-green { border-left-color: #3ddc84; }
  .ev-t { font-size: 0.75vw; font-weight: 700; }
  .ev-d { font-size: 0.62vw; opacity: 0.85; }
  @media (max-width: 900px) { .topcol { position: static; } .topcol .panel, .topcol .alarmbanner { margin: 8px; width: auto; } .wb-row, .wb-title { font-size: 13px; } .eventlog { width: auto; max-height: none; } .ev-t { font-size: 13px; } .ev-d { font-size: 11px; } }
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
  /* ---- detail view ---- */
  .tag[data-action="detail-open"], .panel[data-action="detail-open"] { cursor: pointer; }
  .wind-box[data-action="detail-open"]:hover { outline: 1px solid rgba(255,255,255,0.45); }
  .tag[data-action="detail-open"]:hover, .panel[data-action="detail-open"]:hover { outline: 1px solid rgba(255,255,255,0.45); }
  .detail { font-family: system-ui, -apple-system, "Segoe UI", sans-serif; position: fixed; inset: 0; z-index: 99; background: rgba(0,0,0,0.62); backdrop-filter: blur(3px); align-items: center; justify-content: center; padding: 2vh 2vw; box-sizing: border-box; }
  .d-box { width: min(1100px, 100%); max-height: 94vh; display: flex; flex-direction: column; background: rgba(14,20,19,0.97); border: 1px solid rgba(255,255,255,0.18); border-radius: 14px; color: #fff; box-shadow: 0 10px 50px rgba(0,0,0,0.6); overflow: hidden; }
  .d-head { display: flex; align-items: center; gap: 12px; padding: 10px 14px; border-bottom: 1px solid rgba(255,255,255,0.12); flex-wrap: wrap; }
  .d-tabs { display: flex; gap: 6px; flex-wrap: wrap; flex: 1; }
  .d-tab, .d-rb, .d-close { background: rgba(255,255,255,0.08); color: #fff; border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; padding: 7px 12px; font-size: 14px; cursor: pointer; font-family: inherit; }
  .d-tab.on, .d-rb.on { background: #2e7d5b; border-color: #3ddc84; font-weight: 700; }
  .d-range { display: flex; gap: 4px; }
  .d-rb { padding: 6px 10px; font-size: 13px; }
  .d-close { padding: 6px 11px; }
  .d-body { padding: 14px; overflow-y: auto; min-height: 60vh; }
  .d-tiles { display: grid; grid-template-columns: repeat(auto-fill, minmax(165px, 1fr)); gap: 10px; margin-bottom: 14px; }
  .d-tile { background: rgba(255,255,255,0.07); border-radius: 10px; padding: 10px 12px; }
  .d-tile.d-warn { background: rgba(255,90,70,0.25); border: 1px solid #ff7a59; }
  .d-tl { font-size: 12px; opacity: 0.7; }
  .d-tv { font-size: 21px; font-weight: 800; margin-top: 2px; }
  .d-ts { font-size: 12px; opacity: 0.75; margin-top: 2px; }
  .d-ct { font-size: 13px; font-weight: 700; margin: 10px 0 4px; display: flex; gap: 14px; align-items: center; flex-wrap: wrap; }
  .d-note { font-weight: 400; opacity: 0.6; font-size: 11px; }
  .fr-wrap { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 12px; }
  .fr-card { background: rgba(255,255,255,0.05); border-radius: 12px; padding: 10px 12px; }
  .fr-row { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin-top: 4px; }
  .fr-b { background: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2); border-radius: 10px; min-width: 52px; min-height: 48px; padding: 8px 14px; font-size: 16px; font-family: inherit; cursor: pointer; touch-action: manipulation; }
  .fr-b:active { background: #2e7d5b; }
  .fr-b.on { background: #2e7d5b; border-color: #3ddc84; font-weight: 700; }
  .fr-b.warn { border-color: #ff7a59; }
  .fr-b.big { min-width: 64px; font-size: 22px; font-weight: 800; }
  .fr-remote { display: flex; gap: 14px; flex-wrap: wrap; align-items: flex-start; }
  .fr-dpad { display: grid; grid-template-columns: repeat(3, 56px); grid-template-rows: repeat(3, 56px); gap: 6px; grid-template-areas: ". u ." "l ok r" ". d ."; }
  .fr-dpad .fr-b { min-width: 0; min-height: 0; padding: 0; font-size: 18px; }
  .fr-dpad .u { grid-area: u; } .fr-dpad .d { grid-area: d; } .fr-dpad .l { grid-area: l; } .fr-dpad .r { grid-area: r; } .fr-dpad .ok { grid-area: ok; font-weight: 800; }
  .fr-keys { display: flex; flex-wrap: wrap; gap: 6px; flex: 1 1 160px; }
  .fr-keys .fr-b { min-height: 44px; font-size: 14px; padding: 6px 10px; }
  .d-leg { display: flex; gap: 12px; font-weight: 400; font-size: 12px; opacity: 0.9; }
  .d-leg i { display: inline-block; width: 10px; height: 10px; border-radius: 2px; margin-right: 5px; }
  .d-chart { position: relative; touch-action: pan-y; -webkit-user-select: none; user-select: none; -webkit-touch-callout: none; -webkit-tap-highlight-color: transparent; }
  .d-chart svg { width: 100%; height: auto; display: block; }
  .d-grid { stroke: rgba(255,255,255,0.12); stroke-width: 1; }
  .d-grid.v { stroke: rgba(255,255,255,0.07); }
  .d-ax { fill: rgba(255,255,255,0.65); font-size: 11px; }
  .d-now { stroke: #fff; stroke-opacity: 0.55; stroke-dasharray: 4 3; }
  .d-guide { stroke: #fff; stroke-opacity: 0.6; stroke-width: 1; }
  .d-tip { display: none; position: absolute; top: 4px; background: rgba(0,0,0,0.85); border: 1px solid rgba(255,255,255,0.25); border-radius: 8px; padding: 5px 8px; font-size: 12px; pointer-events: none; white-space: nowrap; z-index: 2; }
  .d-empty { padding: 18px; opacity: 0.7; text-align: center; }
  .d-body .ev { border-left: 3px solid #3ddc84; padding: 2px 0 2px 8px; margin-top: 6px; }
  .d-body .ev-t { font-size: 14px; font-weight: 700; }
  .d-body .ev-d { font-size: 12px; opacity: 0.85; }
  @media (max-width: 700px) { .d-tv { font-size: 18px; } .d-tab { padding: 6px 9px; font-size: 13px; } }

`;

customElements.define("grankulle-energy-card-v2", GrankulleEnergyCardV2);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "grankulle-energy-card-v2",
  name: "Grankulle Energy Card v2 (photo)",
  description: "Fotobaserad live-dashboard för Grankullevägen 19",
});
