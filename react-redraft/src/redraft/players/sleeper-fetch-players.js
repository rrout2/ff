const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function fetchPlayers() {
  try {
    const res = await axios.get('https://api.sleeper.app/v1/players/nfl');
    const data = res.data;

    const outPath = path.join(__dirname, 'players.json');
    fs.writeFileSync(outPath, JSON.stringify(data, null, 2));
    console.log(`✅ Player database saved to ${outPath}`);
  } catch (err) {
    console.error('❌ Failed to fetch players:', err.message);
  }
}

fetchPlayers();
