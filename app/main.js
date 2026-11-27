// Indonesia in Numbers — the app.
//
// One file, no libraries, no network: hash routing, hand-rolled SVG charts and
// every control on the page (range picker, metric toggles, province selector,
// sortable table). Data lives in data.js; this file only renders it.

import {
  YEARS, HEADLINE, SERIES, SCHOOLING_YEARS, SCHOOLING,
  AGE_STRUCTURE, JAVA_PROVINCES, FACTS, SOURCES,
} from "./data.js";

const view = document.getElementById("view");
const navLinks = Array.from(document.querySelectorAll("[data-nav]"));

// ---------------------------------------------------------------- state
const state = {
  range: "all", // all | early (2015-2019) | late (2020-2024)
  popMetric: "total", // total | growth
  gdpMetric: "total", // total | percapita
  unemp: "bps", // bps | ilo
  healthMetric: "le", // le | u5 | imr
  province: "West Java",
  sortKey: "pop",
  sortDir: -1,
};

// ---------------------------------------------------------------- helpers
function fmt(n, d = 1) {
  return Number(n).toLocaleString("en-US", {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });
}

function rangeSlice(years, values) {
  if (state.range === "early") return [years.slice(0, 5), values.slice(0, 5)];
  if (state.range === "late") return [years.slice(5), values.slice(5)];
  return [years, values];
}

function card(label, big, sub) {
  return `<div class="card"><div class="card-label">${label}</div>` +
    `<div class="card-big">${big}</div><div class="card-sub">${sub}</div></div>`;
}

function sourceLine(text) {
  return `<p class="source">Source: ${text}. Figures are the latest published vintage; small revisions between editions are normal.</p>`;
}

function rangeButtons() {
  const b = (key, label) =>
    `<button class="pill${state.range === key ? " on" : ""}" data-act="range" data-val="${key}">${label}</button>`;
  return `<div class="controls"><span class="controls-label">Years</span>` +
    `${b("all", "2015–2024")}${b("early", "2015–2019")}${b("late", "2020–2024")}</div>`;
}

