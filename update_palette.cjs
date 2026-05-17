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
        
        // 1. Neon Cyan -> Soft Rosy Beige (#D7CCCB)
        text = text.replace(/#00f3ff/gi, '#D7CCCB');
        text = text.replace(/rgba\(0,\s*243,\s*255/g, 'rgba(215, 204, 203');
        text = text.replace(/rgba\(0,243,255/g, 'rgba(215,204,203');

        // 2. Background Gradients: Blue-Black space -> Chocolate Brown space
        // #030014 -> #261A17
        // #0f172a -> #4E342E
        // #1e1b4b -> #3D2622
        text = text.replace(/#030014/gi, '#261A17');
        text = text.replace(/#0F172A/gi, '#4E342E');
        text = text.replace(/#1e1b4b/gi, '#3D2622');
        
        // 3. Glass panels: Indigo-tint -> Brown-tint
        // rgba(15, 23, 42, 0.4) -> #0f172a tint -> Replace with #4E342E tint (78, 52, 46)
        text = text.replace(/rgba\(15,\s*23,\s*42/g, 'rgba(78, 52, 46');
        text = text.replace(/rgba\(15,23,42/g, 'rgba(78,52,46');

        fs.writeFileSync(filePath, text);
    }
});

console.log('Palette successfully updated to Chocolate & Rosy Beige');
