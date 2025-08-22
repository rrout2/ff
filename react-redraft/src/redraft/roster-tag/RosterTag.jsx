import React, { useMemo, useLayoutEffect, useRef, useState } from 'react';
import './roster-tag.css';
import TagBubble from './roster-tag-images/roster-tag.png.png'; // rename if you change the file
import TagIcon from './roster-tag-images/tag.png';

/* thresholds & rules (unchanged) */
const DEFAULT_THRESHOLDS = { high: 7, low: 4 };
const RULES = [
  { id: 'juggernaut', label: 'THE JUGGERNAUT',
    when: L => L.upside==='high' && L.reliability==='high' && L.depth==='high' && L.risk==='low' },
  { id: 'riskit', label: 'RISK IT FOR BISKIT', when: L => L.upside==='high' && L.risk==='high' },
  { id: 'star', label: 'STAR STUDDED', when: L => L.upside==='high' && L.depth==='low' },
  { id: 'safe', label: 'SAFE AND SOUND', when: L => L.reliability==='high' && L.risk!=='high' && L.upside!=='high' },
  { id: 'mariana', label: 'MARIANA TRENCH', when: L => L.depth==='high' && L.upside!=='high' && L.risk!=='high' },
  { id: 'balanced', label: 'BALANCED APPROACH',
    when: L => {
      const highs = Object.values(L).filter(v => v==='high').length;
      const lows  = Object.values(L).filter(v => v==='low').length;
      return highs <= 2 && lows <= 1 && L.risk!=='high';
    }},
  { id: 'witu', label: 'WI TU LO', when: L => L.upside==='low' && L.reliability==='low' && L.depth==='low' },
  { id: 'fallback', label: 'BALANCED APPROACH', when: () => true },
];

function bucketize(scores, thresholds) {
  const { high, low } = thresholds;
  const to = n => (n > high ? 'high' : n < low ? 'low' : 'mid');
  return {
    upside: to(scores.upside),
    reliability: to(scores.reliability),
    depth: to(scores.depth),
    risk: to(scores.risk),
  };
}
export function assignRosterTag(scores, thresholds = DEFAULT_THRESHOLDS, rules = RULES) {
  const L = bucketize(scores, thresholds);
  const hit = rules.find(r => r.when(L));
  return { id: hit.id, label: hit.label, levels: L };
}

export default function RosterTag({
  scores = { upside: 5, reliability: 5, depth: 5, risk: 5 },
  thresholds = DEFAULT_THRESHOLDS,
  prefix = 'ROSTER TAG:',
  width = 720,
  fontSize = 46,
  insetLeft = 100,      // leave room for icon
  insetRight = 24,
  iconLeft = 28,
  iconWidth = 40,
  className = '',
  /** NEW: if provided, this label overrides the computed one */
  overrideTag,
}) {
  const computed = useMemo(() => assignRosterTag(scores, thresholds), [scores, thresholds]);
  const label = (typeof overrideTag === 'string' && overrideTag.trim().length > 0)
    ? overrideTag.trim()
    : computed.label;

  // Auto-fit: shrink text (never wrap) if it would overflow the bubble
  const wrapRef = useRef(null);
  const textRef = useRef(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const txt  = textRef.current;
    if (!wrap || !txt) return;

    const available = width - insetLeft - insetRight;
    txt.style.setProperty('--rt-scale', 1);           // reset to measure
    const naturalWidth = txt.scrollWidth;
    const next = naturalWidth > 0 ? Math.min(1, available / naturalWidth) : 1;
    setScale(next);
    txt.style.removeProperty('--rt-scale');
  }, [label, width, insetLeft, insetRight]);

  return (
    <div
      ref={wrapRef}
      className={`roster-tag-wrap ${className}`}
      style={{
        '--rt-width': `${width}px`,
        '--rt-font-size': `${fontSize}px`,
        '--rt-inset-left': `${insetLeft}px`,
        '--rt-inset-right': `${insetRight}px`,
        '--rt-scale': scale,
        '--rt-icon-left': `${iconLeft}px`,
        '--rt-icon-w': `${iconWidth}px`,
      }}
    >
      {/* Bubble background */}
      <img src={TagBubble} alt="" className="roster-tag-bg" aria-hidden />

      {/* Full overlay: icon + text stay inside/centered */}
      <div className="roster-tag-overlay" aria-hidden>
        <img src={TagIcon} alt="" className="roster-tag-icon" />
        <div ref={textRef} className="roster-tag-text">
          <span className="roster-tag-prefix">{prefix}</span>
          <span className="roster-tag-label">{label}</span>
        </div>
      </div>
    </div>
  );
}
