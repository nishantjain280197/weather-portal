import { useState, useEffect, useCallback } from 'react';
import SearchPanel from './components/SearchPanel';
import WeatherMap from './components/WeatherMap';
import PerilAssessment from './components/PerilAssessment';
import HistoricalChart from './components/HistoricalChart';
import HourlyChart from './components/HourlyChart';
import SearchHistory from './components/SearchHistory';
import PdfExport from './components/PdfExport';

const API_BASE = '/api';

function App() {
  const [location, setLocation] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSearchHistory = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/searches`);
      if (res.ok) {
        const data = await res.json();
        setSearchHistory(data);
      }
    } catch (err) {
      console.error('Failed to fetch search history:', err);
    }
  }, []);

  useEffect(() => {
    fetchSearchHistory();
  }, [fetchSearchHistory]);

  const handleSearch = async (address, coords) => {
    setLoading(true);
    setError(null);

    try {
      const { lat, lon } = coords;
      const today = new Date().toISOString().split('T')[0];

      const [weatherRes, assessRes, histRes] = await Promise.all([
        fetch(`${API_BASE}/weather/current?lat=${lat}&lon=${lon}`),
        fetch(`${API_BASE}/weather/assess?lat=${lat}&lon=${lon}`),
        fetch(`${API_BASE}/weather/historical?lat=${lat}&lon=${lon}&date=${today}`)
      ]);

      if (!weatherRes.ok || !assessRes.ok || !histRes.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const [weather, assess, historical] = await Promise.all([
        weatherRes.json(),
        assessRes.json(),
        histRes.json()
      ]);

      setLocation({ address, lat, lon });
      setCurrentWeather(weather);
      setAssessment(assess);
      setHistoricalData(historical);

      await fetch(`${API_BASE}/searches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          latitude: lat,
          longitude: lon,
          search_date: today,
          risk_summary: assess.assessment?.overall || 'Unknown'
        })
      });

      fetchSearchHistory();
    } catch (err) {
      setError(err.message || 'An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryClick = (search) => {
    handleSearch(search.address, { lat: search.latitude, lon: search.longitude });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Weather Peril Portal</h1>
              <p className="text-xs text-slate-500">Insurance Risk Assessment Tool</p>
            </div>
          </div>
          {location && (
            <PdfExport
              location={location}
              assessment={assessment}
              historicalData={historicalData}
            />
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <SearchPanel onSearch={handleSearch} loading={loading} />
            <SearchHistory history={searchHistory} onSelect={handleHistoryClick} />
          </div>

          <div className="lg:col-span-3 space-y-6">
            {loading && (
              <div className="flex items-center justify-center h-64 bg-white rounded-lg border">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-slate-600">Fetching weather data...</p>
                </div>
              </div>
            )}

            {location && !loading && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg border shadow-sm overflow-hidden" style={{ height: '350px' }}>
                    <WeatherMap lat={location.lat} lon={location.lon} assessment={assessment} />
                  </div>
                  <PerilAssessment assessment={assessment} />
                </div>

                {currentWeather?.hourly && (
                  <HourlyChart hourlyData={currentWeather.hourly} />
                )}

                {historicalData && (
                  <HistoricalChart data={historicalData} />
                )}
              </>
            )}

            {!location && !loading && (
              <div className="flex items-center justify-center h-64 bg-white rounded-lg border">
                <div className="text-center text-slate-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-lg font-medium">Search for a location</p>
                  <p className="text-sm">Enter a US address, city/state, or ZIP code to begin</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="mt-8 pt-4 border-t border-slate-200 text-center text-xs text-slate-500">
          Weather data provided by <a href="https://open-meteo.com/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Open-Meteo</a>.
          Geocoding by <a href="https://www.openstreetmap.org/" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">OpenStreetMap Nominatim</a>.
        </footer>
      </main>
    </div>
  );
}

export default App;
