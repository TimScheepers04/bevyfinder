# BevyFinder Server

A Node.js/Express server with MongoDB database for the BevyFinder drink database application.

## 🚀 Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **MongoDB Database**: Scalable NoSQL database for user and drink data
- **Security**: Rate limiting, CORS, helmet, input validation
- **User Management**: Registration, login, profile updates
- **Drink Database**: Store and manage drink information
- **Analytics**: Track user behavior and drink popularity
- **API**: RESTful API endpoints for frontend integration

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd bevyfinder-server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/bevyfinder
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   ```

4. **Set up MongoDB**
   
   **Option A: Local MongoDB**
   ```bash
   # Install MongoDB locally
   brew install mongodb-community  # macOS
   sudo apt-get install mongodb    # Ubuntu
   
   # Start MongoDB
   brew services start mongodb-community  # macOS
   sudo systemctl start mongodb          # Ubuntu
   ```
   
   **Option B: MongoDB Atlas (Recommended for production)**
   - Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Get your connection string
   - Update `MONGODB_URI` in `.env`

5. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 🗄️ Database Setup

### MongoDB Collections

The server automatically creates these collections:

- **users**: User accounts and profiles
- **drinks**: Drink database and metadata
- **sessions**: User sessions (optional)

### Database Schema

#### User Schema
```javascript
{
  email: String (unique),
  name: String,
  password: String (hashed),
  profile: {
    avatar: String,
    bio: String,
    location: String,
    preferences: {
      favoriteDrinks: [String],
      dietaryRestrictions: [String],
      notifications: Boolean
    }
  },
  stats: {
    searches: Number,
    favorites: Number,
    lastActive: Date
  },
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Drink Schema
```javascript
{
  name: String (unique),
  type: String,
  alcohol: String,
  abv: String,
  standardDrinks: String,
  ingredients: [String],
  description: String,
  nutrition: {
    calories: Number,
    carbs: Number,
    protein: Number,
    fat: Number,
    sugar: Number,
    servingSize: String
  },
  image: String,
  tags: [String],
  servingSizes: Object,
  stats: {
    totalSearches: Number,
    totalFavorites: Number,
    averageRating: Number,
    totalRatings: Number
  },
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh JWT token

### Health Check
- `GET /health` - Server health status

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds of 12
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: Prevents brute force attacks
- **Input Validation**: Express-validator for all inputs
- **CORS Protection**: Configurable cross-origin requests
- **Helmet**: Security headers
- **Account Locking**: Temporary lock after failed login attempts

## 🚀 Deployment

### Option 1: Heroku

1. **Create Heroku app**
   ```bash
   heroku create bevyfinder-api
   ```

2. **Set environment variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your-mongodb-atlas-uri
   heroku config:set JWT_SECRET=your-production-jwt-secret
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

### Option 2: DigitalOcean App Platform

1. Connect your GitHub repository
2. Set environment variables in the dashboard
3. Deploy automatically

### Option 3: AWS EC2

1. **Launch EC2 instance**
2. **Install Node.js and MongoDB**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clone and deploy**
   ```bash
   git clone <your-repo>
   cd bevyfinder-server
   npm install
   npm start
   ```

## 📊 Monitoring

### Health Check
Monitor server health:
```bash
curl https://your-api.com/health
```

### Database Monitoring
- MongoDB Atlas provides built-in monitoring
- Set up alerts for connection issues
- Monitor query performance

### Logs
- Application logs are sent to console
- Use PM2 for process management in production
- Set up log aggregation (e.g., Loggly, Papertrail)

## 🔧 Development

### Scripts
```bash
npm run dev      # Start with nodemon
npm start        # Start production server
npm test         # Run tests
```

### Environment Variables
See `env.example` for all available options.

### Database Migrations
For schema changes, create migration scripts in `migrations/` folder.

## 🤝 Frontend Integration

### Update Frontend Auth
Replace localStorage with API calls:

```javascript
// Old localStorage approach
localStorage.setItem('bevyfinder_users', JSON.stringify(users));

// New API approach
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name, email, password })
});
```

### Authentication Flow
1. User registers/logs in via API
2. Server returns JWT token
3. Frontend stores token in localStorage
4. Include token in Authorization header for protected requests

## 📈 Scaling Considerations

- **Database Indexing**: Already configured for common queries
- **Caching**: Consider Redis for session storage
- **Load Balancing**: Use multiple server instances
- **CDN**: Serve static assets via CDN
- **Monitoring**: Set up APM tools (New Relic, DataDog)

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check if MongoDB is running
   - Verify connection string
   - Check network connectivity

2. **JWT Token Issues**
   - Ensure JWT_SECRET is set
   - Check token expiration
   - Verify token format

3. **CORS Errors**
   - Update ALLOWED_ORIGINS in .env
   - Check frontend origin

### Debug Mode
Set `NODE_ENV=development` for detailed error messages.

## 📝 License

MIT License - see LICENSE file for details.

## 👨‍💻 Author

Tim Scheepers - BevyFinder Creator 