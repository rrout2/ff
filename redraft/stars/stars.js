const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '../positional-grade/player-grades-output.html');
const outputPath = path.join(__dirname, 'stars-output.html');

// Read the player grades HTML file
const html = fs.readFileSync(inputPath, 'utf8');

// Extract all grade values like "7/10" from <div class="grade-score">7/10</div>
const matches = [...html.matchAll(/<div class="grade-score">(\d+)\/10<\/div>/g)];
const grades = matches.map(match => parseInt(match[1], 10));

if (grades.length === 0) {
  console.error('❌ No grades found in player-grades-output.html');
  return;
}

// Average score
const avg = grades.reduce((sum, val) => sum + val, 0) / grades.length;

// Convert average score into star rating
let stars = 1;
if (avg > 7.9) stars = 5;
else if (avg > 5.9) stars = 4;
else if (avg > 4.9) stars = 3;
else if (avg > 2.9) stars = 2;

// Generate star HTML (filled + unfilled)
function starImg(filled) {
  return `<img src="stars-images/star_${filled ? 'filled' : 'unfilled'}.png" class="star" />`;
}

const starHTML = `
  <div class="final-verdict-stars">
    ${Array.from({ length: stars }, () => starImg(true)).join('')}
    ${Array.from({ length: 5 - stars }, () => starImg(false)).join('')}
  </div>
`.trim();

fs.writeFileSync(outputPath, starHTML);
console.log(`✅ Final Verdict: ${stars} stars (avg ${avg.toFixed(2)}) saved to stars-output.html`);
