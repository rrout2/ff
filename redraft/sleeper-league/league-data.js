const { leagueId, teamName } = require('./config');
const axios = require('axios');

async function fetchLeagueData() {
  try {
    console.log('📡 Fetching league settings for:', leagueId, teamName);

    const leagueRes = await axios.get(`https://api.sleeper.app/v1/league/${leagueId}`);
    const rostersRes = await axios.get(`https://api.sleeper.app/v1/league/${leagueId}/rosters`);
    const usersRes = await axios.get(`https://api.sleeper.app/v1/league/${leagueId}/users`);

    // ✅ Match by Sleeper username (display_name)
    const teamUser = usersRes.data.find(user =>
      user.display_name.toLowerCase().trim() === teamName.toLowerCase().trim()
    );

    if (!teamUser) {
      console.error('❌ No user matched display_name:', teamName);
      return null;
    }

    const teamRoster = rostersRes.data.find(roster =>
      roster.owner_id === teamUser.user_id
    );

    if (!teamRoster) {
      console.error('❌ No roster found for user ID:', teamUser.user_id);
      return null;
    }

    const positions = leagueRes.data.roster_positions;
    const scoring = leagueRes.data.scoring_settings || {};

    return {
      leagueId,
      displayName: teamUser.display_name,
      rosterId: teamRoster.roster_id,
      roster: teamRoster.players,
      leagueSettings: {
        teams: leagueRes.data.total_rosters || 0,
        ppr: scoring.rec ?? 'NONE',
        tep: scoring.te_rec || 0,
        qb: positions.filter(pos => pos === 'QB').length,
        rb: positions.filter(pos => pos === 'RB').length,
        wr: positions.filter(pos => pos === 'WR').length,
        te: positions.filter(pos => pos === 'TE').length,
        flex: positions.filter(pos =>
          ['FLEX', 'WRRB', 'WRTE', 'RBWRTE'].includes(pos)
        ).length,
        def: positions.filter(pos => pos === 'DEF').length,
        k: positions.filter(pos => pos === 'K').length,
        bn: positions.filter(pos => pos === 'BN').length
      }
    };
  } catch (err) {
    console.error('❌ Sleeper fetch failed:', err.message);
    console.error(err);
    return null;
  }
}

module.exports = { fetchLeagueData };
