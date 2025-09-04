import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const DIR          = __dirname; // src/weekly/players
const F_1QB        = path.join(DIR, "weekly-1qb.json");       // base rankings
const F_SF         = path.join(DIR, "weekly-sf.json");
const F_WEEKLY_CSV = path.join(DIR, "weekly.csv");            // Rank,1QB,SF
const F_LIGHTS     = path.join(DIR, "lights.json");           // id -> lights
const F_LIGHTS_CSV = path.join(DIR, "lights.csv");            // name/team/pos lights
const F_PLAYERS    = path.join(DIR, "players-by-id-weekly.json");

const OUT_1QB      = path.join(DIR, "weekly-1qb.enriched.json");
const OUT_SF       = path.join(DIR, "weekly-sf.enriched.json");

const IN_PLACE     = process.argv.includes("--in-place");

/* ---------- CSV parser (supports quoted commas) ---------- */
function parseCSV(text) {
  const rows = [];
  let field = "", inQ = false, row = [];
  const pushField = () => { row.push(field); field = ""; };
  for (const ch of (text || "").replace(/\r/g, "") + "\n") {
    if (ch === '"') { inQ = !inQ; continue; }
    if (!inQ && ch === ",") { pushField(); continue; }
    if (!inQ && ch === "\n") { pushField(); if (row.some(c => c.trim() !== "")) rows.push(row.map(s => s.trim())); row = []; continue; }
    field += ch;
  }
  if (!rows.length) return { header: [], rows: [] };
  const header = rows[0]; rows.shift();
  return { header, rows };
}

/* ---------- normalization helpers ---------- */
const TEAM_NAME_TO_ABBR = {
  cardinals:"ARI", falcons:"ATL", ravens:"BAL", bills:"BUF", panthers:"CAR", bears:"CHI",
  bengals:"CIN", browns:"CLE", cowboys:"DAL", broncos:"DEN", lions:"DET", packers:"GB",
  texans:"HOU", colts:"IND", jaguars:"JAX", chiefs:"KC", raiders:"LV", chargers:"LAC",
  rams:"LAR", dolphins:"MIA", vikings:"MIN", patriots:"NE", saints:"NO", giants:"NYG",
  jets:"NYJ", eagles:"PHI", steelers:"PIT", "49ers":"SF", niners:"SF", seahawks:"SEA",
  buccaneers:"TB", bucs:"TB", titans:"TEN", commanders:"WSH", washington:"WSH"
};
const HYPHENS = /[\u2010\u2011\u2012\u2013\u2014\u2015\u2212\u2043\uFE58\uFE63\uFF0D-]/g; // all hyphen/dash forms
const SUFFIX_RE = /\b(jr|sr|ii|iii|iv|v)\b$/i;

