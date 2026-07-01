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

  return (
    <div className="bg-white rounded-lg border shadow-sm p-4">
      <h2 className="text-sm font-semibold text-slate-700 mb-3">Search Location</h2>

      <div className="flex gap-1 mb-3">
        {[
          { key: 'address', label: 'Address' },
          { key: 'city', label: 'City/State' },
          { key: 'zip', label: 'ZIP Code' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setMode(tab.key); setQuery(''); setSuggestions([]); }}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              mode === tab.key
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder={placeholders[mode]}
          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={loading}
        />

        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
            {suggestions.map((s, i) => (
              <li
                key={i}
                onMouseDown={() => handleSuggestionClick(s)}
                className="px-3 py-2 text-xs text-slate-700 hover:bg-blue-50 cursor-pointer border-b border-slate-100 last:border-0"
              >
                {s.display_name}
              </li>
            ))}
          </ul>
        )}

        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="w-full mt-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
    </div>
  );
}

export default SearchPanel;
