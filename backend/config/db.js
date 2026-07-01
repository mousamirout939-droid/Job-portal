import mongoose from 'mongoose';

const getMongoUri = () => {
  return process.env.MONGODB_URI
    || process.env.MONGODB_URL
    || process.env.MONGO_URI
    || process.env.DATABASE_URL
    || 'mongodb://localhost:27017/job-portal-ats';
};

const connectDB = async (retries = 5) => {
  try {
    const mongoURI = getMongoUri();

    if (!mongoURI || mongoURI.includes('your-mongodb') || mongoURI.includes('localhost:27017') && process.env.NODE_ENV === 'production') {
      console.warn('No production MongoDB URI configured. Set MONGODB_URI in Render environment variables.');
      return null;
    }

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 7000,
      socketTimeoutMS: 45000,
      autoIndex: true,
    });

    console.log('MongoDB Connected Successfully');

    mongoose.connection.on('connected', () => {
      console.log('Mongoose default connection is open');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose default connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('Mongoose default connection is disconnected');
    });

    return mongoose.connection;
  } catch (error) {
    if (retries > 0) {
      console.warn(`MongoDB connection failed. Retrying (${retries})...`);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return connectDB(retries - 1);
    }

    console.error('MongoDB Connection Failed:', error.message);
    console.warn('Continuing without database connection for now. Some routes may fail until MongoDB is available.');
    return null;
  }
};

export default connectDB;
