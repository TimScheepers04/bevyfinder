# BevyFinder Deployment Guide

## 🚀 Automatic Cache-Busting System

Your BevyFinder website now includes automatic cache-busting to ensure users always see the latest version without manual cache clearing.

## 📋 How It Works

### **1. Version Parameters**
- CSS and JS files include version parameters: `?v=1.0.1`
- Service worker has version-specific cache names
- Automatic version checking on page load

### **2. Cache Control Headers**
- `no-cache, no-store, must-revalidate` meta tags
- Prevents browser caching of the main page
- Forces fresh content on each visit

### **3. Service Worker**
- Manages cache automatically
- Detects new versions
- Prompts users to update when available

## 🔄 Updating Your Website

### **Option 1: Automatic Version Update**
```bash
# Update to a specific version
node update-version.js 1.0.2

# Or just increment (will use 1.0.2)
node update-version.js
```

### **Option 2: Manual Version Update**
1. **Update version in `index.html`:**
   ```html
   <link rel="stylesheet" href="styles.css?v=1.0.2">
   <script src="script.js?v=1.0.2"></script>
   ```

2. **Update version in `sw.js`:**
   ```javascript
   const CACHE_NAME = 'bevyfinder-v1.0.2';
   ```

3. **Update version in `script.js`:**
   ```javascript
   const currentVersion = '1.0.2';
   ```

## 📱 User Experience

### **For Users:**
- ✅ **No manual cache clearing needed**
- ✅ **Automatic updates when available**
- ✅ **Prompt to update when new version detected**
- ✅ **Seamless experience across devices**

### **For You:**
- ✅ **Easy version management**
- ✅ **Automatic cache invalidation**
- ✅ **Reliable deployments**
- ✅ **No support requests about "old versions"**

## 🛠️ Deployment Steps

1. **Make your changes** to the website
2. **Update version** using the script or manually
3. **Deploy to your hosting service** (Netlify, Vercel, etc.)
4. **Users automatically get the new version**

## 🔧 Troubleshooting

### **If users still see old content:**
1. Check that version numbers are updated in all files
2. Verify service worker is registered (check browser dev tools)
3. Clear browser cache manually (shouldn't be needed but can help)

### **Service Worker Issues:**
- Check browser console for registration errors
- Ensure HTTPS is enabled (required for service workers)
- Test in incognito mode to bypass existing caches

## 📊 Version History

- **v1.0.1** - Initial cache-busting implementation
- **v1.0.2** - Enhanced mobile support and image recognition

## 🎯 Best Practices

1. **Always update version** when making changes
2. **Test in incognito mode** to verify fresh content
3. **Use semantic versioning** (major.minor.patch)
4. **Monitor service worker** in browser dev tools 