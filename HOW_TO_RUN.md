# How to Run College Connect

Follow these simple steps to run the application on your Windows machine.

## Prerequisites

### 1. Install Node.js
- Download from: https://nodejs.org/
- Install version 16 or higher
- Verify installation:
  ```cmd
  node --version
  npm --version
  ```

### 2. Install MongoDB

**Option A: Local MongoDB (Recommended for beginners)**
- Download from: https://www.mongodb.com/try/download/community
- Install MongoDB Community Server
- MongoDB will start automatically after installation

**Option B: MongoDB Atlas (Cloud - Free)**
- Go to: https://www.mongodb.com/cloud/atlas
- Create free account
- Create a free cluster
- Get connection string (replace `<password>` with your password)

## Step-by-Step Setup

### Step 1: Install Backend Dependencies

Open Command Prompt or PowerShell in the project folder:

```cmd
cd backend
npm install
```

Wait for all packages to install (this may take 2-3 minutes).

### Step 2: Configure Backend Environment

Create a `.env` file in the `backend` folder:

```cmd
copy .env.example .env
```

Open `backend/.env` in a text editor and set:

```env
MONGO_URI=mongodb://localhost:27017/college-connect
JWT_SECRET=my_super_secret_key_12345678901234567890
PORT=5000
NODE_ENV=development
```

**Note**: If using MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string.

### Step 3: Install Frontend Dependencies

Open a NEW Command Prompt/PowerShell window:

```cmd
cd frontend
npm install
```

Wait for all packages to install (this may take 2-3 minutes).

### Step 4: Configure Frontend Environment

Create a `.env` file in the `frontend` folder:

```cmd
copy .env.example .env
```

Open `frontend/.env` in a text editor and set:

```env
REACT_APP_API_URL=http://localhost:5000
```

### Step 5: Start MongoDB (if using local)

If you installed MongoDB locally, it should already be running. If not:

```cmd
mongod
```

Keep this window open.

### Step 6: Start Backend Server

In the backend Command Prompt window:

```cmd
npm run dev
```

You should see:
```
Server running on port 5000
MongoDB Connected: localhost
```

Keep this window open.

### Step 7: Start Frontend

In the frontend Command Prompt window:

```cmd
npm start
```

Your browser will automatically open to: http://localhost:3000

## Using the Application

### 1. Create an Account
- Click "Create Account"
- Enter your name, email, and password (min 6 characters)
- Click "Create Account"

### 2. Create a Topic
- Click "Create Topic"
- Enter topic name (e.g., "Web Development")
- Enter description
- Click "Create Topic"

### 3. Ask a Question
- Click on a topic
- Click "Ask Question"
- Enter question title and description
- Click "Post Question"

### 4. Post an Answer
- Click on a question
- Click "Post Answer"
- Enter your answer
- Click "Post Answer"

### 5. Vote
- Click ▲ to upvote
- Click ▼ to downvote
- Click again to remove your vote

## Troubleshooting

### Backend won't start

**Error: "Cannot find module"**
```cmd
cd backend
npm install
```

**Error: "Port 5000 already in use"**
- Change PORT in `backend/.env` to 5001
- Update `frontend/.env` to `REACT_APP_API_URL=http://localhost:5001`

**Error: "Cannot connect to MongoDB"**
- Make sure MongoDB is running
- Check `MONGO_URI` in `backend/.env`
- For local MongoDB: `mongodb://localhost:27017/college-connect`

### Frontend won't start

**Error: "Cannot find module"**
```cmd
cd frontend
npm install
```

**Error: "Port 3000 already in use"**
- Close other applications using port 3000
- Or the app will ask to use port 3001 instead

**Error: "Network Error"**
- Make sure backend is running on port 5000
- Check `REACT_APP_API_URL` in `frontend/.env`

### Login/Register not working

**Error: "User already exists"**
- Use a different email address
- Or click "Sign In" to login with existing account

**Error: "Invalid credentials"**
- Check your email and password
- Passwords are case-sensitive

## Quick Commands Reference

### Backend
```cmd
cd backend
npm install          # Install dependencies (first time only)
npm run dev         # Start development server
npm start           # Start production server
```

### Frontend
```cmd
cd frontend
npm install          # Install dependencies (first time only)
npm start           # Start development server
```

### MongoDB (if local)
```cmd
mongod              # Start MongoDB server
```

## Stopping the Application

1. **Stop Frontend**: Press `Ctrl + C` in the frontend terminal
2. **Stop Backend**: Press `Ctrl + C` in the backend terminal
3. **Stop MongoDB**: Press `Ctrl + C` in the MongoDB terminal (if running manually)

## Default URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MongoDB**: mongodb://localhost:27017

## Next Time You Run

You only need to do the installation steps once. Next time:

1. Start MongoDB (if local)
2. Start backend: `cd backend && npm run dev`
3. Start frontend: `cd frontend && npm start`

## Need Help?

- Check if all three services are running (MongoDB, Backend, Frontend)
- Check the terminal windows for error messages
- Make sure `.env` files are configured correctly
- Try restarting all services

## Common Issues on Windows

### PowerShell Execution Policy Error

If you get an error about execution policy:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Node/NPM Not Recognized

Add Node.js to your PATH:
1. Search "Environment Variables" in Windows
2. Edit "Path" variable
3. Add Node.js installation path (usually `C:\Program Files\nodejs\`)

### MongoDB Not Starting

1. Check if MongoDB service is running:
   - Open Services (search "services" in Windows)
   - Look for "MongoDB Server"
   - Right-click and "Start"

2. Or install MongoDB as a service during installation

## Success Indicators

✅ Backend running: "Server running on port 5000" + "MongoDB Connected"
✅ Frontend running: Browser opens to http://localhost:3000
✅ MongoDB running: No errors in MongoDB terminal
✅ Can create account and login
✅ Can create topics, questions, and answers
✅ Can vote on content

---

**You're all set! Enjoy using College Connect! 🚀**
