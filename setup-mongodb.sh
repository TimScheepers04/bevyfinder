#!/bin/bash

echo "🚀 BevyFinder MongoDB Setup Script"
echo "=================================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Creating from template..."
    cp env.example .env
fi

echo "📋 Current .env configuration:"
echo "MONGODB_URI: $(grep MONGODB_URI .env | cut -d'=' -f2)"
echo ""

echo "🌐 MongoDB Atlas Setup Instructions:"
echo "===================================="
echo ""
echo "1. Go to: https://www.mongodb.com/atlas"
echo "2. Click 'Try Free' and create an account"
echo "3. Create a new cluster (M0 Sandbox - Free)"
echo "4. Set up database access:"
echo "   - Username: bevyfinder-admin"
echo "   - Password: (create a strong password)"
echo "   - Role: Atlas admin"
echo "5. Set up network access:"
echo "   - Allow access from anywhere (0.0.0.0/0)"
echo "6. Get your connection string"
echo ""

read -p "Do you want to set up MongoDB Atlas now? (y/n): " setup_atlas

if [ "$setup_atlas" = "y" ] || [ "$setup_atlas" = "Y" ]; then
    echo ""
    echo "🌐 Opening MongoDB Atlas in your browser..."
    open "https://www.mongodb.com/atlas"
    
    echo ""
    echo "📝 After setting up your cluster, you'll get a connection string like:"
    echo "mongodb+srv://bevyfinder-admin:yourpassword@cluster0.xxxxx.mongodb.net/bevyfinder?retryWrites=true&w=majority"
    echo ""
    
    read -p "Enter your MongoDB Atlas connection string: " connection_string
    
    if [ ! -z "$connection_string" ]; then
        # Update .env file
        sed -i '' "s|MONGODB_URI=.*|MONGODB_URI=$connection_string|" .env
        echo "✅ Updated .env file with your MongoDB connection string"
        
        # Test connection
        echo ""
        echo "🧪 Testing connection..."
        node test-connection.js
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "🎉 MongoDB setup complete! You can now start your server:"
            echo "npm run dev"
        else
            echo ""
            echo "❌ Connection failed. Please check your connection string and try again."
        fi
    else
        echo "❌ No connection string provided."
    fi
else
    echo ""
    echo "📝 To set up MongoDB Atlas later:"
    echo "1. Follow the instructions in setup-mongodb.md"
    echo "2. Update your .env file with the connection string"
    echo "3. Run: node test-connection.js"
    echo "4. Start server: npm run dev"
fi

echo ""
echo "🔧 Alternative: Use Local MongoDB"
echo "If you prefer to run MongoDB locally:"
echo "brew install mongodb-community"
echo "brew services start mongodb-community"
echo ""
echo "Then your .env file should use:"
echo "MONGODB_URI=mongodb://localhost:27017/bevyfinder" 