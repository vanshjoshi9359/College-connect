# College Connect - Testing Guide

This guide covers manual testing procedures for College Connect.

## Testing Checklist

### Authentication Tests

- [ ] **Google Login**
  - Click "Login" button
  - Google sign-in popup appears
  - Select Google account
  - Redirected to homepage
  - User name and avatar appear in navbar
  - JWT token stored in localStorage

- [ ] **Logout**
  - Click "Logout" button
  - Redirected to login page
  - JWT token removed from localStorage
  - Protected routes redirect to login

- [ ] **Protected Routes**
  - Try accessing /create-topic without login → Redirected to login
  - Try accessing /create-question/:id without login → Redirected to login
  - Try accessing /create-answer/:id without login → Redirected to login

- [ ] **Token Persistence**
  - Login
  - Refresh page
  - User still logged in
  - Close browser and reopen
  - User still logged in (if token not expired)

---

### Topic Tests

- [ ] **View Topics**
  - Navigate to homepage
  - All topics displayed in grid
  - Each topic shows name, description, creator

- [ ] **Create Topic**
  - Login required
  - Click "Create Topic"
  - Fill in name: "Test Topic"
  - Fill in description: "Test description"
  - Click "Create Topic"
  - Redirected to topic detail page
  - Topic appears in topic list

- [ ] **Create Duplicate Topic**
  - Try creating topic with existing name
  - Error message: "Topic already exists"

- [ ] **View Topic Detail**
  - Click on a topic
  - Topic name and description displayed
  - Questions list shown (or empty state)
  - "Ask Question" button visible if logged in

- [ ] **Empty State**
  - View topic with no questions
  - "No questions yet" message displayed

---

### Question Tests

- [ ] **View Questions**
  - Navigate to topic detail
  - All questions for topic displayed
  - Each question shows title, description, author, date, vote count

- [ ] **Create Question**
  - Login required
  - Navigate to topic
  - Click "Ask Question"
  - Fill in title: "Test Question?"
  - Fill in description: "Test question description"
  - Click "Post Question"
  - Redirected to question detail page
  - Question appears in topic's question list

- [ ] **View Question Detail**
  - Click on a question
  - Question title and description displayed
  - Topic link shown
  - Author and date displayed
  - Vote buttons visible
  - Answers list shown (or empty state)
  - "Post Answer" button visible if logged in

- [ ] **Question Sorting**
  - Create multiple questions
  - Vote on questions
  - Questions sorted by score (highest first)
  - Questions with same score sorted by newest first

- [ ] **Empty State**
  - View question with no answers
  - "No answers yet" message displayed

---

### Answer Tests

- [ ] **View Answers**
  - Navigate to question detail
  - All answers displayed
  - Each answer shows content, author, date, vote count

- [ ] **Create Answer**
  - Login required
  - Navigate to question
  - Click "Post Answer"
  - Fill in content: "Test answer content"
  - Click "Post Answer"
  - Redirected to question detail page
  - Answer appears in answers list

- [ ] **Answer Sorting**
  - Create multiple answers
  - Vote on answers
  - Answers sorted by score (highest first)
  - Answers with same score sorted by newest first

---

### Voting Tests

- [ ] **Upvote Question**
  - Login required
  - Navigate to question
  - Click upvote (▲) button
  - Vote count increases by 1
  - Upvote button highlighted
  - Vote persists on page refresh

- [ ] **Downvote Question**
  - Login required
  - Navigate to question
  - Click downvote (▼) button
  - Vote count decreases by 1
  - Downvote button highlighted
  - Vote persists on page refresh

- [ ] **Remove Vote (Toggle)**
  - Upvote a question
  - Click upvote button again
  - Vote removed
  - Vote count returns to original
  - Button no longer highlighted

- [ ] **Change Vote**
  - Upvote a question
  - Click downvote button
  - Vote changes from +1 to -1
  - Vote count decreases by 2
  - Downvote button highlighted
  - Upvote button not highlighted

- [ ] **Vote on Answer**
  - Same tests as question voting
  - All voting behaviors work for answers

- [ ] **Vote Without Login**
  - Logout
  - Try to vote
  - Alert: "Please login to vote"
  - No vote registered

- [ ] **Vote Persistence**
  - Vote on multiple items
  - Refresh page
  - All votes still highlighted correctly
  - Vote counts correct

- [ ] **Real-time Sorting**
  - View list of questions
  - Vote on a question
  - List automatically re-sorts
  - Highest scored items appear first

---

### UI/UX Tests

- [ ] **Responsive Design**
  - Test on desktop (1920x1080)
  - Test on tablet (768x1024)
  - Test on mobile (375x667)
  - All elements visible and usable

- [ ] **Navigation**
  - Click logo → Navigate to homepage
  - Click "Topics" → Navigate to homepage
  - Click "Create Topic" → Navigate to create topic page
  - Click "Login" → Navigate to login page
  - Click "Logout" → Logout and redirect to login

- [ ] **Loading States**
  - Loading spinner shown while fetching data
  - "Loading..." text displayed

- [ ] **Error States**
  - Network error → Error message displayed
  - 404 error → "Not found" message
  - Validation error → Error message shown in form

- [ ] **Empty States**
  - No topics → "No topics yet" message
  - No questions → "No questions yet" message
  - No answers → "No answers yet" message

