import React from 'react';
import './league-settings.css';

export default function LeagueSettings({ settings }) {
  return (
    <div className="league-settings-container">
      <div className="league-settings">
        {/* Teams */}
        <div className="setting">
          <div className="setting-label">Teams</div>
          <div className="setting-box teams">{settings.teams}</div>
        </div>

        {/* Scoring */}
        <div className="setting">
          <div className="setting-label">Scoring</div>
          <div className="setting-box scoring">{settings.ppr ? 'PPR' : 'Standard'}</div>
        </div>

        {/* TEP */}
        {settings.tep && (
          <div className="setting">
            <div className="setting-label">TEP</div>
            <div className="setting-box tep">{settings.tepValue ?? 0}</div>
          </div>
        )}

        {/* Positions */}
        {Object.entries(settings.positions).map(([pos, count]) => (
          <div className="setting" key={pos}>
            <div className="setting-label">{pos.toUpperCase()}</div>
            <div className={`setting-box ${pos}`}>{count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
