const express = require('express');
const router = express.Router();
const { fetchWithRetry } = require('../utils/fetch');

const OPEN_METEO_FORECAST = 'https://api.open-meteo.com/v1/forecast';
const OPEN_METEO_ARCHIVE = 'https://archive-api.open-meteo.com/v1/archive';
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';

router.get('/geocode', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Query parameter "q" is required' });

    const url = `${NOMINATIM_URL}/search?q=${encodeURIComponent(q)}&format=json&addressdetails=1&countrycodes=us&limit=5`;
    const data = await fetchWithRetry(url, {
      headers: { 'User-Agent': 'WeatherPerilPortal/1.0 (insurance-assessment)' }
    });

    const results = data.map(item => ({
      display_name: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      address: item.address
    }));

    res.json(results);
  } catch (error) {
    console.error('Geocoding error:', error.message);
    res.status(500).json({ error: 'Failed to geocode address. Please try again.' });
  }
});

router.get('/current', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ error: 'lat and lon are required' });

    const url = `${OPEN_METEO_FORECAST}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_gusts_10m,wind_direction_10m,surface_pressure&hourly=wind_speed_10m,precipitation,temperature_2m,weather_code,relative_humidity_2m,uv_index&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,wind_speed_10m_max,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=auto&forecast_days=7`;
    const data = await fetchWithRetry(url);

    res.json(data);
  } catch (error) {
    console.error('Current weather error:', error.message);
    res.status(500).json({ error: 'Failed to fetch current weather data.' });
  }
});

router.get('/historical', async (req, res) => {
  try {
    const { lat, lon, date } = req.query;
    if (!lat || !lon || !date) {
      return res.status(400).json({ error: 'lat, lon, and date are required' });
    }

    const targetDate = new Date(date);
    const results = [];

    for (let yearsBack = 1; yearsBack <= 3; yearsBack++) {
      const historicalDate = new Date(targetDate);
      historicalDate.setFullYear(historicalDate.getFullYear() - yearsBack);
      const dateStr = historicalDate.toISOString().split('T')[0];

      const url = `${OPEN_METEO_ARCHIVE}?latitude=${lat}&longitude=${lon}&start_date=${dateStr}&end_date=${dateStr}&hourly=temperature_2m,precipitation,weather_code,wind_speed_10m,wind_gusts_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,wind_gusts_10m_max,weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=auto`;

      const data = await fetchWithRetry(url);
      results.push({
        year: historicalDate.getFullYear(),
        date: dateStr,
        data
      });
    }

    res.json(results);
  } catch (error) {
    console.error('Historical weather error:', error.message);
    res.status(500).json({ error: 'Failed to fetch historical weather data.' });
  }
});

router.get('/assess', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ error: 'lat and lon are required' });

    const db = req.app.locals.db;
    const thresholds = db.prepare('SELECT * FROM peril_thresholds').all();

    const url = `${OPEN_METEO_FORECAST}?latitude=${lat}&longitude=${lon}&current=temperature_2m,precipitation,weather_code,wind_speed_10m,wind_gusts_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=auto`;
    const data = await fetchWithRetry(url);

    const current = data.current;
    const assessment = assessPerils(current, thresholds);

    res.json({ current, assessment, thresholds });
  } catch (error) {
    console.error('Assessment error:', error.message);
    res.status(500).json({ error: 'Failed to assess weather perils.' });
  }
});

function assessPerils(current, thresholds) {
  const results = {};
  const windThreshold = thresholds.find(t => t.peril_type === 'wind');
  if (windThreshold) {
    const windSpeed = current.wind_speed_10m || 0;
    results.wind = {
      value: windSpeed,
      unit: 'mph',
      level: getRiskLevel(windSpeed, windThreshold)
    };
  }

  const precipThreshold = thresholds.find(t => t.peril_type === 'precipitation');
  if (precipThreshold) {
    const precip = current.precipitation || 0;
    results.precipitation = {
      value: precip,
      unit: 'inches',
      level: getRiskLevel(precip, precipThreshold)
    };
  }

  const hailCodes = [77, 96, 99];
  const weatherCode = current.weather_code || 0;
  results.hail = {
    detected: hailCodes.includes(weatherCode),
    weather_code: weatherCode,
    level: hailCodes.includes(weatherCode) ? 'Severe' : 'Low'
  };

  const tempHighThreshold = thresholds.find(t => t.peril_type === 'temperature_high');
  if (tempHighThreshold) {
    const temp = current.temperature_2m || 0;
    results.temperature = {
      value: temp,
      unit: '\u00b0F',
      level: getRiskLevel(temp, tempHighThreshold)
    };
  }

  results.storm = {
    detected: weatherCode >= 95,
    weather_code: weatherCode,
    description: getWMODescription(weatherCode),
    level: weatherCode >= 95 ? 'Severe' : weatherCode >= 80 ? 'High' : 'Low'
  };

  const levels = Object.values(results).map(r => r.level);
  const severityOrder = ['Low', 'Moderate', 'High', 'Severe'];
  results.overall = severityOrder[Math.max(...levels.map(l => severityOrder.indexOf(l)))];

  return results;
}

function getRiskLevel(value, threshold) {
  if (value <= threshold.low_max) return 'Low';
  if (value <= threshold.moderate_max) return 'Moderate';
  if (value <= threshold.high_max) return 'High';
  return 'Severe';
}

function getWMODescription(code) {
  const descriptions = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Depositing rime fog',
    51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
    61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
    66: 'Light freezing rain', 67: 'Heavy freezing rain',
    71: 'Slight snowfall', 73: 'Moderate snowfall', 75: 'Heavy snowfall',
    77: 'Snow grains / Ice pellets',
    80: 'Slight rain showers', 81: 'Moderate rain showers', 82: 'Violent rain showers',
    85: 'Slight snow showers', 86: 'Heavy snow showers',
    95: 'Thunderstorm', 96: 'Thunderstorm with slight hail', 99: 'Thunderstorm with heavy hail'
  };
  return descriptions[code] || `Weather code ${code}`;
}

module.exports = router;
