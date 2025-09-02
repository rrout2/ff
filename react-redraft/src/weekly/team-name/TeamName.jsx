// /src/weekly/team-name/TeamName.jsx
import React, { useRef, useLayoutEffect, useState } from "react";
import "./team-name.css";          // keep your font styling (e.g., Prohibition)

/**
 * Weekly TeamName — autosize to fit + baseline locked (no wrapping)
 *
 * Props:
 *  - text          : string
 *  - maxWidth      : px (right-side limit — text must fit in this width)
 *  - maxFont       : px (upper bound for size)
 *  - minFont       : px (lower bound before final micro-scale)
 *  - color         : css color
 *  - align         : "left" | "center" | "right"
 *  - baselineAlign : boolean (pin baseline to wrapper top)
 *  - baselineRatio : number (0–1) ~0.78
 *  - baselineNudge : extra px up(+)/down(−)
 */
export default function TeamName({
  text = "TEAM NAME",
  maxWidth = 900,
  maxFont = 80,
  minFont = 20,
  color = "#fff",
  align = "left",
  baselineAlign = true,
  baselineRatio = 0.78,
  baselineNudge = 0,
}) {
  const boxRef = useRef(null);
  const textRef = useRef(null);

  const [fontPx, setFontPx] = useState(maxFont);
  const [scale,  setScale]  = useState(1);

  const fit = () => {
    const el  = textRef.current;
    const box = boxRef.current;
    if (!el || !box) return;

    const boxW = maxWidth || box.clientWidth || 0;
    if (!boxW) return;

    // ensure NO WRAP while measuring
    el.style.whiteSpace = "nowrap";
    el.style.wordBreak  = "keep-all";
    el.style.fontSize   = `${maxFont}px`;
    el.style.transform  = "scale(1)";

    // quick pass
    if (el.scrollWidth <= boxW) {
      setFontPx(maxFont);
      setScale(1);
      return;
    }

    // binary search largest font that fits
    let lo = minFont, hi = maxFont, best = minFont;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      el.style.fontSize = `${mid}px`;
      const w = el.scrollWidth;
      if (w <= boxW) { best = mid; lo = mid + 1; }
      else { hi = mid - 1; }
    }
    setFontPx(best);

    // micro-scale in case we’re still a hair wide
    el.style.fontSize = `${best}px`;
    const finalW = el.scrollWidth || 1;
    setScale(finalW > boxW ? boxW / finalW : 1);
  };

  useLayoutEffect(() => {
    fit();
    const ro = new ResizeObserver(fit);
    if (boxRef.current) ro.observe(boxRef.current);
    window.addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, maxWidth, maxFont, minFont]);

  // Baseline lock: move text UP by its baseline so baseline sits on wrapper top
  const baselineShift = baselineAlign ? -(fontPx * baselineRatio) + baselineNudge : 0;

  return (
    <div
      ref={boxRef}
      style={{ width: `${maxWidth}px`, overflow: "visible" }}
      title={text}
    >
      {/* translate only for baseline; do NOT scale here */}
      <div style={{ transform: `translateY(${baselineShift}px)` }}>
        <h1
          ref={textRef}
          className="weekly-team-name weekly-prohibition" /* keep your font class */
          style={{
            color,
            textAlign: align,
            fontSize: `${fontPx}px`,
            transform: `scale(${scale})`,
            transformOrigin: "left top",
            whiteSpace: "nowrap",      // enforce single line visually too
            overflow: "hidden",
            textOverflow: "clip",
          }}
        >
          {(text || "").toUpperCase()}
        </h1>
      </div>
    </div>
  );
}
