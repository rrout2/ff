import React from 'react';

/** Donut progress ring, fills value/max (e.g., 7/10 = 70%). */
export default function DonutProgress({
  value = 7,
  max = 10,
  size = 128,          // ↓ smaller default so it fits
  thickness = 14,
  color = '#F28C2E',
  trackColor = '#e9e9e9',
  showOutline = false, // ← off by default (no black circle)
  outlineColor = '#2D2D2C',
  center,
}) {
  const v = Math.max(0, Math.min(value, max));
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const pct = v / max;
  const dash = c * pct;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block' }}>
        {/* Track */}
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none"
          stroke={trackColor}
          strokeWidth={thickness}
          strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
        />
        {/* Progress */}
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none"
          stroke={color}
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          transform={`rotate(-90 ${size/2} ${size/2})`}
        />
        {showOutline && (
          <circle
            cx={size/2} cy={size/2} r={r}
            fill="none"
            stroke={outlineColor}
            strokeOpacity="0.7"
            strokeWidth="2"
          />
        )}
      </svg>

      {center && (
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
          {center}
        </div>
      )}
    </div>
  );
}
