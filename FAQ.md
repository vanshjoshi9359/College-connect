# College Connect - Frequently Asked Questions (FAQ)

## General Questions

### What is College Connect?
College Connect is a growth-focused knowledge platform where users ask high-quality questions and share high-quality answers. It's organized by topics (skills/domains) and uses community voting to surface the best content.

### How is this different from Stack Overflow or Reddit?
- **Focus**: Growth and learning, not just problem-solving
- **Organization**: Topic-based, not tag-based or subreddit-based
- **Simplicity**: No complex reputation system, just voting
- **No Social Features**: No followers, no algorithms, no infinite scrolling

### Who can use College Connect?
Anyone with a Google account can use College Connect. You need to be logged in to create content and vote, but anyone can browse and read content.

---

## Authentication Questions

### Why only Google authentication?
Google OAuth provides secure, reliable authentication without requiring users to create and remember another password. It's also easier to implement and maintain.

### Can I use email/password to sign up?
Currently, no. Only Google authentication is supported. This may change in future versions.

### How long does my session last?
Your JWT token is valid for 30 days. After that, you'll need to log in again.

### Is my Google password shared with College Connect?
No. Google OAuth never shares your password. College Connect only receives your name, email, and profile picture from Google.

### Can I delete my account?
Currently, there's no self-service account deletion. Contact the administrator to delete your account. (Feature to be added in future versions)

---

## Content Questions

### Who can create topics?
Any logged-in user can create topics. Topics represent skills or domains like "Web Development" or "Communication Skills."

### Can I edit my questions/answers after posting?
Currently, no. This feature may be added in future versions. For now, post carefully!

### Can I delete my questions/answers?
Currently, no. This feature may be added in future versions.

### How are questions and answers sorted?
By score (upvotes - downvotes), highest first. Items with the same score are sorted by newest first.

### Can I attach images or code to my answers?
Currently, no. Only plain text is supported. Rich text editing may be added in future versions.

### Is there a character limit?
No hard limit is enforced, but very long content may affect performance. Keep answers concise and focused.

---

## Voting Questions

### How does voting work?
- Click ▲ to upvote (adds +1 to score)
- Click ▼ to downvote (adds -1 to score)
- Click the same button again to remove your vote
- Click the opposite button to change your vote

### Can I vote on my own content?
Yes, but it's not recommended. The system doesn't prevent it.

### Can I see who voted on my content?
No. Voting is anonymous.

### Can I vote multiple times on the same item?
No. You can only vote once per item. The system prevents duplicate votes.

### What happens if I change my vote?
If you upvoted and then downvote, your vote changes from +1 to -1, effectively changing the score by 2 points.

### Do votes affect my reputation?
Currently, no. There's no reputation system. Votes only affect content ranking.

---

## Technical Questions

### What technologies are used?
- **Frontend**: React, React Router, Axios, Google Identity Services
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT
- **Authentication**: Google OAuth 2.0
- **Database**: MongoDB

### Is the code open source?
That depends on the project owner's decision. Check the repository for license information.

### Can I contribute to the project?
If the project is open source, yes! Check the contributing guidelines in the repository.

### How is data stored?
All data is stored in MongoDB, a NoSQL database. User data, topics, questions, answers, and votes are stored in separate collections.

### Is my data secure?
Yes. We use industry-standard security practices:
- Google OAuth for authentication
- JWT tokens for session management
- HTTPS for all communications (in production)
- Environment variables for secrets
- Input validation and sanitization

---

## Setup Questions

### What do I need to run this locally?
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Google OAuth credentials
- A code editor

### How do I get Google OAuth credentials?
See the SETUP_GUIDE.md file for detailed instructions. Basically:
1. Go to Google Cloud Console
2. Create a project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Copy the Client ID

### Do I need to pay for MongoDB?
No. MongoDB Atlas offers a free tier (512MB) which is sufficient for development and small-scale production.

### Can I use a different database?
The code is built for MongoDB. Using a different database would require significant changes to the models and controllers.

### Why isn't the app working on my machine?
Check the troubleshooting section in SETUP_GUIDE.md. Common issues:
- MongoDB not running
- Wrong environment variables
- Port conflicts
- Missing dependencies

---

## Deployment Questions

### Where can I deploy this?
- **Backend**: Railway, Heroku, AWS EC2, DigitalOcean
- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Database**: MongoDB Atlas

### How much does deployment cost?
- **Free tier**: $0/month (MongoDB Atlas free + Railway free + Vercel free)
- **Small scale**: ~$14/month
- **Medium scale**: ~$97/month

See DEPLOYMENT.md for detailed cost breakdown.

### Do I need a domain name?
No. Free deployment platforms provide subdomains. But a custom domain is recommended for production.

### How do I set up HTTPS?
Most deployment platforms (Railway, Vercel, Netlify) provide free SSL certificates automatically.

### Can I deploy to a shared hosting service?
No. You need a platform that supports Node.js applications. Shared hosting typically only supports PHP.

---

## Feature Questions

### Will there be a mobile app?
Not currently, but it's on the roadmap for future versions. The web app is mobile-responsive.

### Can I search for questions?
Not yet. Search functionality is planned for a future version.

### Can I follow topics or users?
No. College Connect intentionally avoids social features to focus on content quality.

### Will there be notifications?
Not yet. Email notifications are planned for a future version.

### Can I comment on answers?
Not yet. A comment system is planned for a future version.

### Can I bookmark questions?
Not yet. Bookmarks/favorites are planned for a future version.

