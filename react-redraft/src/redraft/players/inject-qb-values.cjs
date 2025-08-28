// src/redraft/players/inject-qb-scores.cjs
// Usage:
//   node src/redraft/players/inject-qb-scores.cjs             # uses rankings-qb.csv in same folder
//   node src/redraft/players/inject-qb-scores.cjs path/to/your.csv

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// -------- paths --------
const DIR = __dirname;
const byIdPath   = path.join(DIR, 'players-by-id.json');
const defaultCsv = path.join(DIR, 'rankings-qb.csv');
const csvPath    = process.argv[2] ? path.resolve(process.cwd(), process.argv[2]) : defaultCsv;

// -------- helpers --------
function normalize(name = '') {
  return String(name)
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/\b(jr|sr|ii|iii|iv|v)\b/g, '')          // drop suffixes
    .replace(/[^a-z0-9]/g, '')                        // keep letters+digits only
    .trim();
}
function isQB(p = {}) {
  const pos = (Array.isArray(p.fantasy_positions) ? p.fantasy_positions[0] : p.position || '').toUpperCase();
  return pos === 'QB';
}

// -------- load data --------
if (!fs.existsSync(byIdPath)) {
  console.error(`❌ Missing players-by-id.json at ${byIdPath}`);
  process.exit(1);
}
if (!fs.existsSync(csvPath)) {
  console.error(`❌ CSV not found at ${csvPath}`);
  process.exit(1);
}

const playersById = JSON.parse(fs.readFileSync(byIdPath, 'utf8'));

// Build name -> [ids] index (from players-by-id.json)
const nameToIds = new Map();
for (const [id, p] of Object.entries(playersById)) {
  const nm = p?.full_name || p?.name || `${p?.first_name || ''} ${p?.last_name || ''}`.trim();
  const key = normalize(nm);
  if (!key) continue;
  const arr = nameToIds.get(key) || [];
  arr.push(id);
  nameToIds.set(key, arr);
}

// -------- inject from CSV --------
let updated = 0;
const unmatched = [];

fs.createReadStream(csvPath)
  // your CSV has no header row; supply headers here
  .pipe(csv({ headers: ['Player', 'Score'], skipLines: 0 }))
  .on('data', (row) => {
    const rawName = String(row.Player || row.player || '').trim();
    const score   = Number(row.Score ?? row.score ?? row.Value ?? row.value);
    if (!rawName || !Number.isFinite(score)) return;

    const key = normalize(rawName);
    const ids = nameToIds.get(key) || [];

    // resolve duplicates by preferring the QB entry
    let targetId = null;
    if (ids.length === 1) {
      targetId = ids[0];
    } else if (ids.length > 1) {
      targetId = ids.find((id) => isQB(playersById[id])) || ids[0];
    }

    if (!targetId) {
      unmatched.push(rawName);
      return;
    }

    // only write to QBs
    if (!isQB(playersById[targetId])) {
      unmatched.push(`${rawName} (matched non-QB)`);
      return;
    }

    playersById[targetId]['qb-score'] = score;
    updated++;
    // console.log(`✅ ${rawName} -> ${score}`);
  })
  .on('end', () => {
    // backup then write
    const backupPath = `${byIdPath}.backup.${Date.now()}.json`;
    fs.copyFileSync(byIdPath, backupPath);
    fs.writeFileSync(byIdPath, JSON.stringify(playersById, null, 2));
    console.log(`✅ Injected qb-scores into players-by-id.json`);
    console.log(`   Updated: ${updated}`);
    if (unmatched.length) {
      console.log(`   Unmatched: ${unmatched.length}`);
      const out = path.join(DIR, 'rankings-qb_unmatched.txt');
      fs.writeFileSync(out, unmatched.join('\n') + '\n');
      console.log(`   → See ${out}`);
    }
  })
  .on('error', (err) => {
    console.error('❌ CSV read error:', err);
    process.exit(1);
  });
