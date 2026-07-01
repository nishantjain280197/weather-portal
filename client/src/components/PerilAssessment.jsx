

const riskColors = {
  Low: 'bg-green-100 text-green-800 border-green-300',
  Moderate: 'bg-amber-100 text-amber-800 border-amber-300',
  High: 'bg-orange-100 text-orange-800 border-orange-300',
  Severe: 'bg-red-100 text-red-800 border-red-300'
};

const riskBgColors = {
  Low: 'bg-green-500',
  Moderate: 'bg-amber-500',
  High: 'bg-orange-500',
  Severe: 'bg-red-500'
};

function PerilAssessment({ assessment }) {
  if (!assessment?.assessment) return null;

  const { assessment: perils } = assessment;

  return (
    <div className="bg-white rounded-lg border shadow-sm p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-700">Peril Assessment</h3>
        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${riskColors[perils.overall] || riskColors.Low}`}>
          {perils.overall} Risk
        </span>
      </div>

      <div className="space-y-3">
        {perils.wind && (
          <PerilRow
            label="Wind Speed"
            value={`${perils.wind.value?.toFixed(1)} ${perils.wind.unit}`}
            level={perils.wind.level}
          />
        )}
        {perils.precipitation && (
          <PerilRow
            label="Precipitation"
            value={`${perils.precipitation.value?.toFixed(2)} ${perils.precipitation.unit}`}
            level={perils.precipitation.level}
          />
        )}
        {perils.hail && (
          <PerilRow
            label="Hail"
            value={perils.hail.detected ? 'Detected' : 'Not detected'}
            level={perils.hail.level}
          />
        )}
        {perils.temperature && (
          <PerilRow
            label="Temperature"
            value={`${perils.temperature.value?.toFixed(1)} ${perils.temperature.unit}`}
            level={perils.temperature.level}
          />
        )}
        {perils.storm && (
          <PerilRow
            label="Storm Activity"
            value={perils.storm.description}
            level={perils.storm.level}
          />
        )}
      </div>
    </div>
  );
}

function PerilRow({ label, value, level }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
      <div>
        <p className="text-xs font-medium text-slate-600">{label}</p>
        <p className="text-sm text-slate-800">{value}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className={`w-2.5 h-2.5 rounded-full ${riskBgColors[level] || riskBgColors.Low}`}></div>
        <span className="text-xs font-medium text-slate-600">{level}</span>
      </div>
    </div>
  );
}

export default PerilAssessment;
