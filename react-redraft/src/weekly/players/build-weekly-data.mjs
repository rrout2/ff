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
const OUT_LIGHTS    = path.join(DIR_PLAYERS, "lights.json"); // lights-by-id (only where id resolved)

/* ------------------- tiny csv ------------------- */
function parseCSV(text) {
  const lines = String(text).split(/\r?\n/).filter((l) => l.trim() !== "");
  if (!lines.length) return { header: [], rows: [] };
  const header = lines[0].split(",").map((s) => s.trim());
  const rows = lines.slice(1).map((l) => l.split(",").map((s) => s.trim()));
  return { header, rows };
}

/* -------------- normalization helpers -------------- */
const SUFFIX_RE = /\b(jr|sr|ii|iii|iv|v)\b$/i;

const normNameRaw = (s) =>
  String(s || "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // diacritics
    .replace(/[’']/g, "")                             // apostrophes
    .replace(/[.,-]/g, " ")                           // punctuation → space
    .replace(/\s+/g, " ").trim()
    .replace(SUFFIX_RE, "").trim()
    .toLowerCase();

const normPos  = (p) => String(p || "").toUpperCase();

/* ----------------- players index (robust) ----------------- */
function getName(p) {
  return p.full_name || p.name || [p.first_name, p.last_name].filter(Boolean).join(" ") || "";
}
function getPos(p) {
  const fp = Array.isArray(p.fantasy_positions) ? p.fantasy_positions[0] : undefined;
  return normPos(p.position || fp || "");
}

function buildPlayerIndex(playersById) {
  const byFull = new Map();        // "fullname" -> [{id,pos}]
  const byFullPos = new Map();     // "fullname|pos"
  for (const [id, p] of Object.entries(playersById || {})) {
    const name = getName(p);
    if (!name) continue;
    const pos  = getPos(p);

    const keyFull = normNameRaw(name);
    const kFP     = `${keyFull}|${pos}`;

    const payload = { id: String(id), pos, name };

    (byFull.get(keyFull) || byFull.set(keyFull, []).get(keyFull)).push(payload);
    (byFullPos.get(kFP) || byFullPos.set(kFP, []).get(kFP)).push(payload);
  }
  return { byFull, byFullPos };
}

/* ----------------- lights maps (name + pos only) ----------------- */
function headerIndex(header, re) {
  return header.findIndex((h) => re.test(h));
}
function buildLightsFromCSV(text) {
  const { header, rows } = parseCSV(text);

  // Accept lax headers (no team): Player Name, Position, Matchup Light, Offense Light, Vegas Light
  const cName = headerIndex(header, /player\s*name/i);
  const cPos  = headerIndex(header, /^pos|position$/i);
  const cM    = headerIndex(header, /matchup(\s*light)?/i);
  const cO    = headerIndex(header, /offense(\s*light)?/i);
  const cV    = headerIndex(header, /vegas(\s*light)?/i);

  if ([cName, cPos, cM, cV, cO].some((i) => i < 0)) {
    throw new Error(
      `lights.csv must include: Player Name, Position, Matchup Light, Offense Light, Vegas Light. Found: ${header.join(", ")}`
    );
  }

  // Indexes:
  // byKey: "nameKey|POS" -> {matchup, vegas, offense}
  // byName: nameKey -> [{pos, lights}, ...]
  const byKey = new Map();
  const byName = new Map();

  for (const r of rows) {
    const name = r[cName];
    const pos  = normPos(r[cPos]);
    const lights = {
      matchup: String(r[cM] || "").toUpperCase(),
      offense: String(r[cO] || "").toUpperCase(),
      vegas:   String(r[cV] || "").toUpperCase(),
    };

    const keyName = normNameRaw(name);
    const key = `${keyName}|${pos}`;

    byKey.set(key, lights);
    (byName.get(keyName) || byName.set(keyName, []).get(keyName)).push({ pos, lights });
  }
  return { byKey, byName };
}

/* ------------- try to resolve an id + pos ------------- */
function resolvePlayer(name, idx) {
  const keyName = normNameRaw(name);

  // 1) exact by full name (single unique)
  const candFull = idx.byFull.get(keyName) || [];
  if (candFull.length === 1) return candFull[0];

  // 2) give up (keep null id; we'll still include rank+lights)
  return { id: null, pos: null, name };
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

  // lights maps (name+pos only)
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

    // resolve id/pos by name (no team)
    const resolved = resolvePlayer(name, idx);
    const id  = resolved?.id ? String(resolved.id) : null;
    let pos   = resolved?.pos || null;

    // Try to fill lights by (name + pos), else by unique name in lights.csv, else fallback YELLOWs
    const keyName = normNameRaw(name);

    // If we don't have a pos yet, but lights.csv only has one pos for this name, use that
    if (!pos) {
      const nameRows = lightsByName.get(keyName) || [];
      if (nameRows.length === 1) pos = nameRows[0].pos || null;
    }

    let lights = null;

    // 1) by id (if the player's id has lights stored on the player object)
    if (id && playersById[id]?.weekly?.lights) {
      lights = { ...playersById[id].weekly.lights };
      lightsById[id] = lights;
    }

    // 2) by name + POS
    if (!lights) {
      const k = `${keyName}|${pos || ""}`;
      lights = lightsByKey.get(k) || null;
    }

    // 3) by unique name in lights.csv
    if (!lights) {
      const nameRows = lightsByName.get(keyName) || [];
      if (nameRows.length === 1) lights = nameRows[0].lights;
    }

    // 4) fallback
    if (!lights) {
      lights = { matchup: "YELLOW", vegas: "YELLOW", offense: "YELLOW" };
    }

    return { rank: Number(rank), id, name, pos, lights };
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

  console.log(`✅ Wrote:
  ${path.relative(process.cwd(), OUT_1QB_ENR)} (${oneQB.length})
  ${path.relative(process.cwd(), OUT_SF_ENR)} (${sf.length})
  ${path.relative(process.cwd(), OUT_LIGHTS)} (ids=${Object.keys(lightsById).length})`);
}

main().catch((err) => {
  console.error("❌ build-weekly-data failed:", err);
  process.exit(1);
});
