# College Connect - Production Deployment Guide

This guide covers deploying College Connect to production environments.

## Pre-Deployment Checklist

- [ ] MongoDB Atlas cluster created
- [ ] Google OAuth credentials configured for production domain
- [ ] Strong JWT secret generated
- [ ] Environment variables prepared
- [ ] Code tested locally
- [ ] Git repository ready

---

## Backend Deployment

### Option 1: Railway (Recommended - Easy)

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your repository
   - Select the repository

3. **Configure Root Directory**
   - Go to Settings
   - Set "Root Directory" to `backend`
   - Set "Start Command" to `npm start`

4. **Add Environment Variables**
   - Go to Variables tab
   - Add each variable:
     ```
     MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/college-connect
     JWT_SECRET=your_production_jwt_secret_min_32_chars
     GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
     PORT=5000
     NODE_ENV=production
     ```

5. **Deploy**
   - Railway will automatically deploy
   - Copy the generated URL (e.g., `https://your-app.railway.app`)

---

### Option 2: Heroku

1. **Install Heroku CLI**
   ```bash
   # Download from heroku.com/cli
   ```

2. **Login and Create App**
   ```bash
   heroku login
   cd backend
   heroku create college-connect-api
   ```

3. **Set Environment Variables**
   ```bash
   heroku config:set MONGO_URI="mongodb+srv://..."
   heroku config:set JWT_SECRET="your_secret"
   heroku config:set GOOGLE_CLIENT_ID="your_client_id"
   heroku config:set NODE_ENV="production"
   ```

4. **Deploy**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git push heroku main
   ```

5. **Open App**
   ```bash
   heroku open
   ```

---

### Option 3: AWS EC2

1. **Launch EC2 Instance**
   - Ubuntu Server 22.04 LTS
   - t2.micro (free tier)
   - Configure security group: Allow ports 22, 80, 443, 5000

2. **Connect and Setup**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   
   # Clone repository
   git clone your-repo-url
   cd college-connect/backend
   
   # Install dependencies
   npm install
   ```

3. **Create .env file**
   ```bash
   nano .env
   # Add your environment variables
   ```

4. **Start with PM2**
   ```bash
   pm2 start server.js --name college-connect-api
   pm2 startup
   pm2 save
   ```

5. **Setup Nginx (Optional)**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/college-connect
   ```
   
   Add:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   ```bash
   sudo ln -s /etc/nginx/sites-available/college-connect /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

---

## Frontend Deployment

### Option 1: Vercel (Recommended - Easy)

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   cd frontend
   vercel
   ```

3. **Configure Environment Variables**
   - Go to Vercel dashboard
   - Select your project
   - Go to Settings → Environment Variables
   - Add:
     ```
     REACT_APP_API_URL=https://your-backend-url.railway.app
     REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
     ```

4. **Redeploy**
   ```bash
   vercel --prod
   ```

---

### Option 2: Netlify

1. **Build the App**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy via Netlify CLI**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod
   ```

3. **Or Deploy via Web Interface**
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `build` folder
   - Configure environment variables in Site Settings

4. **Configure Environment Variables**
   - Go to Site Settings → Environment Variables
   - Add:
     ```
     REACT_APP_API_URL=https://your-backend-url
     REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
     ```

---

### Option 3: AWS S3 + CloudFront

1. **Build the App**
   ```bash
   cd frontend
   npm run build
   ```

2. **Create S3 Bucket**
   - Go to AWS S3 Console
   - Create bucket: `college-connect-frontend`
   - Enable static website hosting
   - Upload `build` folder contents

3. **Create CloudFront Distribution**
   - Origin: Your S3 bucket
   - Default root object: `index.html`
   - Error pages: 404 → /index.html (for React Router)

4. **Update Environment Variables**
   - Rebuild with production API URL
   - Re-upload to S3

---

## Google OAuth Configuration for Production

1. **Go to Google Cloud Console**
   - Select your project

2. **Update OAuth Consent Screen**
   - Add production domain

3. **Update OAuth 2.0 Client ID**
   - Authorized JavaScript origins:
     - `https://your-frontend-domain.com`
   - Authorized redirect URIs:
     - `https://your-frontend-domain.com`

4. **Update Environment Variables**
   - Backend: Same GOOGLE_CLIENT_ID
   - Frontend: Same GOOGLE_CLIENT_ID

---

## MongoDB Atlas Configuration

1. **Network Access**
   - Go to Network Access
   - Add IP Address: `0.0.0.0/0` (allow all)
   - Or add specific IPs of your servers

2. **Database User**
   - Ensure user has read/write permissions
   - Use strong password

