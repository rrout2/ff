// /src/redraft/four-factors/upsideCells.js
// Implements the Excel cells S5..S15 as plain JS, using your existing lineup/starters.
// Inputs:
//   settings, rosterIds, playersById, lineup, gradeData
// Optional:
//   calibration: min/max ranges for mapping S5..S8 -> S9..S12 (by FLEX bucket)
//   weights: { starterWeight (O15), rwWeight (O17) }
//
// Returns: { S5..S15 plus breakdowns }

const num = (x) => (Number.isFinite(+x) ? +x : null);
const clamp = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
const mean = (arr) => {
  const v = arr.map(num).filter((n) => Number.isFinite(n));
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null;
};
const getId   = (p) => String(p?.player_id || p?.id || '');
const getPos  = (p) => (Array.isArray(p?.fantasy_positions) ? p.fantasy_positions[0] : p?.position || '').toUpperCase();
const getTeam = (p) => (p?.team || p?.pro_team || p?.team_abbr || '').toUpperCase();
const nC2     = (n) => (n >= 2 ? (n * (n - 1)) / 2 : 0);

const mapMinMaxToInt = (val, min, max) => {
  const v = num(val);
  if (!Number.isFinite(v) || !Number.isFinite(min) || !Number.isFinite(max) || max <= min) return 5;
  const z = (v - min) / (max - min);  // 0..1
  return Math.round(clamp(1 + 9 * z, 1, 10));
};

// Default ranges — replace with your sheet’s “Calibration Ranges”
const DEFAULT_CALIBRATION = {
  '1': { // 1 FLEX  (min B4:B7, max C4:C7)
    S5: { min: 3.0, max: 9.0 },
    S6: { min: 2.5, max: 8.5 },
    S7: { min: 3.0, max: 9.0 },
    S8: { min: 2.0, max: 7.5 },
  },
  '2': { // 2 FLEX  (min F4:F7, max G4:G7)
    S5: { min: 3.0, max: 9.0 },
    S6: { min: 2.5, max: 8.5 },
    S7: { min: 3.0, max: 9.0 },
    S8: { min: 2.0, max: 7.5 },
  },
  '3+': { // 3+ FLEX (min J4:J7, max K4:K7)
    S5: { min: 3.0, max: 9.0 },
    S6: { min: 2.5, max: 8.5 },
    S7: { min: 3.0, max: 9.0 },
    S8: { min: 2.0, max: 7.5 },
  },
};

// Pull a player's "Upside" value from your grade data.
const getUpsideVal = (gradeData, pid) => {
  const g = gradeData?.[String(pid)] || {};
  return num(
    g['four-factor-upside'] ??
    g.upside ??
    g.Upside ??
    g['Upside Score'] ??
    null
  );
};

