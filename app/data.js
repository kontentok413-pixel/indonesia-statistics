// Indonesia in Numbers — the data file.
//
// Every figure below was checked against its source before it was typed in:
// World Bank World Development Indicators (api.worldbank.org, current vintage),
// Statistics Indonesia / BPS (bps.go.id press releases and publications),
// the United Nations World Population Prospects 2024 revision, and the
// Ministry of Health's Indonesian Nutritional Status Survey (SSGI) 2024.
// Where two official measures differ (unemployment, life expectancy), both are
// shown and the difference is explained in the page text. Nothing here is
// estimated by us: series that could not be verified were left out.

export const YEARS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024];

// Headline figures, all for 2024 unless noted.
export const HEADLINE = {
  population: { value: 283.5, unit: "million people", note: "World rank 4" },
  gdp: { value: 1396.3, unit: "billion US$", note: "World rank 16" },
  growth: { value: 5.03, unit: "% year on year", note: "Real GDP growth" },
  gdpPerCapita: { value: 4925, unit: "US$ per person", note: "PPP: $16,472" },
  inflation: { value: 2.18, unit: "%, CPI annual average", note: "BPS Dec y/y: 1.57%" },
  lifeExpectancy: { value: 71.3, unit: "years at birth", note: "Women 73.4 · Men 69.2" },
};

// Annual series, 2015-2024, in YEARS order.
export const SERIES = {
  // World Bank WDI, indicator SP.POP.TOTL, millions of people.
  population: [261.8, 264.6, 267.3, 270.0, 272.5, 274.8, 276.8, 278.8, 281.2, 283.5],
  // World Bank WDI, GDP per capita (NY.GDP.PCAP.CD) times population; $ billion.
  gdp: [860.9, 931.9, 1015.6, 1042.3, 1119.1, 1059.1, 1186.5, 1319.1, 1371.2, 1396.3],
  // World Bank WDI, GDP per capita, current US$.
  gdpPerCapita: [3288, 3521, 3799, 3861, 4107, 3854, 4287, 4731, 4876, 4925],
  // World Bank WDI, GDP per capita PPP, current international $.
  gdpPerCapitaPpp: [10028, 10263, 10688, 11372, 11986, 11729, 12757, 14283, 15428, 16472],
  // BPS / World Bank WDI NY.GDP.MKTP.KD.ZG, real GDP growth, percent.
  growth: [4.88, 5.03, 5.07, 5.17, 5.02, -2.07, 3.70, 5.31, 5.05, 5.03],
  // World Bank WDI, inflation in consumer prices, annual average, percent.
  inflation: [6.36, 3.53, 3.81, 3.20, 3.03, 1.92, 1.56, 4.21, 3.67, 2.18],
  // BPS open unemployment rate (Tingkat Pengangguran Terbuka), August, percent.
  unemploymentBps: [6.18, 5.56, 5.42, 5.20, 5.11, 6.01, 6.38, 5.85, 5.39, 4.87],
  // World Bank WDI, unemployment modelled ILO estimate, percent.
  unemploymentIlo: [4.51, 4.30, 3.78, 4.39, 3.59, 4.26, 3.83, 3.46, 3.31, 3.30],
  // BPS poverty headcount, March, percent of population.
  poverty: [11.22, 10.86, 10.64, 9.82, 9.41, 9.78, 10.14, 9.54, 9.36, 9.03],
  // World Bank WDI, life expectancy at birth, years.
  lifeExpectancy: [69.52, 69.73, 69.95, 70.08, 70.35, 68.82, 67.45, 70.93, 71.15, 71.29],
  // World Bank WDI, mortality under five, per 1,000 live births.
  underFiveMortality: [26.1, 25.0, 23.8, 22.8, 21.8, 20.8, 19.9, 19.1, 18.4, 17.7],
  // World Bank WDI, infant mortality, per 1,000 live births.
  infantMortality: [21.9, 21.0, 20.1, 19.3, 18.5, 17.7, 17.0, 16.3, 15.7, 15.2],
  // BPS Human Development Index (IPM), 0-100.
  hdi: [69.55, 70.18, 70.81, 71.39, 71.92, 72.81, 73.16, 73.77, 74.39, 75.02],
};

