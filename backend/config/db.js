const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState >= 1) {
      return;
    }

    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable is not defined');
    }
    await mongoose.connect(process.env.MONGO_URI, {
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Only exit process if not in serverless environment (e.g. local dev)
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    } else {
      throw error; // Let serverless function handle/log it
    }
  }
};

module.exports = connectDB;