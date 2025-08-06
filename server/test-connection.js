require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
    console.log('🔍 Testing MongoDB Atlas connection...');
    console.log('📡 Connection string:', process.env.MONGODB_URI ? 'Found' : 'Missing');
    
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('✅ Successfully connected to MongoDB Atlas!');
        
        // Test database operations
        const db = mongoose.connection;
        console.log('📊 Database name:', db.name);
        console.log('🔌 Connection state:', db.readyState);
        
        // Test a simple write operation
        const testCollection = db.collection('test');
        await testCollection.insertOne({ 
            test: true, 
            timestamp: new Date(),
            message: 'Connection test successful'
        });
        console.log('✅ Write test: PASSED');
        
        // Test a simple read operation
        const result = await testCollection.findOne({ test: true });
        console.log('✅ Read test: PASSED');
        
        // Clean up test data
        await testCollection.deleteOne({ test: true });
        console.log('✅ Cleanup test: PASSED');
        
        console.log('\n🎉 All tests passed! Your MongoDB Atlas connection is working perfectly.');
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        
        if (error.message.includes('ENOTFOUND')) {
            console.log('💡 Tip: Check your internet connection');
        } else if (error.message.includes('Authentication failed')) {
            console.log('💡 Tip: Check your username and password in the connection string');
        } else if (error.message.includes('ECONNREFUSED')) {
            console.log('💡 Tip: Check if your IP address is whitelisted in MongoDB Atlas');
        }
        
        process.exit(1);
    } finally {
        // Close the connection
        await mongoose.connection.close();
        console.log('🔌 Connection closed');
    }
}

// Run the test
testConnection(); 