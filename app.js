const endpoint = "https://db1.wspr.live/";
const geocodeEndpoint = "https://nominatim.openstreetmap.org/search";
const kpEndpoint = "https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json";
const rbnEndpoint = "https://www.reversebeacon.net/spots.php";
const rbnPageEndpoint = "https://www.reversebeacon.net/main.php";
const rbnVersionHash = "ab6db5";

const knownRegions = {
  scotland: { name: "Scotland", lat: 56.8, lon: -4.2, latMin: 54.5, latMax: 61.1, lonMin: -8.9, lonMax: -0.5 },
  england: { name: "England", lat: 52.5, lon: -1.5, latMin: 49.8, latMax: 55.9, lonMin: -6.5, lonMax: 1.9 },
  wales: { name: "Wales", lat: 52.3, lon: -3.8, latMin: 51.3, latMax: 53.5, lonMin: -5.4, lonMax: -2.6 },
  ireland: { name: "Ireland", lat: 53.4, lon: -8.2, latMin: 51.3, latMax: 55.5, lonMin: -10.7, lonMax: -5.4 },
  "united kingdom": { name: "United Kingdom", lat: 54.6, lon: -3.4, latMin: 49.8, latMax: 60.9, lonMin: -8.7, lonMax: 1.9 },
  uk: { name: "United Kingdom", lat: 54.6, lon: -3.4, latMin: 49.8, latMax: 60.9, lonMin: -8.7, lonMax: 1.9 },
  "new zealand": { name: "New Zealand", lat: -41.2, lon: 173.0, latMin: -47.5, latMax: -34.0, lonMin: 166.0, lonMax: 179.9 },
  japan: { name: "Japan", lat: 37.5, lon: 138.4, latMin: 30.0, latMax: 46.0, lonMin: 129.0, lonMax: 146.5 },
  "united states": { name: "United States", lat: 39.5, lon: -98.4, latMin: 24.0, latMax: 49.5, lonMin: -125.0, lonMax: -66.0 },
  usa: { name: "United States", lat: 39.5, lon: -98.4, latMin: 24.0, latMax: 49.5, lonMin: -125.0, lonMax: -66.0 },
  us: { name: "United States", lat: 39.5, lon: -98.4, latMin: 24.0, latMax: 49.5, lonMin: -125.0, lonMax: -66.0 },
  "usa east": { name: "USA East Coast", lat: 38.0, lon: -74.5, latMin: 25.0, latMax: 47.6, lonMin: -82.5, lonMax: -66.0 },
  "usa east coast": { name: "USA East Coast", lat: 38.0, lon: -74.5, latMin: 25.0, latMax: 47.6, lonMin: -82.5, lonMax: -66.0 },
  "us east coast": { name: "USA East Coast", lat: 38.0, lon: -74.5, latMin: 25.0, latMax: 47.6, lonMin: -82.5, lonMax: -66.0 },
  "east coast usa": { name: "USA East Coast", lat: 38.0, lon: -74.5, latMin: 25.0, latMax: 47.6, lonMin: -82.5, lonMax: -66.0 },
  "eastern united states": { name: "USA East Coast", lat: 38.0, lon: -74.5, latMin: 25.0, latMax: 47.6, lonMin: -82.5, lonMax: -66.0 },
  "usa west": { name: "USA West Coast", lat: 39.0, lon: -122.0, latMin: 32.0, latMax: 49.2, lonMin: -125.0, lonMax: -116.0 },
  "usa west coast": { name: "USA West Coast", lat: 39.0, lon: -122.0, latMin: 32.0, latMax: 49.2, lonMin: -125.0, lonMax: -116.0 },
  "us west coast": { name: "USA West Coast", lat: 39.0, lon: -122.0, latMin: 32.0, latMax: 49.2, lonMin: -125.0, lonMax: -116.0 },
  "west coast usa": { name: "USA West Coast", lat: 39.0, lon: -122.0, latMin: 32.0, latMax: 49.2, lonMin: -125.0, lonMax: -116.0 },
  "western united states": { name: "USA West Coast", lat: 39.0, lon: -122.0, latMin: 32.0, latMax: 49.2, lonMin: -125.0, lonMax: -116.0 },
  france: { name: "France", lat: 46.6, lon: 2.2, latMin: 41.3, latMax: 51.2, lonMin: -5.2, lonMax: 9.7 },
  germany: { name: "Germany", lat: 51.1, lon: 10.4, latMin: 47.2, latMax: 55.1, lonMin: 5.8, lonMax: 15.1 },
  spain: { name: "Spain", lat: 40.2, lon: -3.7, latMin: 36.0, latMax: 43.9, lonMin: -9.4, lonMax: 3.4 },
  portugal: { name: "Portugal", lat: 39.5, lon: -8.0, latMin: 36.9, latMax: 42.2, lonMin: -9.6, lonMax: -6.1 },
  italy: { name: "Italy", lat: 42.8, lon: 12.5, latMin: 36.6, latMax: 47.1, lonMin: 6.6, lonMax: 18.6 },
  canada: { name: "Canada", lat: 56.1, lon: -106.3, latMin: 41.7, latMax: 70.0, lonMin: -141.0, lonMax: -52.6 },
  australia: { name: "Australia", lat: -25.3, lon: 133.8, latMin: -43.8, latMax: -10.0, lonMin: 113.0, lonMax: 154.0 },
  brazil: { name: "Brazil", lat: -10.8, lon: -53.1, latMin: -33.8, latMax: 5.3, lonMin: -73.9, lonMax: -34.7 }
};

const specialCqZones = {
  1: { name: "CQ Zone 1 - Northwest North America", lat: 50, lon: -145, latMin: 45, latMax: 90, lonMin: -170, lonMax: -115 },
  2: { name: "CQ Zone 2 - Northeast North America", lat: 55, lon: -75, latMin: 45, latMax: 90, lonMin: -115, lonMax: -45 },
  3: { name: "CQ Zone 3 - Western USA/Canada", lat: 39, lon: -119, latMin: 25, latMax: 55, lonMin: -130, lonMax: -108 },
  4: { name: "CQ Zone 4 - Central North America", lat: 40, lon: -96, latMin: 24, latMax: 56, lonMin: -110, lonMax: -84 },
  5: { name: "CQ Zone 5 - Eastern North America", lat: 40, lon: -74, latMin: 24, latMax: 56, lonMin: -86, lonMax: -58 },
  14: { name: "CQ Zone 14 - Western Europe", lat: 52, lon: 2, latMin: 35, latMax: 62, lonMin: -12, lonMax: 16 },
  15: { name: "CQ Zone 15 - Central Europe", lat: 49, lon: 18, latMin: 35, latMax: 62, lonMin: 10, lonMax: 32 },
  16: { name: "CQ Zone 16 - Eastern Europe", lat: 52, lon: 37, latMin: 40, latMax: 70, lonMin: 28, lonMax: 60 },
  25: { name: "CQ Zone 25 - Japan", lat: 37, lon: 138, latMin: 30, latMax: 46, lonMin: 129, lonMax: 146 },
  27: { name: "CQ Zone 27 - Philippines region", lat: 13, lon: 122, latMin: 4, latMax: 22, lonMin: 116, lonMax: 128 },
  30: { name: "CQ Zone 30 - Australia", lat: -25, lon: 134, latMin: -44, latMax: -10, lonMin: 112, lonMax: 154 },
  32: { name: "CQ Zone 32 - New Zealand/Pacific", lat: -36, lon: 174, latMin: -50, latMax: -10, lonMin: 160, lonMax: 180 }
};

const specialItuZones = {
  1: { name: "ITU Zone 1 - Northwest North America", lat: 62, lon: -150, latMin: 50, latMax: 90, lonMin: -170, lonMax: -125 },
  2: { name: "ITU Zone 2 - Northern North America", lat: 58, lon: -105, latMin: 45, latMax: 75, lonMin: -130, lonMax: -80 },
  6: { name: "ITU Zone 6 - Eastern North America", lat: 40, lon: -75, latMin: 25, latMax: 55, lonMin: -90, lonMax: -58 },
  27: { name: "ITU Zone 27 - UK/Ireland/Western Europe", lat: 55, lon: -4, latMin: 49, latMax: 61.5, lonMin: -11, lonMax: 3 },
  28: { name: "ITU Zone 28 - Western/Central Europe", lat: 49, lon: 9, latMin: 42, latMax: 58, lonMin: 0, lonMax: 18 },
  29: { name: "ITU Zone 29 - Northern Europe", lat: 60, lon: 18, latMin: 55, latMax: 72, lonMin: 5, lonMax: 32 },
  45: { name: "ITU Zone 45 - Japan", lat: 37, lon: 138, latMin: 30, latMax: 46, lonMin: 129, lonMax: 146 },
  59: { name: "ITU Zone 59 - New Zealand", lat: -41, lon: 173, latMin: -48, latMax: -34, lonMin: 166, lonMax: 180 },
  60: { name: "ITU Zone 60 - Eastern Australia", lat: -27, lon: 145, latMin: -44, latMax: -10, lonMin: 136, lonMax: 154 }
};

const geocodeCache = new Map();
const countryTimers = new Map();

const bands = [1, 3, 5, 7, 10, 14, 18, 21, 24, 28, 50];
const bandSqlList = bands.join(",");
const liveRowLimit = 1200;
const spotDistanceKmExpr = "greatCircleDistance(tx_lon, tx_lat, rx_lon, rx_lat) / 1000";
const validSpotCoordsSql = `
        AND tx_lat BETWEEN -90 AND 90
        AND rx_lat BETWEEN -90 AND 90
        AND tx_lon BETWEEN -180 AND 180
        AND rx_lon BETWEEN -180 AND 180`;
