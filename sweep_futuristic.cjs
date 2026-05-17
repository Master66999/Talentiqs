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
        
        // Fix textareas directly
        text = text.replace(/bg-\[#1E293B\] text-\[#E5E7EB\] placeholder-\[#9CA3AF\] border border-white\/5/g, 'glass-panel text-[#00f3ff] placeholder-[#00f3ff]/50 hover:border-[#00f3ff]/50 focus:border-[#00f3ff]');
        
        if (filePath.includes('Navbar.jsx')) {
            text = text.replace(/bg-\[#0F172A\]\/80 backdrop-blur-md/g, 'glass-panel border-b-0 backdrop-blur-xl');
            text = text.replace(/bg-white\/80 backdrop-blur-md border-b/g, 'glass-panel border-b-0 backdrop-blur-xl');
        }

        if (filePath.includes('Landing.jsx')) {
            // Replace hardcoded section backgrounds with transparent or glass styles
            text = text.replace(/bg-\[#0F172A\]/g, 'bg-transparent');
            text = text.replace(/bg-\[#1E293B\]/g, 'glass-panel');
            
            // Text to neon glows
            text = text.replace(/text-zinc-100/g, 'neon-glow-text font-black tracking-widest');
            text = text.replace(/text-\[#E5E7EB\]/g, 'neon-glow-text');
            text = text.replace(/text-\[#0F172A\] mb-4/g, 'neon-glow-text mb-4');
            text = text.replace(/text-\[#0a0a0a\]/g, 'neon-glow-text');
            
            // Animate features
            text = text.replace(/hover:-translate-y-1 transition-transform duration-300/g, 'hover:-translate-y-2 transition-all duration-300 shadow-[0_0_15px_rgba(0,243,255,0.1)] hover:shadow-[0_0_30px_rgba(0,243,255,0.6)] hover:border-[#00f3ff]');
        }

        fs.writeFileSync(filePath, text);
    }
});

console.log('Futuristic sweep finished');
