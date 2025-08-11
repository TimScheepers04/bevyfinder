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

// Reset login attempts for a user
const resetLoginAttempts = async (email) => {
    try {
        const User = require('./models/User');
        
        const result = await User.updateOne(
            { email: email.toLowerCase() },
            { 
                $unset: { 
                    loginAttempts: 1, 
                    lockUntil: 1 
                } 
            }
        );

        if (result.modifiedCount > 0) {
            console.log(`✅ Login attempts reset for ${email}`);
        } else {
            console.log(`❌ User ${email} not found`);
        }
    } catch (error) {
        console.error('Error resetting login attempts:', error);
    }
};

// Main function
const main = async () => {
    await connectDB();
    
    const email = process.argv[2];
    if (!email) {
        console.log('Usage: node reset-login-attempts.js <email>');
        console.log('Example: node reset-login-attempts.js test@example.com');
        process.exit(1);
    }
    
    await resetLoginAttempts(email);
    process.exit(0);
};

main();

