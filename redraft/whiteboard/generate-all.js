// redraft/generate-all.js
const { exec } = require('child_process');

const scripts = [
  'redraft/league-settings/generate-league-settings.js',
  'redraft/team-name/team-name.js',
  'redraft/starting-lineup/starters.js',
  'redraft/positional-grade/player-grades.js',
  'redraft/stars/stars.js'
];

for (const script of scripts) {
  console.log(`🔄 Running ${script}`);
  exec(`node ${script}`, (err, stdout, stderr) => {
    if (err) {
      console.error(`❌ Error running ${script}:`, err.message);
    } else {
      console.log(`✅ Done: ${script}`);
    }
    if (stderr) console.error(stderr);
    if (stdout) console.log(stdout);
  });
}
