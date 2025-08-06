const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/User');

// Connect to MongoDB
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return true;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        return false;
    }
};

// Create test user
const createTestUser = async () => {
    try {
        console.log('Creating test user...');
        
        // Check if user already exists
        const existingUser = await User.findOne({ email: 'demo@bevyfinder.com' });
        if (existingUser) {
            console.log('Test user already exists. Updating password...');
            existingUser.password = 'password123';
            await existingUser.save();
            console.log('✅ Password updated for demo@bevyfinder.com');
        } else {
            const testUser = await User.create({
                name: 'Demo User',
                email: 'demo@bevyfinder.com',
                password: 'password123',
                isVerified: true,
                profile: {
                    bio: 'Demo user for testing social feed',
                    location: 'Sydney, Australia',
                    avatar: null
                }
            });
            console.log('✅ Test user created: demo@bevyfinder.com / password123');
        }

    } catch (error) {
        console.error('Error creating test user:', error);
    }
};

// Main execution
const main = async () => {
    const connected = await connectDB();
    if (connected) {
        await createTestUser();
        mongoose.connection.close();
    }
};

main(); 