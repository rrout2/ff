// redraft/starting-lineup/starters.js
const fs = require('fs');
const path = require('path');
const { fetchLeagueData } = require('../sleeper-league/league-data');

(async () => {
  const leagueData = await fetchLeagueData();
  if (!leagueData || !leagueData.leagueSettings || !leagueData.rosterId || !leagueData.roster) {
    console.error('❌ Missing league data or settings');
    return;
  }

  const settings = leagueData.leagueSettings;
  const players = JSON.parse(fs.readFileSync(path.join(__dirname, '../players/players-by-id.json')));

  const startersNeeded = {
    qb: settings.qb || 0,
    rb: settings.rb || 0,
    wr: settings.wr || 0,
    te: settings.te || 0,
    flex: settings.flex || 0,
  };

  const userPlayerIds = new Set(leagueData.roster);

  const allPlayers = Object.entries(players)
    .filter(([id]) => userPlayerIds.has(id))
    .map(([id, data]) => ({ id, ...data }))
    .sort((a, b) => a.rank - b.rank);

  const usedIds = new Set();
  const finalPlayers = [];

  function assignSlot(pos, count) {
    const picked = allPlayers.filter(p => p.position === pos && !usedIds.has(p.id)).slice(0, count);
    picked.forEach(p => {
      p.slot = pos.toLowerCase();
      usedIds.add(p.id);
      finalPlayers.push(p);
    });
  }

  assignSlot('QB', startersNeeded.qb);
  assignSlot('RB', startersNeeded.rb);
  assignSlot('WR', startersNeeded.wr);
  assignSlot('TE', startersNeeded.te);

  const flexCandidates = allPlayers.filter(
    p => ['RB', 'WR', 'TE'].includes(p.position) && !usedIds.has(p.id)
  ).slice(0, startersNeeded.flex);
  flexCandidates.forEach(p => {
    p.slot = 'flex';
    usedIds.add(p.id);
    finalPlayers.push(p);
  });

  const startersCount = finalPlayers.length;
  const totalNeeded = Math.max(10, startersCount + 2);
  const benchCount = totalNeeded - startersCount;

  const benchPlayers = allPlayers.filter(p => !usedIds.has(p.id)).slice(0, benchCount);
  benchPlayers.forEach(p => {
    p.slot = 'bench';
    finalPlayers.push(p);
  });

  // Strictly ordered list: qb → rb → wr → te → flex → bench
  const ordered = ['qb', 'rb', 'wr', 'te', 'flex', 'bench']
    .flatMap(slot => finalPlayers.filter(p => p.slot === slot));

  // Then divide the full ordered list vertically: top half left, bottom half right
  const mid = Math.ceil(ordered.length / 2);
  const leftCol = ordered.slice(0, mid);
  const rightCol = ordered.slice(mid);

  function playerHTML(p) {
    const slotClass =
      p.slot === 'qb' ? 'pos-qb' :
      p.slot === 'rb' ? 'pos-rb' :
      p.slot === 'wr' ? 'pos-wr' :
      p.slot === 'te' ? 'pos-te' :
      p.slot === 'flex' ? 'pos-flex' : 'pos-bench';

    const headshot = `https://sleepercdn.com/content/nfl/players/thumb/${p.id}.jpg`;
    const slotLabel = p.slot.toUpperCase();
    const team = p.team || '-';

    const detailLabel = ['flex', 'bench'].includes(p.slot)
      ? `${slotLabel} – ${p.position} – ${team}`
      : `${p.position} – ${team}`;

    return `
      <div class="player-row ${slotClass}">
        <img class="player-headshot" style="width: 40px; height: 40px; margin-right: 10px;" src="${headshot}" onerror="this.src='fallback.png'" />
        <div class="player-info">
          <div class="player-name" style="font-size: 18px;">${p.name.toUpperCase()}</div>
          <div class="player-details" style="font-size: 12px; margin-top: 1px;">${detailLabel}</div>
        </div>
      </div>
    `;
  }

  const html = `
    
    <div class="starting-roster">
      <div class="roster-column">
        ${leftCol.map(playerHTML).join('\n')}
      </div>
      <div class="roster-column">
        ${rightCol.map(playerHTML).join('\n')}
      </div>
    </div>
  `.trim();

  fs.writeFileSync(path.join(__dirname, 'starting-roster-output.html'), html);
  console.log('✅ Starters HTML generated for your team roster');
})();
