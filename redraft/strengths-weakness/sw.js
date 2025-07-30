// redraft/strengths-weakness/roster-strengths.js
const fs = require('fs');
const path = require('path');
const { fetchLeagueData } = require('../sleeper-league/league-data');

(async () => {
  const leagueData = await fetchLeagueData();
  if (!leagueData || !leagueData.allRosters || !leagueData.roster) {
    console.error('❌ Missing league data');
    return;
  }

  const players = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../players/players-by-id.json'))
  );

  const getTeamValue = (playerIds, pos) => {
    return playerIds
      .map(id => players[id])
      .filter(p => p && p.position === pos)
      .reduce((sum, p) => sum + (p.value || 0), 0);
  };

  const allTeams = leagueData.rosters.map(r => ({
    id: r.owner_id,
    qb: getTeamValue(r.players, 'QB'),
    rb: getTeamValue(r.players, 'RB'),
    wr: getTeamValue(r.players, 'WR'),
    te: getTeamValue(r.players, 'TE')
  }));

  const userTeam = allTeams.find(t => t.id === leagueData.userRosterId);
  const isBest = (pos) =>
    allTeams.every(t => t.id === userTeam.id || userTeam[pos] > t[pos]);

  const avg = (pos) => {
    return (
      allTeams.reduce((sum, t) => sum + t[pos], 0) / allTeams.length
    );
  };

  const thresholds = {
    wr: { strong: 5.9, weak: 6 },
    rb: { strong: 5.9, weak: 6 },
    te: { strong: 5.9, weak: 6 },
    qb: { strong: 5.9, weak: 6 }
  };

  const strengths = [];
  const weaknesses = [];

  if (isBest('wr')) {
    strengths.push('Best WR Room In The League');
  } else if (userTeam.wr > thresholds.wr.strong) {
    strengths.push('Strong WR Room');
  } else if (userTeam.wr < thresholds.wr.weak) {
    weaknesses.push('Weak WR Room');
  }

  if (isBest('rb')) {
    strengths.push('Best RB Room In The League');
  } else if (userTeam.rb > thresholds.rb.strong) {
    strengths.push('Strong RB Room');
  } else if (userTeam.rb < thresholds.rb.weak) {
    weaknesses.push('Weak RB Room');
  }

  if (isBest('te')) {
    strengths.push('Best TE Room In The League');
  } else if (userTeam.te > thresholds.te.strong) {
    strengths.push('Strong TE Room');
  } else if (userTeam.te < thresholds.te.weak) {
    weaknesses.push('Weak TE Room');
  }

  if (isBest('qb')) {
    strengths.push('Best QB Room In The League');
  } else if (userTeam.qb > thresholds.qb.strong) {
    strengths.push('Strong QB Room');
  } else if (userTeam.qb < thresholds.qb.weak) {
    weaknesses.push('Weak QB Room');
  }

  // Filter out repeated categories
  const dedupedStrengths = [...new Set(strengths)];
  const dedupedWeaknesses = [...new Set(weaknesses)];

  // Assign based on star count (mocking 3 for now)
  const starCount = 3;
  const strengthsToShow = dedupedStrengths.slice(0, starCount >= 3 ? 2 : 1);
  const weaknessesToShow = dedupedWeaknesses.slice(0, starCount >= 3 ? 1 : 2);

  function badgeHTML(label, color) {
    return `
      <div class="badge" style="background-color: ${color};">
        ${label}
      </div>
    `.trim();
  }

  const html = `
    <div class="roster-strengths">
      ${strengthsToShow.map(s => badgeHTML(s, '#b9e5b3')).join('\n')}
      ${weaknessesToShow.map(w => badgeHTML(w, '#c15252')).join('\n')}
    </div>
  `.trim();

  fs.writeFileSync(path.join(__dirname, 'roster-strengths-output.html'), html);
  console.log('✅ Roster strengths/weaknesses written to output');
})();
