# Plenterra Backend Setup Instructions

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or MongoDB Atlas)

## Quick Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   copy .env.example .env
   ```
   
4. **Edit `.env` file with your settings:**
   - Set `JWT_SECRET` to a long random string
   - Update `WARD_LABS_BASE_URL` when you get the actual endpoint from Ward Labs
   - Set `MONGODB_URI` if using MongoDB (optional for now)
   - Set `FRONTEND_URL` to your frontend URL

5. **Start the development server:**
   ```bash
   npm run dev
   ```

The backend will start on http://localhost:3001

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Soil Data (Ward Labs Proxy)
- `GET /api/soil/reports/:farmerId` - Get soil reports
- `POST /api/soil/submit-sample` - Submit soil sample
- `GET /api/soil/recommendations/:fieldId` - Get recommendations
- `GET /api/soil/test-connection` - Test Ward Labs connection (dev only)

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/fields` - Get user fields
- `POST /api/users/fields` - Add new field

## Security Features
✅ API key hidden on server
✅ JWT authentication
✅ Rate limiting
✅ CORS protection
✅ Input validation
✅ Password hashing

## Production Deployment
- Set `NODE_ENV=production`
- Use proper MongoDB database
- Set strong JWT secret
- Configure HTTPS
- Set proper CORS origins
