const axios = require('axios');
const { leagueId } = require('./config');

(async () => {
  const res = await axios.get(`https://api.sleeper.app/v1/league/${leagueId}/rosters`);
  console.log('📋 Team names from roster metadata:\n');

  res.data.forEach((roster, index) => {
    const teamName = roster.metadata?.team_name || '(none)';
    console.log(`Roster #${roster.roster_id}: "${teamName}"`);
  });
})();
