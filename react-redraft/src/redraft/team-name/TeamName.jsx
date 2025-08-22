// /src/redraft/team-name/TeamName.jsx
import React, { useRef, useLayoutEffect, useState } from 'react';

/**
 * Auto-fits the team name into a fixed-width box.
 * - Grows from maxFont and shrinks (binary search) down to minFont to fit width.
 * - If still too wide at minFont, applies a final scale so it ALWAYS fits.
 * - Optional baseline alignment keeps the text sitting on a specific line
 *   regardless of font size.
 */
export default function TeamName({
  text = '',
  maxWidth = 1180,   // pixels of space the name must fit into
  maxFont = 120,     // starting font size
  minFont = 36,      // smallest allowed font size
  color = '#2D2D2C',

  // Baseline anchoring (so different sizes sit on the same line)
  baselineAlign = false,
  baselineRatio = 0.78, // approx baseline from top for "Veneer" (tweak 0.74–0.82)
  baselineNudge = 0,    // extra px to nudge up(+)/down(-) after ratio
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

    // If it already fits at maxFont
    if (el.scrollWidth <= boxW) {
      setFontPx(maxFont);
      setScale(1);
      return;
    }

    // Binary search largest font size that fits
    let lo = minFont, hi = maxFont, best = minFont;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      el.style.fontSize = `${mid}px`;
      const w = el.scrollWidth;
      if (w <= boxW) { best = mid; lo = mid + 1; }
      else { hi = mid - 1; }
    }
    setFontPx(best);

    // Final exact scale if even best is a hair wide
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

  // Move text up so its BASELINE sits on the wrapper's top edge.
  const baselineShift = baselineAlign
    ? -(fontPx * baselineRatio * scale) + baselineNudge
    : 0;

  return (
    <div
      ref={boxRef}
      // overflow must be visible because we translate the text upward for baseline
      style={{ width: `${maxWidth}px`, overflow: 'visible' }}
      title={text}
    >
      <div
        ref={textRef}
        style={{
          fontFamily: 'Veneer, sans-serif',
          fontWeight: 'bold',
          lineHeight: 1,
          color,
          whiteSpace: 'nowrap',
          fontSize: `${fontPx}px`,
          transform: `translateY(${baselineShift}px) scale(${scale})`,
          transformOrigin: 'left top',
        }}
      >
        {(text || '').toUpperCase()}
      </div>
    </div>
  );
}
