// src/redraft/players/build-domain-master.cjs
// Single-run builder for players-by-id.json using local CSVs in this folder.
// INPUT FILES (all optional except domain & players.json):
//   - players.json                (Sleeper dump; required)
//   - domain-rankings.csv         (Player_Id,Name,Position,Rank)             ← REQUIRED
//   - players-4-factors.csv       (Player,Team,Position,Upside Score,Floor Score,Risk Profile,Overall Grade)
//   - rankings-qb.csv             (headerless: "Name,Score" rows also OK)
//   - rankings-te.csv             (Player,Value, ... trailing commas OK)
//   - superflex-rankings.csv      (Rank,Player,Team)
// OUTPUT:
//   - players-by-id.json          (id -> merged object)
//
// Run:  node src/redraft/players/build-domain-master.cjs

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// ---------- fixed file locations (edit if your filenames differ) ----------
const DIR = __dirname;
const FILES = {
  players:             path.join(DIR, 'players.json'),              // Sleeper dump
  out:                 path.join(DIR, 'players-by-id.json'),
  domain:              path.join(DIR, 'domain-rankings.csv'),
  factors:             path.join(DIR, 'players-4-factors.csv'),
  qbScores:            path.join(DIR, 'rankings-qb.csv'),
  teValues:            path.join(DIR, 'rankings-te.csv'),
  superflex:           path.join(DIR, 'superflex-rankings.csv'),
};

// optional name→ID overrides
let overrides = {};
try { overrides = require('./overrides.js'); } catch { overrides = {}; }

// ---------- helpers ----------
function normalize(name = '') {
  return String(name)
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\b(jr|sr|ii|iii|iv|v)\b/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}
const TEAM_ALIAS = { JAC:'JAX', LA:'LAR', OAK:'LV', SD:'LAC', STL:'LAR', WAS:'WAS', WSH:'WAS' };
const normTeam = (t) => (TEAM_ALIAS[(t || '').toUpperCase()] || (t || '').toUpperCase());

function readCSV(file, opts = {}) {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(file)
      .pipe(csv({ mapHeaders: ({ header }) => String(header).trim(), ...opts }))
      .on('data', (row) => rows.push(row))
      .on('end', () => resolve(rows))
      .on('error', reject);
  });
}
// headerless QB: always coerce to {Player,Score}
function readQBCSV(file) {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(file)
      .pipe(csv({ headers: ['Player','Score'], mapHeaders: ({ header }) => String(header).trim() }))
      .on('data', (row) => rows.push(row))
      .on('end', () => resolve(rows))
      .on('error', reject);
  });
}

function ensure(file, label) {
  if (!fs.existsSync(file)) {
    console.error(`❌ Missing ${label}: ${file}`);
    process.exit(1);
  }
}

function optional(file) { return fs.existsSync(file) ? file : null; }

// ---------- Sleeper indices ----------
ensure(FILES.players, 'players.json (Sleeper dump)');
ensure(FILES.domain, 'domain-rankings.csv');

const sleeper = JSON.parse(fs.readFileSync(FILES.players, 'utf8'));

const nameToIds = new Map();
const idToTeam = {};
const idToPos  = {};
for (const [id, p] of Object.entries(sleeper)) {
  const nm = p?.search_full_name || p?.full_name || `${p?.first_name || ''} ${p?.last_name || ''}`.trim();
  const key = normalize(nm);
  if (key) {
    const arr = nameToIds.get(key) || [];
    arr.push(id);
    nameToIds.set(key, arr);
  }
  if (p?.team) idToTeam[id] = String(p.team).toUpperCase();
  const pos = Array.isArray(p?.fantasy_positions) ? p.fantasy_positions[0] : p?.position;
  if (pos) idToPos[id] = String(pos).toUpperCase();
}

function resolveId(rawId, name, preferPos) {
  if (rawId) return String(rawId);
  if (overrides[name]) return String(overrides[name]);

  const key = normalize(name);
  const ids = nameToIds.get(key) || [];
  if (!ids.length) return null;
  if (!preferPos) return ids[0];

  const wanted = String(preferPos).toUpperCase();
  const match = ids.find((id) => idToPos[id] === wanted);
  return match || ids[0];
}

