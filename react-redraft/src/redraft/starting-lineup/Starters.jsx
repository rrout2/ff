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

    const usedIds = new Set(
      lineup
        .map((it) => it?.player?.player_id || it?.player?.id)
        .filter(Boolean)
        .map(String)
    );

    const allPlayers = (rosterIds || [])
      .map((id) => playersById[id])
      .filter(Boolean)
      .map((p) => ({
        ...p,
        id: p.player_id || p.id,
        name: p.full_name || `${p.first_name || ''} ${p.last_name || ''}`.trim(),
        position:
          (Array.isArray(p.fantasy_positions) && p.fantasy_positions[0]) || p.position || '',
        team: p.team || '',
      }))
      .sort((a, b) => score(a) - score(b));

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
        team: p.team || '',
        slot: (it.slot || '').toLowerCase(),
      };
    });

    // Ensure >= 10 rows and at least +2 beyond starters
    const startersCount = startersNormalized.length;
    const totalNeeded = Math.max(10, startersCount + 2);
    const benchCount = Math.max(0, totalNeeded - startersCount);

    const benchPool = allPlayers.filter((p) => !usedIds.has(String(p.id))).slice(0, benchCount);
    const bench = benchPool.map((p) => ({
      id: p.id,
      name: p.name,
      position: p.position,
      team: p.team,
      slot: 'bench',
    }));

    const order = ['qb', 'rb', 'wr', 'te', 'flex', 'bench'];
    const ordered = order
      .flatMap((slot) => startersNormalized.filter((p) => p.slot.toLowerCase() === slot))
      .concat(bench);

    const mid = Math.ceil(ordered.length / 2);
    return { leftCol: ordered.slice(0, mid), rightCol: ordered.slice(mid) };
  }, [lineup, rosterIds, playersById]);

  // Resolve team logo from /src/assets/standard/<team>.png (e.g. 'ari.png')
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

    const headshot = p.id
      ? `https://sleepercdn.com/content/nfl/players/thumb/${p.id}.jpg`
      : '';

    const teamLogo = logoForTeam(p.team);
    const slotLabel = (p.slot || '').toUpperCase();
    const team = (p.team || '').toUpperCase();

    const details = ['flex', 'bench'].includes(p.slot)
      ? `${slotLabel} – ${p.position || ''} – ${team}`
      : `${p.position || ''} – ${team}`;

    const displayName = (p.name || '—').toUpperCase();
    let nameSize = 22; // tiny nudge for super-long names
    if (displayName.length > 22) nameSize = 20;
    if (displayName.length > 26) nameSize = 18;

    return (
      <div className={`player-row ${slotClass}`}>
        <div className="player-media">
          {/* Logo overlaps into the headshot space from the left */}
          {teamLogo && (
            <img
              className="team-logo"
              src={teamLogo}
              alt={team}
              loading="lazy"
              onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
            />
          )}

          {/* Light grey circular background behind the headshot */}
          <div className="headshot-bg">
            <img
              className="player-headshot"
              src={headshot}
              alt=""
              loading="lazy"
              onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
            />
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

  return (
    <div className="starting-roster">
      <div className="roster-column">
        {leftCol.map((p, i) => <PlayerRow key={`L-${i}-${p.id}`} p={p} />)}
      </div>
      <div className="roster-column">
        {rightCol.map((p, i) => <PlayerRow key={`R-${i}-${p.id}`} p={p} />)}
      </div>
    </div>
  );
}
