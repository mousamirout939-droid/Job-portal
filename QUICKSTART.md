# Quick Start Guide

Get the Job Portal ATS running locally in 10 minutes.

## 1. Clone & Install

```bash
git clone <repository-url>
cd job-portal-ats
npm run install-all
```

## 2. Setup Environment Files

### Backend (.env)

Create `backend/.env`:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/job-portal-ats
JWT_SECRET=your_super_secret_key_min_32_characters_long
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173

# Gmail (create app password in Gmail settings)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password

# Get from https://cloudinary.com
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Frontend (.env)

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Job Portal
VITE_APP_DESCRIPTION=Find Your Dream Job
```

## 3. Start MongoDB

**Option A: Local MongoDB**
```bash
# macOS with Homebrew
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows (if installed as service)
# Already running

# Or use Docker
docker run -d -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password mongo
```

**Option B: MongoDB Atlas** (Cloud)
- Create account at mongodb.com
- Create cluster
- Get connection string and replace MONGODB_URI

## 4. Start Development Servers

```bash
# From root directory
npm run dev
```

Both servers will start:
- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:5173

## 5. Test the Application

1. Open http://localhost:5173 in browser
2. Click "Register"
3. Create test account:
   - **Candidate**: name: "John Doe", email: "john@example.com", password: "Test123!"
   - **Recruiter**: name: "Jane Smith", email: "jane@example.com", password: "Test123!", role: Recruiter

4. Test features:
   - **Candidate**: Browse jobs, apply for jobs
   - **Recruiter**: Post a job, review applications
   - **Admin**: Login with admin account to access admin panel

## 6. Create Test Data

### As Candidate
1. Login as candidate
2. Upload a resume (PDF, DOC, DOCX)
3. Update your profile with skills
4. View jobs and apply

### As Recruiter
1. Login as recruiter
2. Go to Recruiter Dashboard
3. Click "Post a Job"
4. Fill job details and publish
5. View applications in dashboard

## Test Credentials

Create these accounts during testing:

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| Candidate | candidate@test.com | Test123! | Apply for jobs |
| Recruiter | recruiter@test.com | Test123! | Post jobs & manage apps |
| Admin | admin@test.com | Test123! | Manage platform |

## Common Issues

### MongoDB Connection Failed
```bash
# Check if MongoDB is running
mongosh

# If fails, restart MongoDB
brew services restart mongodb-community
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port
PORT=5001 npm run dev
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules backend/node_modules frontend/node_modules
npm run install-all
```

### Email Sending Issues
- Use Gmail app password (not regular password)
- Enable 2-factor authentication on Gmail
- Visit https://myaccount.google.com/apppasswords

### Cloudinary Upload Issues
- Verify credentials are correct
- Check file size limits (10MB for resumes)
- Use supported formats: PDF, DOC, DOCX, JPG, PNG

## Project Structure Overview

```
job-portal-ats/
├── backend/          # Express server
│   ├── server.js     # Entry point
│   ├── routes/       # API routes
│   └── models/       # MongoDB schemas
├── frontend/         # React app
│   ├── src/
│   │   ├── pages/    # Page components
│   │   ├── store/    # Zustand stores
│   │   └── App.jsx   # Main app
│   └── vite.config.js
└── package.json      # Root package
```

## Available Scripts

```bash
# From root
npm run install-all    # Install all dependencies
npm run dev           # Start both servers
npm run build         # Build both apps
npm run start         # Start backend only

# From backend
npm run dev           # Start with nodemon
npm start             # Start normally

# From frontend
npm run dev           # Start Vite dev server
npm run build         # Build for production
npm run preview       # Preview production build
```

## API Testing

### Using cURL
```bash
# Get all jobs
curl http://localhost:5000/api/jobs

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Create job (with token)
curl -X POST http://localhost:5000/api/jobs \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{...job data...}'
```

### Using Postman
1. Import API collection (check backend/docs/)
2. Set environment variables (BASE_URL, TOKEN)
3. Test endpoints

## Next Steps

1. ✅ Run locally
2. ✅ Create test accounts
3. ✅ Test core features
4. ✅ Review code structure
5. → Customize styling (Tailwind)
6. → Add your own features
7. → Deploy to production (see DEPLOYMENT.md)

## Need Help?

1. Check error logs in terminal
2. Review API documentation: `backend/docs/api_documentation.md`
3. Check database schema: `backend/docs/database_design.md`
4. Refer to main README.md

## Useful Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev)
- [Zustand Store](https://github.com/pmndrs/zustand)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev)