const normTeamName = (t) => {
  const k = String(t || "").toLowerCase().trim();
  return TEAM_NAME_TO_ABBR[k] || TEAM_NAME_TO_ABBR[k.replace(/s$/, "")] || k.toUpperCase();
};
const normTeam = (t) => String(t || "").toUpperCase();
const normPos  = (p) => String(p || "").toUpperCase();
const normNameRaw = (s) =>
  String(s || "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")   // diacritics
    .replace(/[’']/g, "")                               // curly/straight quotes
    .replace(HYPHENS, " ")                              // any dash → space
    .replace(/[.,]/g, " ")                              // punctuation → space
    .replace(/\s+/g, " ").trim()
    .replace(SUFFIX_RE, "").trim()
    .toLowerCase();

/* ---------- players index by normalized full name ---------- */
function getPlayerName(p) {
  return p?.full_name || p?.name || [p?.first_name, p?.last_name].filter(Boolean).join(" ") || "";
}
function getPosFromPlayers(players, id) {
  const p = players?.[id];
  const fp = Array.isArray(p?.fantasy_positions) ? p.fantasy_positions[0] : undefined;
  return normPos(p?.position || fp || "");
}
function getTeamFromPlayers(players, id) {
  const p = players?.[id];
  return normTeam(p?.team || p?.pro_team || p?.team_abbr || "");
}
function buildPlayerIndex(players) {
  const byFull = new Map();        // "fullname" -> [{id,pos,team}]
  for (const [id, p] of Object.entries(players || {})) {
    const name = getPlayerName(p); if (!name) continue;
    const key  = normNameRaw(name);
    const pos  = getPosFromPlayers(players, id);
    const team = getTeamFromPlayers(players, id);
    (byFull.get(key) || byFull.set(key, []).get(key)).push({ id: String(id), pos, team, name });
  }
  return { byFull };
}

/* ---------- lights.csv → byKey/byName ---------- */
function buildLightsFromCSV(text) {
  const { header, rows } = parseCSV(text);
  const cName = header.findIndex(h => /player\s*name/i.test(h));
  const cTeam = header.findIndex(h => /player\s*team/i.test(h));
  const cPos  = header.findIndex(h => /^pos|position$/i.test(h));
  const cM    = header.findIndex(h => /matchup/i.test(h));
  const cV    = header.findIndex(h => /vegas/i.test(h));
  const cO    = header.findIndex(h => /offense/i.test(h));
  if ([cName,cTeam,cPos,cM,cV,cO].some(i => i < 0)) return { byKey:new Map(), byName:new Map() };

  const byKey = new Map();  // "nameKey|TEAM|POS" -> lights
  const byName = new Map(); // nameKey -> [{team,pos,lights}...]
  for (const r of rows) {
    const name = r[cName];
    const team = normTeamName(r[cTeam]);
    const pos  = normPos(r[cPos]);
    const lights = {
      matchup: String(r[cM] || "").toUpperCase(),
      vegas:   String(r[cV] || "").toUpperCase(),
      offense: String(r[cO] || "").toUpperCase(),
    };
    const kName = normNameRaw(name);
    byKey.set(`${kName}|${team}|${pos}`, lights);
    (byName.get(kName) || byName.set(kName, []).get(kName)).push({ team, pos, lights });
  }
  return { byKey, byName };
}

/* ---------- attach lights to a row ---------- */
function attachLights(row, byIdLights, lightsCsv, playersMap) {
  const id   = String(row?.id ?? row?.playerId ?? "").trim() || null;
  const name = row?.name || "";
  const k    = normNameRaw(name);

  // 1) by id
  if (id && byIdLights[id]) return { ...row, lights: { ...byIdLights[id] } };

  // 2) by name + TEAM + POS
  const team = normTeam(row?.team || (id ? getTeamFromPlayers(playersMap, id) : ""));
  const pos  = normPos(row?.pos  || (id ? getPosFromPlayers(playersMap, id)  : ""));
  if (k && team && pos) {
    const hit = lightsCsv.byKey.get(`${k}|${team}|${pos}`);
    if (hit) return { ...row, lights: { ...hit } };
  }

  // 3) unique name in lights.csv
  const nameRows = lightsCsv.byName.get(k) || [];
  if (nameRows.length === 1) return { ...row, lights: { ...nameRows[0].lights } };

  // 4) fallback
  return { ...row, lights: { matchup: "YELLOW", vegas: "YELLOW", offense: "YELLOW" } };
}

/* ---------- union from weekly.csv so nobody is dropped ---------- */
function unionFromWeeklyCSV(base, columnName, weeklyCsv, playersIdx) {
  const { header, rows } = weeklyCsv;
  const cRank = header.findIndex(h => /^rank$/i.test(h));
  const cCol  = header.findIndex(h => new RegExp(`^${columnName}$`, "i").test(h));
  if (cRank < 0 || cCol < 0) return base;

  const out = [...base];
  const seenRank = new Set(base.map(r => Number(r.rank)));

  for (const r of rows) {
    const rank = Number(r[cRank]);
    const name = r[cCol];
    if (!name) continue;
    if (seenRank.has(rank)) continue;

    const key = normNameRaw(name);
    const full = playersIdx.byFull.get(key) || [];
    const pick = full.length === 1 ? full[0] : null;

    out.push({
      rank,
      id:   pick?.id   || null,
      name,
      team: pick?.team || null,
      pos:  pick?.pos  || null,
    });
    seenRank.add(rank);
  }
  out.sort((a,b) => Number(a.rank)-Number(b.rank));
  return out;
}

/* ---------- IO helpers ---------- */
async function writeJSON(fp, data) { await fs.writeFile(fp, JSON.stringify(data, null, 2), "utf8"); }
async function backupAndOverwrite(fp, data) {
  const bak = `${fp}.bak`;
  const original = await fs.readFile(fp, "utf8");
  await fs.writeFile(bak, original, "utf8");
  await writeJSON(fp, data);
  return bak;
}

/* ---------- main ---------- */
async function main() {
  const [oneQBraw, sfRaw, lightsRaw, playersRaw, weeklyCsvText, lightsCsvText] = await Promise.all([
    fs.readFile(F_1QB, "utf8"),
    fs.readFile(F_SF,  "utf8"),
    fs.readFile(F_LIGHTS, "utf8").catch(() => "{}"),
    fs.readFile(F_PLAYERS, "utf8").catch(() => "{}"),
    fs.readFile(F_WEEKLY_CSV, "utf8"),                 // authoritative source of every rank
    fs.readFile(F_LIGHTS_CSV, "utf8").catch(() => ""), // optional
  ]);

  const ranks1QB   = JSON.parse(oneQBraw);
  const ranksSF    = JSON.parse(sfRaw);
  const byIdLights = JSON.parse(lightsRaw || "{}");
  const playersMap = JSON.parse(playersRaw || "{}");

  const playersIdx = buildPlayerIndex(playersMap);
  const weeklyCsv  = parseCSV(weeklyCsvText);
  const lightsCsv  = lightsCsvText ? buildLightsFromCSV(lightsCsvText) : { byKey: new Map(), byName: new Map() };

  // 1) union from weekly.csv (so dropped names like Jacory Croskey-Merritt are added back)
  const union1QB = unionFromWeeklyCSV(ranks1QB, "1QB", weeklyCsv, playersIdx);
  const unionSF  = unionFromWeeklyCSV(ranksSF,  "SF",  weeklyCsv, playersIdx);

  // 2) attach lights for every row
  const enriched1QB = union1QB.map(r => attachLights(r, byIdLights, lightsCsv, playersMap));
  const enrichedSF  = unionSF .map(r => attachLights(r, byIdLights, lightsCsv, playersMap));

  if (IN_PLACE) {
    const bak1 = await backupAndOverwrite(F_1QB, enriched1QB);
    const bak2 = await backupAndOverwrite(F_SF,  enrichedSF);
    console.log(`✅ In-place updated:
  ${path.relative(process.cwd(), F_1QB)} (backup: ${path.relative(process.cwd(), bak1)})
  ${path.relative(process.cwd(), F_SF)} (backup: ${path.relative(process.cwd(), bak2)})`);
  } else {
    await writeJSON(OUT_1QB, enriched1QB);
    await writeJSON(OUT_SF,  enrichedSF);
    console.log(`✅ Wrote enriched files:
  ${path.relative(process.cwd(), OUT_1QB)}
  ${path.relative(process.cwd(), OUT_SF)}`);
  }

  console.log(`🔎 Rows — 1QB: ${enriched1QB.length}, SF: ${enrichedSF.length}`);
  console.log(`💡 Lights attached — 1QB: ${enriched1QB.filter(r=>r.lights).length}/${enriched1QB.length}, SF: ${enrichedSF.filter(r=>r.lights).length}/${enrichedSF.length}`);
}

main().catch((err) => {
  console.error("❌ enrich-weekly-with-lights failed:", err);
  process.exit(1);
});
