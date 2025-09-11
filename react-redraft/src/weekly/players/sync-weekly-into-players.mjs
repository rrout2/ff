import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// paths
const DIR = __dirname;
const F_PLAYERS_IN   = path.join(DIR, "players-by-id-weekly.json");
const F_PLAYERS_OUT  = path.join(DIR, "players-by-id-weekly.enriched.json");
const F_WEEKLY_1QB   = path.join(DIR, "weekly-1qb.enriched.json");
const F_WEEKLY_SF    = path.join(DIR, "weekly-sf.enriched.json");
const F_LIGHTS_BY_ID = path.join(DIR, "lights.json"); // optional

const IN_PLACE = process.argv.includes("--in-place");

// ---------- normalizers ----------
const SUFFIX_RE = /\b(jr|sr|ii|iii|iv|v)\b$/i;
const HYPHENS   = /[\u2010\u2011\u2012\u2013\u2014\u2015\u2212\u2043\uFE58\uFE63\uFF0D-]/g;

const normName = (s) =>
  String(s || "")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "")
    .replace(HYPHENS, " ")
    .replace(/[.,]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(SUFFIX_RE, "")
    .trim()
    .toLowerCase();

const normPos = (p) => String(p || "").toUpperCase();

function getPlayerName(p) {
  return p?.full_name || p?.name || `${p?.first_name || ""} ${p?.last_name || ""}`.trim();
}
function getPlayerPos(p) {
  const fp = Array.isArray(p?.fantasy_positions) ? p.fantasy_positions[0] : undefined;
  return normPos(p?.position || fp || "");
}

// ---------- load JSON helpers ----------
async function readJSON(fp, fallback = {}) {
  try { return JSON.parse(await fs.readFile(fp, "utf8")); }
  catch { return fallback; }
}

// ---------- build lookup maps from weekly lists ----------
function buildRankAndLightsMaps(weeklyList) {
  const rankById  = new Map();
  const rankByNP  = new Map(); // name+pos
  const lightsById = {};
  const lightsByNP = {};

  for (const row of Array.isArray(weeklyList) ? weeklyList : []) {
    const id = row?.id ? String(row.id) : null;
    const nameKey = normName(row?.name);
    const posKey  = row?.pos ? normPos(row.pos) : null;
    const rank    = Number(row?.rank);
    const lights  = row?.lights && typeof row.lights === "object" ? row.lights : null;

    if (id && Number.isFinite(rank)) rankById.set(id, rank);
    if (nameKey && posKey && Number.isFinite(rank)) {
      const k = `${nameKey}|${posKey}`;
      // keep first rank if duplicates; typically not needed to override
      if (!rankByNP.has(k)) rankByNP.set(k, rank);
    }

    if (lights) {
      if (id) lightsById[id] = { ...lights };
      if (nameKey && posKey) {
        const k = `${nameKey}|${posKey}`;
        lightsByNP[k] = { ...lights };
      }
    }
  }
  return { rankById, rankByNP, lightsById, lightsByNP };
}

async function main() {
  const players = await readJSON(F_PLAYERS_IN, {});
  const list1QB = await readJSON(F_WEEKLY_1QB, []);
  const listSF  = await readJSON(F_WEEKLY_SF, []);
  const lightsFileById = await readJSON(F_LIGHTS_BY_ID, {});

  const {
    rankById: r1ById, rankByNP: r1ByNP,
    lightsById: l1ById, lightsByNP: l1ByNP
  } = buildRankAndLightsMaps(list1QB);

  const {
    rankById: rSFById, rankByNP: rSFByNP,
    lightsById: lSFById, lightsByNP: lSFByNP
  } = buildRankAndLightsMaps(listSF);

  // iterate all players & stamp weekly data
  for (const [id, p] of Object.entries(players)) {
    const pid = String(id);
    const nameKey = normName(getPlayerName(p));
    const posKey  = getPlayerPos(p);
    const npKey   = `${nameKey}|${posKey}`;

    // ranks: id → name+pos fallback
    const rank1QB =
      (r1ById.has(pid) ? r1ById.get(pid) : undefined) ??
      (r1ByNP.has(npKey) ? r1ByNP.get(npKey) : undefined) ??
      null;

    const rankSF =
      (rSFById.has(pid) ? rSFById.get(pid) : undefined) ??
      (rSFByNP.has(npKey) ? rSFByNP.get(npKey) : undefined) ??
      null;

    // lights: prefer id from 1QB/SF lists, then name+pos, then lights.json by id, else fallback
    const lights =
      l1ById[pid] ||
      lSFById[pid] ||
      l1ByNP[npKey] ||
      lSFByNP[npKey] ||
      lightsFileById[pid] ||
      { matchup: "YELLOW", vegas: "YELLOW", offense: "YELLOW" };

    // assign weekly block
    players[pid] = {
      ...p,
      weekly: {
        rank1QB,
        rankSF,
        lights
      },
    };
  }

  const outPath = IN_PLACE ? F_PLAYERS_IN : F_PLAYERS_OUT;
  if (IN_PLACE) {
    // write .bak
    const bak = `${F_PLAYERS_IN}.bak`;
    try {
      const original = await fs.readFile(F_PLAYERS_IN, "utf8");
      await fs.writeFile(bak, original, "utf8");
    } catch { /* ignore */ }
  }
  await fs.writeFile(outPath, JSON.stringify(players, null, 2), "utf8");

  console.log(
    `✅ Updated players file: ${path.relative(process.cwd(), outPath)} ` +
    `(source: weekly-1qb.enriched.json, weekly-sf.enriched.json${Object.keys(lightsFileById).length ? ", lights.json" : ""})`
  );
  if (IN_PLACE) {
    console.log(`🗂️  Backup written: ${path.relative(process.cwd(), `${F_PLAYERS_IN}.bak`)}`);
  }
}

main().catch((err) => {
  console.error("❌ sync-weekly-into-players failed:", err);
  process.exit(1);
});
