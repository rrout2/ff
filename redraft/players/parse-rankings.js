const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const overrides = require('./overrides.js');

const sleeperPlayers = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'players.json'))
);

// Build name-to-ID and ID-to-team maps
function normalize(name) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '');
}

const nameToId = {};
const idToTeam = {};
for (const [id, player] of Object.entries(sleeperPlayers)) {
  if (player.search_full_name) {
    nameToId[normalize(player.search_full_name)] = id;
  }
  if (player.team) {
    idToTeam[id] = player.team;
  }
}

const inputPath = path.join(__dirname, 'domain-rankings.csv');
const outputPath = path.join(__dirname, 'players-by-id.json');

const results = {};

fs.createReadStream(inputPath)
  .pipe(csv())
  .on('data', (row) => {
    const rawName = row['Player'].trim();
    const normalized = normalize(rawName);
    const sleeperId = overrides[rawName] || nameToId[normalized];

    if (!sleeperId) {
      console.warn(`❌ Could not find Sleeper ID for: ${rawName}`);
      return;
    }

    results[sleeperId] = {
      name: rawName,
      position: row['Pos'],
      rank: parseInt(row['Rank']),
      positionRank: parseInt(row['Position Rank']),
      value: parseFloat(row['Value']),
      team: idToTeam[sleeperId] || null
    };
  })
  .on('end', () => {
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`✅ Finished! Player data saved to ${outputPath}`);
  });
