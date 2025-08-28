// /src/redraft/starting-lineup/Starters.jsx
import React, { useMemo } from 'react';
import './starters.css';

/**
 * Props:
 * - lineup: [{ slot: 'QB'|'RB'|'WR'|'TE'|'FLEX'|'DEF'|'K', player }]
 * - rosterIds: string[]
 * - playersById: Record<string, any>
 */
export default function Starters({ lineup = [], rosterIds = [], playersById = {} }) {
  const { leftCol, rightCol } = useMemo(() => {
    const score = (p) =>
      (p?.adp_half_ppr || p?.adp || 9999) + (p?.search_rank ? p.search_rank / 10000 : 0);

    // Players already used as starters (to exclude from bench pool)
    const usedIds = new Set(
      (lineup || [])
        .map((it) => it?.player?.player_id || it?.player?.id)
        .filter(Boolean)
        .map(String)
    );

    // All roster players sorted by rough value
    const allPlayers = (rosterIds || [])
      .map((id) => playersById[id])
      .filter(Boolean)
      .map((p) => ({
        ...p,
        id: p.player_id || p.id,
        name: p.full_name || `${p.first_name || ''} ${p.last_name || ''}`.trim(),
        position:
          (Array.isArray(p.fantasy_positions) && p.fantasy_positions[0]) || p.position || '',
        team: p.team || p.pro_team || p.team_abbr || '',
      }))
      .sort((a, b) => score(a) - score(b));

    // Normalize starters we received
    const startersNormalized = (lineup || []).map((it) => {
      const p = it.player || {};
      const id = p.player_id || p.id;
      return {
        id,
        name: p.full_name || `${p.first_name || ''} ${p.last_name || ''}`.trim() || '—',
        position:
          (Array.isArray(p.fantasy_positions) && p.fantasy_positions[0]) ||
          p.position ||
          '',
        team: p.team || p.pro_team || p.team_abbr || '',
        slot: (it.slot || '').toLowerCase(),
      };
    });

    // --- Only count core starters (QB/RB/WR/TE/FLEX) ---
    const CORE = new Set(['qb', 'rb', 'wr', 'te', 'flex']);
    const startersCore = startersNormalized.filter((p) => CORE.has(p.slot));
    const startersCount = startersCore.length;

    // --- Target rows ---
    // 1) At least 10 total rows
    // 2) At least +2 bench beyond *core* starters
    // 3) Make it EVEN so columns are equal
    const MIN_TOTAL = 10;
    const MIN_BENCH = 2;

    let totalNeeded = Math.max(MIN_TOTAL, startersCount + MIN_BENCH);
    if (totalNeeded % 2 !== 0) totalNeeded += 1; // force even total for 50/50 split

    // Build bench list to reach target
    const benchNeeded = Math.max(0, totalNeeded - startersCount);
    const benchPool = allPlayers
      .filter((p) => !usedIds.has(String(p.id)))
      .slice(0, benchNeeded);

    const bench = benchPool.map((p) => ({
      id: p.id,
      name: p.name,
      position: p.position,
      team: p.team,
      slot: 'bench',
    }));

    // If not enough real bench, pad with placeholders to keep columns even
    const placeholders = [];
    for (let i = startersCount + bench.length; i < totalNeeded; i++) {
      placeholders.push({
        id: `placeholder-${i}`,
        name: '—',
        position: '',
        team: '',
        slot: 'bench',
      });
    }

    // Order rows: QB → RB → WR → TE → FLEX → BENCH (DEF/K are never shown)
    const order = ['qb', 'rb', 'wr', 'te', 'flex', 'bench'];
    const ordered = order
      .flatMap((slot) => startersCore.filter((p) => p.slot === slot))
      .concat(bench, placeholders);

    // Split exactly in half (we guaranteed even length)
    const mid = ordered.length / 2;
    return { leftCol: ordered.slice(0, mid), rightCol: ordered.slice(mid) };
  }, [lineup, rosterIds, playersById]);

  // Resolve team logo from /src/assets/standard/<team>.png (e.g., 'ari.png')
  const logoForTeam = (team) => {
    const code = String(team || '').toLowerCase();
    if (!code) return '';
    try {
      return new URL(`../../assets/standard/${code}.png`, import.meta.url).href;
    } catch {
      return '';
    }
  };

  const PlayerRow = ({ p }) => {
    const slotClass =
      p.slot === 'qb' ? 'pos-qb' :
      p.slot === 'rb' ? 'pos-rb' :
      p.slot === 'wr' ? 'pos-wr' :
      p.slot === 'te' ? 'pos-te' :
      p.slot === 'flex' ? 'pos-flex' : 'pos-bench';

    const headshot =
      p.id && !String(p.id).startsWith('placeholder-')
        ? `https://sleepercdn.com/content/nfl/players/thumb/${p.id}.jpg`
        : '';

    const teamLogo = logoForTeam(p.team);
    const slotLabel = (p.slot || '').toUpperCase();
    const team = (p.team || '').toUpperCase();

    const details = ['flex', 'bench'].includes(p.slot)
      ? `${slotLabel} – ${p.position || ''} – ${team}`
      : `${p.position || ''} – ${team}`;

    const displayName = (p.name || '—').toUpperCase();
    let nameSize = 22;
    if (displayName.length > 22) nameSize = 20;
    if (displayName.length > 26) nameSize = 18;

    return (
      <div className={`player-row ${slotClass}`}>
        <div className="player-media">
          {teamLogo && (
            <img
              className="team-logo"
              src={teamLogo}
              alt={team}
              loading="lazy"
              onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
            />
          )}
          <div className="headshot-bg">
            {headshot && (
              <img
                className="player-headshot"
                src={headshot}
                alt=""
                loading="lazy"
                onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
              />
            )}
          </div>
        </div>

        <div className="player-info">
          <div className="player-name" style={{ fontSize: nameSize }} title={displayName}>
            {displayName}
          </div>
          <div className="player-details">{details}</div>
        </div>
      </div>
    );
  };

  /* ========= AUTO-SCALE to fit above Positional Grades ========= */
  const ROW_H = 68;   // estimated from CSS
  const GAP   = 16;   // .roster-column gap
  const longest = Math.max(leftCol.length, rightCol.length);
  const naturalHeight = longest > 0 ? (longest * ROW_H) + ((longest - 1) * GAP) : 0;

  // Keep your chosen printed height
  const MAX_H = 450;
  const scale = naturalHeight > MAX_H ? (MAX_H / naturalHeight) : 1;

  return (
    <div
      className="starting-roster"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        height: scale < 1 ? `${MAX_H}px` : 'auto'
      }}
    >
      <div className="roster-column">
        {leftCol.map((p, i) => <PlayerRow key={`L-${i}-${p.id}`} p={p} />)}
      </div>
      <div className="roster-column">
        {rightCol.map((p, i) => <PlayerRow key={`R-${i}-${p.id}`} p={p} />)}
      </div>
    </div>
  );
}
