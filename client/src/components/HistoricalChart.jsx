import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

function HistoricalChart({ data }) {
  if (!data || data.length === 0) return null;

  const windData = data.map(item => ({
    year: item.year.toString(),
    maxWind: item.data?.daily?.wind_speed_10m_max?.[0] || 0,
    maxGust: item.data?.daily?.wind_gusts_10m_max?.[0] || 0,
  }));

  const precipData = data.map(item => ({
    year: item.year.toString(),
    precipitation: item.data?.daily?.precipitation_sum?.[0] || 0,
  }));

  const tempData = data.map(item => ({
    year: item.year,
    high: item.data?.daily?.temperature_2m_max?.[0],
    low: item.data?.daily?.temperature_2m_min?.[0],
  }));

  const currentWind = windData[0]?.maxWind || 0;
  const avgWind = windData.reduce((sum, d) => sum + d.maxWind, 0) / windData.length;
  const isAnomaly = currentWind > avgWind * 1.5;

  const barColors = ['#3b82f6', '#06b6d4', '#8b5cf6'];

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Anomaly Alert */}
      {isAnomaly && (
        <div className="glass rounded-xl p-4 border border-amber-500/20">
          <div className="flex items-center gap-2 text-amber-400">
            <span className="text-lg">&#9888;&#65039;</span>
            <span className="text-sm font-semibold">Wind Anomaly Detected</span>
          </div>
          <p className="text-xs text-amber-300/60 mt-1 ml-7">
            Recent max wind speed ({currentWind.toFixed(1)} mph) is {(currentWind / avgWind).toFixed(1)}x the 3-year average ({avgWind.toFixed(1)} mph)
          </p>
        </div>
      )}

      <div className="glass rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white/90 mb-6 flex items-center gap-2">
          <span>&#128200;</span> 3-Year Historical Comparison
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Wind Chart */}
          <div>
            <h4 className="text-xs font-medium text-white/50 mb-3 flex items-center gap-1.5">
              <span>&#128168;</span> Max Wind Speed (mph)
            </h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={windData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis
                    dataKey="year"
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                  />
                  <YAxis
                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    width={35}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="maxWind" name="Max Wind" radius={[6, 6, 0, 0]}>
                    {windData.map((_, i) => (
                      <Cell key={i} fill={barColors[i]} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Precipitation Chart */}
          <div>
            <h4 className="text-xs font-medium text-white/50 mb-3 flex items-center gap-1.5">
              <span>&#127783;&#65039;</span> Precipitation (inches)
            </h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={precipData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis
                    dataKey="year"
                    tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                  />
                  <YAxis
                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                    width={35}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar dataKey="precipitation" name="Precipitation" radius={[6, 6, 0, 0]}>
                    {precipData.map((_, i) => (
                      <Cell key={i} fill={['#06b6d4', '#0ea5e9', '#38bdf8'][i]} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Temperature Cards */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          {tempData.map((d, i) => (
            <div key={i} className="glass-light rounded-xl p-4 text-center">
              <div className="text-xs text-white/40 mb-2">{d.year}</div>
              <div className="text-lg font-bold text-white/90">
                {d.high ? Math.round(d.high) : '--'}&deg;F
              </div>
              <div className="text-xs text-white/30">
                / {d.low ? Math.round(d.low) : '--'}&deg;F
              </div>
              <div className="text-[9px] text-white/20 mt-1 uppercase tracking-wider">High / Low</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg px-3 py-2 shadow-xl text-xs">
      <p className="text-white/60 mb-1 font-medium">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-white/80" style={{ color: entry.fill || entry.color }}>
          {entry.name}: <span className="font-semibold">{typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}</span>
        </p>
      ))}
    </div>
  );
}

export default HistoricalChart;
