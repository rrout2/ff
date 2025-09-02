// src/redraft/sleeper-league/sleeperAPI.js

// ---------------------------------------------------------------------------
// Base config
// ---------------------------------------------------------------------------
export const BASE = 'https://api.sleeper.app/v1';
export const SPORT = 'nfl';

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
 *   positions: { qb, rb, wr, te, flex, superflex, def, k, bench },
 *   isSuperflex: boolean,
 *   isTwoQB: boolean,
 *   flex_qb: 0|1   // kept for backward compat
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

  // Roster positions array like:
  // ["QB","RB","RB","WR","WR","TE","FLEX","SUPER_FLEX","BN","BN",...]
  const rp = Array.isArray(league?.roster_positions) ? league.roster_positions : [];
  const count = (key) => rp.filter((p) => p === key).length;

  // Robust detection for Superflex vs normal FLEX based on label content.
  // Sleeper typically uses "SUPER_FLEX" for Q/W/R/T, but handle UI-style text too.
  const isSuperFlexKey = (key) => {
    const raw = String(key || '').toUpperCase();
    if (raw === 'SUPER_FLEX') return true;
    // e.g., "FLEX (Q/W/R/T)" or variants
    const clean = raw.replace(/[^A-Z]/g, ''); // drop non-letters
    // must contain Q, W, R, T (i.e., QB/WR/RB/TE)
    return clean.includes('Q') && clean.includes('W') && clean.includes('R') && clean.includes('T');
  };

  const isWrtFlexKey = (key) => {
    const raw = String(key || '').toUpperCase();
    if (raw === 'FLEX') return true; // Sleeper's base W/R/T
    // e.g., "FLEX (W/R/T)" or "WRRBTE" style
    const clean = raw.replace(/[^A-Z]/g, '');
    const hasW = clean.includes('W');
    const hasR = clean.includes('R');
    const hasT = clean.includes('T');
    const hasQ = clean.includes('Q');
    return hasW && hasR && hasT && !hasQ;
  };

  const superflex = rp.filter(isSuperFlexKey).length;
  const flex = rp.filter(isWrtFlexKey).length;

  const positions = {
    qb: count('QB'),
    rb: count('RB'),
    wr: count('WR'),
    te: count('TE'),
    flex,                 // W/R/T only
    superflex,            // Q/W/R/T (Superflex)
    def: count('DEF') + count('DST'),
    k: count('K'),
    bench: count('BN'),
  };

  // Some leagues set settings.qb_count > 1 for true 2QB formats
  const isTwoQB = Number(league?.settings?.qb_count ?? 0) > 1;

  return {
    teams: Number(league?.total_rosters ?? league?.teams ?? 0),
    ppr: pprNum > 0,
    tepValue: tePremiumNum,
    positions,
    isSuperflex: superflex > 0,
    isTwoQB,
    // keep old field for any legacy references
    flex_qb: isTwoQB ? 1 : 0,
  };
}

// ---------------------------------------------------------------------------
// Users / Rosters / Players
// ---------------------------------------------------------------------------

export async function fetchLeagueUsers(leagueId) {
  const res = await fetch(`${BASE}/league/${leagueId}/users`);
  if (!res.ok) throw new Error('Failed to load users');
  return res.json();
}

export async function fetchLeagueRosters(leagueId) {
  const res = await fetch(`${BASE}/league/${leagueId}/rosters`);
  if (!res.ok) throw new Error('Failed to load rosters');
  return res.json();
}

/** Big map of players keyed by Sleeper player_id */
export async function fetchPlayersMap() {
  const res = await fetch(`${BASE}/players/${SPORT}`);
  if (!res.ok) throw new Error('Failed to load players');
  return res.json(); // { [player_id]: {...} }
}

/**
 * Find owner's user_id given team name, @handle (username), or display name.
 * Accepts values like "Weezy Babies", "CJ Tags", or "@cjtags".
 */
export function findOwnerUserId(users, teamOrHandle) {
  const norm = (s) =>
    String(s || '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ');

  const wantedRaw = String(teamOrHandle || '').trim();
  const wanted = norm(wantedRaw);
  const wantedHandle = wanted.startsWith('@') ? wanted.slice(1) : wanted;

  // Exact match pass (team name, display name, username)
  for (const u of users || []) {
    const teamName = norm(u?.metadata?.team_name);
    const display  = norm(u?.display_name);
    const username = norm(u?.username);
    if (
      wanted === teamName ||
      wanted === display ||
      wanted === username ||
      wantedHandle === username
    ) {
      return u?.user_id ?? null;
    }
  }

  // Loose contains match on team/display (helps with punctuation/spacing)
  for (const u of users || []) {
    const teamName = norm(u?.metadata?.team_name);
    const display  = norm(u?.display_name);
    if ((teamName && teamName.includes(wanted)) || (display && display.includes(wanted))) {
      return u?.user_id ?? null;
    }
  }

  // If caller already passed a numeric user_id string
  if (/^\d+$/.test(wantedRaw) && (users || []).some(u => String(u.user_id) === String(wantedRaw))) {
    return wantedRaw;
  }
  return null;
}

