import React, { useMemo, useEffect } from 'react';
import './stars.css';
import starFilled from './stars-images/star_filled.png';
import starUnfilled from './stars-images/star_unfilled.png';
import gradeData from '../players/players-by-id.json';

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

function bin(thresholds, value) {
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (value >= thresholds[i]) return i + 1; // 1..10
  }
  return 1;
}

// Sheet logic:
// 5★: avg > 7.9
// 4★: 5.9 < avg < 8
// 3★: 4.9 < avg < 6
// 2★: 2.9 < avg < 5
// 1★: avg < 3
function avgToStars(avg) {
  if (avg > 7.9) return 5;
  if (avg > 5.9 && avg < 8) return 4;
  if (avg > 4.9 && avg < 6) return 3;
  if (avg > 2.9 && avg < 5) return 2;
  if (avg < 3) return 1;
  return 1;
}

const clamp15 = (n) => Math.max(1, Math.min(5, n));

/**
 * Props:
 * - settings, rosterIds, playersById
 * - onStarsChange?: (stars, avg) => void
 * - forcedStars?: number   // NEW: override
 */
export default function Stars({
  settings,
  rosterIds = [],
  playersById = {},
  onStarsChange,
  forcedStars, // NEW
}) {
  // Auto-computed result (unchanged logic)
  const auto = useMemo(() => {
    if (!settings || !rosterIds.length) return null;

    const all = rosterIds
      .map(id => playersById[id])
      .filter(Boolean)
      .map(p => {
        const pid = String(p.player_id || p.id);
        const g = gradeData[pid] || {};
        return {
          position: Array.isArray(p.fantasy_positions) ? p.fantasy_positions[0] : p.position,
          value: typeof g.value === 'number' ? g.value : 0,
          te_value: typeof g.te_value === 'number' ? g.te_value : null,
        };
      });

    const isSF =
      settings?.flex_qb === 1 ||
      settings?.positions?.sf > 0 ||
      settings?.positions?.superflex > 0;
    const mode = isSF ? 'SF' : '1QB';

    const sumPos = pos =>
      all
        .filter(x => x.position === pos)
        .reduce((s, x) => s + (pos === 'TE' && x.te_value != null ? x.te_value : (x.value || 0)), 0);

    const totals = { QB: sumPos('QB'), RB: sumPos('RB'), WR: sumPos('WR'), TE: sumPos('TE') };
    const grades = {
      QB: bin(gradeMatrix[mode].QB, totals.QB),
      RB: bin(gradeMatrix[mode].RB, totals.RB),
      WR: bin(gradeMatrix[mode].WR, totals.WR),
      TE: bin(gradeMatrix[mode].TE, totals.TE),
    };
    const avg = (grades.QB + grades.RB + grades.WR + grades.TE) / 4;
    const stars = avgToStars(avg);
    return { stars, avg };
  }, [settings, rosterIds, playersById]);

  // Decide what to show: forced override wins, otherwise auto
  const displayStars = Number.isFinite(forcedStars)
    ? clamp15(Number(forcedStars))
    : (auto ? auto.stars : null);

  // Notify parent
  useEffect(() => {
    if (!onStarsChange) return;
    if (displayStars == null) return;
    onStarsChange(displayStars, auto?.avg ?? null);
  }, [displayStars, auto?.avg, onStarsChange]);

  if (displayStars == null) return null;

  return (
    <div
      className="stars-section"
      title={
        auto?.avg != null
          ? `Final Verdict: ${displayStars} stars (avg ${auto.avg.toFixed(2)})`
          : `Final Verdict: ${displayStars} stars`
      }
    >
      <div className="stars-row">
        {Array.from({ length: displayStars }).map((_, i) => (
          <img key={`f-${i}`} className="star" src={starFilled} alt="filled star" />
        ))}
        {Array.from({ length: 5 - displayStars }).map((_, i) => (
          <img key={`u-${i}`} className="star" src={starUnfilled} alt="unfilled star" />
        ))}
      </div>
    </div>
  );
}
