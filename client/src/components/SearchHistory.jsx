import { riskConfig } from '../utils/weather';

function SearchHistory({ history, onSelect }) {
  return (
    <div className="glass rounded-2xl p-4">
      <h3 className="text-sm font-semibold text-white/70 mb-3 flex items-center gap-2">
        <span>&#128336;</span> Recent Searches
      </h3>

      {history.length === 0 ? (
        <p className="text-xs text-white/25 italic text-center py-4">No search history yet.</p>
      ) : (
        <ul className="space-y-1.5 max-h-64 overflow-y-auto scrollbar-thin">
          {history.map((s, i) => {
            const risk = riskConfig[s.risk_summary] || riskConfig.Low;
            const shortAddr = s.address.split(',').slice(0, 2).join(', ');
            return (
              <li
                key={i}
                onClick={() => onSelect(s)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/10 cursor-pointer transition-all group"
              >
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: risk.hex }} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-white/70 truncate group-hover:text-white/90 transition-colors">
                    {shortAddr}
                  </p>
                  <p className="text-[10px] text-white/25 mt-0.5">
                    {new Date(s.created_at || s.search_date).toLocaleDateString()} &mdash; {s.risk_summary}
                  </p>
                </div>
                <svg className="w-3 h-3 text-white/15 group-hover:text-white/40 transition-colors flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default SearchHistory;
