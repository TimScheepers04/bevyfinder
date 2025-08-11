#!/bin/bash

echo "🚂 Deploying BevyFinder Backend to Railway"
echo "=========================================="

# Check if we're in the right directory
if [ ! -f "server-minimal.js" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

echo "📦 Preparing for Railway deployment..."

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "📥 Installing Railway CLI..."
    npm install -g @railway/cli
fi

echo ""
echo "🌐 Next steps:"
echo "1. Go to https://railway.app and sign up with GitHub"
echo "2. Click 'New Project' → 'Deploy from GitHub repo'"
echo "3. Select your repository: TimScheepers04/bevyfinder"
echo "4. Railway will automatically detect it's a Node.js app"
echo ""
echo "🔧 Environment Variables to add in Railway dashboard:"
echo "   MONGODB_URI: mongodb+srv://TimScheepers:Mapimpi11@bevyfinder.fxww13z.mongodb.net/bevyfinder?retryWrites=true&w=majority&appName=BevyFinder"
echo "   JWT_SECRET: 201ce5ec42a13b34b99ee6acc9a681aea47ace77aab8ada1e3337f152e1b813b"
echo "   JWT_EXPIRE: 7d"
echo "   NODE_ENV: production"
echo ""
echo "✅ Railway will automatically deploy using server-minimal.js"
echo "📱 Your API will be available at: https://your-app-name.railway.app"
echo ""
echo "🔗 After deployment, update your frontend to use the Railway API URL" 