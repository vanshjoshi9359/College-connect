# Deploying to Render - Complete Guide

## Overview
You'll deploy two services on Render:
1. **Backend** - Node.js Web Service
2. **Frontend** - Static Site

## Step-by-Step Deployment

### Option 1: Using render.yaml (Recommended)

I've created a `render.yaml` file in your root directory. This allows you to deploy both services at once.

**Steps:**
1. Push your code to GitHub
2. Go to [Render Dashboard](https://dashboard.render.com/)
3. Click "New" → "Blueprint"
4. Connect your GitHub repository
5. Render will automatically detect `render.yaml`
6. Add environment variables (see below)
7. Click "Apply"

### Option 2: Manual Deployment

#### Deploy Backend First:

1. **Go to Render Dashboard**
2. **Click "New +" → "Web Service"**
3. **Connect your repository**
4. **Configure:**
   - **Name:** `studygroups-backend`
   - **Region:** Oregon (or closest to you)
   - **Branch:** `main` (or your branch name)
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Plan:** Free

5. **Add Environment Variables:**
   - `NODE_ENV` = `production`
   - `PORT` = `5000`
   - `MONGODB_URI` = `your_mongodb_connection_string`
   - `JWT_SECRET` = `your_secret_key_here`

6. **Click "Create Web Service"**
7. **Wait for deployment** (5-10 minutes)
8. **Copy your backend URL** (e.g., `https://studygroups-backend.onrender.com`)

#### Deploy Frontend:

1. **Go to Render Dashboard**
2. **Click "New +" → "Static Site"**
3. **Connect your repository**
4. **Configure:**
   - **Name:** `studygroups-frontend`
   - **Region:** Oregon
   - **Branch:** `main`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`

5. **Add Environment Variable:**
   - `REACT_APP_API_URL` = `https://your-backend-url.onrender.com` (from step 8 above)

6. **Add Rewrite Rule:**
   - In the "Redirects/Rewrites" section
   - **Source:** `/*`
   - **Destination:** `/index.html`
   - **Action:** `Rewrite`

7. **Click "Create Static Site"**
8. **Wait for deployment** (3-5 minutes)

## Important: Update Backend CORS

After deploying, update your backend CORS to allow your frontend domain:

```javascript
// backend/server.js
const cors = require('cors');

const allowedOrigins = [
  'http://localhost:3000',
  'https://your-frontend-url.onrender.com' // Add your Render frontend URL
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

## Environment Variables

### Backend Environment Variables:
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_very_long_random_secret_key_here
```

### Frontend Environment Variables:
```
REACT_APP_API_URL=https://your-backend-url.onrender.com
```

## Troubleshooting

### Issue: "Cannot GET /" on frontend

**Solution:**
1. Make sure you added the Rewrite Rule in Render dashboard
2. Or ensure `render.yaml` has the routes configuration
3. Redeploy the frontend

### Issue: API calls failing (CORS errors)

**Solution:**
1. Update backend CORS to include your frontend URL
2. Make sure `REACT_APP_API_URL` is set correctly
3. Redeploy backend after CORS changes

### Issue: Backend not starting

**Solution:**
1. Check logs in Render dashboard
2. Verify all environment variables are set
3. Make sure MongoDB URI is correct and accessible
4. Check that `node server.js` works locally

### Issue: Frontend shows blank page

**Solution:**
1. Check browser console for errors
2. Verify `REACT_APP_API_URL` is set
3. Make sure backend is running
4. Check that build completed successfully

## Free Tier Limitations

Render's free tier:
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- 750 hours/month of runtime
- Automatic SSL certificates

## Post-Deployment Checklist

- [ ] Backend is deployed and running
- [ ] Frontend is deployed and accessible
- [ ] Environment variables are set correctly
- [ ] CORS is configured with frontend URL
- [ ] Can access homepage
- [ ] Can navigate to different routes
- [ ] Can refresh page without "Cannot GET /" error
- [ ] Can login/register
- [ ] API calls work (check browser console)
- [ ] MongoDB connection is working

## Updating Your Deployment

When you push changes to GitHub:
- Render automatically redeploys
- Backend: Restarts the service
- Frontend: Rebuilds and publishes

## Custom Domain (Optional)

To use your own domain:
1. Go to your service settings in Render
2. Click "Custom Domain"
3. Add your domain
4. Update DNS records as instructed
5. SSL certificate is automatically provisioned

## Monitoring

- View logs in Render dashboard
- Check service health
- Monitor build times
- Track deployments

## Cost Optimization

Free tier is sufficient for development/testing. For production:
- Upgrade to paid plan for always-on services
- Use CDN for frontend (Render includes this)
- Optimize MongoDB queries
- Enable caching where appropriate

## Need Help?

If deployment fails:
1. Check Render logs (click on your service → Logs tab)
2. Look for error messages
3. Verify all environment variables
4. Test locally first with production build

Common commands to test locally:
```bash
# Test backend
cd backend
npm install
node server.js

# Test frontend build
cd frontend
npm install
npm run build
npx serve -s build
```

## Quick Deploy Commands

If using render.yaml:
```bash
git add .
git commit -m "Deploy to Render"
git push origin main
```

Then go to Render dashboard and click "Apply" on your Blueprint.

## Success!

Once deployed, your app will be available at:
- Frontend: `https://studygroups-frontend.onrender.com`
- Backend: `https://studygroups-backend.onrender.com`

Share the frontend URL with users!
