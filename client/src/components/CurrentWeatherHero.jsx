import { getWeatherIcon, getWindDirection, getWMODescription, riskConfig } from '../utils/weather';

function CurrentWeatherHero({ location, currentWeather, assessment }) {
  const current = currentWeather?.current;
  if (!current) return null;

  const weatherInfo = getWeatherIcon(current.weather_code);
  const riskLevel = assessment?.assessment?.overall || 'Low';
  const risk = riskConfig[riskLevel] || riskConfig.Low;

  const shortAddress = location.address.split(',').slice(0, 2).join(', ');

  return (
    <div className={`glass rounded-2xl overflow-hidden weather-glow animate-slide-up`}>
      <div className={`bg-gradient-to-r ${weatherInfo.bg} p-[1px] rounded-2xl`}>
        <div className="bg-slate-900/90 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Left: Temperature + Condition */}
            <div className="flex items-center gap-6">
              <div className="text-7xl animate-float">{weatherInfo.icon}</div>
              <div>
                <div className="text-6xl font-extralight tracking-tighter">
                  {Math.round(current.temperature_2m)}
                  <span className="text-3xl text-white/40">&deg;F</span>
                </div>
                <p className="text-white/60 text-sm mt-1">
                  {getWMODescription(current.weather_code)}
                </p>
                <p className="text-white/30 text-xs mt-0.5">
                  Feels like {Math.round(current.apparent_temperature || current.temperature_2m)}&deg;F
                </p>
              </div>
            </div>

            {/* Center: Location */}
            <div className="text-center md:text-left">
              <h2 className="text-lg font-semibold text-white/90">{shortAddress}</h2>
              <p className="text-white/30 text-xs">
                {location.lat.toFixed(4)}&deg;N, {Math.abs(location.lon).toFixed(4)}&deg;{location.lon >= 0 ? 'E' : 'W'}
              </p>
              <p className="text-white/20 text-[10px] mt-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            {/* Right: Risk Badge */}
            <div className="flex flex-col items-center gap-2">
              <div className={`px-5 py-2.5 rounded-xl bg-gradient-to-r ${risk.gradient} shadow-lg risk-glow-${riskLevel.toLowerCase()}`}>
                <span className="text-sm font-bold tracking-wide">{riskLevel} Risk</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-white/40 mt-2">
                <span>&#128168; {current.wind_speed_10m} mph {getWindDirection(current.wind_direction_10m || 0)}</span>
                <span>&#128167; {(current.relative_humidity_2m || 0)}%</span>
              </div>
            </div>
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/5">
            <QuickStat label="Wind Speed" value={`${current.wind_speed_10m} mph`} icon="&#128168;" />
            <QuickStat label="Humidity" value={`${current.relative_humidity_2m || '--'}%`} icon="&#128167;" />
            <QuickStat label="Pressure" value={`${current.surface_pressure ? Math.round(current.surface_pressure) : '--'} hPa`} icon="&#9202;&#65039;" />
            <QuickStat label="Gusts" value={`${current.wind_gusts_10m || '--'} mph`} icon="&#127744;" />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickStat({ label, value, icon }) {
  return (
    <div className="glass-light rounded-xl px-4 py-3 text-center">
      <div className="text-lg mb-1">{icon}</div>
      <div className="text-sm font-semibold text-white/90">{value}</div>
      <div className="text-[10px] text-white/40 uppercase tracking-wider">{label}</div>
    </div>
  );
}

export default CurrentWeatherHero;
