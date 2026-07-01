import { getWeatherIcon, getWMODescription } from '../utils/weather';

function ForecastCards({ daily }) {
  if (!daily?.time) return null;

  return (
    <div className="space-y-4 animate-slide-up">
      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white/90 mb-4 flex items-center gap-2">
          <span>&#128197;</span> 7-Day Forecast
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {daily.time.map((date, i) => {
            const weatherInfo = getWeatherIcon(daily.weather_code[i]);
            const dayName = i === 0 ? 'Today' : new Date(date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' });
            const dateStr = new Date(date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            return (
              <div key={date} className={`glass-light rounded-xl p-4 text-center transition-all hover:scale-105 ${i === 0 ? 'ring-1 ring-blue-400/30' : ''}`}>
                <div className="text-xs font-semibold text-white/70 mb-1">{dayName}</div>
                <div className="text-[10px] text-white/30 mb-3">{dateStr}</div>
                <div className="text-3xl mb-3">{weatherInfo.icon}</div>
                <div className="text-xs text-white/50 mb-3 h-8 flex items-center justify-center">
                  {getWMODescription(daily.weather_code[i])}
                </div>
                <div className="flex items-center justify-center gap-2 text-sm">
                  <span className="font-semibold text-white/90">{Math.round(daily.temperature_2m_max[i])}&deg;</span>
                  <span className="text-white/30">/</span>
                  <span className="text-white/40">{Math.round(daily.temperature_2m_min[i])}&deg;</span>
                </div>

                {/* Mini stats */}
                <div className="mt-3 pt-3 border-t border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-white/30">&#128168; Wind</span>
                    <span className="text-white/50">{Math.round(daily.wind_speed_10m_max[i])} mph</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-white/30">&#128167; Rain</span>
                    <span className="text-white/50">{daily.precipitation_sum[i].toFixed(2)}"</span>
                  </div>
                  {daily.uv_index_max && (
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-white/30">&#9728;&#65039; UV</span>
                      <span className={`${daily.uv_index_max[i] >= 8 ? 'text-red-400' : daily.uv_index_max[i] >= 6 ? 'text-orange-400' : daily.uv_index_max[i] >= 3 ? 'text-yellow-400' : 'text-green-400'}`}>
                        {Math.round(daily.uv_index_max[i])}
                      </span>
                    </div>
                  )}
                </div>

                {/* Sunrise/Sunset */}
                {daily.sunrise && daily.sunset && (
                  <div className="mt-2 pt-2 border-t border-white/5">
                    <div className="flex items-center justify-between text-[9px] text-white/25">
                      <span>&#127749; {new Date(daily.sunrise[i]).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                      <span>&#127751; {new Date(daily.sunset[i]).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Forecast summary */}
      <div className="glass rounded-2xl p-6">
        <h3 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2">
          <span>&#128202;</span> Week at a Glance
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <SummaryStat
            label="Highest Temp"
            value={`${Math.round(Math.max(...daily.temperature_2m_max))}\u00b0F`}
            sub={`on ${new Date(daily.time[daily.temperature_2m_max.indexOf(Math.max(...daily.temperature_2m_max))] + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' })}`}
            icon="&#127777;&#65039;"
          />
          <SummaryStat
            label="Max Wind"
            value={`${Math.round(Math.max(...daily.wind_speed_10m_max))} mph`}
            sub={`on ${new Date(daily.time[daily.wind_speed_10m_max.indexOf(Math.max(...daily.wind_speed_10m_max))] + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'short' })}`}
            icon="&#128168;"
          />
          <SummaryStat
            label="Total Precip"
            value={`${daily.precipitation_sum.reduce((a, b) => a + b, 0).toFixed(2)}"`}
            sub="this week"
            icon="&#127783;&#65039;"
          />
          {daily.uv_index_max && (
            <SummaryStat
              label="Peak UV"
              value={Math.round(Math.max(...daily.uv_index_max))}
              sub={Math.max(...daily.uv_index_max) >= 8 ? 'Very High' : Math.max(...daily.uv_index_max) >= 6 ? 'High' : 'Moderate'}
              icon="&#9728;&#65039;"
            />
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryStat({ label, value, sub, icon }) {
  return (
    <div className="glass-light rounded-xl p-4">
      <div className="text-lg mb-2">{icon}</div>
      <div className="text-xl font-bold text-white/90">{value}</div>
      <div className="text-[10px] text-white/40 uppercase tracking-wider mt-1">{label}</div>
      <div className="text-[10px] text-white/25 mt-0.5">{sub}</div>
    </div>
  );
}

export default ForecastCards;
