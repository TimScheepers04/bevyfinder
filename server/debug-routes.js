const express = require('express');
const app = express();

// Test each route file individually
console.log('Testing route loading...');

try {
    const authRoutes = require('./routes/auth');
    console.log('✅ Auth routes loaded');
} catch (e) {
    console.log('❌ Auth routes failed:', e.message);
}

try {
    const socialRoutes = require('./routes/social');
    console.log('✅ Social routes loaded');
    
    // Mount social routes
    app.use('/api/social', socialRoutes);
    console.log('✅ Social routes mounted');
    
    // Test a route
    const testRoute = socialRoutes.stack.find(layer => layer.route && layer.route.path === '/ping');
    if (testRoute) {
        console.log('✅ Ping route found in social routes');
    } else {
        console.log('❌ Ping route not found in social routes');
        console.log('Available routes:', socialRoutes.stack.map(layer => layer.route?.path).filter(Boolean));
    }
} catch (e) {
    console.log('❌ Social routes failed:', e.message);
}

app.listen(3003, () => {
    console.log('Debug server running on port 3003');
});
