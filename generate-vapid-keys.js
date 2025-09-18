// Generate VAPID keys locally
// Run this with: node generate-vapid-keys.js

const webpush = require('web-push');

console.log('🔑 Generating VAPID keys...\n');

const vapidKeys = webpush.generateVAPIDKeys();

console.log('=== COPY THESE TO RENDER ENVIRONMENT ===\n');
console.log('VAPID_PUBLIC_KEY=' + vapidKeys.publicKey);
console.log('');
console.log('VAPID_PRIVATE_KEY=' + vapidKeys.privateKey);
console.log('');
console.log('VAPID_EMAIL=mailto:admin@bevyfinder.com');
console.log('\n=== DONE ===');


