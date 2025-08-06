# 🌐 BevyFinder Deployment Guide

Make your app accessible from anywhere in the world!

## 🚀 Quick Deploy Options

### **Option 1: Heroku (Recommended - Free)**

#### **Deploy Backend API:**

1. **Create Heroku Account:**
   - Go to [heroku.com](https://heroku.com)
   - Sign up for free account

2. **Install Heroku CLI:**
   ```bash
   # macOS
   brew install heroku/brew/heroku
   
   # Windows
   # Download from https://devcenter.heroku.com/articles/heroku-cli
   ```

3. **Deploy Backend:**
   ```bash
   cd server
   heroku login
   heroku create bevyfinder-api
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

4. **Set Environment Variables:**
   ```bash
   heroku config:set MONGODB_URI="your-mongodb-connection-string"
   heroku config:set JWT_SECRET="your-secret-key"
   heroku config:set JWT_EXPIRE="7d"
   heroku config:set NODE_ENV="production"
   ```

5. **Get Your API URL:**
   ```bash
   heroku info
   # Your API will be: https://bevyfinder-api.herokuapp.com
   ```

#### **Deploy Frontend:**

1. **Create Netlify Account:**
   - Go to [netlify.com](https://netlify.com)
   - Sign up for free account

2. **Deploy Frontend:**
   - Drag and drop your entire project folder to Netlify
   - Or connect your GitHub repository

3. **Update API URL:**
   - In `index.html`, change the production API URL to your Heroku URL
   - Example: `https://bevyfinder-api.herokuapp.com/api`

### **Option 2: Vercel (Alternative - Free)**

#### **Deploy Backend:**
```bash
npm install -g vercel
cd server
vercel
```

#### **Deploy Frontend:**
```bash
vercel
```

### **Option 3: Railway (Modern Alternative - Free)**

1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Deploy both frontend and backend automatically

## 🔧 Environment Setup

### **MongoDB Atlas (Free Cloud Database):**

1. **Create MongoDB Atlas Account:**
   - Go to [mongodb.com/atlas](https://mongodb.com/atlas)
   - Sign up for free account

2. **Create Cluster:**
   - Choose "Free" tier
   - Select your preferred region
   - Create cluster

3. **Get Connection String:**
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password

4. **Set Environment Variable:**
   ```bash
   # For Heroku
   heroku config:set MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/bevyfinder?retryWrites=true&w=majority"
   ```

## 🌍 Production URLs

After deployment, your app will be available at:

- **Frontend:** `https://your-app-name.netlify.app`
- **Backend API:** `https://bevyfinder-api.herokuapp.com`

## 🔐 Security Checklist

- [ ] Use HTTPS in production
- [ ] Set strong JWT_SECRET
- [ ] Configure CORS properly
- [ ] Use environment variables
- [ ] Enable rate limiting
- [ ] Set up proper error handling

## 📱 Testing Your Deployment

1. **Test from your phone** (not on WiFi):
   - Go to your production URL
   - Try logging in with your credentials
   - Should work from anywhere!

2. **Test from different devices:**
   - Computer at work
   - Friend's phone
   - Public WiFi

## 🛠️ Troubleshooting

### **Common Issues:**

1. **CORS Errors:**
   - Make sure your backend CORS settings include your frontend domain
   - Update `server/server.js` CORS configuration

2. **MongoDB Connection:**
   - Check your MongoDB Atlas IP whitelist
   - Verify connection string format

3. **Environment Variables:**
   - Ensure all required variables are set in production
   - Check for typos in variable names

### **Debug Commands:**
```bash
# Check Heroku logs
heroku logs --tail

# Check environment variables
heroku config

# Restart app
heroku restart
```

## 🎯 Next Steps

1. **Custom Domain:** Buy a domain and point it to your app
2. **SSL Certificate:** Ensure HTTPS is working
3. **Monitoring:** Set up error tracking and analytics
4. **Backup:** Set up automated database backups

## 📞 Support

If you need help with deployment:
1. Check the troubleshooting section above
2. Look at the deployment platform's documentation
3. Check the console logs for specific error messages

---

**Your app will be accessible from anywhere in the world once deployed!** 🌍 