# College Connect API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### POST /auth/google
Authenticate user with Google OAuth token.

**Request Body:**
```json
{
  "credential": "google_id_token_here"
}
```

**Response (200):**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://...",
    "role": "user"
  }
}
```

**Errors:**
- 400: Credential is required
- 401: Invalid Google token

---

### GET /auth/me
Get current authenticated user.

**Headers:** Authorization required

**Response (200):**
```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://...",
    "role": "user"
  }
}
```

**Errors:**
- 401: Not authorized, no token / token failed
- 401: User not found

---

## Topic Endpoints

### GET /topics
Get all topics.

**Response (200):**
```json
[
  {
    "_id": "topic_id",
    "name": "Web Development",
    "description": "Learn web development skills",
    "createdBy": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "https://..."
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

---

### GET /topics/:id
Get single topic by ID.

**Response (200):**
```json
{
  "_id": "topic_id",
  "name": "Web Development",
  "description": "Learn web development skills",
  "createdBy": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://..."
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Errors:**
- 404: Topic not found

---

### POST /topics
Create a new topic.

**Headers:** Authorization required

**Request Body:**
```json
{
  "name": "Web Development",
  "description": "Learn web development skills"
}
```

**Response (201):**
```json
{
  "_id": "topic_id",
  "name": "Web Development",
  "description": "Learn web development skills",
  "createdBy": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://..."
  },
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Errors:**
- 400: Topic already exists
- 400: Validation errors (name/description required)
- 401: Not authorized

---

## Question Endpoints

### GET /questions/topic/:topicId
Get all questions for a topic.

**Response (200):**
```json
[
  {
    "_id": "question_id",
    "title": "What is React?",
    "description": "I want to learn React...",
    "topicId": {
      "_id": "topic_id",
      "name": "Web Development"
    },
    "authorId": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "https://..."
    },
    "upvotes": 5,
    "downvotes": 1,
    "score": 4,
    "userVote": 1,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Note:** 
- Questions are sorted by score (upvotes - downvotes), then by newest
- `userVote` is only present if user is authenticated (1, -1, or null)

---

### GET /questions/:id
Get single question by ID.

**Response (200):**
```json
{
  "_id": "question_id",
  "title": "What is React?",
  "description": "I want to learn React...",
  "topicId": {
    "_id": "topic_id",
    "name": "Web Development"
  },
  "authorId": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://..."
  },
  "upvotes": 5,
  "downvotes": 1,
  "score": 4,
  "userVote": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Errors:**
- 404: Question not found

---

### POST /questions
Create a new question.

**Headers:** Authorization required

**Request Body:**
```json
{
  "topicId": "topic_id",
  "title": "What is React?",
  "description": "I want to learn React. Where should I start?"
}
```

**Response (201):**
```json
{
  "_id": "question_id",
  "title": "What is React?",
  "description": "I want to learn React...",
  "topicId": {
    "_id": "topic_id",
    "name": "Web Development"
  },
  "authorId": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://..."
  },
  "upvotes": 0,
  "downvotes": 0,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Errors:**
- 400: Validation errors (topicId/title/description required)
- 401: Not authorized
- 404: Topic not found

---

## Answer Endpoints

### GET /answers/question/:questionId
Get all answers for a question.

**Response (200):**
```json
[
  {
    "_id": "answer_id",
    "content": "React is a JavaScript library...",
    "questionId": "question_id",
    "authorId": {
      "_id": "user_id",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "avatar": "https://..."
    },
    "upvotes": 3,
    "downvotes": 0,
    "score": 3,
    "userVote": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Note:**
- Answers are sorted by score (upvotes - downvotes), then by newest
- `userVote` is only present if user is authenticated (1, -1, or null)

---

### POST /answers
Create a new answer.

**Headers:** Authorization required

**Request Body:**
```json
{
  "questionId": "question_id",
  "content": "React is a JavaScript library for building user interfaces..."
}
```

**Response (201):**
```json
{
  "_id": "answer_id",
  "content": "React is a JavaScript library...",
  "questionId": "question_id",
  "authorId": {
    "_id": "user_id",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "avatar": "https://..."
  },
  "upvotes": 0,
  "downvotes": 0,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Errors:**
- 400: Validation errors (questionId/content required)
- 401: Not authorized
- 404: Question not found

---

## Vote Endpoints

### POST /votes
Vote on a question or answer.

**Headers:** Authorization required

**Request Body:**
```json
{
  "targetId": "question_or_answer_id",
  "targetType": "Question",
  "voteType": 1
}
```

**Parameters:**
- `targetId`: ID of the question or answer
- `targetType`: "Question" or "Answer"
- `voteType`: 1 (upvote) or -1 (downvote)

**Behavior:**
- First vote: Creates new vote
- Same vote again: Removes vote (toggle off)
- Different vote: Changes vote from up to down or vice versa

**Response (200):**
Returns the updated question or answer with new vote counts:
```json
{
  "_id": "question_id",
  "title": "What is React?",
  "description": "I want to learn React...",
  "topicId": "topic_id",
  "authorId": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": "https://..."
  },
  "upvotes": 6,
  "downvotes": 1,
  "userVote": 1,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

**Errors:**
- 400: Missing required fields
- 400: Invalid target type (must be "Question" or "Answer")
- 400: Invalid vote type (must be 1 or -1)
- 401: Not authorized
- 404: Question/Answer not found

---

## Error Response Format

All errors follow this format:

```json
{
  "message": "Error message here"
}
```

Or for validation errors:

```json
{
  "errors": [
    {
      "msg": "Title is required",
      "param": "title",
      "location": "body"
    }
  ]
}
```

---

## Status Codes

- 200: Success
- 201: Created
- 400: Bad Request (validation error)
- 401: Unauthorized (authentication required)
- 404: Not Found
- 500: Server Error

---

## Rate Limiting

Currently no rate limiting is implemented. In production, consider adding rate limiting middleware.

---

## CORS

CORS is enabled for all origins in development. In production, configure CORS to only allow your frontend domain.

---

## Testing with cURL

### Login with Google (requires actual Google token)
```bash
curl -X POST http://localhost:5000/api/auth/google \
  -H "Content-Type: application/json" \
  -d '{"credential":"your_google_token"}'
```

### Get Topics
```bash
curl http://localhost:5000/api/topics
```

### Create Topic (requires JWT)
```bash
curl -X POST http://localhost:5000/api/topics \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{"name":"Web Development","description":"Learn web dev"}'
```

### Vote (requires JWT)
```bash
curl -X POST http://localhost:5000/api/votes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{"targetId":"question_id","targetType":"Question","voteType":1}'
```

---

## Testing with Postman

1. Import the endpoints into Postman
2. Create an environment variable for `baseUrl`: `http://localhost:5000/api`
3. Create an environment variable for `token`: your JWT token
4. Use `{{baseUrl}}` and `{{token}}` in your requests

---

## WebSocket Support

Currently not implemented. Future versions may add real-time updates via WebSocket.
