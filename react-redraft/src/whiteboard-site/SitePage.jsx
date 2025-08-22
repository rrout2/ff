// /src/whiteboard-site/SitePage.jsx
import React, { useEffect, useMemo, useRef, useState } from 'react';
import LZString from 'lz-string';
import './site.css';

import {
  getLeagueSettings, fetchLeagueUsers, fetchLeagueRosters,
  fetchPlayersMap, findOwnerUserId, buildStartingLineup,
} from '../redraft/sleeper-league/sleeperAPI.js';

import playersByIdJson from '../redraft/players/players-by-id.json';
import PreviewBoard from './components/PreviewBoard.jsx';
import SleeperForm from './components/SleeperForm.jsx';
import ManualBuilder from './components/ManualBuilder.jsx';
import TweaksPanel from './components/TweaksPanel.jsx';
import { exportNodeAsPdf } from './utils/exportPdf.js';
import Whiteboard from '../redraft/whiteboard/Whiteboard.jsx';

// ------------------------------------------------------------------
// smart defaults (no moves default here)
function makeSmartDefaults(settings, rosterIds, playersById, lineup) {
  const starters = (lineup || []).map(it => it?.player).filter(Boolean);
  const posCount = sym => starters.filter(p => (Array.isArray(p?.fantasy_positions)?p.fantasy_positions[0]:p?.position||'').toUpperCase()===sym).length;
  const rb = posCount('RB'), wr = posCount('WR'), te = posCount('TE'), qb = posCount('QB');

  const strengths = [], weaknesses = [];
  if (rb >= (settings.positions?.rb || 2)) strengths.push('RB room has weekly floor.');
  else weaknesses.push('Thin at RB — add depth.');
  if (wr >= (settings.positions?.wr || 2)) strengths.push('Multiple startable WRs.');
  else weaknesses.push('WR depth is a concern.');
  if (qb >= (settings.positions?.qb || 1)) strengths.push('Stable QB production.');
  if (te < (settings.positions?.te || 1)) weaknesses.push('TE is streamable at best.');

  const verdict = strengths.length >= 2 && weaknesses.length <= 1 ? 'CONTEND' : weaknesses.length >= 2 ? 'RELOAD' : 'COMPETE';
  return { strengths, weaknesses, verdict };
}

// ------------------------------------------------------------------
// helpers for manual roster resolution
const normTxt = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9\s'.-]/g, ' ').replace(/\s+/g, ' ').trim();
const TEAM_RE = /^(ari|atl|bal|buf|car|chi|cin|cle|dal|den|det|gb|hou|ind|jax|kc|lv|lac|lar|mia|min|ne|no|nyg|nyj|phi|pit|sf|sea|tb|ten|wsh)$/;
const POS_RE  = /^(qb|rb|wr|te)$/;

function resolveIdByName(playersById, name) {
  if (!name) return null;
  const raw = String(name);
  if (playersById[raw]) return raw; // already an ID
  const q = normTxt(raw);
  if (!q) return null;

  const tokens = q.split(' ');
  const hints = { team: null, pos: null };
  const lastTok = tokens[tokens.length - 1] || '';
  if (TEAM_RE.test(lastTok)) hints.team = lastTok.toUpperCase();
  if (POS_RE.test(lastTok))  hints.pos  = lastTok.toUpperCase();
  const baseName = (hints.team || hints.pos) ? tokens.slice(0, -1).join(' ') : q;

  let bestId = null, bestScore = -1e9;
  for (const [id, p] of Object.entries(playersById || {})) {
    const full = (p.full_name || `${p.first_name || ''} ${p.last_name || ''}`.trim()).toLowerCase();
    if (!full) continue;

    let score = 0;
    if (full === baseName) score += 2000;
    else if (full.startsWith(baseName)) score += 1200;
    else if (full.includes(baseName))  score += 800;

    const pos  = (Array.isArray(p.fantasy_positions) ? p.fantasy_positions[0] : p.position || '').toUpperCase();
    const team = (p.team || p.pro_team || p.team_abbr || '').toUpperCase();
    if (hints.pos  && pos  === hints.pos)  score += 500;
    if (hints.team && team === hints.team) score += 500;

    const adp = Number(p.adp_half_ppr ?? p.adp_ppr ?? p.adp ?? p.adp_full_ppr ?? p.adp_std);
    if (isFinite(adp)) score += (10000 - adp * 100);

    if (score > bestScore) { bestScore = score; bestId = id; }
  }
  return bestId;
}

