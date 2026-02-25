# College Connect - System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    React Frontend                           │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │ │
│  │  │  Pages   │  │Components│  │ Context  │  │  Styles  │  │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│                              │ HTTP/HTTPS                         │
│                              ▼                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │              Google Identity Services                       │ │
│  │                  (OAuth 2.0)                                │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                               │
                               │ REST API
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Express Backend                             │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                      Middleware Layer                       │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │ │
│  │  │   CORS   │  │   Auth   │  │  Error   │  │Validation│  │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                      Routes Layer                           │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │ │
│  │  │   Auth   │  │  Topics  │  │Questions │  │  Votes   │  │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                   Controllers Layer                         │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │ │
│  │  │   Auth   │  │  Topics  │  │Questions │  │  Votes   │  │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                     Models Layer                            │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │ │
│  │  │   User   │  │  Topic   │  │ Question │  │   Vote   │  │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                               │
                               │ Mongoose ODM
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                        MongoDB Database                          │
│                                                                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │  users   │  │  topics  │  │questions │  │  votes   │       │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘       │
│                                                                   │
│  ┌──────────┐                                                    │
│  │ answers  │                                                    │
│  └──────────┘                                                    │
└─────────────────────────────────────────────────────────────────┘
                               │
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Google OAuth Services                          │
│                  (Token Verification)                            │
└─────────────────────────────────────────────────────────────────┘
```

## Authentication Flow

```
┌──────────┐                                    ┌──────────────┐
│  User    │                                    │   Google     │
│ Browser  │                                    │   OAuth      │
└────┬─────┘                                    └──────┬───────┘
     │                                                  │
     │ 1. Click "Sign in with Google"                 │
     ├─────────────────────────────────────────────────▶
     │                                                  │
     │ 2. Google Login Page                            │
     ◀─────────────────────────────────────────────────┤
     │                                                  │
     │ 3. User enters credentials                      │
     ├─────────────────────────────────────────────────▶
     │                                                  │
     │ 4. Google ID Token                              │
     ◀─────────────────────────────────────────────────┤
     │                                                  │
     │                    ┌──────────────┐             │
     │                    │   Backend    │             │
     │                    │   Server     │             │
     │                    └──────┬───────┘             │
     │                           │                     │
     │ 5. Send token to backend  │                     │
     ├───────────────────────────▶                     │
     │                           │                     │
     │                           │ 6. Verify token     │
     │                           ├─────────────────────▶
     │                           │                     │
     │                           │ 7. Token valid      │
     │                           ◀─────────────────────┤
     │                           │                     │
     │                           │ 8. Create/find user │
     │                           │    in database      │
     │                           │                     │
     │                           │ 9. Generate JWT     │
     │                           │                     │
     │ 10. Return JWT + user     │                     │
     ◀───────────────────────────┤                     │
     │                           │                     │
     │ 11. Store JWT in          │                     │
     │     localStorage          │                     │
     │                           │                     │
```

## Data Flow - Creating a Question

```
┌──────────┐         ┌──────────┐         ┌──────────┐         ┌──────────┐
│  User    │         │ Frontend │         │ Backend  │         │ Database │
└────┬─────┘         └────┬─────┘         └────┬─────┘         └────┬─────┘
     │                    │                     │                     │
     │ 1. Fill form       │                     │                     │
     ├───────────────────▶│                     │                     │
     │                    │                     │                     │
     │ 2. Click submit    │                     │                     │
     ├───────────────────▶│                     │                     │
     │                    │                     │                     │
     │                    │ 3. Validate input   │                     │
     │                    │                     │                     │
     │                    │ 4. POST /api/questions                    │
     │                    │    with JWT token   │                     │
     │                    ├────────────────────▶│                     │
     │                    │                     │                     │
     │                    │                     │ 5. Verify JWT       │
     │                    │                     │                     │
     │                    │                     │ 6. Validate data    │
     │                    │                     │                     │
     │                    │                     │ 7. Check topic exists
     │                    │                     ├────────────────────▶│
     │                    │                     │                     │
     │                    │                     │ 8. Topic found      │
     │                    │                     ◀────────────────────┤
     │                    │                     │                     │
     │                    │                     │ 9. Create question  │
     │                    │                     ├────────────────────▶│
     │                    │                     │                     │
     │                    │                     │ 10. Question saved  │
     │                    │                     ◀────────────────────┤
     │                    │                     │                     │
     │                    │ 11. Return question │                     │
     │                    ◀────────────────────┤                     │
     │                    │                     │                     │
     │ 12. Navigate to    │                     │                     │
     │     question page  │                     │                     │
     ◀───────────────────┤                     │                     │
     │                    │                     │                     │
