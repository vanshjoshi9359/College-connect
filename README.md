# College Connect

A production-ready, growth-focused knowledge platform where users ask high-quality questions and share high-quality answers. Built with React, Node.js, Express, MongoDB, and Google OAuth.

## Features

- **Topic-Based Organization**: Questions organized by topics (skills/domains)
- **Google Authentication**: Secure OAuth 2.0 login
- **Voting System**: Upvote/downvote questions and answers
- **Smart Sorting**: Content ranked by score (upvotes - downvotes), then by date
- **Clean Architecture**: MVC pattern, RESTful APIs, proper separation of concerns
- **Real-time Updates**: Vote changes reflect immediately
- **Duplicate Vote Prevention**: One vote per user per item

## Tech Stack

### Backend
- Node.js & Express
- MongoDB with Mongoose
- Google OAuth 2.0 (google-auth-library)
- JWT Authentication
- Express Validator

### Frontend
- React 18
- React Router v6
- Axios
- Google Identity Services (@react-oauth/google)
- Context API for state management

## Project Structure

```
college-connect/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── topicController.js
│   │   ├── questionController.js
│   │   ├── answerController.js
│   │   └── voteController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Topic.js
│   │   ├── Question.js
│   │   ├── Answer.js
│   │   └── Vote.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── topicRoutes.js
│   │   ├── questionRoutes.js
│   │   ├── answerRoutes.js
│   │   └── voteRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.js
    │   │   ├── VoteButtons.js
    │   │   └── PrivateRoute.js
    │   ├── context/
    │   │   └── AuthContext.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── TopicList.js
    │   │   ├── TopicDetail.js
    │   │   ├── QuestionDetail.js
    │   │   ├── CreateTopic.js
    │   │   ├── CreateQuestion.js
    │   │   └── CreateAnswer.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── .env.example
    └── package.json
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Google Cloud Console account

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen
6. Create OAuth 2.0 Client ID:
   - Application type: Web application
   - Authorized JavaScript origins: `http://localhost:3000`
   - Authorized redirect URIs: `http://localhost:3000`
7. Copy the Client ID

### 2. MongoDB Setup

**Option A: Local MongoDB**
- Install MongoDB locally
- Start MongoDB service
- Use connection string: `mongodb://localhost:27017/college-connect`

**Option B: MongoDB Atlas**
- Create free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Get connection string
- Replace `<password>` with your database password

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env file with your values:
# MONGO_URI=mongodb://localhost:27017/college-connect
# JWT_SECRET=your_random_secret_key_here
# GOOGLE_CLIENT_ID=your_google_client_id_here
# PORT=5000

# Start backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### 4. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd frontend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env file:
# REACT_APP_API_URL=http://localhost:5000
# REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id_here

# Start frontend
npm start
```

Frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/google` - Authenticate with Google
- `GET /api/auth/me` - Get current user (protected)

### Topics
- `GET /api/topics` - Get all topics
- `GET /api/topics/:id` - Get single topic
- `POST /api/topics` - Create topic (protected)

### Questions
- `GET /api/questions/topic/:topicId` - Get questions by topic
- `GET /api/questions/:id` - Get single question
- `POST /api/questions` - Create question (protected)

### Answers
- `GET /api/answers/question/:questionId` - Get answers by question
- `POST /api/answers` - Create answer (protected)

### Votes
- `POST /api/votes` - Vote on question/answer (protected)
  - Body: `{ targetId, targetType, voteType }`
  - `targetType`: "Question" or "Answer"
  - `voteType`: 1 (upvote) or -1 (downvote)

## Usage Flow

1. **Login**: Click "Login" and sign in with Google
2. **Browse Topics**: View all available topics on homepage
3. **Create Topic**: Click "Create Topic" to add new topic
4. **View Topic**: Click on a topic to see its questions
5. **Ask Question**: Click "Ask Question" within a topic
6. **View Question**: Click on a question to see answers
7. **Post Answer**: Click "Post Answer" on question page
8. **Vote**: Use ▲/▼ buttons to vote (click again to remove vote)

## Key Features Explained

### Voting System
- Each user can vote once per item (question or answer)
- Clicking same vote button removes the vote (toggle)
- Clicking opposite vote button changes the vote
- Score = upvotes - downvotes
- Content automatically re-sorts after voting

### Authentication Flow
1. User clicks Google Sign-In button
2. Google returns credential token
3. Frontend sends token to backend
4. Backend verifies token with Google
5. Backend creates/finds user in database
6. Backend issues JWT token
7. Frontend stores JWT and uses for protected routes

### Protected Routes
- Create Topic
- Ask Question
- Post Answer
- Vote

## Environment Variables

### Backend (.env)
```
MONGO_URI=mongodb://localhost:27017/college-connect
JWT_SECRET=your_jwt_secret_minimum_32_characters
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
PORT=5000
NODE_ENV=development
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

## Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use strong JWT_SECRET
3. Configure CORS for your frontend domain
4. Use MongoDB Atlas for database
5. Deploy to Heroku, Railway, or AWS

### Frontend
1. Update `REACT_APP_API_URL` to production backend URL
2. Build: `npm run build`
3. Deploy build folder to Netlify, Vercel, or AWS S3

## Security Features

- Google OAuth 2.0 for authentication
- JWT tokens with expiration
- Protected API routes with middleware
- Input validation on all endpoints
- Duplicate vote prevention at database level
- CORS configuration
- Environment variables for secrets

## Database Models

### User
- name, email, googleId, avatar, role, timestamps

### Topic
- name (unique), description, createdBy, timestamps

### Question
- topicId, title, description, authorId, upvotes, downvotes, timestamps

### Answer
- questionId, content, authorId, upvotes, downvotes, timestamps

### Vote
- userId, targetId, targetType, voteType, timestamps
- Unique index on (userId, targetId)

## Troubleshooting

### Backend won't start
- Check MongoDB is running
- Verify .env file exists and has correct values
- Check port 5000 is not in use

### Frontend won't start
- Check .env file exists in frontend directory
- Verify GOOGLE_CLIENT_ID is correct
- Check port 3000 is not in use

### Google login fails
- Verify GOOGLE_CLIENT_ID matches in both frontend and backend
- Check authorized origins in Google Console
- Clear browser cache and cookies

### Votes not working
- Ensure user is logged in
- Check JWT token is being sent in Authorization header
- Verify backend is receiving the token

## License

MIT

## Author

Built as a production-ready full-stack application demonstrating modern web development practices.
