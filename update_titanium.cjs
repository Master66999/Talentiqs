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
        
        // 1. Rosy Beige (#D7CCCB) -> Sand Beige (#D8C9AE)
        text = text.replace(/#D7CCCB/gi, '#D8C9AE');
        text = text.replace(/rgba\(215,\s*204,\s*203/g, 'rgba(216, 201, 174');
        text = text.replace(/rgba\(215,204,203/g, 'rgba(216,201,174');

        // 2. Background Gradients: Espresso -> Titanium & Jet Black
        text = text.replace(/#261A17/gi, '#1A1A1A'); // Deepest point
        text = text.replace(/#4E342E/gi, '#2E2E2E'); // Mid point
        text = text.replace(/#3D2622/gi, '#575757'); // Metallic Gray (User's #575757)
        
        // 3. Glass panels
        text = text.replace(/rgba\(78,\s*52,\s*46/g, 'rgba(87, 87, 87');
        text = text.replace(/rgba\(78,52,46/g, 'rgba(87,87,87');

        fs.writeFileSync(filePath, text);
    }
});

console.log('Palette successfully updated to Sand/Titanium');
