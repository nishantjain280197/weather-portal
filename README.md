# Weather Peril Portal

Real-Time Weather Peril Assessment Portal for US Insurance companies. Enables adjusters and underwriters to search any US location and instantly view current weather conditions, risk severity levels, and 3-year historical patterns.

## Features

- **Address Search** — Full address, city/state, or ZIP code with autocomplete
- **Interactive Map** — Leaflet.js with OpenStreetMap tiles showing searched locations
- **Peril Assessment** — Wind, hail, precipitation, temperature, and storm risk levels (Low/Moderate/High/Severe)
- **3-Year Historical Comparison** — Year-over-year charts with anomaly detection
- **24-Hour Wind Breakdown** — Hourly wind speed chart for the selected date
- **Search History** — SQLite-backed clickable list of recent searches
- **PDF Report Export** — Downloadable assessment report with all data

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + Vite, Tailwind CSS, Recharts, Leaflet.js, jsPDF |
| Backend | Node.js + Express |
| Database | SQLite (better-sqlite3) |
| APIs | Open-Meteo (weather), Nominatim (geocoding) |

## Getting Started

```bash
# Install all dependencies
npm run install:all

# Run development (both client + server)
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## Production Build

```bash
cd client && npm run build
cd ../server && npm start
```

## Deployment

Configured for Render.com free tier via `render.yaml`. Push to main and connect the repo on Render.

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/weather/geocode?q=` | Geocode an address (Nominatim) |
| `GET /api/weather/current?lat=&lon=` | Current weather + hourly forecast |
| `GET /api/weather/historical?lat=&lon=&date=` | 3-year historical data |
| `GET /api/weather/assess?lat=&lon=` | Full peril risk assessment |
| `GET /api/searches` | Recent search history |
| `POST /api/searches` | Save a new search |
| `GET /api/thresholds` | Get configurable peril thresholds |
| `PUT /api/thresholds/:id` | Update a threshold |

## Attribution

Weather data provided by [Open-Meteo](https://open-meteo.com/). Geocoding by [OpenStreetMap Nominatim](https://nominatim.openstreetmap.org/).
