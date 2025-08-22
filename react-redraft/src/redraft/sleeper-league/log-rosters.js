const fs = require('fs');
const path = require('path');
const { fetchLeagueData } = require('./league-data');

// Load player names from players-by-id.json
const playerDb = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../players/players-by-id.json'))
);

(async () => {
  const data = await fetchLeagueData();
  if (!data || !data.roster || data.roster.length === 0) {
    console.error('❌ Your team roster could not be found.');
    return;
  }

  console.log(`\n📋 Team: ${data.displayName} (Your Roster)\n`);
  data.roster.forEach((pid, i) => {
    const p = playerDb[pid];
    const name = p?.name || '(Unknown)';
    const pos = p?.position || '??';
    const value = p?.value?.toFixed(1) ?? 'N/A';
    console.log(` ${i + 1}. ${name} [${pos}] — Value: ${value}`);
  });
})();
