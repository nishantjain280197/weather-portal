import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function HourlyChart({ hourlyData }) {
  if (!hourlyData?.time) return null;

  const data = hourlyData.time.slice(0, 24).map((time, i) => ({
    time: new Date(time).toLocaleTimeString('en-US', { hour: 'numeric' }),
    wind: hourlyData.wind_speed_10m[i],
    temp: hourlyData.temperature_2m?.[i],
    precip: hourlyData.precipitation?.[i] || 0,
    uv: hourlyData.uv_index?.[i] || 0,
  }));

  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-white/70 mb-4 flex items-center gap-2">
        <span>&#128168;</span> 24-Hour Wind & Conditions
      </h3>

      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="windGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
            <XAxis
              dataKey="time"
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
              interval={2}
            />
            <YAxis
              tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              width={35}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="wind"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#windGradient)"
              name="Wind (mph)"
              dot={false}
              activeDot={{ r: 4, stroke: '#3b82f6', strokeWidth: 2, fill: '#1e293b' }}
            />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="#f97316"
              strokeWidth={1.5}
              fill="url(#tempGradient)"
              name="Temp (\u00b0F)"
              dot={false}
              activeDot={{ r: 3, stroke: '#f97316', strokeWidth: 2, fill: '#1e293b' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-3 text-[10px] text-white/30">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-blue-500 rounded-full" /> Wind Speed (mph)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-orange-500 rounded-full" /> Temperature (&deg;F)
        </span>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass rounded-lg px-3 py-2 shadow-xl text-xs">
      <p className="text-white/60 mb-1 font-medium">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-white/80" style={{ color: entry.color }}>
          {entry.name}: <span className="font-semibold">{entry.value?.toFixed(1)}</span>
        </p>
      ))}
    </div>
  );
}

export default HourlyChart;
