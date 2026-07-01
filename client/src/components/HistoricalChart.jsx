
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function HistoricalChart({ data }) {
  if (!data || data.length === 0) return null;

  const chartData = data.map((yearData) => {
    const daily = yearData.data?.daily;
    return {
      year: yearData.year.toString(),
      windMax: daily?.wind_speed_10m_max?.[0] || 0,
      gustMax: daily?.wind_gusts_10m_max?.[0] || 0,
      precipitation: daily?.precipitation_sum?.[0] || 0,
      tempMax: daily?.temperature_2m_max?.[0] || 0,
      tempMin: daily?.temperature_2m_min?.[0] || 0
    };
  }).reverse();

  const avgWind = chartData.reduce((s, d) => s + d.windMax, 0) / chartData.length;
  const currentWind = chartData[chartData.length - 1]?.windMax || 0;
  const windAnomaly = avgWind > 0 ? (currentWind / avgWind).toFixed(1) : null;

  return (
    <div className="bg-white rounded-lg border shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-700">3-Year Historical Comparison</h3>
        {windAnomaly && parseFloat(windAnomaly) > 1.5 && (
          <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">
            Wind {windAnomaly}x avg
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-slate-500 mb-2 font-medium">Max Wind Speed (mph)</p>
          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                <Bar dataKey="windMax" fill="#3b82f6" name="Max Wind" radius={[4, 4, 0, 0]} />
                <Bar dataKey="gustMax" fill="#93c5fd" name="Max Gust" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <p className="text-xs text-slate-500 mb-2 font-medium">Precipitation (inches)</p>
          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <Tooltip contentStyle={{ fontSize: '12px', borderRadius: '8px' }} />
                <Bar dataKey="precipitation" fill="#06b6d4" name="Precipitation" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {chartData.map((d) => (
          <div key={d.year} className="bg-slate-50 rounded-md p-3 text-center">
            <p className="text-xs text-slate-500">{d.year}</p>
            <p className="text-sm font-semibold text-slate-700">{d.tempMax.toFixed(0)}°F / {d.tempMin.toFixed(0)}°F</p>
            <p className="text-xs text-slate-500">High / Low</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HistoricalChart;
