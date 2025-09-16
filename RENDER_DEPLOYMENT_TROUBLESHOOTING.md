# 🔧 Render Deployment Troubleshooting Guide

## 🚨 Status 127 Error - "Command Not Found"

### **What This Means:**
- The deployment is failing because Render can't find the command to run
- Usually caused by incorrect start command or missing dependencies

### **✅ Fixes Applied:**

#### 1. **Updated Procfile**
```bash
# Old (incorrect)
web: node server.js

# New (correct)
web: node server-render.js
```

#### 2. **Added render.yaml Configuration**
```yaml
services:
  - type: web
    name: bevyfinder-api
    env: node
    buildCommand: npm install
    startCommand: npm start
```

#### 3. **Updated package.json Start Script**
```json
{
  "scripts": {
    "start": "node server-render.js"
  }
}
```

## 🔍 **How to Check Deployment Status:**

### 1. **Go to Render Dashboard**
- Visit: https://dashboard.render.com
- Click on your BevyFinder web service

### 2. **Check Events Tab**
- Look for deployment logs
- Find the specific error message

### 3. **Check Environment Tab**
- Verify all environment variables are set:
  - `MONGODB_URI`
  - `JWT_SECRET`
  - `JWT_EXPIRE`
  - `NODE_ENV`

## 🛠️ **Manual Deployment Steps:**

### If Auto-Deploy Fails:

1. **Go to your Render service**
2. **Click "Manual Deploy"**
3. **Select "Clear build cache & deploy"**
4. **Wait for deployment to complete**

## 📋 **Environment Variables Checklist:**

Make sure these are set in Render:

| Variable | Value | Required |
|----------|-------|----------|
| `MONGODB_URI` | `mongodb+srv://TimScheepers:Mapimpi11@bevyfinder.fxww13z.mongodb.net/bevyfinder?retryWrites=true&w=majority&appName=BevyFinder` | ✅ |
| `JWT_SECRET` | `201ce5ec42a13b34b99ee6acc9a681aea47ace77aab8ada1e3337f152e1b813b` | ✅ |
| `JWT_EXPIRE` | `7d` | ✅ |
| `NODE_ENV` | `production` | ✅ |

## 🧪 **Test Deployment:**

After deployment completes, test with:

```bash
node test-render-deployment.js
```

## 🆘 **If Still Failing:**

### Common Issues:

1. **Node.js Version**
   - Render supports Node.js 16+
   - Check `package.json` engines field

2. **Dependencies**
   - All dependencies must be in `dependencies` (not `devDependencies`)
   - Run `npm install --production` locally to test

3. **File Paths**
   - Make sure `server-render.js` exists in the root of your repository
   - Check file permissions

4. **Environment Variables**
   - Double-check spelling and values
   - Make sure no extra spaces or quotes

## 📞 **Next Steps:**

1. **Wait for current deployment** (should be automatic after git push)
2. **Check Render dashboard** for deployment status
3. **Test the API** once deployment succeeds
4. **Update frontend** with the new API URL

## 🔗 **Useful Links:**

- [Render Dashboard](https://dashboard.render.com)
- [Render Documentation](https://render.com/docs)
- [Node.js on Render](https://render.com/docs/deploy-node-express-app) 