```

## Voting System Flow

```
┌──────────┐         ┌──────────┐         ┌──────────┐         ┌──────────┐
│  User    │         │ Frontend │         │ Backend  │         │ Database │
└────┬─────┘         └────┬─────┘         └────┬─────┘         └────┬─────┘
     │                    │                     │                     │
     │ 1. Click upvote    │                     │                     │
     ├───────────────────▶│                     │                     │
     │                    │                     │                     │
     │                    │ 2. POST /api/votes  │                     │
     │                    │    {targetId, type, │                     │
     │                    │     voteType: 1}    │                     │
     │                    ├────────────────────▶│                     │
     │                    │                     │                     │
     │                    │                     │ 3. Verify JWT       │
     │                    │                     │                     │
     │                    │                     │ 4. Check existing vote
     │                    │                     ├────────────────────▶│
     │                    │                     │                     │
     │                    │                     │ 5. Vote found/not   │
     │                    │                     ◀────────────────────┤
     │                    │                     │                     │
     │                    │                     │ 6. Update/create vote
     │                    │                     ├────────────────────▶│
     │                    │                     │                     │
     │                    │                     │ 7. Update counts    │
     │                    │                     ├────────────────────▶│
     │                    │                     │                     │
     │                    │                     │ 8. Get updated item │
     │                    │                     ◀────────────────────┤
     │                    │                     │                     │
     │                    │ 9. Return updated   │                     │
     │                    │    item with counts │                     │
     │                    ◀────────────────────┤                     │
     │                    │                     │                     │
     │                    │ 10. Update UI       │                     │
     │                    │     Re-sort list    │                     │
     │                    │                     │                     │
     │ 11. See updated    │                     │                     │
     │     score          │                     │                     │
     ◀───────────────────┤                     │                     │
     │                    │                     │                     │
```

## Database Schema Relationships

```
┌─────────────────┐
│      User       │
│─────────────────│
│ _id             │◀──────────┐
│ name            │           │
│ email           │           │ createdBy
│ googleId        │           │
│ avatar          │           │
│ role            │           │
└─────────────────┘           │
        │                     │
        │ authorId            │
        │                     │
        ▼                     │
┌─────────────────┐    ┌─────────────────┐
│    Question     │    │      Topic      │
│─────────────────│    │─────────────────│
│ _id             │    │ _id             │◀────┐
│ topicId         │───▶│ name            │     │
│ title           │    │ description     │     │ topicId
│ description     │    │ createdBy       │─────┘
│ authorId        │───┐└─────────────────┘
│ upvotes         │   │
│ downvotes       │   │
└─────────────────┘   │
        │             │
        │ questionId  │
        │             │
        ▼             │
┌─────────────────┐   │
│     Answer      │   │
│─────────────────│   │
│ _id             │   │
│ questionId      │───┘
│ content         │
│ authorId        │───┐
│ upvotes         │   │
│ downvotes       │   │
└─────────────────┘   │
        │             │
        │             │
        ▼             ▼
┌─────────────────────────────┐
│          Vote               │
│─────────────────────────────│
│ _id                         │
│ userId          ────────────┘
│ targetId        (Question or Answer)
│ targetType      ("Question" or "Answer")
│ voteType        (1 or -1)
│                             │
│ UNIQUE INDEX: (userId, targetId)
└─────────────────────────────┘
```

## Component Hierarchy (Frontend)

```
App
├── AuthProvider (Context)
│   └── Router
│       ├── Navbar
│       │   ├── Logo
│       │   ├── Navigation Links
│       │   └── User Menu
│       │
│       └── Routes
│           ├── Login
│           │   └── GoogleLogin Button
│           │
│           ├── TopicList
│           │   ├── Page Header
│           │   └── Topic Grid
│           │       └── TopicCard (multiple)
│           │
│           ├── TopicDetail
│           │   ├── Topic Header
│           │   └── Questions List
│           │       └── QuestionItem (multiple)
│           │           ├── VoteButtons
│           │           └── Question Content
│           │
│           ├── QuestionDetail
│           │   ├── Question Section
│           │   │   ├── VoteButtons
│           │   │   └── Question Content
│           │   └── Answers Section
│           │       └── AnswerItem (multiple)
│           │           ├── VoteButtons
│           │           └── Answer Content
│           │
│           ├── CreateTopic (PrivateRoute)
│           │   └── Form
│           │
│           ├── CreateQuestion (PrivateRoute)
│           │   └── Form
│           │
│           └── CreateAnswer (PrivateRoute)
│               └── Form
```

## API Request/Response Flow

```
Frontend                    Backend                     Database
   │                           │                           │
   │ GET /api/topics           │                           │
   ├──────────────────────────▶│                           │
   │                           │ Find all topics           │
   │                           ├──────────────────────────▶│
   │                           │                           │
   │                           │ Return topics array       │
   │                           ◀──────────────────────────┤
   │ 200 OK                    │                           │
   │ [{topic1}, {topic2}]      │                           │
   ◀──────────────────────────┤                           │
   │                           │                           │
   │                           │                           │
   │ POST /api/questions       │                           │
   │ + JWT token               │                           │
   ├──────────────────────────▶│                           │
   │                           │ Verify JWT                │
   │                           │                           │
   │                           │ Validate input            │
   │                           │                           │
   │                           │ Create question           │
   │                           ├──────────────────────────▶│
   │                           │                           │
   │                           │ Return created question   │
   │                           ◀──────────────────────────┤
   │ 201 Created               │                           │
   │ {question}                │                           │
   ◀──────────────────────────┤                           │
   │                           │                           │
