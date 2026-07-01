import { riskConfig } from '../utils/weather';

function PerilAssessment({ assessment }) {
  if (!assessment?.assessment) return null;

  const { assessment: perils } = assessment;
  const overall = perils.overall || 'Low';
  const overallRisk = riskConfig[overall] || riskConfig.Low;

  const perilItems = [
    {
      key: 'wind',
      icon: '\ud83d\udca8',
      label: 'Wind Speed',
      value: perils.wind ? `${perils.wind.value} ${perils.wind.unit}` : '--',
      level: perils.wind?.level || 'Low',
      description: getWindDesc(perils.wind?.value || 0)
    },
    {
      key: 'precipitation',
      icon: '\ud83c\udf27\ufe0f',
      label: 'Precipitation',
      value: perils.precipitation ? `${perils.precipitation.value} ${perils.precipitation.unit}` : '--',
      level: perils.precipitation?.level || 'Low',
      description: getPrecipDesc(perils.precipitation?.value || 0)
    },
    {
      key: 'hail',
      icon: '\ud83e\udea8',
      label: 'Hail',
      value: perils.hail?.detected ? 'Detected' : 'Not detected',
      level: perils.hail?.level || 'Low',
      description: perils.hail?.detected ? 'Hail activity detected in area' : 'No hail indicators present'
    },
    {
      key: 'temperature',
      icon: '\ud83c\udf21\ufe0f',
      label: 'Temperature',
      value: perils.temperature ? `${perils.temperature.value} ${perils.temperature.unit}` : '--',
      level: perils.temperature?.level || 'Low',
      description: getTempDesc(perils.temperature?.value || 0)
    },
    {
      key: 'storm',
      icon: '\u26a1',
      label: 'Storm Activity',
      value: perils.storm?.description || 'None',
      level: perils.storm?.level || 'Low',
      description: perils.storm?.detected ? 'Active storm system detected' : 'No significant storm activity'
    }
  ];

  return (
    <div className="glass rounded-2xl p-6 animate-slide-up">
      {/* Overall Risk Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white/90 flex items-center gap-2">
          <span>&#9888;&#65039;</span> Peril Risk Assessment
        </h3>
        <div className={`px-5 py-2 rounded-xl bg-gradient-to-r ${overallRisk.gradient} shadow-lg risk-glow-${overall.toLowerCase()}`}>
          <span className="text-sm font-bold">{overall} Risk</span>
        </div>
      </div>

      {/* Risk Meter */}
      <div className="mb-6 glass-light rounded-xl p-4">
        <div className="flex items-center justify-between text-[10px] text-white/40 mb-2 uppercase tracking-wider">
          <span>Low</span>
          <span>Moderate</span>
          <span>High</span>
          <span>Severe</span>
        </div>
        <div className="h-3 rounded-full bg-white/5 overflow-hidden flex">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400" style={{ width: '25%' }} />
          <div className="h-full bg-gradient-to-r from-amber-400 to-amber-500" style={{ width: '25%' }} />
          <div className="h-full bg-gradient-to-r from-orange-400 to-orange-500" style={{ width: '25%' }} />
          <div className="h-full bg-gradient-to-r from-red-500 to-red-600" style={{ width: '25%' }} />
        </div>
        <div className="relative h-4 mt-1">
          <div
            className="absolute w-3 h-3 bg-white rounded-full shadow-lg transform -translate-x-1/2 transition-all duration-700"
            style={{ left: getRiskPosition(overall) }}
          />
        </div>
      </div>

      {/* Peril Cards */}
      <div className="space-y-3">
        {perilItems.map((peril) => {
          const risk = riskConfig[peril.level] || riskConfig.Low;
          return (
            <div key={peril.key} className="glass-light rounded-xl p-4 hover:bg-white/10 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{peril.icon}</span>
                  <div>
                    <div className="text-sm font-medium text-white/80">{peril.label}</div>
                    <div className="text-xs text-white/40">{peril.description}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-white/90">{peril.value}</div>
                  <div className="flex items-center gap-1.5 mt-1 justify-end">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: risk.hex }} />
                    <span className="text-[10px] font-medium" style={{ color: risk.hex }}>{peril.level}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Insurance Note */}
      <div className="mt-4 p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
        <p className="text-[10px] text-blue-300/50 leading-relaxed">
          &#128196; Risk levels are based on configurable thresholds in the peril database.
          Wind thresholds: Low &lt;25 mph, Moderate 25-40, High 40-58, Severe &gt;58 mph.
          Contact your underwriting team for policy-specific guidelines.
        </p>
      </div>
    </div>
  );
}

function getRiskPosition(level) {
  const positions = { Low: '12.5%', Moderate: '37.5%', High: '62.5%', Severe: '87.5%' };
  return positions[level] || '12.5%';
}

function getWindDesc(speed) {
  if (speed >= 58) return 'Severe wind damage likely';
  if (speed >= 40) return 'Significant wind damage possible';
  if (speed >= 25) return 'Moderate wind conditions';
  return 'Normal wind conditions';
}

function getPrecipDesc(amount) {
  if (amount >= 3) return 'Severe flooding risk';
  if (amount >= 1.5) return 'Potential for localized flooding';
  if (amount >= 0.5) return 'Moderate rainfall';
  return 'Light or no precipitation';
}

function getTempDesc(temp) {
  if (temp >= 105) return 'Extreme heat warning';
  if (temp >= 95) return 'Heat advisory conditions';
  if (temp <= 10) return 'Extreme cold risk';
  if (temp <= 32) return 'Freezing conditions';
  return 'Normal temperature range';
}

export default PerilAssessment;
