# BevyFinder - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Option 1: Windows Users (Recommended)
1. **Install Node.js** from https://nodejs.org/
2. **Double-click** `start-windows.bat`
3. **Open** `index.html` in your browser
4. **Done!** 🎉

### Option 2: Manual Setup
1. **Install Node.js** from https://nodejs.org/
2. **Open terminal/command prompt** in this folder
3. **Run these commands**:
   ```bash
   cd server
   npm install
   npm start
   ```
4. **Open** `index.html` in your browser

## 🔧 Configuration

### For Local Development
- The app will automatically use localhost API
- No additional configuration needed

### For Production
- Set environment variables in your hosting platform
- Update `ALLOWED_ORIGINS` with your domain
- Ensure `TEMP_AUTH_BYPASS` is set to `false`

## 🛠️ Troubleshooting

### "node is not recognized"
- Install Node.js from https://nodejs.org/
- Restart your terminal/command prompt

### "npm install failed"
- Check your internet connection
- Try running as administrator (Windows)
- Clear npm cache: `npm cache clean --force`

### "Server won't start"
- Check if port 3000 is available
- Ensure MongoDB connection string is valid
- Check server logs for specific errors

## 📱 Features

- **Drink Database**: Search thousands of beverages
- **Night Tracking**: Monitor your drinking sessions
- **Favorites**: Save your favorite drinks
- **Social Features**: Share nights with friends
- **Responsive Design**: Works on all devices

## 🔒 Security

- Authentication required for all features
- Rate limiting prevents abuse
- Input validation and sanitization
- Secure CORS configuration
- JWT-based authentication

## 📞 Support

If you need help:
1. Check the browser console for errors
2. Read the full `DEPLOYMENT_FIXES.md` guide
3. Ensure all prerequisites are installed
4. Verify your configuration settings

## 🎯 Next Steps

1. **Test the application** locally
2. **Deploy to production** using the deployment guide
3. **Customize** the styling and features
4. **Add your own drinks** to the database
5. **Monitor** performance and usage

---

**Happy coding! 🍺**