- [ ] **Form Validation**
  - Try submitting empty forms
  - Required field validation works
  - Error messages displayed

---

### Performance Tests

- [ ] **Page Load Time**
  - Homepage loads in < 2 seconds
  - Topic detail loads in < 2 seconds
  - Question detail loads in < 2 seconds

- [ ] **Large Data Sets**
  - Create 50+ topics
  - Create 100+ questions in a topic
  - Create 50+ answers to a question
  - Pages still load quickly
  - Scrolling is smooth

- [ ] **Concurrent Voting**
  - Open same question in two browsers
  - Vote in both browsers
  - Vote counts update correctly
  - No race conditions

---

### Security Tests

- [ ] **JWT Token**
  - Token expires after 30 days
  - Expired token redirects to login
  - Invalid token rejected by backend

- [ ] **Protected Endpoints**
  - Try POST /api/topics without token → 401 error
  - Try POST /api/questions without token → 401 error
  - Try POST /api/answers without token → 401 error
  - Try POST /api/votes without token → 401 error

- [ ] **Input Sanitization**
  - Try XSS in topic name → Sanitized
  - Try SQL injection in description → No effect (NoSQL)
  - Try script tags in content → Escaped

- [ ] **CORS**
  - Requests from allowed origin work
  - Requests from other origins blocked (in production)

---

### Edge Cases

- [ ] **Very Long Content**
  - Create topic with 1000 character description
  - Create question with 5000 character description
  - Create answer with 10000 character content
  - All display correctly

- [ ] **Special Characters**
  - Use emojis in content 😀
  - Use special characters: @#$%^&*
  - Use unicode characters
  - All display correctly

- [ ] **Rapid Actions**
  - Click vote button rapidly
  - Only one vote registered
  - No duplicate votes

- [ ] **Browser Back Button**
  - Navigate through pages
  - Click back button
  - Previous page loads correctly
  - State preserved

- [ ] **Multiple Tabs**
  - Open app in two tabs
  - Login in one tab
  - Other tab still works
  - Logout in one tab
  - Other tab redirects to login on next action

---

## Manual Testing Procedure

### 1. Fresh Start Test

```bash
# Clear database
# Restart backend
# Clear browser cache and localStorage
# Start testing from scratch
```

### 2. Happy Path Test

1. Open app
2. Login with Google
3. Create topic "Web Development"
4. Navigate to topic
5. Ask question "What is React?"
6. Navigate to question
7. Post answer "React is a library..."
8. Upvote the answer
9. Navigate back to topics
10. Verify everything works

### 3. Error Path Test

1. Try creating duplicate topic
2. Try voting without login
3. Try accessing protected routes without login
4. Try submitting empty forms
5. Verify all errors handled gracefully

### 4. Stress Test

1. Create 20 topics
2. Create 50 questions in one topic
3. Create 30 answers to one question
4. Vote on all items
5. Verify performance is acceptable

---

## Automated Testing (Future)

### Backend Tests (Jest + Supertest)

```javascript
// Example test structure
describe('Auth API', () => {
  test('POST /api/auth/google - success', async () => {
    // Test implementation
  });
  
  test('POST /api/auth/google - invalid token', async () => {
    // Test implementation
  });
});

describe('Topics API', () => {
  test('GET /api/topics - returns all topics', async () => {
    // Test implementation
  });
  
  test('POST /api/topics - creates topic', async () => {
    // Test implementation
  });
});
```

### Frontend Tests (React Testing Library)

```javascript
// Example test structure
describe('Login Component', () => {
  test('renders login button', () => {
    // Test implementation
  });
  
  test('calls Google login on button click', () => {
    // Test implementation
  });
});

describe('VoteButtons Component', () => {
  test('upvote increases count', () => {
    // Test implementation
  });
  
  test('downvote decreases count', () => {
    // Test implementation
  });
});
```

---

## Bug Reporting Template

When you find a bug, report it with:

```
**Title:** Brief description

**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Screenshots:**
If applicable

**Environment:**
- Browser: Chrome 120
- OS: Windows 11
- Device: Desktop

**Console Errors:**
Any errors from browser console
```

---

## Test Data

### Sample Topics
- Web Development
- Data Structures & Algorithms
- Communication Skills
- Machine Learning
- System Design

### Sample Questions
- "What is React and how does it work?"
- "How do I implement a binary search tree?"
- "What are the best practices for public speaking?"
- "Explain gradient descent in simple terms"
- "How to design a URL shortener?"

### Sample Answers
- Detailed technical explanations
- Code examples
- Step-by-step guides
- Best practices
- Common pitfalls

---

## Testing Tools

### Browser DevTools
- Network tab: Monitor API calls
- Console: Check for errors
- Application tab: Inspect localStorage
- Performance tab: Measure load times

### Postman
- Test API endpoints directly
- Create test collections
- Automate API testing

### Lighthouse
- Test performance
- Test accessibility
- Test SEO
- Test best practices

---

## Continuous Testing

- Test after every feature addition
- Test after every bug fix
- Test before every deployment
- Test in multiple browsers
- Test on multiple devices

---

## Success Criteria

All tests pass ✓
- No console errors
- No broken links
- All features work as expected
- Performance is acceptable
- Security measures in place
- User experience is smooth
