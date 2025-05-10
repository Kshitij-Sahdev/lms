import mongoose from 'mongoose';
import User from '../models/User';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB connection string from environment variables
const MONGODB_URI = process.env.MONGODB_URI || '';

if (!MONGODB_URI) {
  console.error('MongoDB URI is not defined in environment variables');
  process.exit(1);
}

const disable2FAForAllUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find all users with requires2FA set to true
    const users = await User.find({ requires2FA: true });
    
    console.log(`Found ${users.length} users with 2FA enabled.`);
    
    if (users.length === 0) {
      console.log('No users have 2FA enabled.');
      return;
    }
    
    // Update all users to disable 2FA
    const result = await User.updateMany(
      {}, // update all users
      { $set: { requires2FA: false } }
    );
    
    console.log(`Disabled 2FA for ${result.modifiedCount} users.`);
    console.log('Operation completed successfully.');
    
  } catch (error) {
    console.error('Error disabling 2FA:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

// Run the function
disable2FAForAllUsers(); 