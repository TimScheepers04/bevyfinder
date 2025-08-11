const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI not found in environment variables');
        }
        
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('MongoDB Connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// List all users
const listUsers = async () => {
    try {
        const User = require('./models/User');
        
        const users = await User.find({}).select('-password'); // Exclude password field
        
        console.log('\n📋 Users in Database:');
        console.log('=====================');
        
        if (users.length === 0) {
            console.log('No users found in database');
            return;
        }
        
        users.forEach((user, index) => {
            console.log(`\n${index + 1}. User Details:`);
            console.log(`   Name: ${user.name}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Age: ${user.personalDetails?.age || 'Not set'}`);
            console.log(`   Weight: ${user.personalDetails?.weight || 'Not set'} kg`);
            console.log(`   Gender: ${user.personalDetails?.gender || 'Not set'}`);
            console.log(`   Created: ${user.createdAt}`);
            console.log(`   Login Attempts: ${user.loginAttempts || 0}`);
            console.log(`   Locked Until: ${user.lockUntil || 'Not locked'}`);
            console.log(`   Is Locked: ${user.isLocked || false}`);
        });
        
        console.log(`\nTotal users: ${users.length}`);
    } catch (error) {
        console.error('Error listing users:', error);
    }
};

// Main function
const main = async () => {
    await connectDB();
    await listUsers();
    process.exit(0);
};

main();

