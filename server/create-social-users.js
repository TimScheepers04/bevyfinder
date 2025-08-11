const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const createSocialUsers = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('Connected to MongoDB');

        // Create test users for social features
        const testUsers = [
            {
                name: 'Sarah Johnson',
                email: 'sarah@example.com',
                password: '123456',
                personalDetails: {
                    age: 25,
                    weight: 65,
                    gender: 'female'
                },
                profile: {
                    bio: 'Love trying new craft beers! 🍺',
                    location: 'Melbourne, VIC'
                },
                stats: {
                    totalDrinks: 45,
                    totalSessions: 12,
                    longestSession: 180,
                    searches: 23,
                    favorites: 8
                }
            },
            {
                name: 'Mike Chen',
                email: 'mike@example.com',
                password: '123456',
                personalDetails: {
                    age: 28,
                    weight: 75,
                    gender: 'male'
                },
                profile: {
                    bio: 'Whiskey enthusiast and cocktail lover 🥃',
                    location: 'Sydney, NSW'
                },
                stats: {
                    totalDrinks: 67,
                    totalSessions: 18,
                    longestSession: 240,
                    searches: 34,
                    favorites: 12
                }
            },
            {
                name: 'Emma Wilson',
                email: 'emma@example.com',
                password: '123456',
                personalDetails: {
                    age: 23,
                    weight: 58,
                    gender: 'female'
                },
                profile: {
                    bio: 'Wine lover and social butterfly 🍷',
                    location: 'Brisbane, QLD'
                },
                stats: {
                    totalDrinks: 32,
                    totalSessions: 9,
                    longestSession: 150,
                    searches: 19,
                    favorites: 6
                }
            },
            {
                name: 'Alex Thompson',
                email: 'alex@example.com',
                password: '123456',
                personalDetails: {
                    age: 30,
                    weight: 80,
                    gender: 'male'
                },
                profile: {
                    bio: 'Beer connoisseur and home brewer 🍻',
                    location: 'Perth, WA'
                },
                stats: {
                    totalDrinks: 89,
                    totalSessions: 25,
                    longestSession: 300,
                    searches: 45,
                    favorites: 15
                }
            },
            {
                name: 'Lisa Park',
                email: 'lisa@example.com',
                password: '123456',
                personalDetails: {
                    age: 26,
                    weight: 62,
                    gender: 'female'
                },
                profile: {
                    bio: 'Cocktail queen and party planner 🍸',
                    location: 'Adelaide, SA'
                },
                stats: {
                    totalDrinks: 56,
                    totalSessions: 15,
                    longestSession: 200,
                    searches: 28,
                    favorites: 10
                }
            }
        ];

        // Create or update users
        for (const userData of testUsers) {
            const existingUser = await User.findOne({ email: userData.email });
            
            if (existingUser) {
                console.log(`Updating existing user: ${userData.name}`);
                // Update stats and profile (preserve existing preferences)
                existingUser.stats = { ...existingUser.stats, ...userData.stats };
                existingUser.profile.bio = userData.profile.bio;
                existingUser.profile.location = userData.profile.location;
                existingUser.personalDetails = { ...existingUser.personalDetails, ...userData.personalDetails };
                await existingUser.save();
            } else {
                console.log(`Creating new user: ${userData.name}`);
                const newUser = new User(userData);
                await newUser.save();
            }
        }

        console.log('✅ Social test users created/updated successfully!');
        console.log('\n📧 Test user emails:');
        testUsers.forEach(user => {
            console.log(`   ${user.email} (password: 123456)`);
        });

        // Get all users to set up some friend relationships
        const allUsers = await User.find({});
        console.log(`\n👥 Total users in database: ${allUsers.length}`);

        // Set up some friend relationships
        if (allUsers.length >= 3) {
            const user1 = allUsers[0]; // Sarah
            const user2 = allUsers[1]; // Mike
            const user3 = allUsers[2]; // Emma

            // Sarah and Mike become friends
            await user1.sendFriendRequest(user2._id);
            await user2.acceptFriendRequest(user1._id);
            console.log(`✅ ${user1.name} and ${user2.name} are now friends`);

            // Emma sends friend request to Sarah
            await user3.sendFriendRequest(user1._id);
            console.log(`📨 ${user3.name} sent friend request to ${user1.name}`);

            // Alex sends friend request to Mike
            if (allUsers.length >= 4) {
                const user4 = allUsers[3]; // Alex
                await user4.sendFriendRequest(user2._id);
                console.log(`📨 ${user4.name} sent friend request to ${user2.name}`);
            }
        }

        console.log('\n🎉 Social features setup complete!');
        console.log('\n🔗 You can now test:');
        console.log('   • Friend requests and relationships');
        console.log('   • Social feed and posts');
        console.log('   • Leaderboards');
        console.log('   • User profiles and privacy');

    } catch (error) {
        console.error('Error creating social users:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
};

createSocialUsers();
