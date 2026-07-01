

const riskDot = {
  Low: 'bg-green-500',
  Moderate: 'bg-amber-500',
  High: 'bg-orange-500',
  Severe: 'bg-red-500'
};

function SearchHistory({ history, onSelect }) {
  if (!history || history.length === 0) {
    return (
      <div className="bg-white rounded-lg border shadow-sm p-4">
        <h3 className="text-sm font-semibold text-slate-700 mb-2">Recent Searches</h3>
        <p className="text-xs text-slate-400">No search history yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm p-4">
      <h3 className="text-sm font-semibold text-slate-700 mb-3">Recent Searches</h3>
      <ul className="space-y-2 max-h-64 overflow-y-auto">
        {history.map((item) => (
          <li
            key={item.id}
            onClick={() => onSelect(item)}
            className="flex items-start gap-2 p-2 rounded-md hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-200"
          >
            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${riskDot[item.risk_summary] || riskDot.Low}`}></div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-700 truncate">{item.address}</p>
              <p className="text-xs text-slate-400">
                {new Date(item.created_at).toLocaleDateString()} — {item.risk_summary || 'N/A'}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SearchHistory;
