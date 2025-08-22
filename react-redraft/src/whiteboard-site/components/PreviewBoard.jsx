// /src/whiteboard-site/components/PreviewBoard.jsx
import React, { useMemo } from 'react';
import LeagueSettings from '../../redraft/league-settings/LeagueSettings.jsx';
import PositionalGrades from '../../redraft/positional-grade/PositionalGrades.jsx';
import Starters from '../../redraft/starting-lineup/Starters.jsx';
import FourFactors from '../../redraft/four-factors/FourFactors.jsx';
import DraftValueChart from '../../redraft/draft-value/DraftValueChart.jsx';
import RosterStrengths from '../../redraft/strengths-weakness/RosterStrengths.jsx';
import MovesToMake from '../../redraft/moves-to-make/MovesToMake.jsx';
import PowerRanking from '../../redraft/power-ranking/PowerRanking.jsx';
import Stars from '../../redraft/stars/Stars.jsx';
import FinalVerdict from '../../redraft/final-verdict/FinalVerdict.jsx';
import { buildStartingLineup } from '../../redraft/sleeper-league/sleeperAPI.js';
import whiteboardBg from '../../redraft/whiteboard/WB-Base.png';

// Badge art for manual override (when no Sleeper strengths are used)
import TagGreen from '../../redraft/strengths-weakness/strengths-weakness-images/S&W-green.png';
import TagRed   from '../../redraft/strengths-weakness/strengths-weakness-images/S&W-red.png';

/* ------------------------ helpers: name & pick parsing ------------------------ */
const normTxt = (s) =>
  String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s'.-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

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
    if (full === baseName)            score += 2000;
    else if (full.startsWith(baseName)) score += 1200;
    else if (full.includes(baseName))   score += 800;

    const pos  = (Array.isArray(p.fantasy_positions) ? p.fantasy_positions[0] : p.position || '').toUpperCase();
    const team = (p.team || p.pro_team || p.team_abbr || '').toUpperCase();

    if (hints.pos  && pos  === hints.pos)  score += 500;
    if (hints.team && team === hints.team) score += 500;

    const adp = Number(p.adp_half_ppr ?? p.adp_ppr ?? p.adp ?? p.adp_full_ppr ?? p.adp_std);
    if (isFinite(adp)) score += (10000 - adp * 100); // better ADP wins ties

    if (score > bestScore) {
      bestScore = score;
      bestId = id;
    }
  }
  return bestId;
}

function parsePick(pickStr, teams) {
  if (!pickStr) return null;
  const s = String(pickStr).trim();

  // #5 => overall 5
  if (s.startsWith('#')) {
    const overall = parseInt(s.slice(1), 10);
    if (!isFinite(overall)) return null;
    const round = Math.max(1, Math.ceil(overall / Math.max(1, teams || 12)));
    return { overall, round };
  }

  // 1.07 or 1-07 => round.pick
  const sep = s.includes('.') ? '.' : (s.includes('-') ? '-' : null);
  if (sep) {
    const [r, p] = s.split(sep);
    const rr = parseInt(r, 10);
    const pp = parseInt(p, 10);
    if (!isFinite(rr) || !isFinite(pp)) return null;
    const overall = (rr - 1) * (teams || 12) + pp;
    return { overall, round: rr };
  }

  // plain number => overall
  const overall = parseInt(s, 10);
  if (!isFinite(overall)) return null;
  const round = Math.max(1, Math.ceil(overall / Math.max(1, teams || 12)));
  return { overall, round };
}

