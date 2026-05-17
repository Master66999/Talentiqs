const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'dashboard', 'ItDashboard.jsx');
let c = fs.readFileSync(filePath, 'utf8');

// Fix 1: "BEST MATCH [garbled] ACTION ENGINE" badge text
// The garbled part is supposed to be "·" (U+00B7 middle dot)
c = c.replace(/BEST MATCH [^\w\s<"]{2,} ACTION ENGINE/g, 'BEST MATCH \u00B7 ACTION ENGINE');

// Fix 2: Garbled ▸ triangle bullet in the relevanceReasons list
// The garbled content inside the <span> is supposed to be "▸"
c = c.replace(/<span style=\{\{ color: T\.emerald, flexShrink: 0 \}\}>[^<]{4,}<\/span>/g, 
              '<span style={{ color: T.emerald, flexShrink: 0 }}>&#9656;</span>');

// Fix 3: Garbled em-dash "—" in comment "Nav links — always visible"  
c = c.replace(/\{\/\* Nav links [^\w\s*]{2,} always visible \*\/\}/g, '{/* Nav links \u2014 always visible */}');

// Fix 4: Also clean any remaining runs of Latin-1 garbage (3+ non-ASCII chars in a row)
// but only in JSX text content (between > and <) — NOT inside JS strings/logic
c = c.replace(/>([^<]*[\u00C0-\u00FF]{3,}[^<]*)</g, (match, inner) => {
  // Strip the garbled chars, preserve surrounding text
  const cleaned = inner.replace(/[\u00C0-\u00FF]+/g, '');
  return `>${cleaned}<`;
});

fs.writeFileSync(filePath, c, 'utf8');
console.log('Fixed garbled strings in HeroJobCard and Sidebar.');
