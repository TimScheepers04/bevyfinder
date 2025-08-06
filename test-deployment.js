#!/usr/bin/env node

console.log('🚀 Testing deployment...');
console.log('📊 Node.js version:', process.version);
console.log('📁 Current directory:', process.cwd());
console.log('📦 Package.json exists:', require('fs').existsSync('package.json'));
console.log('🔧 Server file exists:', require('fs').existsSync('server-render.js'));

try {
    console.log('✅ All checks passed!');
    process.exit(0);
} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
} 