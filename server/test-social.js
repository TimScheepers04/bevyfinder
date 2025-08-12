const express = require('express');
const app = express();

// Test social routes
try {
    const socialRoutes = require('./routes/social');
    console.log('✅ Social routes loaded successfully');
    
    app.use('/api/social', socialRoutes);
    console.log('✅ Social routes mounted');
    
    app.listen(3002, () => {
        console.log('Test server running on port 3002');
    });
} catch (error) {
    console.error('❌ Error loading social routes:', error);
}
