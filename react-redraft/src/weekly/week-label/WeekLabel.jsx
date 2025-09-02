// /src/weekly/week-label/WeekLabel.jsx
import React from "react";
import "./week-label.css";

/**
 * WeekLabel
 * - Text only (green pill is in the PNG)
 * - Font: 'Arial Black', sans-serif
 */
function WeekLabel({
  text = "WEEK 1",
  fontSize = 30,
  color = "#000",
  align = "center",
  width,
  letterGap = 1,
}) {
  return (
    <div
      className="week-label"
      style={{
        fontSize,
        color,
        textAlign: align,
        width: width ? `${width}px` : undefined,
        letterSpacing: `${letterGap}px`,
      }}
      title={text}
    >
      {(text || "").toUpperCase()}
    </div>
  );
}

export default WeekLabel;  // <-- important
