// /src/redraft/final-verdict/FinalVerdict.jsx
import React from 'react';
import './final-verdict.css';

/**
 * Centered verdict line under the stars.
 *
 * Props:
 *  - text?: string
 *  - maxWidth?: string | number  // e.g. "420px" or 420
 *  - align?: "left" | "center" | "right" (default "center")
 */
export default function FinalVerdict({ text = '', maxWidth = '100%', align = 'center' }) {
  const t = String(text || '').trim();
  if (!t) return null;

  const style = {
    maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
    whiteSpace: 'normal',
    overflowWrap: 'anywhere',
    wordBreak: 'break-word',
    lineHeight: 1.1,
    textAlign: align,
    // since the wrapper uses display:flex in your CSS, drive horizontal centering too:
    justifyContent:
      align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start',
    width: '100%',
  };

  return (
    <div className="final-verdict-wrapper" style={style}>
      {t}
    </div>
  );
}
