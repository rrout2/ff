// /src/redraft/league-settings/LeagueSettings.jsx
import React from 'react';
import './league-settings.css';

export default function LeagueSettings({ settings }) {
  const teams = Number(settings?.teams ?? 12);

  // Normalize ppr (can be number or string); default 0 (Standard)
  const pprNum = Number(settings?.ppr ?? 0);
  const is = (x) => Math.abs(pprNum - x) < 1e-6;

  let scoringLabel = 'STRD';
  if (is(1)) scoringLabel = 'PPR';
  else if (is(0.5)) scoringLabel = 'Half';

  const tepValue = Number(settings?.tepValue ?? 0);

  return (
    <div className="league-settings-container">
      <div className="league-settings">
        {/* Teams */}
        <div className="setting">
          <div className="setting-label">Teams</div>
          <div className="setting-box teams">{teams}</div>
        </div>

        {/* Scoring */}
        <div className="setting">
          <div className="setting-label">Scoring</div>
          <div className="setting-box scoring">{scoringLabel}</div>
        </div>

        {/* TEP (only when > 0) */}
        {tepValue > 0 && (
          <div className="setting">
            <div className="setting-label">TEP</div>
            <div className="setting-box tep">{tepValue}</div>
          </div>
        )}

        {/* Positions */}
        {Object.entries(settings?.positions || {}).map(([pos, count]) => (
          <div className="setting" key={pos}>
            <div className="setting-label">{pos.toUpperCase()}</div>
            <div className={`setting-box ${pos}`}>{count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
