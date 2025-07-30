const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Load Sleeper player data
const sleeperPlayers = JSON.parse(fs.readFileSync(path.join(__dirname, 'players.json')));
const playersById = JSON.parse(fs.readFileSync(path.join(__dirname, 'players-by-id.json')));

// Normalize helper
function normalize(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Build name → ID map
const nameToId = {};
for (const [id, player] of Object.entries(sleeperPlayers)) {
  if (player.full_name) {
    nameToId[normalize(player.full_name)] = id;
  }
}

// Read rankings-te.csv and inject te_value
const inputPath = path.join(__dirname, 'rankings-te.csv');
const outputPath = path.join(__dirname, 'players-by-id.json');

fs.createReadStream(inputPath)
  .pipe(csv())
  .on('data', (row) => {
    const rawName = row['Player'].trim();
    const value = parseFloat(row['Value']);
    const normalized = normalize(rawName);
    const id = nameToId[normalized];

    if (!id || !playersById[id]) {
      console.warn(`❌ Could not match TE: ${rawName}`);
      return;
    }

    playersById[id].te_value = value;
    console.log(`✅ Injected TE value for ${rawName}: ${value}`);
  })
  .on('end', () => {
    fs.writeFileSync(outputPath, JSON.stringify(playersById, null, 2));
    console.log(`✅ Updated players-by-id.json with TE values`);
  });
