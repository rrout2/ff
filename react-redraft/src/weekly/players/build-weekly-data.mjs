import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

/* ------------------- paths ------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const DIR_PLAYERS   = __dirname; // src/weekly/players
const F_PLAYERS     = path.join(DIR_PLAYERS, "players-by-id-weekly.json");
const F_WEEKLY_CSV  = path.join(DIR_PLAYERS, "weekly.csv");
const F_LIGHTS_CSV  = path.join(DIR_PLAYERS, "lights.csv");

const OUT_1QB_ENR   = path.join(DIR_PLAYERS, "weekly-1qb.enriched.json");
const OUT_SF_ENR    = path.join(DIR_PLAYERS, "weekly-sf.enriched.json");
const OUT_LIGHTS    = path.join(DIR_PLAYERS, "lights.json"); // still write merged lights by id

/* ------------------- tiny csv ------------------- */
function parseCSV(text) {
  const lines = String(text).split(/\r?\n/).filter((l) => l.trim() !== "");
  if (!lines.length) return { header: [], rows: [] };
  const header = lines[0].split(",").map((s) => s.trim());
  const rows = lines.slice(1).map((l) => l.split(",").map((s) => s.trim()));
  return { header, rows };
}

/* -------------- normalization helpers -------------- */
const TEAM_NAME_TO_ABBR = {
  cardinals:"ARI", falcons:"ATL", ravens:"BAL", bills:"BUF", panthers:"CAR", bears:"CHI",
  bengals:"CIN", browns:"CLE", cowboys:"DAL", broncos:"DEN", lions:"DET", packers:"GB",
  texans:"HOU", colts:"IND", jaguars:"JAX", chiefs:"KC", raiders:"LV", chargers:"LAC",
  rams:"LAR", dolphins:"MIA", vikings:"MIN", patriots:"NE", saints:"NO", giants:"NYG",
  jets:"NYJ", eagles:"PHI", steelers:"PIT", "49ers":"SF", niners:"SF", seahawks:"SEA",
  buccaneers:"TB", bucs:"TB", titans:"TEN", commanders:"WSH", washington:"WSH"
};
const SUFFIX_RE = /\b(jr|sr|ii|iii|iv|v)\b$/i;

const normTeamName = (t) => {
  const k = String(t || "").toLowerCase().trim();
  return TEAM_NAME_TO_ABBR[k] || TEAM_NAME_TO_ABBR[k.replace(/s$/, "")] || k.toUpperCase();
};

