---
name: testing-weather-portal
description: Test the Weather Peril Portal end-to-end. Use when verifying search, map, charts, history, or PDF export functionality.
---

# Testing the Weather Peril Portal

## Prerequisites
- Node.js 18+ installed
- Dependencies installed: `npm run install:all` (installs root, server, and client deps)

## Starting the Dev Environment
1. Start the backend: `cd server && node src/index.js` (runs on port 3001)
2. Start the frontend: `cd client && npx vite --host` (runs on port 5173)
3. The Vite dev server proxies `/api` requests to `localhost:3001`

## Key Test Flows

### 1. Initial Page Load
- Navigate to `http://localhost:5173`
- Verify: header "Weather Peril Portal", 3 search tabs (Address/City-State/ZIP Code), empty state, footer attribution
- "Export PDF" button should NOT be visible until a search is performed

### 2. Address Search with Autocomplete
- Type 3+ characters in the search input to trigger autocomplete (calls Nominatim via `/api/weather/geocode`)
- Click a suggestion or click "Search" to execute
- After search: map, peril assessment, hourly wind chart, 3-year historical chart should all appear
- Search history sidebar should update with the new entry

### 3. Multiple Search Modes
- Click "City/State" or "ZIP Code" tabs to change search mode
- Placeholder text changes per mode
- Note: Nominatim may not resolve bare ZIP codes to the expected city (e.g., "90210" might match a road number). This is expected Nominatim behavior, not a bug.

### 4. Search History
- After multiple searches, the sidebar shows all entries with address, date, and risk level dot
- Clicking a history entry re-runs the search for that location

### 5. PDF Export
- Click "Export PDF" button in header (only visible after a search)
- Downloads a PDF named `weather-report-{lat}_{lon}.pdf`
- Verify file is non-empty (should be 10+ KB)

### 6. Map Marker Popup
- Click the blue marker pin on the Leaflet map
- Popup shows "Risk Level: {level}" and coordinates

## API Endpoints (for debugging)
- `GET /api/weather/geocode?q=Miami` — geocode
- `GET /api/weather/current?lat=25.77&lon=-80.19` — current weather
- `GET /api/weather/assess?lat=25.77&lon=-80.19` — peril assessment
- `GET /api/weather/historical?lat=25.77&lon=-80.19&date=2026-07-01` — 3-year history
- `GET /api/searches` — search history
- `GET /api/thresholds` — peril thresholds

## Common Issues
- If the server fails to start with EADDRINUSE, another instance is already running on port 3001. Kill it with `lsof -ti:3001 | xargs kill` or use a different port.
- Nominatim has a rate limit of 1 request/second. Rapid typing in the search box might cause some autocomplete requests to fail silently.
- The SQLite database is created at `server/data/weather-portal.db` on first run. Delete it to reset all data.

## Devin Secrets Needed
None — all APIs (Open-Meteo, Nominatim) are free and require no API keys.
