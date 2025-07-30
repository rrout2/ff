if (!userRoster) {
  console.error(`❌ Could not find user roster for team name: ${teamName}`);
  return null;
}

// Extract Superflex info
const positions = leagueRes.data.roster_positions || [];
const flex_qb = positions.filter(pos => pos === 'QWRTE').length;

console.log('✅ Returning league data with', rosters.length, 'rosters');

return {
  leagueId,
  displayName,
  leagueSettings: {
    ...leagueSettings,
    flex_qb
  },
  userRosterId: userRoster.owner_id,
  roster: userRoster.players || [],
  allRosters: rosters.map(r => ({
    owner_id: r.owner_id,
    teamName: r.metadata?.team_name || `Team ${r.roster_id}`,
    players: r.players || []
  }))
};
