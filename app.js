const endpoint = "https://db1.wspr.live/";
const geocodeEndpoint = "https://nominatim.openstreetmap.org/search";
const kpEndpoint = "https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json";

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

const geocodeCache = new Map();
const countryTimers = new Map();

const bands = [1, 3, 5, 7, 10, 14, 18, 21, 24, 28, 50];
const bandLabels = new Map([
  [1, "160m"], [3, "80m"], [5, "60m"], [7, "40m"], [10, "30m"], [14, "20m"],
  [18, "17m"], [21, "15m"], [24, "12m"], [28, "10m"], [50, "6m"]
]);

const els = {
  aCountry: document.querySelector("#aCountry"),
  aCountryOptions: document.querySelector("#aCountryOptions"),
  aSuggestions: document.querySelector("#aSuggestions"),
  bCountry: document.querySelector("#bCountry"),
  bCountryOptions: document.querySelector("#bCountryOptions"),
  bSuggestions: document.querySelector("#bSuggestions"),
  period: document.querySelector("#period"),
  direction: document.querySelector("#direction"),
  refreshBtn: document.querySelector("#refreshBtn"),
  runBtn: document.querySelector("#runBtn"),
  status: document.querySelector("#status"),
  spaceWeather: document.querySelector("#spaceWeather"),
  spaceWeatherTitle: document.querySelector("#spaceWeatherTitle"),
  spaceWeatherBody: document.querySelector("#spaceWeatherBody"),
  customDetails: document.querySelector("#customDetails"),
  scoreStrip: document.querySelector("#scoreStrip"),
  heatmap: document.querySelector("#heatmap"),
  pathMap: document.querySelector("#pathMap"),
  mapMeta: document.querySelector("#mapMeta"),
  slotList: document.querySelector("#slotList"),
  bandChanceList: document.querySelector("#bandChanceList"),
  latest: document.querySelector("#latest"),
  queryMeta: document.querySelector("#queryMeta"),
  latestMeta: document.querySelector("#latestMeta"),
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

function normaliseName(value) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function bandLabel(band) {
  return bandLabels.get(Number(band)) || `${band} MHz`;
}

function setStatus(message, isError = false) {
  els.status.textContent = message;
  els.status.classList.toggle("error", isError);
}

function fillBox(prefix, box) {
  els[`${prefix}Name`].value = box.name;
  els[`${prefix}Name`].dataset.lat = box.lat ?? "";
  els[`${prefix}Name`].dataset.lon = box.lon ?? "";
  els[`${prefix}LatMin`].value = box.latMin;
  els[`${prefix}LatMax`].value = box.latMax;
  els[`${prefix}LonMin`].value = box.lonMin;
  els[`${prefix}LonMax`].value = box.lonMax;
  updateMapFromBoxes();
}

function updateMapFromBoxes() {
  try {
    renderPathMap(readBox("a"), readBox("b"));
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

function renderPathMap(a, b) {
  const aCenter = boxCenter(a);
  const bCenter = boxCenter(b);
  const viewWidth = 1000;
  const viewHeight = 500;
  const mapFrame = { x: 31, y: 19, width: 942, height: 466 };
  const mapProject = (point) => ({
    x: mapFrame.x + ((point.lon + 180) / 360) * mapFrame.width,
    y: mapFrame.y + ((90 - Math.max(-90, Math.min(90, point.lat))) / 180) * mapFrame.height
  });
  const aPoint = mapProject(aCenter);
  const bPoint = mapProject(bCenter);
  const dx = bPoint.x - aPoint.x;
  const dy = bPoint.y - aPoint.y;
  const curve = Math.min(110, Math.max(40, Math.hypot(dx, dy) * 0.18));
  const midX = (aPoint.x + bPoint.x) / 2;
  const midY = (aPoint.y + bPoint.y) / 2 - curve;
  els.mapMeta.textContent = `${a.name} to ${b.name}`;
  els.pathMap.innerHTML = `
    <svg viewBox="0 0 ${viewWidth} ${viewHeight}" role="img" aria-label="${a.name} to ${b.name} path">
      <image class="map-base" href="world-map.png" x="0" y="0" width="${viewWidth}" height="${viewHeight}" preserveAspectRatio="none"></image>
      <path class="map-route-shadow" d="M ${aPoint.x.toFixed(1)} ${aPoint.y.toFixed(1)} Q ${midX.toFixed(1)} ${midY.toFixed(1)} ${bPoint.x.toFixed(1)} ${bPoint.y.toFixed(1)}"></path>
      <path class="map-route" d="M ${aPoint.x.toFixed(1)} ${aPoint.y.toFixed(1)} Q ${midX.toFixed(1)} ${midY.toFixed(1)} ${bPoint.x.toFixed(1)} ${bPoint.y.toFixed(1)}"></path>
      <circle class="map-pin a" cx="${aPoint.x.toFixed(1)}" cy="${aPoint.y.toFixed(1)}" r="8"></circle>
      <circle class="map-pin b" cx="${bPoint.x.toFixed(1)}" cy="${bPoint.y.toFixed(1)}" r="8"></circle>
      <text class="map-label" x="${Math.min(900, Math.max(18, aPoint.x + 12)).toFixed(1)}" y="${Math.max(24, aPoint.y - 10).toFixed(1)}">${a.name}</text>
      <text class="map-label" x="${Math.min(900, Math.max(18, bPoint.x + 12)).toFixed(1)}" y="${Math.max(24, bPoint.y - 10).toFixed(1)}">${b.name}</text>
    </svg>
  `;
}

function scaledSnr(snr, powerDbm) {
  return Number(snr) + (50 - Number(powerDbm));
}

function modeText(snr100w) {
  return [
    { name: "FT8", ok: snr100w >= -20 },
    { name: "CW", ok: snr100w >= -12 },
    { name: "SSB", ok: snr100w >= 6 }
  ];
}

function scaledText(snr, powerDbm) {
  if (Number.isNaN(Number(snr)) || Number.isNaN(Number(powerDbm))) return "100W estimate unavailable";
  const estimate = scaledSnr(snr, powerDbm);
  return `
    <span class="estimate">100W est ${estimate >= 0 ? "+" : ""}${estimate.toFixed(0)} dB</span>
    ${modeText(estimate).map((mode) => `<span class="mode-chip ${mode.ok ? "ok" : "no"}">${mode.name}</span>`).join("")}
  `;
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
  clearTimeout(countryTimers.get(prefix));
  countryTimers.set(prefix, setTimeout(() => resolveCountry(prefix), 450));
}

function chooseSuggestion(prefix, label) {
  els[`${prefix}Country`].value = label;
  els[`${prefix}Suggestions`].classList.remove("open");
  resolveCountry(prefix);
}

function readBox(prefix) {
  const box = {
    name: els[`${prefix}Name`].value.trim() || `Region ${prefix.toUpperCase()}`,
    lat: Number(els[`${prefix}Name`].dataset.lat),
    lon: Number(els[`${prefix}Name`].dataset.lon),
    latMin: Number(els[`${prefix}LatMin`].value),
    latMax: Number(els[`${prefix}LatMax`].value),
    lonMin: Number(els[`${prefix}LonMin`].value),
    lonMax: Number(els[`${prefix}LonMax`].value)
  };
  if ([box.latMin, box.latMax, box.lonMin, box.lonMax].some((value) => Number.isNaN(value))) {
    throw new Error("Please check the latitude/longitude boxes.");
  }
  return box;
}

function regionWhere(prefix, box) {
  return `${prefix}_lat BETWEEN ${box.latMin} AND ${box.latMax} AND ${prefix}_lon BETWEEN ${box.lonMin} AND ${box.lonMax}`;
}

function pathWhere(a, b) {
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

function renderSpaceWeather(state, title, body) {
  els.spaceWeather.className = `space-weather ${state}`;
  els.spaceWeatherTitle.textContent = title;
  els.spaceWeatherBody.textContent = body;
}

async function loadSpaceWeather() {
  try {
    const response = await fetch(kpEndpoint, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`NOAA SWPC returned HTTP ${response.status}.`);
    const rows = await response.json();
    const now = Date.now();
    const recent = rows
      .map((row) => ({ time: new Date(`${row.time_tag}Z`), kp: Number(row.Kp) }))
      .filter((row) => !Number.isNaN(row.kp) && now - row.time.getTime() <= 48 * 60 * 60 * 1000)
      .sort((a, b) => a.time - b.time);
    if (!recent.length) {
      renderSpaceWeather("caution", "Kp data unavailable", "Could not find recent NOAA Kp values, so treat the WSPR history without a current geomagnetic check.");
      return;
    }
    const latest = recent[recent.length - 1];
    const max = recent.reduce((best, row) => row.kp > best.kp ? row : best, recent[0]);
    const maxText = `Latest Kp ${latest.kp.toFixed(1)}, max ${max.kp.toFixed(1)} in the last 48h.`;
    if (max.kp >= 5) {
      renderSpaceWeather("storm", "Geomagnetic storm recently", `${maxText} HF paths may be depressed or unusually variable; compare short history against longer history before calling the path dead.`);
    } else if (max.kp >= 4) {
      renderSpaceWeather("caution", "Geomagnetic activity elevated", `${maxText} Conditions may be unsettled, especially on higher latitude or polar paths.`);
    } else {
      renderSpaceWeather("quiet", "Geomagnetic field quiet", `${maxText} Recent Kp does not suggest a storm-driven warning for this path.`);
    }
  } catch (error) {
    renderSpaceWeather("caution", "Space weather check failed", `${error.message} WSPR results still work, but no current Kp warning is available.`);
  }
}

function heatColor(count, max) {
  if (!count) return "transparent";
  const strength = Math.max(0.18, count / max);
  const hue = 145 - strength * 70;
  const light = 34 + strength * 23;
  return `hsl(${hue} 82% ${light}%)`;
}

function renderScores(rows) {
  const byBand = new Map();
  rows.forEach((row) => {
    const current = byBand.get(row.band) || { band: row.band, spots: 0, best_snr: -99, activeHours: 0 };
    current.spots += Number(row.spots);
    current.best_snr = Math.max(current.best_snr, Number(row.best_snr));
    current.activeHours += 1;
    byBand.set(row.band, current);
  });

  const cards = [...byBand.values()].sort((a, b) => b.spots - a.spots).slice(0, 4);
  els.scoreStrip.innerHTML = cards.length ? cards.map((card) => `
    <article class="score-card">
      <div class="band">${bandLabel(card.band)}</div>
      <strong>${card.spots.toLocaleString()}</strong>
      <div class="metric">${card.activeHours} active UTC hours</div>
      <div class="metric">Best SNR ${card.best_snr} dB</div>
    </article>
  `).join("") : `<article class="score-card"><div class="band">No spots</div><div class="metric">Try a longer history window or wider boxes.</div></article>`;
}

function renderHeatmap(rows) {
  const max = Math.max(1, ...rows.map((row) => Number(row.spots)));
  const lookup = new Map(rows.map((row) => [`${row.band}-${row.hour}`, row]));
  const activeBands = bands.filter((band) => rows.some((row) => Number(row.band) === band));
  const header = `<tr><th>Band</th>${Array.from({ length: 24 }, (_, h) => `<th>${h}</th>`).join("")}</tr>`;
  const body = activeBands.map((band) => {
    const cells = Array.from({ length: 24 }, (_, hour) => {
      const row = lookup.get(`${band}-${hour}`);
      const count = row ? Number(row.spots) : 0;
      const title = row ? `${bandLabel(band)} ${hour}:00 UTC: ${count} spots, avg SNR ${row.avg_snr} dB` : "";
      return `<td title="${title}" style="background:${heatColor(count, max)}">${count || ""}</td>`;
    }).join("");
    return `<tr><th>${bandLabel(band)}</th>${cells}</tr>`;
  }).join("");
  els.heatmap.innerHTML = body ? header + body : `<tr><td>No WSPR spots found for this path.</td></tr>`;
}

function renderSlots(rows) {
  const slots = [...rows].sort((a, b) => Number(b.spots) - Number(a.spots)).slice(0, 8);
  els.slotList.innerHTML = slots.length ? slots.map((slot) => `
    <li>
      <div class="slot-main">
        <span>${bandLabel(slot.band)} at ${String(slot.hour).padStart(2, "0")}:00 UTC</span>
        <span>${Number(slot.spots).toLocaleString()}</span>
      </div>
      <div class="slot-sub">Avg SNR ${slot.avg_snr} dB, best ${slot.best_snr} dB, ${slot.tx_count} TX / ${slot.rx_count} RX stations</div>
      <div class="mode-hint">${scaledText(slot.best_snr, slot.best_power)}</div>
    </li>
  `).join("") : `<li>No ranked slots yet.</li>`;
}

function renderBandChances(rows) {
  const byBand = new Map();
  rows.forEach((row) => {
    const band = Number(row.band);
    const current = byBand.get(band) || { rows: [], total: 0 };
    current.rows.push(row);
    current.total += Number(row.spots);
    byBand.set(band, current);
  });

  const chances = [...byBand.entries()].map(([band, data]) => {
    const hourMap = new Map(data.rows.map((row) => [Number(row.hour), row]));
    let bestWindow = { start: 0, spots: -1, best: data.rows[0] };
    for (let start = 0; start < 24; start += 1) {
      const windowRows = [0, 1, 2].map((offset) => hourMap.get((start + offset) % 24)).filter(Boolean);
      const spots = windowRows.reduce((sum, row) => sum + Number(row.spots), 0);
      const best = windowRows.sort((a, b) => Number(b.best_snr) - Number(a.best_snr))[0] || data.rows[0];
      if (spots > bestWindow.spots) bestWindow = { start, spots, best };
    }
    const end = (bestWindow.start + 3) % 24;
    const windowText = `${String(bestWindow.start).padStart(2, "0")}:00-${String(end).padStart(2, "0")}:00 UTC`;
    return { band, best: bestWindow.best, total: data.total, windowSpots: bestWindow.spots, windowText };
  }).sort((a, b) => b.windowSpots - a.windowSpots);

  els.bandChanceList.innerHTML = chances.length ? chances.map((chance) => `
    <li>
      <div class="slot-main">
        <span>${bandLabel(chance.band)} best chance</span>
        <span>${chance.windowText}</span>
      </div>
      <div class="slot-sub">${Number(chance.windowSpots).toLocaleString()} spots in this 3h window, ${chance.total.toLocaleString()} total, best SNR ${chance.best.best_snr} dB</div>
      <div class="mode-hint">${scaledText(chance.best.best_snr, chance.best.best_power)}</div>
    </li>
  `).join("") : `<li>No per-band openings found.</li>`;
}

function renderLatest(rows) {
  els.latestMeta.textContent = rows.length ? `${rows.length} most recent` : "";
  els.latest.innerHTML = rows.length ? rows.map((spot) => `
    <article class="spot">
      <div class="spot-main">
        <span>${bandLabel(spot.band)} ${spot.tx_sign} → ${spot.rx_sign}</span>
        <span>${spot.snr} dB</span>
      </div>
      <div class="spot-sub">${spot.time.replace(" ", "T").slice(0, 16)} UTC · ${spot.tx_loc} to ${spot.rx_loc} · ${spot.distance} km · ${spot.power} dBm</div>
      <div class="mode-hint">${scaledText(spot.snr, spot.power)}</div>
    </article>
  `).join("") : `<p class="spot-sub">No recent spots for this path.</p>`;
}

async function run() {
  try {
    const a = readBox("a");
    const b = readBox("b");
    const days = Math.min(90, Math.max(1, Number(els.period.value)));
    const where = pathWhere(a, b);
    const since = `time >= now() - INTERVAL ${days} DAY`;

    setStatus(`Querying ${a.name} ↔ ${b.name} over ${days} days...`);
    els.runBtn.disabled = true;
    els.refreshBtn.disabled = true;

    const summarySql = `
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
      WHERE ${since} AND ${where}
      GROUP BY band, hour
      ORDER BY band, hour`;

    const latestSql = `
      SELECT time, band, tx_sign, tx_loc, rx_sign, rx_loc, distance, snr, power
      FROM wspr.rx
      WHERE ${since} AND ${where}
      ORDER BY time DESC
      LIMIT 30`;

    const [summary, latest] = await Promise.all([runQuery(summarySql), runQuery(latestSql)]);
    renderScores(summary);
    renderPathMap(a, b);
    renderHeatmap(summary);
    renderSlots(summary);
    renderBandChances(summary);
    renderLatest(latest);
    els.queryMeta.textContent = `${a.name} ↔ ${b.name}, ${days} days`;
    setStatus(`Found ${summary.reduce((sum, row) => sum + Number(row.spots), 0).toLocaleString()} spots across ${summary.length} band/hour slots.`);
  } catch (error) {
    setStatus(error.message, true);
  } finally {
    els.runBtn.disabled = false;
    els.refreshBtn.disabled = false;
  }
}

els.aCountry.addEventListener("input", () => scheduleCountryLookup("a"));
els.bCountry.addEventListener("input", () => scheduleCountryLookup("b"));
els.aCountry.addEventListener("change", () => resolveCountry("a"));
els.bCountry.addEventListener("change", () => resolveCountry("b"));
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
els.refreshBtn.addEventListener("click", () => {
  loadSpaceWeather();
  run();
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(() => {});
}

fillBox("a", knownRegions.scotland);
fillBox("b", knownRegions["new zealand"]);
loadSpaceWeather();
run();