// Schooling, 2020-2024 only: the BPS HDI press release (No. 85/11/Th.XXVII,
// 15 Nov 2024) prints these five years. Earlier years are not shown.
export const SCHOOLING_YEARS = [2020, 2021, 2022, 2023, 2024];
export const SCHOOLING = {
  // BPS mean years of schooling, population 25+, years.
  meanYears: [8.48, 8.54, 8.69, 8.77, 8.85],
  // BPS expected years of schooling, age 7, years.
  expectedYears: [12.98, 13.08, 13.10, 13.15, 13.21],
};

// Age structure, 2024 (UN World Population Prospects 2024).
export const AGE_STRUCTURE = [
  { group: "0–14 years", share: 24.6 },
  { group: "15–64 years", share: 68.1 },
  { group: "65+ years", share: 7.3 },
];

// The six provinces of Java, 2024. Populations are BPS mid-year figures as
// published in the ICSEMA 2025 proceedings (BPS source table); GRDP order is
// the ranking BPS reports (Jakarta first, then East Java, then West Java).
export const JAVA_PROVINCES = [
  { name: "West Java", pop: 50.49, grdpRank: 3, note: "Manufacturing heartland" },
  { name: "East Java", pop: 41.71, grdpRank: 2, note: "Industry and trade hub" },
  { name: "Central Java", pop: 38.28, grdpRank: 4, note: "Trade and services" },
  { name: "Banten", pop: 12.63, grdpRank: 5, note: "Industry west of Jakarta" },
  { name: "Jakarta", pop: 11.14, grdpRank: 1, note: "Capital; finance and services" },
  { name: "Yogyakarta", pop: 3.73, grdpRank: 6, note: "Education and culture" },
];

export const FACTS = {
  provincesCount: 38,
  javaPopShare: 55.7,
  javaGdpShare: 58,
  urbanShare: 58.8,
  medianAge: 30.1,
  stunting2024: 19.8,
  stunting2013: 37.6,
  stuntingHighest: { province: "East Nusa Tenggara", value: 37 },
  hdiHighest: { province: "Jakarta", value: 84.15 },
  hdiLowest: { province: "Papua Pegunungan", value: 54.91 },
  primaryEnrolment: 97.89,
  healthyLifeExpectancy: 63.7,
  gini: 0.379,
  // BPS life expectancy used inside the HDI (own mortality tables), 2024.
  lifeExpectancyBps: 74.15,
};

export const SOURCES = {
  population: "World Bank, World Development Indicators (SP.POP.TOTL); UN World Population Prospects 2024",
  gdp: "World Bank, World Development Indicators (NY.GDP.PCAP.CD × population)",
  growth: "Statistics Indonesia (BPS); World Bank WDI (NY.GDP.MKTP.KD.ZG)",
  inflation: "World Bank, World Development Indicators (FP.CPI.TOTL.ZG)",
  unemployment: "Statistics Indonesia (BPS), open unemployment rate, August; World Bank WDI modelled ILO estimate",
  poverty: "Statistics Indonesia (BPS), poverty headcount, March",
  health: "World Bank, World Development Indicators (SP.DYN.LE00.IN; SH.DYN.MORT; SP.DYN.IMRT.IN)",
  education: "Statistics Indonesia (BPS), Human Development Index 2024, press release No. 85/11/Th.XXVII",
  provinces: "Statistics Indonesia (BPS) via ICSEMA 2025 proceedings; BPS, Human Development Index 2024",
  stunting: "Ministry of Health, Indonesian Nutritional Status Survey (SSGI) 2024",
};
