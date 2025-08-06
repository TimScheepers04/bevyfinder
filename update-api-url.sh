#!/bin/bash

echo "🔧 BevyFinder API URL Updater"
echo "=============================="

if [ $# -eq 0 ]; then
    echo "❌ Please provide your API URL"
    echo ""
    echo "Usage: ./update-api-url.sh https://your-app-name.onrender.com"
    echo ""
    echo "Example:"
    echo "  ./update-api-url.sh https://bevyfinder-api.onrender.com"
    exit 1
fi

API_URL=$1

echo "📝 Updating API URL to: $API_URL"
echo ""

# Update the production API URL in index.html
sed -i '' "s|https://bevyfinder-api.herokuapp.com/api|$API_URL/api|g" index.html

echo "✅ API URL updated successfully!"
echo ""
echo "🌐 Your app will now use: $API_URL/api"
echo ""
echo "📱 Next steps:"
echo "1. Deploy your updated frontend to Netlify/Vercel"
echo "2. Test login from any device"
echo "3. Your app is now globally accessible!" 