```

## Security Layers

```
┌─────────────────────────────────────────────────────────┐
│                    Security Layers                       │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Layer 1: HTTPS (Production)                             │
│  ├─ Encrypted communication                              │
│  └─ SSL/TLS certificates                                 │
│                                                           │
│  Layer 2: CORS                                           │
│  ├─ Allowed origins only                                 │
│  └─ Credentials support                                  │
│                                                           │
│  Layer 3: Google OAuth 2.0                               │
│  ├─ Token verification                                   │
│  └─ User authentication                                  │
│                                                           │
│  Layer 4: JWT Tokens                                     │
│  ├─ Signed tokens                                        │
│  ├─ Expiration (30 days)                                 │
│  └─ Secure storage                                       │
│                                                           │
│  Layer 5: Protected Routes                               │
│  ├─ Middleware verification                              │
│  └─ User authorization                                   │
│                                                           │
│  Layer 6: Input Validation                               │
│  ├─ express-validator                                    │
│  ├─ Mongoose schemas                                     │
│  └─ Sanitization                                         │
│                                                           │
│  Layer 7: Database Constraints                           │
│  ├─ Unique indexes                                       │
│  ├─ Required fields                                      │
│  └─ Data types                                           │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Production Setup                      │
└─────────────────────────────────────────────────────────┘
                           │
           ┌───────────────┴───────────────┐
           │                               │
           ▼                               ▼
┌──────────────────────┐      ┌──────────────────────┐
│   Frontend (Vercel)  │      │  Backend (Railway)   │
│                      │      │                      │
│  - React build       │      │  - Node.js server    │
│  - Static hosting    │      │  - Express API       │
│  - CDN distribution  │      │  - Environment vars  │
│  - Auto SSL          │      │  - Auto SSL          │
└──────────────────────┘      └──────────────────────┘
           │                               │
           │                               │
           │                               ▼
           │                  ┌──────────────────────┐
           │                  │ Database (Atlas)     │
           │                  │                      │
           │                  │  - MongoDB cluster   │
           │                  │  - Automatic backups │
           │                  │  - Monitoring        │
           │                  └──────────────────────┘
           │                               │
           │                               │
           └───────────────┬───────────────┘
                           │
                           ▼
           ┌──────────────────────────────┐
           │   Google OAuth Services      │
           │                              │
           │  - Token verification        │
           │  - User authentication       │
           └──────────────────────────────┘
```

## Scaling Strategy

```
Current (Single Server)          Future (Scaled)
┌──────────────┐                ┌──────────────┐
│   Frontend   │                │ Load Balancer│
└──────┬───────┘                └──────┬───────┘
       │                               │
       │                    ┌──────────┼──────────┐
       ▼                    ▼          ▼          ▼
┌──────────────┐     ┌──────────┐ ┌──────────┐ ┌──────────┐
│   Backend    │     │Backend #1│ │Backend #2│ │Backend #3│
└──────┬───────┘     └────┬─────┘ └────┬─────┘ └────┬─────┘
       │                  │            │            │
       │                  └────────────┼────────────┘
       ▼                               ▼
┌──────────────┐              ┌──────────────┐
│   MongoDB    │              │    Redis     │
└──────────────┘              │   (Cache)    │
                              └──────┬───────┘
                                     │
                                     ▼
                              ┌──────────────┐
                              │   MongoDB    │
                              │  (Replicas)  │
                              └──────────────┘
```

## Technology Stack Layers

```
┌─────────────────────────────────────────────────────────┐
│                   Presentation Layer                     │
│  React, React Router, CSS, Google Identity Services     │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   Application Layer                      │
│  Express, Controllers, Routes, Middleware                │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    Business Logic                        │
│  Authentication, Voting, CRUD Operations                 │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                     Data Access Layer                    │
│  Mongoose Models, Schemas, Validation                    │
└─────────────────────────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                      Database Layer                      │
│  MongoDB Collections, Indexes, Constraints               │
└─────────────────────────────────────────────────────────┘
```

This architecture provides a clear, scalable, and maintainable structure for the College Connect application.
