// /src/redraft/positional-grade/PositionalGrades.jsx
import React, { useMemo } from 'react';
import './positional-grade.css';
import gradeData from '../players/players-by-id.json.backup.1757645792240.json';

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

// Robust name normalizer (handles curly quotes & accents)
const normKey = (s) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[’‘]/g, "'")
    .replace(/[^a-z0-9']/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

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
        const k = normKey(row?.name);
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
        const pos = (Array.isArray(p.fantasy_positions) && p.fantasy_positions[0]) || p.position || '';
        const POS = String(pos).toUpperCase();

        const g = byId[pid] || byName.get(normKey(name)) || {};
        const isTravisHunter = normKey(name) === normKey('Travis Hunter');

        // Value from the unified JSON (domain values). Also accept legacy fields as fallback.
        const baseValue = firstNum(
          g.value,
          g[`${String(POS).toLowerCase()}_value`], // rb_value / wr_value if present
          g.score,
          g.points
        );

        // RB/WR value: include if position RB/WR OR if Travis Hunter (special case -> count with WR)
        const rbwrValue =
          (POS === 'RB' || POS === 'WR' || isTravisHunter) ? (baseValue ?? 0) : null;

        // TE value from te_value (or fallbacks)
        const teScore = POS === 'TE'
          ? firstNum(g.te_value, g.teValue, g.te, g.value, g.score)
          : null;

        // QB score from qb-score (or fallbacks)
        const qbScore = POS === 'QB'
          ? firstNum(g['qb-score'], g.qb_score, g.qbScore, g.qb_value, g.qb, g.value)
          : null;

        return {
          id: pid,
          name,
          position: POS,
          rbwrValue: rbwrValue ?? 0,
          teScore: teScore ?? null,
          qbScore: qbScore ?? null,
          countAsWR: POS === 'WR' || isTravisHunter, // ensure Hunter contributes to WR
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

    // RB / WR totals (sum of 'value')
    const rbTotal = allPlayers
      .filter(p => p.position === 'RB')
      .reduce((s, p) => s + (num(p.rbwrValue) || 0), 0);

    const wrTotal = allPlayers
      .filter(p => p.countAsWR)    // WRs + Travis Hunter override
      .reduce((s, p) => s + (num(p.rbwrValue) || 0), 0);

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
