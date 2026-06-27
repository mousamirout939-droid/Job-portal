import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/job-portal-ats';

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
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
  } catch (error) {
    console.error('MongoDB Connection Failed:', error.message);
    console.warn('Continuing without database connection for now. Some routes may fail until MongoDB is available.');
  }
};

export default connectDB;