3. **Connection String**
   - Use in MONGO_URI environment variable
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/college-connect`

---

## Security Checklist

- [ ] Use HTTPS for both frontend and backend
- [ ] Set strong JWT_SECRET (min 32 characters)
- [ ] Configure CORS to only allow your frontend domain
- [ ] Use environment variables for all secrets
- [ ] Enable MongoDB Atlas IP whitelist
- [ ] Set NODE_ENV=production
- [ ] Remove console.logs in production
- [ ] Add rate limiting middleware
- [ ] Enable helmet.js for security headers
- [ ] Keep dependencies updated

---

## CORS Configuration for Production

Update `backend/server.js`:

```javascript
const cors = require('cors');

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-frontend-domain.com'
    : 'http://localhost:3000',
  credentials: true
};

app.use(cors(corsOptions));
```

---

## Add Security Middleware

Install helmet:
```bash
cd backend
npm install helmet
```

Update `backend/server.js`:
```javascript
const helmet = require('helmet');

app.use(helmet());
```

---

## Add Rate Limiting

Install express-rate-limit:
```bash
cd backend
npm install express-rate-limit
```

Update `backend/server.js`:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## Monitoring and Logging

### Backend Monitoring

**Option 1: PM2 (if using EC2)**
```bash
pm2 logs college-connect-api
pm2 monit
```

**Option 2: Railway/Heroku**
- Use built-in logging dashboard

### Error Tracking

Consider adding:
- [Sentry](https://sentry.io) for error tracking
- [LogRocket](https://logrocket.com) for session replay

---

## Custom Domain Setup

### Backend (Railway)
1. Go to Settings → Domains
2. Add custom domain
3. Update DNS records as instructed

### Frontend (Vercel/Netlify)
1. Go to Settings → Domains
2. Add custom domain
3. Update DNS records as instructed

---

## SSL/HTTPS

Most platforms (Railway, Vercel, Netlify, Heroku) provide free SSL certificates automatically.

For AWS EC2, use Let's Encrypt:
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Backup Strategy

### Database Backups
- MongoDB Atlas provides automatic backups
- Configure backup schedule in Atlas dashboard

### Code Backups
- Use Git for version control
- Push to GitHub/GitLab regularly

---

## Performance Optimization

### Backend
- Enable gzip compression
- Add caching headers
- Use connection pooling for MongoDB
- Optimize database queries with indexes

### Frontend
- Enable code splitting
- Optimize images
- Use CDN for static assets
- Enable browser caching

---

## Post-Deployment Testing

1. **Test Authentication**
   - Login with Google
   - Verify JWT token works

2. **Test CRUD Operations**
   - Create topic
   - Create question
   - Create answer
   - Vote on items

3. **Test Error Handling**
   - Try invalid requests
   - Test unauthorized access

4. **Performance Testing**
   - Use Lighthouse for frontend
   - Use Apache Bench for backend

---

## Rollback Plan

### Railway/Heroku
- Use built-in rollback feature
- Or redeploy previous commit

### Manual Deployment
```bash
git revert HEAD
git push
# Redeploy
```

---

## Environment Variables Summary

### Backend Production
```env
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/college-connect
JWT_SECRET=production_secret_min_32_characters_random
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
PORT=5000
NODE_ENV=production
```

### Frontend Production
```env
REACT_APP_API_URL=https://your-backend-domain.com
REACT_APP_GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
```

---

## Maintenance

### Regular Tasks
- Monitor error logs weekly
- Update dependencies monthly
- Review security advisories
- Backup database regularly
- Monitor performance metrics

### Scaling
- Upgrade server resources as needed
- Consider load balancing for high traffic
- Use Redis for caching
- Implement CDN for static assets

---

## Cost Estimates

### Free Tier (Good for MVP)
- MongoDB Atlas: Free (512MB)
- Railway: Free tier available
- Vercel: Free for personal projects
- Total: $0/month

### Production (Small Scale)
- MongoDB Atlas: $9/month (Shared cluster)
- Railway: $5/month
- Vercel: Free
- Total: ~$14/month

### Production (Medium Scale)
- MongoDB Atlas: $57/month (Dedicated)
- Railway: $20/month
- Vercel Pro: $20/month
- Total: ~$97/month

---

## Support and Resources

- MongoDB Atlas: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- Railway: [docs.railway.app](https://docs.railway.app)
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Google OAuth: [developers.google.com/identity](https://developers.google.com/identity)

---

## Troubleshooting Production Issues

### Backend not starting
- Check environment variables
- Check MongoDB connection
- Review logs

### Frontend can't connect to backend
- Verify REACT_APP_API_URL is correct
- Check CORS configuration
- Verify backend is running

### Google login fails
- Check authorized domains in Google Console
- Verify GOOGLE_CLIENT_ID matches
- Check HTTPS is enabled

---

## Next Steps After Deployment

1. Set up monitoring and alerts
2. Configure automated backups
3. Add analytics (Google Analytics)
4. Set up CI/CD pipeline
5. Create staging environment
6. Document API for external use
7. Add more features based on user feedback
