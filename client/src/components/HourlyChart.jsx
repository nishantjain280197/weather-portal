
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function HourlyChart({ hourlyData }) {
  if (!hourlyData?.time || !hourlyData?.wind_speed_10m) return null;

  const chartData = hourlyData.time.slice(0, 24).map((time, i) => ({
    hour: new Date(time).getHours() + ':00',
    wind: hourlyData.wind_speed_10m[i] || 0,
    precip: (hourlyData.precipitation?.[i] || 0) * 10,
    temp: hourlyData.temperature_2m?.[i] || 0
  }));

  return (
    <div className="bg-white rounded-lg border shadow-sm p-4">
      <h3 className="text-sm font-semibold text-slate-700 mb-4">24-Hour Wind Speed Breakdown</h3>
      <div style={{ height: '250px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="hour" tick={{ fontSize: 11 }} stroke="#94a3b8" />
            <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" label={{ value: 'mph', angle: -90, position: 'insideLeft', style: { fontSize: 11 } }} />
            <Tooltip
              contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
              formatter={(value, name) => {
                if (name === 'wind') return [`${value.toFixed(1)} mph`, 'Wind Speed'];
                return [value, name];
              }}
            />
            <Area
              type="monotone"
              dataKey="wind"
              stroke="#3b82f6"
              fill="#93c5fd"
              fillOpacity={0.3}
              strokeWidth={2}
              name="wind"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default HourlyChart;
