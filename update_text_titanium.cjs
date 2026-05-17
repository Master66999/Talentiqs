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
    if (filePath.endsWith('.jsx') || filePath.endsWith('.css')) {
        let text = fs.readFileSync(filePath, 'utf8');
        
        // Primary Text: Soft White/Bluish -> Warm Off-White (Sand tint)
        text = text.replace(/#E5E7EB/gi, '#EFE9DF');
        text = text.replace(/text-white/gi, 'text-[#FDFBF7]');

        // Secondary Text/Placeholders: Bluish-Gray -> Warm Sand-Gray
        text = text.replace(/#9CA3AF/gi, '#B0ACA5');
        
        // In case there's any stray text-gray-400 or something in the jsx
        text = text.replace(/text-gray-200/gi, 'text-[#EFE9DF]');
        text = text.replace(/text-gray-300/gi, 'text-[#D0C9C0]'); // slightly darker sand
        text = text.replace(/text-gray-400/gi, 'text-[#B0ACA5]');

        fs.writeFileSync(filePath, text);
    }
});

console.log('Text colors smoothly harmonized with the Titanium Theme');
