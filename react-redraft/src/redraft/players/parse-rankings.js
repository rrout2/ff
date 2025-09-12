// src/redraft/players/parse-domain-rankings.cjs
// Usage:
//   node src/redraft/players/parse-domain-rankings.cjs path/to/domain-rankings.csv

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const overrides = require('./overrides.js');

// ---- paths ----
const DIR = __dirname;
const playersJsonPath = path.join(DIR, 'players.json');
const outPath = path.join(DIR, 'players-by-id.json');
const csvPath = process.argv[2] ? path.resolve(process.cwd(), process.argv[2]) : path.join(DIR, 'domain-rankings.csv');

// ---- guards ----
if (!fs.existsSync(playersJsonPath)) {
  console.error(`❌ Missing Sleeper players.json at ${playersJsonPath}`);
  process.exit(1);
}
if (!fs.existsSync(csvPath)) {
  console.error(`❌ Rankings CSV not found at ${csvPath}`);
  process.exit(1);
}

// ---- helpers ----
function normalize(name = '') {
  return String(name)
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/\b(jr|sr|ii|iii|iv|v)\b/g, '')
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

const sleeperPlayers = JSON.parse(fs.readFileSync(playersJsonPath, 'utf8'));

// name -> [ids]
const nameToIds = new Map();
const idToTeam = {};
for (const [id, p] of Object.entries(sleeperPlayers)) {
  const nm =
    p?.search_full_name ||
    p?.full_name ||
    `${p?.first_name || ''} ${p?.last_name || ''}`.trim();
  const key = normalize(nm);
  if (key) {
    const arr = nameToIds.get(key) || [];
    arr.push(id);
    nameToIds.set(key, arr);
  }
  if (p?.team) idToTeam[id] = p.team;
}

const existing = fs.existsSync(outPath)
  ? JSON.parse(fs.readFileSync(outPath, 'utf8'))
  : {};

const byPosCounter = {}; // position -> next rank index
const updatedIds = [];
const misses = [];

fs.createReadStream(csvPath)
  .pipe(csv({ mapHeaders: ({ header }) => header.trim() }))
  .on('data', (row) => {
    // Accept multiple spellings / cases
    const rawId  = String(row['Player_Id'] ?? row['PlayerID'] ?? row['Player Id'] ?? row['player_id'] ?? '').trim();
    const rawName = String(row['Name'] ?? row['Player'] ?? row['name'] ?? '').trim();
    const pos     = String(row['Position'] ?? row['Pos'] ?? '').trim().toUpperCase();
    const rankNum = Number(row['Rank'] ?? row['rank']);

    if (!rawName || !Number.isFinite(rankNum)) return;

    // Resolve ID: CSV id -> overrides -> name lookup
    let id = rawId || overrides[rawName] || null;
    if (!id) {
      const key = normalize(rawName);
      const ids = nameToIds.get(key) || [];
      id = ids.length ? ids[0] : null;
    }

    if (!id) {
      misses.push(rawName);
      return;
    }

    const positionRank =
      (byPosCounter[pos] = (byPosCounter[pos] || 0) + 1);

    const prev = existing[id] || {};
    existing[id] = {
      ...prev,
      name: rawName,
      position: pos || prev.position || null,
      rank: rankNum,
      positionRank,
      value: prev.value ?? null,
      team: idToTeam[id] || prev.team || null,
    };
    updatedIds.push(id);
  })
  .on('end', () => {
    const backup = fs.existsSync(outPath)
      ? `${outPath}.backup.${Date.now()}.json`
      : null;
    if (backup) fs.copyFileSync(outPath, backup);

    fs.writeFileSync(outPath, JSON.stringify(existing, null, 2));
    console.log(`✅ Wrote ${outPath}`);
    if (backup) console.log(`🗃️  Backup: ${backup}`);
    console.log(`   Updated players: ${updatedIds.length}`);
    if (misses.length) {
      const missPath = path.join(DIR, 'domain-rankings_unmatched.txt');
      fs.writeFileSync(missPath, misses.join('\n') + '\n');
      console.warn(`⚠️  Unmatched rows: ${misses.length} → ${missPath}`);
    }
  })
  .on('error', (err) => {
    console.error('❌ CSV read error:', err);
    process.exit(1);
  });
