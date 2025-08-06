#!/bin/bash

echo "🚀 Deploying BevyFinder API..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found!"
    exit 1
fi

if [ ! -f "server-minimal.js" ]; then
    echo "❌ Error: server-minimal.js not found!"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Test the server
echo "🧪 Testing server..."
node -c server-minimal.js
if [ $? -ne 0 ]; then
    echo "❌ Error: server-minimal.js has syntax errors!"
    exit 1
fi

echo "✅ Server syntax is valid"

# Test the start command
echo "🚀 Testing start command..."
timeout 5s node server-minimal.js &
SERVER_PID=$!
sleep 2

# Check if server is running
if ps -p $SERVER_PID > /dev/null; then
    echo "✅ Server started successfully"
    kill $SERVER_PID
else
    echo "❌ Error: Server failed to start"
    exit 1
fi

echo "✅ Deployment preparation complete!"
echo "🌐 Ready for deployment to Render/Railway" 