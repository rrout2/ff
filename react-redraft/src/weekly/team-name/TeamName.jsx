// /src/weekly/team-name/TeamName.jsx
import React, { useLayoutEffect, useMemo, useRef, useState } from "react";
import "./prohibition.css"; // your @font-face for Prohibition

export default function TeamName({
  text = "TEAM NAME",
  maxWidth = 900,
  maxFont = 170,   // pt
  minFont = 60,    // pt
  color = "#fff",
  align = "left",
  baselineAlign = true,
  baselineRatio = 0.78,
}) {
  const [fontPt, setFontPt] = useState(maxFont);
  const measurerRef = useRef(null);

  // --- key change: right-side buffer so oblique glyphs don't get clipped
  const RIGHT_FUDGE = 12; // px – increase to ~14–16 if you still see clipping

  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  const ptToPx = (pt) => (pt * 96) / 72;

  const typeStyle = useMemo(
    () => ({
      fontFamily:
        '"Prohibition", Impact, "Anton", "League Gothic", Oswald, "Arial Black", sans-serif',
      fontStyle: "oblique",
      fontWeight: 170,
      lineHeight: 0.9,
      letterSpacing: "0.5px",
      textTransform: "uppercase",
    }),
    []
  );

  useLayoutEffect(() => {
    const el = measurerRef.current;
    if (!el) return;

    const content = String(text || "").trim();
    if (!content) {
      setFontPt(minFont);
      return;
    }

    el.textContent = content;

    let lo = minFont;
    let hi = maxFont;
    if (fontPt >= minFont && fontPt <= maxFont) {
      lo = Math.max(minFont, fontPt - 6);
      hi = Math.min(maxFont, fontPt + 6);
    }

    // binary search font size
    for (let i = 0; i < 10; i++) {
      const mid = (lo + hi) / 2;
      el.style.fontSize = `${mid}pt`;
      const w = Math.ceil(el.scrollWidth);
      // width includes our paddingRight fudge (set in measurerStyle below),
      // so we compare directly to maxWidth.
      if (w > maxWidth) hi = mid - 0.25;
      else lo = mid + 0.25;
    }

    const chosen = clamp(Math.floor(lo * 10) / 10, minFont, maxFont);
    setFontPt(chosen);
  }, [text, maxWidth, minFont, maxFont]);

  const baselineNudgePx = useMemo(() => {
    if (!baselineAlign) return 0;
    const fontPx = ptToPx(fontPt);
    return Math.round((1 - baselineRatio) * fontPx);
  }, [baselineAlign, baselineRatio, fontPt]);

  // Visible text box
  const visibleStyle = {
    ...typeStyle,
    maxWidth,
    color,
    textAlign: align,
    fontSize: `${fontPt}pt`,
    whiteSpace: "nowrap",
    // keep hidden to cap width, but add right padding so obliques don't clip
    overflow: "hidden",
    textOverflow: "ellipsis",
    paddingRight: RIGHT_FUDGE,
    transform: baselineAlign ? `translateY(-${baselineNudgePx}px)` : undefined,
  };

  // Hidden measurer mirrors visible, including the right padding
  const measurerStyle = {
    ...typeStyle,
    position: "absolute",
    visibility: "hidden",
    whiteSpace: "nowrap",
    pointerEvents: "none",
    paddingRight: RIGHT_FUDGE,
  };

  return (
    <>
      <span ref={measurerRef} style={measurerStyle} aria-hidden="true" />
      <div style={visibleStyle} title={text}>
        {text}
      </div>
    </>
  );
}
