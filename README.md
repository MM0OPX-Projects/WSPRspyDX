# WSPRSpyDX

WSPRSpyDX is a compact DX path dashboard for checking historical WSPR propagation between two countries, regions, zones, locators, or from one region to anywhere. It is aimed at quick phone use: choose Region A, optionally choose Region B, pick a history window, then use the spot counts, band summaries, UTC windows, and signal estimates to judge whether a path is worth trying.

The project is available in three formats:

- **HTML/PWA dashboard**: the source files at the repository root can be hosted with GitHub Pages or any static web host.
- **Single-file HTML dashboard**: `WSPRSpyDX-standalone.html` contains the interface, code, icon and map in one transferable file. Internet access is still required for live WSPR and NOAA data. The CW RBN Monitor is available only in the Android app.
- **Android APK**: `releases/WSPRSpyDX-v0.47-debug.apk` is a debug-signed test build that bundles the dashboard and Android-only CW RBN Monitor inside a small Android WebView app.

## Features

- Queries historical WSPR spots from the public WSPR Live ClickHouse endpoint.
- Lets you type countries or major regions for each end of the path.
- Lets you leave Region B blank to check Region A against anywhere, then use the main historical minimum/maximum-distance filter.
- Adds path modes for country/region, CQ zone, ITU zone, and Maidenhead locator searches.
- Supports multiple target zones or locators, for example `14` to `1,2`.
- Includes shortcuts for Scotland, New Zealand, USA East Coast, USA West Coast, and other common regions.
- Supports history windows from recent days up to longer lookbacks.
- Shows best bands and best UTC operating windows by band.
- Lets you tap a populated UTC Window cell to inspect matching WSPR spots, likely countries, distances, SNR, power, and 100 W mode estimates.
- Adds independently selectable minimum/maximum-distance filters for UTC Windows, Live Openings, and the CW Reverse Beacon Network monitor.
- Includes a live openings map with band-coloured paths, hot bands, hot countries, and 100 W mode estimates.
- Includes a CW Reverse Beacon Network monitor with callsign, time-window, and minimum/maximum-distance filtering.
- Estimates 100 W equivalent signal reports from WSPR SNR and reported transmit power.
- Shows green/red mode chips for approximate FT8, CW, and SSB viability.
- Adds a NOAA/SWPC geomagnetic activity warning when the last 24 hours of Kp data may make current HF conditions differ from the historical pattern.
- Uses a bundled local world map image with a curved path between the selected regions.
- Provides editable latitude/longitude boxes for manual region tuning.
- Uses a dark, card-based phone layout inspired by RiverWatch Scotland.

## Data Sources

WSPRSpyDX uses live internet data:

- WSPR spots: `https://db1.wspr.live/`
- WSPR Live project: `https://wspr.live/`
- NOAA/SWPC planetary K index: `https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json`
- Reverse Beacon Network spot feed: `https://www.reversebeacon.net/`
- Country and region lookup fallback: Nominatim geocoding

The map image is bundled locally. The dashboard does not depend on OpenStreetMap map tiles.

CQ and ITU zone searches are converted into practical latitude/longitude search areas because WSPR Live does not expose CQ or ITU zone columns in `wspr.rx`. Maidenhead locator searches are converted directly from the locator grid.

## Run The HTML Version Locally

From the repository folder:

```powershell
python -m http.server 8790 --bind 0.0.0.0
```

Open this on the computer:

```text
http://localhost:8790/
```

To use it from an Android phone on the same Wi-Fi, find the computer's LAN IP address and open:

```text
http://YOUR-COMPUTER-LAN-IP:8790/
```

In Chrome on Android, use **Add to Home screen** to install it like a small app.

## Build The Single-File HTML Version

The checked-in standalone file can be regenerated after dashboard changes with:

```powershell
powershell -ExecutionPolicy Bypass -File .\tools\build-standalone.ps1
```

This creates `WSPRSpyDX-standalone.html`. It can be opened directly or uploaded as one HTML file. An internet connection is still needed for the external radio and space-weather data sources.

## Publish With GitHub Pages

After pushing this repository to GitHub:

1. Open the repository on GitHub.
2. Go to **Settings > Pages**.
3. Set **Source** to **Deploy from a branch**.
4. Select branch `main` and folder `/root`.
5. Save.

GitHub will provide a public URL for the HTML dashboard.

## Install The Android APK

The test APK is:

```text
releases/WSPRSpyDX-v0.47-debug.apk
```

To install it on Android:

1. Transfer the APK to the phone.
2. Open **My Files** or your file manager.
3. Tap the APK.
4. If Android blocks the install, allow installs from that source.
5. Tap **Install**.

This APK is debug-signed for testing. Android may warn that it is from an unknown source. For proper public distribution, build and sign a release APK with a private release key.

## Android Source

The `android-apk/` folder contains a minimal native Android WebView wrapper:

- `AndroidManifest.xml`
- `src/com/mm0opx/dxpathchecker/MainActivity.java`
- `res/`

The current test APK was built locally from this wrapper and the dashboard assets.

## Repository Layout

```text
.
|-- index.html
|-- WSPRSpyDX-standalone.html
|-- app.js
|-- styles.css
|-- manifest.webmanifest
|-- sw.js
|-- icon.svg
|-- world-map.png
|-- tools/
|   `-- build-standalone.ps1
|-- android-apk/
`-- releases/
    `-- WSPRSpyDX-v0.47-debug.apk
```

## Notes

- The HTML shell can load offline after caching, but propagation data requires internet access.
- The 100 W and mode indicators are practical estimates, not guarantees of a QSO.
- WSPR uses very low power and narrow-band reporting, so use the dashboard as a path reckoner rather than a definitive prediction engine.

