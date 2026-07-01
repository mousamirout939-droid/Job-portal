import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import authRoutes from './routes/authroutes.js';
import jobRoutes from './routes/jobroutes.js';
import applicationRoutes from './routes/applicationroutes.js';
import companyRoutes from './routes/companyroutes.js';
import resumeRoutes from './routes/resumeroutes.js';
import adminRoutes from './routes/adminroutes.js';
import atsRoutes from './routes/atsroutes.js';
import { errorHandler } from './middleware/errormiddleware.js';
import { initializeCronJobs } from './services/cronservice.js';
import User from './models/user.js';

dotenv.config();

const app = express();

const requiredEnvVars = ['JWT_SECRET'];
const missingEnvVars = requiredEnvVars.filter((name) => !process.env[name]);

if (missingEnvVars.length > 0) {
  console.warn(`Missing env vars: ${missingEnvVars.join(', ')}. Some features may not work correctly.`);
}

// Connect to Database
connectDB();

// Middleware
app.use(helmet());
app.use(compression());

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'https://job-portal-70o67s4lu-mousami.vercel.app',
  'https://job-portal-mousami.vercel.app',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});

app.use(limiter);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Server is running',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ats', atsRoutes);

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

const PORT = Number(process.env.PORT) || 5000;

const ensureDefaultAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'mousami12345@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || '123456';

    let existingAdmin = await User.findOne({ role: 'admin' });

    if (existingAdmin) {
      const duplicateWithEmail = await User.findOne({ email: adminEmail, _id: { $ne: existingAdmin._id } });

      if (duplicateWithEmail) {
        await User.deleteOne({ _id: duplicateWithEmail._id });
      }

      existingAdmin.name = 'System Admin';
      existingAdmin.email = adminEmail;
      existingAdmin.password = adminPassword;
      existingAdmin.role = 'admin';
      existingAdmin.isVerified = true;
      await existingAdmin.save();
      console.log(`Default admin updated: ${adminEmail}`);
      return;
    }

    await User.create({
      name: 'System Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
      isVerified: true,
    });

    console.log(`Default admin created: ${adminEmail}`);
  } catch (error) {
    console.error('Failed to create default admin:', error.message);
  }
};

const startServer = (port = PORT) => {
  const server = app.listen(port, async () => {
    console.log(`Server running on port ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

    try {
      await ensureDefaultAdmin();
      initializeCronJobs();
      console.log('Cron jobs initialized');
    } catch (error) {
      console.error('Error initializing cron jobs:', error);
    }
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.warn(`Port ${port} is busy. Trying ${port + 1}...`);
      server.close(() => startServer(port + 1));
    } else {
      console.error('Server failed to start:', error);
      process.exit(1);
    }
  });

  return server;
};

const server = startServer();

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default app;