const normNameRaw = (s) =>
  String(s || "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // diacritics
    .replace(/[’']/g, "")                             // apostrophes
    .replace(/[.,-]/g, " ")                           // punctuation → space
    .replace(/\s+/g, " ").trim()
    .replace(SUFFIX_RE, "").trim()
    .toLowerCase();

const firstInitial = (s) => {
  const t = normNameRaw(s).split(" ").filter(Boolean);
  return t.length ? t[0][0] : "";
};
const lastName = (s) => {
  const t = normNameRaw(s).split(" ").filter(Boolean);
  return t.length ? t[t.length - 1] : "";
};

const normPos  = (p) => String(p || "").toUpperCase();
const normTeam = (t) => String(t || "").toUpperCase();

/* ----------------- players index (robust) ----------------- */
function getName(p) {
  return p.full_name || p.name || [p.first_name, p.last_name].filter(Boolean).join(" ") || "";
}
function getPos(p) {
  const fp = Array.isArray(p.fantasy_positions) ? p.fantasy_positions[0] : undefined;
  return normPos(p.position || fp || "");
}
function getTeam(p) {
  return normTeam(p.team || p.pro_team || p.team_abbr || "");
}

function buildPlayerIndex(playersById) {
  const byFull = new Map();        // "fullname" -> [{id,pos,team}]
  const byFullPos = new Map();     // "fullname|pos"
  const byFullTeamPos = new Map(); // "fullname|team|pos"
  const byLastFI = new Map();      // "lastname|f"

  for (const [id, p] of Object.entries(playersById || {})) {
    const name = getName(p);
    if (!name) continue;
    const pos  = getPos(p);
    const team = getTeam(p);

    const keyFull = normNameRaw(name);
    const kFP  = `${keyFull}|${pos}`;
    const kFTP = `${keyFull}|${team}|${pos}`;
    const fi   = firstInitial(name);
    const ln   = lastName(name);
    const kLFI = `${ln}|${fi}`;

    const payload = { id: String(id), pos, team, name };

    (byFull.get(keyFull) || byFull.set(keyFull, []).get(keyFull)).push(payload);
    (byFullPos.get(kFP) || byFullPos.set(kFP, []).get(kFP)).push(payload);
    (byFullTeamPos.get(kFTP) || byFullTeamPos.set(kFTP, []).get(kFTP)).push(payload);
    (byLastFI.get(kLFI) || byLastFI.set(kLFI, []).get(kLFI)).push(payload);
  }
  return { byFull, byFullPos, byFullTeamPos, byLastFI };
}

/* ----------------- lights maps ----------------- */
function buildLightsFromCSV(text) {
  const { header, rows } = parseCSV(text);

  const cName = header.findIndex((h) => /player\s*name/i.test(h));
  const cTeam = header.findIndex((h) => /player\s*team/i.test(h));
  const cPos  = header.findIndex((h) => /^pos|position$/i.test(h));
  const cM    = header.findIndex((h) => /matchup/i.test(h));
  const cV    = header.findIndex((h) => /vegas/i.test(h));
  const cO    = header.findIndex((h) => /offense/i.test(h));

  if ([cName, cTeam, cPos, cM, cV, cO].some((i) => i < 0)) {
    throw new Error(`lights.csv must include: Player Name, Player Team, Position, Matchup, Vegas, Offense. Found: ${header.join(", ")}`);
  }

  const byKey = new Map(); // "nameKey|TEAM|POS" -> {matchup, vegas, offense}
  const byName = new Map(); // nameKey -> array of rows

  for (const r of rows) {
    const name = r[cName];
    const team = normTeamName(r[cTeam]);
    const pos  = normPos(r[cPos]);
    const lights = { matchup: r[cM]?.toUpperCase(), vegas: r[cV]?.toUpperCase(), offense: r[cO]?.toUpperCase() };

    const keyName = normNameRaw(name);
    const key = `${keyName}|${team}|${pos}`;

    byKey.set(key, lights);
    (byName.get(keyName) || byName.set(keyName, []).get(keyName)).push({ team, pos, lights });
  }
  return { byKey, byName };
}

/* ------------- try to resolve an id + team/pos ------------- */
function resolvePlayer(payload, name, idx, lightsByName) {
  const keyName = normNameRaw(name);
  const candFull = idx.byFull.get(keyName) || [];

  if (candFull.length === 1) return candFull[0];

  // if multiple, try to use lights' unique record to decide (team/pos)
  const lrows = lightsByName.get(keyName) || [];
  if (lrows.length === 1) {
    const { team, pos } = lrows[0];
    const hit = (idx.byFullTeamPos.get(`${keyName}|${team}|${pos}`) || [])[0]
      || (idx.byFullPos.get(`${keyName}|${pos}`) || [])[0]
      || candFull[0];
    if (hit) return hit;
  }

  // last-name + first initial
  const fi = firstInitial(name);
  const ln = lastName(name);
  const kLFI = `${ln}|${fi}`;
  const lfi = (idx.byLastFI.get(kLFI) || [])[0];
  if (lfi) return lfi;

  // give up (keep null id; we'll still include rank+lights)
  return { id: null, pos: payload?.pos || null, team: payload?.team || null, name };
}

/* -------------------- main builder -------------------- */
async function main() {
  const [playersRaw, weeklyRaw, lightsRaw] = await Promise.all([
    fs.readFile(F_PLAYERS, "utf8"),
    fs.readFile(F_WEEKLY_CSV, "utf8"),
    fs.readFile(F_LIGHTS_CSV, "utf8"),
  ]);

  const playersById = JSON.parse(playersRaw);
  const idx = buildPlayerIndex(playersById);

  // lights maps
  const { byKey: lightsByKey, byName: lightsByName } = buildLightsFromCSV(lightsRaw);

  // also keep a final lights-by-id export for convenience (we fill it when id is known)
  const lightsById = {};

  // weekly.csv
  const parsed = parseCSV(weeklyRaw);
  const cRank  = parsed.header.findIndex((h) => /^rank$/i.test(h));
  const cQB    = parsed.header.findIndex((h) => /^1\s*qb$/i.test(h));
  const cSF    = parsed.header.findIndex((h) => /^sf$/i.test(h));
  if (cRank < 0 || cQB < 0 || cSF < 0) {
    throw new Error(`weekly.csv header must be: Rank,1QB,SF  (found: ${parsed.header.join(", ")})`);
  }

  const oneQB = [];
  const sf    = [];

  function attachEntry(rank, name) {
    if (!name) return null;

    // resolve id/team/pos if possible
    const resolved = resolvePlayer(null, name, idx, lightsByName);
    const id   = resolved?.id ? String(resolved.id) : null;
    const pos  = resolved?.pos || null;
    const team = resolved?.team || null;

    // attach lights:
    // 1) by id → if id later known, we'll export lightsById
    // 2) by name|team|pos
    // 3) by unique name in lights
    // 4) fallback YELLOWs
    let lights = null;
    if (id && playersById[id]?.weekly?.lights) {
      lights = { ...playersById[id].weekly.lights };
      lightsById[id] = lights;
    }
    if (!lights) {
      const keyName = normNameRaw(name);
      const key = `${keyName}|${team || ""}|${pos || ""}`;
      lights = lightsByKey.get(key) || null;
    }
    if (!lights) {
      const rows = lightsByName.get(normNameRaw(name)) || [];
      if (rows.length === 1) lights = rows[0].lights;
    }
    if (!lights) {
      lights = { matchup: "YELLOW", vegas: "YELLOW", offense: "YELLOW" };
    }

    return { rank: Number(rank), id, name, team, pos, lights };
  }

  for (const r of parsed.rows) {
    const rank = r[cRank];

    const qbName = r[cQB];
    const qbRow  = attachEntry(rank, qbName);
    if (qbRow) oneQB.push(qbRow);

    const sfName = r[cSF];
    const sfRow  = attachEntry(rank, sfName);
    if (sfRow) sf.push(sfRow);
  }

  // Write enriched ranking files — every CSV row present with rank/name/lights
  await fs.writeFile(OUT_1QB_ENR, JSON.stringify(oneQB, null, 2), "utf8");
  await fs.writeFile(OUT_SF_ENR,  JSON.stringify(sf,    null, 2), "utf8");

  // Optional convenience: lights by id (only entries where id resolved)
  await fs.writeFile(OUT_LIGHTS, JSON.stringify(lightsById, null, 2), "utf8");

  console.log(`✅ Wrote:\n  ${path.relative(process.cwd(), OUT_1QB_ENR)} (${oneQB.length})\n  ${path.relative(process.cwd(), OUT_SF_ENR)} (${sf.length})\n  ${path.relative(process.cwd(), OUT_LIGHTS)} (ids=${Object.keys(lightsById).length})`);
}

main().catch((err) => {
  console.error("❌ build-weekly-data failed:", err);
  process.exit(1);
});
