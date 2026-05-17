const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(dirPath);
    });
}

walk(path.join(__dirname, 'src'), (filePath) => {
    if (filePath.endsWith('.jsx')) {
        let text = fs.readFileSync(filePath, 'utf8');
        
        // Reverse the mistake: all text-[#0a0a0a] should be text-white so they are visible on dark background.
        text = text.replace(/text-\[#0a0a0a\]/g, 'text-zinc-100');
        
        fs.writeFileSync(filePath, text);
    }
});

// Fix Button.jsx specifically for gold contrasts
let btnPath = path.join(__dirname, 'src', 'components', 'Button.jsx');
let btnText = fs.readFileSync(btnPath, 'utf8');
// The primary button now has bg-[#d4af37]. Make its text dark.
btnText = btnText.replace(/primary: "bg-\[#d4af37\] text-zinc-100/g, 'primary: "bg-[#d4af37] text-[#0a0a0a]');
// Secondary button has bg-[#121212].
fs.writeFileSync(btnPath, btnText);

console.log('Text Contrast Fixed');
