// /src/redraft/positional-grade/PositionalGrades.jsx
import React, { useMemo } from 'react';
import './positional-grade.css';
import gradeData from '../players/players-by-id.json';

const gradeMatrix = {
  SF:   { QB:[1,2,3,4,5,6,7,8,9,10], RB:[10,25,50,75,100,125,140,165,180,200], WR:[20,50,70,90,110,130,160,200,250,300], TE:[1,2,3,4,5,6,7,8,9,10] },
  '1QB':{ QB:[1,2,3,4,5,6,7,8,9,10], RB:[10,25,50,75,100,125,140,165,180,200], WR:[20,50,70,90,110,130,160,200,250,300], TE:[1,2,3,4,5,6,7,8,9,10] },
};

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};
const firstNum = (...vals) => {
  for (const v of vals) { const n = num(v); if (n !== null) return n; }
  return null;
};
const normName = (s) => String(s || '').trim().toUpperCase().replace(/\s+/g,' ');

function getGrade(thresholds, value) {
  for (let i = thresholds.length - 1; i >= 0; i--) if (value >= thresholds[i]) return i + 1;
  return 1;
}
const clamp10 = (n) => Math.max(0, Math.min(10, n));

function GradeRow({ label, grade, posClass }) {
  const percent = Math.max(0, Math.min(100, (grade / 10) * 100));
  return (
    <div className="grade-row">
      <div className="grade-label">{label}</div>
      <div className="grade-bar-wrapper" style={{ '--pct': grade / 10 }}>
        <div className={`grade-bar-fill ${posClass}-fill`} style={{ width: `${percent}%` }} />
      </div>
      <div className="grade-score">{grade}/10</div>
    </div>
  );
}

/**
 * Props:
 * - settings: { positions: { qb, rb, wr, te, ... }, flex_qb?: 0|1 }
 * - rosterIds: string[]
 * - playersById: Record<string, any>
 * - isSF?: boolean
 * - forcedGrades?: { QB?: number, RB?: number, WR?: number, TE?: number }
 */
export default function PositionalGrades({
  settings,
  rosterIds = [],
  playersById = {},
  isSF,
  forcedGrades,
}) {
  const auto = useMemo(() => {
    // Build grade indexes: by id and by normalized name
    const byId = gradeData || {};
    const byName = (() => {
      const map = new Map();
      for (const [gid, row] of Object.entries(byId)) {
        const k = normName(row?.name);
        if (k && !map.has(k)) map.set(k, row);
      }
      return map;
    })();

    // Collect roster players with merged grade fields
    const allPlayers = (rosterIds || [])
      .map((id) => playersById[id])
      .filter(Boolean)
      .map((p) => {
        const pid = String(p.player_id || p.id);
        const name = p.full_name || `${p.first_name || ''} ${p.last_name || ''}`.trim();
        const pos = Array.isArray(p.fantasy_positions) ? p.fantasy_positions[0] : p.position;

        const g = byId[pid] || byName.get(normName(name)) || {};

        // RB/WR: legacy 'value', but accept rb_value/wr_value/score
        const rbwrValue =
          pos === 'RB' || pos === 'WR'
            ? firstNum(g.value, g[`${String(pos).toLowerCase()}_value`], g.score, g.points)
            : null;

        // TE: te_value/teValue/te/value/score
        const teScore = pos === 'TE'
          ? firstNum(g.te_value, g.teValue, g.te, g.value, g.score)
          : null;

        // QB: qb-score/qb_score/qbScore/qb_value/qb/value (last is a fallback)
        const qbScore = pos === 'QB'
          ? firstNum(g['qb-score'], g.qb_score, g.qbScore, g.qb_value, g.qb, g.value)
          : null;

        return {
          id: pid,
          name,
          position: pos,
          rbwrValue: rbwrValue ?? 0,
          teScore: teScore ?? null,
          qbScore: qbScore ?? null,
        };
      });

    const detectSF =
      typeof isSF === 'boolean'
        ? isSF
        : (settings && (settings.flex_qb === 1 || settings.positions?.sf > 0)) || false;
    const mode = detectSF ? 'SF' : '1QB';

    const topPlusHalfSecond = (arr) => {
      if (!arr.length) return 0;
      const sorted = arr.slice().sort((a, b) => b - a);
      return (sorted[0] ?? 0) + 0.5 * (sorted[1] ?? 0);
    };

    // QB
    const qbScores = allPlayers.filter(p => p.position === 'QB' && p.qbScore !== null).map(p => p.qbScore);
    const qbGrade = Math.round(clamp10(topPlusHalfSecond(qbScores)));

    // TE
    const teScores = allPlayers.filter(p => p.position === 'TE' && p.teScore !== null).map(p => p.teScore);
    const teGrade = Math.round(clamp10(topPlusHalfSecond(teScores)));

    // RB / WR thresholds (sum)
    const rbTotal = allPlayers.filter(p => p.position === 'RB').reduce((s, p) => s + (num(p.rbwrValue) || 0), 0);
    const wrTotal = allPlayers.filter(p => p.position === 'WR').reduce((s, p) => s + (num(p.rbwrValue) || 0), 0);

    return {
      grades: {
        QB: qbGrade,
        RB: getGrade(gradeMatrix[mode].RB, rbTotal),
        WR: getGrade(gradeMatrix[mode].WR, wrTotal),
        TE: teGrade,
      },
    };
  }, [settings, rosterIds, playersById, isSF]);

  const grades = useMemo(
    () => ({
      QB: Number.isFinite(forcedGrades?.QB) ? Math.round(clamp10(forcedGrades.QB)) : auto.grades.QB,
      RB: Number.isFinite(forcedGrades?.RB) ? Math.round(clamp10(forcedGrades.RB)) : auto.grades.RB,
      WR: Number.isFinite(forcedGrades?.WR) ? Math.round(clamp10(forcedGrades.WR)) : auto.grades.WR,
      TE: Number.isFinite(forcedGrades?.TE) ? Math.round(clamp10(forcedGrades.TE)) : auto.grades.TE,
    }),
    [forcedGrades, auto]
  );

  return (
    <div className="positional-grades">
      <GradeRow label="QB" grade={grades.QB} posClass="qb" />
      <GradeRow label="RB" grade={grades.RB} posClass="rb" />
      <GradeRow label="WR" grade={grades.WR} posClass="wr" />
      <GradeRow label="TE" grade={grades.TE} posClass="te" />
    </div>
  );
}
