// src/redraft/players/inject-domain-values.cjs
// Usage:
//   node src/redraft/players/inject-domain-values.cjs            # uses values.csv in same folder
//   node src/redraft/players/inject-domain-values.cjs path/to/values.csv
//
// Reads a CSV with columns: Player,Value
// Updates players-by-id.json: id -> { ..., value: <number> }

const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const DIR = __dirname;
const byIdPath = path.join(DIR, 'players-by-id.json');
const defaultCsv = path.join(DIR, 'values.csv');
const csvPath = process.argv[2] ? path.resolve(process.cwd(), process.argv[2]) : defaultCsv;

// --- guards ---
if (!fs.existsSync(byIdPath)) {
  console.error(`❌ Missing players-by-id.json at ${byIdPath}`);
  process.exit(1);
}
if (!fs.existsSync(csvPath)) {
  console.error(`❌ CSV not found at ${csvPath}`);
  process.exit(1);
}

// --- helpers ---
function normalize(name = '') {
  return String(name)
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')     // remove accents
    .replace(/[’‘]/g, "'")                                // curly → straight apostrophes
    .replace(/\b(jr|sr|ii|iii|iv|v)\b/g, '')              // drop suffixes
    .replace(/[^a-z0-9]+/g, ' ')                          // keep letters+digits (collapse others to space)
    .trim();
}

// --- load local db ---
const byId = JSON.parse(fs.readFileSync(byIdPath, 'utf8'));

// Build name -> [ids] index from players-by-id.json
const nameToIds = new Map();
for (const [id, p] of Object.entries(byId)) {
  const nm = p?.name || p?.full_name || `${p?.first_name || ''} ${p?.last_name || ''}`.trim();
  const key = normalize(nm);
  if (!key) continue;
  const arr = nameToIds.get(key) || [];
  arr.push(id);
  nameToIds.set(key, arr);
}

let updated = 0;
const unmatched = [];
const ambiguous = [];

// --- read CSV & inject ---
fs.createReadStream(csvPath)
  .pipe(csv({ mapHeaders: ({ header }) => String(header).replace(/^\uFEFF/, '').trim() }))
  .on('data', (row) => {
    const rawName = String(row['Player'] ?? row['Name'] ?? '').trim();
    const rawVal  = row['Value'] ?? row['value'];
    const val = Number(rawVal);

    if (!rawName || !Number.isFinite(val)) return;

    const key = normalize(rawName);
    const ids = nameToIds.get(key) || [];

    if (ids.length === 0) {
      unmatched.push(rawName);
      return;
    }
    if (ids.length > 1) {
      // If multiple, prefer the one that already has a 'position' & 'team' (usually the real player)
      const sorted = ids.slice().sort((a, b) => {
        const pa = byId[a] || {}, pb = byId[b] || {};
        const sa = (pa.position ? 1 : 0) + (pa.team ? 1 : 0);
        const sb = (pb.position ? 1 : 0) + (pb.team ? 1 : 0);
        return sb - sa;
      });
      const pick = sorted[0];
      if (!pick) { ambiguous.push(rawName); return; }
      byId[pick].value = val;
      updated++;
      return;
    }

    // exactly one
    const id = ids[0];
    if (!byId[id]) { unmatched.push(rawName); return; }
    byId[id].value = val;
    updated++;
  })
  .on('end', () => {
    const backup = `${byIdPath}.backup.${Date.now()}.json`;
    fs.copyFileSync(byIdPath, backup);
    fs.writeFileSync(byIdPath, JSON.stringify(byId, null, 2));
    console.log(`✅ Injected ${updated} values into players-by-id.json`);
    console.log(`🗃️  Backup saved → ${backup}`);
    if (unmatched.length) {
      const miss = path.join(DIR, 'values_unmatched.txt');
      fs.writeFileSync(miss, unmatched.join('\n') + '\n');
      console.warn(`⚠️  Unmatched: ${unmatched.length} → ${miss}`);
    }
    if (ambiguous.length) {
      const amb = path.join(DIR, 'values_ambiguous.txt');
      fs.writeFileSync(amb, ambiguous.join('\n') + '\n');
      console.warn(`⚠️  Ambiguous name matches (best guess used): ${ambiguous.length} → ${amb}`);
    }
  })
  .on('error', (err) => {
    console.error('❌ CSV read error:', err);
    process.exit(1);
  });
