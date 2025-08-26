import React, { useMemo } from 'react';
import './moves-to-make.css';
import BracketPNG from './images/moves_to_make.png';

export default function MovesToMake({ moves = [], playersById = {} }) {
  // --- helpers (unchanged) ---------------------------------------------------
  const _normalize = (p) => {
    if (!p) return null;
    const id   = String(p?.player_id || p?.id || '');
    const name = p?.full_name || `${p?.first_name || ''} ${p?.last_name || ''}`.trim();
    const pos  = (Array.isArray(p?.fantasy_positions) ? p.fantasy_positions[0] : p?.position || '').toUpperCase();
    const team = (p?.team || p?.pro_team || p?.team_abbr || '').toUpperCase();
    return { id, name: name || '—', pos, team };
  };

  const normTxt = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9\s'.-]/g, ' ').replace(/\s+/g, ' ').trim();
  const getADP = (p = {}) => {
    const v = p.adp_half_ppr ?? p.adp_ppr ?? p.adp ?? p.adp_full_ppr ?? p.adp_std;
    const n = Number(v);
    return Number.isFinite(n) ? n : Infinity;
  };

  const TEAM_RE = /^(ari|atl|bal|buf|car|chi|cin|cle|dal|den|det|gb|hou|ind|jax|kc|lv|lac|lar|mia|min|ne|no|nyg|nyj|phi|pit|sf|sea|tb|ten|wsh)$/;
  const POS_RE  = /^(qb|rb|wr|te)$/;

  const indexes = useMemo(() => {
    const byLast = new Map();
    const byFull = new Map();
    for (const [id, p] of Object.entries(playersById || {})) {
      const full = (p.full_name || `${p.first_name || ''} ${p.last_name || ''}`.trim()).toLowerCase();
      const last = (p.last_name || '').toLowerCase();
      if (full) byFull.set(full, [...(byFull.get(full) || []), id]);
      if (last) byLast.set(last, [...(byLast.get(last) || []), id]);
    }
    return { byFull, byLast };
  }, [playersById]);

  const resolvePlayer = (maybe) => {
    if (!maybe) return null;
    if (typeof maybe === 'object') return _normalize(maybe);
    const raw = String(maybe);
    const direct = playersById?.[raw];
    if (direct) return _normalize(direct);

    const q = normTxt(raw);
    if (!q) return null;

    const tokens = q.split(' ');
    const hints  = { team: null, pos: null };
    const lastTok = tokens[tokens.length - 1] || '';
    if (TEAM_RE.test(lastTok)) hints.team = lastTok.toUpperCase();
    if (POS_RE.test(lastTok))  hints.pos  = lastTok.toUpperCase();
    const baseName = (hints.team || hints.pos) ? tokens.slice(0, -1).join(' ') : q;

    const candidateIds = new Set();
    const exactFull = indexes.byFull.get(baseName);
    if (exactFull) exactFull.forEach(id => candidateIds.add(id));
    const baseLast = baseName.split(' ').pop() || baseName;
    const lastHits = indexes.byLast.get(baseLast);
    if (lastHits) lastHits.forEach(id => candidateIds.add(id));
    if (candidateIds.size === 0) {
      for (const [id, p] of Object.entries(playersById || {})) {
        const full = (p.full_name || `${p.first_name || ''} ${p.last_name || ''}`.trim()).toLowerCase();
        if (full.includes(baseName)) candidateIds.add(id);
      }
    }
    if (candidateIds.size === 0) return null;

    let best = null; let bestScore = -1e9;
    for (const id of candidateIds) {
      const p = playersById[id]; if (!p) continue;
      const full = (p.full_name || `${p.first_name || ''} ${p.last_name || ''}`.trim()).toLowerCase();

      let score = 0;
      if (full === baseName) score += 2000;
      else if (full.startsWith(baseName)) score += 1200;
      else if (full.includes(baseName))  score += 800;

      const pos  = (Array.isArray(p.fantasy_positions) ? p.fantasy_positions[0] : p.position || '').toUpperCase();
      const team = (p.team || p.pro_team || p.team_abbr || '').toUpperCase();
      if (hints.pos  && pos  === hints.pos)  score += 500;
      if (hints.team && team === hints.team) score += 500;

      const adp = getADP(p);
      score += (isFinite(adp) ? (10000 - adp * 100) : -100000);

      if (score > bestScore) { bestScore = score; best = p; }
    }
    return _normalize(best);
  };

  const logoForTeam = (team) => {
    const code = String(team || '').toLowerCase();
    if (!code) return '';
    try { return new URL(`../../assets/standard/${code}.png`, import.meta.url).href; }
    catch { return ''; }
  };

  const toPosClass = (pos) => {
    switch ((pos || '').toUpperCase()) {
      case 'QB': return 'pos-qb';
      case 'RB': return 'pos-rb';
      case 'WR': return 'pos-wr';
      case 'TE': return 'pos-te';
      case 'FLEX': return 'pos-flex';
      default: return 'pos-bench';
    }
  };

  const RecRow = ({ p }) => {
    const posClass = toPosClass(p?.pos);
    return (
      <div className={`rec-row ${posClass}`}>
        <div className="rec-bar" />
        <div className="rec-media">
          {p.team && (
            <img className="rec-logo" src={logoForTeam(p.team)} alt={p.team}
                 loading="lazy" onError={(e) => (e.currentTarget.style.visibility = 'hidden')} />
          )}
          <div className="rec-headshot-bg">
            {!!p.id && (
              <img className="rec-headshot"
                   src={`https://sleepercdn.com/content/nfl/players/thumb/${p.id}.jpg`}
                   alt="" loading="lazy"
                   onError={(e) => (e.currentTarget.style.visibility = 'hidden')} />
            )}
          </div>
        </div>
        <div className="rec-info">
          <div className="rec-name" title={p.name}>{(p.name || '—').toUpperCase()}</div>
          <div className="rec-details">{p.pos || ''} – {p.team || ''}</div>
        </div>
      </div>
    );
  };

  const MoveColumn = ({ index, label, primary, recs = [], note }) => {
    const P = resolvePlayer(primary);
    const R = (recs || []).map(resolvePlayer).filter(Boolean);
    const posClass = toPosClass(P?.pos);

    return (
      <div className="move-column">
        {/* header chip: ONLY the number */}
        <div className="move-header">
          <div className="move-rank">#{index + 1}</div>
        </div>

        {/* label UNDER the chip (still fed by overrides) */}
        <div className="move-label">{(label || '').toUpperCase()}</div>

        {P && (
          <div className={`player-card ${posClass}`}>
            <div className="player-media">
              {P.team && (
                <img className="team-logo" src={logoForTeam(P.team)} alt={P.team}
                     loading="lazy" onError={(e) => (e.currentTarget.style.visibility = 'hidden')} />
              )}
              <div className="headshot-bg">
                {!!P.id && (
                  <img className="player-headshot"
                       src={`https://sleepercdn.com/content/nfl/players/thumb/${P.id}.jpg`}
                       alt="" loading="lazy"
                       onError={(e) => (e.currentTarget.style.visibility = 'hidden')} />
                )}
              </div>
            </div>
            <div className="player-info">
              <div className="player-name" title={P.name}>{(P.name || '—').toUpperCase()}</div>
              <div className="player-details">{P.pos || ''} – {P.team || ''}</div>
            </div>
          </div>
        )}

        {R.length > 0 && (
          <div className="recommendations">
            {R[0] && R[1] && <img className="rec-bracket-img" src={BracketPNG} alt="" />}
            {R[0] && <RecRow p={R[0]} />}
            {R[1] && <RecRow p={R[1]} />}
            {(R[0] && R[1]) && <div className="or-abs">–OR–</div>}
          </div>
        )}

        {typeof note === 'string' && note.trim() && (
          <div className="move-note" style={{ marginTop: 8, fontSize: 12, color: '#2D2D2C', fontWeight: 600, lineHeight: 1.2 }}>
            {note}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="moves-to-make">
      {(moves || []).map((m, idx) => (
        <MoveColumn
          key={m.id || idx}
          index={idx}
          label={m.label}             // ← overrides still feed this
          primary={m.primary}
          recs={m.recs || []}
          note={m.note}
        />
      ))}
    </div>
  );
}
