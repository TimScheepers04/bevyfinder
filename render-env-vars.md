# 🌐 Render Environment Variables

Copy these exact values to your Render deployment:

## **Required Environment Variables:**

### 1. MONGODB_URI
```
mongodb+srv://TimScheepers:Mapimpi11@bevyfinder.fxww13z.mongodb.net/bevyfinder?retryWrites=true&w=majority&appName=BevyFinder
```

### 2. JWT_SECRET
```
201ce5ec42a13b34b99ee6acc9a681aea47ace77aab8ada1e3337f152e1b813b
```

### 3. JWT_EXPIRE
```
7d
```

### 4. NODE_ENV
```
production
```

## **How to Add These in Render:**

1. **Go to your Render dashboard**
2. **Click on your web service** (bevyfinder-api)
3. **Go to "Environment" tab**
4. **Click "Add Environment Variable"**
5. **Add each variable one by one:**

   - **Key:** `MONGODB_URI`
   - **Value:** `mongodb+srv://TimScheepers:Mapimpi11@bevyfinder.fxww13z.mongodb.net/bevyfinder?retryWrites=true&w=majority&appName=BevyFinder`

   - **Key:** `JWT_SECRET`
   - **Value:** `201ce5ec42a13b34b99ee6acc9a681aea47ace77aab8ada1e3337f152e1b813b`

   - **Key:** `JWT_EXPIRE`
   - **Value:** `7d`

   - **Key:** `NODE_ENV`
   - **Value:** `production`

6. **Click "Save Changes"**
7. **Your service will automatically redeploy**

## **✅ After Adding Variables:**

Your API will be available at: `https://your-app-name.onrender.com`

Test it with: `curl https://your-app-name.onrender.com/health` 