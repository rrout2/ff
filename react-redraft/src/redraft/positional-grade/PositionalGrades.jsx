import React, { useMemo } from 'react';
import './positional-grade.css';
import gradeData from '../players/players-by-id.json'; // merged fields

const gradeMatrix = {
  SF: {
    QB: [4, 10, 20, 30, 40, 50, 60, 66, 74, 80],
    RB: [10, 25, 50, 75, 100, 125, 140, 165, 180, 200],
    WR: [20, 50, 70, 90, 110, 130, 160, 200, 250, 300],
    TE: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  '1QB': {
    QB: [2, 5, 10, 15, 20, 25, 30, 33, 37, 40],
    RB: [10, 25, 50, 75, 100, 125, 140, 165, 180, 200],
    WR: [20, 50, 70, 90, 110, 130, 160, 200, 250, 300],
    TE: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
};

function getGrade(thresholds, value) {
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (value >= thresholds[i]) return i + 1;
  }
  return 1;
}

function clamp10(n) {
  return Math.max(0, Math.min(10, n));
}

function GradeRow({ label, grade, posClass }) {
  const percent = Math.max(0, Math.min(100, (grade / 10) * 100));
  return (
    <div className="grade-row">
      <div className="grade-label">{label}</div>
      <div className="grade-bar-wrapper">
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
 * - isSF?: boolean (optional override)
 * - forcedGrades?: { QB?: number, RB?: number, WR?: number, TE?: number }  // NEW
 */
export default function PositionalGrades({
  settings,
  rosterIds = [],
  playersById = {},
  isSF,
  forcedGrades, // NEW
}) {
  // --- Auto computation (unchanged) ---
  const auto = useMemo(() => {
    // Normalize + merge grade data by id
    const allPlayers = (rosterIds || [])
      .map((id) => playersById[id])
      .filter(Boolean)
      .map((p) => {
        const id = String(p.player_id || p.id);
        const g = gradeData[id] || {};
        return {
          id,
          name: p.full_name || `${p.first_name || ''} ${p.last_name || ''}`.trim(),
          position: Array.isArray(p.fantasy_positions) ? p.fantasy_positions[0] : p.position,
          value: typeof g.value === 'number' ? g.value : 0,
          te_value: typeof g.te_value === 'number' ? g.te_value : null,
        };
      });

    const detectSF =
      typeof isSF === 'boolean'
        ? isSF
        : (settings && (settings.flex_qb === 1 || settings.positions?.sf > 0)) || false;
    const mode = detectSF ? 'SF' : '1QB';

    // Sum scores across the FULL ROSTER per position (no starter cap)
    const sumPos = (pos) =>
      allPlayers
        .filter((p) => p.position === pos)
        .reduce((s, p) => {
          if (pos === 'TE' && typeof p.te_value === 'number') return s + p.te_value;
          return s + (p.value || 0);
        }, 0);

    const totals = {
      QB: sumPos('QB'),
      RB: sumPos('RB'),
      WR: sumPos('WR'),
      TE: sumPos('TE'),
    };

    const grades = {
      QB: getGrade(gradeMatrix[mode].QB, totals.QB),
      RB: getGrade(gradeMatrix[mode].RB, totals.RB),
      WR: getGrade(gradeMatrix[mode].WR, totals.WR),
      TE: getGrade(gradeMatrix[mode].TE, totals.TE),
    };

    return { grades };
  }, [settings, rosterIds, playersById, isSF]);

  // --- Final grades shown: overrides layered field-by-field (no visual change) ---
  const grades = useMemo(() => ({
    QB: Number.isFinite(forcedGrades?.QB) ? Math.round(clamp10(forcedGrades.QB)) : auto.grades.QB,
    RB: Number.isFinite(forcedGrades?.RB) ? Math.round(clamp10(forcedGrades.RB)) : auto.grades.RB,
    WR: Number.isFinite(forcedGrades?.WR) ? Math.round(clamp10(forcedGrades.WR)) : auto.grades.WR,
    TE: Number.isFinite(forcedGrades?.TE) ? Math.round(clamp10(forcedGrades.TE)) : auto.grades.TE,
  }), [forcedGrades, auto]);

  return (
    <div className="positional-grades">
      <GradeRow label="QB" grade={grades.QB} posClass="qb" />
      <GradeRow label="RB" grade={grades.RB} posClass="rb" />
      <GradeRow label="WR" grade={grades.WR} posClass="wr" />
      <GradeRow label="TE" grade={grades.TE} posClass="te" />
    </div>
  );
}
