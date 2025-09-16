// Test MongoDB Connection
require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
    console.log('🔍 Testing MongoDB connection...');
    console.log('Connection string:', process.env.MONGODB_URI ? 'Set' : 'Not set');
    
    if (!process.env.MONGODB_URI) {
        console.error('❌ MONGODB_URI not found in .env file');
        console.log('Please set up your MongoDB connection string in the .env file');
        process.exit(1);
    }
    
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('✅ MongoDB Connected Successfully!');
        console.log(`📍 Host: ${conn.connection.host}`);
        console.log(`🗄️  Database: ${conn.connection.name}`);
        
        // Test creating a simple document
        const TestModel = mongoose.model('Test', new mongoose.Schema({ name: String }));
        const testDoc = new TestModel({ name: 'connection-test' });
        await testDoc.save();
        console.log('✅ Database write test: PASSED');
        
        // Clean up test document
        await TestModel.deleteOne({ name: 'connection-test' });
        console.log('✅ Database cleanup: PASSED');
        
        await mongoose.connection.close();
        console.log('✅ Connection closed successfully');
        
    } catch (error) {
        console.error('❌ MongoDB connection failed:');
        console.error(error.message);
        
        if (error.message.includes('Authentication failed')) {
            console.log('\n💡 Authentication failed. Check your username and password in the connection string.');
        } else if (error.message.includes('ECONNREFUSED')) {
            console.log('\n💡 Connection refused. Make sure MongoDB is running or your Atlas cluster is accessible.');
        } else if (error.message.includes('ENOTFOUND')) {
            console.log('\n💡 Host not found. Check your connection string format.');
        }
        
        process.exit(1);
    }
}

testConnection(); 