// ------------------------------------------------------- hand-rolled charts
function lineChart(years, values, opts) {
  const o = Object.assign({ color: "#0e7c7b", decimals: 1, suffix: "", height: 280 }, opts || {});
  const W = 660, H = o.height, pL = 56, pR = 16, pT = 18, pB = 32;
  const min = Math.min(...values), max = Math.max(...values);
  const span = (max - min) || 1;
  const lo = min - span * 0.18, hi = max + span * 0.18;
  const n = years.length;
  const x = (i) => pL + (i * (W - pL - pR)) / Math.max(n - 1, 1);
  const y = (v) => pT + (1 - (v - lo) / (hi - lo)) * (H - pT - pB);
  let ticks = "";
  for (let t = 0; t <= 4; t++) {
    const v = lo + ((hi - lo) * t) / 4;
    const yy = y(v);
    ticks += `<line x1="${pL}" y1="${yy}" x2="${W - pR}" y2="${yy}" class="grid"/>` +
      `<text x="${pL - 8}" y="${yy + 4}" class="tick" text-anchor="end">${fmt(v, o.decimals)}${o.suffix}</text>`;
  }
  const pts = values.map((v, i) => `${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  let dots = "";
  values.forEach((v, i) => {
    dots += `<circle cx="${x(i)}" cy="${y(v)}" r="4" fill="${o.color}"><title>${years[i]}: ${fmt(v, o.decimals)}${o.suffix}</title></circle>`;
  });
  let labels = "";
  years.forEach((yr, i) => {
    labels += `<text x="${x(i)}" y="${H - 10}" class="tick" text-anchor="middle">${yr}</text>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" class="chart" role="img" aria-label="Line chart">${ticks}` +
    `<polyline points="${pts}" fill="none" stroke="${o.color}" stroke-width="2.5" stroke-linejoin="round"/>${dots}${labels}</svg>`;
}

function barChart(years, values, opts) {
  const o = Object.assign({ color: "#0e7c7b", decimals: 1, suffix: "", height: 280 }, opts || {});
  const W = 660, H = o.height, pL = 56, pR = 16, pT = 18, pB = 32;
  const max = Math.max(...values, 0), min = Math.min(...values, 0);
  const span = (max - min) || 1;
  const lo = min - span * 0.08, hi = max + span * 0.08;
  const n = years.length;
  const slot = (W - pL - pR) / n;
  const y = (v) => pT + (1 - (v - lo) / (hi - lo)) * (H - pT - pB);
  const zero = y(0);
  let ticks = "";
  for (let t = 0; t <= 4; t++) {
    const v = lo + ((hi - lo) * t) / 4;
    ticks += `<line x1="${pL}" y1="${y(v)}" x2="${W - pR}" y2="${y(v)}" class="grid"/>` +
      `<text x="${pL - 8}" y="${y(v) + 4}" class="tick" text-anchor="end">${fmt(v, o.decimals)}${o.suffix}</text>`;
  }
  let bars = "";
  values.forEach((v, i) => {
    const bx = pL + i * slot + slot * 0.18;
    const bw = slot * 0.64;
    const top = Math.min(y(v), zero), h = Math.max(Math.abs(zero - y(v)), 1);
    const fill = v < 0 ? "#b3402e" : o.color;
    bars += `<rect x="${bx.toFixed(1)}" y="${top.toFixed(1)}" width="${bw.toFixed(1)}" height="${h.toFixed(1)}" fill="${fill}" rx="2">` +
      `<title>${years[i]}: ${fmt(v, o.decimals)}${o.suffix}</title></rect>`;
  });
  let labels = "";
  years.forEach((yr, i) => {
    labels += `<text x="${pL + i * slot + slot / 2}" y="${H - 10}" class="tick" text-anchor="middle">${yr}</text>`;
  });
  return `<svg viewBox="0 0 ${W} ${H}" class="chart" role="img" aria-label="Bar chart">${ticks}${bars}${labels}</svg>`;
}

function hbarChart(rows, opts) {
  const o = Object.assign({ color: "#0e7c7b", decimals: 1, suffix: "", height: 240 }, opts || {});
  const W = 660, pL = 150, pR = 64, rowH = (o.height - 16) / rows.length;
  const max = Math.max(...rows.map((r) => r.value));
  let out = `<svg viewBox="0 0 ${W} ${o.height}" class="chart" role="img" aria-label="Horizontal bar chart">`;
  rows.forEach((r, i) => {
    const y = 8 + i * rowH;
    const w = ((W - pL - pR) * r.value) / max;
    const fill = r.color || o.color;
    out += `<text x="${pL - 10}" y="${y + rowH / 2 + 4}" class="tick" text-anchor="end">${r.label}</text>` +
      `<rect x="${pL}" y="${y + 5}" width="${Math.max(w, 2).toFixed(1)}" height="${rowH - 12}" fill="${fill}" rx="3">` +
      `<title>${r.label}: ${fmt(r.value, o.decimals)}${o.suffix}</title></rect>` +
      `<text x="${pL + w + 8}" y="${y + rowH / 2 + 4}" class="tick strong">${fmt(r.value, o.decimals)}${o.suffix}</text>`;
  });
  return out + "</svg>";
}

function yoy(values) {
  return values.slice(1).map((v, i) => ((v - values[i]) / values[i]) * 100);
}

// ------------------------------------------------------------------- pages
function pageHead(title, intro) {
  return `<h1>${title}</h1><p class="intro">${intro}</p>`;
}

function renderOverview() {
  const [yrs, pop] = rangeSlice(YEARS, SERIES.population);
  const [, gdp] = rangeSlice(YEARS, SERIES.gdp);
  const rows = [
    ["Population", "283.5m", "281.2m", "283.5m"],
    ["GDP (US$ bn)", "860.9", "1,059.1", "1,396.3"],
    ["GDP per capita (US$)", "3,288", "3,854", "4,925"],
    ["Real growth (%)", "4.88", "−2.07", "5.03"],
    ["Inflation, CPI avg (%)", "6.36", "1.92", "2.18"],
    ["Open unemployment (%)", "6.18", "6.01", "4.87"],
    ["Poverty, March (%)", "11.22", "9.78", "9.03"],
    ["Life expectancy (years)", "69.5", "68.8", "71.3"],
    ["HDI (BPS, 0–100)", "69.55", "72.81", "75.02"],
  ];
  const glance = rows.map((r) =>
    `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join("");
  return `
  <section class="hero">
    <p class="kicker">Indonesia · 2015–2024 · Independent atlas</p>
    <h1>Indonesia in Numbers</h1>
    <p class="intro">The country in nine indicators: how many people, how big the economy,
    how fast it grows, how long people live — and how the answers differ between
    Java and the other 32 provinces. Every figure is sourced; nothing is estimated here.</p>
  </section>
  <div class="cards">
    ${card("Population", "283.5m", "World rank 4 · +0.8% in 2024")}
    ${card("GDP", "$1.40tn", "World rank 16 · $4,925 per person")}
    ${card("Real growth", "5.03%", "2024, year on year")}
    ${card("Inflation", "2.18%", "CPI annual average, 2024")}
    ${card("Life expectancy", "71.3 yrs", "Women 73.4 · Men 69.2")}
    ${card("Human Development Index", "75.02", "BPS, 2024 · up from 69.55 in 2015")}
  </div>
  ${rangeButtons()}
  <div class="panels">
    <section class="panel"><h2>People, 2015–2024</h2>
      ${lineChart(yrs, pop, { decimals: 0, suffix: "m", color: "#0e7c7b" })}
      ${sourceLine(SOURCES.population)}</section>
    <section class="panel"><h2>Economy, 2015–2024</h2>
      ${barChart(yrs, gdp, { decimals: 0, suffix: "", color: "#d9930d" })}
      <p class="chart-note">GDP in billion current US$.</p>
      ${sourceLine(SOURCES.gdp)}</section>
  </div>
  <section class="panel"><h2>Indonesia at a glance</h2>
    <table><thead><tr><th>Indicator</th><th>2015</th><th>2020</th><th>2024</th></tr></thead>
    <tbody>${glance}</tbody></table>
    ${sourceLine("World Bank WDI; Statistics Indonesia (BPS). See each topic page for full sources.")}</section>
  <section class="panel"><h2>Explore by topic</h2>
    <div class="topics">
      <a href="#/population"><strong>Population</strong><span>283.5 million people, age structure, urban share</span></a>
      <a href="#/economy"><strong>Economy</strong><span>GDP, growth, prices, jobs and poverty</span></a>
      <a href="#/health"><strong>Health</strong><span>Longer lives, fewer child deaths, stunting</span></a>
      <a href="#/education"><strong>Education</strong><span>Schooling years and the HDI</span></a>
      <a href="#/provinces"><strong>Provinces</strong><span>Java against the rest of the archipelago</span></a>
    </div></section>`;
}

function renderPopulation() {
  const growth = yoy(SERIES.population);
  const chart = state.popMetric === "total"
    ? lineChart(YEARS, SERIES.population, { decimals: 0, suffix: "m" })
    : barChart(YEARS.slice(1), growth, { decimals: 1, suffix: "%", color: "#d9930d" });
  const toggle = `<div class="controls"><span class="controls-label">Show</span>
    <button class="pill${state.popMetric === "total" ? " on" : ""}" data-act="popmetric" data-val="total">Total population</button>
    <button class="pill${state.popMetric === "growth" ? " on" : ""}" data-act="popmetric" data-val="growth">Annual growth %</button></div>`;
  const table = YEARS.map((y, i) => {
    const chg = i === 0 ? "—" : `+${fmt(((SERIES.population[i] - SERIES.population[i - 1]) / SERIES.population[i - 1]) * 100, 2)}%`;
    return `<tr><td>${y}</td><td>${fmt(SERIES.population[i], 1)}m</td><td>${chg}</td></tr>`;
  }).join("");
  return `
  ${pageHead("Population", "Indonesia is the world's fourth most populous country. Growth has slowed from about 1.2% a year in 2015 to about 0.8% in 2024, and nearly three in five Indonesians now live in towns and cities.")}
  <div class="cards">
    ${card("Population, 2024", "283.5m", "World rank 4 · 3.5% of humanity")}
    ${card("Growth in 2024", "+0.82%", "Down from +1.2% a year in 2015")}
    ${card("Urban share", "58.8%", "Of the population lives in urban areas")}
    ${card("Median age", "30.1 yrs", "A young country: a quarter are under 15")}
  </div>
  ${toggle}
  <section class="panel"><h2>${state.popMetric === "total" ? "Total population" : "Annual population growth"}, 2015–2024</h2>
    ${chart}${sourceLine(SOURCES.population)}</section>
  <div class="panels">
    <section class="panel"><h2>Age structure, 2024</h2>
      ${hbarChart(AGE_STRUCTURE.map((a) => ({ label: a.group, value: a.share, suffix: "%" })), { decimals: 1, suffix: "%" })}
      <p class="chart-note">Share of total population. The 15–64 group is the working-age population.</p>
      ${sourceLine("UN World Population Prospects 2024")}</section>
    <section class="panel"><h2>By year</h2>
      <table><thead><tr><th>Year</th><th>Population</th><th>Change</th></tr></thead><tbody>${table}</tbody></table>
      ${sourceLine(SOURCES.population)}</section>
  </div>
  <p class="note">Two official counts: the World Bank / UN series used here puts 2024 at 283.5 million.
  BPS's own mid-year projection for 2024 is 281.6 million. They differ by method — the UN series
  is a de facto estimate, the BPS series a projection from the census — not by mistake.</p>`;
}

function renderEconomy() {
  const gdpChart = state.gdpMetric === "total"
    ? barChart(YEARS, SERIES.gdp, { decimals: 0, color: "#d9930d" })
    : lineChart(YEARS, SERIES.gdpPerCapita, { decimals: 0, suffix: "", color: "#0e7c7b" });
  const gdpToggle = `<div class="controls"><span class="controls-label">GDP chart</span>
    <button class="pill${state.gdpMetric === "total" ? " on" : ""}" data-act="gdpmetric" data-val="total">Total, US$ bn</button>
    <button class="pill${state.gdpMetric === "percapita" ? " on" : ""}" data-act="gdpmetric" data-val="percapita">Per person, US$</button></div>`;
  const unempSeries = state.unemp === "bps" ? SERIES.unemploymentBps : SERIES.unemploymentIlo;
  const unempToggle = `<div class="controls"><span class="controls-label">Unemployment measure</span>
    <button class="pill${state.unemp === "bps" ? " on" : ""}" data-act="unemp" data-val="bps">BPS open rate</button>
    <button class="pill${state.unemp === "ilo" ? " on" : ""}" data-act="unemp" data-val="ilo">ILO modelled (World Bank)</button></div>`;
  const table = YEARS.map((y, i) =>
    `<tr><td>${y}</td><td>${fmt(SERIES.gdp[i], 1)}</td><td>${fmt(SERIES.growth[i], 2)}%</td><td>${fmt(SERIES.inflation[i], 2)}%</td><td>${fmt(SERIES.poverty[i], 2)}%</td></tr>`).join("");
  return `
  ${pageHead("Economy", "Southeast Asia's largest economy: $1.40 trillion in 2024, growing about 5% a year. Income per person is $4,925 — $16,472 after adjusting for what money buys locally.")}
  <div class="cards">
    ${card("GDP, 2024", "$1.40tn", "World rank 16")}
    ${card("GDP per person", "$4,925", "PPP: $16,472")}
    ${card("Real growth", "5.03%", "2024; −2.07% in the Covid year 2020")}
    ${card("Inflation", "2.18%", "CPI annual average, 2024")}
    ${card("Open unemployment", "4.87%", "BPS, August 2024")}
    ${card("Poverty", "9.03%", "BPS, March 2024 · 11.22% in 2015")}
  </div>
  ${gdpToggle}
  <section class="panel"><h2>${state.gdpMetric === "total" ? "GDP, billion current US$" : "GDP per person, current US$"}, 2015–2024</h2>
    ${gdpChart}${sourceLine(SOURCES.gdp)}</section>
  <div class="panels">
    <section class="panel"><h2>Growth and prices</h2>
      ${lineChart(YEARS, SERIES.growth, { decimals: 1, suffix: "%", color: "#0e7c7b" })}
      <p class="chart-note">Real GDP growth, % per year. Inflation (CPI annual average) ran 6.36% in 2015, 4.21% in 2022 and 2.18% in 2024.</p>
      ${sourceLine(SOURCES.growth + "; " + SOURCES.inflation)}</section>
    <section class="panel"><h2>Poverty, March</h2>
      ${lineChart(YEARS, SERIES.poverty, { decimals: 1, suffix: "%", color: "#b3402e" })}
      <p class="chart-note">Share of the population below the BPS poverty line. September 2024: 8.57%.</p>
      ${sourceLine(SOURCES.poverty)}</section>
  </div>
  ${unempToggle}
  <section class="panel"><h2>Unemployment, ${state.unemp === "bps" ? "BPS open rate" : "ILO modelled estimate"}, 2015–2024</h2>
    ${lineChart(YEARS, unempSeries, { decimals: 2, suffix: "%", color: "#1b2a41" })}
    ${sourceLine(SOURCES.unemployment)}</section>
  <p class="note">Why two unemployment numbers? BPS counts people actively looking for work in its
  labour-force survey: 4.87% in August 2024. The World Bank's ILO-modelled estimate (3.30% in 2024)
  adjusts for informal work and is built for comparing countries. Both are correct; they measure
  different things. This site headlines the BPS figure, because it is the national measure.</p>
  <section class="panel"><h2>By year</h2>
    <table><thead><tr><th>Year</th><th>GDP (US$ bn)</th><th>Growth</th><th>Inflation</th><th>Poverty</th></tr></thead>
    <tbody>${table}</tbody></table>
    ${sourceLine("World Bank WDI; Statistics Indonesia (BPS).")}</section>`;
}

function renderHealth() {
  const seriesMap = {
    le: { key: "lifeExpectancy", title: "Life expectancy at birth, years", decimals: 1, suffix: "", color: "#0e7c7b" },
    u5: { key: "underFiveMortality", title: "Deaths before age five, per 1,000 live births", decimals: 1, suffix: "", color: "#b3402e" },
    imr: { key: "infantMortality", title: "Infant deaths, per 1,000 live births", decimals: 1, suffix: "", color: "#d9930d" },
  };
  const m = seriesMap[state.healthMetric];
  const tabs = `<div class="controls"><span class="controls-label">Indicator</span>
    <button class="pill${state.healthMetric === "le" ? " on" : ""}" data-act="health" data-val="le">Life expectancy</button>
    <button class="pill${state.healthMetric === "u5" ? " on" : ""}" data-act="health" data-val="u5">Under-5 mortality</button>
    <button class="pill${state.healthMetric === "imr" ? " on" : ""}" data-act="health" data-val="imr">Infant mortality</button></div>`;
  return `
  ${pageHead("Health", "Indonesians live longer than a decade ago — 71.3 years at birth in 2024, up from 69.5 in 2015 — and far fewer children die young. The Covid years 2020–2021 are visible as a dip in the line.")}
  <div class="cards">
    ${card("Life expectancy", "71.3 yrs", "Women 73.4 · Men 69.2 · 2024")}
    ${card("Under-5 mortality", "17.7", "Per 1,000 live births · 26.1 in 2015")}
    ${card("Infant mortality", "15.2", "Per 1,000 live births · 21.9 in 2015")}
    ${card("Stunting, under 5", "19.8%", "SSGI 2024 · 37.6% in 2013")}
    ${card("Healthy life expectancy", "63.7 yrs", "WHO, 2023")}
    ${card("BPS life expectancy", "74.15 yrs", "BPS HDI measure, 2024 — see note")}
  </div>
  ${tabs}
  <section class="panel"><h2>${m.title}, 2015–2024</h2>
    ${lineChart(YEARS, SERIES[m.key], { decimals: m.decimals, suffix: m.suffix, color: m.color })}
    ${sourceLine(SOURCES.health)}</section>
  <div class="panels">
    <section class="panel"><h2>Stunting is falling, slowly</h2>
      <p>Stunting — children under five too short for their age — affected 19.8% of them in 2024,
      down from 37.6% in 2013 (Ministry of Health, SSGI). The national average hides wide gaps:
      East Nusa Tenggara records about 37%, the highest of any province.</p>
      <p>The Covid dip: life expectancy fell to 67.5 years in 2021, then recovered to 70.9 in 2022
      and 71.3 in 2024 — above its pre-pandemic level of 70.3 in 2019.</p></section>
    <section class="panel"><h2>Child survival, 2015 vs 2024</h2>
      <table><thead><tr><th>Indicator</th><th>2015</th><th>2024</th></tr></thead><tbody>
      <tr><td>Under-5 mortality (per 1,000)</td><td>26.1</td><td>17.7</td></tr>
      <tr><td>Infant mortality (per 1,000)</td><td>21.9</td><td>15.2</td></tr>
      <tr><td>Life expectancy (years)</td><td>69.5</td><td>71.3</td></tr>
      </tbody></table>
      ${sourceLine(SOURCES.health)}</section>
  </div>
  <p class="note">Two life-expectancy numbers: the World Bank series (71.3 years in 2024) is built for
  comparing countries. BPS's own figure, used inside its Human Development Index, is 74.15 years in
  2024 — BPS builds it from national mortality tables. Both are official; they are not interchangeable.</p>`;
}

function renderEducation() {
  const schoolRows = SCHOOLING_YEARS.map((y, i) =>
    `<tr><td>${y}</td><td>${fmt(SCHOOLING.meanYears[i], 2)}</td><td>${fmt(SCHOOLING.expectedYears[i], 2)}</td></tr>`).join("");
  return `
  ${pageHead("Education", "A 25-year-old Indonesian has spent 8.85 years in school on average; a child starting school today can expect 13.21 years. The Human Development Index has risen every year of the decade, to 75.02 in 2024.")}
  <div class="cards">
    ${card("Mean years of schooling", "8.85 yrs", "Population 25+, BPS 2024")}
    ${card("Expected years", "13.21 yrs", "For a 7-year-old, BPS 2024")}
    ${card("Primary enrolment", "97.89%", "Net enrolment rate, 2024")}
    ${card("Human Development Index", "75.02", "BPS 2024 · 69.55 in 2015")}
  </div>
  <section class="panel"><h2>Human Development Index, 2015–2024</h2>
    ${lineChart(YEARS, SERIES.hdi, { decimals: 2, suffix: "", color: "#0e7c7b" })}
    <p class="chart-note">BPS index, 0–100, combining health, knowledge and a decent standard of living.</p>
    ${sourceLine(SOURCES.education)}</section>
  <div class="panels">
    <section class="panel"><h2>Years in school, 2020–2024</h2>
      ${hbarChart([
        { label: "Mean years, 2024", value: 8.85 },
        { label: "Expected years, 2024", value: 13.21 },
        { label: "Mean years, 2020", value: 8.48, color: "#5a6b7c" },
        { label: "Expected years, 2020", value: 12.98, color: "#5a6b7c" },
      ], { decimals: 2, suffix: " yrs" })}
      ${sourceLine(SOURCES.education)}</section>
    <section class="panel"><h2>Schooling by year</h2>
      <table><thead><tr><th>Year</th><th>Mean years</th><th>Expected years</th></tr></thead>
      <tbody>${schoolRows}</tbody></table>
      <p class="chart-note">Mean years: population aged 25+. Expected years: for a child aged 7.
      BPS prints these five years in its HDI 2024 release; earlier years use a different vintage and are not shown.</p>
      ${sourceLine(SOURCES.education)}</section>
  </div>
  <p class="note">The HDI's knowledge dimension is exactly these two schooling measures plus nothing
  else: mean years for adults, expected years for children. The health dimension is life expectancy
  and the living-standards dimension is adjusted real spending per person (Rp 12.34 million a year in 2024).</p>`;
}

function renderProvinces() {
  const sorted = [...JAVA_PROVINCES].sort((a, b) =>
    state.sortKey === "name"
      ? state.sortDir * a.name.localeCompare(b.name)
      : state.sortDir * (a[state.sortKey] - b[state.sortKey]));
  const sel = JAVA_PROVINCES.find((p) => p.name === state.province) || JAVA_PROVINCES[0];
  const javaTotal = JAVA_PROVINCES.reduce((s, p) => s + p.pop, 0);
  const rest = 283.5 - javaTotal;
  const arrow = (k) => (state.sortKey === k ? (state.sortDir === 1 ? " ↑" : " ↓") : "");
  const table = sorted.map((p) => {
    const share = (p.pop / 283.5) * 100;
    return `<tr><td>${p.name}</td><td>${fmt(p.pop, 2)}m</td><td>${fmt(share, 1)}%</td><td>${p.grdpRank}</td></tr>`;
  }).join("");
  return `
  ${pageHead("Provinces", "Indonesia has 38 provinces across more than 17,000 islands — but the six provinces of Java hold 55.7% of the people and produce about 58% of the economy. The gaps between provinces are the widest in the country.")}
  <div class="cards">
    ${card("Provinces", "38", "Since the 2022 expansion in Papua")}
    ${card("Java's share of people", "55.7%", "158.0m of 283.5m live on Java")}
    ${card("Java's share of GDP", "~58%", "BPS, 2024")}
    ${card("HDI range", "54.91 – 84.15", "Papua Pegunungan to Jakarta, 2024")}
  </div>
  <div class="panels">
    <section class="panel"><h2>Where people live</h2>
      ${hbarChart([
        { label: "Java (6 provinces)", value: javaTotal, color: "#0e7c7b" },
        { label: "Rest of Indonesia (32)", value: rest, color: "#d9930d" },
      ], { decimals: 1, suffix: "m" })}
      <p class="chart-note">Population in millions, 2024. Java is 7% of the land and 56% of the people.</p>
      ${sourceLine(SOURCES.provinces)}</section>
    <section class="panel"><h2>Java's six provinces</h2>
      ${hbarChart([...JAVA_PROVINCES].sort((a, b) => b.pop - a.pop).map((p) => ({ label: p.name, value: p.pop })), { decimals: 1, suffix: "m" })}
      ${sourceLine(SOURCES.provinces)}</section>
  </div>
  <section class="panel"><h2>Pick a province</h2>
    <div class="controls"><label class="controls-label" for="provsel">Province</label>
      <select id="provsel" data-act="province">
        ${JAVA_PROVINCES.map((p) => `<option${p.name === state.province ? " selected" : ""}>${p.name}</option>`).join("")}
      </select></div>
    <div class="cards">
      ${card(sel.name, `${fmt(sel.pop, 2)}m people`, `${fmt((sel.pop / 283.5) * 100, 1)}% of Indonesia`)}
      ${card("GRDP rank", `#${sel.grdpRank} of 38`, "Largest provincial economy: Jakarta")}
      ${card("Known for", sel.note, "Java province profile")}
    </div>
    <p class="chart-note">GRDP order (largest first): Jakarta, East Java, West Java, Central Java — BPS.
    Exact rupiah GRDP by province is published by BPS per province and is not repeated here to avoid mixing vintages.</p></section>
  <section class="panel"><h2>Java provinces by population — click a header to sort</h2>
    <table><thead><tr>
      <th data-act="sort" data-val="name" class="sortable">Province${arrow("name")}</th>
      <th data-act="sort" data-val="pop" class="sortable">Population${arrow("pop")}</th>
      <th>Share</th>
      <th data-act="sort" data-val="grdpRank" class="sortable">GRDP rank${arrow("grdpRank")}</th>
    </tr></thead><tbody>${table}</tbody></table>
    ${sourceLine(SOURCES.provinces)}</section>
  <p class="note">The widest gap in the country is human development, not population: Jakarta's HDI
  is 84.15 while Papua Pegunungan's is 54.91 (BPS, 2024) — a 29-point spread between the capital
  and the highlands of Papua.</p>`;
}

// ------------------------------------------------------------------- router
const ROUTES = {
  "/": renderOverview,
  "/population": renderPopulation,
  "/economy": renderEconomy,
  "/health": renderHealth,
  "/education": renderEducation,
  "/provinces": renderProvinces,
};

function render() {
  const hash = window.location.hash.replace(/^#/, "") || "/";
  const fn = ROUTES[hash] || ROUTES["/"];
  view.innerHTML = fn();
  navLinks.forEach((a) => {
    const target = a.getAttribute("href").replace(/^#/, "") || "/";
    a.classList.toggle("active", target === hash || (target === "/" && hash === "/"));
  });
  window.scrollTo(0, 0);
}

view.addEventListener("click", (e) => {
  const t = e.target.closest("[data-act]");
  if (!t) return;
  const act = t.getAttribute("data-act");
  const val = t.getAttribute("data-val");
  if (act === "range") { state.range = val; render(); }
  if (act === "popmetric") { state.popMetric = val; render(); }
  if (act === "gdpmetric") { state.gdpMetric = val; render(); }
  if (act === "unemp") { state.unemp = val; render(); }
  if (act === "health") { state.healthMetric = val; render(); }
  if (act === "sort") {
    if (state.sortKey === val) state.sortDir *= -1;
    else { state.sortKey = val; state.sortDir = val === "name" ? 1 : -1; }
    render();
  }
});

view.addEventListener("change", (e) => {
  const t = e.target.closest("[data-act]");
  if (!t) return;
  if (t.getAttribute("data-act") === "province") {
    state.province = t.value;
    render();
  }
});

window.addEventListener("hashchange", render);
render();
