// /src/redraft/draft-value/ManualDraftValueChart.jsx
import React, { useMemo } from 'react';
import DraftValueChart from './DraftValueChart';

/** "A.J. Brown WR PHI" -> "A.J. Brown" */
function stripPosTeamSuffix(s) {
  if (!s) return '';
  const val = String(s).trim();
  const m = val.match(/^(.*?)(?:\s+(QB|RB|WR|TE)\s+[A-Z]{2,4})$/i);
  return (m ? m[1] : val).trim();
}

/** normalize names for matching (remove dots, apostrophes, spaces; uppercase) */
function normName(s) {
  return (s || '')
    .toUpperCase()
    .replace(/[\.\'’`"-]/g, '')
    .replace(/\s+/g, '')
    .trim();
}

/** map display name -> playerId using playersById (prefer offense + has ADP) */
function findPlayerIdByName(playersById = {}, name = '') {
  const want = normName(stripPosTeamSuffix(name));
  if (!want) return null;

  let best = null;
  for (const [id, p] of Object.entries(playersById)) {
    const full = (p.full_name || `${p.first_name || ''} ${p.last_name || ''}`.trim()).trim();
    const n = normName(full);
    if (n !== want) continue;

    const pos = (Array.isArray(p.fantasy_positions) ? p.fantasy_positions[0] : p.position || '').toUpperCase();
    const adp = Number(p.adp_half_ppr ?? p.adp_ppr ?? p.adp ?? p.adp_full_ppr ?? p.adp_std);
    const hasADP = Number.isFinite(adp);
    const isOff = pos === 'QB' || pos === 'RB' || pos === 'WR' || pos === 'TE';
    const score = (isOff ? 2 : 0) + (hasADP ? 1 : 0);

    if (!best || score > best.score) {
      best = { id, adp, pos, score, full };
    }
  }
  return best ? best.id : null;
}

/**
 * Parse user-entered pick into an overall pick number.
 * Supports: "1.07" / "1-07" / "2:01" (round.pick), and "#5" or "5" (overall).
 */
function parsePickToOverall(input, teamsCount = 12) {
  if (input == null) return NaN;
  const s = String(input).trim();

  // "#5" or "5"
  let m = s.match(/^#?\s*(\d+)\s*$/);
  if (m) return Number(m[1]);

  // "1.07" | "1-7" | "2:01"
  m = s.match(/^\s*(\d+)\s*[.\-:xX]\s*(\d{1,2})\s*$/);
  if (m) {
    const round = Math.max(1, Number(m[1]));
    const pickInRound = Math.min(Math.max(1, Number(m[2])), Math.max(1, teamsCount));
    return (round - 1) * Math.max(1, teamsCount) + pickInRound;
  }
  return NaN;
}

/** Build the points array DraftValueChart expects from manual roster [{ name, pick }] */
function buildPointsFromManual(manual = [], playersById = {}, teamsCount = 12) {
  const pts = [];
  for (const r of manual) {
    const displayName = stripPosTeamSuffix(r?.name || '');
    if (!displayName) continue;

    const id = findPlayerIdByName(playersById, displayName);
    if (!id) continue;

    const p = playersById[id] || {};
    const adp = Number(p.adp_half_ppr ?? p.adp_ppr ?? p.adp ?? p.adp_full_ppr ?? p.adp_std);
    if (!Number.isFinite(adp)) continue;

    const overall = parsePickToOverall(r?.pick, teamsCount);
    if (!Number.isFinite(overall)) continue;

    const full = (p.full_name || `${p.first_name || ''} ${p.last_name || ''}`.trim()).trim() || displayName;
    const [first, ...rest] = full.trim().toUpperCase().split(/\s+/);
    const round = Math.max(1, Math.ceil(overall / Math.max(1, teamsCount)));

    pts.push({ id: String(id), first, last: rest.join(' '), overall, round, adp: Number(adp) });
  }
  return pts;
}

/** Wrapper: render DraftValueChart directly from manual roster + playersById. */
export default function ManualDraftValueChart({
  manualRoster = [],   // overrides?.manual?.roster -> [{ name, pick }]
  playersById = {},
  teamsCount = 12,
  width = 640,
  height = 340,
  ...chartProps        // pass-thru: axis styles, label sizes, etc.
}) {
  const points = useMemo(
    () => buildPointsFromManual(manualRoster, playersById, teamsCount),
    [manualRoster, playersById, teamsCount]
  );

  return (
    <DraftValueChart
      points={points}
      teamsCount={teamsCount}
      width={width}
      height={height}
      {...chartProps}
    />
  );
}
