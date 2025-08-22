import React, { useEffect, useMemo, useState } from 'react';
import './strength-weakness.css';
import gradeData from '../players/players-by-id.json';
import { fetchLeagueRosters } from '../sleeper-league/sleeperAPI.js';

import TagGreen from './strengths-weakness-images/S&W-green.png';
import TagRed   from './strengths-weakness-images/S&W-red.png';

/**
 * Props:
 * - leagueId: string
 * - ownerId: string
 * - starCount?: number
 * - overrideItems?: Array<{ color?: 'green'|'red', type?: 'strength'|'weakness', label: string } | null>
 *   Index 0/1/2 map to Badge 1/2/3. If an index is empty/null, we use AUTO at that slot.
 */
export default function RosterStrengths({ leagueId, ownerId, starCount = 3, overrideItems }) {
  const [rosters, setRosters] = useState([]);
  const [err, setErr] = useState(null);

  // Fetch league rosters once
  useEffect(() => {
    if (!leagueId) return;
    let cancel = false;
    (async () => {
      try {
        setErr(null);
        const rs = await fetchLeagueRosters(leagueId);
        if (!cancel) setRosters(Array.isArray(rs) ? rs : []);
      } catch (e) {
        if (!cancel) setErr(e.message || 'Failed to load rosters');
      }
    })();
    return () => { cancel = true; };
  }, [leagueId]);

  // --- AUTO computation (always run hooks in same order) ---------------------
  const auto = useMemo(() => {
    if (!ownerId || !rosters.length) {
      return { ready: false, autoItems: [null, null, null] };
    }

    const sumTeamPos = (playerIds, pos) =>
      (playerIds || [])
        .map(id => gradeData[String(id)])
        .filter(p => p && p.position === pos)
        .reduce((s, p) => s + (Number(p.value) || 0), 0);

    const allTeams = rosters.map(r => ({
      id: String(r.owner_id),
      qb: sumTeamPos(r.players, 'QB'),
      rb: sumTeamPos(r.players, 'RB'),
      wr: sumTeamPos(r.players, 'WR'),
      te: sumTeamPos(r.players, 'TE'),
    }));

    const me = allTeams.find(t => t.id === String(ownerId));
    if (!me) return { ready: false, autoItems: [null, null, null] };

    const isBest = (pos) => allTeams.every(t => t.id === me.id || me[pos] > t[pos]);

    const thresholds = {
      wr: { strong: 5.9, weak: 6 },
      rb: { strong: 5.9, weak: 6 },
      te: { strong: 5.9, weak: 6 },
      qb: { strong: 5.9, weak: 6 },
    };

    const strengths = [];
    const weaknesses = [];

    if (isBest('wr')) strengths.push('Best WR Room In The League');
    else if (me.wr > thresholds.wr.strong) strengths.push('Strong WR Room');
    else if (me.wr < thresholds.wr.weak) weaknesses.push('Weak WR Room');

    if (isBest('rb')) strengths.push('Best RB Room In The League');
    else if (me.rb > thresholds.rb.strong) strengths.push('Strong RB Room');
    else if (me.rb < thresholds.rb.weak) weaknesses.push('Weak RB Room');

    if (isBest('te')) strengths.push('Best TE Room In The League');
    else if (me.te > thresholds.te.strong) strengths.push('Strong TE Room');
    else if (me.te < thresholds.te.weak) weaknesses.push('Weak TE Room');

    if (isBest('qb')) strengths.push('Best QB Room In The League');
    else if (me.qb > thresholds.qb.strong) strengths.push('Strong QB Room');
    else if (me.qb < thresholds.qb.weak) weaknesses.push('Weak QB Room');

    // exactly 3 slots:
    const wantStrengths = starCount >= 3 ? 2 : 1;
    const wantWeaknesses = starCount >= 3 ? 1 : 2;

    const sFallback = ['Has Playmakers', 'Upside Depth'];
    const wFallback = ['Needs Depth', 'Injury Risk'];

    while (strengths.length < wantStrengths && sFallback.length) strengths.push(sFallback.shift());
    while (weaknesses.length < wantWeaknesses && wFallback.length) weaknesses.push(wFallback.shift());

    const autoItems =
      starCount >= 3
        ? [
            { type: 'strength', color: 'green', label: strengths[0] },
            { type: 'strength', color: 'green', label: strengths[1] },
            { type: 'weakness', color: 'red',   label: weaknesses[0] },
          ]
        : [
            { type: 'strength', color: 'green', label: strengths[0] },
            { type: 'weakness', color: 'red',   label: weaknesses[0] },
            { type: 'weakness', color: 'red',   label: weaknesses[1] },
          ];

    return { ready: true, autoItems };
  }, [rosters, ownerId, starCount]);

  // --- Normalize overrides to fixed 3 slots ---------------------------------
  const normOverride = useMemo(() => {
    const out = [null, null, null];
    if (!Array.isArray(overrideItems)) return out;
    for (let i = 0; i < 3; i++) {
      const raw = overrideItems[i];
      if (!raw) continue;
      const key = String(raw.color || raw.type || '').toLowerCase();
      const type  = key === 'red' || key === 'weakness' ? 'weakness' : 'strength';
      const color = type === 'weakness' ? 'red' : 'green';
      const label = String(raw.label || '').trim();
      if (label) out[i] = { type, color, label };
    }
    return out;
  }, [overrideItems]);

  // --- Final items: override by slot -> else auto at that slot ---------------
  const items = useMemo(() => {
    const base = auto.autoItems || [null, null, null];
    return [0, 1, 2].map(i => normOverride[i] || base[i]).filter(Boolean);
  }, [normOverride, auto]);

  if (!leagueId || !ownerId) {
    return <div className="roster-strengths-hint">Missing leagueId or ownerId.</div>;
  }
  if (err) {
    return <div className="roster-strengths-hint" style={{ color: 'crimson' }}>{err}</div>;
  }
  if (!auto.ready && !normOverride.some(Boolean)) {
    return <div className="roster-strengths-hint">Loading roster strengths…</div>;
  }

  const Badge = ({ type, label }) => {
    const src = type === 'weakness' ? TagRed : TagGreen;
    return (
      <div className={`rs-badge ${type}`} title={label}>
        <img className="rs-badge-bg" src={src} alt="" />
        <span className="rs-badge-text">{label.toUpperCase()}</span>
      </div>
    );
  };

  return (
    <div className="roster-strengths">
      {items.map((b, i) => (
        <Badge key={`${b.type}-${i}-${b.label}`} type={b.type} label={b.label} />
      ))}
    </div>
  );
}
