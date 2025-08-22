import React, { useState } from 'react';
import {
  getLeagueSettings,
  fetchLeagueUsers,
  fetchLeagueRosters,
  fetchPlayersMap,
  findOwnerUserId,
  buildStartingLineup,
} from '../redraft/sleeper-league/sleeperAPI.js';

export default function BuilderSandbox() {
  const [leagueId, setLeagueId] = useState('');
  const [teamName, setTeamName] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [result, setResult] = useState(null);

  async function load() {
    if (!leagueId.trim()) return;
    setBusy(true); setErr(''); setResult(null);
    try {
      const s = await getLeagueSettings(leagueId.trim());
      const [users, rosters, playersMap] = await Promise.all([
        fetchLeagueUsers(leagueId.trim()),
        fetchLeagueRosters(leagueId.trim()),
        fetchPlayersMap(),
      ]);

      let ownerId = findOwnerUserId(users, teamName.trim()) || users[0]?.user_id;
      const myRoster = rosters.find(r => String(r.owner_id) === String(ownerId));
      const rosterIds = myRoster?.players || [];
      const lineup = buildStartingLineup(s.positions, rosterIds, playersMap);

      setResult({ settings: s, ownerId, rosterIds, lineup, playersMap });
    } catch (e) { setErr(e?.message || 'Failed to load'); }
    finally { setBusy(false); }
  }

  function openWhiteboard() {
    const params = new URLSearchParams();
    if (leagueId) params.set('leagueId', leagueId);
    if (teamName) params.set('teamName', teamName);
    window.location.search = params.toString(); // navigate to your existing board
  }

  return (
    <div style={{ padding:16, fontFamily:'system-ui', maxWidth:1000, margin:'0 auto' }}>
      <h2>Whiteboard Builder</h2>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr auto', gap:8 }}>
        <input placeholder="Sleeper League ID" value={leagueId} onChange={e=>setLeagueId(e.target.value)} />
        <input placeholder="Team Name (optional)" value={teamName} onChange={e=>setTeamName(e.target.value)} />
        <button onClick={load} disabled={busy}>{busy?'Loading…':'Submit'}</button>
      </div>
      {err && <div style={{ color:'crimson', marginTop:8 }}>{err}</div>}

      {result && (
        <div style={{ marginTop:16, display:'grid', gap:12 }}>
          <div style={{ padding:12, border:'1px solid #eee', borderRadius:8 }}>
            <div><b>ownerId:</b> {String(result.ownerId || '')}</div>
            <div><b>roster players:</b> {result.rosterIds.length}</div>
            <div><b>starters:</b> {result.lineup.length}</div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div style={{ border:'1px solid #eee', borderRadius:8, padding:12 }}>
              <div style={{ fontWeight:700, marginBottom:8 }}>Starting Lineup</div>
              <ul style={{ margin:0, paddingLeft:16 }}>
                {result.lineup.map((it,i)=>{
                  const p=it?.player||{}; const nm=p.full_name||`${p.first_name||''} ${p.last_name||''}`.trim();
                  const pos=(Array.isArray(p.fantasy_positions)?p.fantasy_positions[0]:p.position||'').toUpperCase();
                  const team=(p.team||'').toUpperCase();
                  return <li key={i}><b>{(it.slot||'').toUpperCase()}</b> — {nm} ({pos} {team})</li>;
                })}
              </ul>
            </div>
            <div style={{ border:'1px solid #eee', borderRadius:8, padding:12 }}>
              <button onClick={openWhiteboard}>Open Whiteboard with these params</button>
              <div style={{ fontSize:12, color:'#666', marginTop:8 }}>This redirects using URL params (leagueId/teamName) your board already reads.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
