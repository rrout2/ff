const fs = require('fs');
const path = require('path');
const { fetchLeagueData } = require('../sleeper-league/league-data');

(async () => {
  const leagueData = await fetchLeagueData();

  if (!leagueData || !leagueData.displayName) {
    console.error('❌ Could not get team name from league data');
    return;
  }

  const teamName = leagueData.displayName.toUpperCase();

const html = `
  <div class="team-name-wrapper">
    <div class="team-name">${teamName}</div>
  </div>
`.trim();

  const outPath = path.join(__dirname, 'team-name-output.html');
  fs.writeFileSync(outPath, html);
  console.log('✅ Team name HTML generated:', outPath);
})();
