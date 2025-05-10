import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';
let mongoServer: MongoMemoryServer;

const connectDB = async (): Promise<void> => {
  try {
    let MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/knowledge_chakra';
    
    // In development mode, use the in-memory database if regular connection fails
    if (NODE_ENV === 'development') {
      try {
        // First try connecting to the configured MongoDB
        console.log(`Attempting to connect to MongoDB at: ${MONGODB_URI.replace(/:[^:]*@/, ':****@')}`);
        await mongoose.connect(MONGODB_URI, {
          serverSelectionTimeoutMS: 5000, // Quick timeout for faster fallback
        });
        console.log('MongoDB connected successfully');
      } catch (dbError) {
        console.warn('Failed to connect to MongoDB, falling back to in-memory database:', dbError);
        
        // Start MongoDB in-memory server
        mongoServer = await MongoMemoryServer.create();
        MONGODB_URI = mongoServer.getUri() + 'knowledge_chakra';
        console.log(`Starting in-memory MongoDB at: ${MONGODB_URI}`);
        
        await mongoose.connect(MONGODB_URI);
        console.log('In-memory MongoDB server connected successfully');
      }
    } else {
      // Production environment - connect to real MongoDB only
      console.log(`Connecting to MongoDB at: ${MONGODB_URI.replace(/:[^:]*@/, ':****@')}`);
      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
      });
      console.log('MongoDB connected successfully');
    }
    
    // Set up error handlers for the connection
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected successfully');
    });
    
    return;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    
    // In development mode, continue without a database connection
    if (NODE_ENV === 'development') {
      console.warn('Running in development mode without MongoDB connection. API functionality will be limited.');
    } else {
      // In production, exit the process on database connection failure
      console.error('MongoDB connection failed in production mode. Exiting process.');
      process.exit(1);
    }
  }
};

// Cleanup function to close the in-memory server when the application shuts down
export const closeDatabase = async (): Promise<void> => {
  if (mongoServer) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  }
};

export default connectDB; 