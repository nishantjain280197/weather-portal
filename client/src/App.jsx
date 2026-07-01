import { useState, useEffect, useCallback } from 'react';
import SearchPanel from './components/SearchPanel';
import WeatherMap from './components/WeatherMap';
import PerilAssessment from './components/PerilAssessment';
import HistoricalChart from './components/HistoricalChart';
import HourlyChart from './components/HourlyChart';
import SearchHistory from './components/SearchHistory';
import PdfExport from './components/PdfExport';
import CurrentWeatherHero from './components/CurrentWeatherHero';
import ForecastCards from './components/ForecastCards';
import WeatherDetails from './components/WeatherDetails';

const API_BASE = '/api';

function App() {
  const [location, setLocation] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [historicalData, setHistoricalData] = useState(null);
  const [searchHistory, setSearchHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

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
      setActiveTab('overview');

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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '\ud83c\udf24\ufe0f' },
    { id: 'forecast', label: '7-Day Forecast', icon: '\ud83d\udcc5' },
    { id: 'perils', label: 'Risk Assessment', icon: '\u26a0\ufe0f' },
    { id: 'history', label: 'Historical', icon: '\ud83d\udcca' },
  ];

  return (
    <div className="min-h-screen text-white">
      {/* Animated background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
              <span className="text-xl">&#9729;&#65039;</span>
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                Weather Peril Portal
              </h1>
              <p className="text-[10px] text-blue-300/60 font-medium tracking-wider uppercase">
                Insurance Risk Intelligence
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {location && (
              <PdfExport
                location={location}
                assessment={assessment}
                historicalData={historicalData}
              />
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 p-4 glass rounded-xl border border-red-500/30 text-red-300 animate-slide-up">
            <div className="flex items-center gap-2">
              <span>&#9888;&#65039;</span>
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-3 space-y-4">
            <SearchPanel onSearch={handleSearch} loading={loading} />
            <SearchHistory history={searchHistory} onSelect={handleHistoryClick} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-6">
            {loading && (
              <div className="flex items-center justify-center h-80 glass rounded-2xl animate-slide-up">
                <div className="text-center">
                  <div className="text-6xl animate-float mb-4">&#9729;&#65039;</div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <p className="text-blue-300/70 mt-3 text-sm">Analyzing weather conditions...</p>
                </div>
              </div>
            )}

            {location && !loading && (
              <>
                {/* Hero Card */}
                <CurrentWeatherHero
                  location={location}
                  currentWeather={currentWeather}
                  assessment={assessment}
                />

                {/* Tab Navigation */}
                <div className="glass rounded-xl p-1 flex gap-1">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        activeTab === tab.id
                          ? 'bg-gradient-to-r from-blue-500/30 to-cyan-500/30 text-white shadow-lg shadow-blue-500/10'
                          : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                      }`}
                    >
                      <span>{tab.icon}</span>
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="animate-slide-up" key={activeTab}>
                  {activeTab === 'overview' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="glass rounded-2xl overflow-hidden" style={{ height: '350px' }}>
                          <WeatherMap lat={location.lat} lon={location.lon} assessment={assessment} />
                        </div>
                        <WeatherDetails currentWeather={currentWeather} />
                      </div>
                      {currentWeather?.hourly && (
                        <HourlyChart hourlyData={currentWeather.hourly} />
                      )}
                    </div>
                  )}

                  {activeTab === 'forecast' && currentWeather?.daily && (
                    <ForecastCards daily={currentWeather.daily} />
                  )}

                  {activeTab === 'perils' && (
                    <PerilAssessment assessment={assessment} />
                  )}

                  {activeTab === 'history' && historicalData && (
                    <HistoricalChart data={historicalData} />
                  )}
                </div>
              </>
            )}

            {!location && !loading && (
              <div className="flex items-center justify-center h-96 glass rounded-2xl weather-glow">
                <div className="text-center px-8">
                  <div className="text-8xl mb-6 animate-float">&#127782;&#65039;</div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent mb-3">
                    Weather Intelligence Hub
                  </h2>
                  <p className="text-blue-300/50 text-sm max-w-md mx-auto leading-relaxed">
                    Enter a US address, city/state, or ZIP code to analyze weather perils,
                    view 7-day forecasts, and assess insurance risk levels
                  </p>
                  <div className="flex items-center justify-center gap-6 mt-8 text-xs text-white/30">
                    <span>&#127777;&#65039; Temperature</span>
                    <span>&#128168; Wind</span>
                    <span>&#127783;&#65039; Precipitation</span>
                    <span>&#9889; Storms</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <footer className="mt-10 pt-4 border-t border-white/5 text-center text-[11px] text-white/25">
          Weather data by{' '}
          <a href="https://open-meteo.com/" className="text-blue-400/50 hover:text-blue-400 transition-colors" target="_blank" rel="noopener noreferrer">
            Open-Meteo
          </a>
          {' '}&bull;{' '}
          Geocoding by{' '}
          <a href="https://www.openstreetmap.org/" className="text-blue-400/50 hover:text-blue-400 transition-colors" target="_blank" rel="noopener noreferrer">
            OpenStreetMap Nominatim
          </a>
        </footer>
      </main>
    </div>
  );
}

export default App;
