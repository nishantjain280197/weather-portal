import { getWindDirection } from '../utils/weather';

function WeatherDetails({ currentWeather }) {
  const current = currentWeather?.current;
  const daily = currentWeather?.daily;
  if (!current) return null;

  const sunrise = daily?.sunrise?.[0] ? new Date(daily.sunrise[0]) : null;
  const sunset = daily?.sunset?.[0] ? new Date(daily.sunset[0]) : null;
  const uvMax = daily?.uv_index_max?.[0] || 0;

  const details = [
    { icon: '\ud83c\udf21\ufe0f', label: 'Feels Like', value: `${Math.round(current.apparent_temperature || current.temperature_2m)}\u00b0F` },
    { icon: '\ud83d\udca7', label: 'Humidity', value: `${current.relative_humidity_2m || '--'}%` },
    { icon: '\ud83d\udca8', label: 'Wind', value: `${current.wind_speed_10m} mph ${getWindDirection(current.wind_direction_10m || 0)}` },
    { icon: '\ud83c\udf00', label: 'Gusts', value: `${current.wind_gusts_10m || '--'} mph` },
    { icon: '\u23f2\ufe0f', label: 'Pressure', value: `${current.surface_pressure ? Math.round(current.surface_pressure) : '--'} hPa` },
    { icon: '\ud83c\udf27\ufe0f', label: 'Precipitation', value: `${current.precipitation || 0}" today` },
    { icon: '\u2600\ufe0f', label: 'UV Index', value: uvMax, extra: getUVLabel(uvMax) },
    { icon: '\ud83c\udf05', label: 'Sunrise', value: sunrise ? sunrise.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '--' },
    { icon: '\ud83c\udf07', label: 'Sunset', value: sunset ? sunset.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '--' },
    { icon: '\ud83c\udf21\ufe0f', label: 'High / Low', value: daily ? `${Math.round(daily.temperature_2m_max[0])}\u00b0 / ${Math.round(daily.temperature_2m_min[0])}\u00b0F` : '--' },
  ];

  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-white/70 mb-4 flex items-center gap-2">
        <span>&#128202;</span> Current Conditions
      </h3>
      <div className="grid grid-cols-2 gap-2.5">
        {details.map((d, i) => (
          <div key={i} className="glass-light rounded-xl px-3 py-2.5 flex items-center gap-3 hover:bg-white/10 transition-colors">
            <span className="text-lg">{d.icon}</span>
            <div className="min-w-0">
              <div className="text-[10px] text-white/35 uppercase tracking-wider">{d.label}</div>
              <div className="text-xs font-medium text-white/80 flex items-center gap-1.5">
                {d.value}
                {d.extra && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-white/10">{d.extra}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getUVLabel(uv) {
  if (uv >= 11) return 'Extreme';
  if (uv >= 8) return 'Very High';
  if (uv >= 6) return 'High';
  if (uv >= 3) return 'Moderate';
  return 'Low';
}

export default WeatherDetails;
