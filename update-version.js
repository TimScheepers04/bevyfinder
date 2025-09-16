// Version Management Script for BevyFinder
// Run this script to update version numbers across all files

const fs = require('fs');
const path = require('path');

// Get new version from command line argument or increment current
const newVersion = process.argv[2] || '1.0.2';

console.log(`Updating BevyFinder to version ${newVersion}...`);

// Files to update
const files = [
    'index.html',
    'sw.js'
];

// Update each file
files.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        
        // Update version in HTML file
        if (file === 'index.html') {
            content = content.replace(/v=\d+\.\d+\.\d+/g, `v=${newVersion}`);
        }
        
        // Update version in service worker
        if (file === 'sw.js') {
            content = content.replace(/CACHE_NAME = 'bevyfinder-v\d+\.\d+\.\d+'/, `CACHE_NAME = 'bevyfinder-v${newVersion}'`);
        }
        
        fs.writeFileSync(file, content);
        console.log(`✅ Updated ${file}`);
    } else {
        console.log(`❌ File not found: ${file}`);
    }
});

// Update script.js version
const scriptContent = fs.readFileSync('script.js', 'utf8');
const updatedScript = scriptContent.replace(/const currentVersion = '\d+\.\d+\.\d+'/, `const currentVersion = '${newVersion}'`);
fs.writeFileSync('script.js', updatedScript);
console.log('✅ Updated script.js');

console.log(`\n🎉 Version updated to ${newVersion}!`);
console.log('📝 Remember to:');
console.log('  1. Commit your changes');
console.log('  2. Deploy to your hosting service');
console.log('  3. Users will automatically get the new version'); 