// /src/redraft/team-name/TeamName.jsx
import React, { useRef, useLayoutEffect, useState } from 'react';
import './team-name.css';

/**
 * Auto-fits the team name into a fixed-width box.
 * - Finds largest font size (<= maxFont) that fits maxWidth via binary search.
 * - If still a hair wide, applies a final scale so it ALWAYS fits.
 * - Optional baselineAlign keeps the text sitting on a consistent baseline.
 */
export default function TeamName({
  text = 'TEAM NAME GOES HERE',
  maxWidth = 1180,   // px of space the name must fit into
  maxFont = 213,     // start at your 160pt equivalent
  minFont = 36,      // smallest allowed before scaling
  color = '#2D2D2C',

  // baseline anchoring
  baselineAlign = false,
  baselineRatio = 0.78, // approx baseline from top for Veneer (tweak 0.74–0.82)
  baselineNudge = 0,    // extra px up(+)/down(-)
}) {
  const boxRef = useRef(null);
  const textRef = useRef(null);
  const [fontPx, setFontPx] = useState(maxFont);
  const [scale, setScale] = useState(1);

  const fit = () => {
    const el = textRef.current;
    const box = boxRef.current;
    if (!el || !box) return;

    const boxW = maxWidth || box.clientWidth || 0;
    if (!boxW) return;

    // reset for measurement
    el.style.fontSize = `${maxFont}px`;
    el.style.transform = 'scale(1) translateY(0)';

    if (el.scrollWidth <= boxW) {
      setFontPx(maxFont);
      setScale(1);
      return;
    }

    // binary search for largest font that fits
    let lo = minFont, hi = maxFont, best = minFont;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      el.style.fontSize = `${mid}px`;
      const w = el.scrollWidth;
      if (w <= boxW) { best = mid; lo = mid + 1; }
      else { hi = mid - 1; }
    }
    setFontPx(best);

    // final exact scale if best is still a tad wide
    el.style.fontSize = `${best}px`;
    const finalW = el.scrollWidth || 1;
    setScale(finalW > boxW ? boxW / finalW : 1);
  };

  useLayoutEffect(() => {
    fit();
    const ro = new ResizeObserver(fit);
    if (boxRef.current) ro.observe(boxRef.current);
    window.addEventListener('resize', fit);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', fit);
    };
  }, [text, maxWidth, maxFont, minFont]);

  const baselineShift = baselineAlign
    ? -(fontPx * baselineRatio * scale) + baselineNudge
    : 0;

  return (
    <div
      ref={boxRef}
      className="team-name-wrapper"
      style={{ width: `${maxWidth}px`, overflow: 'visible' }}
      title={text}
    >
      <h1
        ref={textRef}
        className="team-name"
        style={{
          fontWeight: 400,                           // match @font-face
          color,
          fontSize: `${fontPx}px`,
          transform: `translateY(${baselineShift}px) scale(${scale})`,
          transformOrigin: 'left top',
        }}
      >
        {(text || '').toUpperCase()}
      </h1>
    </div>
  );
}
