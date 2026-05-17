const fs = require('fs');
let lines = fs.readFileSync('src/dashboard/ItDashboard.jsx', 'utf8').split('\r\n');
// New clean UploadZone ends around line 160 (0-indexed 159)
// Old corrupted body starts at ~line 161 (0-indexed 160) with "  const ref = useRef(null);"
// AnalyzingLoader starts at line 364 (0-indexed 363)
// So delete lines 160 to 362 (0-indexed), inclusive = 203 lines
const startDel = 159; // 0-indexed line 160
const endDel = 362;   // 0-indexed line 363 (exclusive: AnalyzingLoader line)

// Verify
console.log('Line to keep before delete:', lines[startDel-1]);
console.log('First line to delete:', lines[startDel]);
console.log('Last line to delete:', lines[endDel-1]);
console.log('First line to keep after:', lines[endDel]);

lines.splice(startDel, endDel - startDel);
fs.writeFileSync('src/dashboard/ItDashboard.jsx', lines.join('\r\n'), 'utf8');
console.log('Done. Lines now:', lines.length);