/* -------------------------------- component -------------------------------- */
export default function PreviewBoard({
  leagueId,
  teamName,
  settings,
  rosterIds,
  playersById,
  lineup,
  ownerId,
  draftPoints = [],
  moves = [],
  overrides = {},
  show,
}) {
  const safe = (arr, alt) => (arr && arr.length ? arr : alt);
  const positions = settings?.positions || { qb:1, rb:2, wr:2, te:1, flex:2 };

  /* ---------- Manual roster & picks: ONE ROW IS OK ---------- */
  const manualRows = Array.isArray(overrides?.manual?.roster) ? overrides.manual.roster : [];

  const manualResolved = useMemo(() => {
    if (!manualRows.length) return { ids: [], points: [] };

    const ids = [];
    const points = [];
    const seen = new Set();
    const teamsCount = Number(settings?.teams || 12);

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

      // ADP fallback: if missing, use pick overall so the point still renders
      let adp = Number(p.adp_half_ppr ?? p.adp_ppr ?? p.adp ?? p.adp_full_ppr ?? p.adp_std);
      if (!isFinite(adp)) adp = pick.overall;

      const key = `${id}-${pick.overall}`;
      if (seen.has(key)) continue;
      seen.add(key);

      points.push({
        id,
        first,
        last: rest.join(' '),
        overall: pick.overall,
        round: pick.round,
        adp,
      });
    }

    return { ids, points };
  }, [manualRows, playersById, settings?.teams]);

  // Effective roster/lineup/chart in preview:
  // - manual rows win if present (even one row)
  // - else fall back to props you passed in
  const effRosterIds = manualResolved.ids.length ? manualResolved.ids : rosterIds;
  const effLineup = useMemo(() => {
    try { return buildStartingLineup(positions, effRosterIds, playersById); }
    catch { return lineup || []; }
  }, [positions, effRosterIds, playersById, lineup]);

  const effDraftPoints = manualResolved.points.length ? manualResolved.points : draftPoints;

  /* ---------- Overrides for factors/grades in manual mode ---------- */
  const forcedScores = overrides?.fourFactors || undefined;     // {upside,reliability,depth,risk}
  const forcedGrades = overrides?.positionalGrades || undefined; // {QB,RB,WR,TE}

  /* ---------- Moves: if prop empty, derive from overrides.moves ---------- */
  const mergedMoves = useMemo(() => {
    if (Array.isArray(moves) && moves.length) return moves;

    const o = overrides?.moves;
    const base = [
      { id: 'trade',  label: 'TRADE',  variant: 'teal',  primary: null, recs: [], note: undefined },
      { id: 'uptier', label: 'UPTIER', variant: 'gold',  primary: null, recs: [], note: undefined },
      { id: 'pivot',  label: 'PIVOT',  variant: 'green', primary: null, recs: [], note: undefined },
    ];

    // Array shape
    if (Array.isArray(o)) {
      return base.map((b, i) => {
        const x = o[i] || {};
        const recs = Array.isArray(x.recs) ? x.recs.filter(Boolean) : [];
        return { ...b, label: x.label ?? b.label, note: x.note ?? b.note, primary: x.primary ?? b.primary, recs };
      });
    }

    // Object shape { trade, uptier, pivot }
    if (o && typeof o === 'object') {
      return base.map((b) => {
        const x = o[b.id] || {};
        const recs = Array.isArray(x.recs) ? x.recs.filter(Boolean) : [];
        return { ...b, label: x.label ?? b.label, note: x.note ?? b.note, primary: x.primary ?? b.primary, recs };
      });
    }

    return base;
  }, [moves, overrides?.moves]);

  /* ---------- Manual badge view when NOT using Sleeper strengths ---------- */
  const manualBadgeItems = useMemo(() => {
    const raw = overrides?.rosterStrengths?.items;
    if (!Array.isArray(raw)) return null;
    return [raw[0] ?? null, raw[1] ?? null, raw[2] ?? null]
      .map((it) => {
        if (!it) return null;
        const key = String(it.color || it.type || '').toLowerCase();
        const type  = key === 'red' || key === 'weakness' ? 'weakness' : 'strength';
        const label = String(it.label || '').trim();
        return label ? { type, label } : null;
      });
  }, [overrides?.rosterStrengths?.items]);

  const ManualBadge = ({ type, label }) => {
    const src = type === 'weakness' ? TagRed : TagGreen;
    return (
      <div className={`rs-badge ${type}`} title={label} style={{ transform: 'scale(0.8)', transformOrigin: 'top left' }}>
        <img className="rs-badge-bg" src={src} alt="" />
        <span className="rs-badge-text">{label.toUpperCase()}</span>
      </div>
    );
  };

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
        margin: '0 auto',
      }}
    >
      {/* TEAM NAME */}
      <div style={{
        position:'absolute', top:'22px', left:'72px',
        fontSize:'120px', fontFamily:'Veneer, sans-serif', color:'#2D2D2C', fontWeight:'bold'
      }}>
        {(teamName || '').toUpperCase()}
      </div>

      {/* LEAGUE SETTINGS */}
      {show?.settings && (
        <div style={{ position:'absolute', top:'220px', left:'78px', transform:'scale(0.70)', transformOrigin:'top left' }}>
          <LeagueSettings settings={settings} />
        </div>
      )}

      {/* FOUR FACTORS (respects overrides.fourFactors) */}
      {show?.fourFactors && (
        <div style={{ position:'absolute', top:'190px', left:'640px', transform:'scale(0.86)', transformOrigin:'top left' }}>
          <FourFactors
            settings={settings}
            rosterIds={effRosterIds}
            playersById={playersById}
            lineup={effLineup}
            forcedScores={forcedScores}
          />
        </div>
      )}

      {/* DRAFT VALUE CHART */}
      {show?.draftChart && (
        <div style={{ position:'absolute', top:'590px', left:'680px', transform:'scale(0.7)', transformOrigin:'top left' }}>
          <DraftValueChart points={effDraftPoints} teamsCount={settings?.teams || 12} width={640} height={500} />
        </div>
      )}

      {/* STARTERS */}
      {show?.starters && (
        <div style={{ position:'absolute', top:'340px', left:'78px', transform:'scale(0.8)', transformOrigin:'top left' }}>
          <Starters lineup={effLineup} rosterIds={effRosterIds} playersById={playersById} />
        </div>
      )}

      {/* POSITIONAL GRADES (respects overrides.positionalGrades) */}
      {show?.grades && (
        <div style={{ position:'absolute', top:'730px', left:'100px', transform:'scale(0.90)', transformOrigin:'top left' }}>
          <PositionalGrades
            settings={settings}
            rosterIds={effRosterIds}
            playersById={playersById}
            forcedGrades={forcedGrades}
          />
        </div>
      )}

      {/* ROSTER STRENGTHS */}
      {show?.strengths && (
        <>
          {leagueId && ownerId ? (
            <div style={{ position:'absolute', top:'310px', left:'1590px', transform:'scale(0.8)', transformOrigin:'top left' }}>
              <RosterStrengths leagueId={leagueId} ownerId={ownerId} />
            </div>
          ) : manualBadgeItems && manualBadgeItems.some(Boolean) ? (
            <div style={{ position:'absolute', top:'310px', left:'1550px', transform:'scale(0.75)', transformOrigin:'top left' }}>
              {manualBadgeItems.map((b, i) => b && <ManualBadge key={`${b.type}-${i}-${b.label}`} type={b.type} label={b.label} />)}
            </div>
          ) : (
            <div style={{ position:'absolute', top:'310px', left:'1550px', width: 300, fontFamily:'Prohibition, sans-serif' }}>
              <div style={{ fontSize:24, marginBottom:6 }}>ROSTER STRENGTHS</div>
              <ul style={{ margin:0, paddingLeft:16, fontFamily:'Erbaum Medium, sans-serif', fontSize:12 }}>
                {safe(overrides?.strengths, ['—']).map((s,i)=><li key={`s${i}`}>{s}</li>)}
              </ul>
              <div style={{ fontSize:24, margin:'12px 0 6px' }}>WEAKNESSES</div>
              <ul style={{ margin:0, paddingLeft:16, fontFamily:'Erbaum Medium, sans-serif', fontSize:12 }}>
                {safe(overrides?.weaknesses, ['—']).map((w,i)=><li key={`w${i}`}>{w}</li>)}
              </ul>
            </div>
          )}
        </>
      )}

      {/* MOVES TO MAKE (cards) */}
      {show?.moves && (
        <div style={{ position:'absolute', top:'575px', left:'1240px', transform:'scale(0.78)', transformOrigin:'top left' }}>
          <MovesToMake moves={mergedMoves} playersById={playersById} />
        </div>
      )}

      {/* POWER RANKING */}
      {show?.powerRank && (
        <div style={{ position:'absolute', top:'40px', left:'1420px', transform:'scale(0.90)', transformOrigin:'top left', zIndex:5 }}>
          {leagueId && ownerId
            ? <PowerRanking leagueId={leagueId} ownerId={ownerId} settings={settings} playersById={playersById} />
            : <div style={{ fontFamily:'Erbaum Medium, sans-serif', fontSize:12, opacity:.8 }}>{overrides?.powerRankNote || ''}</div>
          }
        </div>
      )}

      {/* FINAL VERDICT — Stars (manual: uses overrides.finalVerdict.stars) */}
      <div
        style={{
          position:'absolute',
          top:'855px',
          left:'1550px',
          transform:'scale(0.75)',
          transformOrigin:'top left',
          zIndex:50
        }}
      >
        <Stars
          settings={settings}
          rosterIds={effRosterIds}
          playersById={playersById}
          forcedStars={overrides?.finalVerdict?.stars ?? undefined}
        />
      </div>

      {/* FINAL VERDICT — Text */}
      <div
        style={{
          position:'absolute',
          top:'910px',
          left:'1150px',
          transform:'scale(0.4)',
          transformOrigin:'top left',
          zIndex:50,
          width:'1725px'
        }}
      >
        <FinalVerdict text={overrides?.finalVerdict?.note ?? ''} maxWidth="1725px" />
      </div>
    </div>
  );
}
