# College Connect - Quick Start Guide

Get College Connect running in 10 minutes!

## Prerequisites Checklist

- [ ] Node.js installed (v16+)
- [ ] MongoDB running (local or Atlas)
- [ ] Google OAuth Client ID obtained
- [ ] Code editor ready

## Step 1: Get Google OAuth Client ID (5 minutes)

1. Go to [console.cloud.google.com](https://console.cloud.google.com/)
2. Create new project: "College Connect"
3. Enable "Google+ API"
4. Create OAuth 2.0 Client ID:
   - Type: Web application
   - Authorized origins: `http://localhost:3000`
   - Authorized redirects: `http://localhost:3000`
5. Copy the Client ID

## Step 2: Setup Backend (2 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create .env file (Windows)
copy .env.example .env

# Or on Mac/Linux
cp .env.example .env
```

Edit `backend/.env`:
```env
MONGO_URI=mongodb://localhost:27017/college-connect
JWT_SECRET=my_super_secret_key_change_this_in_production_12345
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
PORT=5000
```

Start backend:
```bash
npm run dev
```

You should see: `Server running on port 5000` and `MongoDB Connected`

## Step 3: Setup Frontend (2 minutes)

Open NEW terminal (keep backend running):

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create .env file (Windows)
copy .env.example .env

# Or on Mac/Linux
cp .env.example .env
```

Edit `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

Start frontend:
```bash
npm start
```

Browser opens to `http://localhost:3000`

## Step 4: Test the App (1 minute)

1. Click "Login"
2. Sign in with Google
3. Click "Create Topic"
4. Create a topic
5. Ask a question
6. Post an answer
7. Vote!

## Done! 🎉

Your College Connect app is now running!

## Quick Commands

### Backend
```bash
cd backend
npm run dev      # Development mode
npm start        # Production mode
```

### Frontend
```bash
cd frontend
npm start        # Development mode
npm run build    # Production build
```

## Troubleshooting

### Backend won't start
- Check MongoDB is running: `mongod` or check Atlas connection
- Verify .env file exists and has correct values
- Check port 5000 is available

### Frontend won't start
- Check .env file exists in frontend directory
- Verify GOOGLE_CLIENT_ID is correct
- Check port 3000 is available

### Google login fails
- Verify GOOGLE_CLIENT_ID matches in both .env files
- Check authorized origins in Google Console
- Clear browser cache

## Next Steps

- Read [README.md](README.md) for full documentation
- Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed setup
- See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API reference
- Review [TESTING.md](TESTING.md) for testing procedures
- Read [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment

## Need Help?

- Check [FAQ.md](FAQ.md) for common questions
- Review [PROJECT_OVERVIEW.md](PROJECT_OVERVIEW.md) for architecture details
- Open an issue on GitHub

## Project Structure

```
college-connect/
├── backend/              # Node.js + Express API
│   ├── config/          # Database config
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth & error handling
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   └── server.js        # Entry point
├── frontend/            # React application
│   ├── public/          # Static files
│   └── src/
│       ├── components/  # Reusable components
│       ├── context/     # Auth context
│       ├── pages/       # Page components
│       └── App.js       # Main app
└── Documentation files
```

## Key Features

✅ Google OAuth authentication
✅ Topic-based organization
✅ Question & Answer system
✅ Voting with duplicate prevention
✅ Real-time score updates
✅ Automatic content sorting
✅ Clean, responsive UI
✅ RESTful API
✅ Production-ready code

## Tech Stack

- **Frontend**: React, React Router, Axios
- **Backend**: Node.js, Express, MongoDB
- **Auth**: Google OAuth 2.0, JWT
- **Database**: MongoDB with Mongoose

## Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017/college-connect
JWT_SECRET=your_jwt_secret_here
GOOGLE_CLIENT_ID=your_google_client_id
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
```

## API Endpoints

- `POST /api/auth/google` - Login with Google
- `GET /api/auth/me` - Get current user
- `GET /api/topics` - Get all topics
- `POST /api/topics` - Create topic
- `GET /api/questions/topic/:id` - Get questions
- `POST /api/questions` - Create question
- `GET /api/answers/question/:id` - Get answers
- `POST /api/answers` - Create answer
- `POST /api/votes` - Vote on content

## Default Ports

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`
- MongoDB: `mongodb://localhost:27017`

## Common Issues

**"Cannot connect to MongoDB"**
→ Start MongoDB: `mongod` or check Atlas connection string

**"Port already in use"**
→ Change PORT in .env or kill process using the port

**"Google login not working"**
→ Check GOOGLE_CLIENT_ID in both .env files

**"Module not found"**
→ Run `npm install` in the directory

## Development Workflow

1. Start MongoDB
2. Start backend: `cd backend && npm run dev`
3. Start frontend: `cd frontend && npm start`
4. Make changes
5. Test in browser
6. Commit to Git

## Production Deployment

Quick deploy to free platforms:

1. **Backend** → Railway
2. **Frontend** → Vercel
3. **Database** → MongoDB Atlas

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## Support

- 📖 Documentation: All .md files in root
- 🐛 Bug reports: GitHub issues
- 💡 Feature requests: GitHub issues
- ❓ Questions: Check FAQ.md

## License

MIT - Free to use and modify

---

**Ready to build something amazing? Let's go! 🚀**
