// /src/redraft/whiteboard/Whiteboard.jsx
import React, { useState, useEffect, useMemo } from 'react';
import LZString from 'lz-string';

import LeagueSettings from '../league-settings/LeagueSettings';
import PositionalGrades from '../positional-grade/PositionalGrades';
import Starters from '../starting-lineup/Starters';
import FourFactors from '../four-factors/FourFactors';
import DraftValueChart from '../draft-value/DraftValueChart';
import RosterStrengths from '../strengths-weakness/RosterStrengths';
import Stars from '../stars/Stars';
import MovesToMake from '../moves-to-make/MovesToMake';
import PowerRanking from '../power-ranking/PowerRanking';
import RosterTag from '../roster-tag/RosterTag';
import TeamName from '../team-name/TeamName';
import FinalVerdict from '../final-verdict/FinalVerdict';

import {
  getLeagueSettings,
  fetchLeagueUsers,
  fetchLeagueRosters,
  fetchPlayersMap,
  findOwnerUserId,
  buildStartingLineup,
  fetchLeagueDrafts,
  fetchDraftPicks
} from '../sleeper-league/sleeperAPI.js';

import gradeData from '../players/players-by-id.json';
import whiteboardBg from './WB-Base.png';

// ---------- URL overrides helpers ----------
function readOverridesFromUrl() {
  try {
    const sp = new URLSearchParams(window.location.search);
    const e = sp.get('o');
    if (!e) return {};
    const json = LZString.decompressFromEncodedURIComponent(e);
    return JSON.parse(json || '{}') || {};
  } catch (e) {
    console.warn('bad overrides', e);
    return {};
  }
}
const oget = (obj, path, fallback) => {
  try {
    return path.split('.').reduce((a, k) => (a && (k in a) ? a[k] : undefined), obj) ?? fallback;
  } catch {
    return fallback;
  }
};