function parsePick(pickStr, teams) {
  if (!pickStr) return null;
  const s = String(pickStr).trim();
  if (s.startsWith('#')) {
    const ov = parseInt(s.slice(1), 10);
    if (!isFinite(ov)) return null;
    const round = Math.max(1, Math.ceil(ov / Math.max(1, teams || 12)));
    return { overall: ov, round };
  }
  const sep = s.includes('.') ? '.' : (s.includes('-') ? '-' : null);
  if (sep) {
    const [r, p] = s.split(sep);
    const rr = parseInt(r, 10);
    const pp = parseInt(p, 10);
    if (!isFinite(rr) || !isFinite(pp)) return null;
    const ov = (rr - 1) * (teams || 12) + pp;
    return { overall: ov, round: rr };
  }
  const ov = parseInt(s, 10);
  if (!isFinite(ov)) return null;
  const round = Math.max(1, Math.ceil(ov / Math.max(1, teams || 12)));
  return { overall: ov, round };
}

// ------------------------------------------------------------------
export default function WhiteboardSite() {
  const [settings, setSettings] = useState({
    teams: 12, ppr: 1, tepValue: 0,
    positions: { qb:1, rb:2, wr:2, te:1, flex:2, def:0, k:0, bench:6, superflex:0 },
  });
  const [playersById, setPlayersById] = useState(playersByIdJson);
  const [rosterIds, setRosterIds] = useState([]);
  const [lineup, setLineup] = useState([]);
  const [ownerId, setOwnerId] = useState('');
  const [teamName, setTeamName] = useState('');
  const [leagueId, setLeagueId] = useState('');   // Sleeper mode when set
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const [overrides, setOverrides] = useState({});
  const [ovKey, setOvKey] = useState(0);

  // builder lineup (for the manual builder UI only)
  useEffect(() => {
    if (!rosterIds.length) { setLineup([]); return; }
    try { setLineup(buildStartingLineup(settings.positions, rosterIds, playersById)); }
    catch (e) { console.error(e); }
  }, [settings, rosterIds, playersById]);

  // defaults (no 'moves' here)
  useEffect(() => {
    const hasAny =
      !!overrides.verdict ||
      !!(overrides.strengths && overrides.strengths.length) ||
      !!(overrides.weaknesses && overrides.weaknesses.length);
    if (leagueId || hasAny) return;
    setOverrides(prev => ({ ...prev, ...makeSmartDefaults(settings, rosterIds, playersById, lineup) }));
    // eslint-disable-next-line
  }, [settings, rosterIds, playersById, lineup, leagueId]);

  // PDF export
  const pdfRef = useRef(null);
  const onExportPdf = async () => {
    if (!pdfRef.current) return;
    await exportNodeAsPdf(pdfRef.current, `whiteboard_${teamName || 'team'}.pdf`);
  };

  // Sleeper load
  const onSleeperLoad = async ({ leagueId: id, teamNameInput }) => {
    try {
      setLoading(true); setErr('');
      const lid = id.trim();
      const s = await getLeagueSettings(lid);
      const [users, rosters, map] = await Promise.all([
        fetchLeagueUsers(lid),
        fetchLeagueRosters(lid),
        fetchPlayersMap(),
      ]);

      let oid = findOwnerUserId(users, (teamNameInput || '').trim());
      if (!oid) oid = users[0]?.user_id;
      const myRoster = rosters.find(r => String(r.owner_id) === String(oid));

      setTeamName(teamNameInput || users[0]?.metadata?.team_name || users[0]?.display_name || '');
      setOwnerId(oid);

      const sp = new URLSearchParams(window.location.search);
      sp.set('site', '1'); sp.set('leagueId', lid); sp.set('teamName', teamNameInput || '');
      const enc = LZString.compressToEncodedURIComponent(JSON.stringify(overrides || {}));
      if (enc && enc !== 'eNortjI0MDCwMjQwAAADAA==') sp.set('o', enc); else sp.delete('o');
      window.history.replaceState({}, '', `${window.location.pathname}?${sp.toString()}`);

      setLeagueId(lid);
      setSettings(s);
      setRosterIds(myRoster?.players || []);
      setPlayersById(map);
      setLineup(buildStartingLineup(s.positions, myRoster?.players || [], map));
    } catch (e) {
      console.error(e);
      setErr(e.message || 'Failed to load Sleeper data');
    } finally { setLoading(false); }
  };

  // Manual builder UI handlers
  const onAddPlayer = id => setRosterIds(prev => (prev.includes(id) ? prev : [...prev, id]));
  const onRemovePlayer = id => setRosterIds(prev => prev.filter(p => String(p)!==String(id)));
  const onUpdatePositions = p => setSettings(prev => ({ ...prev, positions: { ...prev.positions, ...p }}));

  // ---------- Manual roster & picks from overrides.manual.roster ----------
  const manualRows = Array.isArray(overrides?.manual?.roster) ? overrides.manual.roster : [];

  const manualResolved = useMemo(() => {
    if (!manualRows.length) return { ids: [], points: [] };
    const ids = [];
    const points = [];
    const seen = new Set();
    const teamsCount = Number(settings.teams || 12);

    for (const row of manualRows) {
      const nm = row?.name?.trim();
      if (!nm) continue;
      const id = resolveIdByName(playersById, nm);
      if (!id) continue;
      if (!ids.includes(id)) ids.push(id);

      const pick = parsePick(row?.pick, teamsCount);
      if (!pick) continue;

      const p = playersById[id] || {};
      const full = (p.full_name || `${p.first_name || ''} ${p.last_name || ''}`.trim()).toUpperCase();
      const [first, ...rest] = full.split(/\s+/);

      const v = p.adp_half_ppr ?? p.adp_ppr ?? p.adp ?? p.adp_full_ppr ?? p.adp_std;
      const adp = Number(v);
      if (!isFinite(adp)) continue;

      const key = `${id}-${pick.overall}`;
      if (seen.has(key)) continue;
      seen.add(key);

      points.push({ id, first, last: rest.join(' '), overall: pick.overall, round: pick.round, adp });
    }
    return { ids, points };
  }, [manualRows, playersById, settings.teams]);

  // Effective manual roster for preview (typed > builder IDs)
  const effectiveManualIds = manualResolved.ids.length ? manualResolved.ids : rosterIds;
  const effectiveManualLineup = useMemo(() => {
    try { return buildStartingLineup(settings.positions, effectiveManualIds, playersById); }
    catch { return []; }
  }, [settings.positions, effectiveManualIds, playersById]);

  const hud = useMemo(() => ({
    ownerId, rosterCount: effectiveManualIds.length, startersCount: effectiveManualLineup.length, loading, err,
  }), [ownerId, effectiveManualIds, effectiveManualLineup, loading, err]);

  const isSleeperMode = !!leagueId;

  // keep URL in sync and remount board when overrides/params change
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    sp.set('site','1');
    if (leagueId) sp.set('leagueId', leagueId);
    if (teamName) sp.set('teamName', teamName);
    const enc = LZString.compressToEncodedURIComponent(JSON.stringify(overrides || {}));
    if (enc && enc !== 'eNortjI0MDCwMjQwAAADAA==') sp.set('o', enc); else sp.delete('o');
    window.history.replaceState({}, '', `${window.location.pathname}?${sp.toString()}`);
    setOvKey(k => k + 1);
  }, [overrides, leagueId, teamName]);

  return (
    <div className="wb-site">
      <header className="wb-site__header">
        <div className="wb-title">Whiteboard — Website</div>
        <div className="wb-actions">
          <button onClick={onExportPdf} disabled={loading}>Download PDF</button>
        </div>
      </header>

      <main className="wb-layout">
        <aside className="wb-left">
          <section className="wb-card">
            <div className="wb-card__title">Load from Sleeper</div>
            <SleeperForm onLoad={onSleeperLoad} loading={loading} />
            {err && <div className="wb-err">{err}</div>}
          </section>

          {!isSleeperMode && (
            <>
              <section className="wb-card">
                <div className="wb-card__title">Manual Builder</div>
                <ManualBuilder
                  playersById={playersById}
                  rosterIds={rosterIds}
                  onAdd={onAddPlayer}
                  onRemove={onRemovePlayer}
                  positions={settings.positions}
                  onPositions={onUpdatePositions}
                  teamName={teamName}
                  onTeamName={setTeamName}
                />
              </section>
            </>
          )}

          {/* Sections & Overrides (includes Manual Roster & Picks) */}
          <section className="wb-card">
            <div className="wb-card__title">Sections & Overrides</div>
            <TweaksPanel
              hud={hud}
              overrides={overrides}
              onOverrides={setOverrides}
              onExport={onExportPdf}
            />
          </section>
        </aside>

        <section className="wb-right">
          <div ref={pdfRef}>
            {isSleeperMode ? (
              <Whiteboard key={`${leagueId}:${teamName}:${ovKey}`} />
            ) : (
              <PreviewBoard
                leagueId={''}
                teamName={teamName}
                settings={settings}
                rosterIds={effectiveManualIds}         // from typed names
                playersById={playersById}
                lineup={effectiveManualLineup}         // built from typed names
                ownerId={ownerId}
                draftPoints={manualResolved.points}    // from typed picks
                moves={[]}                             
                overrides={overrides}
                show={{
                  settings:true, fourFactors:true, starters:true, grades:true,
                  draftChart:true, moves:true, strengths:true, powerRank:true
                }}
              />
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
