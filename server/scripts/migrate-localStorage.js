const mongoose = require('mongoose');
const User = require('../models/User');
const Drink = require('../models/Drink');
require('dotenv').config();

// Sample localStorage data structure (you'll need to export this from your frontend)
const sampleLocalStorageData = {
    users: {
        "user@example.com": {
            id: "user_1234567890_abc123",
            email: "user@example.com",
            name: "John Doe",
            password: "encoded_password",
            createdAt: "2024-12-19T10:30:00.000Z",
            profile: {
                avatar: null,
                bio: "",
                location: "",
                preferences: {
                    favoriteDrinks: ["carlton-draught", "coopers-pale-ale"],
                    dietaryRestrictions: [],
                    notifications: true
                }
            },
            stats: {
                searches: 15,
                favorites: 8,
                lastActive: "2024-12-19T15:45:00.000Z"
            }
        }
    },
    favorites: ["carlton-draught", "coopers-pale-ale"],
    history: [
        {
            beverageKey: "carlton-draught",
            searchMethod: "text",
            timestamp: "2024-12-19T15:45:00.000Z",
            date: "12/19/2024",
            time: "3:45 PM"
        }
    ]
};

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for migration');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

// Migrate users from localStorage to database
const migrateUsers = async (localStorageData) => {
    console.log('Starting user migration...');
    
    const users = localStorageData.users || {};
    const migratedUsers = [];
    
    for (const [email, userData] of Object.entries(users)) {
        try {
            // Check if user already exists
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                console.log(`User ${email} already exists, skipping...`);
                continue;
            }
            
            // Create new user (password will be hashed automatically)
            const newUser = new User({
                email: userData.email,
                name: userData.name,
                password: userData.password, // This will be re-hashed
                profile: userData.profile,
                stats: userData.stats,
                createdAt: userData.createdAt
            });
            
            await newUser.save();
            migratedUsers.push(newUser);
            console.log(`✅ Migrated user: ${email}`);
            
        } catch (error) {
            console.error(`❌ Failed to migrate user ${email}:`, error.message);
        }
    }
    
    console.log(`User migration complete. ${migratedUsers.length} users migrated.`);
    return migratedUsers;
};

// Migrate drinks from frontend database to MongoDB
const migrateDrinks = async (drinkDatabase) => {
    console.log('Starting drink migration...');
    
    const drinks = Object.entries(drinkDatabase);
    const migratedDrinks = [];
    
    for (const [key, drinkData] of drinks) {
        try {
            // Check if drink already exists
            const existingDrink = await Drink.findOne({ name: drinkData.name });
            if (existingDrink) {
                console.log(`Drink ${drinkData.name} already exists, skipping...`);
                continue;
            }
            
            // Create new drink
            const newDrink = new Drink({
                name: drinkData.name,
                type: drinkData.type,
                alcohol: drinkData.alcohol,
                abv: drinkData.abv,
                standardDrinks: drinkData.standardDrinks,
                ingredients: drinkData.ingredients || [],
                description: drinkData.description,
                nutrition: drinkData.nutrition,
                image: drinkData.image,
                tags: drinkData.tags || [],
                servingSizes: drinkData.servingSizes || {
                    schooner: { volume: 425, multiplier: 1.29 },
                    pint: { volume: 570, multiplier: 1.73 },
                    'can-bottle': { volume: 330, multiplier: 1.0 },
                    jug: { volume: 1140, multiplier: 3.45 }
                }
            });
            
            await newDrink.save();
            migratedDrinks.push(newDrink);
            console.log(`✅ Migrated drink: ${drinkData.name}`);
            
        } catch (error) {
            console.error(`❌ Failed to migrate drink ${drinkData.name}:`, error.message);
        }
    }
    
    console.log(`Drink migration complete. ${migratedDrinks.length} drinks migrated.`);
    return migratedDrinks;
};

// Export localStorage data from frontend
const exportLocalStorageData = () => {
    console.log(`
📋 To export your localStorage data, run this in your browser console:

// Copy and paste this into your browser console on bevyfinder.com
const exportData = () => {
    const data = {
        users: JSON.parse(localStorage.getItem('bevyfinder_users') || '{}'),
        favorites: JSON.parse(localStorage.getItem('bevyfinder_favorites') || '[]'),
        history: JSON.parse(localStorage.getItem('bevyfinder_history') || '[]')
    };
    
    console.log('=== LOCALSTORAGE DATA ===');
    console.log(JSON.stringify(data, null, 2));
    
    // Download as file
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bevyfinder-localStorage-backup.json';
    a.click();
    URL.revokeObjectURL(url);
};

exportData();
    `);
};

// Main migration function
const runMigration = async () => {
    try {
        await connectDB();
        
        console.log('🚀 Starting BevyFinder localStorage to MongoDB migration...\n');
        
        // Step 1: Export localStorage data
        exportLocalStorageData();
        
        console.log('\n📝 Please export your localStorage data first, then update the sampleLocalStorageData variable in this script with your actual data.\n');
        
        // Step 2: Migrate users (uncomment when you have real data)
        // const migratedUsers = await migrateUsers(sampleLocalStorageData);
        
        // Step 3: Migrate drinks (you'll need to import your drink database)
        // const migratedDrinks = await migrateDrinks(drinkDatabase);
        
        console.log('\n✅ Migration script ready!');
        console.log('📋 Next steps:');
        console.log('1. Export localStorage data from browser');
        console.log('2. Update sampleLocalStorageData with your real data');
        console.log('3. Import your drink database');
        console.log('4. Uncomment migration lines and run again');
        
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.connection.close();
        console.log('MongoDB connection closed');
        process.exit(0);
    }
};

// Run migration if this script is executed directly
if (require.main === module) {
    runMigration();
}

module.exports = {
    migrateUsers,
    migrateDrinks,
    exportLocalStorageData
}; 