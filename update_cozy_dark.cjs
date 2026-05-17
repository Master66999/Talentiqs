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
        
        // Backgrounds: Royal Black -> Deep navy charcoal & Muted blue-gray
        text = text.replace(/#0c0c0c/gi, '#0F172A'); 
        text = text.replace(/#141312/gi, '#1E293B'); 
        text = text.replace(/#1d1a19/gi, '#1E293B'); 
        text = text.replace(/#292524/gi, '#1E293B'); 
        
        // Fix borders -> rgba(255,255,255,0.05) = white/5
        text = text.replace(/\[#d5c4a1\]\/10/gi, 'white/5');
        text = text.replace(/\[#d5c4a1\]\/20/gi, 'white/5');
        text = text.replace(/\[#d5c4a1\]\/30/gi, 'white/5');
        text = text.replace(/border-white\/10/gi, 'border-white/5');
        text = text.replace(/border-white\/20/gi, 'border-white/5');
        text = text.replace(/border-white\/30/gi, 'border-white/5');
        
        // Accents: Beige/Rose/Platinum -> Primary Blue (#3B82F6)
        text = text.replace(/#d5c4a1/gi, '#3B82F6'); 
        text = text.replace(/#c2a39d/gi, '#3B82F6'); 
        text = text.replace(/#b5b2a1/gi, '#3B82F6'); 
        
        // Text Colors
        text = text.replace(/#fcfcf9/gi, '#E5E7EB'); // Primary text
        text = text.replace(/text-\[#d6d3d1\]/gi, 'text-[#E5E7EB]'); 
        text = text.replace(/text-\[#a8a29e\]/gi, 'text-[#9CA3AF]'); 
        text = text.replace(/text-\[#78716c\]/gi, 'text-[#9CA3AF]'); 
        text = text.replace(/text-\[#57534e\]/gi, 'text-[#9CA3AF]'); 

        fs.writeFileSync(filePath, text);
    }
});

let indexCssPath = path.join(__dirname, 'src', 'index.css');
let indexCss = fs.readFileSync(indexCssPath, 'utf8');
indexCss = indexCss.replace(/#0c0c0c/gi, '#0F172A');
indexCss = indexCss.replace(/#fcfcf9/gi, '#E5E7EB');
indexCss = indexCss.replace(/#d5c4a1/gi, '#3B82F6');
fs.writeFileSync(indexCssPath, indexCss);

console.log('Cozy Dark Theme updated');
