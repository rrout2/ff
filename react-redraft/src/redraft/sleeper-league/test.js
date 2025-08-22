const { fetchLeagueData } = require('./league-data');

(async () => {
  const data = await fetchLeagueData();

  if (!data) return;

  console.log('✔ TEAM FOUND:', data.displayName);
  console.log('📦 Roster ID:', data.rosterId);
  console.log('👥 Total Teams:', data.totalTeams);
  console.log('🧱 Starter Slots:', data.starterCounts);

  const ppr = data.scoringSettings.rec || 0;
  const teBonus = data.scoringSettings.rec_te || 0;
  console.log(`🎯 PPR: ${ppr}`);
  console.log(`🎯 TEP: ${teBonus}`);
})();
