# Render Deployment Guide for BevyFinder

## 🚀 Quick Setup

### 1. Create Render Account
- Go to [render.com](https://render.com)
- Sign up with your GitHub account

### 2. Connect Repository
- Click "New +" → "Web Service"
- Connect your GitHub repository: `TimScheepers04/bevyfinder`
- Select the repository

### 3. Configure Service
- **Name**: `bevyfinder-api`
- **Runtime**: `Node`
- **Build Command**: `cd server && npm install`
- **Start Command**: `cd server && npm start`
- **Plan**: Free

### 4. Environment Variables
Add these environment variables in Render dashboard:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bevyfinder
JWT_SECRET=your-super-secret-jwt-key-here
VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
VAPID_EMAIL=your-email@example.com
```

### 5. Database Setup
- Create a MongoDB Atlas cluster (free)
- Get connection string
- Add to MONGODB_URI environment variable

### 6. Deploy
- Click "Create Web Service"
- Render will automatically deploy your app
- Get your app URL (e.g., `https://bevyfinder-api.onrender.com`)

## 🔧 Features Included

✅ **All API Routes**:
- `/api/auth/*` - Authentication
- `/api/reviews/*` - Drink reviews
- `/api/favorites/*` - User favorites
- `/api/likes/*` - Like system
- `/api/social/*` - Social features
- `/api/tracking/*` - Drink tracking
- `/api/notifications/*` - Push notifications

✅ **Push Notifications**:
- VAPID keys configured
- Web-push package included
- Friend notifications ready

✅ **Security**:
- CORS enabled
- Rate limiting
- Input sanitization
- JWT authentication

## 📱 Update Frontend

Once deployed, update your frontend API URL in `index.html`:

```javascript
// Change this line in index.html
API_BASE_URL = 'https://your-app-name.onrender.com/api';
```

## 🎯 Expected URLs

- **Frontend**: https://timscheepers04.github.io/bevyfinder/
- **Backend**: https://your-app-name.onrender.com/
- **Health Check**: https://your-app-name.onrender.com/health
- **VAPID Key**: https://your-app-name.onrender.com/api/notifications/vapid-public-key

## 🚨 Troubleshooting

### Common Issues:
1. **Build fails**: Check if all dependencies are in package.json
2. **MongoDB connection**: Verify MONGODB_URI is correct
3. **CORS errors**: Frontend URL might not be whitelisted

### Logs:
- Check Render dashboard → Service → Logs
- Look for any error messages during deployment

## 🎉 Success!

Once deployed, your push notifications will work perfectly!
