import mongoose from 'mongoose';

// Disable command buffering globally so queries fail fast when disconnected instead of timing out after 10s
mongoose.set('bufferCommands', false);

export const connectDB = async () => {
  try {
    const connStr = process.env.MONGODB_URI || 'mongodb://localhost:27017/jcb360';
    console.log(`Connecting to MongoDB at: ${connStr}`);
    
    // Attempt Mongoose connection with a 10 second timeout for cloud Atlas
    await mongoose.connect(connStr, {
      serverSelectionTimeoutMS: 10000,
      bufferCommands: false
    });
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);
  } catch (error) {
    console.warn(`MongoDB Connection Notice: ${error.message}. Running in offline/fallback mode.`);
  }
};

export default connectDB;