// ---------- build ----------
(async () => {
  const out = {};            // id -> merged object
  const posBuckets = {};     // POS -> [{id, rank}] for positionRank calc
  const misses = { domain:[], factors:[], qb:[], te:[], sf:[] };

  // 1) Domain base
  const domain = await readCSV(FILES.domain);
  for (const row of domain) {
    const rawId = String(row['Player_Id'] ?? row['PlayerID'] ?? row['player_id'] ?? '').trim();
    const name  = String(row['Name'] ?? row['Player'] ?? '').trim();
    const pos   = String(row['Position'] ?? row['Pos'] ?? '').trim().toUpperCase();
    const rank  = Number(row['Rank'] ?? row['rank']);
    if (!name || !Number.isFinite(rank)) continue;

    const id = resolveId(rawId, name, pos);
    if (!id) { misses.domain.push(name); continue; }

    const team = idToTeam[id] || null;
    out[id] = {
      ...(out[id] || {}),
      name,
      position: pos || out[id]?.position || idToPos[id] || null,
      rank,
      positionRank: out[id]?.positionRank ?? null, // assign later
      value: out[id]?.value ?? null,               // no generic "value" now
      team,
    };

    if (pos) (posBuckets[pos] ||= []).push({ id, rank });
  }

  // 2) 4-Factors (optional)
  if (optional(FILES.factors)) {
    const rows = await readCSV(FILES.factors);
    for (const r of rows) {
      const name = String(r['Player'] ?? '').trim();
      const team = normTeam(r['Team']);
      if (!name) continue;

      let id = resolveId(null, name);
      if (id && team && idToTeam[id] && normTeam(idToTeam[id]) !== team) {
        const ids = nameToIds.get(normalize(name)) || [];
        const cand = ids.find((x) => normTeam(idToTeam[x]) === team);
        if (cand) id = cand;
      }
      if (!id) { misses.factors.push(`${name}${team ? ' ('+team+')' : ''}`); continue; }

      const tgt = (out[id] = out[id] || {
        name, position: idToPos[id] || null, rank: null, positionRank: null, value: null, team: idToTeam[id] || null,
      });

      const num = (v) => (v === '' || v == null ? null : Number(v));
      const clip10 = (v) => (Number.isFinite(v) ? Math.max(0, Math.min(10, v)) : null);

      tgt['four-factor-upside']  = clip10(num(r['Upside Score']));
      tgt['four-factor-floor']   = clip10(num(r['Floor Score']));
      tgt['four-factor-risk']    = clip10(num(r['Risk Profile']));
      tgt['four-factor-overall'] = clip10(num(r['Overall Grade']));
    }
  }

  // 3) QB scores (optional; headerless supported)
  if (optional(FILES.qbScores)) {
    const rows = await readQBCSV(FILES.qbScores); // -> { Player, Score }
    for (const { Player, Score } of rows) {
      const name = String(Player || '').trim();
      const score = Number(Score);
      if (!name || !Number.isFinite(score)) continue;

      const id = resolveId(null, name, 'QB');
      if (!id) { misses.qb.push(name); continue; }

      const tgt = (out[id] = out[id] || {
        name, position: 'QB', rank: null, positionRank: null, value: null, team: idToTeam[id] || null,
      });
      tgt['qb-score'] = score;
      if (!tgt.position) tgt.position = 'QB';
    }
  }

  // 4) TE values (optional)
  if (optional(FILES.teValues)) {
    const rows = await readCSV(FILES.teValues);
    for (const r of rows) {
      const name = String(r['Player'] ?? r['Name'] ?? '').trim();
      const value = Number(r['Value'] ?? r['Score'] ?? r['val']);
      if (!name || !Number.isFinite(value)) continue;

      const id = resolveId(null, name, 'TE');
      if (!id) { misses.te.push(name); continue; }

      const tgt = (out[id] = out[id] || {
        name, position: 'TE', rank: null, positionRank: null, value: null, team: idToTeam[id] || null,
      });
      tgt['te_value'] = value;
      if (!tgt.position) tgt.position = 'TE';
    }
  }

  // 5) Superflex ranks (optional)
  if (optional(FILES.superflex)) {
    const rows = await readCSV(FILES.superflex);
    for (const r of rows) {
      const name = String(r['Player'] ?? r['Name'] ?? '').trim();
      const rank = Number(r['Rank'] ?? r['rank'] ?? r['Overall']);
      if (!name || !Number.isFinite(rank)) continue;

      const id = resolveId(null, name);
      if (!id) { misses.sf.push(name); continue; }

      const tgt = (out[id] = out[id] || {
        name, position: idToPos[id] || null, rank: null, positionRank: null, value: null, team: idToTeam[id] || null,
      });
      tgt['superflex-rank'] = rank;
      if (!tgt.position) tgt.position = idToPos[id] || null;
    }
  }

  // 6) positionRank from Domain’s overall rank
  const groups = {};
  for (const [id, p] of Object.entries(out)) {
    const pos = String(p.position || '').toUpperCase();
    if (!pos) continue;
    (groups[pos] ||= []).push({ id, r: Number.isFinite(p.rank) ? p.rank : Infinity });
  }
  for (const pos of Object.keys(groups)) {
    groups[pos].sort((a, b) => a.r - b.r);
    let idx = 0;
    for (const { id, r } of groups[pos]) {
      out[id].positionRank = Number.isFinite(r) ? ++idx : (out[id].positionRank ?? null);
    }
  }

  // 7) final cleanup
  for (const [id, p] of Object.entries(out)) {
    p.name = p.name ?? '';
    p.position = p.position ?? null;
    p.rank = Number.isFinite(p.rank) ? p.rank : (p.rank == null ? null : Number(p.rank));
    p.positionRank = Number.isFinite(p.positionRank) ? p.positionRank : null;
    p.value = p.value ?? null; // you said: no longer use generic value (kept for compatibility)
    p.team = p.team ? normTeam(p.team) : (idToTeam[id] || null);
  }

  // 8) write (with backup)
  let backup = null;
  if (fs.existsSync(FILES.out)) {
    backup = `${FILES.out}.backup.${Date.now()}.json`;
    fs.copyFileSync(FILES.out, backup);
  }
  fs.writeFileSync(FILES.out, JSON.stringify(out, null, 2));
  console.log(`✅ Wrote ${path.relative(process.cwd(), FILES.out)} (players: ${Object.keys(out).length})`);
  if (backup) console.log(`🗃️  Backup: ${path.relative(process.cwd(), backup)}`);

  const show = (label, arr) => arr.length && console.warn(`⚠️  ${label} unmatched: ${arr.length}`);
  show('Domain',   misses.domain);
  show('4-Factors',misses.factors);
  show('QB',       misses.qb);
  show('TE',       misses.te);
  show('Superflex',misses.sf);
})().catch((e) => {
  console.error('❌ Build error:', e);
  process.exit(1);
});