const bandLabels = new Map([
  [1, "160m"], [3, "80m"], [5, "60m"], [7, "40m"], [10, "30m"], [14, "20m"],
  [18, "17m"], [21, "15m"], [24, "12m"], [28, "10m"], [50, "6m"]
]);
const bandColors = new Map([
  [1, "#a78bfa"], [3, "#60a5fa"], [5, "#22d3ee"], [7, "#26d07c"], [10, "#84cc16"], [14, "#f6c945"],
  [18, "#fb923c"], [21, "#f05a28"], [24, "#f472b6"], [28, "#ff5c67"], [50, "#c084fc"]
]);
const countryPrefixes = [
  [/^(2M|GM|MM|MS)/, "Scotland"],
  [/^(G|M|2E)/, "England"],
  [/^(GW|MW|2W)/, "Wales"],
  [/^(GI|MI|2I)/, "Northern Ireland"],
  [/^(EI|EJ)/, "Ireland"],
  [/^(ZL)/, "New Zealand"],
  [/^(VK)/, "Australia"],
  [/^(JA|JE|JF|JG|JH|JI|JJ|JK|JL|JM|JN|JO|JP|JQ|JR|JS|7J|7K|7L|7M|7N|8J|8N)/, "Japan"],
  [/^(K|N|W|AA|AB|AC|AD|AE|AF|AG|AI|AJ|AK|KA|KB|KC|KD|KE|KF|KG|KI|KJ|KK|KL|KM|KN|KO|KP|KQ|KR|KS|KT|KU|KV|KW|KX|KY|KZ)/, "United States"],
  [/^(VE|VA|VO|VY)/, "Canada"],
  [/^(F|TM)/, "France"],
  [/^(DL|DA|DB|DC|DD|DE|DF|DG|DH|DJ|DK|DM|DN|DO|DP|DQ|DR)/, "Germany"],
  [/^(EA|EB|EC|ED|EE|EF|EG|EH|AM|AN|AO)/, "Spain"],
  [/^(CT|CS|CR)/, "Portugal"],
  [/^(I|IK|IU|IZ)/, "Italy"],
  [/^(PY|PP|PQ|PR|PS|PT|PU|PV|PW|PX|ZV|ZW|ZX|ZY|ZZ)/, "Brazil"],
  [/^(PA|PB|PC|PD|PE|PF|PG|PH|PI)/, "Netherlands"],
  [/^(ON|OO|OP|OQ|OR|OS|OT)/, "Belgium"],
  [/^(HB9|HB4|HB3)/, "Switzerland"],
  [/^(OE)/, "Austria"],
  [/^(LA|LB|LC|LD|LE|LF|LG|LH|LI|LJ|LK|LL|LM|LN)/, "Norway"],
  [/^(SM|SA|SB|SC|SD|SE|SF|SG|SH|SI|SJ|SK|SL|SM)/, "Sweden"],
  [/^(OH|OF|OG|OI)/, "Finland"],
  [/^(OZ|5P|5Q)/, "Denmark"],
  [/^(SP|SQ|SN|SO|HF|3Z)/, "Poland"],
  [/^(SR)/, "Poland"],
  [/^(OK|OL)/, "Czechia"],
  [/^(OM)/, "Slovakia"],
  [/^(HA|HG)/, "Hungary"],
  [/^(9A)/, "Croatia"],
  [/^(YU|YT|YZ)/, "Serbia"],
  [/^(LZ)/, "Bulgaria"],
  [/^(YO|YR)/, "Romania"],
  [/^(SV|SX|SY|SZ)/, "Greece"],
  [/^(LX)/, "Luxembourg"],
  [/^(YL)/, "Latvia"],
  [/^(R|RA|RB|RC|RD|RE|RF|RG|RH|RI|RJ|RK|RL|RM|RN|RO|RP|RQ|RR|RS|RT|RU|RV|RW|RX|RY|RZ|UA|UB|UC|UD|UE|UF|UG|UH|UI)/, "Russia"],
  [/^(TA|TB|TC|YM)/, "Turkey"],
  [/^(4X|4Z)/, "Israel"],
  [/^(ZS|ZR|ZU)/, "South Africa"],
  [/^(LU|LW|AY|AZ)/, "Argentina"],
  [/^(CX)/, "Uruguay"],
  [/^(CE|XQ|XR|3G)/, "Chile"],
  [/^(YB|YC|YD|YE|YF|YG|YH)/, "Indonesia"],
  [/^(DU|DV|DW|DX|4D|4E|4F|4G|4H|4I)/, "Philippines"],
  [/^(HL|DS|DT|D7|D8|D9|6K|6L|6M|6N)/, "South Korea"],
  [/^(BY|BA|BD|BG|BH|BI|BJ|BL|BM|BN|BO|BP|BQ|BR|BS|BT|BU|BV|BW|BX|3H|3I|3J|3K|3L|3M|3N|3O|3P|3Q|3R|3S|3T|3U)/, "China"]
];

const els = {
  aMode: document.querySelector("#aMode"),
  aCountry: document.querySelector("#aCountry"),
  aInputLabel: document.querySelector("#aInputLabel"),
  aCountryOptions: document.querySelector("#aCountryOptions"),
  aSuggestions: document.querySelector("#aSuggestions"),
  bMode: document.querySelector("#bMode"),
  bCountry: document.querySelector("#bCountry"),
  bInputLabel: document.querySelector("#bInputLabel"),
  bCountryOptions: document.querySelector("#bCountryOptions"),
  bSuggestions: document.querySelector("#bSuggestions"),
  modeNote: document.querySelector("#modeNote"),
  period: document.querySelector("#period"),
  direction: document.querySelector("#direction"),
  liveWindow: document.querySelector("#liveWindow"),
  liveDirection: document.querySelector("#liveDirection"),
  liveMinDistance: document.querySelector("#liveMinDistance"),
  liveRefreshBtn: document.querySelector("#liveRefreshBtn"),
  refreshBtn: document.querySelector("#refreshBtn"),
  runBtn: document.querySelector("#runBtn"),
  status: document.querySelector("#status"),
  spaceWeather: document.querySelector("#spaceWeather"),
  spaceWeatherGauge: document.querySelector("#spaceWeatherGauge"),
  spaceWeatherScore: document.querySelector("#spaceWeatherScore"),
  spaceWeatherTitle: document.querySelector("#spaceWeatherTitle"),
  spaceWeatherBody: document.querySelector("#spaceWeatherBody"),
  customDetails: document.querySelector("#customDetails"),
  heatmap: document.querySelector("#heatmap"),
  pathMap: document.querySelector("#pathMap"),
  mapMeta: document.querySelector("#mapMeta"),
  liveMap: document.querySelector("#liveMap"),
  liveMapMeta: document.querySelector("#liveMapMeta"),
  liveBands: document.querySelector("#liveBands"),
  liveCountries: document.querySelector("#liveCountries"),
  livePower: document.querySelector("#livePower"),
  liveSummary: document.querySelector("#liveSummary"),
  bandChanceList: document.querySelector("#bandChanceList"),
  bandDetailPanel: document.querySelector("#bandDetailPanel"),
  bandDetailTitle: document.querySelector("#bandDetailTitle"),
  bandDetailMeta: document.querySelector("#bandDetailMeta"),
  bandCountrySummary: document.querySelector("#bandCountrySummary"),
  bandSpotTable: document.querySelector("#bandSpotTable"),
  pathMinDistance: document.querySelector("#pathMinDistance"),
  queryMeta: document.querySelector("#queryMeta"),
  rbnCall: document.querySelector("#rbnCall"),
  rbnWindow: document.querySelector("#rbnWindow"),
  rbnMinDistance: document.querySelector("#rbnMinDistance"),
  rbnRunBtn: document.querySelector("#rbnRunBtn"),
  rbnMeta: document.querySelector("#rbnMeta"),
  rbnMap: document.querySelector("#rbnMap"),
  rbnTable: document.querySelector("#rbnTable"),
  rbnSummary: document.querySelector("#rbnSummary"),
  aName: document.querySelector("#aName"),
  aLatMin: document.querySelector("#aLatMin"),
  aLatMax: document.querySelector("#aLatMax"),
  aLonMin: document.querySelector("#aLonMin"),
  aLonMax: document.querySelector("#aLonMax"),
  bName: document.querySelector("#bName"),
  bLatMin: document.querySelector("#bLatMin"),
  bLatMax: document.querySelector("#bLatMax"),
  bLonMin: document.querySelector("#bLonMin"),
  bLonMax: document.querySelector("#bLonMax")
};

let currentQueryContext = null;
let currentPathMinDistance = 0;

function normaliseName(value) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function bandLabel(band) {
  return bandLabels.get(Number(band)) || `${band} MHz`;
}

function bandColor(band) {
  return bandColors.get(Number(band)) || "#bad4ef";
}

