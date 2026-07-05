# WSPRSpyDX

WSPRSpyDX is a compact DX path dashboard for checking historical WSPR propagation between two countries or regions. It is aimed at quick phone use: choose Region A and Region B, pick a history window, then use the spot counts, band summaries, UTC windows, and signal estimates to judge whether a path is worth trying.

The project is available in two formats:

- **HTML/PWA dashboard**: the source files at the repository root can be hosted with GitHub Pages or any static web host.
- **Android APK**: `releases/WSPRSpyDX-v0.20-debug.apk` is a debug-signed test build that bundles the same dashboard inside a small Android WebView app.

## Features

- Queries historical WSPR spots from the public WSPR Live ClickHouse endpoint.
- Lets you type countries or major regions for each end of the path.
- Adds path modes for country/region, CQ zone, ITU zone, and Maidenhead locator searches.
- Supports multiple target zones or locators, for example `14` to `1,2`.
- Includes shortcuts for Scotland, New Zealand, USA East Coast, USA West Coast, and other common regions.
- Supports history windows from recent days up to longer lookbacks.
- Shows best bands and best UTC operating windows by band.
- Adds minimum-distance filters for Best By Band, Best Slots, Live Openings, and the CW Reverse Beacon Network monitor.
- Includes a live openings map with band-coloured paths, hot bands, hot countries, and 100 W mode estimates.
- Includes a CW Reverse Beacon Network monitor with callsign, time-window, and minimum-distance filtering.
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
releases/WSPRSpyDX-v0.20-debug.apk
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
|-- app.js
|-- styles.css
|-- manifest.webmanifest
|-- sw.js
|-- icon.svg
|-- world-map.png
|-- android-apk/
`-- releases/
    `-- WSPRSpyDX-v0.19-debug.apk
```

## Notes

- The HTML shell can load offline after caching, but propagation data requires internet access.
- The 100 W and mode indicators are practical estimates, not guarantees of a QSO.
- WSPR uses very low power and narrow-band reporting, so use the dashboard as a path reckoner rather than a definitive prediction engine.

