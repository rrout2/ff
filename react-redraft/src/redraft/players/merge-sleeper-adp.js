// Run: node src/redraft/players/merge-sleeper-adp.js
import * as fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CSV_PATH  = path.join(__dirname, 'sleeper-adp.csv');      // your CSV
const JSON_PATH = path.join(__dirname, 'players-by-id.json');   // target JSON
const MISSES_OUT = path.join(__dirname, `merge-sleeper-adp-misses.${Date.now()}.csv`);

const TEAM_ALIAS = { JAC:'JAX', LA:'LAR', OAK:'LV', SD:'LAC', STL:'LAR', WAS:'WAS' };
const normTeam = t => (TEAM_ALIAS[(t||'').toUpperCase()] || (t||'').toUpperCase());
const normName = s => (s||'')
  .replace(/\./g,'')
  .replace(/['’]/g,'')
  .replace(/\b(jr|sr|ii|iii|iv)\b/ig,'')
  .replace(/-/g,' ')
  .replace(/\s+/g,' ')
  .trim()
  .toLowerCase();
const keyNameTeam = (name, team) => `${normName(name)}|${normTeam(team)}`;

function splitCSVLine(line) {
  const out=[]; let cur=''; let q=false;
  for (let i=0;i<line.length;i++){
    const c=line[i];
    if(q){ if(c==='"'){ if(line[i+1]==='"'){cur+='"';i++;} else q=false; } else cur+=c; }
    else { if(c===','){ out.push(cur); cur=''; } else if(c==='"'){ q=true; } else cur+=c; }
  }
  out.push(cur); return out;
}
function parseCSV(text) {
  const lines = text.replace(/\r/g,'').split('\n').filter(Boolean);
  if(!lines.length) return [];
  const headers = splitCSVLine(lines[0]).map(h=>h.trim());
  return lines.slice(1).map(line=>{
    const cells = splitCSVLine(line);
    const row={}; headers.forEach((h,i)=> row[h] = (cells[i] ?? '').trim());
    return row;
  });
}

if(!fs.existsSync(CSV_PATH)) { console.error('❌ CSV not found:', CSV_PATH); process.exit(1); }
if(!fs.existsSync(JSON_PATH)) { console.error('❌ JSON not found:', JSON_PATH); process.exit(1); }

const rows = parseCSV(fs.readFileSync(CSV_PATH,'utf8'));
const players = JSON.parse(fs.readFileSync(JSON_PATH,'utf8'));

// Build indices from JSON
const byId = new Map(Object.keys(players).map(id => [String(id), id]));
const byNameTeam = new Map(
  Object.entries(players).map(([id,p]) => [keyNameTeam(p.name || p.full_name, p.team), id])
);

let updated=0; const misses=[];

// Your CSV columns: Rank, Player, Team, POS, Sleeper
for (const r of rows) {
  const name = r['Player'];
  const team = r['Team'];
  const adpRaw = r['Sleeper'];           // <-- ADP value
  if (!name) continue;

  const adp = adpRaw === '' ? null : Number(adpRaw);
  if (!Number.isFinite(adp)) { misses.push([name, team || '', adpRaw || '']); continue; }

  let id = byNameTeam.get(keyNameTeam(name, team));
  if (!id) {
    // fallback: unique name-only match
    const nm = normName(name);
    const cands = Object.entries(players).filter(([ , p]) => normName(p.name || p.full_name) === nm);
    if (cands.length === 1) id = cands[0][0];
  }
  if (!id) { misses.push([name, team || '', adpRaw || '']); continue; }

  players[id].sleeperAdp = adp;   // write ADP here
  updated++;
}

// write result + backup
const backup = JSON_PATH.replace(/\.json$/, `.backup.${Date.now()}.json`);
fs.copyFileSync(JSON_PATH, backup);
fs.writeFileSync(JSON_PATH, JSON.stringify(players, null, 2));
console.log(`✅ Sleeper ADP merged into players-by-id.json (updated ${updated}).`);
console.log(`🗃️ Backup: ${backup}`);

if (misses.length) {
  const missCsv = ['Player,Team,ADP', ...misses.map(r => r.map(x => `"${String(x).replace(/"/g,'""')}"`).join(','))].join('\n');
  fs.writeFileSync(MISSES_OUT, missCsv);
  console.warn(`⚠️ ${misses.length} unmatched rows → ${MISSES_OUT}`);
}
