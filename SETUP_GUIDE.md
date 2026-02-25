# College Connect - Complete Setup Guide

This guide will walk you through setting up College Connect from scratch.

## Step 1: Install Prerequisites

### Node.js
- Download from [nodejs.org](https://nodejs.org/)
- Install version 16 or higher
- Verify: `node --version`

### MongoDB

**Option A: Local Installation**
- Download from [mongodb.com](https://www.mongodb.com/try/download/community)
- Install and start MongoDB service
- Default connection: `mongodb://localhost:27017`

**Option B: MongoDB Atlas (Recommended)**
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free account
3. Create new cluster (free tier)
4. Click "Connect" → "Connect your application"
5. Copy connection string
6. Replace `<password>` with your database password

## Step 2: Get Google OAuth Credentials

1. Go to [console.cloud.google.com](https://console.cloud.google.com/)
2. Create new project: "College Connect"
3. Enable APIs:
   - Click "Enable APIs and Services"
   - Search for "Google+ API"
   - Click "Enable"
4. Create OAuth Consent Screen:
   - Go to "OAuth consent screen"
   - Choose "External"
   - Fill in app name: "College Connect"
   - Add your email
   - Save and continue
5. Create Credentials:
   - Go to "Credentials"
   - Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: "Web application"
   - Name: "College Connect Web Client"
   - Authorized JavaScript origins:
     - `http://localhost:3000`
   - Authorized redirect URIs:
     - `http://localhost:3000`
   - Click "Create"
6. Copy the Client ID (looks like: `xxxxx.apps.googleusercontent.com`)

## Step 3: Clone/Download Project

If you have the project files, navigate to the project directory.

## Step 4: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
# On Windows:
copy .env.example .env

# On Mac/Linux:
cp .env.example .env
```

### Edit backend/.env file:

```env
MONGO_URI=mongodb://localhost:27017/college-connect
# OR for MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/college-connect

JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long

GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

PORT=5000
NODE_ENV=development
```

**Important:**
- Replace `JWT_SECRET` with a random string (at least 32 characters)
- Replace `GOOGLE_CLIENT_ID` with your actual Google Client ID
- If using MongoDB Atlas, replace `MONGO_URI` with your connection string

### Start Backend

```bash
# Development mode (auto-restart on changes)
npm run dev

# OR production mode
npm start
```

You should see:
```
Server running on port 5000
MongoDB Connected: ...
```

## Step 5: Frontend Setup

Open a NEW terminal window (keep backend running).

```bash
# Navigate to frontend directory from project root
cd frontend

# Install dependencies
npm install

# Create .env file
# On Windows:
copy .env.example .env

# On Mac/Linux:
cp .env.example .env
```

### Edit frontend/.env file:

```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

**Important:**
- Replace `REACT_APP_GOOGLE_CLIENT_ID` with the SAME Google Client ID from backend

### Start Frontend

```bash
npm start
```

Browser should automatically open to `http://localhost:3000`

## Step 6: Test the Application

1. **Login**
   - Click "Login" button
   - Click "Sign in with Google"
   - Choose your Google account
   - You should be redirected to homepage

2. **Create Topic**
   - Click "Create Topic"
   - Enter name: "Web Development"
   - Enter description: "Learn web development skills"
   - Click "Create Topic"

3. **Ask Question**
   - Click on your new topic
   - Click "Ask Question"
   - Enter title: "What is React?"
   - Enter description: "I want to learn React. Where should I start?"
   - Click "Post Question"

4. **Post Answer**
   - Click on your question
   - Click "Post Answer"
   - Enter answer: "React is a JavaScript library for building user interfaces..."
   - Click "Post Answer"

5. **Vote**
   - Click ▲ to upvote
   - Click ▼ to downvote
   - Click again to remove vote

## Troubleshooting

### Backend Issues

**Error: "Cannot connect to MongoDB"**
- Check MongoDB is running (local) or connection string is correct (Atlas)
- Verify network access in MongoDB Atlas (allow your IP)
- Check username/password in connection string

**Error: "Port 5000 already in use"**
- Change PORT in backend/.env to 5001
- Update REACT_APP_API_URL in frontend/.env to http://localhost:5001

**Error: "JWT_SECRET is not defined"**
- Make sure .env file exists in backend directory
- Check .env file has JWT_SECRET=... line
- Restart backend server

### Frontend Issues

**Error: "Google login not working"**
- Verify GOOGLE_CLIENT_ID is correct in both backend and frontend .env files
- Check authorized origins in Google Console include http://localhost:3000
- Clear browser cache and cookies
- Try incognito/private browsing mode

**Error: "Network Error" or "Cannot connect to backend"**
- Check backend is running on port 5000
- Verify REACT_APP_API_URL in frontend/.env is correct
- Check for CORS errors in browser console

**Error: "Module not found"**
- Delete node_modules folder
- Run `npm install` again

### Google OAuth Issues

**Error: "redirect_uri_mismatch"**
- Go to Google Cloud Console → Credentials
- Edit your OAuth 2.0 Client ID
- Add `http://localhost:3000` to Authorized JavaScript origins
- Add `http://localhost:3000` to Authorized redirect URIs
- Save and wait a few minutes

**Error: "Access blocked: This app's request is invalid"**
- Complete OAuth consent screen configuration
- Add test users if app is in testing mode
- Make sure Google+ API is enabled

## Quick Commands Reference

### Backend
```bash
cd backend
npm install          # Install dependencies
npm run dev         # Start development server
npm start           # Start production server
```

### Frontend
```bash
cd frontend
npm install          # Install dependencies
npm start           # Start development server
npm run build       # Build for production
```

### Both (from root)
```bash
npm run install-all  # Install all dependencies
```

## Environment Variables Summary

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| MONGO_URI | MongoDB connection string | mongodb://localhost:27017/college-connect |
| JWT_SECRET | Secret key for JWT tokens | my_super_secret_key_12345678 |
| GOOGLE_CLIENT_ID | Google OAuth Client ID | 123456.apps.googleusercontent.com |
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |

### Frontend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| REACT_APP_API_URL | Backend API URL | http://localhost:5000 |
| REACT_APP_GOOGLE_CLIENT_ID | Google OAuth Client ID | 123456.apps.googleusercontent.com |

## Next Steps

- Customize the UI styling
- Add more features (comments, tags, search)
- Deploy to production
- Add email notifications
- Implement user profiles

## Support

If you encounter issues:
1. Check this guide's troubleshooting section
2. Verify all environment variables are set correctly
3. Check browser console for errors
4. Check backend terminal for errors
5. Ensure all dependencies are installed

## Production Deployment

See README.md for production deployment instructions.
