import React, { useEffect, useMemo, useState } from 'react';
import './power-ranking.css';

import RPR1 from './power-ranking-images/RPR-1st.png';
import RPR2 from './power-ranking-images/RPR-2nd.png';
import RPR3 from './power-ranking-images/RPR-3rd.png';
import RPRShell from './power-ranking-images/RPR-shell.png';

import { fetchLeagueUsers, fetchLeagueRosters, buildStartingLineup } from '../sleeper-league/sleeperAPI';
import gradeData from '../players/players-by-id.json';

const POS = ['QB', 'RB', 'WR', 'TE'];
const posOf = (p) => (p?.position || p?.pos || p?.fantasy_positions?.[0] || '').toUpperCase();
const ordinal = (n) => { const s=['th','st','nd','rd']; const v=n%100; return n + (s[(v-20)%10] || s[v] || s[0]); };
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

function playerValue(pid, p) {
  const g = gradeData?.[pid] || {};
  const direct = g.value ?? g.val ?? g.score ?? g.posValue ?? g.overallValue;
  if (Number.isFinite(direct)) return Number(direct);
  const adp = p?.adp_half_ppr ?? p?.adp_ppr ?? p?.adp ?? p?.adp_full_ppr ?? p?.adp_std ?? g.sleeperAdp ?? g.domainAdpN ?? g.domainAdp;
  const n = Number(adp);
  return Number.isFinite(n) ? 300 - Math.min(Math.max(n, 1), 300) : 0;
}

/**
 * Props:
 * - leagueId, ownerId, settings, playersById
 * - size?: number (px)
 * - forcedRank?: number   // NEW: manually set rank (1=best)
 */
export default function PowerRanking({ leagueId, ownerId, settings, playersById, size = 100, forcedRank }) {
  const [myRank, setMyRank] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const teams = Number(settings?.teams || 12);

    // If a manual rank is provided, use it and skip auto compute
    if (Number.isFinite(forcedRank)) {
      setMyRank(clamp(Number(forcedRank), 1, teams));
      setReady(true);
      return;
    }

    if (!leagueId || !settings || !playersById || !Object.keys(playersById).length) return;
    let cancelled = false;

    (async () => {
      try {
        setReady(false);
        const [users, rosters] = await Promise.all([fetchLeagueUsers(leagueId), fetchLeagueRosters(leagueId)]);
        const teamRows = rosters.map((r) => {
          const ids = Array.isArray(r.players) ? r.players : [];
          const lineup = buildStartingLineup(settings.positions, ids, playersById) || [];
          const lineupIds = lineup.map((x) => (typeof x === 'string' ? x : x?.id || x?.player_id)).filter(Boolean);
          const posSums = { QB: 0, RB: 0, WR: 0, TE: 0 };
          for (const pid of lineupIds) {
            const p = playersById[pid];
            if (!p) continue;
            const base = posOf(p);
            if (!POS.includes(base)) continue;
            posSums[base] += playerValue(pid, p);
          }
          return { ownerId: r.owner_id, rosterId: r.roster_id, posSums };
        });

        const mins = {}, maxs = {};
        for (const k of POS) {
          const vals = teamRows.map(t => t.posSums[k]);
          mins[k] = Math.min(...vals);
          maxs[k] = Math.max(...vals);
        }
        const toGrade = (val, k) => {
          const lo = mins[k], hi = maxs[k];
          if (!Number.isFinite(val)) return 1;
          if (hi === lo) return 5;
          return Math.round((1 + 9 * ((val - lo) / (hi - lo))) * 10) / 10;
        };

        const ranked = teamRows.map((t) => {
          const grades = { QB: toGrade(t.posSums.QB,'QB'), RB: toGrade(t.posSums.RB,'RB'), WR: toGrade(t.posSums.WR,'WR'), TE: toGrade(t.posSums.TE,'TE') };
          const avg = Math.round(((grades.QB + grades.RB + grades.WR + grades.TE) / 4) * 100) / 100;
          return { ...t, grades, avg };
        }).sort((a, b) => b.avg - a.avg);

        const idx = ranked.findIndex(t => String(t.ownerId) === String(ownerId));
        if (!cancelled) { setMyRank(idx >= 0 ? idx + 1 : null); setReady(true); }
      } catch {
        if (!cancelled) { setMyRank(null); setReady(true); }
      }
    })();

    return () => { cancelled = true; };
  }, [leagueId, ownerId, settings, playersById, forcedRank]);

  const badge = useMemo(() => {
    if (!ready || !myRank) return null;

    const wrap = (child) => (
      <div className="power-rank" style={{ '--pr-size': `${size}px` }}>
        {child}
      </div>
    );

    if (myRank === 1 || myRank === 2 || myRank === 3) {
      const img = myRank === 1 ? RPR1 : myRank === 2 ? RPR2 : RPR3;
      return wrap(<img src={img} alt={ordinal(myRank)} className="power-rank-badge" />);
    }

    // 4th+
    return wrap(
      <>
        <img src={RPRShell} alt="Power Rank" className="power-rank-badge" />
        <div className="power-rank-ordinal">{ordinal(myRank)}</div>
      </>
    );
  }, [ready, myRank, size]);

  return <>{badge}</>;
}
