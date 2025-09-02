import React, { useEffect, useState } from 'react';
import { fetchLeagueUsers } from '../../redraft/sleeper-league/sleeperAPI.js';

export default function SleeperForm({ onLoad, loading }) {
  const [leagueId, setLeagueId] = useState('');
  const [fetchingTeams, setFetchingTeams] = useState(false);
  const [teams, setTeams] = useState([]); // [{ value: ownerId, label, teamName, displayName }]
  const [ownerId, setOwnerId] = useState('');
  const [err, setErr] = useState('');

  // Prefill from URL if present
  useEffect(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      const lid = sp.get('leagueId') || sp.get('league') || '';
      if (lid) setLeagueId(lid);
    } catch {}
  }, []);

  const fetchTeams = async () => {
    if (!leagueId.trim()) return;
    try {
      setErr('');
      setFetchingTeams(true);
      const users = await fetchLeagueUsers(leagueId.trim());
      const opts = (users || []).map(u => {
        const tn = (u?.metadata?.team_name || '').trim();
        const dn = (u?.display_name || '').trim();
        const label = tn ? `${tn} — ${dn || 'unknown'}` : (dn || u.user_id);
        return { value: u.user_id, label, teamName: tn, displayName: dn };
      }).sort((a, b) => a.label.localeCompare(b.label));
      setTeams(opts);
      setOwnerId(opts[0]?.value || '');
    } catch (e) {
      setErr(e?.message || 'Failed to fetch teams');
    } finally {
      setFetchingTeams(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!leagueId.trim()) return;
    // If teams are loaded, submit with ownerId and selected teamName
    if (teams.length && ownerId) {
      const sel = teams.find(t => String(t.value) === String(ownerId));
      onLoad?.({
        leagueId: leagueId.trim(),
        ownerId,
        teamNameInput: sel?.teamName || sel?.displayName || ''
      });
    } else {
      // Otherwise, first step: fetch teams
      fetchTeams();
    }
  };

  const resetTeams = () => {
    setTeams([]);
    setOwnerId('');
    setErr('');
  };

  const disableAll = loading || fetchingTeams;

  return (
    <form onSubmit={onSubmit} className="wb-form" style={{ display:'grid', gap:8 }}>
      <label>League ID</label>
      <input
        value={leagueId}
        placeholder="e.g., 1254558115920093184"
        onChange={(e)=>setLeagueId(e.target.value)}
        disabled={disableAll}
      />

      {/* Step 1: Fetch teams */}
      {!teams.length && (
        <button type="submit" disabled={!leagueId.trim() || disableAll}>
          {fetchingTeams ? 'Fetching teams…' : 'Next: Choose Team'}
        </button>
      )}

      {/* Step 2: Choose team & submit */}
      {!!teams.length && (
        <>
          <label>Team</label>
          <select
            value={ownerId}
            onChange={(e)=>setOwnerId(e.target.value)}
            disabled={disableAll}
          >
            {teams.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <div style={{ display:'flex', gap:8 }}>
            <button type="submit" disabled={disableAll}>Load League</button>
            <button type="button" onClick={resetTeams} disabled={disableAll}>Change League ID</button>
          </div>
        </>
      )}

      {err && <div className="wb-err">{err}</div>}
    </form>
  );
}
