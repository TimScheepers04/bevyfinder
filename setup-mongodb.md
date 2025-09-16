# MongoDB Atlas Setup Guide

## 🚀 Quick Setup Steps

### 1. Create MongoDB Atlas Account
- Go to: https://www.mongodb.com/atlas
- Click "Try Free" or "Get Started Free"
- Sign up with your email address
- Choose "Free" tier (M0 - Shared Clusters)

### 2. Create Your Cluster
- **Cloud Provider**: Choose AWS, Google Cloud, or Azure
- **Region**: Select "US East (N. Virginia)" for best performance
- **Cluster Tier**: Choose "M0 Sandbox" (Free)
- Click "Create"
- Wait 2-3 minutes for cluster to be ready

### 3. Set Up Database Access
- In the left sidebar, click "Database Access"
- Click "Add New Database User"
- **Username**: `bevyfinder-admin`
- **Password**: Create a strong password (save this!)
- **Role**: "Atlas admin"
- Click "Add User"

### 4. Set Up Network Access
- In the left sidebar, click "Network Access"
- Click "Add IP Address"
- Click "Allow Access from Anywhere" (0.0.0.0/0)
- Click "Confirm"

### 5. Get Connection String
- Click "Connect" on your cluster
- Choose "Connect your application"
- Select "Node.js" as driver
- Copy the connection string

### 6. Update Your .env File
Replace the MONGODB_URI line in your `.env` file with your connection string:

```env
MONGODB_URI=mongodb+srv://bevyfinder-admin:yourpassword@cluster0.xxxxx.mongodb.net/bevyfinder?retryWrites=true&w=majority
```

**Important**: Replace `yourpassword` with the actual password you created in step 3.

### 7. Test Connection
Run this command to test your MongoDB connection:
```bash
npm run dev
```

You should see: "MongoDB Connected: cluster0.xxxxx.mongodb.net"

## 🔧 Alternative: Local MongoDB Setup

If you prefer to run MongoDB locally:

```bash
# Install MongoDB locally
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Check if it's running
brew services list | grep mongodb
```

Then use this connection string in your `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/bevyfinder
```

## 🎯 Next Steps

1. Complete the MongoDB Atlas setup above
2. Update your `.env` file with the connection string
3. Start the server: `npm run dev`
4. Test the API: `curl http://localhost:3000/health`

## 🆘 Need Help?

If you get stuck:
1. Make sure your cluster is fully created (green checkmark)
2. Verify your database user password is correct
3. Check that network access allows all IPs (0.0.0.0/0)
4. Ensure your connection string includes the database name "bevyfinder" 