// /src/redraft/draft-value/DraftValueChart.jsx
import React, { useMemo } from 'react';
import './draft-value.css';

const COLORS = {
  steal: '#60C08B', // diff > 3
  even:  '#F2B94B',
  reach: '#D84343', // diff < -3
  line:  '#6d6d6d'
};

export default function DraftValueChart({
  points = [],                   // [{ id, first, last, overall, round, adp }]
  lineup = [],
  pickByPlayerId = {},
  adpByPlayerId = {},
  teamsCount = 12,
  width = 640,
  height = 340,
  firstRoundOffsetPx = 10,
  labelFontSize = 17,
  minLabelFontSize = 7,

  // extra headroom above the top of the chart (in ADP units)
  yHeadroomADP = 12,

  /* Axis style controls (optional) */
  axisFontFamily = "'Acumin Variable Concept','Acumin Pro', Arial, sans-serif",
  axisFontWeight = 700,
  axisFontWidth = 78,
  axisColor = '#2D2D2C',
  axisTickSize = 18,
  axisTitleSize = 18,
}) {
  const ROUNDS_TO_SHOW = 10;

  // Build / normalize points (fallback from starters if not provided)
  const pts = useMemo(() => {
    let src = points;
    if (!src || !src.length) {
      src = [];
      for (const it of lineup) {
        const p = it?.player || {};
        const id = String(p?.player_id || p?.id || '');
        if (!id) continue;
        const pickObj = pickByPlayerId[id];
        const adp = adpByPlayerId[id];
        if (!pickObj || !Number.isFinite(pickObj.overall) || !Number.isFinite(adp)) continue;
        const full = p.full_name || `${p.first_name || ''} ${p.last_name || ''}`.trim() || '—';
        const [first, ...rest] = full.trim().toUpperCase().split(/\s+/);
        const overall = Number(pickObj.overall);
        const round = Math.max(1, Math.ceil(overall / Math.max(1, teamsCount)));
        src.push({ id, first, last: rest.join(' '), overall, round, adp: Number(adp) });
      }
    }

    return src
      .filter(d => Number.isFinite(d.overall) && Number.isFinite(d.adp))
      .map(d => {
        const diff = d.overall - d.adp;
        let color = COLORS.even;
        if (diff > 3) color = COLORS.steal;
        else if (diff < -3) color = COLORS.reach;
        return { ...d, diff, color };
      })
      .filter(d => d.round <= ROUNDS_TO_SHOW)
      .sort((a, b) => a.round - b.round || a.overall - b.overall);
  }, [points, lineup, pickByPlayerId, adpByPlayerId, teamsCount]);

  const svg = useMemo(() => {
    if (!pts.length) return null;

    // Bottom pad includes space for ticks + the "ROUND" title so it never clips
    const pad = {
      l: 54,
      b: Math.max(38, axisTickSize + axisTitleSize + 22),
      r: 18,
      t: 12
    };
    const W = width, H = height;

    // X-axis fixed to rounds 1..10
    const roundsShown = ROUNDS_TO_SHOW;
    const usableW = Math.max(1, (W - pad.l - pad.r - firstRoundOffsetPx));
    const denom = Math.max(1, roundsShown - 1);
    const xScale = (round) =>
      pad.l + firstRoundOffsetPx + ((round - 1) / denom) * usableW;
    const xTicks = Array.from({ length: roundsShown }, (_, i) => i + 1);

    // Y-axis: use the MAX ADP among players taken in rounds 1–10 (+ headroom)
    const maxAdpFirstTen = Math.max(...pts.map(p => Number(p.adp)));
    const yMax = Math.max(1, maxAdpFirstTen + yHeadroomADP);

    const yScale = (y) =>
      H - pad.b - (y / yMax) * (H - pad.t - pad.b);

    const yTicks = Array.from(
      { length: Math.floor(yMax / teamsCount) + 1 },
      (_, k) => k * teamsCount
    ).filter(v => v <= yMax);

    return { W, H, pad, xScale, yScale, xTicks, yTicks, yMax, roundsShown };
  }, [pts, width, height, teamsCount, firstRoundOffsetPx, yHeadroomADP, axisTickSize, axisTitleSize]);

  if (!svg) {
    return <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: width }}>
      No data for chart (need draft picks + ADP).
    </div>;
  }

  const { W, H, pad, xScale, yScale, xTicks, yTicks, roundsShown } = svg;

  // --- vertical collision-avoidance + edge-aware anchoring for labels ---
  const kChar = 0.62;
  const placed = [];
  const laidOut = pts.map((p) => {
    const cx = xScale(p.round);
    const cy = yScale(p.adp);

    // target sizes (last name bigger)
    let fs = labelFontSize;
    const lastSize = fs;
    const firstSize = Math.max(minLabelFontSize, Math.round(fs * 0.78));
    let lineH = Math.max( firstSize + 2, Math.round(fs * 0.85) );

    const lines = [p.first, p.last].filter(Boolean);
    // width estimate based on the largest line (for collision)
    let w = Math.max(...lines.map(s => s.length || 0)) * lastSize * kChar;
    let h = (lines.length === 2 ? firstSize + lineH : lastSize);

    // Default: above the dot
    let yTop = cy - 18 - h;

    const intersects = (a, b) =>
      !(a.x > b.x + b.w || a.x + a.w < b.x || a.y > b.y + b.h || a.y + a.h < b.y);

    let attempts = 0;
    while (placed.some(b => intersects({ x: cx - w / 2, y: yTop, w, h }, b))) {
      yTop -= lineH;
      attempts++;
      if (attempts > 12 && fs > minLabelFontSize) {
        fs -= 1;
        // recompute sizes
        const newLast = fs;
        const newFirst = Math.max(minLabelFontSize, Math.round(fs * 0.78));
        const newLineH = Math.max(newFirst + 2, Math.round(fs * 0.85));
        // update estimates
        lineH = newLineH;
        w = Math.max(...lines.map(s => s.length || 0)) * newLast * kChar;
        h = (lines.length === 2 ? newFirst + newLineH : newLast);
        attempts = 0;
      } else if (attempts > 24) {
        break;
      }
    }

    // Safety: if label would clip the top margin, place it below the dot
    if (yTop < pad.t + 2) {
      yTop = cy + 18;
    }

    // keep labels inside by shifting anchor near edges + small horizontal offset from the stem
    const offsetX = 8; // px
    let anchor = 'middle';
    let labelX = cx;
    let dx = 0;
    if (cx + w / 2 > W - pad.r - 2) { anchor = 'end';   dx = -offsetX; }
    if (cx - w / 2 < pad.l + 2)      { anchor = 'start'; dx =  offsetX; }

    placed.push({ x: cx - w / 2, y: yTop, w, h });
    return { p, cx, cy, yTop, fs, firstSize, lastSize, lineH, lines, anchor, labelX, dx };
  });

  const axisVars = {
    '--dv-axis-font': axisFontFamily,
    '--dv-axis-weight': axisFontWeight,
    '--dv-axis-wdth': axisFontWidth,
    '--dv-axis-color': axisColor,
    '--dv-tick-size': `${axisTickSize}px`,
    '--dv-title-size': `${axisTitleSize}px`,
  };

  return (
    <div className="draft-value">
      <svg className="dv-chart" width={W} height={H} style={{ ...axisVars, overflow: 'visible' }}>
        {/* X axis 1..10 */}
        <g className="dv-axis dv-axis-x">
          <line x1={pad.l} y1={H - pad.b} x2={W - pad.r} y2={H - pad.b} stroke={axisColor} strokeWidth="2" />
          {xTicks.map(v => (
            <g key={`tx-${v}`} transform={`translate(${xScale(v)}, ${H - pad.b})`}>
              <line y2="6" stroke={axisColor} />
              <text y="20" textAnchor="middle">{v}</text>
            </g>
          ))}
          {/* Title sits inside the reserved bottom pad so "ROUND" is always visible */}
          <text
            className="dv-axis-title"
            x={(W + pad.l) / 2}
            y={H - pad.b + axisTickSize + axisTitleSize}
            textAnchor="middle"
          >
            ROUND
          </text>
        </g>

        {/* Y axis with headroom */}
        <g className="dv-axis dv-axis-y">
          <line x1={pad.l} y1={H - pad.b} x2={pad.l} y2={pad.t} stroke={axisColor} strokeWidth="2" />
          {yTicks.map(v => (
            <g key={`ty-${v}`} transform={`translate(${pad.l}, ${yScale(v)})`}>
              <line x1="-6" x2="0" stroke={axisColor} />
              <text x="-10" dy="4" textAnchor="end">{v}</text>
            </g>
          ))}
          <text
            className="dv-axis-title"
            transform={`translate(16, ${(H - pad.b + pad.t) / 2}) rotate(-90)`}
            textAnchor="middle"
          >
            CONSENSUS ADP
          </text>
        </g>

        {/* dashed diagonal to end of R10 ideal ADP line */}
        <line
          x1={pad.l}
          y1={H - pad.b}
          x2={xScale(roundsShown)}
          y2={yScale(roundsShown * teamsCount)}
          stroke="#9aa0a6"
          strokeOpacity="0.55"
          strokeWidth="2"
          strokeDasharray="6 6"
        />

        {/* points + labels */}
        {laidOut.map(({ p, cx, cy, yTop, firstSize, lastSize, lineH, lines, anchor, labelX, dx }) => (
          <g key={`${p.id}-${p.overall}`}>
            <line x1={cx} y1={H - pad.b} x2={cx} y2={cy} stroke={COLORS.line} strokeWidth="2" />
            <circle cx={cx} cy={cy} r="8" fill={p.color} stroke="#2D2D2C" strokeWidth="2" />

            {/* Pretty stacked label with white halo and subtle spacing */}
            <text
              x={labelX}
              y={yTop + firstSize}
              textAnchor={anchor}
              fill="#2D2D2C"
              style={{
                fontFamily: 'Prohibition, sans-serif',
                paintOrder: 'stroke',
                stroke: '#ffffff',
                strokeWidth: 3,
                strokeLinejoin: 'round',
                letterSpacing: 0.3
              }}
            >
              {/* first name smaller */}
              {lines[0] && (
                <tspan
                  x={labelX}
                  dx={dx}
                  fontSize={firstSize}
                  fontWeight={700}
                >
                  {lines[0]}
                </tspan>
              )}
              {/* last name larger, below */}
              {lines[1] && (
                <tspan
                  x={labelX}
                  dx={dx}
                  dy={lineH}
                  fontSize={lastSize}
                  fontWeight={900}
                >
                  {lines[1]}
                </tspan>
              )}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
