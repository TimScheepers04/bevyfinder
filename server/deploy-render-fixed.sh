#!/bin/bash

echo "🚀 Preparing BevyFinder API for Render deployment..."

# Ensure we're in the server directory
cd server

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if the server file exists
if [ ! -f "server-render.js" ]; then
    echo "❌ Error: server-render.js not found!"
    exit 1
fi

# Test the server file syntax
echo "🔍 Testing server file syntax..."
node -c server-render.js
if [ $? -ne 0 ]; then
    echo "❌ Error: server-render.js has syntax errors!"
    exit 1
fi

echo "✅ Server file syntax is valid"

# Check package.json
echo "📋 Checking package.json..."
if ! grep -q '"start": "node server-render.js"' package.json; then
    echo "❌ Error: package.json start script is incorrect!"
    exit 1
fi

echo "✅ Package.json is configured correctly"

# Git operations
echo "📝 Committing changes..."
git add .
git commit -m "Fix Render deployment configuration" || echo "No changes to commit"

echo "🚀 Pushing to Render..."
git push origin main

echo "✅ Deployment preparation complete!"
echo "🌐 Check your Render dashboard for deployment status" 