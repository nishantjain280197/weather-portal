export function getWeatherIcon(code) {
  const icons = {
    0: { icon: '\u2600\ufe0f', bg: 'from-yellow-400 to-orange-400' },
    1: { icon: '\ud83c\udf24\ufe0f', bg: 'from-yellow-300 to-blue-300' },
    2: { icon: '\u26c5', bg: 'from-blue-300 to-gray-300' },
    3: { icon: '\u2601\ufe0f', bg: 'from-gray-400 to-gray-500' },
    45: { icon: '\ud83c\udf2b\ufe0f', bg: 'from-gray-300 to-gray-400' },
    48: { icon: '\ud83c\udf2b\ufe0f', bg: 'from-gray-300 to-blue-200' },
    51: { icon: '\ud83c\udf26\ufe0f', bg: 'from-blue-300 to-blue-400' },
    53: { icon: '\ud83c\udf26\ufe0f', bg: 'from-blue-400 to-blue-500' },
    55: { icon: '\ud83c\udf26\ufe0f', bg: 'from-blue-500 to-blue-600' },
    61: { icon: '\ud83c\udf27\ufe0f', bg: 'from-blue-400 to-blue-600' },
    63: { icon: '\ud83c\udf27\ufe0f', bg: 'from-blue-500 to-blue-700' },
    65: { icon: '\ud83c\udf27\ufe0f', bg: 'from-blue-600 to-indigo-700' },
    66: { icon: '\ud83c\udf28\ufe0f', bg: 'from-blue-300 to-cyan-500' },
    67: { icon: '\ud83c\udf28\ufe0f', bg: 'from-blue-400 to-cyan-600' },
    71: { icon: '\ud83c\udf28\ufe0f', bg: 'from-blue-100 to-blue-300' },
    73: { icon: '\u2744\ufe0f', bg: 'from-blue-200 to-blue-400' },
    75: { icon: '\u2744\ufe0f', bg: 'from-blue-300 to-indigo-400' },
    77: { icon: '\ud83e\udea8', bg: 'from-gray-300 to-blue-400' },
    80: { icon: '\ud83c\udf26\ufe0f', bg: 'from-blue-300 to-gray-400' },
    81: { icon: '\ud83c\udf27\ufe0f', bg: 'from-blue-400 to-gray-500' },
    82: { icon: '\u26c8\ufe0f', bg: 'from-blue-600 to-gray-700' },
    85: { icon: '\ud83c\udf28\ufe0f', bg: 'from-blue-200 to-gray-300' },
    86: { icon: '\u2744\ufe0f', bg: 'from-blue-300 to-gray-400' },
    95: { icon: '\u26a1', bg: 'from-gray-600 to-purple-700' },
    96: { icon: '\u26a1', bg: 'from-gray-700 to-red-600' },
    99: { icon: '\u26a1', bg: 'from-red-600 to-purple-800' }
  };
  return icons[code] || { icon: '\ud83c\udf21\ufe0f', bg: 'from-blue-400 to-blue-600' };
}

export function getWindDirection(degrees) {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  return dirs[Math.round(degrees / 22.5) % 16];
}

export function getWMODescription(code) {
  const descriptions = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Fog', 48: 'Depositing rime fog',
    51: 'Light drizzle', 53: 'Moderate drizzle', 55: 'Dense drizzle',
    61: 'Slight rain', 63: 'Moderate rain', 65: 'Heavy rain',
    66: 'Light freezing rain', 67: 'Heavy freezing rain',
    71: 'Slight snowfall', 73: 'Moderate snowfall', 75: 'Heavy snowfall',
    77: 'Snow grains', 80: 'Light showers', 81: 'Moderate showers',
    82: 'Violent showers', 85: 'Light snow showers', 86: 'Heavy snow showers',
    95: 'Thunderstorm', 96: 'Thunderstorm w/ hail', 99: 'Severe thunderstorm'
  };
  return descriptions[code] || 'Unknown';
}

export const riskConfig = {
  Low: { color: 'emerald', hex: '#10b981', gradient: 'from-emerald-400 to-emerald-600' },
  Moderate: { color: 'amber', hex: '#f59e0b', gradient: 'from-amber-400 to-amber-600' },
  High: { color: 'orange', hex: '#f97316', gradient: 'from-orange-400 to-orange-600' },
  Severe: { color: 'red', hex: '#ef4444', gradient: 'from-red-500 to-red-700' }
};
