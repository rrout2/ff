import React, { useEffect, useMemo, useState } from "react";
import "./top-waiver-priorities.css";
import gradeData from "../players/players-by-id.json";
import { fetchLeagueRosters } from "../sleeper-league/sleeperAPI.js";

/**
 * One-card layout:
 * [#n | white] + [position-tinted panel with logo + big headshot + name + POS–TEAM]
 *
 * Props:
 *  - leagueId: string
 *  - settings: { positions?: { superflex?: number, sf?: number } }
 *  - playersById: Record<string, SleeperPlayer>
 *  - rosterIds: string[] (needed to compute current QB/TE grades so we can block them)
 *  - overrideIds?: string[]   // EXACT players to show (order = 1/2/3)
 */
export default function TopWaiverPriorities({
  leagueId,
  settings,
  playersById = {},
  rosterIds = [],
  overrideIds = [],
}) {
  const [rosteredIds, setRosteredIds] = useState(new Set());
  const [loading, setLoading] = useState(Boolean(leagueId));
  const [error, setError] = useState(null);

  // league-wide rostered ids (to define true free agents)
  useEffect(() => {
    if (!leagueId) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const rosters = await fetchLeagueRosters(leagueId);
        if (cancelled) return;
        const set = new Set();
        for (const r of rosters || []) for (const pid of r?.players || []) set.add(String(pid));
        setRosteredIds(set);
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load rosters");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [leagueId]);

  const isSF = Number(settings?.positions?.superflex ?? settings?.positions?.sf ?? 0) > 0;

  // compute team QB/TE grades (for auto-mode filtering)
  const { qbGrade, teGrade } = useMemo(() => {
    const clamp10 = (n) => Math.max(0, Math.min(10, n));
    const topHalfSecond = (arr) => {
      const s = arr.filter(Number.isFinite).sort((a, b) => b - a);
      return (s[0] ?? 0) + 0.5 * (s[1] ?? 0);
    };
    const qbs = [], tes = [];
    for (const rid of rosterIds || []) {
      const rec = gradeData[String(rid)];
      const p   = playersById[rid];
      const POS = String(
        (Array.isArray(p?.fantasy_positions) && p.fantasy_positions[0]) || p?.position || ""
      ).toUpperCase();
      if (POS === "QB") {
        const v = Number(rec?.["qb-score"] ?? rec?.qb_score ?? rec?.qbScore ?? rec?.qb_value ?? rec?.qb ?? rec?.value);
        if (Number.isFinite(v)) qbs.push(v);
      } else if (POS === "TE") {
        const v = Number(rec?.te_value ?? rec?.teValue ?? rec?.te ?? rec?.value ?? rec?.score);
        if (Number.isFinite(v)) tes.push(v);
      }
    }
    return {
      qbGrade: Math.round(clamp10(topHalfSecond(qbs))),
      teGrade: Math.round(clamp10(topHalfSecond(tes))),
    };
  }, [rosterIds, playersById]);

  // ---------- AUTO top 3 from free agents ----------
  const autoTop3 = useMemo(() => {
    if (!playersById || !Object.keys(playersById).length) return [];
    const ALLOWED = new Set(["QB", "RB", "WR", "TE"]);
    const scoreOf = (id) => {
      const rec = gradeData?.[String(id)];
      const s = isSF ? rec?.["superflex-rank"] : rec?.rank;
      return Number.isFinite(s) ? Number(s) : Infinity; // lower is better
    };
    const blockQB = qbGrade >= 8;
    const blockTE = teGrade >= 8;

    const cands = [];
    for (const [id, p] of Object.entries(playersById)) {
      const pid = String(id);
      if (rosteredIds.has(pid)) continue; // FREE AGENT (not rostered anywhere)
      const POS = String(
        (Array.isArray(p.fantasy_positions) && p.fantasy_positions[0]) || p.position || ""
      ).toUpperCase();
      if (!ALLOWED.has(POS)) continue;
      if ((POS === "QB" && blockQB) || (POS === "TE" && blockTE)) continue;

      const team = (p.team || p.pro_team || p.team_abbr || "").toUpperCase();
      if (!team) continue;

      const sc = scoreOf(pid);
      if (!Number.isFinite(sc)) continue;

      cands.push({ id: pid, pos: POS, team, score: sc, name: fullNameOf(p) });
    }
    cands.sort((a, b) => a.score - b.score);
    return cands.slice(0, 3);
  }, [playersById, rosteredIds, isSF, qbGrade, teGrade]);

  // ---------- Overrides: show exact players (in given order) ----------
  const overrideTop = useMemo(() => {
    const ids = (overrideIds || []).map(String).filter(Boolean).slice(0, 3);
    if (!ids.length) return null;
    const rows = [];
    for (const id of ids) {
      const p = playersById[id];
      if (!p) continue;
      const pos = (Array.isArray(p.fantasy_positions) ? p.fantasy_positions[0] : p.position || '').toUpperCase();
      if (!['QB','RB','WR','TE'].includes(pos)) continue;
      const team = (p.team || p.pro_team || p.team_abbr || '').toUpperCase();
      const name = fullNameOf(p);
      rows.push({ id, pos, team, name });
    }
    return rows.length ? rows : null;
  }, [overrideIds, playersById]);

  const list = overrideTop || autoTop3;

  if (error || loading || !list.length) return null;

  return (
    <div className="waiver-priorities">
      <div className="waiver-stack">
        {list.map((p, i) => (
          <div key={`${p.id}-${i}`} className={`waiver-card ${posClass(p.pos)}`}>
            <div className="waiver-left">
              <div className="waiver-rank">#{i + 1}</div>
            </div>

            <div className={`waiver-right ${posClass(p.pos)}`}>
              <div className="waiver-media">
                {teamLogo(p.team) && (
                  <img className="waiver-logo" src={teamLogo(p.team)} alt={p.team} />
                )}
                <div className="waiver-headshot-bg">
                  <img
                    className="waiver-headshot"
                    src={headshot(p.id)}
                    alt=""
                    loading="lazy"
                    onError={(e) => { e.currentTarget.style.visibility = "hidden"; }}
                  />
                </div>
              </div>

              <div className="waiver-info">
                <div className="waiver-name" title={p.name.toUpperCase()}>
                  {shortName(p.name)}
                </div>
                <div className="waiver-details">{p.pos} – {p.team}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- helpers ---------------- */

function fullNameOf(p) {
  return p?.full_name || `${p?.first_name || ""} ${p?.last_name || ""}`.trim() || "—";
}
function shortName(name) {
  const parts = String(name || "").trim().split(/\s+/);
  if (!parts.length) return "—";
  const first = parts[0] || "", last = parts.slice(1).join(" ");
  return last ? `${first[0]}. ${last}`.toUpperCase() : first.toUpperCase();
}
function headshot(id) {
  return `https://sleepercdn.com/content/nfl/players/thumb/${id}.jpg`;
}
// EXACTLY match Starters’ asset resolution; include a few legacy aliases
function teamLogo(team) {
  const ALIAS = { JAC: "JAX", LA: "LAR", OAK: "LV", SD: "LAC", STL: "LAR", WAS: "WAS", WSH: "WAS" };
  const code = (team || "").toUpperCase();
  const key = (ALIAS[code] || code).toLowerCase();
  try {
    return new URL(`../../assets/standard/${key}.png`, import.meta.url).href;
  } catch {
    return ""; // hide if not found
  }
}
function posClass(pos) {
  const P = String(pos || "").toLowerCase();
  return P === "qb" ? "pos-qb"
       : P === "rb" ? "pos-rb"
       : P === "wr" ? "pos-wr"
       : P === "te" ? "pos-te"
       : "pos-bench";
}
