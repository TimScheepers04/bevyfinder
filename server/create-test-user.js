const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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

// Create a test user
const createTestUser = async () => {
    try {
        const User = require('./models/User');
        
        // Check if user already exists
        const existingUser = await User.findOne({ email: 'testlogin@example.com' });
        if (existingUser) {
            console.log('User already exists, updating password...');
            
            // Update password
            const hashedPassword = await bcrypt.hash('123456', 12);
            await User.updateOne(
                { email: 'testlogin@example.com' },
                { 
                    password: hashedPassword,
                    name: 'Test User',
                    personalDetails: {
                        age: 25,
                        weight: 70,
                        gender: 'male'
                    }
                }
            );
            console.log('✅ User password updated');
        } else {
            // Create new user
            const hashedPassword = await bcrypt.hash('123456', 12);
            const newUser = new User({
                name: 'Test User',
                email: 'testlogin@example.com',
                password: hashedPassword,
                personalDetails: {
                    age: 25,
                    weight: 70,
                    gender: 'male'
                }
            });
            
            await newUser.save();
            console.log('✅ Test user created successfully');
        }
        
        console.log('\n📋 Test User Details:');
        console.log('Email: testlogin@example.com');
        console.log('Password: 123456');
        console.log('Name: Test User');
        console.log('Age: 25');
        console.log('Weight: 70 kg');
        console.log('Gender: male');
        
    } catch (error) {
        console.error('Error creating test user:', error);
    }
};

// Main function
const main = async () => {
    await connectDB();
    await createTestUser();
    process.exit(0);
};

main(); 