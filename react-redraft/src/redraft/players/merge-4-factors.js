// Merge 4-Factors CSV -> players-by-id.json  (ESM version)
// Run from repo root: node src/redraft/players/merge-4-factors.js

import * as fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- paths ----
const CSV_PATH = path.join(__dirname, 'players-4-factors.csv');
const JSON_PATH = path.join(__dirname, 'players-by-id.json');
const MISSES_OUT = path.join(__dirname, `merge-4-factors-misses.${Date.now()}.csv`);

// ---- tiny CSV parser (handles quotes) ----
function splitCSVLine(line) {
  const out = [];
  let cur = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQuotes) {
      if (c === '"') {
        if (line[i + 1] === '"') { cur += '"'; i++; } else { inQuotes = false; }
      } else cur += c;
    } else {
      if (c === ',') { out.push(cur); cur = ''; }
      else if (c === '"') { inQuotes = true; }
      else cur += c;
    }
  }
  out.push(cur);
  return out;
}
function parseCSV(text) {
  const lines = text.replace(/\r/g, '').split('\n').filter(Boolean);
  if (!lines.length) return [];
  const headers = splitCSVLine(lines[0]).map(h => h.trim());
  return lines.slice(1).map(line => {
    const cells = splitCSVLine(line);
    const row = {};
    headers.forEach((h, i) => (row[h] = (cells[i] ?? '').trim()));
    return row;
  });
}

// ---- normalization helpers ----
const TEAM_ALIAS = { JAC: 'JAX', LA: 'LAR', OAK: 'LV', SD: 'LAC', STL: 'LAR', WAS: 'WAS' };
const normTeam = t => (TEAM_ALIAS[(t || '').toUpperCase()] || (t || '').toUpperCase());
const normName = s => (s || '')
  .replace(/\./g, '')
  .replace(/['’]/g, '')
  .replace(/\b(jr|sr|ii|iii|iv)\b/ig, '')
  .replace(/-/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .toLowerCase();
const keyNameTeam = (name, team) => `${normName(name)}|${normTeam(team)}`;

// ---- which CSV cols -> which JSON keys (exact names you asked for) ----
const FIELD_MAP = {
  'Upside Score':  'four-factor-upside',
  'Floor Score':   'four-factor-floor',
  'Risk Profile':  'four-factor-risk',
  'Overall Grade': 'four-factor-overall',
};

// ---- load files ----
if (!fs.existsSync(CSV_PATH)) {
  console.error(`❌ CSV not found at ${CSV_PATH}`);
  process.exit(1);
}
if (!fs.existsSync(JSON_PATH)) {
  console.error(`❌ JSON not found at ${JSON_PATH}`);
  process.exit(1);
}
const rows = parseCSV(fs.readFileSync(CSV_PATH, 'utf8'));
const players = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

if (!rows.length) {
  console.error('❌ CSV appears empty.');
  process.exit(1);
}

// optional: header sanity check
const headerSet = new Set(Object.keys(rows[0]));
const required = ['Player', 'Team', 'Position', ...Object.keys(FIELD_MAP)];
const missing = required.filter(c => !headerSet.has(c));
if (missing.length) {
  console.warn('⚠️  CSV is missing expected columns:', missing.join(', '));
}

// Build index by normalized (name|team)
const index = new Map();
for (const [id, p] of Object.entries(players)) {
  const key = keyNameTeam(p.name || p.full_name, p.team);
  if (key !== '|') index.set(key, id);
}

// Merge
let updated = 0;
const misses = [];

for (const row of rows) {
  const name = row['Player'];
  const team = row['Team'];
  if (!name) continue;

  let id = index.get(keyNameTeam(name, team));

  // fallback: unique name-only match (with team permissive)
  if (!id) {
    const nm = normName(name);
    const cands = Object.entries(players).filter(
      ([, p]) => normName(p.name || p.full_name) === nm &&
                 (!team || !p.team || normTeam(p.team) === normTeam(team))
    );
    if (cands.length === 1) id = cands[0][0];
  }

  if (!id) { misses.push([name, team || '', row['Position'] || '']); continue; }

  const target = players[id];

  for (const [csvCol, jsonKey] of Object.entries(FIELD_MAP)) {
    const raw = row[csvCol];
    const num = raw === '' ? null : Number(raw);
    // clamp score-like fields to 0..10
    const val = Number.isFinite(num) ? Math.max(0, Math.min(10, num)) : null;
    target[jsonKey] = val; // bracket notation because of hyphens
  }

  updated++;
}

// Write backup + result
const backup = JSON_PATH.replace(/\.json$/, `.backup.${Date.now()}.json`);
fs.copyFileSync(JSON_PATH, backup);
fs.writeFileSync(JSON_PATH, JSON.stringify(players, null, 2));
console.log(`✅ Merge complete. Updated ${updated} players.`);
console.log(`🗃️  Backup saved: ${backup}`);

if (misses.length) {
  const missCsv = ['Player,Team,Position', ...misses.map(m => m.map(x => `"${String(x).replace(/"/g,'""')}"`).join(','))].join('\n');
  fs.writeFileSync(MISSES_OUT, missCsv);
  console.warn(`⚠️  ${misses.length} unmatched rows. See: ${MISSES_OUT}`);
}
