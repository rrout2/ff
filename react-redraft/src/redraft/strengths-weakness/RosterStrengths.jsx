// /src/redraft/strengths-weakness/RosterStrengths.jsx
import React, { useEffect, useMemo, useState } from 'react';
import './strength-weakness.css';
import gradeData from '../players/players-by-id.json.backup.1757645792240.json';
import { fetchLeagueRosters } from '../sleeper-league/sleeperAPI.js';

import TagGreen from './strengths-weakness-images/S&W-green.png';
import TagRed   from './strengths-weakness-images/S&W-red.png';

/**
 * Props:
 * - leagueId: string
 * - ownerId: string
 * - starCount?: number
 * - overrideItems?: Array<{ color?: 'green'|'red', type?: 'strength'|'weakness', label: string } | null>
 */
export default function RosterStrengths({ leagueId, ownerId, starCount = 3, overrideItems }) {
  const [rosters, setRosters] = useState([]);
  const [err, setErr] = useState(null);

  // ---- fetch once ----
  useEffect(() => {
    if (!leagueId) return;
    let cancel = false;
    (async () => {
      try {
        setErr(null);
        const rs = await fetchLeagueRosters(leagueId);
        if (!cancel) setRosters(Array.isArray(rs) ? rs : []);
      } catch (e) {
        if (!cancel) setErr(e?.message || 'Failed to load rosters');
      }
    })();
    return () => { cancel = true; };
  }, [leagueId]);

  // ---- helpers ----
  const toNum = (v) => {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };
  const clamp10 = (n) => Math.max(0, Math.min(10, n));
  const topHalfSecond = (arr) => {
    const s = arr.filter(Number.isFinite).sort((a, b) => b - a);
    return (s[0] ?? 0) + 0.5 * (s[1] ?? 0);
  };
  const normName = (s) => String(s || '').trim().toUpperCase();

  // Treat these names as WR even if their DB/other positions sneak in
  const NAME_AS_WR = new Set(['TRAVIS HUNTER']);

  // normalize position from gradeData row (e.g., "WR104" -> "WR")
  const posKey = (row) => {
    const nm = normName(row?.name || row?.full_name);
    if (NAME_AS_WR.has(nm)) return 'WR';
    const raw = String(row?.position || '').toUpperCase().replace(/[^A-Z]/g, '');
    if (raw.startsWith('QB')) return 'QB';
    if (raw.startsWith('RB')) return 'RB';
    if (raw.startsWith('WR')) return 'WR';
    if (raw.startsWith('TE')) return 'TE';
    return '';
  };

  // same thresholds as PositionalGrades for RB/WR sums
  const THRESH = {
    RB: [10,25,50,75,100,125,140,165,180,200],
    WR: [20,50,70,90,110,130,160,200,250,300],
  };
  const gradeFromThresholds = (arr, value) => {
    if (!Number.isFinite(value) || value <= 0) return 0;
    let g = 1;
    for (let i = 0; i < arr.length; i++) if (value >= arr[i]) g = i + 1;
    return g; // 1..10
  };

  // ---- compute grades for each team ----
  const auto = useMemo(() => {
    if (!ownerId || !rosters.length) return { ready: false, items: [null, null, null] };

    const allTeams = rosters.map((r) => {
      const ids = (r.players || []).map(String);
      const qbVals = [];
      const teVals = [];
      let rbSum = 0;
      let wrSum = 0;

      for (const id of ids) {
        const row = gradeData[id];
        if (!row) continue;
        const P = posKey(row);
        if (P === 'QB') {
          const v = toNum(row['qb-score'] ?? row.qb_score ?? row.qbScore ?? row.qb_value ?? row.qb ?? row.value);
          if (v !== null) qbVals.push(v);
        } else if (P === 'TE') {
          const v = toNum(row.te_value ?? row.teValue ?? row.te ?? row.value ?? row.score);
          if (v !== null) teVals.push(v);
        } else if (P === 'RB') {
          const v = toNum(row.value ?? row.rb_value ?? row.score ?? row.points);
          rbSum += v || 0;
        } else if (P === 'WR') {
          const v = toNum(row.value ?? row.wr_value ?? row.score ?? row.points);
          wrSum += v || 0;
        }
      }

      const qbGrade = Math.round(clamp10(topHalfSecond(qbVals)));
      const teGrade = Math.round(clamp10(topHalfSecond(teVals)));
      const rbGrade = gradeFromThresholds(THRESH.RB, rbSum);
      const wrGrade = gradeFromThresholds(THRESH.WR, wrSum);

      return { id: String(r.owner_id), qbGrade, rbGrade, wrGrade, teGrade };
    });

    const me = allTeams.find((t) => t.id === String(ownerId));
    if (!me) return { ready: false, items: [null, null, null] };

    // Best in league (strictly higher)
    const bestAt = (key) => allTeams.every((t) => t.id === me.id || me[key] > t[key]);

    // thresholds from your sheet (grades)
    const STRONG = 5.9;   // > 5.9  => strong
    const WEAK   = 6.0;   // < 6    => weak

    const strengths = [];
    const weaknesses = [];

    // WR
    if (bestAt('wrGrade')) strengths.push({ key: 'WR', label: 'Best WR Room In The League' });
    else if (me.wrGrade > STRONG) strengths.push({ key: 'WR', label: 'Strong WR Room' });
    else if (me.wrGrade < WEAK) weaknesses.push({ key: 'WR', label: 'Weak WR Room' });

    // RB
    if (bestAt('rbGrade')) strengths.push({ key: 'RB', label: 'Best RB Room In The League' });
    else if (me.rbGrade > STRONG) strengths.push({ key: 'RB', label: 'Strong RB Room' });
    else if (me.rbGrade < WEAK) weaknesses.push({ key: 'RB', label: 'Weak RB Room' });

    // TE
    if (bestAt('teGrade')) strengths.push({ key: 'TE', label: 'Best TE Room In The League' });
    else if (me.teGrade > STRONG) strengths.push({ key: 'TE', label: 'Strong TE Room' });
    else if (me.teGrade < WEAK) weaknesses.push({ key: 'TE', label: 'Weak TE Room' });

    // QB
    if (bestAt('qbGrade')) strengths.push({ key: 'QB', label: 'Best QB Room In The League' });
    else if (me.qbGrade > STRONG) strengths.push({ key: 'QB', label: 'Strong QB Room' });
    else if (me.qbGrade < WEAK) weaknesses.push({ key: 'QB', label: 'Weak QB Room' });

    // Don’t show both “Best” and “Strong” for same position
    const bestKeys = new Set(strengths.filter(s => s.label.startsWith('Best')).map(s => s.key));
    const dedupStrengths = strengths.filter(s => !(s.label.startsWith('Strong') && bestKeys.has(s.key)));

    // How many tags
    const wantStrengths = starCount >= 3 ? 2 : 1;
    const wantWeaknesses = starCount >= 3 ? 1 : 2;

    // Fallbacks
    const sFallback = ['Has Playmakers', 'Upside Depth'];
    const wFallback = ['Needs Depth', 'Injury Risk'];

    const S = dedupStrengths.map(s => s.label).slice(0, wantStrengths);
    const W = weaknesses.map(w => w.label).slice(0, wantWeaknesses);

    while (S.length < wantStrengths && sFallback.length) S.push(sFallback.shift());
    while (W.length < wantWeaknesses && wFallback.length) W.push(wFallback.shift());

    const items = (starCount >= 3)
      ? [
          { type: 'strength', color: 'green', label: S[0] },
          { type: 'strength', color: 'green', label: S[1] },
          { type: 'weakness', color: 'red',   label: W[0] },
        ]
      : [
          { type: 'strength', color: 'green', label: S[0] },
          { type: 'weakness', color: 'red',   label: W[0] },
          { type: 'weakness', color: 'red',   label: W[1] },
        ];

    return { ready: true, items };
  }, [rosters, ownerId, starCount]);

  // ---- overrides (slot-based) ----
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

  const items = useMemo(() => {
    const base = auto.items || [null, null, null];
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
