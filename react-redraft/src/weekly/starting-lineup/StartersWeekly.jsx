// /src/weekly/starting-lineup/StartersWeekly.jsx
import React, { useMemo } from "react";
import "./weekly-starters.css";

/**
 * Props:
 *  - lineup      : [{ slot, player }]
 *  - rosterIds   : string[]  (unused here)
 *  - playersById : Record<string, any> (unused here)
 *  - targetHeight: number (px) — the vertical space to fill (default 450)
 *  - rowHeight   : number (px) — visual row height (default 68)
 *  - minGap      : number (px) — minimum space between rows (default 10)
 */
export default function StartersWeekly({
  lineup = [],
  rosterIds = [],
  playersById = {},
  targetHeight = 450,
  rowHeight = 68,
  minGap = 10,
}) {
  // Build a vertical, core-only list: QB → RB → WR → TE → FLEX
  const rows = useMemo(() => {
    const starters = (lineup || []).map((it) => {
      const p = it?.player || {};
      const id = p.player_id || p.id;
      return {
        id: String(id || ""),
        slot: String(it?.slot || "").toLowerCase(),
        name:
          p.full_name ||
          `${p.first_name || ""} ${p.last_name || ""}`.trim() ||
          "—",
        position:
          (Array.isArray(p.fantasy_positions) && p.fantasy_positions[0]) ||
          p.position ||
          "",
        team: p.team || p.pro_team || p.team_abbr || "",
      };
    });

    const CORE = new Set(["qb", "rb", "wr", "te", "flex"]);
    const core = starters.filter((r) => CORE.has(r.slot));
    const ORDER = ["qb", "rb", "wr", "te", "flex"];
    return ORDER.flatMap((s) => core.filter((r) => r.slot === s));
  }, [lineup]);

  // Resolve team logo path
  const logoForTeam = (team) => {
    const code = String(team || "").toLowerCase();
    if (!code) return "";
    try {
      return new URL(`../../assets/standard/${code}.png`, import.meta.url).href;
    } catch {
      return "";
    }
  };

  const PlayerRow = ({ p }) => {
    const slotClass =
      p.slot === "qb" ? "pos-qb" :
      p.slot === "rb" ? "pos-rb" :
      p.slot === "wr" ? "pos-wr" :
      p.slot === "te" ? "pos-te" :
      p.slot === "flex" ? "pos-flex" : "pos-bench";

    const headshot =
      p.id && !String(p.id).startsWith("placeholder-")
        ? `https://sleepercdn.com/content/nfl/players/thumb/${p.id}.jpg`
        : "";

    const teamLogo = logoForTeam(p.team);
    const team = (p.team || "").toUpperCase();
    const details =
      p.slot === "flex"
        ? `FLEX – ${p.position || ""} – ${team}`
        : `${p.position || ""} – ${team}`;

    const display = (p.name || "—").toUpperCase();
    let nameSize = 18;
    if (display.length > 22) nameSize = 16;
    if (display.length > 28) nameSize = 14;

    return (
      <div className={`player-row ${slotClass}`}>
        <div className="player-media">
          {teamLogo && (
            <img
              className="team-logo"
              src={teamLogo}
              alt={team}
              loading="lazy"
              onError={(e) => { e.currentTarget.style.visibility = "hidden"; }}
            />
          )}
          <div className="headshot-bg">
            {headshot && (
              <img
                className="player-headshot"
                src={headshot}
                alt=""
                loading="lazy"
                onError={(e) => { e.currentTarget.style.visibility = "hidden"; }}
              />
            )}
          </div>
        </div>

        <div className="player-info">
          <div className="player-name" style={{ fontSize: nameSize }} title={display}>
            {display}
          </div>
          <div className="player-details">{details}</div>
        </div>
      </div>
    );
  };

  // ----- Fit-to-range logic -----
  const n = Math.max(1, rows.length);
  const contentH = n * rowHeight;
  const gaps = Math.max(0, n - 1);

  let gap = minGap;
  let scale = 1;

  if (gaps === 0) {
    // single row: scale down only if needed
    scale = Math.min(1, targetHeight / contentH);
  } else {
    const exactGap = (targetHeight - contentH) / gaps; // gap needed to fill container
    if (exactGap >= minGap) {
      // plenty of room — stretch the gaps to fill to the bottom
      gap = exactGap;
      scale = 1;
    } else {
      // too many rows — use minimal gap and scale the whole stack down
      gap = minGap;
      const needed = contentH + gaps * gap;
      scale = Math.min(1, targetHeight / needed);
    }
  }

  return (
    <div
      className="starting-roster"
      style={{
        // pass gap to CSS via CSS var
        "--row-gap": `${gap}px`,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        height: `${targetHeight}px`,
      }}
    >
      <div className="roster-column">
        {rows.map((p, i) => (
          <PlayerRow key={`${i}-${p.id}-${p.slot}`} p={p} />
        ))}
      </div>
    </div>
  );
}
