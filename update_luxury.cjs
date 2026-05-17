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
        
        // Backgrounds
        text = text.replace(/bg-white\b/g, 'bg-[#121212]');
        text = text.replace(/bg-stone-50\b|bg-gray-50\b/g, 'bg-[#0a0a0a]');
        text = text.replace(/bg-stone-100\b|bg-gray-100\b/g, 'bg-[#1e1e1e]');
        text = text.replace(/bg-stone-200\b|bg-gray-200\b/g, 'bg-[#2a2a2a]');
        
        // Text
        text = text.replace(/text-stone-900\b|text-gray-900\b/g, 'text-white');
        text = text.replace(/text-stone-800\b|text-gray-800\b/g, 'text-gray-200');
        text = text.replace(/text-stone-700\b|text-gray-700\b/g, 'text-gray-300');
        text = text.replace(/text-stone-600\b|text-gray-600\b/g, 'text-gray-400');
        text = text.replace(/text-stone-500\b|text-gray-500\b/g, 'text-gray-500');
        text = text.replace(/text-white\b/g, 'text-[#0a0a0a]'); 

        // Borders
        text = text.replace(/border-stone-100\b|border-gray-100\b/g, 'border-white/10');
        text = text.replace(/border-stone-200\b|border-gray-200\b/g, 'border-white/10');
        text = text.replace(/border-stone-300\b|border-gray-300\b/g, 'border-white/20');
        text = text.replace(/border-stone-400\b|border-gray-400\b/g, 'border-white/30');

        // General Accents: Gold (#d4af37)
        text = text.replace(/orange-900\b|orange-800\b|orange-700\b|orange-600\b/g, '[#d4af37]');
        text = text.replace(/orange-100\b|orange-50\b|orange-200\b/g, '[#d4af37]/10');
        text = text.replace(/text-orange-/g, 'text-');
        text = text.replace(/bg-orange-/g, 'bg-');
        text = text.replace(/border-orange-/g, 'border-');
        text = text.replace(/ring-orange-/g, 'ring-');
        text = text.replace(/from-orange-/g, 'from-');
        text = text.replace(/to-orange-/g, 'to-');

        // Specific Overrides for Dashboards
        if (filePath.includes('NonItDashboard')) {
          // Rose Gold (#b76e79)
          text = text.replace(/rose-900\b|rose-800\b|rose-700\b|rose-\d00\b/g, '[#b76e79]');
          text = text.replace(/rose-100\b|rose-50\b|rose-200\b/g, '[#b76e79]/10');
          text = text.replace(/text-rose-/g, 'text-');
          text = text.replace(/bg-rose-/g, 'bg-');
          text = text.replace(/border-rose-/g, 'border-');
          text = text.replace(/ring-rose-/g, 'ring-');
        } else if (filePath.includes('CompetitiveDashboard')) {
          // Platinum (#e5e4e2) with dark text for contrast
          text = text.replace(/amber-900\b|amber-800\b|amber-700\b|amber-\d00\b/g, '[#e5e4e2]');
          text = text.replace(/amber-100\b|amber-50\b|amber-200\b/g, '[#e5e4e2]/10');
          text = text.replace(/text-amber-/g, 'text-');
          text = text.replace(/bg-amber-/g, 'bg-');
          text = text.replace(/border-amber-/g, 'border-');
          text = text.replace(/ring-amber-/g, 'ring-');
          // For platinum bg, text should be black
          // Usually we replaced text-white with text-[#0a0a0a].
        }
        
        // Clean up any occurrences of class names containing text-text or bg-bg
        text = text.replace(/text-text-/g, 'text-');
        text = text.replace(/bg-bg-/g, 'bg-');

        fs.writeFileSync(filePath, text);
    }
});

let indexCss = fs.readFileSync(path.join(__dirname, 'src', 'index.css'), 'utf8');
indexCss = indexCss.replace(/#fafaf9/g, '#0a0a0a'); // Background color to onyx
indexCss = indexCss.replace(/#111827/g, '#ffffff'); // Text color to white
indexCss = indexCss.replace(/#9a3412/g, '#d4af37'); // Outline color to gold
fs.writeFileSync(path.join(__dirname, 'src', 'index.css'), indexCss);

console.log('Luxury Dark Theme updated');