// ---------------------------------------------------------------------------
// Build a starting lineup from roster + positions
// ---------------------------------------------------------------------------

/**
 * Build a starting lineup array from roster + league positions.
 * Fills: QB, RB, RB, WR, WR, TE, SFLEX..., FLEX..., DEF, K.
 * SUPERFLEX considers the best of QB/RB/WR/TE; FLEX is W/R/T only.
 *
 * @param {{qb:number,rb:number,wr:number,te:number,flex:number,superflex?:number,sflex?:number,def:number,k:number}} positions
 * @param {string[]} rosterIds - Sleeper player_ids from the roster
 * @param {Record<string, any>} playersById - player_id -> player object
 * @returns {{slot:string, player:any|null}[]}
 */
export function buildStartingLineup(positions, rosterIds, playersById) {
  const pool = { QB: [], RB: [], WR: [], TE: [], DEF: [], K: [] };

  for (const pid of rosterIds || []) {
    const p = playersById[pid];
    if (!p) continue;
    const pos = Array.isArray(p.fantasy_positions) ? p.fantasy_positions[0] : p.position;
    if (pool[pos]) pool[pos].push(p);
  }

  // Naive quality score: lower is better
  const score = (p) =>
    (p?.adp_half_ppr || p?.adp || 9999) + (p?.search_rank ? p.search_rank / 10000 : 0);

  for (const k of Object.keys(pool)) pool[k].sort((a, b) => score(a) - score(b));

  const take = (pos) => (pool[pos] && pool[pos].shift()) || null;
  const lineup = [];
  const push = (slot, player) => lineup.push({ slot, player });

  // Core slots
  for (let i = 0; i < (positions?.qb || 0); i++) push('QB', take('QB'));
  for (let i = 0; i < (positions?.rb || 0); i++) push('RB', take('RB'));
  for (let i = 0; i < (positions?.wr || 0); i++) push('WR', take('WR'));
  for (let i = 0; i < (positions?.te || 0); i++) push('TE', take('TE'));

  // SUPERFLEX (Q/W/R/T) – do this BEFORE normal FLEX to give QBs a chance
  const sflexCount = Number(positions?.sflex ?? positions?.superflex ?? 0);
  for (let i = 0; i < sflexCount; i++) {
    const candidates = [pool.QB[0], pool.RB[0], pool.WR[0], pool.TE[0]].filter(Boolean);
    candidates.sort((a, b) => score(a) - score(b));
    const pick = candidates[0] || null;
    if (pick) {
      const pos = (pick.fantasy_positions?.[0]) || pick.position;
      pool[pos]?.shift();
    }
    push('SFLEX', pick);
  }

  // FLEX (W/R/T) – no QBs here
  for (let i = 0; i < (positions?.flex || 0); i++) {
    const candidates = [pool.RB[0], pool.WR[0], pool.TE[0]].filter(Boolean);
    candidates.sort((a, b) => score(a) - score(b));
    const pick = candidates[0] || null;
    if (pick) {
      const pos = (pick.fantasy_positions?.[0]) || pick.position;
      pool[pos]?.shift();
    }
    push('FLEX', pick);
  }

  // DEF and K
  for (let i = 0; i < (positions?.def || 0); i++) push('DEF', take('DEF'));
  for (let i = 0; i < (positions?.k || 0); i++) push('K', take('K'));

  return lineup; // [{slot:'QB', player:{...}|null}, ...]
}

// ---------------------------------------------------------------------------
// Drafts & picks
// ---------------------------------------------------------------------------

export async function fetchLeagueDrafts(leagueId) {
  const r = await fetch(`${BASE}/league/${leagueId}/drafts`);
  if (!r.ok) throw new Error('Failed to fetch drafts');
  return r.json(); // array, newest first
}

export async function fetchDraftPicks(draftId) {
  // Sleeper uses /draft/<id>/picks; try /drafts/ as fallback
  let r = await fetch(`${BASE}/draft/${draftId}/picks`);
  if (!r.ok) r = await fetch(`${BASE}/drafts/${draftId}/picks`);
  if (!r.ok) throw new Error('Failed to fetch draft picks');
  return r.json(); // array of picks
}

// Optional helpers (used for debugging / utilities)
export async function getLatestDraftId(leagueId) {
  const drafts = await fetchLeagueDrafts(leagueId);
  const d = Array.isArray(drafts) && drafts.length ? drafts[0] : null;
  return d?.draft_id || d?.id || null;
}

export function overallPick({ round, pick }, teams) {
  return (Number(round) - 1) * Number(teams) + Number(pick);
}
