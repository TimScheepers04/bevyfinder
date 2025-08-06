#!/bin/bash

echo "🚀 BevyFinder Deployment Script"
echo "================================"

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI not found. Please install it first:"
    echo "   brew install heroku/brew/heroku (macOS)"
    echo "   or download from https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

# Check if user is logged into Heroku
if ! heroku auth:whoami &> /dev/null; then
    echo "🔐 Please log into Heroku first:"
    heroku login
fi

echo "📦 Deploying Backend API..."

# Navigate to server directory
cd server

# Check if git repository exists
if [ ! -d ".git" ]; then
    echo "📝 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit"
fi

# Create Heroku app if it doesn't exist
if ! heroku apps:info bevyfinder-api &> /dev/null; then
    echo "🏗️ Creating Heroku app..."
    heroku create bevyfinder-api
else
    echo "✅ Heroku app already exists"
fi

# Deploy to Heroku
echo "🚀 Deploying to Heroku..."
git add .
git commit -m "Deploy update $(date)"
git push heroku main

# Get the app URL
APP_URL=$(heroku info -s | grep web_url | cut -d= -f2)
echo "✅ Backend deployed to: $APP_URL"

# Set environment variables if not already set
echo "🔧 Setting environment variables..."
heroku config:set NODE_ENV=production

# Check if MongoDB URI is set
if ! heroku config:get MONGODB_URI &> /dev/null; then
    echo "⚠️  MONGODB_URI not set. Please set it manually:"
    echo "   heroku config:set MONGODB_URI='your-mongodb-connection-string'"
fi

# Check if JWT_SECRET is set
if ! heroku config:get JWT_SECRET &> /dev/null; then
    echo "🔐 Generating JWT_SECRET..."
    JWT_SECRET=$(openssl rand -base64 32)
    heroku config:set JWT_SECRET="$JWT_SECRET"
fi

echo "✅ Backend deployment complete!"
echo ""
echo "🌐 Next steps:"
echo "1. Deploy frontend to Netlify/Vercel"
echo "2. Update frontend API URL to: $APP_URL"
echo "3. Test your app from anywhere!"
echo ""
echo "📱 Test your deployment:"
echo "   curl $APP_URL/health" 