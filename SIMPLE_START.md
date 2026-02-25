# Simple Start Guide - College Connect

The easiest way to run College Connect on Windows.

## First Time Setup (Do Once)

### 1. Install Node.js
- Download: https://nodejs.org/
- Install it (click Next, Next, Finish)
- Restart your computer

### 2. Install MongoDB
- Download: https://www.mongodb.com/try/download/community
- Install it (click Next, Next, Finish)
- MongoDB will start automatically

### 3. Run Setup Script
- Double-click `setup.bat` in the project folder
- Wait for it to finish (2-3 minutes)

### 4. Configure Environment
- Open `backend/.env` in Notepad
- Make sure it has:
  ```
  MONGO_URI=mongodb://localhost:27017/college-connect
  JWT_SECRET=my_super_secret_key_12345678901234567890
  PORT=5000
  NODE_ENV=development
  ```
- Save and close

## Running the App (Every Time)

### Simple Method (Recommended)

1. **Start Backend**
   - Double-click `start-backend.bat`
   - Wait for "Server running on port 5000"
   - Keep this window open

2. **Start Frontend**
   - Double-click `start-frontend.bat`
   - Browser will open automatically
   - Keep this window open

3. **Use the App**
   - Create an account
   - Start asking questions!

### Manual Method

If batch files don't work:

**Terminal 1 (Backend):**
```cmd
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```cmd
cd frontend
npm start
```

## Stopping the App

- Close both terminal windows
- Or press `Ctrl + C` in each window

## Troubleshooting

### "npm is not recognized"
- Node.js is not installed or not in PATH
- Reinstall Node.js and restart computer

### "Cannot connect to MongoDB"
- MongoDB is not running
- Open Services (search in Windows)
- Find "MongoDB Server" and click Start

### Backend window closes immediately
- Open Command Prompt manually
- Run: `cd backend && npm run dev`
- Check error message

### Port already in use
- Close other applications
- Or change port in `backend/.env`

## What You Should See

✅ **Backend Terminal:**
```
Server running on port 5000
MongoDB Connected: localhost
```

✅ **Frontend:**
- Browser opens to http://localhost:3000
- You see the login page

✅ **Working App:**
- Can create account
- Can login
- Can create topics
- Can ask questions
- Can post answers
- Can vote

## Quick Test

1. Create account with:
   - Name: Test User
   - Email: test@example.com
   - Password: test123

2. Create a topic:
   - Name: Test Topic
   - Description: This is a test

3. Ask a question in that topic

4. Post an answer to that question

5. Vote on the answer

If all of this works, you're good to go! 🎉

## Need More Help?

Read the detailed guide: `HOW_TO_RUN.md`

---

**That's it! You're ready to use College Connect!**
