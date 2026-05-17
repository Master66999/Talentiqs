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
        
        // Backgrounds: Onyx -> Royal Black
        text = text.replace(/#0a0a0a/g, '#0c0c0c'); // Deepest Royal Black
        text = text.replace(/#121212/g, '#141312'); // Royal Black Surface
        text = text.replace(/#1e1e1e/g, '#1d1a19'); // Slightly lighter
        text = text.replace(/#2a2a2a/g, '#292524'); // Even lighter
        
        // Fix borders
        text = text.replace(/white\/10/g, '[#d5c4a1]/10');
        text = text.replace(/white\/20/g, '[#d5c4a1]/20');
        text = text.replace(/white\/30/g, '[#d5c4a1]/30');
        
        // Accents: Gold -> Cozy Beige
        text = text.replace(/#d4af37/g, '#d5c4a1'); 
        
        // Accents: Rose Gold -> Warm Rose Beige
        text = text.replace(/#b76e79/g, '#c2a39d'); 
        
        // Accents: Platinum -> Golden Beige (to match primary)
        text = text.replace(/#e5e4e2/g, '#b5b2a1'); 
        
        // Text Colors
        text = text.replace(/text-white/g, 'text-[#fcfcf9]');
        text = text.replace(/text-zinc-100/g, 'text-[#fcfcf9]');
        text = text.replace(/text-gray-300/g, 'text-[#a8a29e]');
        text = text.replace(/text-gray-400/g, 'text-[#78716c]');
        text = text.replace(/text-gray-500/g, 'text-[#57534e]');

        fs.writeFileSync(filePath, text);
    }
});

let indexCssPath = path.join(__dirname, 'src', 'index.css');
let indexCss = fs.readFileSync(indexCssPath, 'utf8');
indexCss = indexCss.replace(/#0a0a0a/g, '#0c0c0c');
indexCss = indexCss.replace(/#ffffff/g, '#fcfcf9');
indexCss = indexCss.replace(/#d4af37/g, '#d5c4a1');
fs.writeFileSync(indexCssPath, indexCss);

console.log('Royal Black & Cozy Beige Theme updated');
