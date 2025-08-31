// /src/redraft/draft-value-chart/DraftValueManual.jsx
import React from "react";
import "./draft-value-manual.css";

// ====== Board artwork PNGs (adjust names if yours differ) ======
import FrameGreen from "./draft-value-chart-png/green.png";          // existing green
import FrameYellow from "./draft-value-chart-png/yellow.png";  // <-- rename if needed
import FrameRed from "./draft-value-chart-png/red.png";        // <-- rename if needed


/**
 * Manual overlay card for the Draft Value Grade.
 *
 * Props:
 *  - grade: number (0..10) — renders as "8/10"
 *  - title: string — heading above the card (default "")
 *  - width: container width in px (the PNG and text scale with this)
 *  - absolute: if true, positions this whole component absolutely using (x,y)
 *  - x, y: absolute offsets (px) when absolute=true
 *  - board: "green" | "yellow" | "red"  (default "green")
 *
 *  - whiteBox: { enabled, x, y, width, height, opacity }
 *  - blocks: array of { x, y, width, height, opacity }
 *
 *  - className, style: optional passthroughs for the container
 */
export default function DraftValueManual({
  grade = 0,
  title = "",
  width = 640,
  absolute = false,
  x = 0,
  y = 0,
  board = "green",
  whiteBox = null,
  blocks = null,
  className = "",
  style = {},
}) {
  const n = Number.isFinite(+grade) ? +grade : 0;
  const text = `${n}/10`;

  const frame = board === "red" ? FrameRed : board === "yellow" ? FrameYellow : FrameGreen;

  // Scale tweak so "10/10" (5 chars) matches "8/10" (4 chars)
  const scaleFix = text.length > 4 ? 0.9 : 1;

  // Container sizing/position
  const rootStyle = {
    "--dvm-w": `${width}px`,
    "--dvm-scale": scaleFix,
    width,
    ...(absolute ? { position: "absolute", left: x, top: y } : {}),
    ...style,
  };

  // Normalize overlay blocks
  const overlayBlocks = Array.isArray(blocks)
    ? blocks
    : whiteBox && whiteBox.enabled
    ? [whiteBox]
    : [];

  return (
    <div className={`dvm ${absolute ? "dvm-abs" : ""} ${className}`.trim()} style={rootStyle}>
      <div className="dvm-title">{title}</div>

      <div className="dvm-card">
        {/* Full image so nothing crops */}
        <img src={frame} alt="Draft Value Grade" className="dvm-img" />

        {/* optional white cover boxes */}
        {overlayBlocks.map((b, i) => {
          const w = b.width ?? b.w ?? 320;
          const h = b.height ?? b.h ?? undefined; // keep aspect if not provided
          const left = b.x ?? 0;
          const top = b.y ?? 0;
          const opacity = typeof b.opacity === "number" ? b.opacity : 1;
          return (
            <img
              key={i}
              src={WhiteBox}
              alt=""
              className="dvm-whitebox"
              style={{ left, top, width: w, height: h, opacity }}
            />
          );
        })}

        {/* big centered grade text */}
        <div className="dvm-grade">{text}</div>
      </div>
    </div>
  );
}
