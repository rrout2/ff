const path = require('path');
const fs = require('fs');
const { fetchLeagueData } = require('../sleeper-league/league-data');

(async () => {
  const data = await fetchLeagueData();

  console.log('📡 Fetching league settings for:', data?.leagueId, data?.displayName);

  if (!data || !data.leagueSettings) {
    console.error('❌ Missing league settings data.');
    return;
  }

  const {
    teams,
    ppr,
    tep,
    qb,
    rb,
    wr,
    te,
    flex,
    def,
    k,
    bn
  } = data.leagueSettings;

  const scoringLabel = ppr === 1 ? 'PPR' : ppr === 0.5 ? 'HALF' : ppr === 0 ? 'NONE' : ppr;

  const html = `
<div class="league-settings">
  <div class="setting"><div class="setting-label">TEAMS</div><div class="setting-box teams">${teams}</div></div>
  <div class="setting"><div class="setting-label">SCORING</div><div class="setting-box scoring">${scoringLabel}</div></div>
  <div class="setting"><div class="setting-label">TEP</div><div class="setting-box tep">${tep}</div></div>
  <div class="setting"><div class="setting-label">QB</div><div class="setting-box qb">${qb}</div></div>
  <div class="setting"><div class="setting-label">RB</div><div class="setting-box rb">${rb}</div></div>
  <div class="setting"><div class="setting-label">WR</div><div class="setting-box wr">${wr}</div></div>
  <div class="setting"><div class="setting-label">TE</div><div class="setting-box te">${te}</div></div>
  <div class="setting"><div class="setting-label">FLEX</div><div class="setting-box flex">${flex}</div></div>
  <div class="setting"><div class="setting-label">DEF</div><div class="setting-box def">${def}</div></div>
  <div class="setting"><div class="setting-label">K</div><div class="setting-box k">${k}</div></div>
  <div class="setting"><div class="setting-label">BENCH</div><div class="setting-box bench">${bn}</div></div>
</div>
  `.trim();

  const outPath = path.join(__dirname, 'league-settings-output.html');
  fs.writeFileSync(outPath, html);
  console.log('✅ League settings HTML generated at:', outPath);
})();