### Will there be tags?
Not yet. Tags for questions are planned for a future version.

---

## Performance Questions

### How many users can this handle?
The current architecture can handle 1,000-10,000 users comfortably. Beyond that, you'll need to implement scaling strategies (load balancing, caching, etc.).

### Why is the app slow?
Possible reasons:
- Large dataset without pagination
- Slow database queries (add indexes)
- Network latency
- Unoptimized frontend code

### How can I improve performance?
- Add database indexes
- Implement pagination
- Use caching (Redis)
- Optimize images
- Enable gzip compression
- Use a CDN

---

## Troubleshooting Questions

### Google login isn't working. What do I do?
1. Check GOOGLE_CLIENT_ID is correct in both frontend and backend
2. Verify authorized origins in Google Console
3. Clear browser cache and cookies
4. Try incognito/private mode
5. Check browser console for errors

### I'm getting "Network Error". What's wrong?
1. Check backend is running
2. Verify REACT_APP_API_URL is correct
3. Check for CORS errors in console
4. Verify MongoDB is connected

### Votes aren't working. Why?
1. Make sure you're logged in
2. Check JWT token is being sent
3. Verify backend is receiving the token
4. Check browser console for errors

### I can't create a topic. What's the issue?
1. Make sure you're logged in
2. Check if topic name already exists
3. Verify all required fields are filled
4. Check browser console for errors

### The app crashed. What should I do?
1. Check backend logs for errors
2. Check browser console for errors
3. Restart backend server
4. Clear browser cache
5. Check database connection

---

## Development Questions

### How do I add a new feature?
1. Plan the feature (database changes, API endpoints, UI)
2. Update database models if needed
3. Create/update API endpoints
4. Create/update frontend components
5. Test thoroughly
6. Deploy

### How do I fix a bug?
1. Reproduce the bug
2. Check logs for errors
3. Identify the root cause
4. Fix the code
5. Test the fix
6. Deploy

### Can I customize the UI?
Yes! All CSS files are in the frontend/src directory. Modify them to match your design preferences.

### How do I add a new page?
1. Create component in frontend/src/pages
2. Add route in App.js
3. Add navigation link if needed
4. Test the page

### How do I add a new API endpoint?
1. Create controller function in backend/controllers
2. Add route in backend/routes
3. Add validation if needed
4. Test with Postman
5. Update API documentation

---

## Best Practices Questions

### What makes a good question?
- Clear and specific title
- Detailed description
- Relevant to the topic
- Shows research effort
- Focused on learning/growth

### What makes a good answer?
- Directly addresses the question
- Provides clear explanation
- Includes examples if relevant
- Well-structured and readable
- Accurate and helpful

### When should I upvote?
Upvote content that is:
- Helpful and useful
- Well-written and clear
- Accurate and correct
- Adds value to the community

### When should I downvote?
Downvote content that is:
- Incorrect or misleading
- Off-topic or irrelevant
- Poorly written or unclear
- Spam or low-quality

### How do I choose a topic name?
- Use clear, descriptive names
- Focus on skills or domains
- Avoid overly broad topics
- Check if similar topic exists
- Use proper capitalization

---

## Business Questions

### Can I use this for my company?
Yes, if the license permits. Check the LICENSE file in the repository.

### Can I monetize this platform?
That depends on the license and your implementation. Common monetization strategies:
- Premium features
- Advertisements
- Sponsorships
- Donations

### Can I white-label this?
Yes, you can customize the branding, colors, and name to match your needs.

### Is there commercial support available?
That depends on the project maintainers. Check the repository for support options.

---

## Future Roadmap Questions

### What features are planned?
- Search functionality
- User profiles
- Comment system
- Tags for questions
- Bookmarks/favorites
- Notifications
- Rich text editor
- Mobile app

### When will these features be released?
No specific timeline. Features will be added based on priority and resources.

### Can I request a feature?
Yes! Open an issue in the GitHub repository or contact the maintainers.

### How can I stay updated?
- Watch the GitHub repository
- Check the changelog
- Follow project announcements

---

## Contact Questions

### How do I report a bug?
Open an issue in the GitHub repository with:
- Bug description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details

### How do I get help?
1. Check this FAQ
2. Read the documentation (README, SETUP_GUIDE, etc.)
3. Search existing GitHub issues
4. Open a new issue if needed

### Who maintains this project?
Check the repository for maintainer information.

### Can I hire someone to customize this?
Yes, you can hire a developer to customize the platform for your needs.

---

## Miscellaneous Questions

### Why is it called "College Connect"?
The name reflects the platform's focus on learning and growth, similar to a college environment where knowledge is shared and developed.

### Can I rename the platform?
Yes! Update the name in:
- Frontend: App title, navbar, package.json
- Backend: Package.json, API responses
- Documentation: All markdown files

### Is this production-ready?
Yes! The code follows best practices and is ready for deployment. However, you may want to add additional features based on your needs.

### What's the difference between this and a forum?
College Connect is more structured:
- Topic-based organization
- Question-answer format
- Voting-based ranking
- No threaded discussions
- Focus on quality over quantity

### Can I use this for non-educational purposes?
Yes! While designed for learning, the platform can be adapted for any Q&A use case.

---

## Still Have Questions?

If your question isn't answered here:
1. Check the documentation files (README.md, SETUP_GUIDE.md, etc.)
2. Search the GitHub issues
3. Open a new issue with your question
4. Contact the project maintainers

---

**Last Updated**: February 2026