export function computeUpsideCells({
  settings,
  rosterIds = [],
  playersById = {},
  lineup = [],          // array of { slot, player }
  gradeData = {},
  calibration = DEFAULT_CALIBRATION,
  weights = { starterWeight: 0.8, rwWeight: 0.75 }, // O15, O17
}) {
  const O15 = num(weights?.starterWeight) ?? 0.8;   // starter vs bench
  const O17 = num(weights?.rwWeight) ?? 0.75;       // RB/WR vs QB/TE

  // Normalize roster (all drafted players)
  const roster = (rosterIds || [])
    .map((id) => playersById[id])
    .filter(Boolean)
    .map((p) => ({ id: getId(p), pos: getPos(p), team: getTeam(p) }));

  // Normalize lineup (your chosen starters)
  const starters = (lineup || [])
    .map((it) => ({
      id: getId(it?.player),
      slot: String(it?.slot || '').toUpperCase(),   // QB/RB/WR/TE/FLEX
      basePos: getPos(it?.player),
      team: getTeam(it?.player),
    }))
    .filter((s) => s.id);

  // FLEX bucket for calibration selection
  const flexCt  = Number(settings?.positions?.flex ?? 0);
  const flexKey = flexCt <= 1 ? '1' : flexCt === 2 ? '2' : '3+';
  const cal     = calibration[flexKey] || calibration['2'];

  // ----- S5: Starter RB/WR Upside -----
  // "Starter" RB/WR = lineup RB/WR, plus FLEX that are RB/WR
  const startRBWR = starters.filter(
    (s) => s.basePos === 'RB' || s.basePos === 'WR' || (s.slot === 'FLEX' && (s.basePos === 'RB' || s.basePos === 'WR'))
  );
  const S5 = mean(startRBWR.map((s) => getUpsideVal(gradeData, s.id)));

  // ----- S6: Bench RB/WR Upside -----
  const startRBWRIds = new Set(startRBWR.map((s) => s.id));
  const benchRBWR = roster.filter(
    (r) => (r.pos === 'RB' || r.pos === 'WR') && !startRBWRIds.has(r.id)
  );
  const S6 = mean(benchRBWR.map((r) => getUpsideVal(gradeData, r.id)));

  // ----- S7: Starter QB/TE Upside -----
  const startQB = starters.find((s) => s.basePos === 'QB');
  const startTE = starters.find((s) => s.basePos === 'TE');
  const S7 = mean([startQB?.id, startTE?.id].filter(Boolean).map((id) => getUpsideVal(gradeData, id)));

  // ----- S8: Bench QB/TE Upside -----
  const exclude = new Set([startQB?.id, startTE?.id].filter(Boolean));
  const benchQBTE = roster.filter(
    (r) => (r.pos === 'QB' || r.pos === 'TE') && !exclude.has(r.id)
  );
  let S8 = mean(benchQBTE.map((r) => getUpsideVal(gradeData, r.id)));
  if (!Number.isFinite(S8)) {
    // Fallback: average of calibration S8 min/max
    const m = cal?.S8?.min ?? 3.5;
    const M = cal?.S8?.max ?? 7.5;
    S8 = (m + M) / 2;
  }

  // ----- S9..S12: Min-Max mapped to 1..10 -----
  const S9  = mapMinMaxToInt(S5, cal?.S5?.min, cal?.S5?.max); // Starter RB/WR
  const S10 = mapMinMaxToInt(S6, cal?.S6?.min, cal?.S6?.max); // Bench RB/WR
  const S11 = mapMinMaxToInt(S7, cal?.S7?.min, cal?.S7?.max); // Starter QB/TE
  const S12 = mapMinMaxToInt(S8, cal?.S8?.min, cal?.S8?.max); // Bench  QB/TE

  // ----- S13: Number of QB stacks (QB + WR/TE same NFL team) -----
  const teamsQBs = new Map();
  const teamsPassCatch = new Map();
  for (const r of roster) {
    if (!r.team) continue;
    if (r.pos === 'QB') teamsQBs.set(r.team, (teamsQBs.get(r.team) || 0) + 1);
    if (r.pos === 'WR' || r.pos === 'TE') {
      teamsPassCatch.set(r.team, (teamsPassCatch.get(r.team) || 0) + 1);
    }
  }
  let S13 = 0;
  for (const [team, q] of teamsQBs.entries()) {
    S13 += q * (teamsPassCatch.get(team) || 0);
  }

  // ----- S14: Number of same-team WR pairs -----
  const teamWRCounts = new Map();
  for (const r of roster) {
    if (r.pos !== 'WR' || !r.team) continue;
    teamWRCounts.set(r.team, (teamWRCounts.get(r.team) || 0) + 1);
  }
  let S14 = 0;
  for (const [, n] of teamWRCounts.entries()) S14 += nC2(n);

  // ----- S15: Final Upside Score (clamped 1..10) -----
  // Excel: =ROUND( O15*O17*S9 + (1-O15)*O17*S10 + O15*(1-O17)*S11 + (1-O15)*(1-O17)*S12 + 0.5*S13 - 0.5*S14 , 0)
  const combo =
    (O15 * O17)         * S9  +
    ((1 - O15) * O17)   * S10 +
    (O15 * (1 - O17))   * S11 +
    ((1 - O15) * (1 - O17)) * S12;

  const S15 = clamp(Math.round(combo + 0.5 * S13 - 0.5 * S14), 1, 10);

  return {
    // Raw (pre-mapping) like your S5..S8
    S5, S6, S7, S8,
    // Mapped integers S9..S12
    S9, S10, S11, S12,
    // Stacks / same-team WRs
    S13, S14,
    // Final Upside
    S15,
    meta: {
      flexCount: flexCt,
      weights: { O15, O17 },
      usedCalibration: cal,
    },
  };
}
