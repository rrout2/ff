// ---------------------------------------------------------------------------
// League settings
// ---------------------------------------------------------------------------

/** Fetch raw league object from Sleeper. */
export async function fetchLeagueRaw(leagueId) {
  const res = await fetch(`${BASE}/league/${leagueId}`);
  if (!res.ok) throw new Error(`League ${leagueId} not found`);
  return res.json();
}

/**
 * Map Sleeper league -> UI shape
 * Returns:
 * {
 *   teams: number,
 *   ppr: boolean,
 *   tepValue: number,
 *   positions: { qb, rb, wr, te, flex, superflex, def, k, bench }
 *   isSuperflex: boolean,
 *   isTwoQB: boolean
 * }
 */
export async function getLeagueSettings(leagueId) {
  const league = await fetchLeagueRaw(leagueId);

  // PPR & TE premium
  const scoring = league?.scoring_settings || {};
  const pprNum = Number(scoring.rec ?? 0);
  const tePremiumNum = Number(
    scoring.te_rec ?? scoring.bonus_rec_te ?? scoring.rec_te ?? 0
  );

  // Roster positions array like: ["QB","RB","RB","WR","WR","TE","FLEX","SUPER_FLEX","BN","BN",...]
  const rp = Array.isArray(league?.roster_positions) ? league.roster_positions : [];
  const count = (key) => rp.filter((p) => p === key).length;

  // Helpers to robustly identify FLEX types by their label
  const isSuperFlexKey = (key) => {
    const raw = String(key || "").toUpperCase();
    if (raw === "SUPER_FLEX") return true;
    // handle odd strings like "FLEX (Q/W/R/T)" variants
    const clean = raw.replace(/[^A-Z]/g, ""); // drop slashes/spaces/parens
    // must contain Q, W, R, T (i.e., QB/WR/RB/TE)
    return clean.includes("Q") && clean.includes("W") && clean.includes("R") && clean.includes("T");
  };

  const isWrtFlexKey = (key) => {
    const raw = String(key || "").toUpperCase();
    if (raw === "FLEX") return true; // Sleeper's base FLEX is W/R/T
    const clean = raw.replace(/[^A-Z]/g, "");
    // W/R/T but NOT Q
    const hasW = clean.includes("W");
    const hasR = clean.includes("R");
    const hasT = clean.includes("T");
    const hasQ = clean.includes("Q");
    return hasW && hasR && hasT && !hasQ;
  };

  const superflex = rp.filter(isSuperFlexKey).length;
  const flex = rp.filter(isWrtFlexKey).length;

  const positions = {
    qb: count("QB"),
    rb: count("RB"),
    wr: count("WR"),
    te: count("TE"),
    flex,                 // W/R/T only
    superflex,            // Q/W/R/T (aka Superflex)
    def: count("DEF") + count("DST"),
    k: count("K"),
    bench: count("BN"),
  };

  const isTwoQB = Number(league?.settings?.qb_count ?? 0) > 1;

  return {
    teams: Number(league?.total_rosters ?? league?.teams ?? 0),
    ppr: pprNum > 0,
    tepValue: tePremiumNum,
    positions,
    isSuperflex: superflex > 0,
    isTwoQB,
    // keep the old field if anything else references it
    flex_qb: isTwoQB ? 1 : 0,
  };
}
