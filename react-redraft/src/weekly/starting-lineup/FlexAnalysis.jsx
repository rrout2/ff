// /src/weekly/starting-lineup/FlexAnalysis.jsx
import React, { useMemo } from "react";
import "./weekly-starters.css";

import TAG_M from "./lights/M.png";
import TAG_V from "./lights/V.png";
import TAG_O from "./lights/O.png";

const LIGHT_ORDER = [
  { key: "M", src: TAG_M },
  { key: "V", src: TAG_V },
  { key: "O", src: TAG_O },
];

export default function FlexAnalysis({
  lineup = [],
  rosterIds = [],
  playersById = {},
  count = 3,
  allowed = ["WR", "RB", "TE"],
}) {
  const usedIds = useMemo(() => {
    const s = new Set();
    for (const it of lineup || []) {
      const p = it?.player;
      const id = p?.player_id || p?.id;
      if (id) s.add(String(id));
    }
    return s;
  }, [lineup]);

  const score = (p) =>
    (Number(p?.adp_half_ppr ?? p?.adp_ppr ?? p?.adp ?? p?.adp_full_ppr ?? p?.adp_std ?? 9999)) +
    (p?.search_rank ? p.search_rank / 10000 : 0);

  const rows = useMemo(() => {
    const allowedSet = new Set(allowed.map((x) => String(x).toUpperCase()));
    const all = (rosterIds || [])
      .map((id) => playersById[id])
      .filter(Boolean)
      .map((p) => {
        const pos =
          (Array.isArray(p.fantasy_positions) && p.fantasy_positions[0]) ||
          p.position ||
          "";
        return {
          raw: p,
          id: String(p.player_id || p.id),
          name:
            p.full_name ||
            `${p.first_name || ""} ${p.last_name || ""}`.trim() ||
            "—",
          position: String(pos).toUpperCase(),
          team: p.team || p.pro_team || p.team_abbr || "",
        };
      })
      .filter((p) => allowedSet.has(p.position))
      .filter((p) => !usedIds.has(p.id))
      .sort((a, b) => score(a.raw) - score(b.raw));

    return all.slice(0, Math.max(0, count));
  }, [allowed, rosterIds, playersById, usedIds, count]);

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
      p.position === "QB" ? "pos-qb" :
      p.position === "RB" ? "pos-rb" :
      p.position === "WR" ? "pos-wr" :
      p.position === "TE" ? "pos-te" :
      "pos-bench";

    const headshot =
      p.id && !String(p.id).startsWith("placeholder-")
        ? `https://sleepercdn.com/content/nfl/players/thumb/${p.id}.jpg`
        : "";

    const teamLogo = logoForTeam(p.team);
    const team = (p.team || "").toUpperCase();
    const details = `${p.position || ""} – ${team}`;

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
          <div className="player-name-row">
            <div className="player-name" style={{ fontSize: nameSize }} title={display}>
              {display}
            </div>
            <div className="player-tags">
              {LIGHT_ORDER.map(({ key, src }) => (
                <img key={`${p.id}-tag-${key}`} src={src} alt={key} />
              ))}
            </div>
          </div>
          <div className="player-details">{details}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="starting-roster" style={{ "--row-gap": "16px" }}>
      <div className="roster-column">
        {rows.map((p, i) => (
          <PlayerRow key={`${i}-${p.id}-${p.position}`} p={p} />
        ))}
      </div>
    </div>
  );
}