function spotCountText(count) {
  const clean = Number(count) || 0;
  return `${clean.toLocaleString()} ${clean === 1 ? "spot" : "spots"}`;
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function normaliseCallsign(callsign) {
  const clean = String(callsign || "").toUpperCase().trim();
  if (!clean.includes("/")) return clean;
  const parts = clean.split("/").filter(Boolean);
  return parts.find((part) => /[A-Z]/.test(part) && /\d/.test(part)) || parts[0] || clean;
}

function callsignCountry(callsign) {
  const clean = normaliseCallsign(callsign);
  const match = countryPrefixes.find(([pattern]) => pattern.test(clean));
  return match ? match[1] : "Unknown";
}

function liveWorkability(row) {
  const snr100w = scaledSnr(row.snr, row.power);
  return { snr100w, rank: modeRank(snr100w) };
}

function setStatus(message, isError = false) {
  els.status.textContent = message;
  els.status.classList.toggle("error", isError);
}

function boundingBox(boxes) {
  const list = boxes.filter(Boolean);
  return {
    latMin: Math.min(...list.map((box) => Number(box.latMin))),
    latMax: Math.max(...list.map((box) => Number(box.latMax))),
    lonMin: Math.min(...list.map((box) => Number(box.lonMin))),
    lonMax: Math.max(...list.map((box) => Number(box.lonMax)))
  };
}

function fillBox(prefix, box) {
  const boxes = box.boxes || [box];
  const bounds = boundingBox(boxes);
  els[`${prefix}Name`].value = box.name;
  els[`${prefix}Name`].dataset.lat = box.lat ?? "";
  els[`${prefix}Name`].dataset.lon = box.lon ?? "";
  els[`${prefix}Name`].dataset.boxes = JSON.stringify(boxes);
  els[`${prefix}LatMin`].value = bounds.latMin;
  els[`${prefix}LatMax`].value = bounds.latMax;
  els[`${prefix}LonMin`].value = bounds.lonMin;
  els[`${prefix}LonMax`].value = bounds.lonMax;
  updateMapFromBoxes();
}

function pointInRegion(lat, lon, box) {
  const pointLat = Number(lat);
  const pointLon = Number(lon);
  if (!Number.isFinite(pointLat) || !Number.isFinite(pointLon) || !box) return false;
  const boxes = box.boxes?.length ? box.boxes : [box];
  return boxes.some((part) =>
    pointLat >= Number(part.latMin) &&
    pointLat <= Number(part.latMax) &&
    pointLon >= Number(part.lonMin) &&
    pointLon <= Number(part.lonMax)
  );
}

function isAnywhereTarget(prefix = "b") {
  return !els[`${prefix}Country`].value.trim();
}

function updateMapFromBoxes() {
  try {
    renderPathMap(readBox("a"), isAnywhereTarget("b") ? null : readBox("b"));
  } catch (error) {
    // The map will render once both region boxes contain valid numbers.
  }
}

function boxCenter(box) {
  return {
    lat: Number.isFinite(Number(box.lat)) ? Number(box.lat) : (Number(box.latMin) + Number(box.latMax)) / 2,
    lon: Number.isFinite(Number(box.lon)) ? Number(box.lon) : (Number(box.lonMin) + Number(box.lonMax)) / 2
  };
}

function interpolateLatitudeY(lat) {
  const anchors = [
    { lat: 90, y: 0 },
    { lat: 75, y: 95 },
    { lat: 60, y: 245 },
    { lat: 50, y: 345 },
    { lat: 40, y: 430 },
    { lat: 20, y: 545 },
    { lat: 0, y: 640 },
    { lat: -20, y: 765 },
    { lat: -40, y: 890 },
    { lat: -55, y: 960 },
    { lat: -90, y: 1024 }
  ];
  const clamped = Math.max(-90, Math.min(90, Number(lat)));
  for (let index = 0; index < anchors.length - 1; index += 1) {
    const upper = anchors[index];
    const lower = anchors[index + 1];
    if (clamped <= upper.lat && clamped >= lower.lat) {
      const progress = (upper.lat - clamped) / (upper.lat - lower.lat);
      return upper.y + (lower.y - upper.y) * progress;
    }
  }
  return anchors[anchors.length - 1].y;
}

function mapProject(point) {
  const viewWidth = 1536;
  const viewHeight = 1024;
  const x = 704 + Number(point.lon) * 4.22;
  return {
    x: Math.max(14, Math.min(viewWidth - 14, x)),
    y: Math.max(14, Math.min(viewHeight - 14, interpolateLatitudeY(point.lat)))
  };
}

function greatCircleKm(latA, lonA, latB, lonB) {
  const toRad = (value) => Number(value) * Math.PI / 180;
  const aLat = toRad(latA);
  const bLat = toRad(latB);
  const dLat = toRad(Number(latB) - Number(latA));
  const dLon = toRad(Number(lonB) - Number(lonA));
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(aLat) * Math.cos(bLat) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function renderPathMap(a, b = null) {
  const aCenter = boxCenter(a);
  const viewWidth = 1536;
  const viewHeight = 1024;
  const aPoint = mapProject(aCenter);
  const labelX = (point) => Math.min(viewWidth - 240, Math.max(24, point.x + 18));
  const labelY = (point) => Math.min(viewHeight - 30, Math.max(36, point.y - 16));
  if (!b) {
    const remotePoints = [
      { lat: 56, lon: -105 },
      { lat: 39, lon: -96 },
      { lat: -15, lon: -55 },
      { lat: -25, lon: 134 },
      { lat: -41, lon: 174 },
      { lat: 35, lon: 104 }
    ].map(mapProject);
    const route = (point) => {
      const dx = point.x - aPoint.x;
      const dy = point.y - aPoint.y;
      const curve = Math.min(190, Math.max(70, Math.hypot(dx, dy) * 0.14));
      const midX = (aPoint.x + point.x) / 2;
      const midY = (aPoint.y + point.y) / 2 - curve;
      return `M ${aPoint.x.toFixed(1)} ${aPoint.y.toFixed(1)} Q ${midX.toFixed(1)} ${midY.toFixed(1)} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
    };
    els.mapMeta.textContent = `${a.name} to anywhere`;
    els.pathMap.innerHTML = `
      <svg viewBox="0 0 ${viewWidth} ${viewHeight}" role="img" aria-label="${a.name} to anywhere path">
        <image class="map-base" href="world-map.png" x="0" y="0" width="${viewWidth}" height="${viewHeight}" preserveAspectRatio="none"></image>
        ${remotePoints.map((point) => `<path class="map-route-shadow map-route-fan" d="${route(point)}"></path>`).join("")}
        ${remotePoints.map((point) => `<path class="map-route map-route-fan" d="${route(point)}"></path>`).join("")}
        <circle class="map-pin a" cx="${aPoint.x.toFixed(1)}" cy="${aPoint.y.toFixed(1)}" r="12"></circle>
        <text class="map-label" x="${labelX(aPoint).toFixed(1)}" y="${labelY(aPoint).toFixed(1)}">${a.name}</text>
        <text class="map-label anywhere" x="1180" y="890">Anywhere</text>
      </svg>
    `;
    return;
  }
  const bCenter = boxCenter(b);
  const bPoint = mapProject(bCenter);
  const dx = bPoint.x - aPoint.x;
  const dy = bPoint.y - aPoint.y;
  const curve = Math.min(190, Math.max(70, Math.hypot(dx, dy) * 0.16));
  const midX = (aPoint.x + bPoint.x) / 2;
  const midY = (aPoint.y + bPoint.y) / 2 - curve;
  els.mapMeta.textContent = `${a.name} to ${b.name}`;
  els.pathMap.innerHTML = `
    <svg viewBox="0 0 ${viewWidth} ${viewHeight}" role="img" aria-label="${a.name} to ${b.name} path">
      <image class="map-base" href="world-map.png" x="0" y="0" width="${viewWidth}" height="${viewHeight}" preserveAspectRatio="none"></image>
      <path class="map-route-shadow" d="M ${aPoint.x.toFixed(1)} ${aPoint.y.toFixed(1)} Q ${midX.toFixed(1)} ${midY.toFixed(1)} ${bPoint.x.toFixed(1)} ${bPoint.y.toFixed(1)}"></path>
      <path class="map-route" d="M ${aPoint.x.toFixed(1)} ${aPoint.y.toFixed(1)} Q ${midX.toFixed(1)} ${midY.toFixed(1)} ${bPoint.x.toFixed(1)} ${bPoint.y.toFixed(1)}"></path>
      <circle class="map-pin a" cx="${aPoint.x.toFixed(1)}" cy="${aPoint.y.toFixed(1)}" r="12"></circle>
      <circle class="map-pin b" cx="${bPoint.x.toFixed(1)}" cy="${bPoint.y.toFixed(1)}" r="12"></circle>
      <text class="map-label" x="${labelX(aPoint).toFixed(1)}" y="${labelY(aPoint).toFixed(1)}">${a.name}</text>
      <text class="map-label" x="${labelX(bPoint).toFixed(1)}" y="${labelY(bPoint).toFixed(1)}">${b.name}</text>
    </svg>
  `;
}

function liveMinDistanceKm() {
  const value = Math.round(Number(els.liveMinDistance.value) || 0);
  const cleanValue = Math.max(0, Math.min(20040, value));
  els.liveMinDistance.value = String(cleanValue);
  return cleanValue;
}

function rbnMinDistanceKm() {
  const value = Math.round(Number(els.rbnMinDistance.value) || 0);
  const cleanValue = Math.max(0, Math.min(20040, value));
  els.rbnMinDistance.value = String(cleanValue);
  return cleanValue;
}

function cleanDistanceInput(input) {
  const value = Math.round(Number(input.value) || 0);
  const cleanValue = Math.max(0, Math.min(20040, value));
  input.value = String(cleanValue);
  return cleanValue;
}

function hasUsableRemoteGeo(row) {
  const lat = Number(row.remote_lat);
  const lon = Number(row.remote_lon);
  return Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180 &&
    !(lat === 0 && lon === 0) &&
    row.remoteCountry !== "Unknown";
}

function renderLiveMap(focus, rows, minutes, flow, minDistance = 0, totals = null) {
  const viewWidth = 1536;
  const viewHeight = 1024;
  const focusPoint = mapProject(boxCenter(focus));
  const totalSpots = Number(totals?.spots ?? rows.length);
  const enrichedRows = rows.map((row) => {
    const remoteSign = row.flow === "sent" ? row.rx_sign : row.tx_sign;
    const workability = liveWorkability(row);
    return { ...row, remoteSign, remoteCountry: callsignCountry(remoteSign), ...workability };
  }).filter(hasUsableRemoteGeo);
  const removedRows = rows.length - enrichedRows.length;
  const hotBands = [...enrichedRows.reduce((map, row) => {
    const band = Number(row.band);
    const current = map.get(band) || { band, spots: 0, workable: 0, bestRank: 0, bestSnr: -99, best100w: -99 };
    current.spots += 1;
    if (row.rank >= 1) current.workable += 1;
    current.bestRank = Math.max(current.bestRank, row.rank);
    current.bestSnr = Math.max(current.bestSnr, Number(row.snr));
    current.best100w = Math.max(current.best100w, row.snr100w);
    map.set(band, current);
    return map;
  }, new Map()).values()]
    .sort((a, b) => b.spots - a.spots || b.bestSnr - a.bestSnr)
    .slice(0, 6);
  const hotCountries = [...enrichedRows.reduce((map, row) => {
    const current = map.get(row.remoteCountry) || { country: row.remoteCountry, spots: 0, workable: 0, bestRank: 0, best100w: -99 };
    current.spots += 1;
    if (row.rank >= 1) current.workable += 1;
    current.bestRank = Math.max(current.bestRank, row.rank);
    current.best100w = Math.max(current.best100w, row.snr100w);
    map.set(row.remoteCountry, current);
    return map;
  }, new Map()).values()]
    .sort((a, b) => b.spots - a.spots || b.best100w - a.best100w)
    .slice(0, 6);
  const workableRows = enrichedRows.filter((row) => row.rank >= 1);
  const best100w = Math.max(-99, ...enrichedRows.map((row) => row.snr100w));
  const bestLiveRank = Math.max(0, ...enrichedRows.map((row) => row.rank));
  const maxSnr = Math.max(-30, ...enrichedRows.map((row) => Number(row.snr)));
  const minSnr = Math.min(10, ...enrichedRows.map((row) => Number(row.snr)));
  const strength = (snr) => {
    const range = Math.max(1, maxSnr - minSnr);
    return Math.max(0.18, Math.min(1, (Number(snr) - minSnr) / range));
  };
  const routes = enrichedRows.map((row, index) => {
    const sentFromFocus = row.flow === "sent";
    const remote = mapProject({ lat: Number(row.remote_lat), lon: Number(row.remote_lon) });
    const dx = remote.x - focusPoint.x;
    const dy = remote.y - focusPoint.y;
    const curve = Math.min(120, Math.max(45, Math.hypot(dx, dy) * 0.12));
    const midX = (focusPoint.x + remote.x) / 2;
    const midY = (focusPoint.y + remote.y) / 2 - curve;
    const alpha = strength(row.snr);
    const color = bandColor(row.band);
    return `
      <path class="live-route" style="--route-color:${color};--route-alpha:${alpha.toFixed(2)}" d="M ${focusPoint.x.toFixed(1)} ${focusPoint.y.toFixed(1)} Q ${midX.toFixed(1)} ${midY.toFixed(1)} ${remote.x.toFixed(1)} ${remote.y.toFixed(1)}"></path>
      <circle class="live-dot" style="--band-color:${color}" cx="${remote.x.toFixed(1)}" cy="${remote.y.toFixed(1)}" r="${Math.max(5, Math.min(13, 5 + alpha * 9)).toFixed(1)}">
        <title>${row.remoteSign} ${row.remoteCountry} ${bandLabel(row.band)} ${Number(row.distance).toLocaleString()} km, ${row.snr} dB, 100W est ${row.snr100w.toFixed(0)} dB</title>
      </circle>
      ${index < 10 ? `<text class="live-label" x="${Math.min(viewWidth - 230, Math.max(24, remote.x + 13)).toFixed(1)}" y="${Math.min(viewHeight - 28, Math.max(32, remote.y - 9)).toFixed(1)}">${bandLabel(row.band)}</text>` : ""}
    `;
  }).join("");
  const flowText = flow === "sent" ? "sent from" : flow === "heard" ? "heard in" : "sent/heard by";
  const distanceText = minDistance > 0 ? `, min ${minDistance.toLocaleString()} km` : "";
  const countText = enrichedRows.length < totalSpots
    ? `${enrichedRows.length.toLocaleString()} mapped of ${totalSpots.toLocaleString()} spots`
    : `${enrichedRows.length.toLocaleString()} mapped spots`;
  els.liveMapMeta.textContent = `${countText} ${flowText} ${focus.name}, last ${minutes} min${distanceText}`;
  els.liveBands.innerHTML = hotBands.length ? hotBands.map((band) => `
    <span class="live-band-chip" style="--band-color:${bandColor(band.band)}">
      <b>${bandLabel(band.band)}</b>
      <span>${spotCountText(band.spots)} · ${compactModeLabel(band.bestRank)}</span>
    </span>
  `).join("") : `<span class="live-band-empty">No hot bands in this window.</span>`;
  els.liveCountries.innerHTML = hotCountries.length ? hotCountries.map((item) => `
    <span class="live-country-chip">
      <b>${item.country}</b>
      <span>${spotCountText(item.spots)} · ${compactModeLabel(item.bestRank)}</span>
    </span>
  `).join("") : `<span class="live-band-empty">No hot countries in this window.</span>`;
  els.livePower.textContent = enrichedRows.length
    ? `100W estimate: ${workableRows.length.toLocaleString()} of ${enrichedRows.length.toLocaleString()} mapped spots reach at least FT8; strongest live mode ${compactModeLabel(bestLiveRank)}; best estimate ${best100w >= 0 ? "+" : ""}${best100w.toFixed(0)} dB.`
    : "100W estimate waiting for live spots.";
  els.liveSummary.textContent = enrichedRows.length
    ? `Farthest displayed spot ${enrichedRows[0].tx_sign} to ${enrichedRows[0].rx_sign} on ${bandLabel(enrichedRows[0].band)}, ${Number(enrichedRows[0].distance).toLocaleString()} km, ${enrichedRows[0].snr} dB, 100W est ${enrichedRows[0].snr100w >= 0 ? "+" : ""}${enrichedRows[0].snr100w.toFixed(0)} dB.`
    : `No geolocated live WSPR spots found for ${focus.name}${minDistance > 0 ? ` beyond ${minDistance.toLocaleString()} km` : ""} in the last ${minutes} minutes.`;
  if (removedRows > 0 && enrichedRows.length) {
    els.liveSummary.textContent += ` Removed ${removedRows.toLocaleString()} spot${removedRows === 1 ? "" : "s"} without usable station geography.`;
  }
  els.liveMap.innerHTML = `
    <svg viewBox="0 0 ${viewWidth} ${viewHeight}" role="img" aria-label="Live WSPR openings from ${focus.name}">
      <image class="map-base" href="world-map.png" x="0" y="0" width="${viewWidth}" height="${viewHeight}" preserveAspectRatio="none"></image>
      ${routes}
      <circle class="map-pin a live-focus" cx="${focusPoint.x.toFixed(1)}" cy="${focusPoint.y.toFixed(1)}" r="14"></circle>
      <text class="map-label" x="${Math.min(viewWidth - 240, Math.max(24, focusPoint.x + 18)).toFixed(1)}" y="${Math.min(viewHeight - 30, Math.max(36, focusPoint.y - 16)).toFixed(1)}">${focus.name}</text>
    </svg>
  `;
}

function rbnBandFromCode(code) {
  const lookup = new Map([[3, 160], [7, 80], [84, 60], [12, 40], [17, 30], [22, 20], [27, 17], [32, 15], [37, 12], [42, 10], [50, 6]]);
  return lookup.get(Number(code)) || Number(code);
}

function rbnBandColor(code) {
  const mhzBand = rbnBandFromCode(code);
  const wsprBand = mhzBand === 160 ? 1 : mhzBand === 80 ? 3 : mhzBand === 60 ? 5 : mhzBand === 40 ? 7 : mhzBand === 30 ? 10 : mhzBand === 20 ? 14 : mhzBand === 17 ? 18 : mhzBand === 15 ? 21 : mhzBand === 12 ? 24 : mhzBand === 10 ? 28 : 50;
  return bandColor(wsprBand);
}

function rbnUrl(call, seconds) {
  const maxAge = seconds >= 86400 ? "24,hours" : `${Math.max(1, Math.round(seconds / 60))},minutes`;
  const params = new URLSearchParams({
    spotted_call: call,
    modes: "cw",
    rows: "100",
    max_age: maxAge
  });
  return `${rbnPageEndpoint}?${params.toString()}`;
}

function parseRbnSpots(payload, call, minDistance = 0) {
  const callInfo = payload.call_info || {};
  return Object.entries(payload.spots || {}).map(([id, row]) => {
    const [de, freq, dx, db, wpm, time, diff, band, type, mode, epoch] = row;
    const deInfo = callInfo[de] || [];
    const dxInfo = callInfo[dx] || [];
    return {
      id,
      de,
      dx,
      freq,
      db: Number(db),
      wpm: Number(wpm),
      time,
      diff,
      band,
      bandMeters: rbnBandFromCode(band),
      mode,
      epoch: Number(epoch),
      deCountry: deInfo[1] || "",
      dxCountry: dxInfo[1] || "",
      deLat: Number(deInfo[6]),
      deLon: Number(deInfo[7]),
      dxLat: Number(dxInfo[6]),
      dxLon: Number(dxInfo[7])
    };
  }).filter((spot) => {
    const cleanDx = String(spot.dx || "").toUpperCase();
    const distance = Number.isFinite(spot.deLat) && Number.isFinite(spot.deLon) && Number.isFinite(spot.dxLat) && Number.isFinite(spot.dxLon)
      ? greatCircleKm(spot.deLat, spot.deLon, spot.dxLat, spot.dxLon)
      : NaN;
    spot.distance = distance;
    return cleanDx === call &&
      Number.isFinite(spot.deLat) &&
      Number.isFinite(spot.deLon) &&
      Number.isFinite(spot.dxLat) &&
      Number.isFinite(spot.dxLon) &&
      distance >= minDistance;
  }).sort((a, b) => b.epoch - a.epoch);
}

function renderRbnMap(spots, call) {
  const viewWidth = 1536;
  const viewHeight = 1024;
  if (!spots.length) {
    els.rbnMap.innerHTML = `
      <svg viewBox="0 0 ${viewWidth} ${viewHeight}" role="img" aria-label="RBN spots map">
        <image class="map-base" href="world-map.png" x="0" y="0" width="${viewWidth}" height="${viewHeight}" preserveAspectRatio="none"></image>
      </svg>
    `;
    return;
  }
  const target = mapProject({ lat: spots[0].dxLat, lon: spots[0].dxLon });
  const routes = spots.slice(0, 80).map((spot, index) => {
    const remote = mapProject({ lat: spot.deLat, lon: spot.deLon });
    const dx = remote.x - target.x;
    const dy = remote.y - target.y;
    const curve = Math.min(120, Math.max(45, Math.hypot(dx, dy) * 0.1));
    const midX = (target.x + remote.x) / 2;
    const midY = (target.y + remote.y) / 2 - curve;
    const color = rbnBandColor(spot.band);
    return `
      <path class="live-route" style="--route-color:${color};--route-alpha:.72" d="M ${target.x.toFixed(1)} ${target.y.toFixed(1)} Q ${midX.toFixed(1)} ${midY.toFixed(1)} ${remote.x.toFixed(1)} ${remote.y.toFixed(1)}"></path>
      <circle class="live-dot" style="--band-color:${color}" cx="${remote.x.toFixed(1)}" cy="${remote.y.toFixed(1)}" r="8">
        <title>${spot.de} heard ${spot.dx} on ${spot.bandMeters}m, ${spot.db} dB</title>
      </circle>
      ${index < 10 ? `<text class="live-label" x="${Math.min(viewWidth - 230, Math.max(24, remote.x + 13)).toFixed(1)}" y="${Math.min(viewHeight - 28, Math.max(32, remote.y - 9)).toFixed(1)}">${spot.bandMeters}m</text>` : ""}
    `;
  }).join("");
  els.rbnMap.innerHTML = `
    <svg viewBox="0 0 ${viewWidth} ${viewHeight}" role="img" aria-label="RBN spots for ${call}">
      <image class="map-base" href="world-map.png" x="0" y="0" width="${viewWidth}" height="${viewHeight}" preserveAspectRatio="none"></image>
      ${routes}
      <circle class="map-pin a live-focus" cx="${target.x.toFixed(1)}" cy="${target.y.toFixed(1)}" r="14"></circle>
      <text class="map-label" x="${Math.min(viewWidth - 240, Math.max(24, target.x + 18)).toFixed(1)}" y="${Math.min(viewHeight - 30, Math.max(36, target.y - 16)).toFixed(1)}">${call}</text>
    </svg>
  `;
}

function renderRbnTable(spots) {
  const rankedSpots = [...spots]
    .sort((a, b) => Number(b.distance) - Number(a.distance) || Number(b.epoch) - Number(a.epoch))
    .slice(0, 100);
  els.rbnTable.innerHTML = spots.length ? `
    <tr><th>UTC</th><th>Band</th><th>Spotter</th><th>Country</th><th>Distance</th><th>SNR</th><th>Speed</th><th>Freq</th></tr>
    ${rankedSpots.map((spot) => `
      <tr>
        <td>${spot.time}</td>
        <td>${spot.bandMeters}m</td>
        <td>${spot.de}</td>
        <td>${spot.deCountry}</td>
        <td>${Math.round(spot.distance).toLocaleString()} km</td>
        <td>${spot.db} dB</td>
        <td>${spot.wpm || ""} wpm</td>
        <td>${spot.freq}</td>
      </tr>
    `).join("")}
  ` : "";
}

let rbnTimer;

async function runRbnMonitor(openFallback = false) {
  const call = els.rbnCall.value.trim().toUpperCase();
  const seconds = Math.max(900, Number(els.rbnWindow.value) || 900);
  const minDistance = rbnMinDistanceKm();
  if (!call) {
    els.rbnSummary.textContent = "Enter a callsign for RBN lookup.";
    return;
  }
  els.rbnCall.value = call;
  const pageUrl = rbnUrl(call, seconds);
  if (openFallback) {
    window.open(pageUrl, "_blank", "noopener");
    return;
  }
  const params = new URLSearchParams({
    h: rbnVersionHash,
    cdx: call,
    ma: String(seconds),
    m: "1",
    s: "0",
    r: "100"
  });
  els.rbnRunBtn.disabled = true;
  els.rbnMeta.textContent = `Checking ${call}, last ${seconds >= 86400 ? "24 hours" : `${Math.round(seconds / 60)} min`}${minDistance ? `, minimum ${minDistance.toLocaleString()} km` : ""}...`;
  try {
    const response = await fetch(`${rbnEndpoint}?${params.toString()}`, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`RBN returned HTTP ${response.status}`);
    const payload = await response.json();
    const spots = parseRbnSpots(payload, call, minDistance);
    renderRbnMap(spots, call);
    renderRbnTable(spots);
    const bands = [...new Set(spots.map((spot) => `${spot.bandMeters}m`))].join(", ");
    els.rbnMeta.textContent = `${spots.length.toLocaleString()} geolocated CW RBN spots for ${call}${minDistance ? `, minimum ${minDistance.toLocaleString()} km` : ""}`;
    els.rbnSummary.innerHTML = spots.length
      ? `Bands heard: ${bands || "none"}. Auto-refreshes every 2 minutes while this page is open.`
      : `No geolocated CW RBN spots found${minDistance ? ` beyond ${minDistance.toLocaleString()} km` : ""}. <a href="${pageUrl}" target="_blank" rel="noopener">Open RBN search</a>`;
  } catch (error) {
    renderRbnMap([], call);
    els.rbnTable.innerHTML = "";
    els.rbnMeta.textContent = "RBN direct lookup blocked";
    els.rbnSummary.innerHTML = `${error.message}. Browser CORS may block direct RBN JSON in the HTML version. <a href="${pageUrl}" target="_blank" rel="noopener">Open this callsign on Reverse Beacon Network</a>${minDistance ? `; apply the ${minDistance.toLocaleString()} km distance filter in WSPRSpyDX when direct RBN data is available` : ""}.`;
  } finally {
    els.rbnRunBtn.disabled = false;
    clearInterval(rbnTimer);
    rbnTimer = setInterval(() => runRbnMonitor(false), 120000);
  }
}

function scaledSnr(snr, powerDbm) {
  const cleanSnr = Number(snr);
  const cleanPower = Number(powerDbm);
  if (!Number.isFinite(cleanSnr) || !Number.isFinite(cleanPower)) return NaN;
  return cleanSnr + (50 - cleanPower);
}

function powerScaleNote(powerDbm) {
  const cleanPower = Number(powerDbm);
  if (!Number.isFinite(cleanPower)) return "reported power unavailable";
  if (cleanPower === 50) return "reported at 100W";
  if (cleanPower < 50) return `scaled up from ${cleanPower} dBm to 50 dBm`;
  return `scaled down from ${cleanPower} dBm to 50 dBm`;
}

function modeText(snr100w) {
  return [
    { name: "FT8", ok: snr100w >= -20 },
    { name: "CW", ok: snr100w >= -12 },
    { name: "SSB", ok: snr100w >= 6 }
  ];
}

function modeRank(snr100w) {
  if (Number.isNaN(Number(snr100w))) return 0;
  if (snr100w >= 6) return 3;
  if (snr100w >= -12) return 2;
  if (snr100w >= -20) return 1;
  return 0;
}

function modeSummary(snr100w) {
  const rank = modeRank(snr100w);
  if (rank >= 3) return "SSB/CW/FT8 likely at 100W";
  if (rank >= 2) return "CW/FT8 likely at 100W";
  if (rank >= 1) return "FT8 likely at 100W";
  return "Below FT8 threshold at 100W";
}

function compactModeLabel(rank) {
  if (rank >= 3) return "SSB";
  if (rank >= 2) return "CW";
  if (rank >= 1) return "FT8";
  return "No 100W mode";
}

function scaledText(snr, powerDbm) {
  if (Number.isNaN(Number(snr)) || Number.isNaN(Number(powerDbm))) return "100W estimate unavailable";
  const estimate = scaledSnr(snr, powerDbm);
  return `
    <span class="estimate">100W est ${estimate >= 0 ? "+" : ""}${estimate.toFixed(0)} dB</span>
    <span class="estimate power-note">${powerScaleNote(powerDbm)}</span>
    ${modeText(estimate).map((mode) => `<span class="mode-chip ${mode.ok ? "ok" : "no"}">${mode.name}</span>`).join("")}
  `;
}

function fallbackZoneBox(kind, zone) {
  if (kind === "cq") {
    const width = 360 / 40;
    const lonMin = -180 + (zone - 1) * width;
    const lonMax = lonMin + width;
    return { name: `CQ Zone ${zone} - approximate`, lat: 0, lon: (lonMin + lonMax) / 2, latMin: -60, latMax: 75, lonMin, lonMax };
  }
  const columns = 15;
  const rows = 6;
  const index = zone - 1;
  const row = Math.floor(index / columns);
  const col = index % columns;
  const lonWidth = 360 / columns;
  const latHeight = 180 / rows;
  const lonMin = -180 + col * lonWidth;
  const lonMax = lonMin + lonWidth;
  const latMax = 90 - row * latHeight;
  const latMin = latMax - latHeight;
  return { name: `ITU Zone ${zone} - approximate`, lat: (latMin + latMax) / 2, lon: (lonMin + lonMax) / 2, latMin, latMax, lonMin, lonMax };
}

function parseZones(value, kind) {
  const max = kind === "cq" ? 40 : 90;
  const specials = kind === "cq" ? specialCqZones : specialItuZones;
  const zones = [...new Set(String(value).match(/\d+/g)?.map(Number) || [])].filter((zone) => zone >= 1 && zone <= max);
  if (!zones.length) throw new Error(`Enter one or more ${kind.toUpperCase()} zone numbers, for example 14 or 1,2.`);
  const boxes = zones.map((zone) => specials[zone] || fallbackZoneBox(kind, zone));
  const bounds = boundingBox(boxes);
  return {
    name: `${kind.toUpperCase()} ${zones.join(", ")}`,
    lat: (bounds.latMin + bounds.latMax) / 2,
    lon: (bounds.lonMin + bounds.lonMax) / 2,
    ...bounds,
    boxes
  };
}

function locatorBox(locator) {
  const clean = String(locator).trim().toUpperCase();
  if (!/^[A-R]{2}([0-9]{2})?([A-X]{2})?([0-9]{2})?$/.test(clean) || clean.length < 2 || clean.length % 2 !== 0) {
    throw new Error(`"${locator}" is not a valid 2, 4, 6, or 8 character Maidenhead locator.`);
  }
  let lon = (clean.charCodeAt(0) - 65) * 20 - 180;
  let lat = (clean.charCodeAt(1) - 65) * 10 - 90;
  let lonSize = 20;
  let latSize = 10;
  if (clean.length >= 4) {
    lon += Number(clean[2]) * 2;
    lat += Number(clean[3]);
    lonSize = 2;
    latSize = 1;
  }
  if (clean.length >= 6) {
    lon += (clean.charCodeAt(4) - 65) * (2 / 24);
    lat += (clean.charCodeAt(5) - 65) * (1 / 24);
    lonSize = 2 / 24;
    latSize = 1 / 24;
  }
  if (clean.length >= 8) {
    lon += Number(clean[6]) * (lonSize / 10);
    lat += Number(clean[7]) * (latSize / 10);
    lonSize /= 10;
    latSize /= 10;
  }
  return {
    name: `Locator ${clean}`,
    lat: lat + latSize / 2,
    lon: lon + lonSize / 2,
    latMin: lat,
    latMax: lat + latSize,
    lonMin: lon,
    lonMax: lon + lonSize
  };
}

function parseLocators(value) {
  const locators = String(value).split(/[,\s]+/).map((item) => item.trim()).filter(Boolean);
  if (!locators.length) throw new Error("Enter one or more Maidenhead locators, for example IO75 or IO75, RF72.");
  const boxes = locators.map(locatorBox);
  const bounds = boundingBox(boxes);
  return {
    name: locators.map((item) => item.toUpperCase()).join(", "),
    lat: (bounds.latMin + bounds.latMax) / 2,
    lon: (bounds.lonMin + bounds.lonMax) / 2,
    ...bounds,
    boxes
  };
}

function boxFromResult(result) {
  const [latMin, latMax, lonMin, lonMax] = result.boundingbox.map(Number);
  const name = result.address?.country || result.address?.state || result.name || result.display_name;
  return { name, lat: Number(result.lat), lon: Number(result.lon), latMin, latMax, lonMin, lonMax };
}

function resultScore(result, query) {
  const addressType = result.addresstype || "";
  const name = normaliseName(result.name || "");
  const display = normaliseName(result.display_name || "");
  let score = 0;
  if (addressType === "country") score += 20;
  if (addressType === "state") score += 12;
  if (name === query) score += 10;
  if (display.startsWith(query)) score += 4;
  return score;
}

function lookupKnownRegions(query) {
  const matches = Object.entries(knownRegions)
    .filter(([key, box]) => {
      const name = normaliseName(box.name);
      return key === query || name === query || key.startsWith(query) || name.startsWith(query) || key.includes(query);
    })
    .sort(([keyA, boxA], [keyB, boxB]) => {
      const nameA = normaliseName(boxA.name);
      const nameB = normaliseName(boxB.name);
      const exactA = keyA === query || nameA === query ? 1 : 0;
      const exactB = keyB === query || nameB === query ? 1 : 0;
      return exactB - exactA || boxA.name.localeCompare(boxB.name);
    });
  const seen = new Set();
  return matches
    .filter(([, box]) => {
      if (seen.has(box.name)) return false;
      seen.add(box.name);
      return true;
    })
    .map(([, box]) => ({ box, label: box.name }));
}

async function lookupRegion(value) {
  const query = normaliseName(value);
  if (query.length < 2) return [];
  const knownMatches = lookupKnownRegions(query);
  if (knownMatches.length) return knownMatches;
  if (geocodeCache.has(query)) return geocodeCache.get(query);

  const params = new URLSearchParams({
    format: "jsonv2",
    addressdetails: "1",
    limit: "6",
    q: value.trim()
  });
  const response = await fetch(`${geocodeEndpoint}?${params.toString()}`, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error(`Country lookup returned HTTP ${response.status}.`);
  const raw = await response.json();
  const matches = raw
    .filter((result) => result.boundingbox && ["country", "state"].includes(result.addresstype))
    .sort((a, b) => resultScore(b, query) - resultScore(a, query))
    .map((result) => ({
      box: boxFromResult(result),
      label: result.address?.country || result.address?.state || result.display_name
    }));
  geocodeCache.set(query, matches);
  return matches;
}

function renderCountryOptions(prefix, matches) {
  const list = els[`${prefix}CountryOptions`];
  list.innerHTML = matches.slice(0, 5).map((match) => `<option value="${match.label}"></option>`).join("");
  const suggestions = els[`${prefix}Suggestions`];
  suggestions.innerHTML = matches.slice(0, 5).map((match) => `
    <button type="button" data-name="${match.label}">${match.label}</button>
  `).join("");
  suggestions.classList.toggle("open", matches.length > 0);
}

async function resolveCountry(prefix, shouldReport = true) {
  const input = els[`${prefix}Country`];
  const value = input.value.trim();
  if (value.length < 3) return;

  try {
    const matches = await lookupRegion(value);
    if (input.value.trim() !== value) return;
    renderCountryOptions(prefix, matches);
    if (!matches.length) {
      if (shouldReport) setStatus(`No country or major region match for "${value}".`, true);
      return;
    }
    fillBox(prefix, matches[0].box);
    if (normaliseName(input.value) === normaliseName(matches[0].label)) {
      input.value = matches[0].label;
      els[`${prefix}Suggestions`].classList.remove("open");
    }
    if (shouldReport) setStatus(`Matched ${prefix.toUpperCase()} to ${matches[0].box.name}.`);
  } catch (error) {
    if (shouldReport) setStatus(error.message, true);
  }
}

function scheduleCountryLookup(prefix) {
  if (els[`${prefix}Mode`].value !== "country") return;
  clearTimeout(countryTimers.get(prefix));
  countryTimers.set(prefix, setTimeout(() => resolveCountry(prefix), 450));
}

function chooseSuggestion(prefix, label) {
  els[`${prefix}Country`].value = label;
  els[`${prefix}Suggestions`].classList.remove("open");
  resolveCountry(prefix);
}

function readBox(prefix) {
  let boxes = [];
  try {
    boxes = JSON.parse(els[`${prefix}Name`].dataset.boxes || "[]");
  } catch (error) {
    boxes = [];
  }
  const box = {
    name: els[`${prefix}Name`].value.trim() || `Region ${prefix.toUpperCase()}`,
    lat: Number(els[`${prefix}Name`].dataset.lat),
    lon: Number(els[`${prefix}Name`].dataset.lon),
    latMin: Number(els[`${prefix}LatMin`].value),
    latMax: Number(els[`${prefix}LatMax`].value),
    lonMin: Number(els[`${prefix}LonMin`].value),
    lonMax: Number(els[`${prefix}LonMax`].value),
    boxes
  };
  if ([box.latMin, box.latMax, box.lonMin, box.lonMax].some((value) => Number.isNaN(value))) {
    throw new Error("Please check the latitude/longitude boxes.");
  }
  if (!box.boxes.length) box.boxes = [{ name: box.name, latMin: box.latMin, latMax: box.latMax, lonMin: box.lonMin, lonMax: box.lonMax }];
  return box;
}

function regionWhere(prefix, box) {
  const boxes = box.boxes?.length ? box.boxes : [box];
  return `(${boxes.map((part) => `${prefix}_lat BETWEEN ${part.latMin} AND ${part.latMax} AND ${prefix}_lon BETWEEN ${part.lonMin} AND ${part.lonMax}`).join(" OR ")})`;
}

function pathWhere(a, b = null) {
  if (!b) {
    const txA = regionWhere("tx", a);
    const rxA = regionWhere("rx", a);
    const fromA = `(${txA} AND NOT ${rxA})`;
    const toA = `(${rxA} AND NOT ${txA})`;
    if (els.direction.value === "ab") return fromA;
    if (els.direction.value === "ba") return toA;
    return `(${fromA} OR ${toA})`;
  }
  const ab = `(${regionWhere("tx", a)} AND ${regionWhere("rx", b)})`;
  const ba = `(${regionWhere("tx", b)} AND ${regionWhere("rx", a)})`;
  if (els.direction.value === "ab") return ab;
  if (els.direction.value === "ba") return ba;
  return `(${ab} OR ${ba})`;
}

async function runQuery(sql) {
  const url = `${endpoint}?query=${encodeURIComponent(`${sql} FORMAT JSON`)}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`WSPR Live returned HTTP ${response.status}.`);
  const json = await response.json();
  return json.data || [];
}

function renderSpaceWeather(state, title, body, score = 0) {
  els.spaceWeather.className = `card weatherCard space-weather ${state}`;
  els.spaceWeatherTitle.textContent = title;
  els.spaceWeatherBody.textContent = body;
  const cleanScore = Math.round(Math.max(0, Math.min(100, Number(score) || 0)));
  els.spaceWeatherScore.textContent = cleanScore;
  els.spaceWeatherGauge.style.setProperty("--gauge", cleanScore);
}

async function loadSpaceWeather() {
  try {
    const response = await fetch(kpEndpoint, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`NOAA SWPC returned HTTP ${response.status}.`);
    const rows = await response.json();
    const now = Date.now();
    const recent = rows
      .map((row) => ({ time: new Date(`${row.time_tag}Z`), kp: Number(row.Kp) }))
      .filter((row) => !Number.isNaN(row.kp) && now - row.time.getTime() <= 24 * 60 * 60 * 1000)
      .sort((a, b) => a.time - b.time);
    if (!recent.length) {
      renderSpaceWeather("caution", "Kp data unavailable", "Could not find recent NOAA Kp values, so treat the WSPR history without a current geomagnetic check.", 45);
      return;
    }
    const latest = recent[recent.length - 1];
    const max = recent.reduce((best, row) => row.kp > best.kp ? row : best, recent[0]);
    const maxText = `Latest Kp ${latest.kp.toFixed(1)}, max ${max.kp.toFixed(1)} in the last 24h.`;
    const stability = Math.round(Math.max(0, Math.min(100, 100 - (max.kp / 9) * 100)));
    if (max.kp >= 5) {
      renderSpaceWeather("storm", "Geomagnetic storm recently", `${maxText} HF paths may be depressed or unusually variable; compare short history against longer history before calling the path dead.`, stability);
    } else if (max.kp >= 4) {
      renderSpaceWeather("caution", "Geomagnetic activity elevated", `${maxText} Conditions may be unsettled, especially on higher latitude or polar paths.`, stability);
    } else {
      renderSpaceWeather("quiet", "Geomagnetic field quiet", `${maxText} Recent Kp does not suggest a storm-driven warning for this path.`, stability);
    }
  } catch (error) {
    renderSpaceWeather("caution", "Space weather check failed", `${error.message} WSPR results still work, but no current Kp warning is available.`, 45);
  }
}

function heatColor(count, max) {
  if (!count) return "transparent";
  const strength = Math.max(0.18, count / max);
  const hue = 145 - strength * 70;
  const light = 34 + strength * 23;
  return `hsl(${hue} 82% ${light}%)`;
}

function renderHeatmap(rows) {
  const max = Math.max(1, ...rows.map((row) => Number(row.spots)));
  const lookup = new Map(rows.map((row) => [`${row.band}-${row.hour}`, row]));
  const activeBands = bands.filter((band) => rows.some((row) => Number(row.band) === band));
  const header = `<tr><th>UTC</th>${activeBands.map((band) => `<th>${bandLabel(band)}</th>`).join("")}</tr>`;
  const body = Array.from({ length: 24 }, (_, hour) => {
    const cells = activeBands.map((band) => {
      const row = lookup.get(`${band}-${hour}`);
      const count = row ? Number(row.spots) : 0;
      const title = row ? `${bandLabel(band)} ${hour}:00 UTC: ${count} spots, avg SNR ${row.avg_snr} dB` : "";
      return `<td title="${title}" style="background:${heatColor(count, max)}">${count || ""}</td>`;
    }).join("");
    return `<tr><th>${String(hour).padStart(2, "0")}</th>${cells}</tr>`;
  }).join("");
  els.heatmap.innerHTML = body ? header + body : `<tr><td>No WSPR spots found for this path.</td></tr>`;
}

function ensureBandDetailPanel() {
  if (!els.bandDetailPanel || !document.body.contains(els.bandDetailPanel)) {
    const panel = document.createElement("li");
    panel.className = "band-detail band-detail-row";
    panel.id = "bandDetailPanel";
    panel.hidden = true;
    panel.innerHTML = `
      <div class="section-head band-detail-head">
        <div>
          <h3 id="bandDetailTitle">Select a band to see matching spots</h3>
          <span id="bandDetailMeta">Click a Best By Band tile for country and 100W spot detail.</span>
        </div>
      </div>
      <div class="live-countries band-country-summary" id="bandCountrySummary"></div>
      <div class="rbn-table-wrap">
        <table class="rbn-table band-spot-table" id="bandSpotTable" aria-label="Selected best band spots"></table>
      </div>`;
    els.bandDetailPanel = panel;
    els.bandDetailTitle = panel.querySelector("#bandDetailTitle");
    els.bandDetailMeta = panel.querySelector("#bandDetailMeta");
    els.bandCountrySummary = panel.querySelector("#bandCountrySummary");
    els.bandSpotTable = panel.querySelector("#bandSpotTable");
  }
  return els.bandDetailPanel;
}

function resetBandDetailPanel() {
  const panel = ensureBandDetailPanel();
  els.bandDetailTitle.textContent = "Select a band to see matching spots";
  els.bandDetailMeta.textContent = "Click a Best By Band tile for country and 100W spot detail.";
  els.bandCountrySummary.innerHTML = "";
  els.bandSpotTable.innerHTML = "";
  panel.hidden = true;
  if (els.bandChanceList && !panel.parentElement) els.bandChanceList.appendChild(panel);
}

function moveBandDetailAfter(tile) {
  const panel = ensureBandDetailPanel();
  if (tile?.parentElement === els.bandChanceList) {
    tile.insertAdjacentElement("afterend", panel);
  } else if (!panel.parentElement) {
    els.bandChanceList.appendChild(panel);
  }
  panel.hidden = false;
  return panel;
}

function renderBandChances(rows, minDistance = 0) {
  const byBand = new Map();
  rows.forEach((row) => {
    const band = Number(row.band);
    const current = byBand.get(band) || { rows: [], total: 0 };
    current.rows.push(row);
    current.total += Number(row.spots);
    byBand.set(band, current);
  });

  const chances = bands.filter((band) => band <= 28 && byBand.has(band)).map((band) => {
    const data = byBand.get(band);
    const hourMap = new Map(data.rows.map((row) => [Number(row.hour), row]));
    let bestWindow = { start: 0, spots: -1, best: data.rows[0], snr100w: -Infinity, mode: 0 };
    for (let start = 0; start < 24; start += 1) {
      const windowRows = [0, 1].map((offset) => hourMap.get((start + offset) % 24)).filter(Boolean);
      const spots = windowRows.reduce((sum, row) => sum + Number(row.spots), 0);
      const best = [...windowRows].sort((a, b) => Number(b.best_snr) - Number(a.best_snr))[0] || data.rows[0];
      const snr100w = scaledSnr(best.best_snr, best.best_power);
      const mode = modeRank(snr100w);
      if (
        spots > bestWindow.spots ||
        (spots === bestWindow.spots && mode > bestWindow.mode) ||
        (spots === bestWindow.spots && mode === bestWindow.mode && snr100w > bestWindow.snr100w)
      ) {
        bestWindow = { start, spots, best, snr100w, mode };
      }
    }
    const end = (bestWindow.start + 2) % 24;
    const windowText = `${String(bestWindow.start).padStart(2, "0")}:00-${String(end).padStart(2, "0")}:00 UTC`;
    return {
      band,
      best: bestWindow.best,
      total: data.total,
      windowSpots: bestWindow.spots,
      start: bestWindow.start,
      windowText,
      snr100w: bestWindow.snr100w,
      mode: bestWindow.mode
    };
  });

  els.bandChanceList.innerHTML = chances.length ? chances.map((chance) => `
    <li>
      <button class="band-detail-btn" type="button" data-band="${chance.band}" data-start="${chance.start}" aria-label="Show ${bandLabel(chance.band)} spots for ${chance.windowText}">
        <div class="slot-main">
          <span>${bandLabel(chance.band)} best chance</span>
          <span>${chance.windowText}</span>
        </div>
        <div class="slot-sub">${modeSummary(chance.snr100w)}. ${Number(chance.windowSpots).toLocaleString()} spots in this 2h window, ${chance.total.toLocaleString()} total${minDistance ? ` beyond ${minDistance.toLocaleString()} km` : ""}, best 100W estimate ${chance.snr100w >= 0 ? "+" : ""}${chance.snr100w.toFixed(0)} dB</div>
        <div class="mode-hint">${scaledText(chance.best.best_snr, chance.best.best_power)}</div>
      </button>
    </li>
  `).join("") : `<li>No per-band openings found.</li>`;
  resetBandDetailPanel();
}

async function runLiveMap() {
  try {
    await resolvePathInput("a", false);
    const focus = readBox("a");
    const minutes = Math.min(60, Math.max(15, Number(els.liveWindow.value)));
    const minDistance = liveMinDistanceKm();
    const flow = els.liveDirection.value;
    const focusTx = regionWhere("tx", focus);
    const focusRx = regionWhere("rx", focus);
    const focusBoth = `(${focusTx} AND ${focusRx})`;
    const flowWhere = flow === "sent"
      ? `(${focusTx} AND NOT ${focusRx})`
      : flow === "heard"
        ? `(${focusRx} AND NOT ${focusTx})`
        : `((${focusTx} OR ${focusRx}) AND NOT ${focusBoth})`;
    const sql = `
      SELECT
        time,
        band,
        tx_sign,
        rx_sign,
        snr,
        power,
        distance,
        if(${focusTx}, 'sent', 'heard') AS flow,
        if(${focusTx}, rx_lat, tx_lat) AS remote_lat,
        if(${focusTx}, rx_lon, tx_lon) AS remote_lon
      FROM wspr.rx
      WHERE time >= now() - INTERVAL ${minutes} MINUTE
        AND band IN (${bandSqlList})
        AND ${flowWhere}
        AND tx_lat BETWEEN -90 AND 90
        AND rx_lat BETWEEN -90 AND 90
        AND tx_lon BETWEEN -180 AND 180
        AND rx_lon BETWEEN -180 AND 180
        AND distance >= ${minDistance}
      ORDER BY distance DESC, time DESC
      LIMIT ${liveRowLimit}`;
    const totalSql = `
      SELECT count() AS spots, max(distance) AS max_distance
      FROM wspr.rx
      WHERE time >= now() - INTERVAL ${minutes} MINUTE
        AND band IN (${bandSqlList})
        AND ${flowWhere}
        AND tx_lat BETWEEN -90 AND 90
        AND rx_lat BETWEEN -90 AND 90
        AND tx_lon BETWEEN -180 AND 180
        AND rx_lon BETWEEN -180 AND 180
        AND distance >= ${minDistance}`;
    els.liveRefreshBtn.disabled = true;
    els.liveSummary.textContent = `Checking live WSPR spots for ${focus.name}${minDistance > 0 ? ` beyond ${minDistance.toLocaleString()} km` : ""}...`;
    const [rows, totalRows] = await Promise.all([runQuery(sql), runQuery(totalSql)]);
    renderLiveMap(focus, rows, minutes, flow, minDistance, totalRows[0]);
  } catch (error) {
    els.liveMapMeta.textContent = "Live WSPR map";
    els.liveSummary.textContent = error.message;
    try {
      renderLiveMap(readBox("a"), [], Number(els.liveWindow.value) || 15, els.liveDirection.value, liveMinDistanceKm());
    } catch (mapError) {}
  } finally {
    els.liveRefreshBtn.disabled = false;
  }
}

function summarySqlFor(context, minDistance = 0) {
  return `
      SELECT
        band,
        toHour(time) AS hour,
        count() AS spots,
        uniqExact(tx_sign) AS tx_count,
        uniqExact(rx_sign) AS rx_count,
        round(avg(snr), 1) AS avg_snr,
        max(snr) AS best_snr,
        argMax(power, snr) AS best_power
      FROM wspr.rx
      WHERE ${context.since} AND band IN (${bandSqlList}) AND ${context.where}
        AND tx_loc != ''
        AND rx_loc != ''
        ${validSpotCoordsSql}
        AND ${spotDistanceKmExpr} > 0
        AND ${spotDistanceKmExpr} >= ${minDistance}
      GROUP BY band, hour
      ORDER BY band, hour`;
}

function bandSpotSqlFor(context, band, startHour, minDistance = 0) {
  const nextHour = (Number(startHour) + 1) % 24;
  return `
      SELECT
        time,
        band,
        tx_sign,
        rx_sign,
        tx_lat,
        tx_lon,
        rx_lat,
        rx_lon,
        round(${spotDistanceKmExpr}, 1) AS distance,
        snr,
        power,
        frequency
      FROM wspr.rx
      WHERE ${context.since}
        AND ${context.where}
        AND band = ${Number(band)}
        AND toHour(time) IN (${Number(startHour)}, ${nextHour})
        AND tx_loc != ''
        AND rx_loc != ''
        ${validSpotCoordsSql}
        AND ${spotDistanceKmExpr} > 0
        AND ${spotDistanceKmExpr} >= ${minDistance}
      ORDER BY distance DESC, (snr + (50 - power)) DESC, time DESC
      LIMIT 100`;
}

function remoteCountryForSpot(row, context) {
  if (!context?.b) {
    const txInA = pointInRegion(row.tx_lat, row.tx_lon, context.a);
    const rxInA = pointInRegion(row.rx_lat, row.rx_lon, context.a);
    if (txInA && !rxInA) return callsignCountry(row.rx_sign);
    if (rxInA && !txInA) return callsignCountry(row.tx_sign);
  }
  return `${callsignCountry(row.tx_sign)} to ${callsignCountry(row.rx_sign)}`;
}

function formatSpotTime(value) {
  const date = new Date(`${String(value).replace(" ", "T")}Z`);
  if (Number.isNaN(date.getTime())) return escapeHtml(value);
  return date.toISOString().slice(0, 16).replace("T", " ");
}

function renderBandSpotDetails(band, startHour, rows, minDistance) {
  const endHour = (Number(startHour) + 2) % 24;
  const windowText = `${String(startHour).padStart(2, "0")}:00-${String(endHour).padStart(2, "0")}:00 UTC`;
  els.bandDetailTitle.textContent = `${bandLabel(band)} spots, ${windowText}`;
  els.bandDetailMeta.textContent = `${rows.length.toLocaleString()} sample spots from the selected best window${minDistance ? `, minimum ${minDistance.toLocaleString()} km` : ""}. Sorted by longest distance first.`;
  const countries = [...rows.reduce((map, row) => {
    const country = remoteCountryForSpot(row, currentQueryContext);
    const snr100w = scaledSnr(row.snr, row.power);
    const current = map.get(country) || { country, spots: 0, best: -Infinity, mode: 0 };
    current.spots += 1;
    current.best = Math.max(current.best, snr100w);
    current.mode = Math.max(current.mode, modeRank(snr100w));
    map.set(country, current);
    return map;
  }, new Map()).values()].sort((a, b) => b.spots - a.spots || b.best - a.best).slice(0, 10);
  els.bandCountrySummary.innerHTML = countries.length ? countries.map((item) => `
    <span class="live-country-chip">
      <b>${escapeHtml(item.country)}</b>
      <span>${spotCountText(item.spots)} · ${compactModeLabel(item.mode)} · best ${item.best >= 0 ? "+" : ""}${item.best.toFixed(0)} dB</span>
    </span>
  `).join("") : `<span class="live-band-empty">No country summary for this window.</span>`;
  els.bandSpotTable.innerHTML = rows.length ? `
    <tr><th>UTC</th><th>Band</th><th>TX</th><th>RX</th><th>Countries</th><th>Distance</th><th>SNR</th><th>Power</th><th>100W est</th><th>Mode</th></tr>
    ${rows.map((row) => {
      const snr100w = scaledSnr(row.snr, row.power);
      return `
        <tr>
          <td>${formatSpotTime(row.time)}</td>
          <td>${bandLabel(row.band)}</td>
          <td>${escapeHtml(row.tx_sign)}</td>
          <td>${escapeHtml(row.rx_sign)}</td>
          <td>${escapeHtml(callsignCountry(row.tx_sign))} -&gt; ${escapeHtml(callsignCountry(row.rx_sign))}</td>
          <td>${Math.round(Number(row.distance)).toLocaleString()} km</td>
          <td>${Number(row.snr).toFixed(0)} dB</td>
          <td>${Number(row.power).toFixed(0)} dBm</td>
          <td>${snr100w >= 0 ? "+" : ""}${snr100w.toFixed(0)} dB</td>
          <td>${compactModeLabel(modeRank(snr100w))}</td>
        </tr>
      `;
    }).join("")}
  ` : "";
}

async function showBandSpotDetails(band, startHour, tile) {
  if (!currentQueryContext) return;
  const minDistance = currentPathMinDistance;
  moveBandDetailAfter(tile);
  els.bandDetailTitle.textContent = `${bandLabel(band)} spots loading...`;
  els.bandDetailMeta.textContent = "Querying matching WSPR spots for the selected 2-hour window.";
  els.bandCountrySummary.innerHTML = "";
  els.bandSpotTable.innerHTML = "";
  try {
    const rows = await runQuery(bandSpotSqlFor(currentQueryContext, band, startHour, minDistance));
    renderBandSpotDetails(band, startHour, rows, minDistance);
  } catch (error) {
    els.bandDetailTitle.textContent = `${bandLabel(band)} spot detail unavailable`;
    els.bandDetailMeta.textContent = error.message;
  }
}

async function run() {
  try {
    await resolveCurrentInputs(false);
    const a = readBox("a");
    const b = isAnywhereTarget("b") ? null : readBox("b");
    const days = Math.min(90, Math.max(1, Number(els.period.value)));
    const where = pathWhere(a, b);
    const since = `time >= now() - INTERVAL ${days} DAY`;
    const pathLabel = b ? `${a.name} to ${b.name}` : `${a.name} to anywhere`;

    setStatus(`Querying ${pathLabel} over ${days} days...`);
    els.runBtn.disabled = true;
    els.refreshBtn.disabled = true;

    currentQueryContext = { a, b, days, where, since };

    const pathMinDistance = cleanDistanceInput(els.pathMinDistance);
    currentPathMinDistance = pathMinDistance;
    const summary = await runQuery(summarySqlFor(currentQueryContext, pathMinDistance));
    renderPathMap(a, b);
    renderHeatmap(summary);
    renderBandChances(summary, pathMinDistance);
    runLiveMap();
    els.queryMeta.textContent = `${pathLabel}, ${days} days${pathMinDistance ? `, min ${pathMinDistance.toLocaleString()} km` : ""}`;
    setStatus(`Found ${summary.reduce((sum, row) => sum + Number(row.spots), 0).toLocaleString()} spots across ${summary.length} band/hour slots.`);
  } catch (error) {
    setStatus(error.message, true);
  } finally {
    els.runBtn.disabled = false;
    els.refreshBtn.disabled = false;
  }
}

function modeDefault(prefix, mode) {
  const defaults = {
    country: prefix === "a" ? "Scotland" : "New Zealand",
    cq: prefix === "a" ? "14" : "32",
    itu: prefix === "a" ? "27" : "59",
    locator: prefix === "a" ? "IO75" : "RF72"
  };
  return defaults[mode] || defaults.country;
}

function modePlaceholder(prefix, mode) {
  if (prefix === "b") {
    if (mode === "cq") return "Leave blank for anywhere, or enter 14";
    if (mode === "itu") return "Leave blank for anywhere, or enter 27";
    if (mode === "locator") return "Leave blank for anywhere, or enter IO75";
    return "Leave blank for anywhere";
  }
  const placeholders = {
    country: prefix === "a" ? "Scotland" : "New Zealand",
    cq: prefix === "a" ? "14" : "32",
    itu: prefix === "a" ? "27" : "59",
    locator: prefix === "a" ? "IO75" : "RF72"
  };
  return placeholders[mode] || placeholders.country;
}

function modeInputLabel(prefix, mode) {
  const side = prefix.toUpperCase();
  if (mode === "cq") return `CQ zone ${side}`;
  if (mode === "itu") return `ITU zone ${side}`;
  if (mode === "locator") return `Locator ${side}`;
  return `Region ${side}`;
}

function modeHelpText() {
  const aText = els.aMode.options[els.aMode.selectedIndex].text;
  const bText = els.bMode.options[els.bMode.selectedIndex].text;
  els.modeNote.textContent = `Path input: A uses ${aText}; B uses ${bText}. Countries autocomplete; zones and locators can be comma separated. Leave Region B blank for Region A to anywhere.`;
}

function resolveStructuredInput(prefix, shouldReport = true) {
  const mode = els[`${prefix}Mode`].value;
  const value = els[`${prefix}Country`].value.trim();
  if (!value) throw new Error(`Enter a ${mode === "locator" ? "Maidenhead locator" : `${mode.toUpperCase()} zone`} for Region ${prefix.toUpperCase()}.`);
  const box = mode === "locator" ? parseLocators(value) : parseZones(value, mode);
  fillBox(prefix, box);
  els[`${prefix}Suggestions`].classList.remove("open");
  if (shouldReport) setStatus(`Matched Region ${prefix.toUpperCase()} to ${box.name}.`);
  return box;
}

async function resolvePathInput(prefix, shouldReport = true) {
  if (prefix === "b" && isAnywhereTarget("b")) {
    els.bSuggestions.classList.remove("open");
    els.bCountryOptions.innerHTML = "";
    updateMapFromBoxes();
    if (shouldReport) setStatus("Region B left blank: checking Region A to anywhere.");
    return null;
  }
  if (els[`${prefix}Mode`].value === "country") return resolveCountry(prefix, shouldReport);
  return resolveStructuredInput(prefix, shouldReport);
}

async function resolveCurrentInputs(shouldReport = true) {
  await resolvePathInput("a", shouldReport);
  await resolvePathInput("b", shouldReport);
}

function updateModeUi(prefix, resetValue = true) {
  const mode = els[`${prefix}Mode`].value;
  els[`${prefix}InputLabel`].textContent = modeInputLabel(prefix, mode);
  els[`${prefix}Country`].placeholder = modePlaceholder(prefix, mode);
  els[`${prefix}CountryOptions`].innerHTML = "";
  els[`${prefix}Suggestions`].classList.remove("open");
  if (resetValue) els[`${prefix}Country`].value = modeDefault(prefix, mode);
  modeHelpText();
  try {
    resolvePathInput(prefix, false);
  } catch (error) {
    setStatus(error.message, true);
  }
}

els.aMode.addEventListener("change", () => updateModeUi("a"));
els.bMode.addEventListener("change", () => updateModeUi("b"));
els.aCountry.addEventListener("input", () => {
  if (els.aMode.value === "country") scheduleCountryLookup("a");
  else {
    try { resolveStructuredInput("a", false); } catch (error) {}
  }
});
els.bCountry.addEventListener("input", () => {
  if (isAnywhereTarget("b")) {
    els.bSuggestions.classList.remove("open");
    els.bCountryOptions.innerHTML = "";
    updateMapFromBoxes();
    return;
  }
  if (els.bMode.value === "country") scheduleCountryLookup("b");
  else {
    try { resolveStructuredInput("b", false); } catch (error) {}
  }
});
els.aCountry.addEventListener("change", () => resolvePathInput("a"));
els.bCountry.addEventListener("change", () => resolvePathInput("b"));
els.aSuggestions.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (button) chooseSuggestion("a", button.dataset.name);
});
els.bSuggestions.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (button) chooseSuggestion("b", button.dataset.name);
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".combo")) {
    els.aSuggestions.classList.remove("open");
    els.bSuggestions.classList.remove("open");
  }
});
els.runBtn.addEventListener("click", run);
els.bandChanceList.addEventListener("click", (event) => {
  const button = event.target.closest(".band-detail-btn");
  if (!button) return;
  showBandSpotDetails(Number(button.dataset.band), Number(button.dataset.start), button.closest("li"));
});
els.pathMinDistance.addEventListener("keydown", (event) => {
  if (event.key === "Enter") run();
});
els.liveRefreshBtn.addEventListener("click", runLiveMap);
els.liveWindow.addEventListener("change", runLiveMap);
els.liveDirection.addEventListener("change", runLiveMap);
els.liveMinDistance.addEventListener("change", runLiveMap);
els.liveMinDistance.addEventListener("keydown", (event) => {
  if (event.key === "Enter") runLiveMap();
});
els.rbnRunBtn.addEventListener("click", () => runRbnMonitor(false));
els.rbnCall.addEventListener("input", () => {
  els.rbnCall.value = els.rbnCall.value.toUpperCase();
});
els.rbnCall.addEventListener("keydown", (event) => {
  if (event.key === "Enter") runRbnMonitor(false);
});
els.rbnWindow.addEventListener("change", () => runRbnMonitor(false));
els.rbnMinDistance.addEventListener("change", () => runRbnMonitor(false));
els.rbnMinDistance.addEventListener("keydown", (event) => {
  if (event.key === "Enter") runRbnMonitor(false);
});
els.refreshBtn.addEventListener("click", () => {
  loadSpaceWeather();
  run();
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}

fillBox("a", knownRegions.scotland);
fillBox("b", knownRegions["new zealand"]);
updateModeUi("a", false);
updateModeUi("b", false);
renderRbnMap([], els.rbnCall.value.trim().toUpperCase() || "CALL");
loadSpaceWeather();
run();
