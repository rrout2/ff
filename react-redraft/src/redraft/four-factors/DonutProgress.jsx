import React from 'react';

/**
 * Donut progress ring, fills value/max (e.g., 7/10 = 70%).
 * Adds optional inner white disc + black outlines per boss feedback.
 */
export default function DonutProgress({
  value = 7,
  max = 10,
  size = 128,
  thickness = 14,
  color = '#F28C2E',
  trackColor = '#e9e9e9',

  // NEW: edge and outline controls
  cap = 'butt',                 // 'butt' = hard/flat ends; 'round' if you ever want rounded
  showOutlineRing = true,       // black outlines around ring edges (outer & inner)
  outlineColor = '#2D2D2C',
  outlineWidth = 1,

  // NEW: inner disc under the ring
  showInnerDisc = true,
  innerDiscOpacity = 0.2,       // ~20% opacity
  innerDiscFill = '#ffffff',
  innerDiscStroke = '#2D2D2C',
  innerDiscStrokeWidth = 1,

  // center content
  center,
  centerOffsetX = 0,
  centerOffsetY = 0,
}) {
  const v = Math.max(0, Math.min(value, max));
  const r = (size - thickness) / 2;         // radius at the centerline of the ring
  const c = 2 * Math.PI * r;                // full circumference
  const pct = v / max;
  const dash = c * pct;

  // inner disc radius (just inside the ring)
  const rInner = Math.max(0, r - thickness / 2 - 2);

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
        {/* Track */}
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth={thickness}
          strokeLinecap={cap}
          transform={`rotate(-90 ${size/2} ${size/2})`}
        />

        {/* Progress */}
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap={cap}
          strokeDasharray={`${dash} ${c - dash}`}
          transform={`rotate(-90 ${size/2} ${size/2})`}
        />

        {/* Ring outlines (outer + inner edges) */}
        {showOutlineRing && (
          <>
            <circle
              cx={size/2} cy={size/2} r={r + thickness/2}
              fill="none"
              stroke={outlineColor}
              strokeWidth={outlineWidth}
            />
            <circle
              cx={size/2} cy={size/2} r={Math.max(0.01, r - thickness/2)}
              fill="none"
              stroke={outlineColor}
              strokeWidth={outlineWidth}
            />
          </>
        )}

        {/* Inner white disc under the ring */}
        {showInnerDisc && rInner > 0 && (
          <circle
            cx={size/2} cy={size/2} r={rInner}
            fill={innerDiscFill}
            fillOpacity={innerDiscOpacity}
            stroke={innerDiscStroke}
            strokeWidth={innerDiscStrokeWidth}
          />
        )}
      </svg>

      {/* Center content (icon), with slight offset control */}
      {center && (
        <div
          style={{
            position: 'absolute', inset: 0, display: 'grid', placeItems: 'center',
            transform: `translate(${centerOffsetX}px, ${centerOffsetY}px)`,
          }}
        >
          {center}
        </div>
      )}
    </div>
  );
}
