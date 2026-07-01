import { useState } from 'react';

const API_BASE = '/api';

function SearchPanel({ onSearch, loading }) {
  const [mode, setMode] = useState('address');
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length >= 3) {
      try {
        const res = await fetch(`${API_BASE}/weather/geocode?q=${encodeURIComponent(value)}`);
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
          setShowSuggestions(true);
        }
      } catch (err) {
        console.error('Autocomplete error:', err);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.display_name);
    setSuggestions([]);
    setShowSuggestions(false);
    onSearch(suggestion.display_name, { lat: suggestion.lat, lon: suggestion.lon });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      const res = await fetch(`${API_BASE}/weather/geocode?q=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          const result = data[0];
          onSearch(result.display_name, { lat: result.lat, lon: result.lon });
          setShowSuggestions(false);
        } else {
          alert('No US locations found. Please try a different search.');
        }
      }
    } catch (err) {
      alert('Failed to geocode. Please check your input and try again.');
    }
  };

  const placeholders = {
    address: '123 Main St, Springfield, IL',
    city: 'Miami, FL',
    zip: '90210'
  };

  const modeIcons = {
    address: '\ud83c\udfe0',
    city: '\ud83c\udfd9\ufe0f',
    zip: '\ud83d\udcee'
  };

  return (
    <div className="glass rounded-2xl p-4">
      <h2 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2">
        <span>&#128269;</span> Search Location
      </h2>

      <div className="flex gap-1 mb-3 p-1 rounded-lg bg-white/5">
        {[
          { key: 'address', label: 'Address' },
          { key: 'city', label: 'City/State' },
          { key: 'zip', label: 'ZIP' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setMode(tab.key); setQuery(''); setSuggestions([]); }}
            className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 text-[11px] font-medium rounded-md transition-all ${
              mode === tab.key
                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25'
                : 'text-white/40 hover:text-white/70 hover:bg-white/5'
            }`}
          >
            <span className="text-xs">{modeIcons[tab.key]}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder={placeholders[mode]}
            className="w-full px-4 py-3 text-sm bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
            disabled={loading}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20">
            {loading ? (
              <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>
        </div>

        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-50 w-full mt-2 glass rounded-xl shadow-2xl max-h-48 overflow-y-auto scrollbar-thin">
            {suggestions.map((s, i) => (
              <li
                key={i}
                onMouseDown={() => handleSuggestionClick(s)}
                className="px-4 py-3 text-xs text-white/70 hover:bg-white/10 cursor-pointer border-b border-white/5 last:border-0 transition-colors flex items-center gap-2"
              >
                <span className="text-blue-400/60">&#128205;</span>
                <span className="truncate">{s.display_name}</span>
              </li>
            ))}
          </ul>
        )}

        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="w-full mt-3 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold rounded-xl hover:from-blue-600 hover:to-cyan-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-[0.98]"
        >
          {loading ? 'Analyzing...' : 'Analyze Weather'}
        </button>
      </form>
    </div>
  );
}

export default SearchPanel;
