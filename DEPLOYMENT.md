# Deployment Guide

Complete step-by-step guide for deploying the Job Portal ATS application.

## Prerequisites

- GitHub account with repository access
- Render account (https://render.com)
- Vercel account (https://vercel.com)
- MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)
- Cloudinary account (https://cloudinary.com)
- Gmail account with App Password

## Backend Deployment (Render)

### 1. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Create a database user
4. Whitelist your IP or allow all (0.0.0.0/0) for development
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`

### 2. Cloudinary Setup

1. Sign up at [Cloudinary](https://cloudinary.com)
2. Go to Dashboard to find:
   - Cloud Name
   - API Key
   - API Secret

### 3. Gmail App Password

1. Enable 2-factor authentication on Gmail
2. Go to [App Passwords](https://myaccount.google.com/apppasswords)
3. Select "Mail" and "Windows Computer"
4. Copy the generated password

### 4. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 5. Create Render Web Service

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: job-portal-ats-backend
   - **Environment**: Node
   - **Region**: Choose closest to your users
   - **Branch**: main
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

### 6. Add Environment Variables

In Render dashboard, add under "Environment":

```
PORT=10000
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/job-portal-ats?retryWrites=true&w=majority
JWT_SECRET=<generate-random-string-min-32-chars>
JWT_EXPIRE=7d
FRONTEND_URL=https://job-portal-ats.vercel.app

EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=<your-app-password>

CLOUDINARY_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
```

### 7. Deploy

Click "Deploy" - Render will automatically build and start your backend.

**Backend URL**: `https://job-portal-ats-backend.onrender.com`

## Frontend Deployment (Vercel)

### 1. Build Frontend

```bash
cd frontend
npm run build
```

This creates a `dist/` folder with optimized production files.

### 2. Deploy to Vercel

**Option A: CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend directory
cd frontend
vercel
```

**Option B: Git Integration**
1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com)
3. Click "Add New Project"
4. Select your repository
5. Keep default settings (Vercel auto-detects Vite)
6. Click "Deploy"

### 3. Configure Environment Variables

In Vercel Dashboard:
1. Go to Project Settings
2. Click "Environment Variables"
3. Add:
   ```
   VITE_API_URL=https://job-portal-ats-backend.onrender.com/api
   ```
4. Redeploy to apply changes

**Frontend URL**: `https://job-portal-ats.vercel.app`

## Database Backups

### MongoDB Atlas Automatic Backups

1. Go to MongoDB Atlas Dashboard
2. Click "Backup" under your cluster
3. Enable automatic backups (default: every 6 hours)
4. Set retention to 35 days

### Manual Backup

```bash
mongodump --uri="mongodb+srv://username:password@cluster.mongodb.net/job-portal-ats" --out=./backup
```

## Monitoring & Logs

### Render Logs

1. Go to Render Dashboard
2. Select your service
3. Click "Logs" tab
4. View real-time application logs

### Vercel Analytics

1. Go to Vercel Dashboard
2. Select your project
3. Click "Analytics" tab
4. View performance metrics

### MongoDB Monitoring

1. Go to MongoDB Atlas
2. Click "Metrics" under your cluster
3. Monitor CPU, Memory, Network usage

## Continuous Deployment

### GitHub → Render (Automatic)

1. Connect GitHub in Render
2. Select branch to deploy
3. Render auto-deploys on push

### GitHub → Vercel (Automatic)

1. Connect GitHub in Vercel
2. Deploy on push enabled by default
3. Preview deployments for PRs

## SSL/HTTPS

Both Render and Vercel provide free SSL certificates automatically.

## Custom Domain (Optional)

### For Backend (Render)
1. Go to Render Dashboard → Service → Settings
2. Scroll to "Custom Domain"
3. Add your domain
4. Update DNS records

### For Frontend (Vercel)
1. Go to Vercel Dashboard → Project Settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records

## Environment Variables Summary

### Backend (.env)
```
PORT=10000
NODE_ENV=production
MONGODB_URI=<mongodb-atlas-uri>
JWT_SECRET=<random-32-char-string>
JWT_EXPIRE=7d
FRONTEND_URL=<vercel-frontend-url>
EMAIL_SERVICE=gmail
EMAIL_USER=<gmail-email>
EMAIL_PASSWORD=<gmail-app-password>
CLOUDINARY_NAME=<cloudinary-name>
CLOUDINARY_API_KEY=<cloudinary-api-key>
CLOUDINARY_API_SECRET=<cloudinary-api-secret>
```

### Frontend (.env)
```
VITE_API_URL=<render-backend-url>/api
```

## Performance Optimization

### Backend
- Render scales automatically
- Database indexing configured
- Rate limiting enabled
- Compression enabled

### Frontend
- Built with Vite (fast build)
- Vercel CDN for fast delivery
- Automatic code splitting
- Image optimization

## Troubleshooting

### Backend Not Starting
1. Check Render logs for errors
2. Verify environment variables
3. Test MongoDB connection string
4. Ensure port is not hardcoded to 5000

### Frontend Build Failed
1. Check Vercel logs
2. Run `npm run build` locally
3. Ensure all dependencies are installed
4. Check for TypeScript errors

### API Connection Issues
1. Verify VITE_API_URL in Vercel
2. Check CORS settings in backend
3. Ensure FRONTEND_URL is correct in backend
4. Test API directly in browser

### Email Not Sending
1. Verify email credentials
2. Check Gmail App Password
3. Review email service configuration
4. Check spam folder

### File Upload Issues
1. Verify Cloudinary credentials
2. Check file size limits
3. Ensure correct bucket permissions
4. Test with smaller files

## Scaling

### Database Scaling
- MongoDB Atlas: Upgrade cluster tier
- Add more storage
- Increase RAM

### Backend Scaling
- Render: Change plan to Pro
- Multi-instance deployment
- Load balancing

### Frontend Scaling
- Vercel handles automatically
- Serves from edge locations
- Automatic caching

## Cost Estimates

- **Render** (Backend): $7-26/month
- **Vercel** (Frontend): $0-20/month
- **MongoDB Atlas** (Database): $0-500+/month
- **Cloudinary** (File Storage): $0-99/month

Use free tiers for development/testing.

## Rollback

### Render
1. Go to Deployments tab
2. Select previous deployment
3. Click "Deploy" to rollback

### Vercel
1. Go to Deployments tab
2. Click "Promote to Production" on previous build

## Health Checks

Add to your monitoring:
```bash
curl https://job-portal-ats-backend.onrender.com/api/health
```

Should return:
```json
{"status":"ok"}
```

## Next Steps

1. ✅ Deploy backend
2. ✅ Deploy frontend
3. Test all functionality
4. Set up monitoring alerts
5. Configure custom domain (optional)
6. Enable analytics
7. Set up automated backups
