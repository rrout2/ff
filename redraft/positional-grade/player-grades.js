const fs = require('fs');
const path = require('path');
const { fetchLeagueData } = require('../sleeper-league/league-data');

// Hardcoded threshold matrix
const gradeMatrix = {
  SF: {
    QB: [4, 10, 20, 30, 40, 50, 60, 66, 74, 80],
    RB: [10, 25, 50, 75, 100, 125, 140, 165, 180, 200],
    WR: [20, 50, 70, 90, 110, 130, 160, 200, 250, 300],
    TE: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] // not used now, but future-proofed
  },
  '1QB': {
    QB: [2, 5, 10, 15, 20, 25, 30, 33, 37, 40],
    RB: [10, 25, 50, 75, 100, 125, 140, 165, 180, 200],
    WR: [20, 50, 70, 90, 110, 130, 160, 200, 250, 300],
    TE: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] // not used now, but future-proofed
  }
};

(async () => {
  const leagueData = await fetchLeagueData();
  if (!leagueData || !leagueData.roster) {
    console.error('❌ Missing league data');
    return;
  }

  const players = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../players/players-by-id.json'))
  );

  const userPlayerIds = new Set(leagueData.roster);

  const allPlayers = Object.entries(players)
    .filter(([id]) => userPlayerIds.has(id))
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => a.rank - b.rank);

  const starterCounts = leagueData.leagueSettings;

  function getTopPlayers(pos, count) {
    return allPlayers.filter(p => p.position === pos).slice(0, count);
  }

  function sumValue(players) {
    return players.reduce((sum, p) => sum + (p.value || 0), 0);
  }

  function getGrade(thresholds, value) {
    for (let i = thresholds.length - 1; i >= 0; i--) {
      if (value >= thresholds[i]) return i + 1;
    }
    return 1;
  }

  const isSF = leagueData.leagueSettings.flex_qb === 1;
  const mode = isSF ? 'SF' : '1QB';
  const grades = {};

  for (const pos of ['QB', 'RB', 'WR']) {
    const count = starterCounts[pos.toLowerCase()] || 0;
    const starters = getTopPlayers(pos, count);
    const total = sumValue(starters);
    const grade = getGrade(gradeMatrix[mode][pos], total);
    grades[pos] = { total, grade };
  }

  // ✅ TE: use te_value directly
  const topTE = allPlayers.find(p => p.position === 'TE' && typeof p.te_value === 'number');
  const teGrade = topTE ? Math.round(topTE.te_value) : 1;
  grades.TE = { grade: teGrade };

  // HTML output
  function gradeBarHTML(pos, grade) {
    const posClass = pos.toLowerCase();
    const percent = (grade / 10) * 100;
    return `
      <div class="grade-row">
        <div class="grade-label">${pos}</div>
        <div class="grade-bar-wrapper">
          <div class="grade-bar-fill ${posClass}-fill" style="width: ${percent}%"></div>
        </div>
        <div class="grade-score">${grade}/10</div>
      </div>
    `;
  }

  const html = `
    <div class="positional-grades">
      ${gradeBarHTML('QB', grades.QB.grade)}
      ${gradeBarHTML('RB', grades.RB.grade)}
      ${gradeBarHTML('WR', grades.WR.grade)}
      ${gradeBarHTML('TE', grades.TE.grade)}
    </div>
  `.trim();

  fs.writeFileSync(path.join(__dirname, 'player-grades-output.html'), html);
  console.log(`✅ Positional grades generated using ${mode} thresholds`);
})();
