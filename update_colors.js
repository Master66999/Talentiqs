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
        
        // Warm equivalent of gray is stone
        text = text.replace(/gray-/g, 'stone-');
        
        // Custom Dashboards
        if (filePath.includes('NonItDashboard')) {
          text = text.replace(/emerald-/g, 'rose-');
        } else if (filePath.includes('CompetitiveDashboard')) {
          text = text.replace(/indigo-/g, 'amber-');
        } else {
          // General blue to orange for Landing, Auth, Layouts, etc.
          text = text.replace(/blue-/g, 'orange-');
        }
        
        // Also fix the hex codes in index.css
        if (filePath.endsWith('index.css')) {
            text = text.replace(/#111827/g, '#1c1917'); // stone-900
            text = text.replace(/#f9fafb/g, '#fafaf9'); // stone-50
            text = text.replace(/#1e3a8a/g, '#9a3412'); // orange-800 focus ring
        }
        
        fs.writeFileSync(filePath, text);
    }
});
console.log('Colors updated');
