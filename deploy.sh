#!/bin/bash

# BevyFinder Deployment Script
# This script updates version numbers and prepares for deployment

echo "🚀 BevyFinder Deployment Script"
echo "================================"

# Get current timestamp for version
TIMESTAMP=$(date +"%Y%m%d%H%M")
VERSION="1.0.2"

echo "📝 Updating version to: $VERSION"

# Update version in files
sed -i '' "s/v=1\.0\.[0-9]*/v=$VERSION/g" index.html
sed -i '' "s/CACHE_NAME = 'bevyfinder-v1\.0\.[0-9]*'/CACHE_NAME = 'bevyfinder-v$VERSION'/g" sw.js
sed -i '' "s/const currentVersion = '1\.0\.[0-9]*'/const currentVersion = '$VERSION'/g" script.js

echo "✅ Version updated in all files"

# Create a deployment marker
echo "Deployed at: $(date)" > deploy-marker.txt
echo "Version: $VERSION" >> deploy-marker.txt

echo "📦 Files ready for deployment:"
echo "   - index.html (v$VERSION)"
echo "   - styles.css (v$VERSION)"
echo "   - script.js (v$VERSION)"
echo "   - sw.js (v$VERSION)"

echo ""
echo "🎯 Next steps:"
echo "   1. Upload all files to your hosting service"
echo "   2. Users will automatically get the new version"
echo "   3. No hard refresh required!"

echo ""
echo "✨ Deployment complete!" 