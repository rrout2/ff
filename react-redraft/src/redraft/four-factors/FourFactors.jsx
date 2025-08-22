import React, { useMemo, useEffect } from 'react';
import './four-factors.css';
import gradeData from '../players/players-by-id.json';
import DonutProgress from './DonutProgress';

// PNG icons for each factor
import UpsideImg from './images/Upside.png';
import ReliabilityImg from './images/Reliability.png';
import DepthImg from './images/Depth.png';
import RiskImg from './images/Risk.png';

const clamp10 = (n) => Math.max(0, Math.min(10, n));
const avg = (arr) => {
  const vals = arr.filter((v) => Number.isFinite(v));
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
};
const getId = (p) => String(p?.player_id || p?.id || '');

const RING = {
  upside:      '#F28C2E',
  reliability: '#55C3C8',
  depth:       '#60C08B',
  risk:        '#D84343',
};

const ICON = {
  upside: UpsideImg,
  reliability: ReliabilityImg,
  depth: DepthImg,
  risk: RiskImg,
};

export default function FourFactors({
  settings,
  rosterIds = [],
  playersById = {},
  lineup = [],
  useBenchForDepth = true,
  /** optional overrides: { upside, reliability, depth, risk } */
  forcedScores,
  /** notify parent when displayed scores change */
  onScoresChange,
}) {
  // --- Auto baseline from your data (unchanged logic) ---
  const autoGrades = useMemo(() => {
    const all = (rosterIds || [])
      .map((id) => playersById[id])
      .filter(Boolean)
      .map((p) => {
        const id = getId(p);
        const g = gradeData[id] || {};
        return {
          id,
          position: Array.isArray(p.fantasy_positions) ? p.fantasy_positions[0] : p.position,
          team: p.team || '',
          up: g['four-factor-upside'] ?? null,
          floor: g['four-factor-floor'] ?? null,
          risk: g['four-factor-risk'] ?? null,
          overall: g['four-factor-overall'] ?? null,
        };
      });

    const starterIds = new Set((lineup || []).map((it) => getId(it?.player)).filter(Boolean).map(String));
    const starters = all.filter((p) => starterIds.has(String(p.id)));
    const bench = all.filter((p) => !starterIds.has(String(p.id)));

    const upside = clamp10(avg(starters.map((p) => p.up)));
    const reliability = clamp10(avg(starters.map((p) => p.floor)));
    const risk = clamp10(avg(starters.map((p) => p.risk)));
    const depth = clamp10(useBenchForDepth ? avg(bench.map((p) => p.overall)) : avg(starters.map((p) => p.overall)));

    return {
      upside: Math.round(upside),
      reliability: Math.round(reliability),
      depth: Math.round(depth),
      risk: Math.round(risk),
    };
  }, [settings, rosterIds, playersById, lineup, useBenchForDepth]);

  // --- Final scores shown: overrides layered on top of auto, field-by-field ---
  const grades = useMemo(() => ({
    upside:      Number.isFinite(forcedScores?.upside)      ? clamp10(Math.round(forcedScores.upside))      : autoGrades.upside,
    reliability: Number.isFinite(forcedScores?.reliability) ? clamp10(Math.round(forcedScores.reliability)) : autoGrades.reliability,
    depth:       Number.isFinite(forcedScores?.depth)       ? clamp10(Math.round(forcedScores.depth))       : autoGrades.depth,
    risk:        Number.isFinite(forcedScores?.risk)        ? clamp10(Math.round(forcedScores.risk))        : autoGrades.risk,
  }), [forcedScores, autoGrades]);

  // Notify parent so RosterTag stays in sync
  useEffect(() => {
    onScoresChange?.(grades);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [grades.upside, grades.reliability, grades.depth, grades.risk]);

  const Card = ({ cls, label, value, sub, desc, bg }) => (
    <div className={`factor-card ${cls}`} style={{ background: bg }}>
      <div className="factor-top">
        <DonutProgress
          value={value}
          size={128}
          thickness={14}
          color={RING[cls]}
          trackColor="#e9e9e9"
          showOutline={false}
          center={
            <img
              src={ICON[cls]}
              alt=""
              style={{ width: 56, height: 56, objectFit: 'contain', pointerEvents: 'none' }}
            />
          }
        />
      </div>

      <div className="factor-body">
        <div className="factor-score">{label}: {value}/10</div>
        <div className="factor-sub">“{sub}”</div>
        <div className="factor-desc">{desc}</div>
      </div>
    </div>
  );

  return (
    <div className="four-factors">
      <div className="factor-cards">
        <Card
          cls="upside" bg="#f4cfb3"
          label="UPSIDE SCORE" value={grades.upside}
          sub="Can this team explode?"
          desc="Measures big-play ability, breakout potential, high-ceiling players, and stack/tier-breaking combos."
        />
        <Card
          cls="reliability" bg="#cfecee"
          label="RELIABILITY SCORE" value={grades.reliability}
          sub="Can I count on this roster?"
          desc="Focuses on injury history, consistency, role security, and number of plug-and-play guys."
        />
        <Card
          cls="depth" bg="#cfead6"
          label="DEPTH SCORE" value={grades.depth}
          sub="Will this team survive?"
          desc="Looks at viable backups, flex options, bench upside, and bye-week coverage."
        />
        <Card
          cls="risk" bg="#efd6bb"
          label="RISK PROFILE" value={grades.risk}
          sub="Will this roster implode?"
          desc="Accounts for volatility, construction flaws, overreliance on fragile players, or all-in builds."
        />
      </div>
    </div>
  );
}
