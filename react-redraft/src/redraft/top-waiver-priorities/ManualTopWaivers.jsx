// /src/redraft/top-waiver-priorities/ManualTopWaivers.jsx
import React from "react";

/** Presets you can pick in Tweaks (label → color, with a default pos) */
export const WAIVER_PRESETS = [
  { id: "RB_UPSIDE", label: "RB UPSIDE", color: "#81c6c9", pos: "RB" },
  { id: "WR_UPSIDE", label: "WR UPSIDE", color: "#7ab274", pos: "WR" },
  { id: "QB_UPSIDE", label: "QB UPSIDE", color: "#c15252", pos: "QB" },
  { id: "TE_UPSIDE", label: "TE UPSIDE", color: "#f0c05f", pos: "TE" },
];

/**
 * Manual overlay for the Top Waiver area (single square, CSS only).
 *
 * Props:
 *  - enabled?: boolean
 *  - items?: Array<{
 *      preset?: 'RB_UPSIDE'|'WR_UPSIDE'|'QB_UPSIDE'|'TE_UPSIDE'
 *      label?: string           // optional: overrides preset label
 *      pos?: 'QB'|'RB'|'WR'|'TE'// only used if no preset is supplied
 *    }>
 *  - width?: number        (default 560)
 *  - tileHeight?: number   (default 150)  // one auto-tile height
 *  - gap?: number          (default 18)   // gap between auto-tiles
 *  - fontSize?: number     (default 40)
 *  - textScale?: number    (default 1)    // scales ONLY the text, not the square
 */
export default function ManualTopWaivers({
  enabled = true,
  items = [],
  width = 560,
  tileHeight = 150,
  gap = 18,
  fontSize = 40,
  textScale = 1,
}) {
  if (!enabled) return null;

  const norm = (s) => String(s || "").trim().replace(/\s+/g, " ").toUpperCase();

  const fallbackColorForPos = (pos) => {
    const P = String(pos || "").toUpperCase();
    if (P === "QB") return "#c15252";
    if (P === "RB") return "#81c6c9";
    if (P === "WR") return "#7ab274";
    if (P === "TE") return "#f0c05f";
    return "#A6A6BD";
  };

  const presetFrom = (item) => {
    const byId = WAIVER_PRESETS.find(
      (p) => p.id === String(item?.preset || "").toUpperCase()
    );
    if (byId) return byId;

    const byLabel = WAIVER_PRESETS.find((p) => p.label === norm(item?.label));
    if (byLabel) return byLabel;

    const pos = String(item?.pos || "").toUpperCase();
    if (pos) {
      const byPos = WAIVER_PRESETS.find((p) => p.pos === pos);
      if (byPos) return byPos;
    }
    return null;
  };

  // Resolve from first item (or default to WR)
  const raw = items[0] || { preset: "WR_UPSIDE" };
  const preset = presetFrom(raw);
  const color = preset ? preset.color : fallbackColorForPos(raw.pos);
  const label = norm(raw?.label || preset?.label || raw?.pos || "UPSIDE");

  // Height sized to match three stacked auto-tiles (tileHeight*3 + gap*2)
  const combinedHeight = tileHeight * 3 + gap * 2;

  const wrap = {
    position: "relative",
    width,
    height: combinedHeight,
    borderRadius: 16,
    border: "4px solid #2D2D2C",
    overflow: "hidden",
    background: color,
    boxShadow: "0 6px 14px rgba(0,0,0,.12)",
  };

  const content = {
    position: "absolute",
    inset: 0,
    display: "grid",
    placeItems: "center",
    padding: "0 20px",
    textAlign: "center",
  };

  const text = {
    fontFamily: "'Prohibition', sans-serif",
    fontWeight: 900,
    fontSize,              // base size
    letterSpacing: 0.6,
    color: "#2D2D2C",
    textTransform: "uppercase",
    textShadow:
      color.toLowerCase() === "#f0c05f" || color.toLowerCase() === "#81c6c9"
        ? "0 1px 0 rgba(0,0,0,.08)"
        : "none",
    transform: `scale(${textScale})`,      // ONLY scales the text
    transformOrigin: "center",
    willChange: "transform",
  };

  return (
    <div style={wrap}>
      <div style={content}>
        <div style={text}>{label}</div>
      </div>
    </div>
  );
}
