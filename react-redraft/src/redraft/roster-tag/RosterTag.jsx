import React, { useMemo, useLayoutEffect, useRef, useState } from 'react';
import './roster-tag.css';
import TagIcon from './roster-tag-images/tag.png';

/* thresholds & rules */
const DEFAULT_THRESHOLDS = { high: 7, low: 4 };
const RULES = [
  { id: 'juggernaut', label: 'THE JUGGERNAUT',  wants: { upside: 'high', reliability: 'high', depth: 'high', risk: 'low' } },
  { id: 'riskit',     label: 'RISK IT FOR BISKIT', wants: { upside: 'high', risk: 'high' } },
  { id: 'star',       label: 'STAR STUDDED',       wants: { upside: 'high', depth: 'low' } },
  { id: 'safe',       label: 'SAFE AND SOUND',     wants: { reliability: 'high', risk: '!high', upside: '!high' } },
  { id: 'mariana',    label: 'MARIANA TRENCH',     wants: { depth: 'high', risk: '!high', upside: '!high' } },
  { id: 'witu',       label: 'WI TU LO',           wants: { upside: 'low', reliability: 'low', depth: 'low' } },
];

function bucketize(scores, { high, low }) {
  const to = n => (n > high ? 'high' : n < low ? 'low' : 'mid');
  return {
    upside: to(scores.upside),
    reliability: to(scores.reliability),
    depth: to(scores.depth),
    risk: to(scores.risk),
  };
}
function scoreRule(levels, wants) {
  let s = 0;
  for (const [k, want] of Object.entries(wants)) {
    const have = levels[k];
    if (want === 'high' || want === 'mid' || want === 'low') {
      if (have === want) s += 3;
      else if (want !== 'mid' && have === 'mid') s += 1;
      else s -= 2;
    } else if (want === '!high') s += have !== 'high' ? 1 : -2;
    else if (want === '!low')   s += have !== 'low'  ? 1 : -1;
  }
  if (wants.upside === 'high'      && levels.upside === 'high')      s += 1;
  if (wants.reliability === 'high' && levels.reliability === 'high') s += 1;
  if (wants.depth === 'high'       && levels.depth === 'high')       s += 1;
  if (wants.risk === 'low'         && levels.risk === 'low')         s += 1;
  return s;
}
export function assignRosterTag(scores, thresholds = DEFAULT_THRESHOLDS, rules = RULES) {
  const levels = bucketize(scores, thresholds);
  let best = rules[0], bestScore = -Infinity;
  for (const r of rules) {
    const s = scoreRule(levels, r.wants || {});
    if (s > bestScore) { bestScore = s; best = r; }
  }
  return { id: best.id, label: best.label, levels };
}

/**
 * Roster tag pill w/ arrow icon.
 * - No gray box behind the arrow (icon only).
 * - Text auto-fits to fill both width and height.
 * - Uses Prohibition Regular (loaded via fonts.css).
 */
export default function RosterTag({
  scores = { upside: 5, reliability: 5, depth: 5, risk: 5 },
  thresholds = DEFAULT_THRESHOLDS,
  prefix = 'ROSTER TAG:',
  width = 720,
  height = 90,
  fontSize = 68,       // bigger base; we'll scale precisely

  insetLeft = 72,      // only the icon now; no gray box
  insetRight = 24,

  arrowLeft = 28,
  arrowSize = 28,      // icon size
  radius = 28,

  bgColor = '#badbb4',
  textColor = '#2D2D2C',
  borderWidth = 0,
  borderColor = '#2D2D2C',

  className = '',
  overrideTag,
}) {
  const computed = useMemo(() => assignRosterTag(scores, thresholds), [scores, thresholds]);
  const label = (typeof overrideTag === 'string' && overrideTag.trim())
    ? overrideTag.trim()
    : computed.label;

  const wrapRef = useRef(null);
  const textRef = useRef(null);
  const [scale, setScale] = useState(1);

  // Auto-fit to BOTH width and height of the pill
  useLayoutEffect(() => {
    const txt  = textRef.current;
    if (!txt) return;

    const availableW = width - insetLeft - insetRight;
    const availableH = height * 0.72;          // keep a little breathing room

    // reset to measure "natural" size at base font
    const prevTransform = txt.style.transform;
    const prevSize = txt.style.setProperty('--rt-font-size', `${fontSize}px`);
    txt.style.transform = 'translateY(-50%) scale(1)';

    // measure
    const naturalW = txt.scrollWidth || 1;
    const naturalH = txt.getBoundingClientRect().height || 1;

    // compute scales; cap at 1 so we don't upscale if not needed
    const scaleW = Math.min(1, availableW / naturalW);
    const scaleH = Math.min(1, availableH / naturalH);
    const next = Math.min(scaleW, scaleH);

    setScale(next);

    // restore transform (actual transform uses CSS var below)
    txt.style.transform = prevTransform;
  }, [label, width, insetLeft, insetRight, height, fontSize]);

  return (
    <div
      ref={wrapRef}
      className={`roster-tag-wrap ${className}`}
      style={{
        '--rt-width': `${width}px`,
        '--rt-height': `${height}px`,
        '--rt-font-size': `${fontSize}px`,
        '--rt-inset-left': `${insetLeft}px`,
        '--rt-inset-right': `${insetRight}px`,
        '--rt-scale': scale,

        '--rt-radius': `${radius}px`,
        '--rt-bg': bgColor,
        '--rt-text': textColor,
        '--rt-border-w': `${borderWidth}px`,
        '--rt-border-color': borderColor,

        '--rt-arrow-left': `${arrowLeft}px`,
        '--rt-arrow-size': `${arrowSize}px`,
        '--rt-arrow-bg': 'transparent',    // no gray box
      }}
    >
      {/* Pill */}
      <div className="roster-tag-bubble" aria-hidden />

      {/* Overlay: arrow icon + text */}
      <div className="roster-tag-overlay" aria-hidden>
        <div className="roster-tag-arrow">
          <img src={TagIcon} alt="" />
        </div>

        <div
          ref={textRef}
          className="roster-tag-text"
          style={{ color: 'var(--rt-text)' }}
        >
          <span className="roster-tag-prefix">{prefix}</span>
          <span className="roster-tag-label">{label}</span>
        </div>
      </div>
    </div>
  );
}
