#!/bin/bash

echo "🚀 BevyFinder Deployment to Render"
echo "==================================="

# Check if we're in the right directory
if [ ! -f "server.js" ]; then
    echo "❌ Please run this script from the server directory"
    exit 1
fi

echo "📦 Preparing for deployment..."

# Create a git repository if it doesn't exist
if [ ! -d ".git" ]; then
    echo "📝 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit for deployment"
fi

echo ""
echo "✅ Ready for deployment!"
echo ""
echo "🌐 Next steps:"
echo "1. Go to https://render.com and sign up for free"
echo "2. Click 'New +' and select 'Web Service'"
echo "3. Connect your GitHub repository (or use 'Deploy from existing repository')"
echo "4. Set the following environment variables:"
echo "   - MONGODB_URI: your-mongodb-connection-string"
echo "   - JWT_SECRET: (will be auto-generated)"
echo "   - JWT_EXPIRE: 7d"
echo "   - NODE_ENV: production"
echo "5. Click 'Create Web Service'"
echo ""
echo "📱 Your API will be available at: https://your-app-name.onrender.com"
echo ""
echo "🔗 After deployment, update the frontend API URL in index.html to your Render URL" 