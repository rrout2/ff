// /src/weekly/weeklyboard/weeklyboard.jsx
import React, { useMemo, useState, useEffect } from "react";
import weeklyBase from "./weekly-base.png";
import TeamName from "../team-name/TeamName.jsx";
import LeagueSettings from "../league-settings/LeagueSettings.jsx";
import StartersWeekly from "../starting-lineup/StartersWeekly.jsx";

// Reuse redraft Sleeper API helpers
import {
  getLeagueSettings,
  fetchLeagueUsers,
  fetchLeagueRosters,
  fetchPlayersMap,
  findOwnerUserId,
  buildStartingLineup,
} from "../../redraft/sleeper-league/sleeperAPI.js";

function useQuery() {
  return useMemo(() => {
    const sp = new URLSearchParams(window.location.search);
    return {
      leagueId: (sp.get("leagueId") || "").trim(),
      teamName: (sp.get("teamName") || "TEAM NAME").trim(),
    };
  }, []);
}

export default function WeeklyBoard() {
  const { leagueId, teamName } = useQuery();

  // scaffold (same pattern as whiteboard)
  const [settings, setSettings] = useState({
    teams: 12,
    ppr: true,
    tepValue: 0,
    positions: { qb: 1, rb: 2, wr: 2, te: 1, flex: 2, def: 1, k: 1, bench: 6 },
  });
  const [playersById, setPlayersById] = useState({});
  const [rosterIds, setRosterIds] = useState([]);
  const [lineup, setLineup] = useState([]); // built starters only
  const [ownerId, setOwnerId] = useState(null);
  const [loading, setLoading] = useState(!!leagueId);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!leagueId) return;

      try {
        setLoading(true);
        setError(null);

        // league settings
        const s = await getLeagueSettings(leagueId);
        if (cancelled) return;
        setSettings(s);

        // users / rosters / players
        const [users, rosters, playersMap] = await Promise.all([
          fetchLeagueUsers(leagueId),
          fetchLeagueRosters(leagueId),
          fetchPlayersMap(),
        ]);
        if (cancelled) return;

        const oid = findOwnerUserId(users, teamName);
        setOwnerId(oid);

        const myRoster = rosters.find((r) => String(r.owner_id) === String(oid));
        const ids = myRoster?.players || [];
        setRosterIds(ids);
        setPlayersById(playersMap);

        // build starting lineup (QB→RB→WR→TE→FLEX; no DEF/K)
        if (ids.length) {
          const built = buildStartingLineup(s.positions, ids, playersMap);
          setLineup(built);
        } else {
          setLineup([]);
        }
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load weekly data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [leagueId, teamName]);

  return (
    <div
      style={{
        background: "#f6f6f6",
        minHeight: "100vh",
        display: "grid",
        placeItems: "start center",
        padding: 20,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "1920px",
          height: "1080px",
          backgroundImage: `url(${weeklyBase})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top left",
          overflow: "hidden",
        }}
      >
        {/* === Team Name (your current settings) === */}
        <div style={{ position: "absolute", top: 80, left: 40, zIndex: 5 }}>
          <TeamName
            text={teamName}
            maxWidth={900}
            maxFont={80}
            minFont={20}
            color="#fff"
            baselineAlign
            baselineRatio={0.78}
          />
        </div>

        {/* === League Settings === */}
        <div
          style={{
            position: "absolute",
            top: 155,                 // tweak for your PNG
            left: 40,
            transform: "scale(0.8)",
            transformOrigin: "top left",
            zIndex: 4,
          }}
        >
          {loading ? (
            <div style={{ fontFamily: "Arial, sans-serif", color: "#fff" }}>Loading league…</div>
          ) : error ? (
            <div style={{ fontFamily: "Arial, sans-serif", color: "crimson" }}>{error}</div>
          ) : (
            <LeagueSettings settings={settings} />
          )}
        </div>

        {/* === Starters (VERTICAL, NO BENCH) === */}
        <div
          style={{
            position: "absolute",
            top: 280,        // place within your "Recommended Lineup" area
            left: -60,
            width: 600,      // single column width; matches 300px card + gutter if you scale
            transform: "scale(1.2)",
            transformOrigin: "top left",
            zIndex: 4,
          }}
        >
          {!loading && !error && (
            <StartersWeekly
              lineup={lineup}
              rosterIds={rosterIds}
              playersById={playersById}
              targetHeight={600}
              rowHeight={68}
              minGap={10}
            />
          )}
        </div>

        {/* HUD (optional) */}
        <div
          style={{
            position: "absolute",
            right: 12,
            top: 12,
            background: "rgba(255,255,255,.9)",
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: "6px 8px",
            fontSize: 12,
            zIndex: 9,
          }}
        >
          <div><strong>leagueId:</strong> {leagueId || "—"}</div>
          <div><strong>teamName:</strong> {teamName || "—"}</div>
          <div><strong>ownerId:</strong> {ownerId || "—"}</div>
          <div><strong>roster:</strong> {rosterIds?.length ?? 0}</div>
          <div><strong>loading:</strong> {String(loading)}</div>
          {error && <div style={{ color: "crimson" }}><strong>err:</strong> {error}</div>}
        </div>
      </div>
    </div>
  );
}
