# PLAN.md — Indonesia in Numbers

Research, design and play-test log for the "Make the best national statistics
site" entry (Indonesia). One session, 27 Nov 2026.

## Research — every figure verified before use

Seed figures from the morning brief were checked against primary sources
(World Bank WDI API, BPS press releases, UN WPP 2024, Ministry of Health
SSGI 2024). Two seed figures needed correction, and the site says so:

- **Unemployment 3.3% is the ILO-modelled estimate** (World Bank WDI
  SL.UEM.TOTL.ZS, 2024: 3.30%). The national measure, BPS's open
  unemployment rate, is **4.87%** (August 2024). The site headlines the BPS
  figure and lets the reader switch to the ILO series, with the difference
  explained.
- **Inflation 2.2% is the CPI annual average** (World Bank WDI FP.CPI.TOTL.ZG,
  2024: 2.18%). BPS's December year-on-year print was 1.57%; the site notes it.

Everything else in the seed checked out exactly: population 283.5m (WB API
SP.POP.TOTL 283,487,931), GDP $1.396tn (GDP/cap $4,925.44 × population),
growth 5.03% (WDI NY.GDP.MKTP.KD.ZG 5.0326), GDP per capita $4,925, PPP
$16,472 (WDI NY.GDP.PCAP.PP.CD 16,472.48), life expectancy 71.3 years
(WDI SP.DYN.LE00.IN 71.288).

Series pulled from the World Bank API, 2015–2024: population, GDP per capita,
PPP per capita, growth, CPI inflation, life expectancy, under-5 mortality,
ILO unemployment. Infant mortality (21.9 → 15.2) from the WDI series as
republished by UN-based tables. BPS series: open unemployment 2015–2024
(6.18 → 4.87), poverty March 2015–2024 (11.22 → 9.03), HDI 2015–2024
(69.55 → 75.02, from BPS press release No. 85/11/Th.XXVII and the 2015–2019
BPS series), mean/expected years of schooling 2020–2024 (8.48 → 8.85 /
12.98 → 13.21, same release), primary net enrolment 97.89% (2024).
Stunting 19.8% (SSGI 2024, down from 37.6% in 2013).

Provinces: six Java provinces, 2024 populations from the BPS table in the
ICSEMA 2025 proceedings (West Java 50.49m, East Java 41.71m, Central Java
38.28m, Banten 12.63m, Jakarta 11.14m, Yogyakarta 3.73m); Java 55.7% of
people, ~58% of GDP (BPS 2024); GRDP order Jakarta > East Java > West Java
> Central Java; HDI extremes Jakarta 84.15 / Papua Pegunungan 54.91 (BPS
2024); 38 provinces. Rupiah GRDP by province was deliberately NOT printed:
the values found mixed 2024/2025 vintages, so the page gives the verified
ranking instead of a possibly stale table.

## Design

Original editorial design: warm paper background, deep navy ink, teal and
amber accents, Georgia serif for numbers and headings, system sans for body.
No external fonts, images or libraries. Four files on first load
(index.html, style.css, main.js, data.js). Hash routes (#/, #/population,
#/economy, #/health, #/education, #/provinces) so every page is reached by
a real link. Charts are hand-rolled SVG (line, bar, horizontal bar) in
main.js. Every control works: year-range pills, metric toggles, indicator
tabs, province selector, sortable table headers.

## Play-test (27 Nov 2026, headless Chrome 154, serve.ts :8080)

- Overview, Population, Economy, Health, Education, Provinces: all render;
  probes showed 1–4 SVGs and 1 table per page, h1 correct on each.
- Controls clicked through: year range 2020–2024; population total/growth
  toggle; GDP total/per-person toggle; unemployment BPS/ILO toggle; health
  indicator tabs (life expectancy / under-5 / infant); province selector to
  Jakarta; table sort by name (first row Banten — correct alphabetical order).
- Phone 390×844: nav wraps, cards stack one column, no overflow.
- Console errors: 0 on every page. Failed requests: 0. External requests: 0
  (first load: 4 requests — index.html, style.css, main.js, data.js).
- Screenshots visually checked: overview, economy, health, education,
  provinces, phone — readable, no overlaps, no clipped text, real figures
  visible. Final set in screenshots/: 1-cover.jpg (overview 1280×720),
  2-economy.jpg (1280×720), 3-provinces.jpg (1280×720), 4-phone.jpg
  (390×844); all JPEG, each under 256 KiB.
- Entrypoint: `mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts`
  writes out/app/, out/screenshots/ and out/dossier.json; a second run to
  out2/ produced a byte-identical dossier.json (sha256 34a9a0bd…).
  app/ is 40,673 bytes in 4 files; dossier.json 412,574 bytes.

## Authorship

All site source (data.js, main.js, style.css, index.html, serve.ts, main.ts)
was written by hand in this session. The only copied file is
vendor/makefun-frontend.ts, byte-identical to the kit (sha256 verified
against kit.json). No starter files were copied; no chart library vendored.
main.ts was written first, then revised once (success log line) after the
first test run.
