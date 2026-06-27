# Job Portal ATS - Full Stack Application

A production-ready MERN (MongoDB, Express, React, Node.js) stack Job Portal with integrated Applicant Tracking System (ATS). This application allows candidates to search and apply for jobs, recruiters to manage job postings and applications with ATS scoring, and admins to manage the platform.

## Features

### For Candidates
- Browse and search for jobs with advanced filters
- Create and manage multiple resumes
- Apply for jobs with one-click application
- Track application status in real-time
- View ATS score for each application
- Manage profile and skills
- Receive job alerts based on preferences

### For Recruiters
- Post and manage job listings
- Review applications with ATS scoring
- Filter and rank candidates automatically
- Schedule interviews and send status updates
- Add notes and feedback to applications
- View detailed analytics and reports
- Manage company profile

### For Admins
- Dashboard with system overview
- Manage users (suspend/activate)
- Verify companies
- View system reports and analytics
- Monitor platform activity

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **File Upload**: Cloudinary + Multer
- **Job Scheduling**: Node-cron
- **Email**: Nodemailer
- **Security**: Helmet, Express Rate Limit
- **Validation**: Express Validator

### Frontend
- **Library**: React 18
- **Build Tool**: Vite
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **UI Components**: React Icons
- **Charts**: Recharts
- **Notifications**: React Hot Toast

## Project Structure

```
job-portal-ats/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── jobs/
│   ├── uploads/
│   ├── docs/
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── store/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json
└── package.json
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or Atlas)
- Git

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd job-portal-ats
```

### Step 2: Install Dependencies
```bash
# Install all dependencies (backend and frontend)
npm run install-all
```

### Step 3: Configure Environment Variables

#### Backend (.env)
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/job-portal-ats
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173

# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Cloudinary (for file uploads)
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

#### Frontend (.env)
Create a `.env` file in the `frontend/` directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Job Portal
VITE_APP_DESCRIPTION=Find Your Dream Job
```

### Step 4: Start Development Servers

#### Option 1: Run Both Servers (Concurrently)
```bash
npm run dev
```
- Backend: http://localhost:5000
- Frontend: http://localhost:5173

#### Option 2: Run Separately
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

## Production Deployment

### Backend (Render)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Create Render Account** and connect GitHub repository

3. **Create Web Service**
   - Choose Node environment
   - Build command: `npm install`
   - Start command: `npm start`
   - Add environment variables:
     ```
     PORT=10000
     NODE_ENV=production
     MONGODB_URI=<MongoDB Atlas URI>
     JWT_SECRET=<secure random string>
     FRONTEND_URL=https://your-frontend.vercel.app
     EMAIL_SERVICE=gmail
     EMAIL_USER=<your email>
     EMAIL_PASSWORD=<app password>
     CLOUDINARY_NAME=<name>
     CLOUDINARY_API_KEY=<key>
     CLOUDINARY_API_SECRET=<secret>
     ```

4. **Deploy** - Render will auto-deploy on push

### Frontend (Vercel)

1. **Build Locally**
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

3. **Set Environment Variables** in Vercel Dashboard
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```

## API Documentation

See [Backend API Documentation](./backend/docs/api_documentation.md)

## Database Schema

See [Database Design](./backend/docs/database_design.md)

## Key Routes

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Jobs
- `GET /api/jobs` - Get all jobs (with pagination & filters)
- `POST /api/jobs` - Create job (recruiter only)
- `GET /api/jobs/:id` - Get job details
- `PUT /api/jobs/:id` - Update job (recruiter only)
- `DELETE /api/jobs/:id` - Delete job (recruiter only)

### Applications
- `POST /api/applications` - Apply for job
- `GET /api/applications` - Get user's applications
- `PUT /api/applications/:id` - Update application status
- `GET /api/applications/stats` - Get application statistics

### ATS
- `POST /api/ats/:jobId/score` - Score all applications for a job
- `GET /api/ats/:jobId/top-candidates/:limit` - Get top candidates
- `GET /api/ats/analytics` - Get ATS analytics
- `POST /api/ats/filter` - Filter candidates

### Admin
- `GET /api/admin/dashboard` - Get admin dashboard data
- `GET /api/admin/users` - Get all users
- `GET /api/admin/companies` - Get all companies
- `POST /api/admin/companies/:id/verify` - Verify company
- `POST /api/admin/users/:id/suspend` - Suspend user

## Authentication Flow

1. User registers or logs in
2. Backend generates JWT token
3. Token stored in localStorage on frontend
4. Token sent in Authorization header for protected routes
5. Token verified on backend for each request
6. Auto-login on page refresh via loadUser action

## ATS Scoring Algorithm

The ATS system:
1. Extracts keywords from job description
2. Parses resume for skills and experience
3. Calculates match percentage (0-100)
4. Scores all applications for a job
5. Ranks candidates by score
6. Recommends top candidates

## Email Notifications

- Welcome email on registration
- Job alert emails (daily at 9 AM)
- Application status update emails
- Interview scheduling emails

## File Upload

- Resumes: PDF, DOC, DOCX (max 10MB)
- Profile images: JPEG, PNG, GIF (via Cloudinary)
- Company logos/banners: JPEG, PNG (via Cloudinary)

## Cron Jobs

- **Daily 9 AM**: Send job alerts to matching candidates
- **Every 6 hours**: Update analytics
- **Weekly (Sunday midnight)**: Cleanup old data

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check connection string in .env
- Verify IP whitelist on MongoDB Atlas

### File Upload Errors
- Configure Cloudinary credentials
- Check file size limits
- Verify CORS settings

### Email Sending Issues
- Use [Gmail App Password](https://support.google.com/accounts/answer/185833)
- Enable "Less secure apps" if not using App Password
- Check email configuration in .env

### CORS Errors
- Verify FRONTEND_URL in backend .env
- Check CORS configuration in server.js

## Performance Tips

1. Use pagination for large datasets
2. Implement lazy loading for images
3. Cache frequently accessed data
4. Use indexes on MongoDB collections
5. Enable gzip compression
6. Minify CSS and JavaScript

## Security Best Practices

1. Keep JWT_SECRET secure
2. Use HTTPS in production
3. Implement rate limiting
4. Validate all inputs
5. Use environment variables for secrets
6. Keep dependencies updated
7. Enable CORS properly

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Check existing documentation
- Review API documentation

## Future Enhancements

- Video interview integration
- Advanced analytics dashboard
- Mobile app
- Real-time notifications (WebSockets)
- Skill verification system
- Integration with LinkedIn
- Salary prediction based on skills
- AI-powered resume review
