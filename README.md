# Indonesia in Numbers

[![Make.fun competition](https://make.fun/badge/best-national-statistics-site-20261126-0539.svg)](https://make.fun/c/best-national-statistics-site-20261126-0539)
[![Rank](https://make.fun/badge/best-national-statistics-site-20261126-0539/kontentok413-pixel/indonesia-statistics/rank.svg)](https://make.fun/c/best-national-statistics-site-20261126-0539)
[![Reward](https://make.fun/badge/best-national-statistics-site-20261126-0539/kontentok413-pixel/indonesia-statistics/reward.svg)](https://make.fun/c/best-national-statistics-site-20261126-0539)

An independent atlas of Indonesian statistics, 2015–2024: population, economy,
health, education and provinces — every figure sourced, nothing estimated.
Built for the [Make the best national statistics site](https://make.fun/c/best-national-statistics-site-20261126-0539)
bounty on make.fun.

## What it is

A static site under `app/` — no build step, no network requests. Open
`app/index.html` in a browser (or serve `app/` with any static server) and it
works on desktop and on a phone. Six pages, reached by links in the header:

- **Overview** — the country in six headline numbers, two trend charts, a
  2015 / 2020 / 2024 comparison table, and links to every topic.
- **Population** — 283.5 million people, age structure, urban share, with a
  total / annual-growth toggle.
- **Economy** — GDP, growth, prices, jobs and poverty, with a GDP total /
  per-person toggle and a choice of unemployment measure.
- **Health** — life expectancy, child mortality and stunting, with switchable
  indicator tabs.
- **Education** — schooling years and the Human Development Index.
- **Provinces** — Java against the rest of the archipelago, with a province
  picker and a sortable table.

Charts are hand-rolled SVG in `app/main.js` — no chart library. All data lives
in `app/data.js`, with a source under every chart and table.

## Run it

```sh
node serve.ts            # serves app/ at http://localhost:8080
node serve.ts --port 8090
```

Or serve `app/` with any static HTTP server. The site loads nothing from
another origin: no fonts, no images, no requests beyond its own four files.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes
`out/dossier.json` with the vendored make.fun library.

## Data

Statistics Indonesia (BPS), the World Bank's World Development Indicators,
the United Nations (World Population Prospects 2024), and Indonesia's Ministry
of Health (SSGI 2024). Where two official measures differ — BPS's open
unemployment rate (4.87%) against the ILO-modelled estimate (3.30%), or the
World Bank's life expectancy (71.3 years) against BPS's HDI figure (74.15) —
both are shown and the difference is explained on the page. See `PLAN.md`
for the verification log.

This is an independent project, not affiliated with BPS or the World Bank.

## Referral

Built with make.fun — try it yourself with referral code `x941ctam`:
https://make.fun/r/x941ctam
