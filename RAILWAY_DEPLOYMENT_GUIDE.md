# 🚂 Railway Deployment Guide - BevyFinder

## ✅ **Why Railway is Better Than Render**

- ✅ **No Status 127 errors** (unlike Render)
- ✅ **Perfect for Node.js** apps
- ✅ **Automatic HTTPS**
- ✅ **Global CDN**
- ✅ **Free tier available**
- ✅ **Much more reliable**

## 🚀 **Step-by-Step Railway Deployment**

### **Step 1: Create Railway Account**
1. **Go to:** https://railway.app
2. **Click "Start a Project"**
3. **Sign up with GitHub** (recommended)

### **Step 2: Deploy from GitHub**
1. **Click "Deploy from GitHub repo"**
2. **Select your repository:** `TimScheepers04/bevyfinder`
3. **Railway will automatically detect** it's a Node.js app

### **Step 3: Set Environment Variables**
In Railway dashboard, add these variables:

**MONGODB_URI:**
```
mongodb+srv://TimScheepers:Mapimpi11@bevyfinder.fxww13z.mongodb.net/bevyfinder?retryWrites=true&w=majority&appName=BevyFinder
```

**JWT_SECRET:**
```
201ce5ec42a13b34b99ee6acc9a681aea47ace77aab8ada1e3337f152e1b813b
```

**JWT_EXPIRE:**
```
7d
```

**NODE_ENV:**
```
production
```

### **Step 4: Deploy**
1. **Railway will automatically deploy**
2. **Check the deployment logs**
3. **Get your API URL** (something like `https://bevyfinder-api.railway.app`)

### **Step 5: Test Your API**
```bash
# Test health endpoint
curl https://your-railway-url.railway.app/health

# Test API endpoint
curl https://your-railway-url.railway.app/api/test
```

## 🎯 **What's Configured**

- ✅ **Full API server** with MongoDB connection
- ✅ **Authentication routes** (/api/auth)
- ✅ **Reviews routes** (/api/reviews)
- ✅ **Favorites routes** (/api/favorites)
- ✅ **Likes routes** (/api/likes)
- ✅ **CORS enabled** for frontend
- ✅ **Error handling** and logging
- ✅ **Health checks** for reliability

## 🔧 **Railway Configuration**

The `railway.json` file automatically configures:
- **Start command:** `node server-minimal.js`
- **Health check:** `/health` endpoint
- **Restart policy:** Automatic restart on failure
- **Build system:** Nixpacks (automatic)

## 🎉 **Success!**

Once deployed, your complete app will work globally:
- **Frontend:** https://bevyfinder.com (Netlify)
- **Backend API:** https://your-railway-url.railway.app (Railway)
- **Users can access from anywhere in the world!**

## 🆚 **Railway vs Render**

| Feature | Railway | Render |
|---------|---------|--------|
| Node.js Support | ✅ Excellent | ❌ Having issues |
| Status 127 Errors | ✅ None | ❌ Persistent |
| Free Tier | ✅ Yes | ✅ Yes |
| Auto-deploy | ✅ Yes | ✅ Yes |
| Environment Variables | ✅ Easy | ✅ Easy |
| Logs | ✅ Clear | ✅ Clear |
| Reliability | ✅ High | ❌ Low |

**Railway is the better choice for your Node.js app!** 