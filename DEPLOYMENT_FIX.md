# Fixing "Cannot GET /" Error on Deployment

## The Problem
When you deploy a React app with client-side routing (React Router), refreshing the page or accessing routes directly causes a "Cannot GET /" error. This happens because the server tries to find a file for that route, but React Router handles routing on the client side.

## Solutions by Platform

### 1. Vercel (Recommended for Frontend)

Create a `vercel.json` file in the `frontend` folder:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2. Netlify

Create a `_redirects` file in the `frontend/public` folder:

```
/*    /index.html   200
```

Or create a `netlify.toml` file in the `frontend` folder:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### 3. Render

Create a `render.yaml` file in the root:

```yaml
services:
  - type: web
    name: studygroups-frontend
    env: static
    buildCommand: cd frontend && npm install && npm run build
    staticPublishPath: frontend/build
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
```

### 4. Heroku

For Heroku, you need to serve the React app through Express. Create a server file or update your backend to serve the frontend.

### 5. Custom Server / VPS

If you're using your own server, you need to configure it to serve `index.html` for all routes.

## Recommended Deployment Setup

### Option A: Separate Deployments (Recommended)

**Frontend (Vercel/Netlify):**
1. Deploy frontend to Vercel or Netlify
2. Set environment variable: `REACT_APP_API_URL=https://your-backend-url.com`

**Backend (Render/Railway/Heroku):**
1. Deploy backend separately
2. Set CORS to allow your frontend domain
3. Set environment variables (MongoDB URI, JWT secret, etc.)

### Option B: Single Server Deployment

If you want to deploy both on one server, the backend needs to serve the frontend build files.

## Quick Fix for Your Current Setup

Since you're getting "Cannot GET /", you're likely deploying to a platform that needs routing configuration. Here's what to do:

### Step 1: Add vercel.json to frontend

This works for most platforms, not just Vercel.

### Step 2: Update Backend CORS

Make sure your backend allows requests from your deployed frontend domain.

### Step 3: Update Frontend Environment Variable

Set `REACT_APP_API_URL` to your deployed backend URL.

## Detailed Instructions

### For Vercel Deployment:

1. **Deploy Backend First:**
   - Go to Vercel dashboard
   - Import your repository
   - Set root directory to `backend`
   - Add environment variables (MONGODB_URI, JWT_SECRET, etc.)
   - Deploy

2. **Deploy Frontend:**
   - Create new project in Vercel
   - Import same repository
   - Set root directory to `frontend`
   - Add environment variable: `REACT_APP_API_URL=https://your-backend.vercel.app`
   - Deploy

### For Netlify Deployment:

1. **Deploy Frontend:**
   - Go to Netlify dashboard
   - Drag and drop your `frontend/build` folder
   - Or connect to Git repository
   - Build command: `cd frontend && npm run build`
   - Publish directory: `frontend/build`
   - Add `_redirects` file to `frontend/public`

2. **Deploy Backend:**
   - Use Render, Railway, or Heroku for backend
   - Set environment variables
   - Update CORS settings

## Environment Variables Needed

### Backend (.env):
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=production
```

### Frontend (.env.production):
```
REACT_APP_API_URL=https://your-backend-url.com
```

## Testing Deployment

After deployment:
1. Visit your frontend URL
2. Try navigating to different pages
3. Refresh the page - should NOT show "Cannot GET /"
4. Check browser console for API errors
5. Verify backend is accessible

## Common Issues and Fixes

### Issue 1: "Cannot GET /" on refresh
**Fix:** Add routing configuration (vercel.json, _redirects, etc.)

### Issue 2: API calls failing
**Fix:** 
- Check REACT_APP_API_URL is set correctly
- Verify backend CORS allows frontend domain
- Check backend is running and accessible

### Issue 3: 404 on routes
**Fix:** Ensure all routes redirect to index.html

### Issue 4: Environment variables not working
**Fix:**
- Rebuild after adding environment variables
- Use REACT_APP_ prefix for frontend variables
- Restart backend after changing variables

## Build Commands

### Frontend:
```bash
cd frontend
npm install
npm run build
```

### Backend:
```bash
cd backend
npm install
node server.js
```

## CORS Configuration

Update your backend to allow your frontend domain:

```javascript
// backend/server.js
const cors = require('cors');

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
};

app.use(cors(corsOptions));
```

## Checklist Before Deployment

- [ ] Frontend builds successfully (`npm run build`)
- [ ] Backend runs without errors
- [ ] Environment variables are set
- [ ] MongoDB is accessible from deployment server
- [ ] CORS is configured correctly
- [ ] Routing configuration is added (vercel.json or _redirects)
- [ ] API_URL points to deployed backend
- [ ] All routes redirect to index.html

## Need Help?

If you're still getting "Cannot GET /", tell me:
1. Which platform are you deploying to? (Vercel, Netlify, Heroku, etc.)
2. Are you deploying frontend and backend together or separately?
3. What's the exact error message?
4. Can you access the homepage but not other routes?

I'll provide specific instructions for your deployment platform!
