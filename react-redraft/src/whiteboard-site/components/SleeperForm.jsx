import React, { useState } from 'react';

export default function SleeperForm({ onLoad, loading }) {
  const sp = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const [leagueId, setLeagueId] = useState(sp.get('leagueId') || '');
  const [teamName, setTeamName] = useState(sp.get('teamName') || '');

  const submit = () => onLoad?.({ leagueId, teamNameInput: teamName });

  return (
    <div style={{ display: 'grid', gap: 8 }}>
      <input
        placeholder="Sleeper League ID"
        value={leagueId}
        onChange={(e) => setLeagueId(e.target.value)}
      />
      <input
        placeholder="Team Name (optional)"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
      />
      <button onClick={submit} disabled={loading || !leagueId.trim()}>
        {loading ? 'Loading…' : 'Submit'}
      </button>
    </div>
  );
}
