# 🔧 Render Environment Variables Setup Guide

## 🚀 Step-by-Step Instructions

### 1. Go to Your Render Dashboard
- Visit: https://dashboard.render.com
- Sign in to your account

### 2. Find Your Web Service
- Click on your BevyFinder web service
- Go to the "Environment" tab

### 3. Add Environment Variables
Click "Add Environment Variable" for each of these:

#### Required Variables:

**MONGODB_URI**
```
mongodb+srv://TimScheepers:Mapimpi11@bevyfinder.fxww13z.mongodb.net/bevyfinder?retryWrites=true&w=majority&appName=BevyFinder
```

**JWT_SECRET**
```
201ce5ec42a13b34b99ee6acc9a681aea47ace77aab8ada1e3337f152e1b813b
```

**JWT_EXPIRE**
```
7d
```

**NODE_ENV**
```
production
```

### 4. Save and Redeploy
- Click "Save Changes"
- Render will automatically redeploy your service

### 5. Check Deployment Status
- Go to the "Events" tab to see deployment logs
- Wait for "Deploy successful" message

### 6. Test Your API
Once deployed, test your API at:
```
https://your-app-name.onrender.com/health
```

## 🔍 Troubleshooting

### If deployment fails:
1. Check the "Events" tab for error messages
2. Verify all environment variables are set correctly
3. Make sure there are no typos in the values

### Common Issues:
- **MongoDB Connection Error**: Check your MONGODB_URI
- **JWT Error**: Make sure JWT_SECRET is at least 32 characters
- **Port Error**: Render automatically sets PORT, don't override it

## 📱 Next Steps
After successful deployment:
1. Copy your Render URL (e.g., `https://bevyfinder-api.onrender.com`)
2. Update the frontend API URL in `index.html`
3. Deploy the frontend to Netlify

## 🆘 Need Help?
If you're still having issues:
1. Check the deployment logs in Render
2. Verify your MongoDB Atlas connection
3. Test the API endpoints manually 