// ---------- Manual roster helpers ----------
const normTxt = (s) =>
  String(s || '').toLowerCase().replace(/[^a-z0-9\s'.-]/g, ' ').replace(/\s+/g, ' ').trim();
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

  let bestId = null;
  let bestScore = -1e9;
  for (const [id, p] of Object.entries(playersById || {})) {
    const full = (p.full_name || `${p.first_name || ''} ${p.last_name || ''}`.trim()).toLowerCase();
    if (!full) continue;

    let score = 0;
    if (full === baseName) score += 2000;
    else if (full.startsWith(baseName)) score += 1200;
    else if (full.includes(baseName)) score += 800;

    const pos  = (Array.isArray(p.fantasy_positions) ? p.fantasy_positions[0] : p.position || '').toUpperCase();
    const team = (p.team || p.pro_team || p.team_abbr || '').toUpperCase();

    if (hints.pos && pos === hints.pos)   score += 500;
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
// -----------------------------------------------------------------

export default function Whiteboard() {
  const params = new URLSearchParams(window.location.search);
  const leagueId = params.get('leagueId');
  const teamName = params.get('teamName')?.trim() || '';

  // read overrides once per mount (SitePage remounts this when overrides change)
  const overrides = useMemo(() => readOverridesFromUrl(), []);

  const [settings, setSettings] = useState({
    teams: 12,
    ppr: true,
    tepValue: 0,
    positions: { qb: 1, rb: 2, wr: 2, te: 1, flex: 2, def: 1, k: 1, bench: 6 }
  });
  const [starters, setStarters] = useState([]);
  const [rosterIds, setRosterIds] = useState([]);
  const [playersById, setPlayersById] = useState({});
  const [loading, setLoading] = useState(!!leagueId);
  const [error, setError] = useState(null);

  // HUD/debug
  const [ownerId, setOwnerId] = useState(null);
  const [rosterCount, setRosterCount] = useState(0);
  const [teamSamples, setTeamSamples] = useState([]);

  // picks/ADP for Starters text + chart
  const [pickByPlayerId, setPickByPlayerId] = useState({});
  const [adpByPlayerId, setAdpByPlayerId] = useState({});
  const [draftPoints, setDraftPoints] = useState([]);

  // Final stars (for strengths default)
  const [finalStars, setFinalStars] = useState(null);

  // Moves baseline (overrideable)
  const [moves] = useState([
    { id: 'trade',  label: 'TRADE',  variant: 'teal',  primary: null, recs: [null, null], note: undefined },
    { id: 'uptier', label: 'UPTIER', variant: 'gold',  primary: null, recs: [null, null], note: undefined },
    { id: 'pivot',  label: 'PIVOT',  variant: 'green', primary: null, recs: [null, null], note: undefined },
  ]);

  // Four Factors baseline
  const [factorScores, setFactorScores] = useState({ upside: 5, reliability: 5, depth: 5, risk: 5 });

  useEffect(() => {
    if (!leagueId) return;
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const s = await getLeagueSettings(leagueId);
        if (cancelled) return;
        setSettings(s);

        const [users, rosters, playersMap] = await Promise.all([
          fetchLeagueUsers(leagueId),
          fetchLeagueRosters(leagueId),
          fetchPlayersMap(),
        ]);
        if (cancelled) return;

        const sample = users.slice(0, 6).map(u => ({
          tn: u.metadata?.team_name || '', dn: u.display_name || ''
        }));
        setTeamSamples(sample);

        const oid = findOwnerUserId(users, teamName);
        setOwnerId(oid);
        if (!oid) throw new Error(`Could not find team "${teamName}" in this league.`);

        const myRoster = rosters.find(r => String(r.owner_id) === String(oid));
        const myRosterId = myRoster?.roster_id;
        const ids = myRoster?.players || [];
        setRosterIds(ids);
        setRosterCount(ids.length);
        setPlayersById(playersMap);

        // Build lineup from Sleeper roster by default
        setStarters(buildStartingLineup(s.positions, ids, playersMap));

        // --- Draft picks (whole team) ---
        try {
          const drafts = await fetchLeagueDrafts(leagueId);
          const draft = Array.isArray(drafts) && drafts.length ? drafts[0] : null;
          if (draft) {
            const picks = await fetchDraftPicks(draft.draft_id || draft.id);

            // Map for starters text
            const map = {};
            const teamsCount = Number(s.teams || 12);
            for (const pk of picks || []) {
              const pid = String(pk.player_id);
              let overall = Number(pk.pick_no);
              if (!Number.isFinite(overall)) {
                if (Number.isFinite(pk.round) && Number.isFinite(pk.pick)) {
                  overall = (Number(pk.round) - 1) * teamsCount + Number(pk.pick);
                } else continue;
              }
              const label = (Number.isFinite(pk.round) && Number.isFinite(pk.pick))
                ? `${pk.round}.${String(pk.pick).padStart(2, '0')}`
                : `#${overall}`;
              if (!map[pid] || overall < map[pid].overall) {
                map[pid] = { overall, label };
              }
            }
            if (!cancelled) setPickByPlayerId(map);

            // Chart points from team picks
            const teamPicks = (picks || []).filter(
              pk => myRosterId == null || String(pk.roster_id) === String(myRosterId)
            );
            const pts = [];
            const seen = new Set();
            for (const pk of teamPicks) {
              const pid = String(pk.player_id);
              if (!pid) continue;

              let overall = Number(pk.pick_no);
              const teamsCount2 = Number(s.teams || 12);
              if (!Number.isFinite(overall) && Number.isFinite(pk.round) && Number.isFinite(pk.pick)) {
                overall = (Number(pk.round) - 1) * teamsCount2 + Number(pk.pick);
              }
              if (!Number.isFinite(overall)) continue;
              const round = Math.max(1, Math.ceil(overall / Math.max(1, teamsCount2)));

              const p = playersMap[pid] || {};
              const full = p.full_name || `${p.first_name || ''} ${p.last_name || ''}`.trim() || pid;
              const [first, ...rest] = full.trim().toUpperCase().split(/\s+/);

              const fromSleeper =
                p.adp_half_ppr ?? p.adp_ppr ?? p.adp ?? p.adp_full_ppr ?? p.adp_std;
              const fromLocal = gradeData[pid]?.sleeperAdp
                ?? gradeData[pid]?.domainAdpN
                ?? gradeData[pid]?.domainAdp;
              const adp = Number.isFinite(fromSleeper) ? Number(fromSleeper)
                        : Number.isFinite(fromLocal)   ? Number(fromLocal)
                        : null;
              if (!Number.isFinite(adp)) continue;

              const key = `${pid}-${overall}`;
              if (seen.has(key)) continue;
              seen.add(key);

              pts.push({ id: pid, first, last: rest.join(' '), overall, round, adp });
            }
            if (!cancelled) setDraftPoints(pts);
          }
        } catch {
          // ignore; chart will just show "No data"
        }

        // ADP map for starters text
        const adpMap = {};
        for (const pid of ids) {
          const p = playersById[pid] || playersMap[pid] || {};
          const fromSleeper =
            p.adp_half_ppr ?? p.adp_ppr ?? p.adp ?? p.adp_full_ppr ?? p.adp_std;
          const fromLocal = gradeData[String(pid)]?.sleeperAdp
            ?? gradeData[String(pid)]?.domainAdpN
            ?? gradeData[String(pid)]?.domainAdp;
          const adp = Number.isFinite(fromSleeper) ? Number(fromSleeper)
                    : Number.isFinite(fromLocal)   ? Number(fromLocal)
                    : null;
          if (Number.isFinite(adp)) adpMap[String(pid)] = adp;
        }
        if (!cancelled) setAdpByPlayerId(adpMap);

        // ---------- MANUAL ROSTER & PICKS (override Sleeper when present) ----------
        const manualRows = Array.isArray(overrides?.manual?.roster) ? overrides.manual.roster : [];
        if (!cancelled && manualRows.length) {
          const manualIds = [];
          const manualPts = [];
          const seenManual = new Set();
          const teamsCount = Number(s.teams || 12);

          for (const row of manualRows) {
            const nm = row?.name?.trim();
            if (!nm) continue;
            const id = resolveIdByName(playersMap, nm);
            if (!id) continue;
            if (!manualIds.includes(id)) manualIds.push(id);

            const pick = parsePick(row?.pick, teamsCount);
            if (!pick) continue;

            const p = playersMap[id] || {};
            const full = (p.full_name || `${p.first_name || ''} ${p.last_name || ''}`.trim()).toUpperCase();
            const [first, ...rest] = full.split(/\s+/);

            const v = p.adp_half_ppr ?? p.adp_ppr ?? p.adp ?? p.adp_full_ppr ?? p.adp_std;
            const adp = Number(v);
            if (!isFinite(adp)) continue;

            const key = `${id}-${pick.overall}`;
            if (seenManual.has(key)) continue;
            seenManual.add(key);

            manualPts.push({
              id,
              first,
              last: rest.join(' '),
              overall: pick.overall,
              round: pick.round,
              adp,
            });
          }

          // Override roster + lineup + chart with manual input
          setRosterIds(manualIds);
          setRosterCount(manualIds.length);
          setStarters(buildStartingLineup(s.positions, manualIds, playersMap));
          setDraftPoints(manualPts);
        }
        // --------------------------------------------------------------------------

      } catch (e) {
        setError(e.message || 'Failed to load league data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [leagueId, teamName]);
  // ---------------------------------------------------------------------------

  // ---------- EFFECTIVE values (overrides layered on top) ----------
  const effTeamName   = overrides.teamName ?? teamName;
  const effFour = {
    upside: overrides?.fourFactors?.upside ?? factorScores.upside,
    reliability: overrides?.fourFactors?.reliability ?? factorScores.reliability,
    depth: overrides?.fourFactors?.depth ?? factorScores.depth,
    risk: overrides?.fourFactors?.risk ?? factorScores.risk,
  };
  const effGrades = {
    QB: oget(overrides, 'positionalGrades.QB', undefined),
    RB: oget(overrides, 'positionalGrades.RB', undefined),
    WR: oget(overrides, 'positionalGrades.WR', undefined),
    TE: oget(overrides, 'positionalGrades.TE', undefined),
  };
  const effTag        = overrides?.rosterTag ?? undefined;
  const effStars      = overrides?.finalVerdict?.stars ?? undefined;
  const effVerdictTxt = overrides?.finalVerdict?.note ?? '';
  const effPowerRank  = overrides?.powerRanking?.rank ?? undefined;

  // Roster Strengths overrides (accept array or object, always 3 slots)
  const effRSItems = useMemo(() => {
    const raw = overrides?.rosterStrengths?.items;
    if (Array.isArray(raw)) return [raw[0] ?? null, raw[1] ?? null, raw[2] ?? null];
    if (raw && typeof raw === 'object') {
      return [raw[0] ?? raw['0'] ?? null, raw[1] ?? raw['1'] ?? null, raw[2] ?? raw['2'] ?? null];
    }
    return [null, null, null];
  }, [overrides]);

  // Moves overrides merge (array or object)
  const effMoves = overrides?.moves ?? undefined;
  const mergedMoves = useMemo(() => {
    const base = moves;
    if (Array.isArray(effMoves)) {
      return base.map((b, idx) => {
        const o = effMoves[idx] || {};
        const recs = Array.isArray(o.recs) ? o.recs.filter(Boolean) : (Array.isArray(b.recs) ? b.recs.filter(Boolean) : []);
        return { ...b, label: (o.label ?? b.label) || b.label, note: o.note ?? b.note, primary: (o.primary ?? b.primary) || null, recs };
      });
    }
    if (effMoves && typeof effMoves === 'object') {
      return base.map((b) => {
        const o = effMoves[b.id] || {};
        const recs = Array.isArray(o.recs) ? o.recs.filter(Boolean) : (Array.isArray(b.recs) ? b.recs.filter(Boolean) : []);
        return { ...b, label: (o.label ?? b.label) || b.label, note: o.note ?? b.note, primary: (o.primary ?? b.primary) || null, recs };
      });
    }
    return base;
  }, [moves, effMoves]);

  return (
    <div
      style={{
        backgroundImage: `url(${whiteboardBg})`,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'top left',
        width: '1920px',
        height: '1080px',
        position: 'relative',
        overflow: 'hidden',
        margin: '0 auto'
      }}
    >
      {/* HUD */}
      <div style={{
        position: 'absolute', bottom: 8, left: 8, background: 'rgba(255,255,255,0.92)',
        border: '1px solid #ddd', borderRadius: 8, padding: '8px 10px',
        fontFamily: 'Arial, sans-serif', fontSize: 12, zIndex: 9999, maxWidth: 340
      }}>
        <div><b>leagueId</b>: {String(leagueId || '')}</div>
        <div><b>teamName</b>: {String(teamName || '')}</div>
        <div><b>loading</b>: {String(loading)}</div>
        <div><b>error</b>: {error ? String(error) : '—'}</div>
        <div><b>ownerId</b>: {String(ownerId || '—')}</div>
        <div><b>roster players</b>: {rosterCount}</div>
        <div><b>starters</b>: {starters.length}</div>
        <div style={{ marginTop: 6, opacity: .8 }}><b>sample team names:</b></div>
        <ul style={{ margin: 0, paddingLeft: 16 }}>
          {teamSamples.map((t, i) => (
            <li key={i} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              tn: {t.tn || '(none)'} | dn: {t.dn || '(none)'}
            </li>
          ))}
        </ul>
      </div>

      {/* TEAM NAME */}
      <div style={{ position: 'absolute', top: 55, left: 80, zIndex: 3 }}>
        <TeamName
          text={effTeamName}
          maxWidth={900}
          maxFont={120}
          minFont={60}
          color="#2D2D2C"
          baselineAlign
          baselineRatio={0.78}
        />
      </div>

      {/* LEAGUE POWER RANKING */}
      <div
        style={{
          position: 'absolute',
          top: '50px',
          left: '1655px',
          transform: 'scale(2)',
          transformOrigin: 'top left',
          zIndex: 5,
        }}
      >
        {!loading && !error && ownerId && (
          <PowerRanking
            leagueId={leagueId}
            ownerId={ownerId}
            settings={settings}
            playersById={playersById}
            forcedRank={effPowerRank}
          />
        )}
      </div>

      {/* ROSTER TAG */}
      <div
        style={{
          position: 'absolute',
          top: '90px',
          left: '970px',
          transform: 'scale(0.6)',
          transformOrigin: 'top left',
          zIndex: 4,
        }}
      >
        <RosterTag
          scores={effFour}
          overrideTag={overrides?.rosterTag ?? undefined}
          width={650}
          fontSize={40}
          iconLeft={28}
          iconWidth={40}
          insetLeft={106}
          insetRight={28}
        />
      </div>

      {/* LEAGUE SETTINGS */}
      <div
        style={{
          position: 'absolute',
          top: '220px',
          left: '78px',
          transform: 'scale(0.70)',
          transformOrigin: 'top left'
        }}
      >
        {loading ? (
          <div style={{ fontFamily: 'Arial, sans-serif' }}>Loading league…</div>
        ) : error ? (
          <div style={{ color: 'crimson', fontFamily: 'Arial, sans-serif' }}>
            {error}
          </div>
        ) : (
          <LeagueSettings settings={settings} />
        )}
      </div>

      {/* FOUR FACTORS */}
      <div
        style={{
          position: 'absolute',
          top: '190px',
          left: '640px',
          transform: 'scale(0.86)',
          transformOrigin: 'top left'
        }}
      >
        {!loading && !error && (
          <FourFactors
            settings={settings}
            rosterIds={rosterIds}
            playersById={playersById}
            lineup={starters}
            onScoresChange={setFactorScores}
            forcedScores={overrides?.fourFactors ? effFour : undefined}
          />
        )}
      </div>

      {/* DRAFT VALUE CHART */}
      <div
        style={{
          position: 'absolute',
          top: '590px',
          left: '650px',
          transform: 'scale(0.7)',
          transformOrigin: 'top left'
        }}
      >
        {!loading && !error && (
          <DraftValueChart
            points={draftPoints}
            teamsCount={settings.teams || 12}
            width={640}
            height={600}
          />
        )}
      </div>

      {/* STARTERS */}
      <div
        style={{
          position: 'absolute',
          top: '340px',
          left: '78px',
          transform: 'scale(0.8)',
          transformOrigin: 'top left'
        }}
      >
        {!loading && !error && (
          <Starters
            lineup={starters}
            rosterIds={rosterIds}
            playersById={playersById}
            pickByPlayerId={pickByPlayerId}
            adpByPlayerId={adpByPlayerId}
          />
        )}
      </div>

      {/* POSITIONAL GRADES */}
      <div
        style={{
          position: 'absolute',
          top: '700px',
          left: '20px',
          transform: 'scale(1.4)',
          transformOrigin: 'top left'
        }}
      >
        {!loading && !error && (
          <PositionalGrades
            settings={settings}
            rosterIds={rosterIds}
            playersById={playersById}
            forcedGrades={oget(overrides,'positionalGrades',undefined)}
          />
        )}
      </div>

      {/* ROSTER STRENGTHS & WEAKNESSES */}
      <div
        style={{
          position: 'absolute',
          top: '320px',
          left: '1555px',
          transform: 'scale(0.6)',
          transformOrigin: 'top left'
        }}
      >
        {!loading && !error && ownerId && (
          <RosterStrengths
            leagueId={leagueId}
            ownerId={ownerId}
            starCount={effStars ?? finalStars ?? 3}
            overrideItems={effRSItems}
          />
        )}
      </div>

      {/* FINAL VERDICT — Stars */}
      <div
        style={{
          position: 'absolute',
          top: '855px',
          left: '1550px',
          transform: 'scale(0.75)',
          transformOrigin: 'top left',
          zIndex: 50,
        }}
      >
        {!loading && !error && (
          <Stars
            settings={settings}
            rosterIds={rosterIds}
            playersById={playersById}
            onStarsChange={(n) => setFinalStars(n)}
            forcedStars={effStars}
          />
        )}
      </div>

      {/* FINAL VERDICT — Text */}
      <div
        style={{
          position: 'absolute',
          top: '910px',
          left: '1150px',
          transform: 'scale(0.4)',
          transformOrigin: 'top left',
          zIndex: 50,
          width: '1725px',
        }}
      >
        {!loading && !error && (
          <FinalVerdict text={effVerdictTxt} maxWidth='1725px'/>
        )}
      </div>

      {/* MOVES TO MAKE */}
      <div
        style={{
          position: 'absolute',
          top: '550px',
          left: '1100px',
          transform: 'scale(0.75)',
          transformOrigin: 'top left'
        }}
      >
        {!loading && !error && (
          <MovesToMake moves={mergedMoves} playersById={playersById} />
        )}
      </div>
    </div>
  );
}
