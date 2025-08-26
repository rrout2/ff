// /src/redraft/roster-tag/RosterTag.jsx
import React, { useMemo, useLayoutEffect, useRef, useState } from 'react';
import './roster-tag.css';
import TagIcon from './roster-tag-images/tag.png';

/* thresholds & rules */
const DEFAULT_THRESHOLDS = { high: 7, low: 4 };

/* Only the “perfect-combo” rules (no Balanced here) */
const RULES = [
  { id: 'juggernaut', label: 'THE JUGGERNAUT',  wants: { upside: 'high', reliability: 'high', depth: 'high', risk: 'low' } },
  { id: 'riskit',     label: 'RISK IT FOR BISKIT', wants: { upside: 'high', risk: 'high' } },
  { id: 'star',       label: 'STAR STUDDED',       wants: { upside: 'high', depth: 'low' } },
  { id: 'safe',       label: 'SAFE AND SOUND',     wants: { reliability: 'high', risk: '!high', upside: '!high' } },
  { id: 'mariana',    label: 'MARIANA TRENCH',     wants: { depth: 'high', risk: '!high', upside: '!high' } },
  { id: 'witu',       label: 'WI TU LO',           wants: { upside: 'low', reliability: 'low', depth: 'low' } },
];

/* Fallback tag used when no rule matches exactly */
const FALLBACK = { id: 'balanced', label: 'BALANCED APPROACH' };

function bucketize(scores, { high, low }) {
  const to = n => (n > high ? 'high' : n < low ? 'low' : 'mid');
  return {
    upside: to(scores.upside),
    reliability: to(scores.reliability),
    depth: to(scores.depth),
    risk: to(scores.risk),
  };
}

/* Exact-match checker:
   - 'high'/'mid'/'low'  => require equality
   - '!high' / '!low'    => require inequality
   If every key in wants passes, it’s a perfect combo. */
function exactMatch(levels, wants = {}) {
  for (const [k, want] of Object.entries(wants)) {
    const have = levels[k];
    if (want === 'high' || want === 'mid' || want === 'low') {
      if (have !== want) return false;
    } else if (want === '!high') {
      if (have === 'high') return false;
    } else if (want === '!low') {
      if (have === 'low') return false;
    }
  }
  return true;
}

/* Default to BALANCED APPROACH unless a rule matches perfectly */
export function assignRosterTag(scores, thresholds = DEFAULT_THRESHOLDS, rules = RULES) {
  const levels = bucketize(scores, thresholds);
  const hit = rules.find(r => exactMatch(levels, r.wants));
  const res = hit ? { id: hit.id, label: hit.label } : FALLBACK;
  return { ...res, levels };
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
    txt.style.transform = 'translateY(-50%) scale(1)';
    // measure
    const naturalW = txt.scrollWidth || 1;
    const naturalH = txt.getBoundingClientRect().height || 1;

    // compute scales; cap at 1 so we don't upscale if not needed
    const scaleW = Math.min(1, availableW / naturalW);
    const scaleH = Math.min(1, availableH / naturalH);
    const next = Math.min(scaleW, scaleH);

    setScale(next);
    // restore (actual transform uses CSS var below)
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
